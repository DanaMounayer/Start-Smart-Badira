import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Home } from '@/screens/Home'
import { History } from '@/screens/History'
import { Profile } from '@/screens/Profile'
import { NotBuiltYet } from '@/screens/NotBuiltYet'

/**
 * Route table.
 *
 * `/` is Screen 1. `/history` and `/profile` are its progressive-disclosure
 * detail views. The adaptive assessment (Screen 2) and the
 * Risk x Reliability x Time result (Screen 3) take over their placeholders
 * when they are built.
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
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
