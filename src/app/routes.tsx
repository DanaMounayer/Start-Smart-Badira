import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Welcome } from '@/screens/Welcome'
import { Home } from '@/screens/Home'
import { History } from '@/screens/History'
import { Profile } from '@/screens/Profile'
import { Assessments } from '@/screens/Assessments'
import { NotBuiltYet } from '@/screens/NotBuiltYet'

/**
 * Route table.
 *
 * `/welcome` is the entry point (sign in / continue as guest); `/` is Screen 1
 * with `/profile`, `/history` and `/assessments` as its detail views. The
 * adaptive assessment (Stage 2) and the Risk x Reliability x Time result
 * (Stage 3) take over their placeholders when they are built.
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/assessment" element={<NotBuiltYet titleKey="startAssessment" />} />
        <Route
          path="/profile/update"
          element={<NotBuiltYet titleKey="updateInformation" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
