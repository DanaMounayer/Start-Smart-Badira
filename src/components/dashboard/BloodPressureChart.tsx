import { useId, useState } from 'react'
import type { BloodPressureReading } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatAxisDate, formatDate } from '@/lib/format'

/**
 * Blood pressure over time.
 *
 * Deliberately neutral: readings are drawn in the series colours only, with no
 * thresholds, target bands or risk colouring. Interpreting these values is the
 * assessment layer's job, not this chart's.
 *
 * The plot is locked to LTR in both languages (see `.chart__svg`) so time
 * always runs left to right, the convention for clinical trend charts. The
 * legend, readout and table around it follow the page direction, and axis
 * labels are numeric so bidi cannot re-order them.
 */

const VIEW = { width: 320, height: 150 }
const PLOT = { left: 34, right: 268, top: 14, bottom: 106 }
const SERIES = {
  systolic: 'var(--c-series-1)',
  diastolic: 'var(--c-series-2)',
}

/** Round a domain outward to a tidy step so gridlines land on round numbers. */
const niceDomain = (values: number[], step = 10): [number, number] => {
  const lo = Math.floor((Math.min(...values) - 6) / step) * step
  const hi = Math.ceil((Math.max(...values) + 6) / step) * step
  return [lo, hi]
}

export function BloodPressureChart({
  readings,
}: {
  readings: BloodPressureReading[]
}) {
  const { t, language } = useLanguage()
  const [active, setActive] = useState<number | null>(null)
  const titleId = useId()

  const [min, max] = niceDomain(
    readings.flatMap((r) => [r.systolic, r.diastolic]),
  )

  const x = (index: number) =>
    readings.length === 1
      ? (PLOT.left + PLOT.right) / 2
      : PLOT.left + (index / (readings.length - 1)) * (PLOT.right - PLOT.left)

  const y = (value: number) =>
    PLOT.bottom - ((value - min) / (max - min)) * (PLOT.bottom - PLOT.top)

  const path = (key: 'systolic' | 'diastolic') =>
    readings.map((r, i) => `${i ? 'L' : 'M'}${x(i)},${y(r[key])}`).join(' ')

  const ticks = [min, (min + max) / 2, max]
  const last = readings.length - 1
  const shown = active ?? last

  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        width="100%"
        role="img"
        aria-labelledby={titleId}
        className="chart__svg"
      >
        <title id={titleId}>{t('chartTitle')}</title>

        {ticks.map((value) => (
          <g key={value}>
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={y(value)}
              y2={y(value)}
              className="chart__grid"
            />
            <text x={PLOT.left - 8} y={y(value) + 4} className="chart__tick">
              {Math.round(value)}
            </text>
          </g>
        ))}

        {(['systolic', 'diastolic'] as const).map((key) => (
          <path
            key={key}
            d={path(key)}
            fill="none"
            stroke={SERIES[key]}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Direct labels on the most recent reading — identity without a lookup. */}
        {(['systolic', 'diastolic'] as const).map((key) => (
          <text
            key={key}
            x={x(last) + 10}
            y={y(readings[last][key]) + 4}
            className="chart__direct-label"
            fill={SERIES[key]}
          >
            {readings[last][key]}
          </text>
        ))}

        {readings.map((reading, i) => (
          <g key={reading.id}>
            {i === shown && (
              <line
                x1={x(i)}
                x2={x(i)}
                y1={PLOT.top}
                y2={PLOT.bottom}
                className="chart__crosshair"
              />
            )}
            {(['systolic', 'diastolic'] as const).map((key) => (
              <circle
                key={key}
                cx={x(i)}
                cy={y(reading[key])}
                r={i === shown ? 5.5 : 4}
                fill={SERIES[key]}
                stroke="var(--c-surface)"
                strokeWidth={2}
              />
            ))}
            <text x={x(i)} y={PLOT.bottom + 20} className="chart__tick chart__tick--x">
              {formatAxisDate(reading.recordedAt)}
            </text>
            {/* Hit area is wider than the marks, per interaction guidance. */}
            <rect
              x={x(i) - 22}
              y={PLOT.top}
              width={44}
              height={PLOT.bottom - PLOT.top}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${formatDate(reading.recordedAt, language)}: ${reading.systolic}/${reading.diastolic} ${t('mmhg')}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
          </g>
        ))}
      </svg>

      <div className="chart__legend">
        <span className="chart__legend-item">
          <i style={{ background: SERIES.systolic }} />
          {t('systolic')}
        </span>
        <span className="chart__legend-item">
          <i style={{ background: SERIES.diastolic }} />
          {t('diastolic')}
        </span>
        <span className="chart__readout">
          {formatDate(readings[shown].recordedAt, language)} ·{' '}
          {readings[shown].systolic}/{readings[shown].diastolic} {t('mmhg')}
        </span>
      </div>

      <details className="chart__table">
        <summary>{t('chartTableView')}</summary>
        <table>
          <thead>
            <tr>
              <th>{t('chartDate')}</th>
              <th>{t('systolic')}</th>
              <th>{t('diastolic')}</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td>{formatDate(reading.recordedAt, language)}</td>
                <td>{reading.systolic}</td>
                <td>{reading.diastolic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
