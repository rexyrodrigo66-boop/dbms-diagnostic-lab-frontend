import { Download, Plus, Search, Trash2 } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { EmptyState } from '@/components/data/EmptyState'
import { ErrorState } from '@/components/data/ErrorState'
import { StatCard } from '@/components/data/StatCard'
import { PriorityBadge } from '@/components/domain/PriorityBadge'
import { ReferenceRangeBar } from '@/components/domain/ReferenceRangeBar'
import { ResultValueCell } from '@/components/domain/ResultFlagIndicator'
import { OrderStatusBadge, SampleStatusBadge } from '@/components/domain/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Surface,
  SurfaceHeader,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  useToast,
} from '@/components/ui'
import {
  ApiError,
  ORDER_STATUS_LABELS,
  SAMPLE_PIPELINE,
  type OrderStatus,
  type ResultFlag,
} from '@/types'

const swatches: Array<{ name: string; token: string; fg?: string }> = [
  { name: 'canvas', token: 'var(--canvas)' },
  { name: 'surface', token: 'var(--surface)' },
  { name: 'surface-2', token: 'var(--surface-2)' },
  { name: 'surface-3', token: 'var(--surface-3)' },
  { name: 'hairline', token: 'var(--hairline)' },
  { name: 'accent', token: 'var(--accent)', fg: 'var(--fg-on-accent)' },
  { name: 'success', token: 'var(--success)', fg: 'var(--canvas)' },
  { name: 'warning', token: 'var(--warning)', fg: 'var(--canvas)' },
  { name: 'danger', token: 'var(--danger)', fg: 'var(--canvas)' },
]

const flagSamples: Array<{ flag: ResultFlag; value: string; unit: string }> = [
  { flag: 'normal', value: '14.2', unit: 'g/dL' },
  { flag: 'low', value: '10.8', unit: 'g/dL' },
  { flag: 'high', value: '18.6', unit: 'g/dL' },
  { flag: 'critical_low', value: '6.1', unit: 'g/dL' },
  { flag: 'critical_high', value: '22.4', unit: 'g/dL' },
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Surface>
      <SurfaceHeader title={title} description={description} />
      <div className="p-4">{children}</div>
    </Surface>
  )
}

