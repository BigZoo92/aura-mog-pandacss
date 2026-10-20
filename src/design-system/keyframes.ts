import { defineKeyframes } from '@pandacss/dev'
import { battleKeyframes } from '../battle/battle.keyframes'
import { formKeyframes } from '../character/rig/form.keyframes'
import { smokeKeyframes } from '../finale/smoke/smoke.keyframes'

/**
 * Effect, camera, caption and stage keyframes. The character's own keyframes
 * are compiled from typed tracks (see `choreography/motion`). Every name says
 * what it does, so `animation: auraImpactRing 600ms` documents itself.
 */
const effects = defineKeyframes({
  auraImpactRing: {
    '0%': { scale: '0.15', opacity: '1', borderWidth: '1.4em' },
    '70%': { opacity: '0.9' },
    '100%': { scale: '2.6', opacity: '0', borderWidth: '0.1em' },
  },
  auraBurst: {
    '0%': { scale: '0.2', rotate: '0deg', opacity: '1' },
    '60%': { opacity: '1' },
    '100%': { scale: '1.7', rotate: '25deg', opacity: '0' },
  },
  speedLinesRush: {
    '0%': { backgroundPosition: '0 0', opacity: '0' },
    '15%': { opacity: '1' },
    '85%': { opacity: '1' },
    '100%': { backgroundPosition: '-60em 0', opacity: '0' },
  },
  sparkRise: {
    '0%': { translate: '0 0', scale: '0.4', opacity: '0' },
    '15%': { opacity: '1', scale: '1' },
    '100%': { translate: 'var(--dx, 0) -9em', scale: '0.2', opacity: '0' },
  },
  smokePuff: {
    '0%': { scale: '0.3', opacity: '0.9' },
    '100%': { scale: '1.8', opacity: '0', translate: '0 -1.5em' },
  },
  shockwaveExpand: {
    '0%': { scale: '0.05', opacity: '1' },
    '100%': { scale: '4', opacity: '0' },
  },
  flashFade: {
    '0%': { opacity: '0.95' },
    '100%': { opacity: '0' },
  },
  invertFlash: {
    '0%, 45%': { opacity: '1' },
    '46%, 100%': { opacity: '0' },
  },
  beamsSpin: {
    '0%': { rotate: '0deg', opacity: '0' },
    '12%': { opacity: '1' },
    '88%': { opacity: '1' },
    '100%': { rotate: '70deg', opacity: '0' },
  },
  auraFlameFlicker: {
    '0%, 100%': { scale: '1 1', opacity: '0.85' },
    '25%': { scale: '1.06 1.12', opacity: '1' },
    '50%': { scale: '0.96 0.94', opacity: '0.75' },
    '75%': { scale: '1.04 1.08', opacity: '0.95' },
  },
  actionLinesPulse: {
    '0%': { opacity: '0', scale: '1.3' },
    '20%': { opacity: '1', scale: '1' },
    '50%': { opacity: '0.7', scale: '1.04' },
    '80%': { opacity: '1', scale: '1' },
    '100%': { opacity: '0', scale: '0.95' },
  },
  snapPop: {
    '0%': { scale: '0.2', opacity: '0', rotate: '-20deg' },
    '25%': { scale: '1.2', opacity: '1', rotate: '0deg' },
    '100%': { scale: '1', opacity: '0', translate: '0 -2em' },
  },
  silhouetteFlash: {
    '0%, 100%': { filter: 'none' },
    '8%, 70%': { filter: 'brightness(0) drop-shadow(0 0 0.6em var(--tone))' },
  },
  gaugeShake: {
    '0%, 100%': { translate: '0 0' },
    '25%': { translate: '-2px 1px' },
    '50%': { translate: '2px -1px' },
    '75%': { translate: '-1px -1px' },
  },
  auraPulse: {
    '0%, 100%': { scale: '1', opacity: '0.75' },
    '50%': { scale: '1.08', opacity: '1' },
  },
})

