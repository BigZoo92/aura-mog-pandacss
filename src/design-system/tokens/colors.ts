import { defineSemanticTokens, defineTokens } from '@pandacss/dev'

/** Raw palette. Components never use these directly — they go through semantic tokens. */
export const colors = defineTokens.colors({
  ink: {
    950: { value: '#08080B' },
    900: { value: '#101014' },
    800: { value: '#1A1A21' },
    700: { value: '#262630' },
    600: { value: '#3A3A48' },
    400: { value: '#77778A' },
  },
  cream: {
    50: { value: '#FFFDF6' },
    100: { value: '#FFF5DE' },
    200: { value: '#F5E6C4' },
    300: { value: '#E3CFA4' },
  },
  bamboo: {
    300: { value: '#C9EE8F' },
    400: { value: '#A8E05F' },
    500: { value: '#86C440' },
    600: { value: '#5E9E2E' },
    700: { value: '#3E7220' },
    800: { value: '#284D15' },
  },
  lime: { 400: { value: '#C8FF4D' }, 600: { value: '#8BD10F' } },
  orange: { 300: { value: '#FFA27D' }, 400: { value: '#FF743D' }, 600: { value: '#D94E18' } },
  violet: { 300: { value: '#B796FF' }, 400: { value: '#8A55FF' }, 600: { value: '#5A25D6' }, 900: { value: '#1E0F45' } },
  cyan: { 300: { value: '#8BEBFF' }, 400: { value: '#35D8FF' }, 600: { value: '#0A9FD0' }, 900: { value: '#06283A' } },
  yellow: { 300: { value: '#FFF09A' }, 400: { value: '#FFE453' }, 600: { value: '#E8B800' } },
  blush: { 400: { value: '#FF9EB5' } },
  /** Tung Tung Tung Sahur's wood, from sun-bleached highlight to carved shadow. */
  timber: {
    100: { value: '#F2CB94' },
    200: { value: '#E3AE6C' },
    300: { value: '#CC8C4C' },
    400: { value: '#B06F35' },
    500: { value: '#8F5424' },
    600: { value: '#6E3C17' },
    700: { value: '#4E280D' },
    800: { value: '#2E1606' },
  },
  /** JNR puff — red tank, black chassis, hot LED. */
  jnr: {
    red: { value: '#E0262B' },
    redDeep: { value: '#8E0F14' },
    amber: { value: '#FF8A2B' },
    chassis: { value: '#1C1C22' },
    steel: { value: '#4A4A55' },
    led: { value: '#FF3B30' },
  },
  /** Fruity smoke (watermelon · mango · peach), cartoon-tinted. */
  smoke: {
    core: { value: '#FFFAF3' },
    light: { value: '#FBEFF3' },
    mid: { value: '#EFD9EA' },
    shade: { value: '#D6BEDB' },
    deep: { value: '#B49DC2' },
  },
})

/** Meaning-based colours: what the character, stage and HUD are made of. */
export const semanticColors = defineSemanticTokens.colors({
  outline: { value: '{colors.ink.900}' },
  fur: {
    DEFAULT: { value: '{colors.cream.50}' },
    shade: { value: '{colors.cream.200}' },
    dark: { value: '{colors.ink.700}' },
    darkShade: { value: '{colors.ink.800}' },
  },
  glove: { DEFAULT: { value: '{colors.cream.100}' }, shade: { value: '{colors.cream.300}' } },
  wood: {
    highlight: { value: '{colors.timber.100}' },
    light: { value: '{colors.timber.200}' },
    DEFAULT: { value: '{colors.timber.300}' },
    mid: { value: '{colors.timber.400}' },
    shade: { value: '{colors.timber.500}' },
    dark: { value: '{colors.timber.600}' },
    deep: { value: '{colors.timber.700}' },
    void: { value: '{colors.timber.800}' },
  },
  /** The panda onesie Tung is wearing. */
  onesie: {
    white: { value: '{colors.cream.50}' },
    whiteShade: { value: '{colors.cream.200}' },
    black: { value: '{colors.ink.700}' },
    blackShade: { value: '{colors.ink.800}' },
  },
  stalk: {
    light: { value: '{colors.bamboo.300}' },
    DEFAULT: { value: '{colors.bamboo.400}' },
    mid: { value: '{colors.bamboo.500}' },
    node: { value: '{colors.bamboo.600}' },
    deep: { value: '{colors.bamboo.700}' },
  },
  sneaker: { DEFAULT: { value: '{colors.orange.400}' }, shade: { value: '{colors.orange.600}' }, sole: { value: '{colors.cream.100}' } },
  aura: {
    lime: { value: '{colors.lime.400}' },
    violet: { value: '{colors.violet.400}' },
    gold: { value: '{colors.yellow.400}' },
    hot: { value: '{colors.orange.400}' },
  },
  rival: { DEFAULT: { value: '{colors.cyan.400}' }, deep: { value: '{colors.cyan.600}' }, night: { value: '{colors.cyan.900}' } },
  surface: {
    page: { value: '{colors.ink.950}' },
    panel: { value: '{colors.ink.900}' },
    raised: { value: '{colors.ink.800}' },
    line: { value: '{colors.ink.600}' },
  },
  text: {
    DEFAULT: { value: '{colors.cream.100}' },
    muted: { value: '{colors.ink.400}' },
    inverse: { value: '{colors.ink.900}' },
  },
  impact: { value: '{colors.yellow.400}' },
})
