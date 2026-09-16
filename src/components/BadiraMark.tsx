import markUrl from '@/assets/badira-mark.png'
import markLightUrl from '@/assets/badira-mark-light.png'

/**
 * BADIRA brand mark.
 *
 * The approved artwork, used as supplied: the file is the logo, cropped to
 * its own bounds and resampled for delivery, and nothing here redraws or
 * recolours it. Only its height is set; the width follows the artwork.
 *
 * `lightOnDark` offers a second file for dark mode, where the deep plum end
 * of the ribbon falls to within a hair of the background. It is the same
 * artwork with its lightness lifted — the alpha channel is byte-identical to
 * the master, so the silhouette, the petals and the spacing are the master's.
 * The app bar asks for it; the brand moment on Welcome does not.
 *
 * It is decorative wherever it appears — the wordmark beside it carries the
 * name — so it is hidden from assistive technology rather than described.
 */
export function BadiraMark({
  size = 26,
  lightOnDark = false,
}: {
  size?: number
  /** Swap to the lighter treatment when the ground is dark. */
  lightOnDark?: boolean
}) {
  const img = (
    <img
      className="badira-mark"
      src={markUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ height: size }}
    />
  )

  if (!lightOnDark) return img

  return (
    <picture>
      <source srcSet={markLightUrl} media="(prefers-color-scheme: dark)" />
      {img}
    </picture>
  )
}
