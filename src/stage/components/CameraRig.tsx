import type { CSSProperties, ReactNode } from 'react'
import { cva } from '../../../styled-system/css'
import type { Scene } from '../../animation/timeline/scene'

/**
 * Two nested camera wrappers so a slow framing move (push-in to the face)
 * and a violent motion (shake) can happen at the same time without fighting
 * over one transform — the same composition rule as the character rig.
 */
const framing = cva({
  base: {
    position: 'absolute',
    inset: '0',
    transformOrigin: '50% 60%',
    animationFillMode: 'both',
    animationDuration: 'var(--dur)',
    animationTimingFunction: 'token(easings.inOut)',
  },
  variants: {
    shot: {
      none: {},
      punchIn: { animationName: 'cameraPunchIn', animationTimingFunction: 'token(easings.out)' },
      pushFace: { animationName: 'cameraPushFace', transformOrigin: '50% 30%' },
      zoomOut: { animationName: 'cameraZoomOut', animationTimingFunction: 'token(easings.out)' },
      dutch: { animationName: 'cameraDutch' },
      heroLow: { animationName: 'cameraHeroLow', transformOrigin: '50% 90%' },
    },
  },
})

const motion = cva({
  base: {
    position: 'absolute',
    inset: '0',
    transformOrigin: '50% 55%',
    animationFillMode: 'both',
    animationDuration: 'var(--dur)',
    animationTimingFunction: 'linear',
    _calmEffects: { animationName: 'none !important' },
  },
  variants: {
    shot: {
      none: {},
      shake: { animationName: 'cameraShake' },
      rumble: { animationName: 'cameraRumble', animationDuration: '140ms', animationIterationCount: 'infinite' },
      recoil: { animationName: 'cameraRecoil', animationTimingFunction: 'token(easings.out)' },
      spin: { animationName: 'cameraSpin', animationTimingFunction: 'token(easings.inOut)' },
    },
  },
})

type FramingShot = 'none' | 'punchIn' | 'pushFace' | 'zoomOut' | 'dutch' | 'heroLow'
type MotionShot = 'none' | 'shake' | 'rumble' | 'recoil' | 'spin'

const style = (duration?: number) =>
  duration === undefined ? undefined : ({ '--dur': `${duration}ms` } as CSSProperties)

export function CameraRig({ camera, children }: { camera: Scene['camera']; children: ReactNode }) {
  const f = camera.framing
  const m = camera.motion
  return (
    <div
      className={framing({ shot: (f?.shot ?? 'none') as FramingShot })}
      data-t0={f?.at}
      data-camera={f?.shot}
      style={style(f?.duration)}
    >
      <div
        className={motion({ shot: (m?.shot ?? 'none') as MotionShot })}
        data-t0={m?.at}
        data-camera={m?.shot}
        style={style(m?.duration)}
      >
        {children}
      </div>
    </div>
  )
}
