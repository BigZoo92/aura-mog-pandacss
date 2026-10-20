import { css } from '../../../styled-system/css'

/**
 * Front / profile / back surfaces.
 *
 * `--facing` is a registered, inherited custom property:
 *   0   → facing the camera     (front artwork)
 *   0.5 → side-on               (profile artwork: nose out, tail out)
 *   1   → facing away           (back of the hood, "PANDA CSS" print, pom-pom tail)
 *
 * Each surface is fully visible inside its band and hidden outside it — a
 * hard switch computed in CSS (`clamp(... × 1000)`), so a turn animation only
 * has to step `--facing` through 0 → 0.5 → 1 at the right frames.
 *
 * `--look` lets the face peek over the shoulder while the body faces away.
 */
// Literal strings (not interpolated) so Panda's static extractor sees them.
export const frontSurface = css({ opacity: 'clamp(0, (0.25 - var(--facing)) * 1000, 1)' })
export const profileSurface = css({ opacity: 'clamp(0, min(var(--facing) - 0.25, 0.75 - var(--facing)) * 1000, 1)' })
export const backSurface = css({ opacity: 'clamp(0, (var(--facing) - 0.75) * 1000, 1)' })
/** The face shows from the front, or over the shoulder while looking back. */
export const faceSurface = css({ opacity: 'max(clamp(0, (0.25 - var(--facing)) * 1000, 1), var(--look))' })
/** The back of the hood hides while the face peeks over the shoulder. */
export const headBackSurface = css({ opacity: 'min(clamp(0, (var(--facing) - 0.75) * 1000, 1), calc(1 - var(--look)))' })

/** Shared outlined-shape primitive: thick cartoon ink line. */
export const inked = css({
  position: 'absolute',
  borderStyle: 'solid',
  borderColor: 'outline',
  borderWidth: 'outline',
})
