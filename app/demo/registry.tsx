import type { ComponentType } from 'react'
import {
  Home,
  MessageSquare,
  FolderOpen,
  Gauge,
  Activity,
  StickyNote,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Overview } from './pages/Overview'
import { StreamPage } from './pages/StreamPage'
import { FilesPage } from './pages/FilesPage'
import { TasksPage } from './pages/TasksPage'
import { SystemPage } from './pages/SystemPage'
import { StorePage } from './pages/StorePage'
import { SecurePage } from './pages/SecurePage'

export interface PageProps {
  onNavigate: (id: string) => void
}

export interface PageDef {
  id: string
  label: string
  blurb: string
  group: 'start' | 'primitives'
  icon: LucideIcon
  component: ComponentType<PageProps>
}

export const PAGES: PageDef[] = [
  { id: 'overview', label: 'Overview', blurb: 'Start here', group: 'start', icon: Home, component: Overview },
  {
    id: 'stream',
    label: 'Streaming',
    blurb: 'Token-by-token, LLM-style',
    group: 'primitives',
    icon: MessageSquare,
    component: StreamPage,
  },
  {
    id: 'files',
    label: 'File access',
    blurb: 'Native dialog + read',
    group: 'primitives',
    icon: FolderOpen,
    component: FilesPage,
  },
  {
    id: 'tasks',
    label: 'Background task',
    blurb: 'Live progress from main',
    group: 'primitives',
    icon: Gauge,
    component: TasksPage,
  },
  {
    id: 'system',
    label: 'System monitor',
    blurb: 'CPU & memory, polled',
    group: 'primitives',
    icon: Activity,
    component: SystemPage,
  },
  {
    id: 'store',
    label: 'Shared state',
    blurb: 'Synced across windows',
    group: 'primitives',
    icon: StickyNote,
    component: StorePage,
  },
  {
    id: 'secure',
    label: 'Middleware',
    blurb: 'Guards + context',
    group: 'primitives',
    icon: ShieldCheck,
    component: SecurePage,
  },
]
