import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.ts: unit tests exercise deterministic logic
// (timeline, scoring, playback adapter) and do not need the Panda plugin.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
})
