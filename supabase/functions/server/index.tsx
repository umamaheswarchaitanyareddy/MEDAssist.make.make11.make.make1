import { Hono } from "npm:hono@4.13.10";
import { cors } from "npm:hono@4.13.10/cors";
import { logger } from "npm:hono@4.13.10/logger";

const app = new Hono();
const ROUTE_PREFIX = "/make-server-ff2d8e1a";
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_TIMEOUT_MS = 45_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_CHAT_MESSAGES = 30;
const MAX_CHAT_MESSAGE_LENGTH = 8_000;
const MEDICAL_DISCLAIMER =
  "This information is educational only and is not a diagnosis or a substitute for professional medical advice. Consult a doctor or pharmacist before starting, stopping, or changing medication.";

type JsonRecord = Record<string, unknown>;
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

function jsonError(c: { json: (body: unknown, status: number) => Response }, error: unknown) {
  if (error instanceof ApiError) {
    return c.json({ error: error.message, code: error.code }, error.status);
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return c.json(
      { error: "The AI service timed out. Please try again.", code: "AI_TIMEOUT" },
      504,
    );
  }

  console.error("Unexpected server error:", error);
  return c.json(
    { error: "An unexpected server error occurred. Please try again.", code: "INTERNAL_ERROR" },
    500,
  );
}

async function readJson(c: { req: { json: () => Promise<unknown> } }): Promise<JsonRecord> {
  try {
    const body = await c.req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiError(400, "INVALID_REQUEST", "The request body must be a JSON object.");
    }
    return body as JsonRecord;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "INVALID_JSON", "The request body contains invalid JSON.");
  }
}

function getGeminiKey(): string {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) {
    throw new ApiError(
      503,
      "AI_NOT_CONFIGURED",
      "The AI service is not configured. Please contact support.",
    );
  }
  return key;
}

function parseGeminiText(data: JsonRecord): string {
  const candidates = data.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    const promptFeedback = data.promptFeedback as JsonRecord | undefined;
    const blockReason = promptFeedback?.blockReason;
    if (typeof blockReason === "string") {
      throw new ApiError(
        422,
        "AI_RESPONSE_BLOCKED",
        "The AI service could not process this request safely. Please try a different image or question.",
      );
    }
    throw new ApiError(502, "EMPTY_AI_RESPONSE", "The AI service returned an empty response.");
  }

  const candidate = candidates[0] as JsonRecord;
  const content = candidate.content as JsonRecord | undefined;
  const parts = content?.parts;
  if (!Array.isArray(parts)) {
    throw new ApiError(502, "EMPTY_AI_RESPONSE", "The AI service returned an empty response.");
  }

  const text = parts
    .map((part) =>
      part && typeof part === "object" && typeof (part as JsonRecord).text === "string"
        ? (part as JsonRecord).text as string
        : ""
    )
    .join("")
    .trim();

  if (!text) {
    throw new ApiError(502, "EMPTY_AI_RESPONSE", "The AI service returned an empty response.");
  }
  return text;
}

async function callGemini(body: JsonRecord): Promise<JsonRecord> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiKey(),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    },
  );

  if (!response.ok) {
    const responseBody = await response.text();
    console.error(`Gemini request failed (${response.status}):`, responseBody.slice(0, 1_000));

    if (response.status === 429) {
      throw new ApiError(
        503,
        "AI_RATE_LIMITED",
        "The AI service is temporarily busy. Please try again shortly.",
      );
    }
    if (response.status >= 500) {
      throw new ApiError(
        502,
        "AI_UNAVAILABLE",
        "The AI service is temporarily unavailable. Please try again.",
      );
    }
    throw new ApiError(502, "AI_REQUEST_FAILED", "The AI service could not process the request.");
  }

  return await response.json() as JsonRecord;
}

function cleanJsonResponse(text: string): JsonRecord {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object");
    }
    return parsed as JsonRecord;
  } catch (error) {
    console.error("Unable to parse Gemini JSON response:", error, cleaned.slice(0, 1_000));
    throw new ApiError(
      502,
      "INVALID_AI_RESPONSE",
      "The AI service returned an unreadable response. Please try again.",
    );
  }
}

