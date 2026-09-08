import { z } from 'zod'
import { isoDate } from './common'

export const prioritySchema = z.enum(['routine', 'urgent', 'stat'])
export type Priority = z.infer<typeof prioritySchema>

export const PRIORITY_LABELS: Record<Priority, string> = {
  routine: 'Routine',
  urgent: 'Urgent',
  stat: 'STAT',
}

export const orderStatusSchema = z.enum([
  'placed',
  'in_progress',
  'partially_completed',
  'completed',
  'cancelled',
])
export type OrderStatus = z.infer<typeof orderStatusSchema>

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  in_progress: 'In progress',
  partially_completed: 'Partially completed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

/** Per-test lifecycle inside an order. Distinct from the sample's lifecycle. */
export const orderTestStatusSchema = z.enum([
  'pending',
  'in_progress',
  'awaiting_verification',
  'verified',
  'cancelled',
])
export type OrderTestStatus = z.infer<typeof orderTestStatusSchema>

export const ORDER_TEST_STATUS_LABELS: Record<OrderTestStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  awaiting_verification: 'Awaiting verification',
  verified: 'Verified',
  cancelled: 'Cancelled',
}

export const referringDoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  hospital: z.string().optional(),
})
export type ReferringDoctor = z.infer<typeof referringDoctorSchema>

/** Payload accepted by createOrder. */
export const orderInputSchema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  testIds: z.array(z.string()).min(1, 'Add at least one test to the order'),
  priority: prioritySchema.default('routine'),
  referringDoctorId: z.string().optional(),
  /** Percentage discount applied to the order subtotal. */
  discountPercent: z.number().min(0).max(100).default(0),
  notes: z.string().trim().max(300).optional(),
})
export type OrderInput = z.infer<typeof orderInputSchema>

export interface OrderTest {
  id: string
  testId: string
  testCode: string
  testName: string
  category: string
  price: number
  status: OrderTestStatus
  sampleId: string | null
  resultEnteredAt: string | null
  verifiedAt: string | null
  verifiedBy: string | null
}

export interface Order {
  id: string
  /** Human-facing identifier, e.g. ORD-2026-04188. */
  orderNumber: string
  patientId: string
  patientName: string
  patientMrn: string
  status: OrderStatus
  priority: Priority
  referringDoctor: ReferringDoctor | null
  tests: OrderTest[]
  subtotal: number
  discountPercent: number
  total: number
  /** Longest turnaround among the ordered tests, in minutes. */
  estimatedTurnaroundMinutes: number
  expectedReadyAt: string
  notes?: string
  placedAt: string
  placedBy: string
  completedAt: string | null
  cancelledAt: string | null
  cancellationReason?: string
}

/** Returned by estimateOrder — drives live pricing in the ordering flow. */
export interface OrderEstimate {
  lines: Array<{ testId: string; code: string; name: string; price: number }>
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
  estimatedTurnaroundMinutes: number
  /** Distinct sample types the patient will need to give. */
  sampleTypes: string[]
  fastingRequired: boolean
}

export const orderListFiltersSchema = z.object({
  status: orderStatusSchema.optional(),
  priority: prioritySchema.optional(),
  patientId: z.string().optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
})
export type OrderListFilters = z.infer<typeof orderListFiltersSchema>
