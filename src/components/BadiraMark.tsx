import markUrl from '@/assets/badira-mark.png'

/**
 * BADIRA brand mark.
 *
 * The approved artwork, used as supplied: the file is the logo, cropped to
 * its own bounds and resampled for delivery, and nothing here redraws or
 * recolours it. Only its height is set; the width follows the artwork.
 *
 * It is decorative wherever it appears — the wordmark beside it carries the
 * name — so it is hidden from assistive technology rather than described.
 */
export function BadiraMark({ size = 26 }: { size?: number }) {
  return (
    <img
      className="badira-mark"
      src={markUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ height: size }}
    />
  )
}
