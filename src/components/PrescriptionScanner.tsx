import { useState, useRef } from 'react';
import { analyzePrescription, toBase64, PrescriptionAnalysis } from '../lib/api';
import EducationalBanner from './EducationalBanner';
import MedicineDetailModal from './MedicineDetailModal';
import { getMedicineInfo, MedicineDetail } from '../lib/medicineData';

export default function PrescriptionScanner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<MedicineDetail | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openDetail(name: string) {
    const detail = getMedicineInfo(name);
    if (detail) setSelectedDetail(detail);
  }

  async function handleFile(file: File) {
    setResult(null);
    setError(null);
    setMimeType(file.type || 'image/jpeg');
    setPreview(URL.createObjectURL(file));
  }

  async function handleAnalyze() {
    if (!inputRef.current?.files?.[0]) return;
    setLoading(true);
    setError(null);
    try {
      const file = inputRef.current.files[0];
      const b64 = await toBase64(file);
      const { result: data } = await analyzePrescription(b64, mimeType);
      setResult(data);
    } catch {
      setError('Could not read this prescription. Please ensure the image is clear and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputRef.current.files = dt.files;
      }
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] mb-2">Prescription Scanner</h1>
        <p className="text-[#64748b] text-sm">Upload a prescription image to extract medicine details, dosage, and instructions.</p>
      </div>

      <EducationalBanner className="mb-6" />

      <div
        className="relative mb-4 rounded-2xl border-2 border-dashed border-[#1e293b] hover:border-[#06b6d4]/50 transition-colors overflow-hidden cursor-pointer"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Prescription" className="w-full max-h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/60 to-transparent" />
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0f172a] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[#f1f5f9] text-sm font-medium">Drop prescription or click to upload</p>
            <p className="text-[#475569] text-xs mt-1">JPG, PNG, WEBP, PDF accepted</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#06b6d4] text-white font-semibold text-sm hover:bg-[#0891b2] transition-colors disabled:opacity-50 mb-6"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Reading prescription...
            </span>
          ) : 'Read Prescription'}
        </button>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {!preview && !result && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Last prescription</p>
            <span className="text-[11px] text-[#475569]">May 24, 2025</span>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#0f172a]/80 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#e2e8f0]">Dr. Sarah Chen</p>
                <p className="mt-0.5 text-xs text-[#64748b]">General Medicine · City Health Clinic</p>
              </div>
              <span className="rounded-full border border-[#06b6d4]/15 bg-[#06b6d4]/5 px-2 py-1 text-[10px] font-medium text-[#22d3ee]">3 medicines</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Metformin 500 mg', 'Amlodipine 5 mg', 'Vitamin D3'].map(medicine => (
                <button
                  key={medicine}
                  onClick={() => openDetail(medicine)}
                  className="rounded-lg bg-[#1e293b] px-2.5 py-1.5 text-xs text-[#94a3b8] transition-colors hover:bg-[#06b6d4]/10 hover:text-[#22d3ee]"
                >
                  {medicine}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {result.patient?.name && (
              <InfoCard label="Patient" value={result.patient.name} sub={result.patient.age ? `Age: ${result.patient.age}` : undefined} />
            )}
            {result.doctor?.name && (
              <InfoCard label="Doctor" value={result.doctor.name} sub={result.doctor.specialization} />
            )}
            {result.patient?.date && (
              <InfoCard label="Date" value={result.patient.date} />
            )}
            {result.diagnosis && (
              <InfoCard label="Diagnosis" value={result.diagnosis} />
            )}
          </div>

          {result.medicines?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#64748b] tracking-widest uppercase mb-3">Prescribed Medicines</h3>
              <div className="space-y-2">
                {result.medicines.map((med, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          onClick={() => openDetail(med.name)}
                          className="font-semibold text-[#f1f5f9] text-sm transition-colors hover:text-[#22d3ee]"
                        >
                          {med.name}
                        </button>
                        {med.dosage && <p className="text-[#06b6d4] text-xs mt-0.5">{med.dosage}</p>}
                      </div>
                      {med.duration && (
                        <span className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md whitespace-nowrap">{med.duration}</span>
                      )}
                    </div>
                    {med.frequency && <p className="text-[#64748b] text-xs mt-1.5">Frequency: {med.frequency}</p>}
                    {med.instructions && <p className="text-[#64748b] text-xs mt-0.5">{med.instructions}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.specialInstructions && (
            <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20">
              <h3 className="text-xs font-semibold text-[#64748b] tracking-widest uppercase mb-2">Special Instructions</h3>
              <p className="text-[#94a3b8] text-sm">{result.specialInstructions}</p>
            </div>
          )}

          <p className="text-[#475569] text-xs text-center pt-1">Always verify extracted information with your original prescription.</p>
        </div>
      )}

      {selectedDetail && (
        <MedicineDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e293b]">
      <p className="text-[#64748b] text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[#f1f5f9] text-sm font-medium">{value}</p>
      {sub && <p className="text-[#64748b] text-xs mt-0.5">{sub}</p>}
    </div>
  );
}
