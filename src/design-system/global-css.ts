import { defineGlobalStyles } from '@pandacss/dev'

export const globalCss = defineGlobalStyles({
  'html, body, #root': {
    height: '100%',
  },
  body: {
    bg: 'surface.page',
    color: 'text',
    fontFamily: 'body',
    WebkitFontSmoothing: 'antialiased',
    overflowX: 'hidden',
  },
  '::selection': { bg: 'aura.lime', color: 'text.inverse' },
  ':focus-visible': {
    outline: '3px solid token(colors.aura.lime)',
    outlineOffset: '2px',
  },
})
