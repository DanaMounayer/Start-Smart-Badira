import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The nearest ancestor that scrolls, or the window.
 *
 * Chosen by how the element is styled rather than by whether it happens to
 * overflow right now: the screen mounted under this one may be short, and the
 * next one along will not be.
 */
function scrollerOf(node: HTMLElement | null): HTMLElement | Window {
  for (let el = node?.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el)
    if (overflowY === 'auto' || overflowY === 'scroll') return el
  }
  return window
}

/** Below this much remaining, the screen is close enough to its end. */
const FLOOR = 24

/**
 * A quiet hint that the screen continues below.
 *
 * Long screens give no sign that there is more under the fold, which is easy
 * to miss inside a device frame on a desktop. This watches whatever is
 * actually scrolling — the window on a phone, the device on a desktop — and
 * shows a chevron only while there is somewhere to go. Tapping it moves down
 * a screenful; ordinary scrolling is untouched.
 */
export function ScrollCue() {
  const { t } = useLanguage()
  const anchor = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLElement | Window | null>(null)
  const [more, setMore] = useState(false)
  // Which element scrolls depends on the layout: the window on a phone, the
  // device on a desktop. Crossing between them is a resize, so the binding is
  // rebuilt whenever the window changes size.
  const [generation, setGeneration] = useState(0)

  const measure = useCallback(() => {
    const target = scroller.current
    if (!target) return
    const remaining =
      target === window
        ? document.documentElement.scrollHeight -
          window.scrollY -
          window.innerHeight
        : (target as HTMLElement).scrollHeight -
          (target as HTMLElement).scrollTop -
          (target as HTMLElement).clientHeight
    setMore(remaining > FLOOR)
  }, [])

  useEffect(() => {
    const rebind = () => setGeneration((n) => n + 1)
    window.addEventListener('resize', rebind)
    return () => window.removeEventListener('resize', rebind)
  }, [])

  useEffect(() => {
    scroller.current = scrollerOf(anchor.current)
    const target = scroller.current
    measure()
    target.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    // Content can grow or shrink without anyone scrolling.
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (observer && target !== window) observer.observe(target as HTMLElement)
    if (observer && document.body) observer.observe(document.body)
    return () => {
      target.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [measure, generation])

  // A new screen is a new length. The device's own box does not change when
  // one replaces another, so nothing else would say so.
  useEffect(() => {
    const frame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(frame)
  })

  const nudge = () => {
    const target = scroller.current
    if (!target) return
    const step =
      target === window
        ? window.innerHeight * 0.8
        : (target as HTMLElement).clientHeight * 0.8
    target.scrollBy({ top: step, behavior: 'smooth' })
  }

  return (
    <div ref={anchor} className="scroll-cue" aria-hidden={!more}>
      <button
        type="button"
        className={`scroll-cue__button${more ? ' is-visible' : ''}`}
        onClick={nudge}
        tabIndex={more ? 0 : -1}
        aria-label={t('moreBelow')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
