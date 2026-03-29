import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { HelmetProvider } from '@packages/react-helmet-async';
import { TranslationProvider } from '@/config/i18n/context';
import { ModulesProvider } from './providers/modules-provider';

const queryClient = new QueryClient();
const { BASE_URL } = import.meta.env;

const App = () => (
    <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="s22-theme"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
    >
        <TranslationProvider>
            <HelmetProvider>
                <LoadingBarContainer>
                    <QueryClientProvider client={queryClient}>
                        <BrowserRouter basename={BASE_URL}>
                            <Toaster />
                            <ModulesProvider />
                        </BrowserRouter>
                    </QueryClientProvider>
                </LoadingBarContainer>
            </HelmetProvider>
        </TranslationProvider>
    </ThemeProvider>
);

export default App;