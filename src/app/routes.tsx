import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { Welcome } from '@/screens/Welcome'
import { Home } from '@/screens/Home'
import { History } from '@/screens/History'
import { Profile } from '@/screens/Profile'
import { Assessments } from '@/screens/Assessments'
import { SignIn } from '@/screens/SignIn'
import { Onboarding } from '@/screens/Onboarding'
import { ProfileOverview } from '@/screens/profile/ProfileOverview'
import { ProfileSection } from '@/screens/profile/ProfileSection'
import { AssessmentIntro } from '@/screens/assessment/Intro'
import { AssessmentStep } from '@/screens/assessment/Step'
import { AssessmentReview } from '@/screens/assessment/Review'
import { Analyzing } from '@/screens/assessment/Analyzing'
import { Result } from '@/screens/result/Result'
import { ResultWhy } from '@/screens/result/Why'
import { ResultReliability } from '@/screens/result/Reliability'
import { ResultReport } from '@/screens/result/Report'
import { ResultShare } from '@/screens/result/Share'

/**
 * Route table.
 *
 * `/welcome` is the entry point; `/` is Screen 1 with `/profile`, `/history`
 * and `/assessments` as detail views. `/assessment/*` is Stage 2, whose steps
 * are chosen by the adaptive engine rather than fixed here. `/result/:id` is
 * Stage 3, with its detail views beneath it.
 */
export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<ProfileOverview intent="view" />} />
        <Route path="/profile/update" element={<ProfileOverview intent="update" />} />
        <Route path="/profile/section/:id" element={<ProfileSection />} />
        <Route path="/profile/full" element={<Profile />} />
        <Route path="/assessments" element={<Assessments />} />

        <Route path="/assessment" element={<AssessmentIntro />} />
        <Route path="/assessment/review" element={<AssessmentReview />} />
        <Route path="/assessment/analyzing" element={<Analyzing />} />
        <Route path="/assessment/:step" element={<AssessmentStep />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/result/:id/why" element={<ResultWhy />} />
        <Route path="/result/:id/reliability" element={<ResultReliability />} />
        <Route path="/result/:id/report" element={<ResultReport />} />
        <Route path="/result/:id/share" element={<ResultShare />} />
        <Route path="/result" element={<Navigate to="/result/demo" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
