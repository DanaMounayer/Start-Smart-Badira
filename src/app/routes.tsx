import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Welcome } from '@/screens/Welcome'

/**
 * Route table. The three product screens will be added here:
 *   /profile  -> pregnancy profile / dashboard
 *   /assess   -> adaptive predictive assessment
 *   /result   -> Risk x Reliability x Time result
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
