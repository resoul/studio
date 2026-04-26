import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/auth/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import { ModulesProvider } from './providers/modules-provider';
import { ThemeProvider } from './providers/theme-provider';
import { SettingsProvider } from './providers/settings-provider';
import { QueryProvider } from './providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipsProvider } from './providers/tooltips-provider';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { AppRouting } from '@/routing/app-routing';

const { BASE_URL } = import.meta.env;

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SettingsProvider>
                    <ThemeProvider>
                        <HelmetProvider>
                            <TooltipsProvider>
                                <QueryProvider>
                                    <LoadingBarContainer>
                                        <BrowserRouter basename={BASE_URL}>
                                            <Toaster />
                                            <ModulesProvider>
                                                <AppRouting />
                                            </ModulesProvider>
                                        </BrowserRouter>
                                    </LoadingBarContainer>
                                </QueryProvider>
                            </TooltipsProvider>
                        </HelmetProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
