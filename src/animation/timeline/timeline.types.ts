import type { CharacterForm, Expression } from '../../character/rig/rig.types'
import type { MoveId } from '../../choreography/moves.registry'

/** The twelve dances of the show. */
export type DanceId =
  | 'floss'
  | 'fresh'
  | 'orangeJustice'
  | 'discoFever'
  | 'gangnamStyle'
  | 'westSideStory'
  | 'scuba'
  | 'sixSevenWoah'
  | 'griddySixSeven'
  | 'sixSevenTwerky'
  | 'shhJawline'
  | 'dabSixSeven'

/** Act V — the JNR finale — is split into four chapters so Next / Previous can land on each scene. */
export type FinaleChapterId = 'tailwindDown' | 'finalPuff' | 'smokeReveal' | 'auraKing'

export type ChapterId = 'intro' | DanceId | 'bossBattle' | FinaleChapterId

export type ActId = 'prologue' | 'act1' | 'act2' | 'act3' | 'act4' | 'finalBoss' | 'act5'

/** Each chapter dresses the stage with a theme (lighting, backdrop, decor). */
export type StageTheme =
  | 'dojo'
  | 'retro'
  | 'citrus'
  | 'disco'
  | 'gangnam'
  | 'urban'
  | 'abyss'
  | 'impact'
  | 'violet'
  | 'mythic'
  | 'golden'
  | 'domain'
  | 'boss'
  | 'aftermath'
  | 'lounge'
  | 'victory'

export type Tone = 'lime' | 'violet' | 'gold' | 'orange' | 'cyan' | 'white' | 'pink'

export type CaptionStyle =
  /** small floating score pop near Tung Tung ("+67 AURA") */
  | 'pop'
  /** giant impact word ("WOAH!!!", "MOGGED") */
  | 'slam'
  /** arcade move-title banner sweeping across */
  | 'banner'
  /** act / title card */
  | 'title'
  /** challenger / boss announcer text */
  | 'announce'
  /** rubber-stamp style verdict */
  | 'stamp'
  /** small smug aside */
  | 'aside'

export type EffectKind =
  | 'impactRing'
  | 'burst'
  | 'speedLines'
  | 'sparks'
  | 'smoke'
  | 'shockwave'
  | 'flash'
  | 'invert'
  | 'beams'
  | 'auraFlames'
  | 'actionLines'
  | 'snap'
  | 'silhouette'

export type CameraShot =
  /** quick zoom hit */
  | 'punchIn'
  /** slow dramatic push to the face, held */
  | 'pushFace'
  /** zoom back out */
  | 'zoomOut'
  /** short violent shake */
  | 'shake'
  /** rapid rumble for twerk-level chaos */
  | 'rumble'
  /** knockback recoil */
  | 'recoil'
  /** full camera spin */
  | 'spin'
  /** tilted "dutch" angle */
  | 'dutch'
  /** heroic low angle */
  | 'heroLow'

export type CameraLayer = 'framing' | 'motion'

/** Timeline events, positioned relative to their chapter start (ms of show time). */
export type TimelineEvent =
  | { type: 'aura'; at: number; amount: number; ramp?: number }
  | { type: 'comboBreak'; at: number }
  | { type: 'caption'; at: number; duration: number; text: string; style: CaptionStyle; tone?: Tone; x?: number; y?: number }
  | { type: 'effect'; at: number; duration: number; effect: EffectKind; tone?: Tone; x?: number; y?: number; size?: number }
  | { type: 'camera'; at: number; duration: number; shot: CameraShot }
  /** Brief Giga Chad flash (300–700 ms), then instantly back to normal. */
  | { type: 'chad'; at: number; duration: number }
  /** Cinematic time multiplier, applied on top of the user's playback speed. */
  | { type: 'slowmo'; at: number; duration: number; rate: number }
  | { type: 'bossDamage'; at: number; amount: number; ramp?: number }
  | { type: 'projectile'; at: number; duration: number; label: string; lane: number }
  | { type: 'gaugeBurst'; at: number }

export type TimelineEventType = TimelineEvent['type']

/** What the Tailwind boss is doing during a segment of the battle. */
export type BossPhase = 'enter' | 'taunt' | 'attack' | 'hurt' | 'ko' | 'crash' | 'down'

/** One continuous stretch of a single move. */
export interface Segment {
  move: MoveId
  duration: number
  /** Overrides the chapter's form for this segment. */
  form?: CharacterForm
  /**
   * `instant`: the form is already fully revealed by the move's own tracks
   * (e.g. after the jawline transformation) — skip the reveal animation.
   */
  formEntrance?: 'animated' | 'instant'
  face?: Expression
  /** Short label shown in the inspector and playground scrubber. */
  label?: string
  /** Boss behaviour during this segment (boss chapters only). */
  boss?: BossPhase
}

/** How a chapter enters: a cartoon cover-up that also masks the pose change. */
export type ChapterTransition = 'cut' | 'puff' | 'flash' | 'swipe'

export interface ChapterConfig {
  id: ChapterId
  act: ActId
  title: string
  /** Arcade move title / subtitle. */
  subtitle: string
  dance?: DanceId
  theme: StageTheme
  form?: CharacterForm
  /** Boss present on stage. */
  boss?: boolean
  /** Show the boss health bar (defaults to `boss`). */
  bossBar?: boolean
  transition?: ChapterTransition
  segments: Segment[]
  events: TimelineEvent[]
}
