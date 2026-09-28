import { useState } from 'react';
import { submitFeedback } from '../lib/api';
import EducationalBanner from './EducationalBanner';

const CATEGORIES = ['General', 'Medicine Scanner', 'Health Assistant', 'Nearby Hospitals', 'My Medicines', 'Bug Report'];

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, message: '', category: 'General' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await submitFeedback(form);
      setSuccess(true);
    } catch {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#06b6d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-['DM_Serif_Display'] text-2xl text-[#f1f5f9] mb-2">Thank you!</h2>
        <p className="text-[#64748b] text-sm mb-6">Your feedback helps us improve MedAssist for everyone.</p>
        <EducationalBanner className="mb-6 text-left" />
        <button
          onClick={() => { setSuccess(false); setForm({ name: '', email: '', rating: 5, message: '', category: 'General' }); }}
          className="px-6 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] text-sm hover:text-[#f1f5f9] transition-colors"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['DM_Serif_Display'] text-3xl text-[#f1f5f9] mb-2">Feedback</h1>
        <p className="text-[#64748b] text-sm">Help us improve MedAssist by sharing your experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-[#0f172a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="bg-[#0f172a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
          />
        </div>

        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#06b6d4]/60"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
          <p className="text-xs text-[#64748b] mb-3">Overall rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setForm(f => ({ ...f, rating: n }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  n <= form.rating
                    ? 'bg-[#06b6d4] text-white'
                    : 'bg-[#1e293b] text-[#475569] hover:text-[#94a3b8]'
                }`}
              >
                {n}★
              </button>
            ))}
          </div>
        </div>

        <textarea
          required
          rows={5}
          placeholder="Share your thoughts, suggestions, or report a bug…"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="w-full resize-none bg-[#0f172a] border border-[#1e293b] text-[#f1f5f9] text-sm rounded-xl px-3 py-2.5 placeholder-[#475569] focus:outline-none focus:border-[#06b6d4]/60"
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !form.message.trim()}
          className="w-full py-3 rounded-xl bg-[#06b6d4] text-white font-semibold text-sm hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Submitting…
            </span>
          ) : 'Submit Feedback'}
        </button>
      </form>

      <EducationalBanner className="mt-6" />

      <div className="mt-6 border-t border-white/5 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#64748b]">Your recent feedback</p>
        <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#0f172a]/60 p-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#cbd5e1]">Medicine Scanner</p>
              <span className="text-[10px] text-[#475569]">2 days ago</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#64748b]">The scan was quick and the interaction warning was easy to understand.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
