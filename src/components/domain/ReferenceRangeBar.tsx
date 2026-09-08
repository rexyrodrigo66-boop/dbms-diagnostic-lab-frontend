import { cn } from '@/lib/cn'
import { formatRangeLabel, rangePosition } from '@/lib/referenceRange'
import type { ReferenceRange, ResultFlag } from '@/types'

/**
 * Shows where a value sits inside its reference range.
 *
 * A bare H flag says a value is high; this says HOW high. The shaded band is
 * the normal interval, the tick is the patient's value. Purely supplementary —
 * the numeric value and letter flag carry the meaning on their own, so this is
 * marked aria-hidden rather than duplicating the announcement.
 */
export function ReferenceRangeBar({
  value,
  range,
  flag,
  decimals = 1,
  className,
}: {
  value: number | null
  range: ReferenceRange | null
  flag: ResultFlag
  decimals?: number
  className?: string
}) {
  if (value === null || !range || range.low === null || range.high === null) {
    return <span className="text-xs text-fg-muted">{formatRangeLabel(range, decimals)}</span>
  }

  const position = rangePosition(value, range)
  const markerColor =
    flag === 'normal'
      ? 'bg-success'
      : flag === 'critical_low' || flag === 'critical_high'
        ? 'bg-danger'
        : flag === 'low'
          ? 'bg-flag-low'
          : 'bg-flag-high'

  return (
    <div className={cn('flex flex-col gap-1', className)} aria-hidden="true">
      <div className="relative h-1.5 w-full rounded-full bg-surface-3">
        {/* Normal interval: 15%–85% of the track by construction. */}
        <div className="absolute inset-y-0 left-[15%] right-[15%] rounded-full bg-success/25" />
        <div
          className={cn('absolute -top-0.5 h-2.5 w-0.5 rounded-full', markerColor)}
          style={{ left: `calc(${(position * 100).toFixed(2)}% - 1px)` }}
        />
      </div>
      <div className="flex justify-between text-2xs tabular-nums text-fg-muted">
        <span>{range.low.toFixed(decimals)}</span>
        <span>{range.high.toFixed(decimals)}</span>
      </div>
    </div>
  )
}
