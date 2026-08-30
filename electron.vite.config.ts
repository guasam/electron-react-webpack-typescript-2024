import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

// Shared alias configuration
const aliases = {
  '@/app': resolve(__dirname, 'app'),
  '@/lib': resolve(__dirname, 'lib'),
  '@/conveyor': resolve(__dirname, 'conveyor'),
  '@/resources': resolve(__dirname, 'resources'),
}

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'lib/main/main.ts'),
        },
      },
    },
    resolve: {
      alias: aliases,
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'lib/preload/preload.ts'),
        },
      },
    },
    resolve: {
      alias: aliases,
    },
    // Bundle electron-conveyor into the preload: a sandboxed preload's `require` can only load
    // `electron`, so externalized packages would fail to resolve at runtime.
    plugins: [externalizeDepsPlugin({ exclude: ['electron-conveyor'] })],
  },
  renderer: {
    root: './app',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'app/index.html'),
        },
      },
    },
    resolve: {
      alias: aliases,
      // Insurance for local framework work: when electron-conveyor is swapped to a file:/npm-link
      // checkout it brings its own node_modules, and two React copies break context/hooks. Off the
      // registry npm already hoists one copy, so this is a no-op there.
      dedupe: ['react', 'react-dom', '@tanstack/react-query', 'zustand'],
    },
    plugins: [tailwindcss(), react()],
  },
})
