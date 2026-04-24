import { lazy, Suspense } from 'react';
import { ScreenLoader } from '@/components/screen-loader';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from './auth-provider';

const AuthModule = lazy(() => import('@/modules/auth'));
const ProfileModule = lazy(() => import('@/modules/profile'));
const ErrorModule = lazy(() => import('@/modules/errors'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return <ScreenLoader />;
    }

    if (!session) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
}

export function ModulesProvider() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route
                    path="/auth/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <AuthModule />
                        </Suspense>
                    }
                />
                <Route
                    path="/profile/*"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<ScreenLoader />}>
                                <ProfileModule />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ErrorModule />
                        </Suspense>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}