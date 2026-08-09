const GlowBackdrop = ({ className = '' }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-3xl" />
  </div>
);

export default GlowBackdrop;
