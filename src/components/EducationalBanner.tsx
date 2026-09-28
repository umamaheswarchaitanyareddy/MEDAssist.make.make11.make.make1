export default function EducationalBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/12 p-3.5 ${className}`}>
      <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-xs text-amber-300/75 leading-relaxed">
        <strong className="text-amber-300/95 font-semibold">Educational purposes only.</strong> All information is for general knowledge and not a substitute for professional medical advice.{' '}
        <strong className="text-amber-300/95">Always consult your doctor or pharmacist before stopping, increasing, or changing any medication.</strong>
      </p>
    </div>
  );
}
