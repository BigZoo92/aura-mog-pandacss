import type { CSSProperties } from 'react'
import { css } from '../../styled-system/css'
import type { Scene, WindowedEvent } from '../animation/timeline/scene'
import { TailwindBoss } from './TailwindBoss'

type ProjectileEvent = WindowedEvent & { type: 'projectile' }

/** A utility class, flung across the stage like a shuriken. */
const projectile = css({
  position: 'absolute',
  left: '72%',
  padding: '0.35em 0.7em',
  fontFamily: 'mono',
  fontWeight: '700',
  fontSize: '1.5em',
  whiteSpace: 'nowrap',
  color: 'ink.900',
  bg: 'cyan.300',
  border: '0.14em solid token(colors.ink.900)',
  borderRadius: '0.4em',
  boxShadow: '0 0 0.8em token(colors.cyan.400), -1.4em 0 1.2em -0.6em rgba(53,216,255,0.8)',
  animation: 'projectileFly var(--dur) linear both',
})

export function BattleLayer({ scene }: { scene: Scene }) {
  const { chapter, segment } = scene
  if (!chapter.config.boss || !segment.boss) return null

  const projectiles = scene.active.filter((event): event is ProjectileEvent => event.type === 'projectile')
  // A counter-hit lands when an impact ring flashes on the boss.
  const hit = scene.active.find((event) => event.type === 'effect' && event.effect === 'impactRing' && (event.x ?? 50) > 70)

  return (
    <>
      <TailwindBoss phase={segment.boss} phaseT0={segment.start} hitAt={hit?.at} />
      {projectiles.map((event) => (
        <div
          key={event.id}
          className={projectile}
          data-t0={event.at}
          style={{ top: `${event.lane}%`, '--dur': `${event.duration}ms` } as CSSProperties}
        >
          .{event.label}
        </div>
      ))}
    </>
  )
}
