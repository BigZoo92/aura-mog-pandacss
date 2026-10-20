import type { CSSProperties } from 'react'
import { css, cva, cx } from '../../../styled-system/css'
import {
  ARGUMENT_LIFE,
  ARGUMENTS,
  VERDICT_AT,
  VERDICT_END,
  VERDICT_FADE,
  VERDICT_LINE_EMERGE,
  VERDICT_LINES,
  VERDICT_POSITION,
  type SmokeArgument,
  type VerdictLine,
} from './smoke.config'
import { cloudBody, lump, smokeText, timed, toneVar, verdictBody } from './smoke.styles'

type Vars = CSSProperties & Record<`--${string}`, string>

// --- Argument clouds -------------------------------------------------------------

const cloud = css({
  position: 'absolute',
  width: 'calc(var(--text-scale) * 24em)',
  height: 'calc(var(--text-scale) * 11.5em)',
  animationName: 'smokeCloudLife',
  animationTimingFunction: 'token(easings.out)',
})
const wisp = css({
  position: 'absolute',
  left: '38%',
  top: '-12%',
  width: '6em',
  height: '6em',
  borderRadius: 'full',
  border: '0.7em solid transparent',
  borderTopColor: 'smoke.light',
  borderLeftColor: 'smoke.mid',
  animationName: 'smokeWispCurl',
  animationTimingFunction: 'token(easings.out)',
})
const textBlock = css({
  position: 'absolute',
  inset: '18% 4% 6%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.35em',
  textAlign: 'center',
  animationName: 'smokeTextLife',
  animationTimingFunction: 'token(easings.out)',
})
const title = css({
  fontFamily: 'display',
  fontSize: 'calc(var(--text-scale) * 2.15em)',
  lineHeight: '0.95',
  color: 'ink.900',
  textShadow: '0.07em 0.07em 0 var(--tone), 0 0 0.5em rgba(255,250,243,0.95)',
})
const detail = css({
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: 'calc(var(--text-scale) * 1.02em)',
  lineHeight: '1.2',
  color: 'ink.800',
  maxWidth: '18em',
})

function ArgumentCloud({ argument }: { argument: SmokeArgument }) {
  const timing = { '--at': `${argument.at}ms`, '--dur': `${ARGUMENT_LIFE.total}ms` }
  return (
    <div
      className={cx(cloud, timed, toneVar({ tone: argument.tone }))}
      data-argument={argument.id}
      style={
        {
          left: `calc(var(--spread) * ${argument.x}em - var(--text-scale) * 12em)`,
          top: `calc(${argument.y}em - var(--text-scale) * 5.75em)`,
          '--from-x': `calc(var(--spread) * ${argument.fromX}em)`,
          '--from-y': `${argument.fromY}em`,
          '--drift-x': `calc(var(--spread) * ${argument.fromX * -0.12}em)`,
          '--drift-y': '-0.8em',
          ...timing,
        } as Vars
      }
    >
      <span className={cx(wisp, timed)} style={timing as Vars} />
      <div className={cloudBody} />
      <span className={lump} style={{ left: '4%', top: '-2%', width: '38%', aspectRatio: '1', '--breathe': '2100ms' } as Vars} />
      <span className={lump} style={{ left: '30%', top: '-18%', width: '44%', aspectRatio: '1', '--breathe': '2600ms', '--phase': '-700ms' } as Vars} />
      <span className={lump} style={{ left: '62%', top: '-4%', width: '36%', aspectRatio: '1', '--breathe': '2300ms', '--phase': '-1200ms' } as Vars} />
      <div className={cx(textBlock, smokeText, timed)} style={timing as Vars}>
        <span className={title}>{argument.title}</span>
        <span className={detail}>{argument.detail}</span>
      </div>
    </div>
  )
}

export function SmokeArguments() {
  return (
    <>
      {ARGUMENTS.map((argument) => (
        <ArgumentCloud key={argument.id} argument={argument} />
      ))}
    </>
  )
}

// --- The verdict -----------------------------------------------------------------

