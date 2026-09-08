import { FlaskConical, Stethoscope, UserCog, UserRound, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import { Badge } from '@/components/ui/Badge'
import { ROLE_LABELS, type Role } from '@/types'

export const ROLE_ICONS: Record<Role, ComponentType<{ className?: string }>> = {
  admin: UserCog,
  receptionist: Users,
  technician: FlaskConical,
  doctor: Stethoscope,
  patient: UserRound,
}

export function RolePill({ role, className }: { role: Role; className?: string }) {
  const Icon = ROLE_ICONS[role]
  return (
    <Badge tone="accent" icon={<Icon />} className={className}>
      {ROLE_LABELS[role]}
    </Badge>
  )
}
