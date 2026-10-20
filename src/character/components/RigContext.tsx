import { createContext, useContext } from 'react'
import type { Joint } from '../rig/joints'

export interface RigContextValue {
  /** Slot classes of the active `rigMotion` move variant. */
  motion: Partial<Record<Joint, string>>
  /** Joint highlighted by the inspector, if any. */
  selected?: Joint | null
  /** Show time the current form started — time origin of form reveal animations. */
  formT0?: number
}

export const RigContext = createContext<RigContextValue>({ motion: {} })

export const useRig = () => useContext(RigContext)
