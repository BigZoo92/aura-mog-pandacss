import type { CSSProperties } from 'react'
import { css, cva } from '../../../styled-system/css'
import type { WindowedEvent } from '../../animation/timeline/scene'
import { TONE_VAR } from './tones'

type CaptionEvent = WindowedEvent & { type: 'caption' }

/**
 * Impact typography. All sizes are container-query units of the stage, so
 * captions scale with it on every screen.
 */
const caption = cva({
  base: {
    position: 'absolute',
    pointerEvents: 'none',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    color: 'var(--tone)',
    WebkitTextStroke: '0.09em token(colors.ink.900)',
    paintOrder: 'stroke fill',
    textShadow: '0.07em 0.07em 0 token(colors.ink.900)',
    animationDuration: 'var(--dur)',
    animationFillMode: 'both',
    animationTimingFunction: 'token(easings.out)',
    translate: '-50% -50%',
    lineHeight: '0.95',
  },
  variants: {
    style: {
      pop: {
        fontFamily: 'impact',
        fontSize: 'clamp(18px, 4.6cqw, 54px)',
        letterSpacing: '0.04em',
        animationName: 'captionPop',
        translate: '0 0',
      },
      slam: {
        left: '50%',
        top: '44%',
        width: '96cqw',
        fontFamily: 'display',
        fontSize: 'clamp(34px, 12cqw, 168px)',
        animationName: 'captionSlam',
        translate: '0 0',
        marginLeft: '-48cqw',
        marginTop: '-0.5em',
        zIndex: 6,
      },
      banner: {
        left: '0',
        right: '0',
        bottom: '13%',
        translate: '0 0',
        bg: 'ink.900',
        color: 'var(--tone)',
        WebkitTextStroke: '0',
        textShadow: 'none',
        fontFamily: 'display',
        fontSize: 'clamp(15px, 3.4cqw, 44px)',
        padding: '0.4em 1em 0.35em',
        borderBlock: '0.16em solid var(--tone)',
        boxShadow: '0 0.25em 0 rgba(8,8,11,0.6)',
        animationName: 'captionBanner',
        zIndex: 6,
        _before: {
          content: '"NEW TECHNIQUE"',
          display: 'block',
          fontFamily: 'body',
          fontWeight: '700',
          fontSize: '0.36em',
          letterSpacing: '0.4em',
          color: 'cream.100',
          marginBottom: '0.3em',
        },
      },
      title: {
        left: '50%',
        top: '13%',
        fontFamily: 'display',
        fontSize: 'clamp(16px, 3.8cqw, 48px)',
        animationName: 'captionTitle',
        animationTimingFunction: 'token(easings.inOut)',
        width: '92cqw',
        zIndex: 6,
      },
      announce: {
        left: '50%',
        top: '30%',
        width: '100cqw',
        fontFamily: 'display',
        fontSize: 'clamp(18px, 5cqw, 64px)',
        bg: 'rgba(8,8,11,0.82)',
        padding: '0.3em 0',
        borderBlock: '0.12em solid var(--tone)',
        animationName: 'captionAnnounce',
        animationTimingFunction: 'linear',
        zIndex: 6,
      },
      stamp: {
        left: '50%',
        top: '40%',
        fontFamily: 'display',
        fontSize: 'clamp(28px, 9cqw, 120px)',
        border: '0.1em solid var(--tone)',
        borderRadius: '0.12em',
        padding: '0.08em 0.3em',
        bg: 'rgba(8,8,11,0.25)',
        boxShadow: '0.08em 0.08em 0 token(colors.ink.900), inset 0 0 0 0.04em token(colors.ink.900)',
        animationName: 'captionStamp',
        zIndex: 6,
      },
      aside: {
        fontFamily: 'body',
        fontWeight: '700',
        fontSize: 'clamp(12px, 2cqw, 22px)',
        WebkitTextStroke: '0',
        textShadow: '0 0.1em 0 rgba(8,8,11,0.6)',
        color: 'cream.50',
        bg: 'rgba(8,8,11,0.7)',
        padding: '0.4em 0.8em',
        borderRadius: '0.3em',
        animationName: 'captionPop',
        translate: '0 0',
      },
    },
  },
})

/** Default anchor (percent of the stage) for positioned styles. */
const DEFAULT_POSITION: Partial<Record<CaptionEvent['style'], { x: number; y: number }>> = {
  pop: { x: 66, y: 26 },
  aside: { x: 6, y: 74 },
}

const layer = css({ position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' })

export function CaptionLayer({ active }: { active: readonly WindowedEvent[] }) {
  const captions = active.filter((event): event is CaptionEvent => event.type === 'caption')
  return (
    <div className={layer} aria-hidden="true">
      {captions.map((event) => {
        const anchor = DEFAULT_POSITION[event.style]
        const x = event.x ?? anchor?.x
        const y = event.y ?? anchor?.y
        const style = {
          '--dur': `${event.duration}ms`,
          '--tone': TONE_VAR[event.tone ?? (event.style === 'banner' ? 'lime' : 'gold')],
          ...(x !== undefined && y !== undefined ? { left: `${x}%`, top: `${y}%` } : {}),
        } as CSSProperties
        return (
          <div key={event.id} data-t0={event.at} className={caption({ style: event.style })} style={style}>
            {event.text}
          </div>
        )
      })}
    </div>
  )
}
