import { createContext, useContext, ReactNode } from 'react';
import { kratos } from '@/lib/kratos';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
    id: string;
    verifiable_addresses?: { value: string; verified: boolean }[];
    [key: string]: any;
}

interface ApiUserResult {
    user: UserProfile | null;
    isVerified: boolean;
}

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isError: boolean;
    isVerified: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        data,
        isLoading,
        isError,
    } = useQuery<ApiUserResult>({
        queryKey: ['api-user'],
        queryFn: async (): Promise<ApiUserResult> => {
            try {
                const { data: userData } = await api.get('/user/me');
                const verified = userData?.verifiable_addresses?.some((a: any) => a.verified) ?? false;
                return { user: userData, isVerified: verified };
            } catch (err: any) {
                const status = err.response?.status;
                if (status === 401) {
                    // Not logged in — no session
                    return { user: null, isVerified: false };
                }
                if (status === 403) {
                    // Logged in but not verified — extract user from response if available
                    return { user: err.response?.data?.user ?? {}, isVerified: false };
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
                isLoading,
                isError,
                isVerified: data?.isVerified ?? false,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
