import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Welcome } from '@/screens/Welcome'
import { Home } from '@/screens/Home'
import { History } from '@/screens/History'
import { Profile } from '@/screens/Profile'
import { Assessments } from '@/screens/Assessments'
import { AssessmentIntro } from '@/screens/assessment/Intro'
import { AssessmentStep } from '@/screens/assessment/Step'
import { AssessmentReview } from '@/screens/assessment/Review'
import { Analyzing } from '@/screens/assessment/Analyzing'
import { ResultPlaceholder } from '@/screens/assessment/ResultPlaceholder'
import { NotBuiltYet } from '@/screens/NotBuiltYet'

/**
 * Route table.
 *
 * `/welcome` is the entry point; `/` is Screen 1 with `/profile`, `/history`
 * and `/assessments` as detail views. `/assessment/*` is Stage 2, whose steps
 * are chosen by the adaptive engine rather than fixed here. `/result` is the
 * Stage 3 placeholder.
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

        <Route path="/assessment" element={<AssessmentIntro />} />
        <Route path="/assessment/review" element={<AssessmentReview />} />
        <Route path="/assessment/analyzing" element={<Analyzing />} />
        <Route path="/assessment/:step" element={<AssessmentStep />} />
        <Route path="/result" element={<ResultPlaceholder />} />

        <Route
          path="/profile/update"
          element={<NotBuiltYet titleKey="updateInformation" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
