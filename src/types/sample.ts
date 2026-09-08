import { z } from 'zod'
import { sampleTypeSchema } from './catalogue'

export const sampleStatusSchema = z.enum([
  'pending',
  'collected',
  'received',
  'processing',
  'completed',
  'rejected',
])
export type SampleStatus = z.infer<typeof sampleStatusSchema>

/** The happy-path pipeline, in order. 'rejected' is a terminal side exit. */
export const SAMPLE_PIPELINE: SampleStatus[] = [
  'pending',
  'collected',
  'received',
  'processing',
  'completed',
]

export const SAMPLE_STATUS_LABELS: Record<SampleStatus, string> = {
  pending: 'Pending',
  collected: 'Collected',
  received: 'Received',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
}

export const SAMPLE_STATUS_DESCRIPTIONS: Record<SampleStatus, string> = {
  pending: 'Awaiting collection from the patient.',
  collected: 'Drawn from the patient, in transit to the lab.',
  received: 'Logged in at the lab, queued for analysis.',
  processing: 'On the analyser or bench.',
  completed: 'Analysis finished, results entered.',
  rejected: 'Unusable — recollection required.',
}

/**
 * Legal forward transitions. The UI only offers moves listed here, so an
 * invalid state change is unrepresentable rather than merely validated.
 */
export const SAMPLE_TRANSITIONS: Record<SampleStatus, SampleStatus[]> = {
  pending: ['collected', 'rejected'],
  collected: ['received', 'rejected'],
  received: ['processing', 'rejected'],
  processing: ['completed', 'rejected'],
  completed: [],
  rejected: [],
}

export const SAMPLE_REJECTION_REASONS = [
  'Haemolysed',
  'Insufficient volume',
  'Clotted specimen',
  'Incorrect container',
  'Unlabelled or mislabelled',
  'Contaminated',
  'Delayed transport',
] as const

export interface SampleEvent {
  status: SampleStatus
  at: string
  by: string
  note?: string
}

export interface Sample {
  id: string
  /** Barcode value printed on the tube, e.g. SMP-88214006. */
  barcode: string
  orderId: string
  orderNumber: string
  patientId: string
  patientName: string
  patientMrn: string
  sampleType: z.infer<typeof sampleTypeSchema>
  status: SampleStatus
  priority: string
  /** Test codes carried on this tube. */
  testCodes: string[]
  collectedAt: string | null
  receivedAt: string | null
  completedAt: string | null
  rejectionReason: string | null
  /** Full chain of custody, oldest first. */
  events: SampleEvent[]
  createdAt: string
}

export const sampleStatusUpdateSchema = z.object({
  status: sampleStatusSchema,
  note: z.string().trim().max(200).optional(),
  rejectionReason: z.string().optional(),
})
export type SampleStatusUpdate = z.infer<typeof sampleStatusUpdateSchema>
