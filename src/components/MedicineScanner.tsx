import { useState, useRef } from 'react';
import { analyzeMedicine, toBase64, MedicineAnalysis } from '../lib/api';
import { getMedicineInfo, MedicineDetail } from '../lib/medicineData';
import MedicineDetailModal from './MedicineDetailModal';
import EducationalBanner from './EducationalBanner';

const RECENT_SCANS = [
  {
    key: 'metformin',
    letter: 'M',
    gradient: 'from-[#164e63] to-[#0e7490]',
    name: 'Metformin 500 mg',
    sub: 'Biguanide · Oral tablet',
    time: 'Today, 8:42 AM',
    status: 'Identified',
    statusColor: 'text-emerald-300 bg-emerald-400/8 border-emerald-400/15',
  },
  {
    key: 'lisinopril',
    letter: 'L',
    gradient: 'from-[#312e81] to-[#4338ca]',
    name: 'Lisinopril 10 mg',
    sub: 'ACE Inhibitor · Oral tablet',
    time: 'Yesterday, 3:15 PM',
    status: 'Identified',
    statusColor: 'text-emerald-300 bg-emerald-400/8 border-emerald-400/15',
  },
  {
    key: 'atorvastatin',
    letter: 'A',
    gradient: 'from-[#7c2d12] to-[#b45309]',
    name: 'Atorvastatin 20 mg',
    sub: 'Statin · Oral tablet',
    time: 'Sep 26, 11:30 AM',
    status: 'Identified',
    statusColor: 'text-emerald-300 bg-emerald-400/8 border-emerald-400/15',
  },
  {
    key: 'omeprazole',
    letter: 'O',
    gradient: 'from-[#14532d] to-[#16a34a]',
    name: 'Omeprazole 20 mg',
    sub: 'Proton Pump Inhibitor · Capsule',
    time: 'Sep 25, 9:00 AM',
    status: 'Identified',
    statusColor: 'text-emerald-300 bg-emerald-400/8 border-emerald-400/15',
  },
  {
    key: 'aspirin',
    letter: 'A',
    gradient: 'from-[#4c1d95] to-[#7c3aed]',
    name: 'Aspirin 100 mg',
    sub: 'NSAID · Antiplatelet · Tablet',
    time: 'Sep 24, 7:15 AM',
    status: 'Identified',
    statusColor: 'text-emerald-300 bg-emerald-400/8 border-emerald-400/15',
  },
];

