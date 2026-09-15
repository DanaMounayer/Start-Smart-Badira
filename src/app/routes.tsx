import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Dashboard } from '@/screens/Dashboard'
import { NotBuiltYet } from '@/screens/NotBuiltYet'

/**
 * Route table.
 *
 * `/` is Screen 1. The adaptive assessment (Screen 2) and the
 * Risk x Reliability x Time result (Screen 3) take over their placeholder
 * routes when they are built.
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/assessment"
          element={<NotBuiltYet titleKey="startAssessment" />}
        />
        <Route
          path="/profile/update"
          element={<NotBuiltYet titleKey="updateInformation" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
