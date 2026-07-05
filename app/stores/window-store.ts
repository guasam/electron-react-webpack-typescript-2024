import { create } from 'zustand'
import type { TitlebarConfig } from '@/app/components/window/types'

interface WindowState {
  /** Titlebar configuration (title, icon, menu). Set once at mount. */
  titlebar: TitlebarConfig
  setTitlebar: (titlebar: TitlebarConfig) => void

  /** Titlebar menu UI state. */
  menusVisible: boolean
  activeMenuIndex: number | null
  setMenusVisible: (visible: boolean) => void
  setActiveMenuIndex: (index: number | null) => void
  closeActiveMenu: () => void

  /** Live window state, fed by main→renderer push events. */
  isFocused: boolean
  isMaximized: boolean
  setFocused: (focused: boolean) => void
  setMaximized: (maximized: boolean) => void
}

export const useWindowStore = create<WindowState>((set) => ({
  titlebar: { title: 'Electron React App' },
  setTitlebar: (titlebar) => set({ titlebar }),

  menusVisible: false,
  activeMenuIndex: null,
  setMenusVisible: (menusVisible) => set({ menusVisible }),
  setActiveMenuIndex: (activeMenuIndex) => set({ activeMenuIndex }),
  closeActiveMenu: () => set({ activeMenuIndex: null }),

  isFocused: true,
  isMaximized: false,
  setFocused: (isFocused) => set({ isFocused }),
  setMaximized: (isMaximized) => set({ isMaximized }),
}))
