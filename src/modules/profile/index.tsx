import { Navigate, Route, Routes } from 'react-router-dom';
import MePage from "./pages/me";

const ProfileModule = () => (
    <Routes>
        <Route index element={<Navigate to="me" replace />} />
        <Route path="me" element={<MePage />} />
    </Routes>
);

export default ProfileModule;
