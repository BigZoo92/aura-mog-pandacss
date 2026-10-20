import { useLayoutEffect, useRef } from 'react'
import { css } from '../../styled-system/css'
import { TungTung } from '../character/components/TungTung'
import { CHARACTER_FORMS, type CharacterForm } from '../character/rig/rig.types'
import { MOVES, type MoveId } from '../choreography/moves.registry'

/**
 * Developer harness: `/?lab&move=floss&form=brainrot&t=1200`
 * renders Tung Tung frozen at `t` ms into the move. Used for visual QA.
 */
const params = new URLSearchParams(window.location.search)
const isMove = (value: string | null): value is MoveId => !!value && value in MOVES
const isForm = (value: string | null): value is CharacterForm =>
  !!value && (CHARACTER_FORMS as readonly string[]).includes(value)

const stage = css({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  containerType: 'size',
  bg: 'cream.100',
  backgroundImage:
    'radial-gradient(circle at 50% 40%, token(colors.lime.400) 0 30%, token(colors.bamboo.400) 70%)',
})
const rigPlacement = css({ left: '50%', bottom: '8%', fontSize: 'min(2.15cqh, 4cqw)' })

export function Lab() {
  const ref = useRef<HTMLDivElement>(null)
  const move = isMove(params.get('move')) ? (params.get('move') as MoveId) : 'idle'
  const form = isForm(params.get('form')) ? (params.get('form') as CharacterForm) : 'brainrot'
  const t = Number(params.get('t') ?? 0)
  const orientation = params.get('orient')

  useLayoutEffect(() => {
    const animations = ref.current?.getAnimations({ subtree: true }) ?? []
    for (const animation of animations) {
      animation.pause()
      animation.currentTime = t
    }
    document.body.dataset.ready = 'true'
  }, [t, move, form])

  return (
    <div ref={ref} className={stage}>
      {orientation === 'profile' && <style>{'[data-joint=orient]{--facing:0.5 !important}'}</style>}
      <TungTung
        move={move}
        form={form}
        className={rigPlacement}
        orientation={orientation === 'back' || orientation === 'threeQuarter' ? orientation : undefined}
      />
    </div>
  )
}
