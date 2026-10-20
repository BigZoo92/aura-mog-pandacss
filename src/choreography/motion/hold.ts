import type { Pose } from './channels'
import type { TrackDefinition } from './track'

/**
 * A held pose ("freeze frame"). Optionally adds a tiny tremble so a dramatic
 * hold still feels alive — the cartoon equivalent of a held breath.
 */
export function hold(summary: string, pose: Pose, options: { duration?: number; tremble?: number } = {}): TrackDefinition {
  const { duration = 1000, tremble = 0 } = options
  if (!tremble) {
    return { summary, duration, iterations: 1, easing: 'linear', frames: { 0: pose, 100: pose } }
  }
  return {
    summary,
    duration,
    easing: 'linear',
    frames: {
      0: { ...pose, body: { x: 0, y: 0 } },
      25: { body: { x: tremble, y: -tremble * 0.5 } },
      50: { body: { x: -tremble, y: 0 } },
      75: { body: { x: tremble * 0.5, y: tremble * 0.5 } },
      100: { ...pose, body: { x: 0, y: 0 } },
    },
  }
}
