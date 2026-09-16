import markUrl from '@/assets/badira-mark.png'
import markOnCreamUrl from '@/assets/badira-mark-on-cream.png'
import markOnPlumUrl from '@/assets/badira-mark-on-plum.png'

/**
 * BADIRA brand mark.
 *
 * The approved artwork, used as supplied: the file is the logo, cropped to
 * its own bounds and resampled for delivery, and nothing here redraws or
 * recolours it. Only its height is set; the width follows the artwork.
 *
 * `forHeader` swaps in a treatment matched to the ground behind the app bar,
 * where the mark is 32px and either end of its ribbon can fall away: the deep
 * end vanishes on the dark theme's near-black, the pale tail on the cream. Both
 * files are the same artwork with its lightness moved into a readable band —
 * each one's alpha channel is byte-identical to the master's, so the
 * silhouette, the petals and the spacing are the master's and only colour
 * differs. The app bar asks for them; the brand moment on Welcome shows the
 * master, at a size where it holds on its own.
 *
 * It is decorative wherever it appears — the wordmark beside it carries the
 * name — so it is hidden from assistive technology rather than described.
 */
export function BadiraMark({
  size = 26,
  forHeader = false,
}: {
  size?: number
  /** Use the app-bar treatments, which follow the ground behind them. */
  forHeader?: boolean
}) {
  const img = (
    <img
      className="badira-mark"
      src={forHeader ? markOnCreamUrl : markUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ height: size }}
    />
  )

  if (!forHeader) return img

  return (
    <picture>
      <source srcSet={markOnPlumUrl} media="(prefers-color-scheme: dark)" />
      {img}
    </picture>
  )
}
