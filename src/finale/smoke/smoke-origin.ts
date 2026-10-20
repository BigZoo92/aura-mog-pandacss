import type { Timeline } from '../../animation/timeline/timeline'

/** Show time at which the smoke origin ("finalPuff" chapter) starts, or null if absent. */
export function smokeOrigin(timeline: Timeline): number | null {
  return timeline.chapters.find((c) => c.config.id === 'finalPuff')?.start ?? null
}
