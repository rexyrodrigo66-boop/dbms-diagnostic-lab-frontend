import {
  CheckCircle2,
  Circle,
  CircleDot,
  FlaskConical,
  Inbox,
  XCircle,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import {
  ORDER_STATUS_LABELS,
  ORDER_TEST_STATUS_LABELS,
  type OrderStatus,
  type OrderTestStatus,
  SAMPLE_STATUS_LABELS,
  type SampleStatus,
} from '@/types'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface StatusVisual {
  icon: ComponentType<{ className?: string }>
  tone: Tone
}

/**
 * Every status carries a distinct ICON and a TEXT LABEL alongside its colour.
 * A user who cannot distinguish the hues still reads the state correctly.
 */
const sampleVisuals: Record<SampleStatus, StatusVisual> = {
  pending: { icon: Circle, tone: 'neutral' },
  collected: { icon: CircleDot, tone: 'info' },
  received: { icon: Inbox, tone: 'purple' },
  processing: { icon: FlaskConical, tone: 'warning' },
  completed: { icon: CheckCircle2, tone: 'success' },
  rejected: { icon: XCircle, tone: 'danger' },
}

const orderVisuals: Record<OrderStatus, StatusVisual> = {
  placed: { icon: Circle, tone: 'neutral' },
  in_progress: { icon: FlaskConical, tone: 'warning' },
  partially_completed: { icon: CircleDot, tone: 'info' },
  completed: { icon: CheckCircle2, tone: 'success' },
  cancelled: { icon: XCircle, tone: 'danger' },
}

const orderTestVisuals: Record<OrderTestStatus, StatusVisual> = {
  pending: { icon: Circle, tone: 'neutral' },
  in_progress: { icon: FlaskConical, tone: 'warning' },
  awaiting_verification: { icon: Inbox, tone: 'purple' },
  verified: { icon: CheckCircle2, tone: 'success' },
  cancelled: { icon: XCircle, tone: 'danger' },
}

export function SampleStatusBadge({ status, className }: { status: SampleStatus; className?: string }) {
  const { icon: Icon, tone } = sampleVisuals[status]
  return (
    <Badge tone={tone} icon={<Icon />} className={className}>
      {SAMPLE_STATUS_LABELS[status]}
    </Badge>
  )
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const { icon: Icon, tone } = orderVisuals[status]
  return (
    <Badge tone={tone} icon={<Icon />} className={className}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}

export function OrderTestStatusBadge({
  status,
  className,
}: {
  status: OrderTestStatus
  className?: string
}) {
  const { icon: Icon, tone } = orderTestVisuals[status]
  return (
    <Badge tone={tone} icon={<Icon />} className={className}>
      {ORDER_TEST_STATUS_LABELS[status]}
    </Badge>
  )
}

/** Compact dot + label for dense table cells where a full badge is too heavy. */
export function StatusDot({ status, className }: { status: SampleStatus; className?: string }) {
  const { icon: Icon } = sampleVisuals[status]
  const colors: Record<SampleStatus, string> = {
    pending: 'text-[var(--status-pending)]',
    collected: 'text-[var(--status-collected)]',
    received: 'text-[var(--status-received)]',
    processing: 'text-[var(--status-processing)]',
    completed: 'text-[var(--status-completed)]',
    rejected: 'text-[var(--status-rejected)]',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-13 text-fg-secondary', className)}>
      <Icon className={cn('size-3.5 shrink-0', colors[status])} aria-hidden="true" />
      {SAMPLE_STATUS_LABELS[status]}
    </span>
  )
}
