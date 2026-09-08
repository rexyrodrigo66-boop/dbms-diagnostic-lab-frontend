import type { Analyte, ReferenceRange, ResultFlag, Sex } from '@/types'

/**
 * Reference range engine.
 *
 * Ranges are stored as variants because real analytes differ by sex and age.
 * Resolution picks the MOST SPECIFIC variant that matches the patient: a
 * sex-and-age match beats a sex-only match, which beats the universal fallback.
 */

interface PatientContext {
  sex: Sex | string
  ageYears: number
}

function matches(range: ReferenceRange, patient: PatientContext): boolean {
  if (range.sex && range.sex !== patient.sex) return false
  if (range.ageMinYears !== undefined && patient.ageYears < range.ageMinYears) return false
  if (range.ageMaxYears !== undefined && patient.ageYears >= range.ageMaxYears) return false
  return true
}

function specificity(range: ReferenceRange): number {
  let score = 0
  if (range.sex) score += 2
  if (range.ageMinYears !== undefined) score += 1
  if (range.ageMaxYears !== undefined) score += 1
  return score
}

export function resolveReferenceRange(
  analyte: Pick<Analyte, 'referenceRanges'>,
  patient: PatientContext,
): ReferenceRange | null {
  const candidates = analyte.referenceRanges.filter((range) => matches(range, patient))
  if (candidates.length === 0) return null
  return candidates.reduce((best, current) =>
    specificity(current) > specificity(best) ? current : best,
  )
}

/** Parse a raw input string to a number, tolerating '<0.01' and '>1000'. */
export function parseNumericValue(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const cleaned = trimmed.replace(/^[<>≤≥]\s*/, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

export interface FlagOutcome {
  flag: ResultFlag
  numericValue: number | null
  appliedRange: ReferenceRange | null
}

/**
 * Classify one entered value. Critical bounds are checked before ordinary
 * bounds so a critically low value never reports as merely low.
 */
export function flagValue(analyte: Analyte, raw: string, patient: PatientContext): FlagOutcome {
  const appliedRange = resolveReferenceRange(analyte, patient)

  if (analyte.resultType === 'qualitative') {
    const normal = analyte.normalOption
    if (!raw.trim() || !normal) {
      return { flag: 'normal', numericValue: null, appliedRange }
    }
    return {
      flag: raw.trim() === normal ? 'normal' : 'abnormal',
      numericValue: null,
      appliedRange,
    }
  }

  if (analyte.resultType === 'text') {
    return { flag: 'normal', numericValue: null, appliedRange }
  }

  const numericValue = parseNumericValue(raw)
  if (numericValue === null || !appliedRange) {
    return { flag: 'normal', numericValue, appliedRange }
  }

  const { low, high, criticalLow, criticalHigh } = appliedRange

  if (criticalLow !== null && criticalLow !== undefined && numericValue < criticalLow) {
    return { flag: 'critical_low', numericValue, appliedRange }
  }
  if (criticalHigh !== null && criticalHigh !== undefined && numericValue > criticalHigh) {
    return { flag: 'critical_high', numericValue, appliedRange }
  }
  if (low !== null && numericValue < low) {
    return { flag: 'low', numericValue, appliedRange }
  }
  if (high !== null && numericValue > high) {
    return { flag: 'high', numericValue, appliedRange }
  }
  return { flag: 'normal', numericValue, appliedRange }
}

/** "13.0 – 17.0" · "< 200" · "> 40" · "—" */
export function formatRangeLabel(range: ReferenceRange | null, decimals = 1): string {
  if (!range) return '—'
  const { low, high } = range
  const fmt = (value: number) => value.toFixed(decimals)
  if (low !== null && high !== null) return `${fmt(low)} – ${fmt(high)}`
  if (low === null && high !== null) return `< ${fmt(high)}`
  if (low !== null && high === null) return `> ${fmt(low)}`
  return range.note ?? '—'
}

/** Which sex/age variant was applied, for the "why this range" tooltip. */
export function describeRangeVariant(range: ReferenceRange | null): string | null {
  if (!range) return null
  const parts: string[] = []
  if (range.sex) parts.push(range.sex === 'male' ? 'Male' : range.sex === 'female' ? 'Female' : 'Other')
  if (range.ageMinYears !== undefined && range.ageMaxYears !== undefined) {
    parts.push(`${range.ageMinYears}–${range.ageMaxYears} y`)
  } else if (range.ageMinYears !== undefined) {
    parts.push(`${range.ageMinYears} y and over`)
  } else if (range.ageMaxYears !== undefined) {
    parts.push(`under ${range.ageMaxYears} y`)
  }
  return parts.length ? parts.join(', ') : 'All patients'
}

/**
 * Position of a value on its range track, 0–1, where 0.15 and 0.85 are the
 * low and high bounds. Values outside the range compress into the margins so
 * an extreme outlier still renders inside the bar.
 */
export function rangePosition(value: number, range: ReferenceRange): number {
  const { low, high } = range
  if (low === null || high === null || high <= low) return 0.5
  const span = high - low
  const normalised = (value - low) / span
  const scaled = 0.15 + normalised * 0.7
  if (scaled < 0.15) return Math.max(0.02, 0.15 - Math.min(0.13, (0.15 - scaled) * 0.35))
  if (scaled > 0.85) return Math.min(0.98, 0.85 + Math.min(0.13, (scaled - 0.85) * 0.35))
  return scaled
}
