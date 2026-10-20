import { css } from '../../../styled-system/css'
import { SmokeMasses, SmokeStream } from './SmokeBillows'
import { SmokeArguments, SmokeVerdict } from './SmokeReveal'
import { currentArgumentAt, verdictLinesAt } from './smoke.state'
import { smokeAnchor } from './smoke.styles'

/**
 * The whole smoke show, mounted once for the three chapters it spans.
 * `data-t0` = the smoke origin (start of "finalPuff"), so the playback adapter
 * aligns every puff, billow, wisp and word with the show clock.
 */
export function SmokeLayer({ origin }: { origin: number }) {
  return (
    <div className={smokeAnchor} data-t0={origin} data-smoke aria-hidden="true">
      <SmokeMasses />
      <SmokeStream />
      <SmokeArguments />
      <SmokeVerdict />
    </div>
  )
}

const still = css({
  position: 'absolute',
  left: '50%',
  top: '7%',
  translate: '-50% 0',
  width: 'min(46em, 92cqw)',
  minHeight: '9em',
  display: 'grid',
  placeItems: 'center',
  padding: '2em 2.4em',
  textAlign: 'center',
  color: 'ink.900',
  bg: 'smoke.light',
  borderRadius: '2.4em',
  boxShadow: '0 0 0 0.3em token(colors.smoke.mid), 0 0.6em 2em rgba(8,8,11,0.4)',
  '& strong': { display: 'block', fontFamily: 'display', fontSize: '1.7em', lineHeight: '1' },
  '& p': { fontFamily: 'body', fontWeight: '700', fontSize: '0.95em', marginTop: '0.5em' },
})

/**
 * Reduced motion: no drifting smoke — one calm cloud showing exactly what the
 * animated version would show at this moment (same pure state functions).
 */
export function SmokeStill({ time }: { time: number }) {
  const lines = verdictLinesAt(time)
  const argument = currentArgumentAt(time)
  if (!lines.length && !argument) return null
  return (
    <div className={still}>
      <div>
        {lines.length ? (
          lines.map((line) => (line.kind === 'note' ? <p key={line.id}>{line.text}</p> : <strong key={line.id}>{line.text}</strong>))
        ) : argument ? (
          <>
            <strong>{argument.title}</strong>
            <p>{argument.detail}</p>
          </>
        ) : null}
      </div>
    </div>
  )
}
