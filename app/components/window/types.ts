import type { conveyor } from '@/app/lib/conveyor'

export type Conveyor = typeof conveyor

export interface TitlebarMenuItem {
  name: string
  /** Type-safe action — receives the conveyor client. No magic channel strings. */
  action?: (conveyor: Conveyor) => void
  shortcut?: string
  items?: TitlebarMenuItem[]
}

export interface TitlebarMenu {
  name: string
  items: TitlebarMenuItem[]
}

export interface TitlebarConfig {
  title: string
  icon?: string
  titleCentered?: boolean
  menuItems?: TitlebarMenu[]
}
