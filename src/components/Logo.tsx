/**
 * The QuantumFlies mark.
 *
 * Three petals radiating from a common centre with a thin gap between them:
 * a pointed leaf upper-left, a sail upper-right, a fan below. It reads as a
 * wing pair over a body, which is the right association for the name.
 *
 * ── THIS IS A TRACE, NOT THE ORIGINAL ────────────────────────────────────
 * These paths were redrawn from a 226×154 screenshot, so the curves are a
 * close reconstruction rather than the artwork itself. If there is a real
 * vector file, replacing the three <path> elements below with its paths is
 * the entire job — nothing else in the app knows what the mark looks like.
 *
 * ── WHY currentColor ─────────────────────────────────────────────────────
 * The mark is one colour and inherits it, so the same component works as ink
 * on paper in the nav and as cream on ink in the footer without a variant.
 * It also means a link's hover colour reaches the mark for free.
 *
 * ── WHY NO BADGE ─────────────────────────────────────────────────────────
 * The previous "QF" mark sat in a filled circle because two letters need a
 * container to look deliberate. A real mark does not, and the reference shows
 * it unenclosed, so the circle is gone.
 */

export default function Logo({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      // Decorative: the wordmark beside it carries the accessible name, so
      // announcing this too would read "QuantumFlies QuantumFlies".
      aria-hidden="true"
      focusable="false"
    >
      {/* Leaf — upper left. Two arcs meeting at a tip in the top-left corner
          and a second tip at the centre. */}
      <path d="M6.99 6.00 C8.76 5.99 19.33 5.84 23.00 6.00 C26.67 6.16 26.83 6.23 29.33 6.99 C31.84 7.75 35.97 9.37 38.52 10.72 C41.07 12.06 43.19 13.50 45.10 15.31 C47.01 17.12 49.22 19.88 50.56 22.14 C51.89 24.39 53.02 25.32 53.54 29.58 C54.05 33.84 54.30 48.83 53.91 49.81 C53.52 50.80 46.86 53.40 44.10 53.79 C41.35 54.17 37.63 53.37 34.42 52.54 C31.22 51.72 27.13 50.26 24.25 48.70 C21.37 47.14 18.40 44.76 16.30 42.74 C14.20 40.72 12.50 38.48 11.09 36.04 C9.68 33.60 8.26 30.33 7.49 27.47 C6.72 24.62 6.49 21.55 6.25 18.16 C6.00 14.77 5.93 8.27 6.00 6.99 C6.07 5.72 6.70 6.29 6.87 6.12 C7.03 5.96 5.23 6.01 6.99 6.00 Z" />

      {/* Sail — upper right. Its inner edge is concave, mirroring the leaf's
          convex flank, which is what keeps the gap an even width. */}
      <path d="M91.89 11.46 C92.00 11.49 93.86 10.92 93.88 12.21 C93.89 13.49 92.39 51.06 92.39 51.06 C92.39 51.06 84.33 49.85 79.60 49.81 C74.87 49.77 63.61 50.82 63.59 50.81 C63.57 50.80 62.44 44.26 61.23 40.13 C60.02 36.01 56.16 26.48 56.27 25.86 C56.37 25.24 62.09 21.20 64.71 19.53 C67.33 17.86 68.94 16.92 72.28 15.68 C75.62 14.45 82.04 12.62 85.19 11.96 C88.34 11.30 90.98 11.64 91.77 11.59 C92.55 11.53 91.78 11.43 91.89 11.46 Z" />

      {/* Fan — below. Convex down the left, near-straight along the bottom. */}
      <path d="M58.13 54.78 C58.13 54.78 58.76 52.42 59.74 56.02 C60.73 59.61 65.01 78.13 66.20 84.32 C67.38 90.51 66.94 93.63 66.94 93.63 C66.94 93.63 23.87 93.88 23.87 93.88 C23.87 93.88 23.17 91.63 23.50 89.16 C23.83 86.69 24.98 81.25 25.98 78.24 C26.99 75.23 28.49 72.61 29.71 70.54 C30.92 68.48 31.00 67.77 33.43 65.58 C35.86 63.38 41.49 58.28 44.97 56.76 C48.46 55.25 56.33 55.16 58.01 54.90 C59.68 54.65 58.13 54.78 58.13 54.78 Z" />
    </svg>
  );
}
