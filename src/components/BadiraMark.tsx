/**
 * BADIRA brand mark.
 *
 * An almost-closed ring with an opening at the upper corner, and a detached
 * dot resting in that gap: a bud about to break, the first visible sign.
 * The ring reads as care and continuity; the break is where something new
 * appears. Abstract and geometric, so it holds at 20px and as an app icon.
 */
export function BadiraMark({
  size = 26,
  tone = 'currentColor',
}: {
  size?: number
  tone?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16.74 8.53A8.5 8.5 0 1 0 24.47 16.26"
        stroke={tone}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="22.01"
      cy="10.99" r="2.5" fill={tone} />
    </svg>
  )
}

/** The mark on its brand ground — used for the app icon and the avatar slot. */
export function BadiraBadge({ size = 32 }: { size?: number }) {
  return (
    <span
      className="badira-badge"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <BadiraMark size={size * 0.68} tone="var(--c-on-primary)" />
    </span>
  )
}
