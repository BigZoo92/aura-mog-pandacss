import type { ChapterConfig, TimelineEvent } from '../animation/timeline/timeline.types'

/** One musical beat at 120 BPM. Every dance is authored on this grid. */
export const BEAT = 500

export const beats = (count: number) => count * BEAT

/** Identity helper: type-checks a chapter config while keeping literal types. */
export const defineChapter = (chapter: ChapterConfig): ChapterConfig => chapter

/**
 * Repeat an event on a rhythm: `repeat(4, beats(2), 1000, (at, i) => ({ type: 'aura', at, amount: 67 }))`.
 * Keeps chapter files short and the scoring rhythm explicit.
 */
export function repeat(
  count: number,
  interval: number,
  start: number,
  make: (at: number, index: number) => TimelineEvent | TimelineEvent[],
): TimelineEvent[] {
  return Array.from({ length: count }, (_, index) => make(start + index * interval, index)).flat()
}

/** An aura gain with its score pop caption. */
export function auraHit(at: number, amount: number, label = `+${amount.toLocaleString('en-US')} AURA`): TimelineEvent[] {
  return [
    { type: 'aura', at, amount },
    { type: 'caption', at, duration: 1100, text: label, style: 'pop', tone: 'lime' },
  ]
}
