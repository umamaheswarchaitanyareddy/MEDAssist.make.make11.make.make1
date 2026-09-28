import { useState } from 'react';
import { getDietPlan, DietPlan, Medicine } from '../lib/api';
import { getMedicineInfo, MedicineDetail } from '../lib/medicineData';
import MedicineDetailModal from './MedicineDetailModal';
import EducationalBanner from './EducationalBanner';

interface Props {
  medicines: Medicine[];
  onAdd: (med: Omit<Medicine, 'id' | 'takenToday'>) => void;
  onRemove: (id: string) => void;
}

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed', 'Weekly'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night', 'With food', 'Before food', 'After food'];

export default function MyMedicines({ medicines, onAdd, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Once daily', times: ['Morning'], notes: '' });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [dietError, setDietError] = useState<string | null>(null);
  const [tab, setTab] = useState<'medicines' | 'diet'>('medicines');
  const [selectedDetail, setSelectedDetail] = useState<MedicineDetail | null>(null);

  function openDetail(name: string) {
    const detail = getMedicineInfo(name);
    if (detail) setSelectedDetail(detail);
  }

  function toggleTime(t: string) {
    setForm(f => ({
      ...f,
      times: f.times.includes(t) ? f.times.filter(x => x !== t) : [...f.times, t],
    }));
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    onAdd({ name: form.name.trim(), dosage: form.dosage.trim(), frequency: form.frequency, times: form.times, notes: form.notes.trim() });
    setForm({ name: '', dosage: '', frequency: 'Once daily', times: ['Morning'], notes: '' });
    setShowForm(false);
  }

  async function handleDietPlan() {
    if (medicines.length === 0) return;
    setLoadingDiet(true);
    setDietError(null);
    setTab('diet');
    try {
      const names = medicines.map(m => m.name + (m.dosage ? ` ${m.dosage}` : ''));
      const { plan } = await getDietPlan(names);
      setDietPlan(plan);
    } catch {
      setDietError('Failed to generate diet plan. Please try again.');
    } finally {
      setLoadingDiet(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] mb-2">My Medicines</h1>
        <p className="text-[#64748b] text-sm">Track your medicines for this session and get a personalised diet plan.</p>
      </div>

      <EducationalBanner className="mb-6" />

      <div className="flex gap-1 p-1 bg-[#0f172a] rounded-xl border border-[#1e293b] mb-6">
        {(['medicines', 'diet'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-[#06b6d4] text-white' : 'text-[#64748b] hover:text-[#f1f5f9]'
            }`}
          >
            {t === 'medicines' ? 'My Medicines' : 'Diet Plan'}
          </button>
        ))}
      </div>

      {tab === 'medicines' && (
        <>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowForm(f => !f)}
              className="flex-1 py-2.5 rounded-xl border border-[#06b6d4]/40 text-[#06b6d4] text-sm font-medium hover:bg-[#06b6d4]/10 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Medicine
            </button>
            {medicines.length > 0 && (
              <button
                onClick={handleDietPlan}
                className="flex-1 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] text-sm font-medium hover:border-[#06b6d4]/40 hover:text-[#06b6d4] transition-all"
              >
                Generate Diet Plan
              </button>
            )}
          </div>

          {showForm && (
            <div className="mb-6 p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-4">
              <h3 className="text-sm font-semibold text-[#f1f5f9]">Add Medicine</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Medicine name *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="col-span-2 bg-[#050d1a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
                />
                <input
                  placeholder="Dosage (e.g. 500mg)"
                  value={form.dosage}
                  onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                  className="bg-[#050d1a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
                />
                <select
                  value={form.frequency}
                  onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                  className="bg-[#050d1a] border border-[#1e293b] text-[#94a3b8] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#06b6d4]/60"
                >
                  {FREQUENCIES.map(fr => <option key={fr}>{fr}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-[#64748b] mb-2">Schedule</p>
                <div className="flex flex-wrap gap-2">
                  {TIME_OPTIONS.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleTime(t)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        form.times.includes(t)
                          ? 'bg-[#06b6d4] border-[#06b6d4] text-white'
                          : 'bg-[#050d1a] border-[#1e293b] text-[#64748b] hover:border-[#06b6d4]/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <input
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full bg-[#050d1a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-[#1e293b] text-[#64748b] text-sm hover:text-[#f1f5f9] transition-colors">Cancel</button>
                <button onClick={handleAdd} disabled={!form.name.trim()} className="flex-1 py-2 rounded-lg bg-[#06b6d4] text-white text-sm font-medium hover:bg-[#0891b2] transition-colors disabled:opacity-40">Add</button>
              </div>
            </div>
          )}

          {medicines.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p className="text-[#64748b] text-sm">No medicines added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map(med => {
                const hasInfo = !!getMedicineInfo(med.name);
                return (
                  <div key={med.id} className="group flex items-start gap-3 p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-[#1e4060]/80 transition-all duration-150">
                    <button
                      onClick={() => openDetail(med.name)}
                      className="flex-1 min-w-0 text-left"
                      title={hasInfo ? `View ${med.name} details` : undefined}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#f1f5f9] text-sm group-hover:text-white transition-colors">{med.name}</p>
                          {med.dosage && <p className="text-[#06b6d4] text-xs mt-0.5">{med.dosage}</p>}
                          <p className="text-[#64748b] text-xs mt-0.5">{med.frequency}</p>
                        </div>
                        {hasInfo && (
                          <span className="flex-shrink-0 text-[10px] text-[#06b6d4] border border-[#06b6d4]/25 bg-[#06b6d4]/8 px-2 py-0.5 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Info
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {med.times.map(t => (
                          <span key={t} className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                      {med.notes && <p className="text-[#475569] text-xs mt-1.5 italic">{med.notes}</p>}
                    </button>
                    <button
                      onClick={() => onRemove(med.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg text-[#475569] hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Remove medicine"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <p className="text-center text-xs text-[#334155] pt-1">Tap a medicine card to view uses, side effects & sources</p>
            </div>
          )}
        </>
      )}

      {selectedDetail && (
        <MedicineDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}

      {tab === 'diet' && (
        <div>
          {loadingDiet && (
            <div className="text-center py-16">
              <svg className="w-8 h-8 animate-spin text-[#06b6d4] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="text-[#64748b] text-sm">Generating your personalised diet plan…</p>
            </div>
          )}

          {dietError && !loadingDiet && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{dietError}</div>
          )}

          {!dietPlan && !loadingDiet && medicines.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#64748b] text-sm">Add medicines first, then generate a diet plan.</p>
            </div>
          )}

          {!dietPlan && !loadingDiet && medicines.length > 0 && (
            <div className="text-center py-12">
              <p className="text-[#64748b] text-sm mb-4">Get a diet plan tailored to your {medicines.length} medicine{medicines.length > 1 ? 's' : ''}.</p>
              <button onClick={handleDietPlan} className="px-6 py-2.5 rounded-xl bg-[#06b6d4] text-white font-medium text-sm hover:bg-[#0891b2] transition-colors">Generate Diet Plan</button>
            </div>
          )}

          {dietPlan && !loadingDiet && (
            <div className="space-y-4">
              {dietPlan.general && (
                <div className="p-4 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20">
                  <p className="text-[#94a3b8] text-sm">{dietPlan.general}</p>
                </div>
              )}

              <h3 className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">Meal Recommendations</h3>
              <div className="space-y-3">
                {dietPlan.recommendations?.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-[#f1f5f9] text-sm">{r.meal}</p>
                      {r.timing && <span className="text-xs text-[#64748b]">{r.timing}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {r.foods?.map((f, j) => (
                        <span key={j} className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-md">{f}</span>
                      ))}
                    </div>
                    {r.notes && <p className="text-[#64748b] text-xs">{r.notes}</p>}
                  </div>
                ))}
              </div>

              {dietPlan.avoidFoods?.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-[#64748b] tracking-widest uppercase mt-4">Foods to Avoid</h3>
                  <div className="space-y-2">
                    {dietPlan.avoidFoods.map((f, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">×</span>
                        <div>
                          <p className="text-[#f1f5f9] text-sm font-medium">{f.food}</p>
                          <p className="text-[#64748b] text-xs mt-0.5">{f.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {dietPlan.hydration && (
                <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                  <p className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Hydration</p>
                  <p className="text-[#94a3b8] text-sm">{dietPlan.hydration}</p>
                </div>
              )}

              <button onClick={handleDietPlan} className="w-full py-2.5 mt-2 rounded-xl border border-[#1e293b] text-[#64748b] text-sm hover:text-[#06b6d4] hover:border-[#06b6d4]/40 transition-all">
                Regenerate Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
