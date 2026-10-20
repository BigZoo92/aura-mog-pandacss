import { defineRecipe } from '@pandacss/dev'

/**
 * Chunky arcade button: hard offset shadow that collapses when pressed.
 * Typed variants (`tone`, `size`, `shape`) are generated into
 * `styled-system/recipes` — invalid variant names fail type-checking.
 */
export const arcadeButton = defineRecipe({
  className: 'arcade-btn',
  description: 'Arcade-cabinet push button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    minWidth: '44px',
    minHeight: '44px',
    fontFamily: 'display',
    letterSpacing: '0.04em',
    lineHeight: '1',
    color: 'text.inverse',
    bg: 'cream.100',
    border: '3px solid token(colors.outline)',
    borderRadius: '10px',
    boxShadow: 'hard',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'translate 80ms, box-shadow 80ms, background 120ms',
    _hover: { bg: 'cream.50', translate: '-1px -1px', boxShadow: '5px 5px 0 0 token(colors.ink.900)' },
    _active: { translate: '3px 3px', boxShadow: '1px 1px 0 0 token(colors.ink.900)' },
    _disabled: { opacity: 0.45, cursor: 'not-allowed', translate: '0 0' },
    '&[aria-pressed=true]': { bg: 'aura.lime' },
  },
  variants: {
    tone: {
      cream: {},
      lime: { bg: 'aura.lime', _hover: { bg: 'lime.400' } },
      orange: { bg: 'orange.400', _hover: { bg: 'orange.300' } },
      violet: { bg: 'violet.400', color: 'cream.50', _hover: { bg: 'violet.300' } },
      ghost: {
        bg: 'transparent',
        color: 'text',
        borderColor: 'surface.line',
        boxShadow: 'none',
        _hover: { bg: 'surface.raised', boxShadow: 'none', translate: '0 0' },
        _active: { translate: '0 1px', boxShadow: 'none' },
        '&[aria-pressed=true]': { bg: 'aura.lime', color: 'text.inverse', borderColor: 'outline' },
      },
    },
    size: {
      sm: { fontSize: '12px', px: '10px', minHeight: '36px', minWidth: '36px' },
      md: { fontSize: '14px', px: '14px' },
      lg: { fontSize: 'clamp(18px, 2.4vw, 26px)', px: '28px', py: '18px', borderWidth: '4px', boxShadow: 'hardLg' },
    },
    shape: {
      rect: {},
      round: { borderRadius: 'full', px: '0', width: '48px', height: '48px' },
    },
  },
  defaultVariants: { tone: 'cream', size: 'md', shape: 'rect' },
})
