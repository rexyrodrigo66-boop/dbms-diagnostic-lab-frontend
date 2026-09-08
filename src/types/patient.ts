import { z } from 'zod'
import { isoDate } from './common'

export const sexSchema = z.enum(['male', 'female', 'other'])
export type Sex = z.infer<typeof sexSchema>

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
}

export const bloodGroupSchema = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
export type BloodGroup = z.infer<typeof bloodGroupSchema>

/** Payload accepted by createPatient / updatePatient. */
export const patientInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter the full name')
    .max(80, 'Name must be 80 characters or fewer'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => new Date(value) <= new Date(), 'Date of birth cannot be in the future'),
  sex: sexSchema,
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().trim().email('Enter a valid email address').or(z.literal('')).optional(),
  bloodGroup: bloodGroupSchema.optional(),
  addressLine: z.string().trim().max(120).optional(),
  city: z.string().trim().max(60).optional(),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code')
    .or(z.literal(''))
    .optional(),
  /** Free text — allergies, chronic conditions, current medication. */
  clinicalNotes: z.string().trim().max(500).optional(),
})
export type PatientInput = z.infer<typeof patientInputSchema>

export const patientSchema = patientInputSchema.extend({
  id: z.string(),
  /** Human-facing identifier printed on reports, e.g. PT-024188. */
  mrn: z.string(),
  registeredAt: isoDate,
  updatedAt: isoDate,
})
export type Patient = z.infer<typeof patientSchema>

/** Row shape for the patient list — adds derived counters the list needs. */
export interface PatientListItem extends Patient {
  orderCount: number
  lastVisitAt: string | null
}

export type PatientHistoryEventType =
  | 'registered'
  | 'order_placed'
  | 'sample_collected'
  | 'result_entered'
  | 'report_ready'
  | 'order_cancelled'

export interface PatientHistoryEvent {
  id: string
  type: PatientHistoryEventType
  occurredAt: string
  title: string
  detail?: string
  orderId?: string
  reportId?: string
  actor?: string
}
