import type { RouteObject } from 'react-router-dom';
import { ClassicLayout } from './layout';
import { CallbackPage } from './pages/callback-page';
import { ChangePasswordPage } from './pages/change-password-page';
import { CheckEmail } from './pages/extended/check-email';
import { ResetPasswordChanged } from './pages/extended/reset-password-changed';
import { ResetPasswordCheckEmail } from './pages/extended/reset-password-check-email';
import { TwoFactorAuth } from './pages/extended/tfa';
import { ResetPasswordPage } from './pages/reset-password-page';
import { SignInPage } from './pages/signin-page';
import { SignUpPage } from './pages/signup-page';

// Define the auth routes
export const authRoutes: RouteObject[] = [
    {
        path: '',
        element: <ClassicLayout />,
        children: [
            {
                path: 'signin',
                element: <SignInPage />,
            },
            {
                path: 'signup',
                element: <SignUpPage />,
            },
            {
                path: 'change-password',
                element: <ChangePasswordPage />,
            },
            {
                path: 'reset-password',
                element: <ResetPasswordPage />,
            },
            /* Extended examples */
            {
                path: '2fa',
                element: <TwoFactorAuth />,
            },
            {
                path: 'check-email',
                element: <CheckEmail />,
            },
            {
                path: 'reset-password/check-email',
                element: <ResetPasswordCheckEmail />,
            },
            {
                path: 'reset-password/changed',
                element: <ResetPasswordChanged />,
            },
        ],
    },
    {
        path: 'callback',
        element: <CallbackPage />,
    },
];
