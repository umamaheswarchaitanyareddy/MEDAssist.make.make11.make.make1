import { useState } from 'react';
import { Medicine } from '../lib/api';
import { getMedicineInfo, MedicineDetail } from '../lib/medicineData';
import MedicineDetailModal from './MedicineDetailModal';
import EducationalBanner from './EducationalBanner';

interface Props {
  medicines: Medicine[];
  onToggleTaken: (id: string) => void;
}

export default function Dashboard({ medicines, onToggleTaken }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<MedicineDetail | null>(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const taken = medicines.filter(m => m.takenToday).length;
  const total = medicines.length;
  const nextMedicine = medicines.find(m => !m.takenToday);
  const progress = total > 0 ? Math.round((taken / total) * 100) : 0;

  function openDetail(name: string) {
    const detail = getMedicineInfo(name);
    if (detail) setSelectedDetail(detail);
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-5 md:p-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#475569]">{today}</p>
          <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] md:text-4xl">Good morning, Alex</h1>
          <p className="mt-2 text-sm text-[#64748b]">Here’s your health plan for today.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Health plan on track
        </div>
      </div>

      {total > 0 && (
        <div className="mb-7 grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-[#06b6d4]/20 bg-gradient-to-br from-[#0e2638] to-[#0b1626] p-5">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#06b6d4]/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Daily progress</p>
                <p className="mt-2 text-3xl font-semibold text-[#f1f5f9]">{progress}%</p>
                <p className="mt-1 text-xs text-[#64748b]">{taken} of {total} medicines completed</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#1e293b] text-sm font-semibold text-[#22d3ee] shadow-[inset_0_0_0_2px_#0b1626]">
                {taken}/{total}
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#1e293b]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0891b2] to-[#22d3ee] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#0f172a]/80 p-4">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-[#64748b]">Next dose</p>
            <p className="mt-1 text-sm font-semibold text-[#e2e8f0]">{nextMedicine?.name ?? 'All done'}</p>
            <p className="mt-0.5 text-xs text-[#475569]">{nextMedicine?.times[0] ?? 'No more doses today'}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#0f172a]/80 p-4">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs text-[#64748b]">Current streak</p>
            <p className="mt-1 text-sm font-semibold text-[#e2e8f0]">6 days</p>
            <p className="mt-0.5 text-xs text-[#475569]">Personal best: 12 days</p>
          </div>
        </div>
      )}

      <div className="mb-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Today's Medicines</h2>
          <span className="text-xs text-[#475569]">{total} scheduled</span>
        </div>
        {medicines.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
              <svg className="w-7 h-7 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[#64748b] text-sm">No medicines added yet.</p>
            <p className="text-[#475569] text-xs mt-1">Add medicines in the My Medicines tab.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medicines.map(med => (
              <div
                key={med.id}
                className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  med.takenToday
                    ? 'bg-[#0a1628]/70 border-white/5 opacity-60'
                    : 'bg-[#0f172a]/90 border-[#1e293b] hover:-translate-y-0.5 hover:border-[#06b6d4]/40 hover:shadow-lg hover:shadow-cyan-950/10'
                }`}
              >
                <button
                  onClick={() => onToggleTaken(med.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    med.takenToday
                      ? 'bg-[#06b6d4] border-[#06b6d4]'
                      : 'border-[#334155] hover:border-[#06b6d4]'
                  }`}
                  aria-label={med.takenToday ? 'Mark as not taken' : 'Mark as taken'}
                >
                  {med.takenToday && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => openDetail(med.name)}
                  title={`View ${med.name} info`}
                >
                  <p className={`font-medium text-sm ${med.takenToday ? 'line-through text-[#475569]' : 'text-[#f1f5f9]'}`}>
                    {med.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748b]">{med.dosage} · {med.frequency}</p>
                  {med.notes && <p className="mt-1 text-[11px] text-[#475569]">{med.notes}</p>}
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1.5">
                    {med.times.map(t => (
                      <span key={t} className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md font-mono">{t}</span>
                    ))}
                  </div>
                  {getMedicineInfo(med.name) && (
                    <button
                      onClick={() => openDetail(med.name)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full bg-[#1e293b] text-[#64748b] hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all"
                      title="View medicine info"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-[#334155] pt-1">Tap a medicine name to view uses, side effects & sources</p>
          </div>
        )}
      </div>

      {medicines.length > 0 && taken === total && (
        <div className="mt-6 p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-center">
          <p className="text-[#22d3ee] text-sm font-medium">All medicines taken for today!</p>
        </div>
      )}

      <EducationalBanner className="mt-6" />

      {selectedDetail && (
        <MedicineDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}
