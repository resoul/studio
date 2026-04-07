import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ScreenLoader } from './screen-loader';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const {
        user,
        isLoading,
        isVerified,
        isOnboarded,
        profileCompleted,
        hasWorkspaces,
    } = useAuth();
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
        const returnTo = new URLSearchParams(location.search).get('return_to') ?? location.pathname;
        const isInvitePath = returnTo.startsWith('/invites/') || location.pathname.startsWith('/invites/');

        if (!profileCompleted) {
            if (location.pathname.startsWith('/onboarding/profile')) {
                return <>{children}</>;
            }
            return (
                <Navigate
                    to={`/onboarding/profile${isInvitePath ? `?return_to=${encodeURIComponent(returnTo)}` : ''}`}
                    replace
                />
            );
        }

        if (!hasWorkspaces) {
            if (location.pathname.startsWith('/onboarding/workspace')) {
                return <>{children}</>;
            }
            return <Navigate to="/onboarding/workspace" replace />;
        }

        if (location.pathname.startsWith('/onboarding/workspace-select')) {
            return <>{children}</>;
        }
        return <Navigate to="/onboarding/workspace-select" replace />;
    }

    return <>{children}</>;
};
