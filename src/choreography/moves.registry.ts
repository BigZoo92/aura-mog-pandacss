import { battleMoves } from '../battle/battle.moves'
import { finaleMoves } from '../finale/finale.moves'
import { dabSixSevenMoves } from './dances/dab-six-seven/dab-six-seven.moves'
import { discoFeverMoves } from './dances/disco-fever/disco-fever.moves'
import { flossMoves } from './dances/floss/floss.moves'
import { freshMoves } from './dances/fresh/fresh.moves'
import { gangnamStyleMoves } from './dances/gangnam-style/gangnam-style.moves'
import { griddySixSevenMoves } from './dances/griddy-six-seven/griddy-six-seven.moves'
import { orangeJusticeMoves } from './dances/orange-justice/orange-justice.moves'
import { scubaMoves } from './dances/scuba/scuba.moves'
import { shhJawlineMoves } from './dances/shh-jawline/shh-jawline.moves'
import { sixSevenTwerkyMoves } from './dances/six-seven-twerky/six-seven-twerky.moves'
import { sixSevenWoahMoves } from './dances/six-seven-woah/six-seven-woah.moves'
import { westSideStoryMoves } from './dances/west-side-story/west-side-story.moves'
import type { MoveDefinition } from './motion/move'
import { idleMoves } from './primitives/idle.moves'
import { sharedMoves } from './primitives/shared.moves'
import { sixSevenMoves } from './primitives/six-seven.moves'

/**
 * Every move Tung Tung can perform. This IS bundled (it is small and typed):
 * React reads hand poses / faces / orientation from it, and Panda compiles
 * its track lists into the `rigMotion` slot recipe.
 */
export const MOVES = {
  ...idleMoves,
  ...sharedMoves,
  ...sixSevenMoves,
  ...flossMoves,
  ...freshMoves,
  ...orangeJusticeMoves,
  ...discoFeverMoves,
  ...gangnamStyleMoves,
  ...westSideStoryMoves,
  ...scubaMoves,
  ...sixSevenWoahMoves,
  ...griddySixSevenMoves,
  ...sixSevenTwerkyMoves,
  ...shhJawlineMoves,
  ...dabSixSevenMoves,
  ...battleMoves,
  ...finaleMoves,
} satisfies Record<string, MoveDefinition>

export type MoveId = keyof typeof MOVES

export const MOVE_IDS = Object.keys(MOVES) as MoveId[]
