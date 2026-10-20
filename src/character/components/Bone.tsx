import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { FORM_JOINTS, type Joint } from '../rig/joints'
import { useRig } from './RigContext'

/**
 * A bone is a zero-size element sitting exactly on its pivot. Its artwork and
 * child bones hang off it, and `transform-origin: 0 0` makes every rotation
 * happen around the joint itself. Animation comes from the motion recipe slot.
 */
const boneBase = css({
  position: 'absolute',
  width: '0',
  height: '0',
  transformOrigin: '0 0',
  '&[data-selected=true] > [data-art]': {
    outline: '0.22em dashed token(colors.aura.lime)',
    outlineOffset: '0.12em',
  },
  '&[data-selected=true]::after': {
    content: '""',
    position: 'absolute',
    width: '1.1em',
    height: '1.1em',
    left: '-0.55em',
    top: '-0.55em',
    borderRadius: 'full',
    border: '0.25em solid token(colors.aura.lime)',
    boxShadow: '0 0 0 0.15em token(colors.ink.900)',
    zIndex: 99,
  },
})

interface BoneProps {
  joint: Joint
  className?: string
  children?: ReactNode
}

export function Bone({ joint, className, children }: BoneProps) {
  const { motion, selected, formT0 } = useRig()
  return (
    <div
      data-joint={joint}
      data-t0={formT0 !== undefined && FORM_JOINTS.has(joint) ? formT0 : undefined}
      data-selected={selected === joint ? 'true' : undefined}
      className={cx(boneBase, motion[joint], className)}
    >
      {children}
    </div>
  )
}
