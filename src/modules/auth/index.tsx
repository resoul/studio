import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";

const AuthModule = () => (
    <Routes>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
    </Routes>
);

export default AuthModule;
