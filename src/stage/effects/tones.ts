import type { Tone } from '../../animation/timeline/timeline.types'

/** Effect / caption tones as raw colours (fed to CSS through `--tone`). */
export const TONE_VAR: Record<Tone, string> = {
  lime: '#C8FF4D',
  violet: '#8A55FF',
  gold: '#FFE453',
  orange: '#FF743D',
  cyan: '#35D8FF',
  white: '#FFFDF6',
  pink: '#FF9EB5',
}
