import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';
import { ScreenLoader } from './screen-loader';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading, isVerified } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <ScreenLoader />;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isVerified) {
        // Redirect to verification if authenticated but not verified
        // Don't redirect if already on the verification page
        if (location.pathname === '/auth/verification') {
            return <>{children}</>;
        }
        return <Navigate to="/auth/verification" replace />;
    }

    return <>{children}</>;
};
