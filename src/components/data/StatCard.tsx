import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

/**
 * A single operational metric. Flat and bordered — no elevation, no gradient.
 * The delta shows direction with an arrow as well as colour, and states
 * explicitly whether a rise is good or bad, which an arrow alone cannot.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  /** Whether an increase is a good outcome for this metric. */
  higherIsBetter = true,
  footer,
  loading,
  className,
}: {
  label: string
  value: ReactNode
  icon?: ComponentType<{ className?: string }>
  delta?: number
  deltaLabel?: string
  higherIsBetter?: boolean
  footer?: ReactNode
  loading?: boolean
  className?: string
}) {
  const direction = delta === undefined ? null : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
  const isGood =
    direction === null || direction === 'flat'
      ? null
      : (direction === 'up') === higherIsBetter

  const DeltaIcon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : ArrowRight

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-[var(--radius-surface)] border border-hairline bg-surface p-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-13 text-fg-muted">{label}</p>
        {Icon ? <Icon className="size-4 shrink-0 text-fg-disabled" aria-hidden="true" /> : null}
      </div>

      {loading ? (
        <Skeleton className="mt-3 h-7 w-24" />
      ) : (
        <p className="mt-2 text-xl font-semibold tabular-nums text-fg">{value}</p>
      )}

      {(delta !== undefined || footer) && !loading ? (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {direction ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium tabular-nums',
                isGood === null ? 'text-fg-muted' : isGood ? 'text-success' : 'text-danger',
              )}
            >
              <DeltaIcon className="size-3" aria-hidden="true" />
              {Math.abs(delta ?? 0).toFixed(1)}%
            </span>
          ) : null}
          {deltaLabel ? <span className="text-fg-muted">{deltaLabel}</span> : null}
          {footer}
        </div>
      ) : null}
    </div>
  )
}
