import { ArrowUp, Minus, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PRIORITY_LABELS, type Priority } from '@/types'

/** STAT is the one status that earns visual weight — it means drop everything. */
export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  if (priority === 'routine') {
    return (
      <Badge tone="neutral" icon={<Minus />} className={className}>
        {PRIORITY_LABELS.routine}
      </Badge>
    )
  }
  if (priority === 'urgent') {
    return (
      <Badge tone="warning" icon={<ArrowUp />} className={className}>
        {PRIORITY_LABELS.urgent}
      </Badge>
    )
  }
  return (
    <Badge tone="danger" icon={<Zap />} className={className}>
      {PRIORITY_LABELS.stat}
    </Badge>
  )
}
