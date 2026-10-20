import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/** Live `prefers-reduced-motion` value. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(REDUCED_QUERY)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )
}

/** Fullscreen for one element, when the browser supports it. */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const available = typeof document !== 'undefined' && document.fullscreenEnabled

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])

  const toggle = useCallback(() => {
    if (!available) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void ref.current?.requestFullscreen()
  }, [available, ref])

  return { available, isFullscreen, toggle }
}
