import { Construction } from 'lucide-react'
import { EmptyState } from '@/components/data/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { Surface } from '@/components/ui/Surface'

/**
 * Temporary stand-in for screens scheduled in a later phase. Every one of these
 * is replaced by real work; none ships in the final build.
 */
export function PlaceholderPage({
  title,
  description,
  phase,
}: {
  title: string
  description: string
  phase: string
}) {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={title} description={description} />
      <Surface>
        <EmptyState
          icon={Construction}
          title={`Scheduled for ${phase}`}
          description="The design system, navigation shell and service layer this screen depends on are in place. The screen itself is built in a later phase."
        />
      </Surface>
    </div>
  )
}
