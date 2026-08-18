import { create } from 'zustand'

/** Live window state for the shell, fed by `window.init()` + the main→renderer push events. */
interface WindowState {
  platform: string
  minimizable: boolean
  maximizable: boolean
  isFocused: boolean
  isMaximized: boolean
  setInit: (init: { platform: string; minimizable: boolean; maximizable: boolean }) => void
  setFocused: (focused: boolean) => void
  setMaximized: (maximized: boolean) => void
}

export const useWindowStore = create<WindowState>((set) => ({
  platform: '',
  minimizable: true,
  maximizable: true,
  isFocused: true,
  isMaximized: false,
  setInit: (init) => set(init),
  setFocused: (isFocused) => set({ isFocused }),
  setMaximized: (isMaximized) => set({ isMaximized }),
}))
