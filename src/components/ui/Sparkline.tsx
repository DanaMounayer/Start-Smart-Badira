/**
 * A minimal trend line. Subtle by design — it hints that history exists and
 * sends the user to the history view; it is not a chart to read values from,
 * and carries no thresholds or risk colouring.
 */
export function Sparkline({
  values,
  width = 56,
  height = 20,
}: {
  values: number[]
  width?: number
  height?: number
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = 3

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad
    const y = height - pad - ((value - min) / span) * (height - pad * 2)
    return [x, y] as const
  })

  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      style={{ direction: 'ltr' }}
    >
      <path d={d} stroke="var(--c-spark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.4" fill="var(--c-spark)" />
    </svg>
  )
}
