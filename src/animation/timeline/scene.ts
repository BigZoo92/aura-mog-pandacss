import type { CharacterForm } from '../../character/rig/rig.types'
import { locate, type AbsoluteEvent, type TimedChapter, type TimedSegment, type Timeline } from './timeline'
import type { CameraLayer, CameraShot } from './timeline.types'

/**
 * A Scene is everything the stage needs to render at a given show time,
 * EXCEPT continuous values (aura counter, progress bar) which HUD widgets
 * read directly. React re-renders the stage only when `scene.key` changes —
 * a few times per second at most, never every frame.
 */

/** Events that exist on stage for a window of time. */
export type WindowedEvent = Extract<
  AbsoluteEvent,
  { type: 'caption' | 'effect' | 'camera' | 'chad' | 'projectile' }
>

export interface Scene {
  key: string
  chapter: TimedChapter
  segment: TimedSegment
  form: CharacterForm
  /** Show time at which the current form became active (origin of its reveal animation). */
  formSince: number
  formEntrance: 'animated' | 'instant'
  /** Windowed events currently on stage. */
  active: WindowedEvent[]
  camera: Partial<Record<CameraLayer, WindowedEvent & { type: 'camera' }>>
}

const CAMERA_LAYER: Record<CameraShot, CameraLayer> = {
  punchIn: 'framing',
  pushFace: 'framing',
  zoomOut: 'framing',
  dutch: 'framing',
  heroLow: 'framing',
  shake: 'motion',
  rumble: 'motion',
  recoil: 'motion',
  spin: 'motion',
}

const isWindowed = (event: AbsoluteEvent): event is WindowedEvent =>
  'duration' in event && event.type !== 'slowmo'

export function activeEventsAt(timeline: Timeline, t: number): WindowedEvent[] {
  const active: WindowedEvent[] = []
  for (const event of timeline.events) {
    if (event.at > t) break
    if (isWindowed(event) && t < event.at + event.duration) active.push(event)
  }
  return active
}

/** When did the segment's form start (walking back over contiguous segments with the same form)? */
function formStart(timeline: Timeline, segment: TimedSegment): number {
  let start = segment.start
  for (let i = segment.index - 1; i >= 0; i--) {
    const previous = timeline.segments[i] as TimedSegment
    if (previous.form !== segment.form) break
    start = previous.start
  }
  return start
}

export function sceneAt(timeline: Timeline, t: number): Scene {
  const { chapter, segment } = locate(timeline, t)
  const active = activeEventsAt(timeline, t)

  let form = segment.form
  let formSince = formStart(timeline, segment)
  let formEntrance = segment.formEntrance ?? 'animated'
  const flash = active.find((event) => event.type === 'chad')
  if (flash && form !== 'gigaPandaChad') {
    form = 'gigaPandaChad'
    formSince = flash.at
    formEntrance = 'animated'
  }

  const camera: Scene['camera'] = {}
  for (const event of active) {
    if (event.type === 'camera') camera[CAMERA_LAYER[event.shot]] = event
  }

  const key = [
    segment.index,
    form,
    formSince,
    active
      .filter((event) => event.type !== 'chad')
      .map((event) => event.id)
      .join(','),
  ].join('|')

  return { key, chapter, segment, form, formSince, formEntrance, active, camera }
}
