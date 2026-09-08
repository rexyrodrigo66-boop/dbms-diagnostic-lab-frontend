import {
  BarChart3,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Settings,
  TestTubes,
  UserRound,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { Permission } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  /** The item renders only if the session holds this permission. */
  permission: Permission
  /** Match the path exactly rather than as a prefix. */
  end?: boolean
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

/**
 * Navigation is GENERATED from permissions, so a role can never see a link it
 * is not allowed to open. Route guards enforce the same rule on direct URL
 * entry; this list only decides what is offered.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        permission: 'order:read',
        end: true,
      },
      { to: '/me', label: 'My profile', icon: UserRound, permission: 'patient:read-own', end: true },
      { to: '/me/reports', label: 'My reports', icon: FileText, permission: 'report:read-own' },
    ],
  },
  {
    id: 'clinical',
    label: 'Clinical',
    items: [
      { to: '/patients', label: 'Patients', icon: Users, permission: 'patient:read' },
      { to: '/catalogue', label: 'Test catalogue', icon: TestTubes, permission: 'catalogue:read' },
      { to: '/orders', label: 'Orders', icon: ClipboardList, permission: 'order:read' },
    ],
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    items: [
      { to: '/samples', label: 'Samples', icon: FlaskConical, permission: 'sample:read' },
      { to: '/worklist', label: 'Worklist', icon: ClipboardList, permission: 'worklist:read' },
    ],
  },
  {
    id: 'output',
    label: 'Output',
    items: [
      { to: '/reports', label: 'Reports', icon: FileText, permission: 'report:read' },
      { to: '/analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics:read' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [{ to: '/settings', label: 'Settings', icon: Settings, permission: 'settings:manage' }],
  },
]

/** Where each role lands after signing in. */
export const ROLE_HOME: Record<string, string> = {
  admin: '/dashboard',
  receptionist: '/dashboard',
  technician: '/worklist',
  doctor: '/dashboard',
  patient: '/me',
}
