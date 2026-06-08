const CircuitDivider = () => {
  return (
    <div
      aria-hidden="true"
      className="relative h-24 overflow-hidden border-y border-[var(--hopstec-teal)]/10 bg-slate-950"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 96"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 48 H180 L210 28 L240 48 H420 L450 68 L480 48 H660 L690 28 L720 48 H900 L930 68 L960 48 H1200"
          stroke="var(--hopstec-teal)"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <path
          d="M0 58 H120 L150 38 L180 58 H300 L330 78 L360 58 H540 L570 38 L600 58 H780 L810 78 L840 58 H1020 L1050 38 L1080 58 H1200"
          stroke="var(--hopstec-teal)"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        {[
          [180, 48],
          [240, 48],
          [420, 48],
          [480, 48],
          [660, 48],
          [720, 48],
          [900, 48],
          [960, 48],
          [300, 58],
          [600, 58],
          [840, 58],
          [1080, 58],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3"
            fill="var(--hopstec-teal)"
            fillOpacity={0.5}
            className="animate-pulse"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
    </div>
  );
};

export default CircuitDivider;
