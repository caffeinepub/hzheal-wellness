interface SimpleQRCodeProps {
  value: string;
  size?: number;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number, index: number): boolean {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x) > 0.5;
}

export default function SimpleQRCode({ value, size = 160 }: SimpleQRCodeProps) {
  const cellCount = 21;
  const cellSize = size / cellCount;
  const seed = hashCode(value);

  const cells: boolean[][] = Array.from({ length: cellCount }, (_, row) =>
    Array.from({ length: cellCount }, (_, col) => {
      const isFinderTopLeft = row < 7 && col < 7;
      const isFinderTopRight = row < 7 && col >= cellCount - 7;
      const isFinderBottomLeft = row >= cellCount - 7 && col < 7;

      if (isFinderTopLeft || isFinderTopRight || isFinderBottomLeft) {
        const r = isFinderTopLeft
          ? row
          : isFinderTopRight
            ? row
            : row - (cellCount - 7);
        const c = isFinderTopLeft
          ? col
          : isFinderTopRight
            ? col - (cellCount - 7)
            : col;
        const outerBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        return outerBorder || inner;
      }

      if (row === 6 || col === 6) {
        return (row + col) % 2 === 0;
      }

      return seededRandom(seed, row * cellCount + col);
    }),
  );

  const filledCells: Array<{ r: number; c: number }> = [];
  cells.forEach((row, ri) =>
    row.forEach((cell, ci) => {
      if (cell) filledCells.push({ r: ri, c: ci });
    }),
  );

  return (
    <svg
      role="img"
      aria-label={`QR code for address ${value}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <title>QR Code</title>
      <rect width={size} height={size} fill="white" rx="4" />
      {filledCells.map(({ r, c }) => (
        <rect
          key={`qr-${r}-${c}`}
          x={c * cellSize}
          y={r * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#0B0B0B"
        />
      ))}
    </svg>
  );
}
