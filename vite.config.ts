import pandacss from '@pandacss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // `transform: true` rewrites static css()/cva() calls into plain class strings
  // at build time, so most of the Panda runtime never reaches the bundle.
  plugins: [pandacss({ transform: true }), react()],
})
