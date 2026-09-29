/**
 * The boundary between two registers.
 *
 * Earlier versions ramped one field into the other with a gradient, then with a
 * masked photograph on top of it. Both read as a blurred grey band across the
 * page — a soft edge between a light and a dark section looks like exactly what
 * it is, and no amount of imagery on top of it fixes that.
 *
 * So the edge is crisp, and the *arrival* does the work instead: the incoming
 * section's content rises into place with parallax as the boundary crosses the
 * viewport (see `riseIn` in lib/motion). A single accent rule marks the cut.
 *
 * The section it sits in must be `relative`.
 */
export function Seam({
  side,
  accent = true,
}: {
  /** Which edge of the host section the rule is anchored to. */
  side: "top" | "bottom";
  /** The accent rule. Off for the quieter boundaries. */
  accent?: boolean;
}) {
  if (!accent) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 h-px ${
        side === "top" ? "top-0" : "bottom-0"
      }`}
    >
      <span className="block h-px w-full bg-linear-to-r from-transparent via-acid/45 to-transparent" />
    </div>
  );
}
