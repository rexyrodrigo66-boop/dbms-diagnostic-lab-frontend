import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-3 text-fg-secondary border-hairline-strong',
  accent: 'bg-accent-subtle text-accent border-accent-border',
  success: 'bg-success-bg text-success border-success-border',
  warning: 'bg-warning-bg text-warning border-warning-border',
  danger: 'bg-danger-bg text-danger border-danger-border',
  info: 'bg-info-bg text-info border-info-border',
  purple:
    'bg-[var(--status-received-bg)] text-[var(--status-received)] border-[var(--status-received)]/25',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  /** A leading glyph. Badges never rely on colour alone to carry meaning. */
  icon?: ReactNode
}

export function Badge({ className, tone = 'neutral', icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-control)] border',
        'px-1.5 py-0.5 text-2xs font-medium whitespace-nowrap',
        '[&_svg]:size-3 [&_svg]:shrink-0',
        tones[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}
