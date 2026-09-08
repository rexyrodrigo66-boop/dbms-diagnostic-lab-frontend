import type { Role, SessionUser } from '@/types'

/**
 * Fixed demo identities, one per role.
 *
 * This is presentation-layer scaffolding only. There are no credentials, no
 * tokens and no session security here by design — authentication is the
 * backend team's scope. The UI labels this as demo mode wherever it appears.
 */
export const DEMO_USERS: Record<Role, SessionUser> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Anita Raghavan',
    role: 'admin',
    designation: 'Chief Pathologist',
    email: 'anita.raghavan@meridianlabs.in',
  },
  receptionist: {
    id: 'usr-recept-01',
    name: 'Priya Sharma',
    role: 'receptionist',
    designation: 'Front Desk Executive',
    email: 'priya.sharma@meridianlabs.in',
  },
  technician: {
    id: 'usr-tech-01',
    name: 'Rahul Menon',
    role: 'technician',
    designation: 'Senior Lab Technician',
    email: 'rahul.menon@meridianlabs.in',
  },
  doctor: {
    id: 'usr-doc-01',
    name: 'Dr. Vikram Iyer',
    role: 'doctor',
    designation: 'MD, General Medicine',
    email: 'vikram.iyer@meridianlabs.in',
  },
  patient: {
    id: 'usr-pat-01',
    name: 'Kavya Nair',
    role: 'patient',
    patientId: 'pat-000001',
    email: 'kavya.nair@example.com',
  },
}
