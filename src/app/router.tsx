import { Navigate, createBrowserRouter, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { StyleGuidePage } from '@/pages/StyleGuidePage'
import { RequireAuth, RequirePermission } from './guards'
import { RoleLanding } from './RoleLanding'
import type { Permission } from '@/types'

/** Wraps a placeholder screen in the permission its real version will use. */
function guarded(permission: Permission, element: React.ReactNode) {
  return <RequirePermission permission={permission}>{element}</RequirePermission>
}

/** Stands in for the Phase 9 print view by returning to the report itself. */
function PrintRouteFallback() {
  const { reportId } = useParams()
  return <Navigate to={reportId ? `/reports/${reportId}` : '/reports'} replace />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <RoleLanding /> },

      {
        path: 'dashboard',
        element: guarded(
          'order:read',
          <PlaceholderPage
            title="Dashboard"
            description="Role-specific operational overview: today's volume, queue depth and what needs attention now."
            phase="Phase 3"
          />,
        ),
      },

      {
        path: 'patients',
        element: guarded(
          'patient:read',
          <PlaceholderPage
            title="Patients"
            description="Searchable, filterable and sortable patient register with pagination."
            phase="Phase 4"
          />,
        ),
      },
      {
        path: 'patients/new',
        element: guarded(
          'patient:write',
          <PlaceholderPage
            title="Register patient"
            description="Validated registration form."
            phase="Phase 4"
          />,
        ),
      },
      {
        path: 'patients/:patientId',
        element: guarded(
          'patient:read',
          <PlaceholderPage
            title="Patient profile"
            description="Demographics, clinical notes and a full history timeline."
            phase="Phase 4"
          />,
        ),
      },
      {
        path: 'patients/:patientId/edit',
        element: guarded(
          'patient:write',
          <PlaceholderPage
            title="Edit patient"
            description="Validated edit form."
            phase="Phase 4"
          />,
        ),
      },

      {
        path: 'catalogue',
        element: guarded(
          'catalogue:read',
          <PlaceholderPage
            title="Test catalogue"
            description="Categorised directory with sample type, turnaround time, reference ranges and pricing."
            phase="Phase 5"
          />,
        ),
      },
      {
        path: 'catalogue/:testId',
        element: guarded(
          'catalogue:read',
          <PlaceholderPage
            title="Test detail"
            description="Analytes, reference range variants, preparation and pricing."
            phase="Phase 5"
          />,
        ),
      },

      {
        path: 'orders',
        element: guarded(
          'order:read',
          <PlaceholderPage
            title="Orders"
            description="Order register with status and priority filters."
            phase="Phase 6"
          />,
        ),
      },
      {
        path: 'orders/new',
        element: guarded(
          'order:create',
          <PlaceholderPage
            title="New order"
            description="Test selection with live pricing, turnaround estimation and referring doctor."
            phase="Phase 6"
          />,
        ),
      },
      {
        path: 'orders/:orderId',
        element: guarded(
          'order:read',
          <PlaceholderPage
            title="Order detail"
            description="Per-test status, linked samples and billing summary."
            phase="Phase 6"
          />,
        ),
      },

      {
        path: 'samples',
        element: guarded(
          'sample:read',
          <PlaceholderPage
            title="Samples"
            description="Pipeline board and table views across the sample lifecycle."
            phase="Phase 7"
          />,
        ),
      },
      {
        path: 'samples/:sampleId',
        element: guarded(
          'sample:read',
          <PlaceholderPage
            title="Sample detail"
            description="Chain of custody timeline and status transitions."
            phase="Phase 7"
          />,
        ),
      },

      {
        path: 'worklist',
        element: guarded(
          'worklist:read',
          <PlaceholderPage
            title="Worklist"
            description="Pending test queue ordered by priority and time to due."
            phase="Phase 8"
          />,
        ),
      },
      {
        path: 'worklist/:orderTestId',
        element: guarded(
          'result:write',
          <PlaceholderPage
            title="Result entry"
            description="Structured entry with reference ranges, units and automatic abnormal flagging."
            phase="Phase 8"
          />,
        ),
      },

      {
        path: 'reports',
        element: guarded(
          'report:read',
          <PlaceholderPage
            title="Reports"
            description="Verified clinical reports, filterable by patient and date."
            phase="Phase 9"
          />,
        ),
      },
      {
        path: 'reports/:reportId',
        element: guarded(
          'report:read',
          <PlaceholderPage
            title="Clinical report"
            description="Formal report view with verification signatures and print handoff."
            phase="Phase 9"
          />,
        ),
      },

      {
        path: 'analytics',
        element: guarded(
          'analytics:read',
          <PlaceholderPage
            title="Analytics"
            description="Test volume, revenue breakdown, pipeline bottlenecks and top ordered tests."
            phase="Phase 10"
          />,
        ),
      },

      {
        path: 'me',
        element: guarded(
          'patient:read-own',
          <PlaceholderPage
            title="My profile"
            description="Your demographics and registered contact details."
            phase="Phase 4"
          />,
        ),
      },
      {
        path: 'me/reports',
        element: guarded(
          'report:read-own',
          <PlaceholderPage
            title="My reports"
            description="Your test history, live status tracker and downloadable reports."
            phase="Phase 9"
          />,
        ),
      },

      {
        path: 'settings',
        element: guarded(
          'settings:manage',
          <PlaceholderPage
            title="Settings"
            description="Users, reference range overrides and catalogue administration."
            phase="Phase 10"
          />,
        ),
      },

      { path: 'design-system', element: <StyleGuidePage /> },
      { path: '403', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  /**
   * The print route lives outside the app shell: no sidebar, no top bar, just
   * the report on an A4 page. Until Phase 9 builds that view, it sends the user
   * back to the report they asked to print — a relative '..' resolved against
   * the router root instead and dumped them on the dashboard.
   */
  {
    path: '/reports/:reportId/print',
    element: (
      <RequireAuth>
        <PrintRouteFallback />
      </RequireAuth>
    ),
  },
])
