import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

const LoginPage = lazy(() => import('./pages/login'));
const RegistrationPage = lazy(() => import('./pages/registration'));
const VerificationPage = lazy(() => import('./pages/verification'));
const RecoveryPage = lazy(() => import('./pages/recovery'));

const AuthModule = () => (
    <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="verification" element={<VerificationPage />} />
        <Route path="recovery" element={<RecoveryPage />} />
    </Routes>
);

export default AuthModule;
