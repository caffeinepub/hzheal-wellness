import { useMemo } from "react";

export default function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      minOpacity: Math.random() * 0.3 + 0.1,
      maxOpacity: Math.random() * 0.5 + 0.4,
    }));
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
              "--min-opacity": star.minOpacity,
              "--max-opacity": star.maxOpacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