const captions = defineKeyframes({
  captionPop: {
    '0%': { scale: '0.3', translate: '0 1em', opacity: '0' },
    '18%': { scale: '1.15', translate: '0 0', opacity: '1' },
    '30%': { scale: '1' },
    '80%': { opacity: '1' },
    '100%': { translate: '0 -3em', opacity: '0' },
  },
  captionSlam: {
    '0%': { scale: '3.2', opacity: '0', rotate: '-8deg' },
    '12%': { scale: '0.92', opacity: '1', rotate: '-3deg' },
    '18%': { scale: '1.05' },
    '24%': { scale: '1' },
    '85%': { scale: '1.04', opacity: '1' },
    '100%': { scale: '1.25', opacity: '0' },
  },
  captionBanner: {
    '0%': { translate: '-120% 0', transform: 'skewX(-12deg)' },
    '14%': { translate: '4% 0', transform: 'skewX(-12deg)' },
    '20%': { translate: '0 0', transform: 'skewX(-8deg)' },
    '84%': { translate: '0 0', opacity: '1', transform: 'skewX(-8deg)' },
    '100%': { translate: '120% 0', opacity: '0', transform: 'skewX(-12deg)' },
  },
  captionTitle: {
    '0%': { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.4em' },
    '25%': { clipPath: 'inset(0 0 0 0)', letterSpacing: '0.04em' },
    '85%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
    '100%': { clipPath: 'inset(0 0 0 0)', opacity: '0' },
  },
  captionStamp: {
    '0%': { scale: '2.6', rotate: '-24deg', opacity: '0' },
    '10%': { scale: '0.95', rotate: '-10deg', opacity: '1' },
    '16%': { scale: '1.04' },
    '22%': { scale: '1', rotate: '-12deg' },
    '90%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  captionAnnounce: {
    '0%, 100%': { opacity: '0' },
    '6%, 18%, 30%, 88%': { opacity: '1' },
    '12%, 24%': { opacity: '0.25' },
  },
})

const camera = defineKeyframes({
  cameraPunchIn: {
    '0%': { scale: '1' },
    '20%': { scale: '1.22' },
    '100%': { scale: '1' },
  },
  cameraPushFace: {
    '0%': { scale: '1', translate: '0 0' },
    '35%, 100%': { scale: '2.15', translate: '0 21%' },
  },
  cameraZoomOut: {
    '0%': { scale: '1.6' },
    '100%': { scale: '1' },
  },
  cameraShake: {
    '0%, 100%': { translate: '0 0' },
    '10%': { translate: '-1.4% 0.8%' },
    '20%': { translate: '1.2% -1%' },
    '30%': { translate: '-1% -0.6%' },
    '40%': { translate: '1.4% 0.9%' },
    '50%': { translate: '-0.8% 1%' },
    '60%': { translate: '0.9% -0.7%' },
    '70%': { translate: '-0.6% 0.4%' },
    '85%': { translate: '0.4% -0.2%' },
  },
  cameraRumble: {
    '0%, 100%': { translate: '0 0', rotate: '0deg' },
    '25%': { translate: '0.6% -0.5%', rotate: '0.6deg' },
    '50%': { translate: '-0.5% 0.6%', rotate: '-0.5deg' },
    '75%': { translate: '0.4% 0.3%', rotate: '0.4deg' },
  },
  cameraRecoil: {
    '0%': { translate: '0 0', scale: '1' },
    '15%': { translate: '3% 0', scale: '0.94' },
    '100%': { translate: '0 0', scale: '1' },
  },
  cameraSpin: {
    '0%': { rotate: '0deg', scale: '1' },
    '50%': { scale: '0.86' },
    '100%': { rotate: '360deg', scale: '1' },
  },
  cameraDutch: {
    '0%': { rotate: '0deg', scale: '1' },
    '25%, 85%': { rotate: '-7deg', scale: '1.12' },
    '100%': { rotate: '0deg', scale: '1' },
  },
  cameraHeroLow: {
    '0%': { scale: '1', translate: '0 0' },
    '30%, 85%': { scale: '1.18', translate: '0 -6%' },
    '100%': { scale: '1', translate: '0 0' },
  },
})

const stage = defineKeyframes({
  floorScroll: {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '0 8em' },
  },
  discoBallSpin: {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '2.4em 0' },
  },
  discoBeamSweep: {
    '0%, 100%': { rotate: 'var(--from, -35deg)' },
    '50%': { rotate: 'var(--to, 35deg)' },
  },
  dotsTwinkle: {
    '0%, 100%': { opacity: '0.35' },
    '50%': { opacity: '1' },
  },
  bubbleRise: {
    '0%': { translate: '0 0', opacity: '0' },
    '10%': { opacity: '0.9' },
    '100%': { translate: 'var(--sway, 1em) -110cqh', opacity: '0' },
  },
  causticDrift: {
    '0%': { backgroundPosition: '0 0, 0 0' },
    '100%': { backgroundPosition: '12em 6em, -10em 8em' },
  },
  spotlightSway: {
    '0%, 100%': { rotate: 'var(--from, -12deg)' },
    '50%': { rotate: 'var(--to, 12deg)' },
  },
  lampFlicker: {
    '0%, 100%': { opacity: '1' },
    '42%': { opacity: '1' },
    '44%': { opacity: '0.45' },
    '46%': { opacity: '1' },
    '78%': { opacity: '0.8' },
  },
  backdropBeamsRotate: {
    '0%': { rotate: '0deg' },
    '100%': { rotate: '360deg' },
  },
  bossPulse: {
    '0%, 100%': { scale: '1', filter: 'drop-shadow(0 0 1em token(colors.cyan.400))' },
    '50%': { scale: '1.04', filter: 'drop-shadow(0 0 2.4em token(colors.cyan.400))' },
  },
  confettiFall: {
    '0%': { translate: '0 -10cqh', rotate: '0deg' },
    '100%': { translate: 'var(--sway, 2em) 110cqh', rotate: '720deg' },
  },
  retroStripes: {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '6em 0' },
  },
  dustSettle: {
    '0%': { backgroundPosition: '0 0, 0 0', opacity: '0.4' },
    '50%': { opacity: '0.8' },
    '100%': { backgroundPosition: '-6.4em 10.4em, 9.1em 15.4em', opacity: '0.4' },
  },
  flashStrobe: {
    '0%, 100%': { opacity: '0' },
    '5%, 9%': { opacity: '0.85' },
    '7%': { opacity: '0.1' },
  },
})

export const effectKeyframes = { ...effects, ...captions, ...camera, ...stage, ...formKeyframes, ...battleKeyframes, ...smokeKeyframes }
