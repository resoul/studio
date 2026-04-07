import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { kratos } from '@/lib/kratos';
import api from '@/lib/api';
import { AuthContext } from './auth-context';
import { ApiUserMeResponse, ApiUserResult, UserProfile, UserVerifiableAddress } from '@/types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data,
        isLoading,
        isError,
    } = useQuery<ApiUserResult>({
        queryKey: ['api-user'],
        queryFn: async (): Promise<ApiUserResult> => {
            try {
                const { data: res } = await api.get<ApiUserMeResponse>('/user/me');
                const userData = res.identity;
                const profile = res.profile;
                const workspaces = res.workspaces;
                const profileCompleted = res.profile_completed ?? profile?.completed ?? false;
                const hasWorkspaces = res.has_workspaces ?? ((workspaces?.length ?? 0) > 0);
                const pendingInvites = res.pending_invites ?? [];
                const onboarded = res.onboarded ?? (profileCompleted && hasWorkspaces);

                const verified = userData?.verifiable_addresses?.some((a: UserVerifiableAddress) => a.verified) ?? false;
                
                return { 
                    user: userData, 
                    profile, 
                    workspaces,
                    pendingInvites,
                    profileCompleted,
                    hasWorkspaces,
                    isVerified: verified, 
                    isOnboarded: onboarded 
                };
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 401) {
                        return {
                            user: null,
                            pendingInvites: [],
                            profileCompleted: false,
                            hasWorkspaces: false,
                            isVerified: false,
                            isOnboarded: false,
                        };
                    }
                    if (status === 403) {
                        const userFromRes = (err.response?.data as { user?: UserProfile })?.user ?? null;
                        return {
                            user: userFromRes,
                            pendingInvites: [],
                            profileCompleted: false,
                            hasWorkspaces: false,
                            isVerified: false,
                            isOnboarded: false,
                        };
                    }
                }
                throw err;
            }
        },
        retry: false,
    });

    const logout = async () => {
        try {
            const { data: logoutData } = await kratos.createBrowserLogoutFlow();
            window.location.href = logoutData.logout_url;
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: data?.user ?? null,
                profile: data?.profile,
                workspaces: data?.workspaces,
                pendingInvites: data?.pendingInvites ?? [],
                profileCompleted: data?.profileCompleted ?? false,
                hasWorkspaces: data?.hasWorkspaces ?? false,
                isLoading,
                isError,
                isVerified: data?.isVerified ?? false,
                isOnboarded: data?.isOnboarded ?? false,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
