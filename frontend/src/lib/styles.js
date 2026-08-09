export function button({ variant = 'primary', size = 'md', className = '' } = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-josefin font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  const variants = {
    primary:
      'bg-orange-500 hover:bg-orange-600 text-white-smoke shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-ink/60 hover:bg-ink text-white-smoke border border-white-smoke/10 hover:border-orange-500/30 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-white-smoke/70 hover:text-orange-400',
    danger:
      'bg-red-500/80 hover:bg-red-500 text-white-smoke hover:scale-[1.02] active:scale-[0.98]',
  };

  return [base, sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className]
    .join(' ')
    .trim();
}

export function card({ hover = true, className = '' } = {}) {
  return [
    'bg-ink/50 rounded-2xl border border-white-smoke/8 backdrop-blur-sm',
    hover ? 'hover:border-orange-500/25 transition-colors duration-300' : '',
    className,
  ]
    .join(' ')
    .trim();
}
