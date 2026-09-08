import { ArrowRight } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_USERS } from '@/app/demoUsers'
import { ROLE_HOME } from '@/app/navigation'
import { ROLE_ICONS } from '@/components/domain/RolePill'
import { BrandMark } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from '@/types'

export function LoginPage() {
  const { session, loginAs } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (session) {
    return <Navigate to={from ?? ROLE_HOME[session.user.role] ?? '/dashboard'} replace />
  }

  const handleSelect = (role: Role) => {
    loginAs(role)
    navigate(from ?? ROLE_HOME[role] ?? '/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <BrandMark className="text-accent" />
          <span className="text-13 font-semibold tracking-tight text-fg">Meridian Diagnostics</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-7">
          <h1 className="text-xl font-semibold tracking-tight text-fg">
            Laboratory Information System
          </h1>
          <p className="mt-1.5 max-w-xl text-13 text-fg-muted">
            Choose a role to explore the system. This is a demonstration build running on mock
            data — there are no credentials, and no patient information here is real.
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = ROLE_ICONS[role]
            return (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => handleSelect(role)}
                  className="group flex w-full items-start gap-3 rounded-[var(--radius-surface)] border border-hairline bg-surface p-3.5 text-left transition-colors duration-150 hover:border-accent-border hover:bg-accent-subtle"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-hairline bg-surface-2 text-fg-muted group-hover:border-accent-border group-hover:text-accent">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-13 font-semibold text-fg">{ROLE_LABELS[role]}</span>
                      <ArrowRight
                        className="size-3.5 text-fg-disabled transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-13 leading-snug text-fg-muted">
                      {ROLE_DESCRIPTIONS[role]}
                    </span>
                    <span className="mt-1.5 block text-2xs text-fg-disabled">
                      {DEMO_USERS[role].name}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 text-xs text-fg-disabled">
          Authentication, password handling and session security are implemented by the backend
          team and are deliberately absent from this frontend build.
        </p>
      </main>
    </div>
  )
}
