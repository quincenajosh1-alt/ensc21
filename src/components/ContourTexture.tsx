export function ContourTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {/* Faint white architectural grid texture across all pages */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="obs-white-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeOpacity="0.075"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#obs-white-grid)" />
      </svg>

      {/* Top-left subtle topographic contour arcs */}
      <svg
        viewBox="0 0 600 600"
        className="absolute -top-24 -left-24 w-[420px] h-[420px] opacity-[0.14]"
        fill="none"
      >
        {[80, 130, 180, 230, 280, 330].map((r, i) => (
          <path
            key={r}
            d={`M ${20 + i * 8} ${r} Q ${r * 0.75} ${r * 0.7} ${r} ${15 + i * 6}`}
            stroke="#5EEAD4"
            strokeWidth="1"
            strokeOpacity={0.55 - i * 0.06}
          />
        ))}
      </svg>

      {/* Bottom-right subtle topographic contour arcs */}
      <svg
        viewBox="0 0 600 600"
        className="absolute -bottom-28 -right-24 w-[460px] h-[460px] opacity-[0.12]"
        fill="none"
      >
        {[90, 145, 200, 255, 310, 365].map((r, i) => (
          <path
            key={r}
            d={`M ${600 - r} ${585 - i * 8} Q ${600 - r * 0.72} ${600 - r * 0.72} ${585 - i * 6} ${600 - r}`}
            stroke="#4ADE80"
            strokeWidth="1"
            strokeOpacity={0.5 - i * 0.06}
          />
        ))}
      </svg>
    </div>
  );
}
