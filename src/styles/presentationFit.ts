/**
 * Fits the desktop presentation device to the stage.
 *
 * The device is a fixed 402x856 — the app's 390x844 viewport plus its shell —
 * and keeps that shape at every size. When the panel is too short or too
 * narrow for it, the whole device is scaled down as one rather than being
 * squashed, which is a ratio of two lengths and therefore the one thing the
 * stylesheet cannot work out for itself.
 *
 * This touches nothing but a custom property on the stage. It reads the
 * stage's own padding, so the spacing stays owned by the stylesheet, and it
 * does nothing at all below the presentation breakpoint.
 */

const DEVICE_WIDTH = 402
const DEVICE_HEIGHT = 856
const PRESENTATION = '(min-width: 500px) and (min-height: 560px)'

export function startPresentationFit(): void {
  if (typeof window === 'undefined') return

  const stage = document.getElementById('root')
  if (!stage) return

  const query = window.matchMedia(PRESENTATION)

  const fit = () => {
    if (!query.matches) {
      stage.style.removeProperty('--device-scale')
      return
    }
    const style = getComputedStyle(stage)
    const available = {
      width:
        stage.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
      height:
        stage.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom),
    }
    // Never enlarge: past its own size the device stays 390x844 and the stage
    // simply grows around it.
    const scale = Math.min(
      1,
      available.width / DEVICE_WIDTH,
      available.height / DEVICE_HEIGHT,
    )
    stage.style.setProperty('--device-scale', String(Math.max(scale, 0).toFixed(4)))
  }

  fit()
  window.addEventListener('resize', fit)
  query.addEventListener('change', fit)
  // The panel can change size without the window doing so.
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fit).observe(stage)
}
