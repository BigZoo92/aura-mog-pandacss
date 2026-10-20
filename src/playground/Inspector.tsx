import { useEffect, useState, type RefObject } from 'react'
import { css, cx } from '../../styled-system/css'
import type { PlayerStore } from '../animation/playback/player-store'
import type { Scene } from '../animation/timeline/scene'
import { JOINT_INFO, JOINTS, type BodyRegion, type Joint } from '../character/rig/joints'
import { MOVES } from '../choreography/moves.registry'
import type { MoveDefinition } from '../choreography/motion/move'

/**
 * INSPECT THE AURA — a read-only window into the CSS animation system.
 *
 * It does not simulate anything: it asks the browser which CSS animations are
 * running on the selected joint (`element.getAnimations()`), and reads their
 * `animationName` (= `<track>_<joint>` keyframes compiled by Panda), their
 * progress, and the joint's live computed transform properties.
 */
interface TrackReading {
  keyframes: string
  track: string
  progress: number
  iteration: number
  duration: number
}

interface JointReading {
  tracks: TrackReading[]
  rotate: string
  translate: string
  scale: string
  opacity: string
}

function readJoint(stage: HTMLElement | null, joint: Joint): JointReading | null {
  const element = stage?.querySelector<HTMLElement>(`[data-rig] [data-joint="${joint}"]`)
  if (!element) return null
  const tracks = element.getAnimations().flatMap((animation): TrackReading[] => {
    if (!('animationName' in animation)) return []
    const keyframes = String((animation as CSSAnimation).animationName)
    const timing = animation.effect?.getComputedTiming()
    return [
      {
        keyframes,
        track: keyframes.slice(0, keyframes.lastIndexOf('_')) || keyframes,
        progress: timing?.progress ?? 0,
        iteration: Number(timing?.currentIteration ?? 0),
        duration: Number(timing?.duration ?? 0),
      },
    ]
  })
  const style = getComputedStyle(element)
  return { tracks, rotate: style.rotate, translate: style.translate, scale: style.scale, opacity: style.opacity }
}

const REGIONS: BodyRegion[] = ['body', 'spine', 'arms', 'legs', 'costume', 'face', 'form', 'ghost', 'prop']

const panel = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '14px',
  bg: 'surface.panel',
  border: '3px solid token(colors.outline)',
  borderRadius: '12px',
  boxShadow: '0 0 0 2px token(colors.surface.line)',
  minWidth: '0',
})
const heading = css({ fontFamily: 'display', fontSize: '15px', color: 'aura.lime', letterSpacing: '0.04em' })
const readout = css({
  fontFamily: 'mono',
  fontSize: '12px',
  lineHeight: '1.5',
  color: 'text',
  bg: 'ink.950',
  border: '2px solid token(colors.surface.line)',
  borderRadius: '8px',
  padding: '10px',
  '& b': { color: 'aura.lime', fontWeight: '700' },
  '& em': { color: 'violet.300', fontStyle: 'normal' },
  '& small': { color: 'text.muted' },
})
const bar = css({ height: '6px', bg: 'ink.700', borderRadius: 'full', overflow: 'hidden', marginTop: '4px' })
const barFill = css({ height: '100%', bg: 'aura.lime', transformOrigin: '0 50%' })
const groups = css({ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' })
const groupLabel = css({ fontFamily: 'body', fontWeight: '700', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'text.muted' })
const chips = css({ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' })
const chip = css({
  minHeight: '30px',
  padding: '4px 8px',
  fontFamily: 'mono',
  fontSize: '11px',
  color: 'text',
  bg: 'ink.800',
  border: '1px solid token(colors.surface.line)',
  borderRadius: '6px',
  cursor: 'pointer',
  _hover: { borderColor: 'aura.lime' },
  '&[aria-pressed=true]': { bg: 'aura.lime', color: 'text.inverse', borderColor: 'outline' },
  '&[data-animated=true]::after': { content: '"●"', marginLeft: '4px', color: 'orange.400', fontSize: '8px' },
})

interface InspectorProps {
  store: PlayerStore
  scene: Scene
  stageRef: RefObject<HTMLElement | null>
  selected: Joint
  onSelect: (joint: Joint) => void
}

function animatedJoints(stage: HTMLElement | null): ReadonlySet<Joint> {
  const joints = new Set<Joint>()
  for (const joint of JOINTS) {
    const el = stage?.querySelector<HTMLElement>(`[data-rig] [data-joint="${joint}"]`)
    if (el && el.getAnimations().length) joints.add(joint)
  }
  return joints
}

export function Inspector({ store, scene, stageRef, selected, onSelect }: InspectorProps) {
  const [reading, setReading] = useState<JointReading | null>(null)
  const [animated, setAnimated] = useState<ReadonlySet<Joint>>(new Set())

  // The DOM is an external system here: read it on the next frame after a
  // scene / selection change, then ~10× per second while the clock moves.
  // The inspector — not the show — pays for these reads.
  useEffect(() => {
    let last = -1
    let frame = requestAnimationFrame(() => {
      setReading(readJoint(stageRef.current, selected))
      setAnimated(animatedJoints(stageRef.current))
    })
    const unsubscribe = store.subscribe(() => {
      const tick = Math.floor(store.getSnapshot().time / 100)
      if (tick === last) return
      last = tick
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setReading(readJoint(stageRef.current, selected)))
    })
    return () => {
      cancelAnimationFrame(frame)
      unsubscribe()
    }
  }, [store, selected, stageRef, scene.key])

  const move: MoveDefinition = MOVES[scene.segment.move]
  const local = Math.max(0, store.getSnapshot().time - scene.segment.start)
  const info = JOINT_INFO[selected]

  return (
    <aside className={panel} aria-label="Inspect the aura">
      <div className={heading}>⌕ INSPECT THE AURA</div>
      <div className={readout}>
        <div>
          <small>move</small> <b>{scene.segment.move}</b> <small>· {(local / 1000).toFixed(2)}s into the segment</small>
        </div>
        <div>
          <small>{move.summary}</small>
        </div>
      </div>
      <div className={readout} aria-live="off">
        <div>
          <b>{info.label.toUpperCase()}</b> <small>[data-joint="{selected}"]</small>
        </div>
        {reading?.tracks.length ? (
          reading.tracks.map((t) => (
            <div key={t.keyframes}>
              {info.label.toUpperCase()} — <em>{t.track}</em> — {Math.round(t.progress * 100)}%
              <small>
                {' '}
                @keyframes {t.keyframes} · {Math.round(t.duration)}ms · loop {t.iteration + 1}
              </small>
              <div className={bar}>
                <div className={barFill} style={{ scale: `${t.progress} 1` }} />
              </div>
            </div>
          ))
        ) : (
          <div>
            <small>No animation on this joint in this move — it rests at its base pose.</small>
          </div>
        )}
        {reading && (
          <div>
            <small>
              rotate: {reading.rotate} · translate: {reading.translate} · scale: {reading.scale} · opacity: {reading.opacity}
            </small>
          </div>
        )}
      </div>
      <div className={groups}>
        {REGIONS.map((region) => {
          const joints = JOINTS.filter((j) => JOINT_INFO[j].region === region)
          return (
            <div key={region}>
              <div className={groupLabel}>{region}</div>
              <div className={chips}>
                {joints.map((joint) => (
                  <button
                    key={joint}
                    type="button"
                    className={cx(chip)}
                    aria-pressed={joint === selected}
                    data-animated={animated.has(joint) ? 'true' : undefined}
                    onClick={() => onSelect(joint)}
                    title={JOINT_INFO[joint].label}
                  >
                    {joint}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
