import { type PropsWithChildren, useEffect, useState } from 'react';
import { AuthAdapter } from './auth-adapter';
import { AuthContext } from './auth-context';
import * as authHelper from '@/auth/auth-helpers';
import type { AuthModel, UserModel } from './auth-model';

export function AuthProvider({ children }: PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin
    useEffect(() => {
        setIsAdmin(currentUser?.is_admin === true);
    }, [currentUser]);

    const verify = async () => {
        if (auth) {
            try {
                const user = await getUser();
                setCurrentUser(user || undefined);
            } catch {
                saveAuth(undefined);
                setCurrentUser(undefined);
            }
        }
    };

    const saveAuth = (auth: AuthModel | undefined) => {
        setAuth(auth);
        if (auth) {
            authHelper.setAuth(auth);
        } else {
            authHelper.removeAuth();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const auth = await AuthAdapter.login(email, password);
            saveAuth(auth);
            const user = await getUser();
            setCurrentUser(user || undefined);
        } catch (error) {
            saveAuth(undefined);
            throw error;
        }
    };

    const register = async (
        email: string,
        password: string,
        password_confirmation: string,
        firstName?: string,
        lastName?: string,
    ) => {
        try {
            const auth = await AuthAdapter.register(
                email,
                password,
                password_confirmation,
                firstName,
                lastName,
            );
            saveAuth(auth);
            const user = await getUser();
            setCurrentUser(user || undefined);
        } catch (error) {
            saveAuth(undefined);
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        await AuthAdapter.requestPasswordReset(email);
    };

    const resetPassword = async (
        password: string,
        password_confirmation: string,
    ) => {
        await AuthAdapter.resetPassword(password, password_confirmation);
    };

    const resendVerificationEmail = async (email: string) => {
        await AuthAdapter.resendVerificationEmail(email);
    };

    const getUser = async () => {
        return await AuthAdapter.getCurrentUser();
    };

    const updateProfile = async (userData: Partial<UserModel>) => {
        return await AuthAdapter.updateUserProfile(userData);
    };

    const logout = () => {
        AuthAdapter.logout();
        saveAuth(undefined);
        setCurrentUser(undefined);
    };

    return (
        <AuthContext.Provider
            value={{
                loading,
                setLoading,
                auth,
                saveAuth,
                user: currentUser,
                setUser: setCurrentUser,
                login,
                register,
                requestPasswordReset,
                resetPassword,
                resendVerificationEmail,
                getUser,
                updateProfile,
                logout,
                verify,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