export function StyleGuidePage() {
  const { toast } = useToast()
  const [switchOn, setSwitchOn] = useState(true)

  return (
    <div className="flex max-w-5xl flex-col gap-5">
      <PageHeader
        title="Design system"
        description="Every primitive the application is built from, rendered in the current theme. Toggle light and dark from the top bar to verify both palettes."
        breadcrumbs={[{ label: 'System' }, { label: 'Design system' }]}
      />

      <Section
        title="Colour tokens"
        description="Semantic tokens only. No component reaches for a raw hex value."
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map((swatch) => (
            <div
              key={swatch.name}
              className="overflow-hidden rounded-[var(--radius-control)] border border-hairline"
            >
              <div
                className="flex h-12 items-end p-1.5 text-2xs font-medium"
                style={{ backgroundColor: swatch.token, color: swatch.fg ?? 'var(--fg-muted)' }}
              >
                {swatch.name}
              </div>
              <div className="border-t border-hairline bg-surface px-1.5 py-1 font-mono text-2xs text-fg-muted">
                {swatch.name}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="Inter Variable with tabular, slashed-zero numerals throughout."
      >
        <div className="flex flex-col gap-2.5">
          <p className="text-2xl font-semibold tracking-tight">Complete Blood Count</p>
          <p className="text-xl font-semibold tracking-tight">Complete Blood Count</p>
          <p className="text-lg font-semibold">Complete Blood Count</p>
          <p className="text-base">Body text at 16px, used for report prose.</p>
          <p className="text-sm">Base UI text at 14px, the density baseline.</p>
          <p className="text-13">Dense UI text at 13px, used inside tables and controls.</p>
          <p className="text-xs text-fg-muted">Supporting text at 12px.</p>
          <p className="text-2xs uppercase tracking-wider text-fg-disabled">Section label at 11px</p>
          <p className="mt-1 tabular-nums">
            0123456789 · 10.80 · 1,204 · 0.019 — numerals align in columns
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">
              <Plus /> New order
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">
              <Trash2 /> Cancel order
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Download report">
              <Download />
            </Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section
        title="Form controls"
        description="Labels, hints and errors are wired through aria-describedby and role=alert."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Patient name" required hint="As printed on the government ID.">
            <Input placeholder="Full name" />
          </Field>
          <Field label="Mobile number" error="Enter a valid 10-digit mobile number">
            <Input defaultValue="98123" inputMode="numeric" />
          </Field>
          <Field label="Search tests" srOnlyLabel>
            <Input placeholder="Search tests" leading={<Search />} />
          </Field>
          <Field label="Sample type">
            <Select defaultValue="blood_serum">
              <SelectTrigger>
                <SelectValue placeholder="Select a sample type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood_edta">Whole blood (EDTA)</SelectItem>
                <SelectItem value="blood_serum">Serum</SelectItem>
                <SelectItem value="urine">Urine</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Clinical notes" className="sm:col-span-2">
            <Textarea placeholder="Allergies, chronic conditions, current medication" />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-hairline pt-4">
          <label className="flex items-center gap-2 text-13">
            <Checkbox defaultChecked /> Fasting confirmed
          </label>
          <RadioGroup defaultValue="routine" className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-13">
              <RadioGroupItem value="routine" /> Routine
            </label>
            <label className="flex items-center gap-2 text-13">
              <RadioGroupItem value="stat" /> STAT
            </label>
          </RadioGroup>
          <label className="flex items-center gap-2 text-13">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} /> Notify on critical results
          </label>
        </div>
      </Section>

      <Section
        title="Diagnostic result flags"
        description="Letter flag, directional glyph and colour — three signals, never colour alone."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-13">
            <caption className="sr-only">Example result values and their flags</caption>
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-fg-muted">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Analyte
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Result
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Reference range
                </th>
              </tr>
            </thead>
            <tbody>
              {flagSamples.map((sample) => (
                <tr key={sample.flag} className="border-b border-hairline last:border-0">
                  <td className="row-h pr-3 text-fg-secondary">Haemoglobin</td>
                  <td className="row-h pr-3">
                    <ResultValueCell value={sample.value} unit={sample.unit} flag={sample.flag} />
                  </td>
                  <td className="row-h w-40 pr-3 py-2">
                    <ReferenceRangeBar
                      value={Number(sample.value)}
                      range={{ low: 13, high: 17, criticalLow: 7, criticalHigh: 21 }}
                      flag={sample.flag}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Statuses" description="Each status carries a distinct icon and a text label.">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PIPELINE.map((status) => (
              <SampleStatusBadge key={status} status={status} />
            ))}
            <SampleStatusBadge status="rejected" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
              <OrderStatusBadge key={status} status={status} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority="routine" />
            <PriorityBadge priority="urgent" />
            <PriorityBadge priority="stat" />
            <Badge tone="accent">Accent</Badge>
            <Badge tone="neutral">Neutral</Badge>
          </div>
        </div>
      </Section>

      <Section title="Metrics">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tests today" value="248" delta={12.4} deltaLabel="vs last week" />
          <StatCard
            label="Pending results"
            value="37"
            delta={8.2}
            deltaLabel="vs last week"
            higherIsBetter={false}
          />
          <StatCard
            label="Avg. turnaround"
            value="4h 12m"
            delta={-6.1}
            deltaLabel="vs last week"
            higherIsBetter={false}
          />
          <StatCard label="Revenue" value="₹1,84,200" loading />
        </div>
      </Section>

      <Section title="Data states" description="Every data view resolves to exactly one of these.">
        <Tabs defaultValue="loading">
          <TabsList>
            <TabsTrigger value="loading">Loading</TabsTrigger>
            <TabsTrigger value="empty">Empty</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
          <TabsContent value="loading">
            <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
              <span className="sr-only">Loading results</span>
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </TabsContent>
          <TabsContent value="empty">
            <EmptyState
              compact
              title="No samples match these filters"
              description="Try widening the date range or clearing the status filter."
              action={<Button variant="secondary">Clear filters</Button>}
            />
          </TabsContent>
          <TabsContent value="error">
            <ErrorState
              compact
              error={
                new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'The analyser interface did not respond.')
              }
              onRetry={() => toast({ tone: 'info', title: 'Retrying request' })}
            />
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        title="Overlays"
        description="Focus is trapped and restored by Radix; Escape closes every one."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject sample SMP-88214006</DialogTitle>
                <DialogDescription>
                  Rejecting a sample notifies the front desk and requests a recollection.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Field label="Reason" required>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haemolysed">Haemolysed</SelectItem>
                      <SelectItem value="insufficient">Insufficient volume</SelectItem>
                      <SelectItem value="clotted">Clotted specimen</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </DialogBody>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="danger">Reject sample</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Tooltip content="Turnaround is measured from sample receipt to verified result.">
            <Button variant="secondary">Hover for tooltip</Button>
          </Tooltip>

          <Button
            variant="secondary"
            onClick={() =>
              toast({
                tone: 'success',
                title: 'Results saved',
                description: '8 values recorded for CBC.',
              })
            }
          >
            Show toast
          </Button>
        </div>
      </Section>
    </div>
  )
}
