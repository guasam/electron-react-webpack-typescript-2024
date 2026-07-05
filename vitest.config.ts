import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@/lib': resolve(__dirname, 'lib'),
      '@/conveyor': resolve(__dirname, 'conveyor'),
      '@/app': resolve(__dirname, 'app'),
    },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
})
