import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'era-theme'

function initialTheme(): Theme {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (saved === 'light' || saved === 'dark') return saved
  // No saved preference → follow the OS, defaulting to dark.
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

/** Light/dark theme, persisted to localStorage. WindowFrame applies it as a `.dark` class on <html>. */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))
