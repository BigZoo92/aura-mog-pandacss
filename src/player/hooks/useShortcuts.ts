import { useEffect } from 'react'

export type ShortcutMap = Partial<Record<string, (event: KeyboardEvent) => void>>

const INTERACTIVE = 'input, textarea, select, button, a[href], [contenteditable=true], [role=slider], [role=tab]'

/**
 * Global keyboard shortcuts that stay out of the way: ignored while typing,
 * while a modifier is held, or when the focused control already owns the key
 * (Space on a button presses that button, as browsers intend).
 */
export function useShortcuts(map: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const onInteractive = !!target?.closest?.(INTERACTIVE)
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const handler = map[key]
      if (!handler) return
      // Arrow keys and Space belong to focused controls; letters are safe unless typing.
      const typing = !!target?.closest?.('input, textarea, select, [contenteditable=true]')
      if (typing || (onInteractive && (key === ' ' || key.startsWith('Arrow')))) return
      event.preventDefault()
      handler(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [map, enabled])
}
