import { useEffect } from 'react';
import { MedicineDetail } from '../lib/medicineData';

interface Props {
  detail: MedicineDetail;
  onClose: () => void;
}

export default function MedicineDetailModal({ detail, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="medicine-detail-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#07101f] border border-[#1e293b] shadow-2xl shadow-black/70 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* drag handle on mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#334155]" />
        </div>

        {/* header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-5 py-4 bg-[#07101f]/95 backdrop-blur-sm border-b border-[#1e293b]">
          <div>
            <h2 id="medicine-detail-title" className="font-['DM_Serif_Display'] text-xl text-[#f1f5f9] leading-tight">{detail.name}</h2>
            <p className="text-[#06b6d4] text-xs mt-0.5">{detail.genericName}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md">{detail.drugClass}</span>
              {detail.brandNames.slice(0, 2).map(b => (
                <span key={b} className="text-[11px] bg-[#0f172a] text-[#475569] border border-[#1e293b] px-2 py-0.5 rounded-md">{b}</span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#1e293b] text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#334155] transition-all"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4 pb-6">
          {/* How it works */}
          <div className="p-4 rounded-xl bg-[#06b6d4]/8 border border-[#06b6d4]/15">
            <p className="text-[10px] font-semibold text-[#06b6d4] uppercase tracking-widest mb-2">How it works</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{detail.howItWorks}</p>
          </div>

          {/* Uses */}
          <DetailSection title="Uses & Indications" icon={<PillIcon />} accent="cyan">
            <ul className="space-y-2">
              {detail.uses.map((u, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#94a3b8] leading-snug">
                  <span className="text-[#06b6d4] mt-1 flex-shrink-0 text-xs">▸</span>{u}
                </li>
              ))}
            </ul>
          </DetailSection>

          {/* Common side effects */}
          <DetailSection title="Common Side Effects" icon={<WarnIcon />} accent="yellow">
            <ul className="space-y-2">
              {detail.commonSideEffects.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#94a3b8] leading-snug">
                  <span className="text-yellow-400 mt-1 flex-shrink-0 text-xs">·</span>{s}
                </li>
              ))}
            </ul>
          </DetailSection>

          {/* Serious side effects */}
          {detail.seriousSideEffects.length > 0 && (
            <DetailSection title="Serious / Rare Side Effects" icon={<AlertIcon />} accent="red">
              <ul className="space-y-2">
                {detail.seriousSideEffects.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-red-400 leading-snug">
                    <span className="mt-1 flex-shrink-0 font-bold text-xs">!</span>{s}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {/* Warnings */}
          {detail.warnings && detail.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Warnings
              </p>
              <ul className="space-y-2">
                {detail.warnings.map((w, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-red-400/90 leading-snug">
                    <span className="mt-1 flex-shrink-0 text-xs">·</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Food interactions */}
          {detail.foodInteractions && detail.foodInteractions.length > 0 && (
            <DetailSection title="Food Interactions" icon={<FoodIcon />} accent="orange">
              <ul className="space-y-2">
                {detail.foodInteractions.map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-[#94a3b8] leading-snug">
                    <span className="text-orange-400 mt-1 flex-shrink-0 text-xs">·</span>{f}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {/* Dosage notes */}
          {detail.dosageNotes && (
            <DetailSection title="Dosage Notes" icon={<ScaleIcon />} accent="purple">
              <p className="text-sm text-[#94a3b8] leading-relaxed">{detail.dosageNotes}</p>
            </DetailSection>
          )}

          {/* Drug interactions */}
          {detail.interactions.length > 0 && (
            <DetailSection title="Drug Interactions" icon={<InteractIcon />} accent="blue">
              <ul className="space-y-2">
                {detail.interactions.map((d, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-[#94a3b8] leading-snug">
                    <span className="text-blue-400 mt-1 flex-shrink-0 text-xs">·</span>{d}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {/* Sources */}
          <div>
            <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-widest mb-3">References & Sources</p>
            <div className="space-y-2">
              {detail.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-[#06b6d4]/40 hover:bg-[#06b6d4]/5 transition-all group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#94a3b8] group-hover:text-[#06b6d4] transition-colors truncate leading-tight">{s.label}</p>
                    <p className="text-xs text-[#475569] truncate mt-0.5">{s.url.replace('https://', '')}</p>
                  </div>
                  <svg className="w-4 h-4 text-[#475569] group-hover:text-[#06b6d4] flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Educational disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="flex gap-3">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                <strong className="text-amber-300">For educational purposes only.</strong> This information is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor or pharmacist before stopping, starting, or adjusting any medication dosage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title, icon, children, accent,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent: 'cyan' | 'yellow' | 'red' | 'orange' | 'purple' | 'blue';
}) {
  const iconColor: Record<string, string> = {
    cyan: 'text-[#06b6d4]',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    purple: 'text-violet-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
      <h3 className={`text-[10px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-2 ${iconColor[accent]}`}>
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}

function PillIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H6a2 2 0 00-2 2v1a2 2 0 002 2h3m0-5v5m0-5h6a2 2 0 012 2v1a2 2 0 01-2 2h-6M9 8v13m0 0H6a2 2 0 01-2-2v-1a2 2 0 012-2h3m0 5h6a2 2 0 002-2v-1a2 2 0 00-2-2H9" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 9h18m-9 12V9" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

function InteractIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}
