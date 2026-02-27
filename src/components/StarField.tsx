const DOTS = [
  { top: '5%', left: '8%', size: 6, opacity: 0.5 },
  { top: '12%', left: '85%', size: 4, opacity: 0.4 },
  { top: '18%', left: '45%', size: 3, opacity: 0.35 },
  { top: '22%', left: '92%', size: 5, opacity: 0.5 },
  { top: '28%', left: '15%', size: 4, opacity: 0.4 },
  { top: '32%', left: '72%', size: 6, opacity: 0.5 },
  { top: '38%', left: '5%', size: 3, opacity: 0.35 },
  { top: '42%', left: '55%', size: 4, opacity: 0.3 },
  { top: '48%', left: '88%', size: 5, opacity: 0.45 },
  { top: '52%', left: '30%', size: 4, opacity: 0.35 },
  { top: '58%', left: '78%', size: 3, opacity: 0.4 },
  { top: '62%', left: '12%', size: 6, opacity: 0.5 },
  { top: '68%', left: '60%', size: 4, opacity: 0.35 },
  { top: '72%', left: '95%', size: 3, opacity: 0.4 },
  { top: '78%', left: '40%', size: 5, opacity: 0.45 },
  { top: '82%', left: '20%', size: 4, opacity: 0.35 },
  { top: '88%', left: '70%', size: 3, opacity: 0.4 },
  { top: '92%', left: '50%', size: 5, opacity: 0.35 },
  { top: '7%', left: '35%', size: 4, opacity: 0.4 },
  { top: '15%', left: '65%', size: 5, opacity: 0.45 },
  { top: '35%', left: '25%', size: 3, opacity: 0.35 },
  { top: '45%', left: '10%', size: 4, opacity: 0.45 },
  { top: '55%', left: '48%', size: 5, opacity: 0.4 },
  { top: '65%', left: '82%', size: 4, opacity: 0.4 },
  { top: '75%', left: '3%', size: 6, opacity: 0.5 },
  { top: '85%', left: '58%', size: 4, opacity: 0.35 },
  { top: '95%', left: '25%', size: 3, opacity: 0.3 },
];

export function StarField() {
  return (
    <>
      {DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}
    </>
  );
}
