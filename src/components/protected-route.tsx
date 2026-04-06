import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ScreenLoader } from './screen-loader';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading, isVerified, isOnboarded } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <ScreenLoader />;
    }

    if (!user) {
        return <Navigate to={`/auth/login?return_to=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (!isVerified) {
        if (location.pathname.startsWith('/auth')) {
            return <>{children}</>;
        }
        return <Navigate to="/auth/verification" replace />;
    }

    if (!isOnboarded) {
        if (location.pathname.startsWith('/onboarding')) {
            return <>{children}</>;
        }
        // If user has a pending invite, preserve it through onboarding
        const returnTo = new URLSearchParams(location.search).get('return_to') ?? location.pathname;
        const isInvitePath = returnTo.startsWith('/invites/') || location.pathname.startsWith('/invites/');
        return (
            <Navigate
                to={`/onboarding/profile${isInvitePath ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
                replace
            />
        );
    }

    return <>{children}</>;
};
