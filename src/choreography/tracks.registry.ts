import { battleTracks } from '../battle/battle.tracks'
import { finaleTracks } from '../finale/finale.tracks'
import { dabSixSevenTracks } from './dances/dab-six-seven/dab-six-seven.tracks'
import { discoFeverTracks } from './dances/disco-fever/disco-fever.tracks'
import { flossTracks } from './dances/floss/floss.tracks'
import { freshTracks } from './dances/fresh/fresh.tracks'
import { gangnamStyleTracks } from './dances/gangnam-style/gangnam-style.tracks'
import { griddySixSevenTracks } from './dances/griddy-six-seven/griddy-six-seven.tracks'
import { orangeJusticeTracks } from './dances/orange-justice/orange-justice.tracks'
import { scubaTracks } from './dances/scuba/scuba.tracks'
import { shhJawlineTracks } from './dances/shh-jawline/shh-jawline.tracks'
import { sixSevenTwerkyTracks } from './dances/six-seven-twerky/six-seven-twerky.tracks'
import { sixSevenWoahTracks } from './dances/six-seven-woah/six-seven-woah.tracks'
import { westSideStoryTracks } from './dances/west-side-story/west-side-story.tracks'
import { costumeTracks } from './primitives/costume.tracks'
import { idleTracks } from './primitives/idle.tracks'
import { sharedTracks } from './primitives/shared.tracks'
import { sixSevenTracks } from './primitives/six-seven.tracks'

/**
 * Every movement primitive in the show. Imported ONLY by `panda.config.ts`
 * (and tests): keyframe data is compiled to CSS and never bundled as JS.
 * Runtime code imports the `TrackName` type, which costs nothing.
 */
export const TRACKS = {
  ...idleTracks,
  ...sharedTracks,
  ...costumeTracks,
  ...sixSevenTracks,
  ...flossTracks,
  ...freshTracks,
  ...orangeJusticeTracks,
  ...discoFeverTracks,
  ...gangnamStyleTracks,
  ...westSideStoryTracks,
  ...scubaTracks,
  ...sixSevenWoahTracks,
  ...griddySixSevenTracks,
  ...sixSevenTwerkyTracks,
  ...shhJawlineTracks,
  ...dabSixSevenTracks,
  ...battleTracks,
  ...finaleTracks,
}

export type TrackName = keyof typeof TRACKS

/** Layered under every move unless the move already drives the same property. */
export const AMBIENT_TRACKS = ['idleBlink'] as const satisfies readonly TrackName[]
