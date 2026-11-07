// Lightweight moon shown while the 3D scene loads, and as the fallback without WebGL.
export function CssMoon() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-start justify-center pt-[10svh] lg:items-center lg:justify-end lg:pt-0 lg:pr-[12%]">
      <div
        className="h-56 w-56 rounded-full sm:h-72 sm:w-72"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #e6e8f2 0%, #a9abb5 38%, #4a4c5a 72%, #1a1b25 100%)",
          boxShadow: "0 0 80px 10px color-mix(in srgb, var(--accent) 35%, transparent)",
        }}
      />
    </div>
  );
}