function requiredString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getImage(body: JsonRecord): { image: string; mimeType: string } {
  const image = body.image;
  const mimeType = body.mimeType;

  if (typeof image !== "string" || !image.trim()) {
    throw new ApiError(400, "INVALID_IMAGE", "A base64-encoded image is required.");
  }
  if (
    typeof mimeType !== "string" ||
    !["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(mimeType)
  ) {
    throw new ApiError(
      400,
      "INVALID_IMAGE_TYPE",
      "The image must be a JPEG, PNG, WEBP, HEIC, or HEIF file.",
    );
  }

  const normalizedImage = image.replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalizedImage) || normalizedImage.length % 4 !== 0) {
    throw new ApiError(400, "INVALID_IMAGE_ENCODING", "The image is not valid base64 data.");
  }

  const approximateBytes = Math.floor(normalizedImage.length * 0.75) -
    (normalizedImage.endsWith("==") ? 2 : normalizedImage.endsWith("=") ? 1 : 0);
  if (approximateBytes > MAX_IMAGE_BYTES) {
    throw new ApiError(413, "IMAGE_TOO_LARGE", "The image must be smaller than 10 MB.");
  }

  let header: Uint8Array;
  try {
    const headerBase64 = normalizedImage.slice(0, Math.min(normalizedImage.length, 64));
    const decoded = atob(headerBase64);
    header = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
  } catch {
    throw new ApiError(400, "INVALID_IMAGE_ENCODING", "The image is not valid base64 data.");
  }

  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header[0] === 0x89 &&
    String.fromCharCode(...header.slice(1, 4)) === "PNG";
  const isWebp = String.fromCharCode(...header.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...header.slice(8, 12)) === "WEBP";
  const heifBrand = String.fromCharCode(...header.slice(8, 12));
  const isHeif = String.fromCharCode(...header.slice(4, 8)) === "ftyp" &&
    ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(heifBrand);
  const signatureMatches = mimeType === "image/jpeg"
    ? isJpeg
    : mimeType === "image/png"
    ? isPng
    : mimeType === "image/webp"
    ? isWebp
    : isHeif;

  if (!signatureMatches) {
    throw new ApiError(
      400,
      "INVALID_IMAGE_DATA",
      "The uploaded data does not match the selected image type.",
    );
  }

  return { image: normalizedImage, mimeType };
}

async function analyzeImage(image: string, mimeType: string, prompt: string): Promise<JsonRecord> {
  const data = await callGemini({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: image } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });
  return cleanJsonResponse(parseGeminiText(data));
}

app.get(`${ROUTE_PREFIX}/health`, (c) => {
  return c.json({
    status: "ok",
    function: "server",
    routes: ["chat", "analyze-medicine", "analyze-prescription"],
  });
});

app.post(`${ROUTE_PREFIX}/chat`, async (c) => {
  try {
    const body = await readJson(c);
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      throw new ApiError(400, "INVALID_MESSAGES", "At least one chat message is required.");
    }
    if (body.messages.length > MAX_CHAT_MESSAGES) {
      throw new ApiError(
        400,
        "TOO_MANY_MESSAGES",
        `A maximum of ${MAX_CHAT_MESSAGES} messages may be sent at once.`,
      );
    }

    const messages: ChatMessage[] = body.messages.map((message, index) => {
      if (!message || typeof message !== "object") {
        throw new ApiError(400, "INVALID_MESSAGES", `Message ${index + 1} is invalid.`);
      }
      const record = message as JsonRecord;
      if (
        (record.role !== "user" && record.role !== "assistant") ||
        typeof record.content !== "string" ||
        !record.content.trim()
      ) {
        throw new ApiError(
          400,
          "INVALID_MESSAGES",
          `Message ${index + 1} must have a valid role and non-empty content.`,
        );
      }
      if (record.content.length > MAX_CHAT_MESSAGE_LENGTH) {
        throw new ApiError(
          400,
          "MESSAGE_TOO_LONG",
          `Each message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.`,
        );
      }
      return { role: record.role, content: record.content.trim() };
    });

    const data = await callGemini({
      systemInstruction: {
        parts: [{
          text:
            `You are MedAssist, a careful educational health and medication assistant. Answer clearly and concisely using reliable medical information. Never diagnose, prescribe, or tell someone to start, stop, or change a medication. State uncertainty rather than guessing. For urgent warning signs or possible emergencies, advise contacting local emergency services immediately. For medication-specific decisions, advise consulting a doctor or pharmacist. End every response with this exact sentence: "${MEDICAL_DISCLAIMER}"`,
        }],
      },
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1_200,
      },
    });

    let reply = parseGeminiText(data);
    if (!reply.includes(MEDICAL_DISCLAIMER)) {
      reply = `${reply}\n\n${MEDICAL_DISCLAIMER}`;
    }
    return c.json({ reply });
  } catch (error) {
    return jsonError(c, error);
  }
});

