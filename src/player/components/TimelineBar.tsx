import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { css, cva } from '../../../styled-system/css'
import type { PlayerStore } from '../../animation/playback/player-store'
import type { Timeline } from '../../animation/timeline/timeline'
import type { ActId } from '../../animation/timeline/timeline.types'
import { usePlayerValue } from '../hooks/usePlayer'
import { formatClock } from '../format'


const root = css({ position: 'relative', userSelect: 'none', touchAction: 'none' })
const track = css({
  position: 'relative',
  display: 'flex',
  height: '30px',
  gap: '2px',
  cursor: 'pointer',
  borderRadius: '6px',
  outline: 'none',
  _focusVisible: { boxShadow: '0 0 0 3px token(colors.aura.lime)' },
  smDown: { height: '36px' },
})
const chapter = cva({
  base: {
    position: 'relative',
    flexBasis: '0',
    minWidth: '3px',
    bg: 'ink.700',
    border: '2px solid token(colors.ink.950)',
    borderRadius: '3px',
    overflow: 'hidden',
    transition: 'background 150ms',
    _hover: { bg: 'ink.600' },
    '&[data-active=true]': { bg: 'ink.600', borderColor: 'var(--act)' },
  },
  variants: {
    act: {
      prologue: { '--act': 'token(colors.cream.200)' },
      act1: { '--act': 'token(colors.lime.400)' },
      act2: { '--act': 'token(colors.cyan.400)' },
      act3: { '--act': 'token(colors.violet.400)' },
      act4: { '--act': 'token(colors.yellow.400)' },
      finalBoss: { '--act': 'token(colors.cyan.300)' },
      act5: { '--act': 'token(colors.blush.400)' },
    },
  },
})
const chapterFill = css({
  position: 'absolute',
  inset: '0',
  transformOrigin: '0 50%',
  scale: 'var(--p) 1',
  bg: 'var(--act)',
  opacity: 0.85,
})
const playhead = css({
  position: 'absolute',
  top: '-6px',
  bottom: '-6px',
  width: '4px',
  marginLeft: '-2px',
  left: 'var(--x)',
  bg: 'cream.50',
  border: '1px solid token(colors.ink.900)',
  borderRadius: '2px',
  boxShadow: '0 0 8px token(colors.cream.50)',
  pointerEvents: 'none',
  _after: {
    content: '""',
    position: 'absolute',
    left: '-6px',
    top: '-6px',
    width: '14px',
    height: '14px',
    borderRadius: 'full',
    bg: 'cream.50',
    border: '2px solid token(colors.ink.900)',
  },
})
const tooltip = css({
  position: 'absolute',
  bottom: 'calc(100% + 10px)',
  translate: '-50% 0',
  padding: '4px 8px',
  bg: 'ink.900',
  border: '2px solid token(colors.cream.100)',
  borderRadius: '4px',
  fontFamily: 'display',
  fontSize: '11px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 10,
})

interface Hover {
  x: number
  label: string
}

function chapterProgress(timeline: Timeline, time: number) {
  return timeline.chapters.map((c) => Math.min(1, Math.max(0, (time - c.start) / c.duration)))
}

export function TimelineBar({ store, label = 'Show timeline' }: { store: PlayerStore; label?: string }) {
  const timeline = store.timeline
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [hover, setHover] = useState<Hover | null>(null)
  // Quantised to 50 ms: smooth enough for the bar, cheap for React.
  const time = usePlayerValue(store, (state) => Math.round(state.time / 50) * 50)
  const progress = chapterProgress(timeline, time)
  const activeIndex = progress.findIndex((p) => p < 1)
  const current = activeIndex === -1 ? timeline.chapters.length - 1 : activeIndex

  const timeAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * timeline.duration
  }
  const chapterLabelAt = (t: number) => {
    const c = timeline.chapters.find((ch) => t >= ch.start && t < ch.end) ?? timeline.chapters.at(-1)
    return c ? `${c.config.title} · ${formatClock(t)}` : formatClock(t)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    store.seek(timeAt(event.clientX))
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const t = timeAt(event.clientX)
    const rect = trackRef.current?.getBoundingClientRect()
    if (rect) setHover({ x: event.clientX - rect.left, label: chapterLabelAt(t) })
    if (dragging.current) store.seek(t)
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 1000 : 5000
    const handled = (() => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          store.seekBy(-step)
          return true
        case 'ArrowRight':
        case 'ArrowUp':
          store.seekBy(step)
          return true
        case 'PageUp':
          store.prevChapter()
          return true
        case 'PageDown':
          store.nextChapter()
          return true
        case 'Home':
          store.seek(0)
          return true
        case 'End':
          store.seek(timeline.duration)
          return true
        case ' ':
          store.toggle()
          return true
        default:
          return false
      }
    })()
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const currentChapter = timeline.chapters[current]
  return (
    <div className={root}>
      <div
        ref={trackRef}
        className={track}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(timeline.duration / 1000)}
        aria-valuenow={Math.round(time / 1000)}
        aria-valuetext={`${formatClock(time)} of ${formatClock(timeline.duration)} — ${currentChapter?.config.title ?? ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
      >
        {timeline.chapters.map((c, i) => (
          <div
            key={c.config.id}
            className={chapter({ act: c.config.act as ActId })}
            style={{ flexGrow: c.duration }}
            data-active={i === current ? 'true' : undefined}
            title={c.config.title}
          >
            <div className={chapterFill} style={{ '--p': progress[i] } as CSSProperties} />
          </div>
        ))}
        <div className={playhead} style={{ '--x': `${(time / timeline.duration) * 100}%` } as CSSProperties} />
      </div>
      {hover && (
        <div className={tooltip} style={{ left: hover.x }} aria-hidden="true">
          {hover.label}
        </div>
      )}
    </div>
  )
}
