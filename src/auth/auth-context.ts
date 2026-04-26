import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { AuthModel, UserModel } from './auth-model';

// Create AuthContext with types
export const AuthContext = createContext<{
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    auth?: AuthModel;
    saveAuth: (auth: AuthModel | undefined) => void;
    user?: UserModel;
    setUser: Dispatch<SetStateAction<UserModel | undefined>>;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        password_confirmation: string,
        firstName?: string,
        lastName?: string,
    ) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (
        password: string,
        password_confirmation: string,
    ) => Promise<void>;
    resendVerificationEmail: (email: string) => Promise<void>;
    getUser: () => Promise<UserModel | null>;
    updateProfile: (userData: Partial<UserModel>) => Promise<UserModel>;
    logout: () => void;
    verify: () => Promise<void>;
    isAdmin: boolean;
}>({
    loading: false,
    setLoading: () => {},
    saveAuth: () => {},
    setUser: () => {},
    login: async () => {},
    register: async () => {},
    requestPasswordReset: async () => {},
    resetPassword: async () => {},
    resendVerificationEmail: async () => {},
    getUser: async () => null,
    updateProfile: async () => ({}) as UserModel,
    logout: () => {},
    verify: async () => {},
    isAdmin: false,
});

// Hook definition
export function useAuth() {
    return useContext(AuthContext);
}
