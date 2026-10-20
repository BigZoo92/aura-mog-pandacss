import { defineSlotRecipe } from '@pandacss/dev'

/**
 * Slanted fighting-game HUD plate: a label tab + a value area.
 * A slot recipe because the parts are always styled together.
 */
export const hudPlate = defineSlotRecipe({
  className: 'hud-plate',
  description: 'Fighting-game HUD plate',
  slots: ['root', 'label', 'value'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      minWidth: '0',
      padding: '6px 14px 8px',
      bg: 'surface.panel',
      border: '3px solid token(colors.outline)',
      boxShadow: '0 0 0 2px token(colors.surface.line), hard',
      clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
    },
    label: {
      fontFamily: 'body',
      fontWeight: '700',
      fontSize: '10px',
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'text.muted',
    },
    value: {
      fontFamily: 'display',
      fontSize: 'clamp(16px, 2.2vw, 26px)',
      lineHeight: '1',
      color: 'text',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontVariantNumeric: 'tabular-nums',
    },
  },
  variants: {
    accent: {
      lime: { root: { borderBottomColor: 'aura.lime' }, value: { color: 'aura.lime' } },
      violet: { root: { borderBottomColor: 'aura.violet' }, value: { color: 'violet.300' } },
      gold: { root: { borderBottomColor: 'aura.gold' }, value: { color: 'aura.gold' } },
      cyan: { root: { borderBottomColor: 'rival' }, value: { color: 'rival' } },
      plain: {},
    },
  },
  defaultVariants: { accent: 'plain' },
})
