import { getData, setData } from '@/lib/storage';
import type { AuthModel } from './auth-model';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
    import.meta.env.VITE_APP_VERSION || '1.0'
}`;

/**
 * Get stored auth information from local storage
 */
const getAuth = (): AuthModel | undefined => {
    try {
        return getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;
    } catch (error) {
        console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
    }
};

/**
 * Save auth information to local storage
 */
const setAuth = (auth: AuthModel) => {
    setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

/**
 * Remove auth information from local storage
 */
const removeAuth = () => {
    if (!localStorage) {
        return;
    }

    try {
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
    }
};

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