const verdict = css({
  position: 'absolute',
  width: 'min(66em, 96cqw)',
  height: 'calc(var(--text-scale) * 34em)',
  animationName: 'smokeBlowAway',
  animationTimingFunction: 'token(easings.out)',
})
const verdictCloud = css({
  position: 'absolute',
  inset: '0',
  animationName: 'smokeVerdictCloud',
  animationTimingFunction: 'token(easings.out)',
})
const verdictText = css({
  position: 'absolute',
  inset: '12% 5% 6%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'calc(var(--text-scale) * 0.5em)',
  textAlign: 'center',
})
const words = css({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.2em 0.7em' })
const line = cva({
  base: {
    animationName: 'smokeLineEmerge',
    animationTimingFunction: 'token(easings.out)',
    color: 'ink.900',
    textShadow: '0 0 0.45em rgba(255,250,243,0.95)',
  },
  variants: {
    kind: {
      question: { fontFamily: 'display', fontSize: 'calc(var(--text-scale) * 2.3em)', color: 'violet.600' },
      word: { fontFamily: 'display', fontSize: 'calc(var(--text-scale) * 1.8em)', textShadow: '0.07em 0.07em 0 token(colors.lime.400), 0 0 0.45em rgba(255,250,243,0.95)' },
      hero: {
        fontFamily: 'display',
        fontSize: 'calc(var(--text-scale) * 4.3em)',
        lineHeight: '0.92',
        textShadow: '0.06em 0.06em 0 token(colors.violet.400), 0.12em 0.12em 0 token(colors.ink.900), 0 0 0.4em rgba(255,250,243,0.9)',
      },
      burn: { fontFamily: 'impact', fontSize: 'calc(var(--text-scale) * 2.5em)', letterSpacing: '0.05em', color: 'orange.600' },
      note: { fontFamily: 'body', fontWeight: '700', fontSize: 'calc(var(--text-scale) * 0.95em)', color: 'ink.800', maxWidth: '34em' },
    },
  },
})

function Line({ value }: { value: VerdictLine }) {
  return (
    <span
      className={cx(line({ kind: value.kind }), smokeText, timed)}
      style={{ '--at': `${value.at}ms`, '--dur': `${VERDICT_LINE_EMERGE}ms` } as Vars}
    >
      {value.text}
    </span>
  )
}

export function SmokeVerdict() {
  const byKind = (kind: VerdictLine['kind']) => VERDICT_LINES.filter((l) => l.kind === kind)
  return (
    <div
      className={cx(verdict, timed)}
      style={
        {
          left: `calc(var(--spread) * ${VERDICT_POSITION.x}em - min(33em, 48cqw))`,
          top: `calc(${VERDICT_POSITION.y}em - var(--text-scale) * 17em)`,
          '--at': `${VERDICT_END}ms`,
          '--dur': `${VERDICT_FADE}ms`,
          '--away-y': '-9em',
        } as Vars
      }
    >
      <div className={cx(verdictCloud, timed)} style={{ '--at': `${VERDICT_AT}ms`, '--dur': `${VERDICT_END - VERDICT_AT}ms` } as Vars}>
        <div className={verdictBody} />
        <span className={lump} style={{ left: '-2%', top: '8%', width: '30%', aspectRatio: '1', '--breathe': '2400ms' } as Vars} />
        <span className={lump} style={{ left: '20%', top: '-10%', width: '34%', aspectRatio: '1', '--breathe': '2800ms', '--phase': '-500ms' } as Vars} />
        <span className={lump} style={{ left: '48%', top: '-14%', width: '32%', aspectRatio: '1', '--breathe': '2200ms', '--phase': '-1400ms' } as Vars} />
        <span className={lump} style={{ left: '72%', top: '4%', width: '30%', aspectRatio: '1', '--breathe': '2600ms', '--phase': '-900ms' } as Vars} />
        <span className={lump} style={{ left: '8%', top: '58%', width: '26%', aspectRatio: '1', '--breathe': '2000ms', '--phase': '-300ms' } as Vars} />
        <span className={lump} style={{ left: '70%', top: '56%', width: '28%', aspectRatio: '1', '--breathe': '2300ms', '--phase': '-1100ms' } as Vars} />
      </div>
      <div className={verdictText}>
        {byKind('question').map((l) => (
          <Line key={l.id} value={l} />
        ))}
        <div className={words}>
          {byKind('word').map((l) => (
            <Line key={l.id} value={l} />
          ))}
        </div>
        {[...byKind('hero'), ...byKind('burn'), ...byKind('note')].map((l) => (
          <Line key={l.id} value={l} />
        ))}
      </div>
    </div>
  )
}
