export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  const letters = [
    { l: "U", cx: 12, cy: 12 },
    { l: "A", cx: 28, cy: 12 },
    { l: "A", cx: 12, cy: 28 },
    { l: "D", cx: 28, cy: 28 },
  ];
  return (
    <svg viewBox="0 0 40 40" className={className} aria-label="UAAD logo">
      {letters.map((item, i) => (
        <g key={i}>
          <circle cx={item.cx} cy={item.cy} r="9.5" fill="#ffffff" />
          <text
            x={item.cx}
            y={item.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fontWeight="700"
            fill="#121212"
            fontFamily="Wix Madefor Display, sans-serif"
          >
            {item.l}
          </text>
        </g>
      ))}
    </svg>
  );
}
