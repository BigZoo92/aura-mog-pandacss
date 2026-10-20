import { cva } from '../../../styled-system/css'
import type { CharacterForm } from '../../character/rig/rig.types'

/**
 * Persistent aura behind Tung Tung. Its colour and violence follow the form;
 * its pulse runs on the chapter's time origin like every stage animation.
 */
const aura = cva({
  base: {
    position: 'absolute',
    left: '50%',
    bottom: '6%',
    width: '30em',
    height: '40em',
    marginLeft: '-15em',
    borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
    pointerEvents: 'none',
    animation: 'auraPulse 1000ms ease-in-out infinite',
    transition: 'opacity 200ms',
    _calmEffects: { animation: 'none' },
  },
  variants: {
    form: {
      brainrot: {
        backgroundImage: 'radial-gradient(ellipse at 50% 60%, rgba(200,255,77,0.45), transparent 62%)',
        opacity: 0.55,
      },
      auraBeast: {
        backgroundImage:
          'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.7) 0 12%, rgba(138,85,255,0.85) 30%, rgba(200,255,77,0.35) 52%, transparent 66%)',
        opacity: 1,
        animationDuration: '500ms',
      },
      gigaPandaChad: {
        backgroundImage:
          'radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.9) 0 14%, rgba(255,228,83,0.95) 32%, rgba(255,116,61,0.4) 52%, transparent 68%)',
        opacity: 1,
        scale: '1.2',
        animationDuration: '380ms',
      },
    },
  },
})

export function AuraField({ form, t0 }: { form: CharacterForm; t0: number }) {
  return <div className={aura({ form })} data-t0={t0} />
}