export default function MedicineScanner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<MedicineDetail | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const { result: data } = await analyzeMedicine(b64, mimeType);
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again with a clearer image.');
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

  function openScanDetail(key: string) {
    const detail = getMedicineInfo(key);
    if (detail) setSelectedDetail(detail);
  }

  function openResultDetail() {
    if (!result) return;
    const detail = getMedicineInfo(result.name);
    if (detail) setSelectedDetail(detail);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] mb-2">Medicine Scanner</h1>
        <p className="text-[#64748b] text-sm">Upload a photo of any medicine to get detailed information powered by OpenAI vision.</p>
      </div>

      <EducationalBanner className="mb-6" />

      {/* Upload zone */}
      <div
        className="relative mb-4 rounded-2xl border-2 border-dashed border-[#1e293b] hover:border-[#06b6d4]/50 transition-all duration-200 overflow-hidden cursor-pointer group"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Medicine" className="w-full max-h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/60 to-transparent" />
            <div className="absolute bottom-3 right-3">
              <span className="text-xs bg-[#050d1a]/80 border border-white/10 text-[#94a3b8] px-2 py-1 rounded-lg backdrop-blur-sm">
                Click to change
              </span>
            </div>
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] group-hover:border-[#06b6d4]/40 group-hover:bg-[#06b6d4]/5 transition-all flex items-center justify-center">
              <svg className="w-6 h-6 text-[#64748b] group-hover:text-[#06b6d4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-[#f1f5f9] text-sm font-medium">Drop image or click to upload</p>
            <p className="text-[#475569] text-xs mt-1">JPG, PNG, WEBP supported</p>
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
          className="w-full py-3 rounded-xl bg-[#06b6d4] text-white font-semibold text-sm hover:bg-[#0891b2] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing with OpenAI vision...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H6a2 2 0 00-2 2v1a2 2 0 002 2h3m0-5v5m0-5h6a2 2 0 012 2v1a2 2 0 01-2 2h-6M9 8v13m0 0H6a2 2 0 01-2-2v-1a2 2 0 012-2h3m0 5h6a2 2 0 002-2v-1a2 2 0 00-2-2H9" />
              </svg>
              Analyze Medicine
            </span>
          )}
        </button>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Recent scans list */}
      {!preview && !result && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Recent scans</p>
            <span className="text-[11px] text-[#334155] bg-[#0f172a] border border-[#1e293b] px-2 py-0.5 rounded-md">{RECENT_SCANS.length} total</span>
          </div>
          <div className="space-y-2">
            {RECENT_SCANS.map(scan => (
              <button
                key={`${scan.key}-${scan.time}`}
                onClick={() => openScanDetail(scan.key)}
                className="w-full flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0f172a]/80 p-4 text-left hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5 active:scale-[0.99] transition-all duration-150 group"
              >
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${scan.gradient} text-sm font-bold text-white shadow-lg`}>
                  {scan.letter}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#e2e8f0] group-hover:text-white transition-colors">{scan.name}</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">{scan.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${scan.statusColor}`}>
                    {scan.status}
                  </span>
                  <span className="text-[10px] text-[#334155]">{scan.time}</span>
                </div>
                <svg className="w-4 h-4 text-[#334155] group-hover:text-[#06b6d4] flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[#334155]">Tap any scan to see uses, side effects & sources</p>
        </div>
      )}

      {/* AI scan result */}
      {result && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-['DM_Serif_Display'] text-xl text-[#f1f5f9]">{result.name}</h2>
                {result.genericName && <p className="text-[#06b6d4] text-sm mt-0.5">{result.genericName}</p>}
                {result.drugClass && (
                  <span className="inline-block mt-2 text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md">{result.drugClass}</span>
                )}
              </div>
              {getMedicineInfo(result.name) && (
                <button
                  onClick={openResultDetail}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs text-[#06b6d4] border border-[#06b6d4]/30 bg-[#06b6d4]/8 px-3 py-1.5 rounded-lg hover:bg-[#06b6d4]/15 transition-all"
                >
                  Full info
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {result.uses?.length > 0 && (
            <Section title="Uses & Indications" icon="💊">
              <ul className="space-y-1.5">
                {result.uses.map((u, i) => (
                  <li key={i} className="text-[#94a3b8] text-sm flex gap-2">
                    <span className="text-[#06b6d4] mt-0.5 text-xs flex-shrink-0">▸</span>{u}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {result.dosage && (
            <Section title="Dosage" icon="⚖️">
              <p className="text-[#94a3b8] text-sm">{result.dosage}</p>
            </Section>
          )}

          {result.sideEffects?.length > 0 && (
            <Section title="Side Effects" icon="⚠️">
              <ul className="space-y-1.5">
                {result.sideEffects.map((s, i) => (
                  <li key={i} className="text-[#94a3b8] text-sm flex gap-2">
                    <span className="text-yellow-400 mt-0.5 text-xs flex-shrink-0">·</span>{s}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {result.warnings?.length > 0 && (
            <Section title="Warnings" icon="🚨" accent>
              <ul className="space-y-1.5">
                {result.warnings.map((w, i) => (
                  <li key={i} className="text-red-400 text-sm flex gap-2">
                    <span className="mt-0.5 flex-shrink-0">·</span>{w}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {result.storage && (
            <Section title="Storage" icon="🏠">
              <p className="text-[#94a3b8] text-sm">{result.storage}</p>
            </Section>
          )}

          {/* Reference sources */}
          <Section title="Reference Sources" icon="📚">
            <div className="space-y-2">
              {[
                { label: 'NIH MedlinePlus Drug Database', url: `https://medlineplus.gov/druginfo/natural/${encodeURIComponent(result.name.toLowerCase())}.html` },
                { label: 'FDA Drug Database (Drugs@FDA)', url: 'https://www.accessdata.fda.gov/scripts/cder/daf/' },
                { label: 'Mayo Clinic Drug Information', url: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(result.name)}` },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#050d1a] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-all group cursor-pointer"
                >
                  <span className="text-sm text-[#64748b] group-hover:text-[#06b6d4] flex-1 transition-colors">{s.label}</span>
                  <svg className="w-3.5 h-3.5 text-[#334155] group-hover:text-[#06b6d4] flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </Section>
        </div>
      )}

      {selectedDetail && (
        <MedicineDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}

function Section({ title, icon, children, accent }: { title: string; icon: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${accent ? 'bg-red-500/5 border-red-500/20' : 'bg-[#0f172a] border-[#1e293b]'}`}>
      <h3 className="text-[10px] font-semibold text-[#64748b] tracking-widest uppercase mb-3 flex items-center gap-2">
        <span>{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}
