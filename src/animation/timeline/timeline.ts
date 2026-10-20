import type { CharacterForm } from '../../character/rig/rig.types'
import type { ChapterConfig, ChapterTransition, Segment, TimelineEvent } from './timeline.types'

/** Chapter transitions are just effect events at the chapter start. */
const TRANSITION_EVENTS: Record<ChapterTransition, TimelineEvent[]> = {
  cut: [],
  puff: [{ type: 'effect', at: 0, duration: 520, effect: 'smoke', y: 60 }],
  flash: [{ type: 'effect', at: 0, duration: 260, effect: 'flash', tone: 'white' }],
  swipe: [{ type: 'effect', at: 0, duration: 420, effect: 'speedLines', tone: 'lime' }],
}

/**
 * The timeline turns chapter configs (relative times) into one absolute show
 * timeline. Everything the stage displays is a pure function of a single
 * number — the show time — which is what makes seeking, replay and speed
 * changes deterministic.
 */

export interface TimedSegment extends Segment {
  index: number
  chapterIndex: number
  /** Index inside its chapter. */
  localIndex: number
  start: number
  end: number
  form: CharacterForm
}

export interface TimedChapter {
  config: ChapterConfig
  index: number
  start: number
  end: number
  duration: number
  segments: TimedSegment[]
}

export type AbsoluteEvent = TimelineEvent & { id: string; chapterIndex: number }

export interface RateWindow {
  start: number
  end: number
  rate: number
}

export interface Timeline {
  chapters: TimedChapter[]
  segments: TimedSegment[]
  /** All events with absolute `at`, sorted by time. */
  events: AbsoluteEvent[]
  /** Cinematic slow-motion windows (absolute, sorted, non-overlapping). */
  rateWindows: RateWindow[]
  duration: number
}

export const chapterDuration = (chapter: ChapterConfig) =>
  chapter.segments.reduce((total, segment) => total + segment.duration, 0)

export function buildTimeline(chapters: readonly ChapterConfig[]): Timeline {
  const timedChapters: TimedChapter[] = []
  const segments: TimedSegment[] = []
  const events: AbsoluteEvent[] = []
  let cursor = 0

  chapters.forEach((config, chapterIndex) => {
    const start = cursor
    const timedSegments: TimedSegment[] = config.segments.map((segment, localIndex) => {
      const timed: TimedSegment = {
        ...segment,
        index: segments.length + localIndex,
        chapterIndex,
        localIndex,
        start: cursor,
        end: cursor + segment.duration,
        form: segment.form ?? config.form ?? 'brainrot',
      }
      cursor += segment.duration
      return timed
    })
    segments.push(...timedSegments)
    const chapter: TimedChapter = {
      config,
      index: chapterIndex,
      start,
      end: cursor,
      duration: cursor - start,
      segments: timedSegments,
    }
    timedChapters.push(chapter)
    config.events.forEach((event, eventIndex) => {
      events.push({ ...event, at: start + event.at, id: `${config.id}:${eventIndex}`, chapterIndex })
    })
    if (chapterIndex > 0) {
      TRANSITION_EVENTS[config.transition ?? 'puff'].forEach((event, i) => {
        events.push({ ...event, at: start + event.at, id: `${config.id}:transition${i}`, chapterIndex })
      })
    }
  })

  events.sort((a, b) => a.at - b.at)

  const rateWindows = events
    .filter((event): event is AbsoluteEvent & { type: 'slowmo' } => event.type === 'slowmo')
    .map((event) => ({ start: event.at, end: event.at + event.duration, rate: event.rate }))

  return { chapters: timedChapters, segments, events, rateWindows, duration: cursor }
}

/** Largest index i such that items[i].start <= t (binary search). */
function findByStart<T extends { start: number }>(items: readonly T[], t: number): number {
  let lo = 0
  let hi = items.length - 1
  let found = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if ((items[mid] as T).start <= t) {
      found = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return found
}

export const clampTime = (timeline: Timeline, t: number) =>
  Math.min(Math.max(Number.isFinite(t) ? t : 0, 0), timeline.duration)

export interface Location {
  chapter: TimedChapter
  segment: TimedSegment
  /** Time since the chapter started. */
  chapterTime: number
  /** Time since the segment started. */
  segmentTime: number
}

/** Map a global show time to its chapter / segment and local times. */
export function locate(timeline: Timeline, time: number): Location {
  const t = clampTime(timeline, time)
  // The very end of the show belongs to the last segment, not past it.
  const probe = Math.min(t, timeline.duration - 1e-6)
  const segment = timeline.segments[findByStart(timeline.segments, probe)] as TimedSegment
  const chapter = timeline.chapters[segment.chapterIndex] as TimedChapter
  return { chapter, segment, chapterTime: t - chapter.start, segmentTime: t - segment.start }
}

export function chapterAt(timeline: Timeline, time: number): TimedChapter {
  return locate(timeline, time).chapter
}