app.post(`${ROUTE_PREFIX}/analyze-medicine`, async (c) => {
  try {
    const { image, mimeType } = getImage(await readJson(c));
    const raw = await analyzeImage(
      image,
      mimeType,
      `Analyze this medicine package, label, blister pack, or pill image for educational purposes.
Do not identify a medicine from appearance alone when a readable label, imprint, or packaging evidence is absent. Never guess. If identification is unclear, set name to "Unable to identify safely", leave unknown fields empty, and explain the uncertainty in warnings.
Return only one JSON object with exactly these fields:
{
  "name": "medicine or product name, including strength when readable",
  "genericName": "active ingredient when readable",
  "drugClass": "medicine class when confidently known",
  "uses": ["common educational uses"],
  "dosage": "strength and dosage form visible in the image; do not recommend a personal dose",
  "sideEffects": ["common side effects"],
  "warnings": ["important precautions, interactions, uncertainty, and verification advice"],
  "storage": "storage information visible or reliably standard for the identified product"
}
Distinguish package strength from patient dosing instructions. Include only information supported by readable evidence and reliable medication knowledge. Include a warning to verify the identification with a pharmacist before taking the medicine. ${MEDICAL_DISCLAIMER}`,
    );

    const result = {
      name: requiredString(raw.name, "Unable to identify safely"),
      genericName: requiredString(raw.genericName),
      drugClass: requiredString(raw.drugClass),
      uses: stringArray(raw.uses),
      dosage: requiredString(raw.dosage),
      sideEffects: stringArray(raw.sideEffects),
      warnings: stringArray(raw.warnings),
      storage: requiredString(raw.storage),
    };

    if (result.warnings.length === 0) {
      result.warnings.push("Verify this identification with a doctor or pharmacist before use.");
    }
    return c.json({ result });
  } catch (error) {
    return jsonError(c, error);
  }
});

app.post(`${ROUTE_PREFIX}/analyze-prescription`, async (c) => {
  try {
    const { image, mimeType } = getImage(await readJson(c));
    const raw = await analyzeImage(
      image,
      mimeType,
      `Transcribe the visible information in this prescription image for educational purposes.
Never infer, autocomplete, or invent illegible text. Use an empty string for an unreadable scalar field. For partially readable medicine text, preserve only readable text and include "Unclear—verify with the original prescription" in that medicine's instructions.
Return only one JSON object with exactly this structure:
{
  "patient": { "name": "", "age": "", "date": "" },
  "doctor": { "name": "", "specialization": "", "contact": "" },
  "medicines": [
    { "name": "", "dosage": "", "frequency": "", "duration": "", "instructions": "" }
  ],
  "specialInstructions": "",
  "diagnosis": ""
}
Do not provide new treatment advice. Add a reminder in specialInstructions that all extracted details must be checked against the original prescription and confirmed with a doctor or pharmacist. ${MEDICAL_DISCLAIMER}`,
    );

    const patient = raw.patient && typeof raw.patient === "object"
      ? raw.patient as JsonRecord
      : {};
    const doctor = raw.doctor && typeof raw.doctor === "object"
      ? raw.doctor as JsonRecord
      : {};
    const medicines = Array.isArray(raw.medicines)
      ? raw.medicines
        .filter((medicine): medicine is JsonRecord =>
          Boolean(medicine) && typeof medicine === "object" && !Array.isArray(medicine)
        )
        .map((medicine) => ({
          name: requiredString(medicine.name, "Unclear—verify with the original prescription"),
          dosage: requiredString(medicine.dosage),
          frequency: requiredString(medicine.frequency),
          duration: requiredString(medicine.duration),
          instructions: requiredString(medicine.instructions),
        }))
      : [];

    const verificationReminder =
      "Verify every extracted detail against the original prescription and confirm unclear information with a doctor or pharmacist.";
    const specialInstructions = requiredString(raw.specialInstructions);
    const result = {
      patient: {
        name: requiredString(patient.name),
        age: requiredString(patient.age),
        date: requiredString(patient.date),
      },
      doctor: {
        name: requiredString(doctor.name),
        specialization: requiredString(doctor.specialization),
        contact: requiredString(doctor.contact),
      },
      medicines,
      specialInstructions: specialInstructions.includes(verificationReminder)
        ? specialInstructions
        : [specialInstructions, verificationReminder].filter(Boolean).join(" "),
      diagnosis: requiredString(raw.diagnosis),
    };

    return c.json({ result });
  } catch (error) {
    return jsonError(c, error);
  }
});

app.notFound((c) =>
  c.json(
    { error: "The requested endpoint does not exist.", code: "NOT_FOUND" },
    404,
  )
);

Deno.serve(app.fetch);
