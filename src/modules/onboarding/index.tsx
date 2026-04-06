import { Route, Routes, Navigate } from 'react-router-dom';
import OnboardingProfilePage from './pages/profile/page';
import OnboardingWorkspacePage from './pages/workspace/page';
import OnboardingWorkspaceSelectPage from './pages/workspace-select/page';

export default function OnboardingRoutes() {
    return (
        <Routes>
            <Route path="/profile" element={<OnboardingProfilePage />} />
            <Route path="/workspace" element={<OnboardingWorkspacePage />} />
            <Route path="/workspace-select" element={<OnboardingWorkspaceSelectPage />} />
            <Route index element={<Navigate to="/onboarding/profile" replace />} />
        </Routes>
    );
}
