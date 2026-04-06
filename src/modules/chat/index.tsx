import { Route, Routes } from 'react-router-dom';
import ChatPage from './pages/page';
import { DefaultLayout } from "@/layout";

export default function ChatModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<ChatPage />} />
            </Route>
        </Routes>
    );
}
