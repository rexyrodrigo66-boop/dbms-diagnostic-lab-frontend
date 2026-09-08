import { z } from 'zod'
import type { Analyte, ReferenceRange } from './catalogue'

/**
 * Result flags. Every one of these is rendered with a letter flag, a glyph AND
 * a colour — colour alone never carries the meaning.
 */
export const resultFlagSchema = z.enum([
  'normal',
  'low',
  'high',
  'critical_low',
  'critical_high',
  'abnormal',
])
export type ResultFlag = z.infer<typeof resultFlagSchema>

export const RESULT_FLAG_LETTER: Record<ResultFlag, string> = {
  normal: '',
  low: 'L',
  high: 'H',
  critical_low: 'LL',
  critical_high: 'HH',
  abnormal: 'A',
}

export const RESULT_FLAG_LABELS: Record<ResultFlag, string> = {
  normal: 'Within reference range',
  low: 'Low, below reference range',
  high: 'High, above reference range',
  critical_low: 'Critical low',
  critical_high: 'Critical high',
  abnormal: 'Abnormal',
}

export const isAbnormal = (flag: ResultFlag) => flag !== 'normal'
export const isCritical = (flag: ResultFlag) => flag === 'critical_low' || flag === 'critical_high'

/** A single entered value for one analyte. */
export const resultValueInputSchema = z.object({
  analyteId: z.string(),
  /** Empty string means "not entered". Numeric analytes parse this to a number. */
  value: z.string(),
  note: z.string().trim().max(200).optional(),
})
export type ResultValueInput = z.infer<typeof resultValueInputSchema>

/** Payload accepted by saveTestResults. */
export const resultSheetInputSchema = z.object({
  orderTestId: z.string(),
  values: z.array(resultValueInputSchema),
  technicianNote: z.string().trim().max(500).optional(),
  /** Draft saves keep the test in 'in_progress'; submit moves it forward. */
  submit: z.boolean().default(false),
})
export type ResultSheetInput = z.infer<typeof resultSheetInputSchema>

export interface ResultValue {
  analyteId: string
  analyteName: string
  unit: string
  value: string
  numericValue: number | null
  flag: ResultFlag
  /** The range variant actually applied, after sex/age resolution. */
  appliedRange: ReferenceRange | null
  note?: string
}

/** Everything the result entry screen needs, in one request. */
export interface ResultSheet {
  orderTestId: string
  orderId: string
  orderNumber: string
  patientId: string
  patientName: string
  patientMrn: string
  patientSex: string
  patientAgeYears: number
  testId: string
  testCode: string
  testName: string
  sampleBarcode: string
  sampleType: string
  status: string
  analytes: Analyte[]
  /** Previously saved values, if this is a resumed draft. */
  values: ResultValue[]
  technicianNote?: string
  enteredBy: string | null
  enteredAt: string | null
}

/** A row in the technician's pending queue. */
export interface WorklistItem {
  orderTestId: string
  orderId: string
  orderNumber: string
  patientName: string
  patientMrn: string
  testCode: string
  testName: string
  category: string
  sampleBarcode: string
  sampleStatus: string
  priority: string
  status: string
  receivedAt: string | null
  /** Minutes remaining against the promised turnaround. Negative is overdue. */
  minutesToDue: number
}
