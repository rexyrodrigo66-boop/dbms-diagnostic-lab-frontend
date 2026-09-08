import { cn } from '@/lib/cn'
import { RESULT_FLAG_LABELS, RESULT_FLAG_LETTER, type ResultFlag } from '@/types'

/**
 * Diagnostic flag indicator.
 *
 * Three redundant signals on every abnormal value:
 *   1. a letter flag (H / L / HH / LL / A) — the convention printed on real
 *      laboratory reports,
 *   2. a directional glyph (▲ ▼ ‼),
 *   3. colour.
 *
 * Colour is the least important of the three and is never the only one present.
 * The full meaning is also exposed to assistive technology as visually hidden
 * text, so "14.2 H" is announced as "14.2, high, above reference range".
 */

const glyphs: Record<ResultFlag, string> = {
  normal: '',
  low: '▼',
  high: '▲',
  critical_low: '▼▼',
  critical_high: '▲▲',
  abnormal: '‼',
}

const colors: Record<ResultFlag, string> = {
  normal: 'text-flag-normal',
  low: 'text-flag-low',
  high: 'text-flag-high',
  critical_low: 'text-flag-critical',
  critical_high: 'text-flag-critical',
  abnormal: 'text-flag-high',
}

const backgrounds: Record<ResultFlag, string> = {
  normal: '',
  low: 'bg-flag-low-bg',
  high: 'bg-flag-high-bg',
  critical_low: 'bg-flag-critical-bg',
  critical_high: 'bg-flag-critical-bg',
  abnormal: 'bg-flag-high-bg',
}

export function ResultFlagIndicator({ flag, className }: { flag: ResultFlag; className?: string }) {
  if (flag === 'normal') {
    return <span className="sr-only">{RESULT_FLAG_LABELS.normal}</span>
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-[3px] px-1 py-px',
        'text-2xs font-semibold leading-none',
        colors[flag],
        backgrounds[flag],
        className,
      )}
    >
      <span aria-hidden="true">{glyphs[flag]}</span>
      <span aria-hidden="true">{RESULT_FLAG_LETTER[flag]}</span>
      <span className="sr-only">{RESULT_FLAG_LABELS[flag]}</span>
    </span>
  )
}

/** The value and its flag as one unit, for result tables and report sections. */
export function ResultValueCell({
  value,
  unit,
  flag,
  className,
}: {
  value: string
  unit?: string
  flag: ResultFlag
  className?: string
}) {
  const abnormal = flag !== 'normal'
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span
        className={cn(
          'tabular-nums',
          abnormal ? cn('font-semibold', colors[flag]) : 'text-fg',
        )}
      >
        {value || '—'}
      </span>
      {unit ? <span className="text-xs text-fg-muted">{unit}</span> : null}
      <ResultFlagIndicator flag={flag} />
    </span>
  )
}
