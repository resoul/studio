import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { MainLayout } from '@/layouts/main/layout';
import {
    AuthAccountDeactivatedPage,
    AuthWelcomeMessagePage,
    AuthGetStartedPage
} from '@/pages/auth';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingSetup() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<MainLayout />}>
                    <Route
                        path="/auth/welcome-message"
                        element={<AuthWelcomeMessagePage />}
                    />
                    <Route
                        path="/auth/account-deactivated"
                        element={<AuthAccountDeactivatedPage />}
                    />
                    <Route path="/auth/get-started" element={<AuthGetStartedPage />} />
                </Route>
            </Route>
            <Route path="error/*" element={<ErrorRouting />} />
            <Route path="auth/*" element={<AuthRouting />} />
            <Route path="*" element={<Navigate to="/error/404" />} />
        </Routes>
    );
}
