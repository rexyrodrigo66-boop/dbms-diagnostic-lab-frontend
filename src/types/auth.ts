import { z } from 'zod'

export const roleSchema = z.enum(['admin', 'receptionist', 'technician', 'doctor', 'patient'])
export type Role = z.infer<typeof roleSchema>

export const ROLES: Role[] = ['admin', 'receptionist', 'technician', 'doctor', 'patient']

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Lab Administrator',
  receptionist: 'Receptionist',
  technician: 'Lab Technician',
  doctor: 'Doctor',
  patient: 'Patient',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: 'Full access to every module, analytics and operational overrides.',
  receptionist: 'Register patients, create orders, track progress and look up records.',
  technician: 'Collect samples, work the pending queue and enter result values.',
  doctor: 'Look up patients, order tests and review verified reports.',
  patient: 'View your own profile, test history, status tracker and reports.',
}

/**
 * Permissions, not roles, gate the UI. Components ask `can('order:create')` so
 * that when the backend ships real RBAC the strings map across unchanged.
 */
export const PERMISSIONS = [
  'patient:read',
  'patient:write',
  'patient:read-own',
  'catalogue:read',
  'catalogue:write',
  'order:read',
  'order:create',
  'order:cancel',
  'sample:read',
  'sample:update-status',
  'worklist:read',
  'result:write',
  'result:verify',
  'report:read',
  'report:read-own',
  'analytics:read',
  'settings:manage',
] as const

export type Permission = (typeof PERMISSIONS)[number]

/**
 * The two '-own' permissions mean "read the record that belongs to me" and only
 * make sense for a patient session. Admins hold the unscoped 'patient:read' and
 * 'report:read' instead, so they must not inherit these — otherwise the
 * navigation offers an administrator a personal profile they do not have.
 */
const ADMIN_PERMISSIONS: readonly Permission[] = PERMISSIONS.filter(
  (permission) => permission !== 'patient:read-own' && permission !== 'report:read-own',
)

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  receptionist: [
    'patient:read',
    'patient:write',
    'catalogue:read',
    'order:read',
    'order:create',
    'order:cancel',
    'sample:read',
    'sample:update-status',
    'report:read',
  ],
  technician: [
    'patient:read',
    'catalogue:read',
    'order:read',
    'sample:read',
    'sample:update-status',
    'worklist:read',
    'result:write',
  ],
  doctor: [
    'patient:read',
    'catalogue:read',
    'order:read',
    'order:create',
    'report:read',
    'result:verify',
  ],
  patient: ['patient:read-own', 'catalogue:read', 'report:read-own'],
}

export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: roleSchema,
  /** Set only for the patient role — links the session to a patient record. */
  patientId: z.string().optional(),
  /** Set for doctors and technicians — shown on reports and audit trails. */
  designation: z.string().optional(),
  email: z.string().email().optional(),
})
export type SessionUser = z.infer<typeof sessionUserSchema>

export interface Session {
  user: SessionUser
  permissions: readonly Permission[]
  issuedAt: string
}
