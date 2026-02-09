import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Required for @convex-dev/better-auth to avoid module resolution issues during SSR
  ssr: {
    noExternal: ['@convex-dev/better-auth'],
  },
  plugins: [
    devtools(),
    // IMPORTANT: tanstackStart must come before viteTsConfigPaths for proper route discovery
    tanstackStart({
      // REMOVED: routeFileIgnorePattern: 'api\\.'
      // This pattern was preventing API routes from being discovered!
      // API routes should be placed in src/routes/api/ directory and use createAPIFileRoute
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact(),
  ],
})

export default config
