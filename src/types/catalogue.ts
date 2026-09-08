import { z } from 'zod'
import { sexSchema } from './patient'

export const testCategorySchema = z.enum([
  'hematology',
  'biochemistry',
  'thyroid',
  'urinalysis',
  'immunology',
])
export type TestCategory = z.infer<typeof testCategorySchema>

export const TEST_CATEGORIES: TestCategory[] = [
  'hematology',
  'biochemistry',
  'thyroid',
  'urinalysis',
  'immunology',
]

export const TEST_CATEGORY_LABELS: Record<TestCategory, string> = {
  hematology: 'Hematology',
  biochemistry: 'Biochemistry',
  thyroid: 'Thyroid Profile',
  urinalysis: 'Urinalysis',
  immunology: 'Immunology',
}

export const sampleTypeSchema = z.enum([
  'blood_edta',
  'blood_serum',
  'blood_fluoride',
  'urine',
  'stool',
  'swab',
])
export type SampleType = z.infer<typeof sampleTypeSchema>

export const SAMPLE_TYPE_LABELS: Record<SampleType, string> = {
  blood_edta: 'Whole blood (EDTA)',
  blood_serum: 'Serum',
  blood_fluoride: 'Plasma (Fluoride)',
  urine: 'Urine',
  stool: 'Stool',
  swab: 'Swab',
}

/** Short label for dense table cells. */
export const SAMPLE_TYPE_SHORT: Record<SampleType, string> = {
  blood_edta: 'EDTA',
  blood_serum: 'Serum',
  blood_fluoride: 'Fluoride',
  urine: 'Urine',
  stool: 'Stool',
  swab: 'Swab',
}

/**
 * A reference range variant. Ranges legitimately differ by sex and age
 * (haemoglobin, creatinine, ALP and others), so the model carries variants from
 * the start rather than assuming one range per analyte.
 *
 * Resolution order: the most specific matching variant wins. A variant with no
 * sex and no age bounds is the fallback for everyone.
 */
export const referenceRangeSchema = z.object({
  sex: sexSchema.optional(),
  ageMinYears: z.number().min(0).optional(),
  ageMaxYears: z.number().min(0).optional(),
  low: z.number().nullable(),
  high: z.number().nullable(),
  /** Outside these bounds the result is flagged critical, not merely abnormal. */
  criticalLow: z.number().nullable().optional(),
  criticalHigh: z.number().nullable().optional(),
  note: z.string().optional(),
})
export type ReferenceRange = z.infer<typeof referenceRangeSchema>

export const analyteResultTypeSchema = z.enum(['numeric', 'qualitative', 'text'])
export type AnalyteResultType = z.infer<typeof analyteResultTypeSchema>

/** One measurable line inside a test. A CBC has many; a fasting glucose has one. */
export const analyteSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Canonical unit. No conversion is performed anywhere in the application. */
  unit: z.string(),
  resultType: analyteResultTypeSchema,
  /** Allowed values when resultType is 'qualitative'. */
  options: z.array(z.string()).optional(),
  /** Which option counts as unremarkable, for flagging. */
  normalOption: z.string().optional(),
  decimals: z.number().int().min(0).max(3).default(1),
  referenceRanges: z.array(referenceRangeSchema),
})
export type Analyte = z.infer<typeof analyteSchema>

export const labTestSchema = z.object({
  id: z.string(),
  /** Short catalogue code shown in tables and on reports, e.g. CBC, TSH. */
  code: z.string(),
  name: z.string(),
  category: testCategorySchema,
  sampleType: sampleTypeSchema,
  /** Turnaround time in minutes, from sample receipt to verified result. */
  turnaroundMinutes: z.number().int().positive(),
  price: z.number().nonnegative(),
  fastingRequired: z.boolean(),
  description: z.string(),
  preparation: z.string().optional(),
  analytes: z.array(analyteSchema),
  active: z.boolean().default(true),
})
export type LabTest = z.infer<typeof labTestSchema>
