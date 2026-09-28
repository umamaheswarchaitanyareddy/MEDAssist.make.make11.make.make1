import { useState } from 'react';
import GetStarted from './components/GetStarted';
import Dashboard from './components/Dashboard';
import MedicineScanner from './components/MedicineScanner';
import PrescriptionScanner from './components/PrescriptionScanner';
import HealthAssistant from './components/HealthAssistant';
import NearbyHospitals from './components/NearbyHospitals';
import MyMedicines from './components/MyMedicines';
import Feedback from './components/Feedback';
import { Medicine } from './lib/api';

type Tab = 'dashboard' | 'scan' | 'prescription' | 'assistant' | 'hospitals' | 'medicines' | 'feedback';

const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: 'metformin-500',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    times: ['8:00 AM', '8:00 PM'],
    notes: 'Take with food',
    takenToday: true,
  },
  {
    id: 'amlodipine-5',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once daily',
    times: ['9:00 AM'],
    notes: 'Take at the same time each day',
    takenToday: true,
  },
  {
    id: 'vitamin-d3',
    name: 'Vitamin D3',
    dosage: '1,000 IU',
    frequency: 'Once daily',
    times: ['1:00 PM'],
    notes: 'Take after lunch',
    takenToday: false,
  },
];

const NAV: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Today',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'scan',
    label: 'Scan',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'prescription',
    label: 'Rx',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'assistant',
    label: 'Assistant',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: 'hospitals',
    label: 'Hospitals',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'medicines',
    label: 'Medicines',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: active => (
      <svg className={`w-5 h-5 ${active ? 'text-[#06b6d4]' : 'text-[#475569]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>(SAMPLE_MEDICINES);

  if (!started) {
    return <GetStarted onEnter={() => setStarted(true)} />;
  }

  function addMedicine(med: Omit<Medicine, 'id' | 'takenToday'>) {
    setMedicines(prev => [...prev, { ...med, id: crypto.randomUUID(), takenToday: false }]);
  }

  function removeMedicine(id: string) {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }

  function toggleTaken(id: string) {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, takenToday: !m.takenToday } : m));
  }

  const isAssistant = tab === 'assistant';

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#050d1a] text-[#f1f5f9]">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-[#06b6d4]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      {/* Sidebar — desktop */}
      <aside className="relative z-10 hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#07101f]/90 backdrop-blur-xl md:flex">
        <div className="px-5 pb-5 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#0891b2] shadow-lg shadow-cyan-950/40">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-['DM_Serif_Display'] text-base text-[#f1f5f9] leading-tight">MedAssist</p>
              <p className="text-[#475569] text-xs">AI Health Companion</p>
            </div>
          </div>
        </div>
        <p className="px-5 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#334155]">Workspace</p>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? 'bg-gradient-to-r from-[#06b6d4]/15 to-transparent text-[#22d3ee] shadow-[inset_3px_0_0_#06b6d4]'
                  : 'text-[#64748b] hover:text-[#f1f5f9] hover:bg-white/[0.03]'
              }`}
            >
              {item.icon(tab === item.id)}
              {item.label}
              {item.id === 'medicines' && medicines.length > 0 && (
                <span className="ml-auto text-xs bg-[#06b6d4] text-white px-1.5 py-0.5 rounded-md">{medicines.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="m-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e293b] text-xs font-semibold text-[#94a3b8]">AM</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#cbd5e1]">Alex Morgan</p>
              <p className="text-[11px] text-[#475569]">Personal health space</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400" title="Online" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`relative z-10 flex flex-1 flex-col overflow-hidden ${isAssistant ? '' : ''}`}>
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#07101f]/80 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#06b6d4] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-['DM_Serif_Display'] text-lg text-[#f1f5f9]">MedAssist</span>
          </div>
          {medicines.length > 0 && (
            <span className="text-xs bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 px-2 py-0.5 rounded-full">
              {medicines.length} medicine{medicines.length > 1 ? 's' : ''}
            </span>
          )}
        </header>

        {/* Content area */}
        <div className={`flex-1 overflow-y-auto ${isAssistant ? 'flex flex-col' : ''}`}>
          {tab === 'dashboard' && <Dashboard medicines={medicines} onToggleTaken={toggleTaken} />}
          {tab === 'scan' && <MedicineScanner />}
          {tab === 'prescription' && <PrescriptionScanner />}
          {tab === 'assistant' && <HealthAssistant />}
          {tab === 'hospitals' && <NearbyHospitals />}
          {tab === 'medicines' && <MyMedicines medicines={medicines} onAdd={addMedicine} onRemove={removeMedicine} />}
          {tab === 'feedback' && <Feedback />}
        </div>

        {/* Bottom nav — mobile */}
        <nav className="md:hidden flex border-t border-[#1e293b] bg-[#050d1a] flex-shrink-0">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors relative ${
                tab === item.id ? 'text-[#06b6d4]' : 'text-[#475569]'
              }`}
            >
              {item.icon(tab === item.id)}
              {item.label}
              {item.id === 'medicines' && medicines.length > 0 && (
                <span className="absolute top-1.5 right-1/2 translate-x-3 w-4 h-4 text-[9px] bg-[#06b6d4] text-white rounded-full flex items-center justify-center">
                  {medicines.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
