import type { ResultValue } from './result'

export interface ReportTestSection {
  orderTestId: string
  testCode: string
  testName: string
  category: string
  sampleType: string
  method?: string
  values: ResultValue[]
  technicianNote?: string
  verifiedAt: string | null
  verifiedBy: string | null
  verifierDesignation: string | null
}

export interface Report {
  id: string
  /** Human-facing identifier printed on the document, e.g. RPT-2026-01994. */
  reportNumber: string
  orderId: string
  orderNumber: string

  patientId: string
  patientName: string
  patientMrn: string
  patientSex: string
  patientAgeLabel: string
  patientDateOfBirth: string

  referringDoctorName: string | null
  referringDoctorSpecialty: string | null

  collectedAt: string | null
  receivedAt: string | null
  reportedAt: string | null

  status: 'draft' | 'partial' | 'final'
  sections: ReportTestSection[]

  /** Counters the summary banner needs without recomputing sections. */
  abnormalCount: number
  criticalCount: number

  labName: string
  labAddress: string
  labAccreditation: string
  labPhone: string
}

export const REPORT_STATUS_LABELS: Record<Report['status'], string> = {
  draft: 'Draft',
  partial: 'Partial',
  final: 'Final',
}
