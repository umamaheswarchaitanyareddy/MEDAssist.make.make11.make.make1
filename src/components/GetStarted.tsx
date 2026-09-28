import { useState } from 'react';

interface Props {
  onEnter: () => void;
}

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Medicine Scanner',
    desc: 'Point your camera at any medicine bottle or blister pack. Get instant AI-powered information on uses, dosage, and side effects.',
    color: 'from-[#06b6d4] to-[#0891b2]',
    glow: 'shadow-cyan-900/60',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Prescription Reader',
    desc: 'Upload a photo of your handwritten or printed prescription. We extract the medicines, dosages, and instructions automatically.',
    color: 'from-violet-400 to-violet-600',
    glow: 'shadow-violet-900/60',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: 'Health Assistant',
    desc: 'Ask anything about medications, interactions, or general health. Backed by real-time web search from trusted medical sources.',
    color: 'from-emerald-400 to-emerald-600',
    glow: 'shadow-emerald-900/60',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'My Medicines',
    desc: 'Keep a daily checklist of your medications and get a personalised diet plan tailored to your current prescriptions.',
    color: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-900/60',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Nearby Hospitals',
    desc: 'Find hospitals, clinics, and pharmacies near you instantly. Get directions and contact details in one tap.',
    color: 'from-rose-400 to-rose-600',
    glow: 'shadow-rose-900/60',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Daily Dashboard',
    desc: 'Your personal health overview — track which medicines you\'ve taken today, your streak, and what\'s coming up next.',
    color: 'from-sky-400 to-blue-500',
    glow: 'shadow-sky-900/60',
  },
];

const STEPS = [
  { num: '01', title: 'Add your medicines', body: 'Go to My Medicines and add the medications you take regularly.' },
  { num: '02', title: 'Check in daily', body: 'Open the Dashboard each day to mark off doses and stay on track.' },
  { num: '03', title: 'Scan when unsure', body: 'Use the scanner any time you pick up a new medicine or prescription.' },
];

export default function GetStarted({ onEnter }: Props) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050d1a] text-[#f1f5f9]">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06b6d4]/6 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-600/6 blur-3xl" />
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/4 blur-3xl" />

      {/* Nav bar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-4 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#0891b2] shadow-lg shadow-cyan-950/50">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="font-['DM_Serif_Display'] text-lg tracking-tight text-[#f1f5f9]">MedAssist</span>
        </div>
        <button
          onClick={onEnter}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#94a3b8] transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-[#f1f5f9]"
        >
          Skip intro
        </button>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-14 text-center md:px-10 md:pt-20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#06b6d4]/20 bg-[#06b6d4]/8 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />
          <span className="text-xs font-medium tracking-wide text-[#22d3ee]">AI-powered · Educational · Free</span>
        </div>
        <h1 className="font-['DM_Serif_Display'] text-4xl leading-tight text-[#f1f5f9] md:text-6xl md:leading-[1.08]">
          Your personal<br />
          <span className="bg-gradient-to-r from-[#22d3ee] via-[#06b6d4] to-[#0284c7] bg-clip-text text-transparent">
            medicine companion
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-[#64748b] md:text-lg">
          MedAssist helps you understand your medications, track doses, read prescriptions, and stay informed — all in one place.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onEnter}
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/50 transition-all hover:shadow-xl hover:shadow-cyan-900/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get started</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#475569]">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No account needed · No data stored
          </div>
        </div>

        {/* Stat strip */}
        <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 divide-x divide-white/5 rounded-2xl border border-white/5 bg-white/[0.025] py-4">
          {[
            { val: '6', label: 'AI features' },
            { val: '500+', label: 'Medicines in database' },
            { val: '100%', label: 'Educational use' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-0.5 px-4">
              <span className="font-['DM_Serif_Display'] text-2xl text-[#22d3ee]">{item.val}</span>
              <span className="text-[11px] text-[#475569]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 md:px-10">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#334155]">What's inside</p>
        <h2 className="mb-8 text-center font-['DM_Serif_Display'] text-2xl text-[#f1f5f9] md:text-3xl">Everything you need, in one app</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#07101f]/80 p-5 transition-all duration-200 ${
                hoveredFeature === i ? 'border-white/10 bg-[#0b1829]/90 shadow-xl' : ''
              }`}
            >
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${f.color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-15`} />
              <div className={`mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.glow}`}>
                <span className="text-white">{f.icon}</span>
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-[#e2e8f0]">{f.title}</h3>
              <p className="text-xs leading-relaxed text-[#64748b]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 md:px-10">
        <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#334155]">Getting started</p>
        <h2 className="mb-10 text-center font-['DM_Serif_Display'] text-2xl text-[#f1f5f9] md:text-3xl">Up and running in minutes</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative rounded-2xl border border-white/5 bg-[#07101f]/60 p-5">
              {i < STEPS.length - 1 && (
                <div className="absolute right-0 top-8 hidden -translate-x-1/2 md:block">
                  <svg className="w-5 h-5 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
              <span className="mb-3 block font-['DM_Serif_Display'] text-3xl text-[#06b6d4]/40">{step.num}</span>
              <h3 className="mb-1.5 text-sm font-semibold text-[#e2e8f0]">{step.title}</h3>
              <p className="text-xs leading-relaxed text-[#64748b]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="relative z-10 mx-auto max-w-2xl px-5 pb-8 md:px-10">
        <div className="rounded-2xl border border-amber-500/12 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs leading-relaxed text-amber-300/75">
              <strong className="text-amber-300/95">For educational purposes only.</strong> MedAssist does not provide medical advice, diagnosis, or treatment. Always consult a qualified doctor, pharmacist, or healthcare professional before starting, stopping, or changing any medication.
            </p>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="relative z-10 pb-16 pt-4 text-center">
        <button
          onClick={onEnter}
          className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/50 transition-all hover:shadow-xl hover:shadow-cyan-900/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          Open MedAssist
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="mt-3 text-xs text-[#334155]">No sign-up · Works entirely in your browser</p>
      </section>
    </div>
  );
}
