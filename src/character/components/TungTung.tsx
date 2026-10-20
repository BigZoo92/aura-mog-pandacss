import { memo, useMemo } from 'react'
import { css, cx } from '../../../styled-system/css'
import { rigMotion } from '../../../styled-system/recipes'
import type { MoveDefinition } from '../../choreography/motion/move'
import { MOVES, type MoveId } from '../../choreography/moves.registry'
import { JnrInHand } from '../../props/jnr/Jnr'
import type { Joint } from '../rig/joints'
import type { CharacterForm, Expression, Orientation } from '../rig/rig.types'
import { Arm, GhostArm } from './Arm'
import { Bone } from './Bone'
import { Head } from './Head'
import { Hips } from './Hips'
import { Leg } from './Leg'
import { RigContext } from './RigContext'
import { Torso } from './Torso'

/**
 * TUNG TUNG TUNG SAHUR — in a panda onesie.
 *
 * The rig root: a zero-size anchor on the ground between his feet.
 * `font-size` is the rig unit — every shape is in `em`, so the character
 * scales with its container (container query units on the stage).
 */
const root = css({
  position: 'absolute',
  width: '0',
  height: '0',
  '--facing': '0',
  '--look': '0',
  perspective: '90em',
  '&[data-orientation=back], &[data-orientation=threeQuarter]': { '--facing': '1' },
  '&[data-orientation=threeQuarter] [data-joint=orient]': { rotate: 'y 28deg' },
  // Hips tuck under the onesie top from the front, but sit OVER the lower
  // back when he faces away (that's where the twerk has to read).
  '& [data-joint=torso]': { zIndex: 1 },
  '& [data-joint=hips]': { zIndex: 0 },
  '&[data-orientation=back] [data-joint=hips], &[data-orientation=threeQuarter] [data-joint=hips]': { zIndex: 2 },
})

const shadow = css({
  position: 'absolute',
  left: '-7em',
  top: '-1.1em',
  width: '14em',
  height: '2.4em',
  borderRadius: '50%',
  bg: 'rgba(8, 8, 11, 0.38)',
})

const pelvisPos = css({ top: 'calc(token(spacing.rig.hipHeight) * -1)' })

export interface TungTungProps {
  move: MoveId
  form: CharacterForm
  className?: string
  /** Show-time origin of the move's animations (see playback adapter). */
  t0?: number
  /** Override the move's facial expression (playground / cinematic beats). */
  face?: Expression
  /** Show time the current form became active (origin of its reveal animation). */
  formSince?: number
  formEntrance?: 'animated' | 'instant'
  /** Override the move's orientation (visual QA only). */
  orientation?: Orientation
  selected?: Joint | null
}

export const TungTung = memo(function TungTung({
  move,
  form,
  className,
  t0,
  face,
  formSince,
  formEntrance = 'animated',
  orientation,
  selected,
}: TungTungProps) {
  const definition: MoveDefinition = MOVES[move]
  const motion = useMemo(() => rigMotion({ move }), [move])
  const revealing = form !== 'brainrot' && formEntrance === 'animated'
  const formT0 = revealing ? formSince : undefined
  const context = useMemo(() => ({ motion, selected, formT0 }), [motion, selected, formT0])
  const hands = definition.hands ?? {}
  const ghosts = definition.ghostHands

  return (
    <RigContext.Provider value={context}>
      <div
        className={cx(root, className)}
        data-rig="tung-tung"
        data-move={move}
        data-form={form}
        data-entrance={formEntrance}
        data-orientation={orientation ?? definition.orientation ?? 'front'}
        data-t0={t0}
        aria-hidden="true"
      >
        <Bone joint="world">
          <Bone joint="shadow">
            <div data-art className={shadow} />
          </Bone>
          <Bone joint="orient">
            <Bone joint="body">
              <Bone joint="pelvis" className={pelvisPos}>
                <Leg side="L" />
                <Leg side="R" />
                <Torso
                  behind={
                    ghosts && (
                      <>
                        <GhostArm side="L" pose={ghosts.L} />
                        <GhostArm side="R" pose={ghosts.R} />
                      </>
                    )
                  }
                  head={<Head face={face ?? definition.face ?? 'grin'} />}
                  arms={
                    <>
                      <Arm side="L" pose={hands.L ?? 'open'} />
                      <Arm
                        side="R"
                        pose={hands.R ?? 'open'}
                        prop={definition.prop === 'jnr' ? <JnrInHand /> : undefined}
                      />
                    </>
                  }
                />
                <Hips />
              </Bone>
            </Bone>
          </Bone>
        </Bone>
      </div>
    </RigContext.Provider>
  )
})
