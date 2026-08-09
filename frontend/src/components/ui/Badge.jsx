const TONES = {
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  neutral: 'bg-white-smoke/10 text-white-smoke/70 border-white-smoke/15',
  accent: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const Badge = ({ children, tone = 'neutral', className = '' }) => (
  <span
    className={`inline-flex items-center px-3 py-1 text-xs font-semibold font-josefin rounded-full border ${TONES[tone] ?? TONES.neutral} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
