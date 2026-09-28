import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-ff2d8e1a`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const errorBody = await res.json() as { error?: unknown };
      if (typeof errorBody.error === 'string' && errorBody.error) message = errorBody.error;
    } catch {
      // Preserve the status-based fallback when the server does not return JSON.
    }
    throw new Error(message);
  }
  return res.json();
}

export async function analyzeMedicine(imageBase64: string, mimeType: string) {
  return post<{ result: MedicineAnalysis }>('/analyze-medicine', { image: imageBase64, mimeType });
}

export async function analyzePrescription(imageBase64: string, mimeType: string) {
  return post<{ result: PrescriptionAnalysis }>('/analyze-prescription', { image: imageBase64, mimeType });
}

export async function sendChat(messages: ChatMessage[]) {
  return post<{ reply: string }>('/chat', { messages });
}

export async function getDietPlan(medicines: string[]) {
  return post<{ plan: DietPlan }>('/diet-plan', { medicines });
}

export async function submitFeedback(data: FeedbackData) {
  return post<{ success: boolean; id: string }>('/feedback', data);
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface MedicineAnalysis {
  name: string;
  genericName: string;
  drugClass: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  storage: string;
}

export interface PrescriptionAnalysis {
  patient: { name: string; age: string; date: string };
  doctor: { name: string; specialization: string; contact: string };
  medicines: { name: string; dosage: string; frequency: string; duration: string; instructions: string }[];
  specialInstructions: string;
  diagnosis: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DietPlan {
  recommendations: { meal: string; foods: string[]; timing: string; notes: string }[];
  avoidFoods: { food: string; reason: string }[];
  hydration: string;
  general: string;
}

export interface FeedbackData {
  name: string;
  email: string;
  rating: number;
  message: string;
  category: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes: string;
  takenToday: boolean;
}
