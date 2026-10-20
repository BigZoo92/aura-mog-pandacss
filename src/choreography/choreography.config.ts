import { buildTimeline } from '../animation/timeline/timeline'
import type { ChapterConfig } from '../animation/timeline/timeline.types'
import { bossBattleChapter } from '../battle/battle.config'
import { FINALE_CHAPTERS } from '../finale/finale.config'
import { dabSixSevenChapter } from './dances/dab-six-seven/dab-six-seven.chapter'
import { discoFeverChapter } from './dances/disco-fever/disco-fever.chapter'
import { flossChapter } from './dances/floss/floss.chapter'
import { freshChapter } from './dances/fresh/fresh.chapter'
import { gangnamStyleChapter } from './dances/gangnam-style/gangnam-style.chapter'
import { griddySixSevenChapter } from './dances/griddy-six-seven/griddy-six-seven.chapter'
import { orangeJusticeChapter } from './dances/orange-justice/orange-justice.chapter'
import { scubaChapter } from './dances/scuba/scuba.chapter'
import { shhJawlineChapter } from './dances/shh-jawline/shh-jawline.chapter'
import { sixSevenTwerkyChapter } from './dances/six-seven-twerky/six-seven-twerky.chapter'
import { sixSevenWoahChapter } from './dances/six-seven-woah/six-seven-woah.chapter'
import { westSideStoryChapter } from './dances/west-side-story/west-side-story.chapter'
import { introChapter } from './primitives/intro.chapter'

/**
 * THE SHOW. The order of this array is the order of the spectacle. Each
 * chapter lives next to its dance; this file only sequences them.
 */
export const SHOW: readonly ChapterConfig[] = [
  introChapter,
  // Act I — The Aura Farming Begins
  flossChapter,
  freshChapter,
  orangeJusticeChapter,
  discoFeverChapter,
  gangnamStyleChapter,
  // Act II — The Meme Multiverse
  westSideStoryChapter,
  scubaChapter,
  sixSevenWoahChapter,
  // Act III — Forbidden Brainrot Techniques
  griddySixSevenChapter,
  sixSevenTwerkyChapter,
  // Act IV — The Ultimate Auramogging
  shhJawlineChapter,
  dabSixSevenChapter,
  // Final boss
  bossBattleChapter,
  // Act V — The Final Puff
  ...FINALE_CHAPTERS,
]

export const SHOW_TIMELINE = buildTimeline(SHOW)
