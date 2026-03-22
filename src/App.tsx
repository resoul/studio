import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TranslationProvider } from '@/config/i18n/context';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import CreateCampaignPage from '@/pages/CreateCampaignPage';
import CampaignBuilderPage from '@/pages/CampaignBuilderPage';
import ContactsPage from '@/pages/ContactsPage';
import FieldsPage from '@/pages/FieldsPage';
import AutomationsPage from '@/pages/AutomationsPage';
import AutomationBuilderPage from '@/pages/AutomationBuilderPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        <TranslationProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <Routes>
                            <Route
                                path="/"
                                element={<AppLayout><DashboardPage /></AppLayout>}
                            />
                            <Route
                                path="/campaigns/create"
                                element={<AppLayout><CreateCampaignPage /></AppLayout>}
                            />
                            <Route
                                path="/lists"
                                element={<AppLayout><ContactsPage /></AppLayout>}
                            />
                            <Route
                                path="/fields"
                                element={<AppLayout><FieldsPage /></AppLayout>}
                            />
                            {/* ── Automations ── */}
                            <Route
                                path="/automations"
                                element={<AppLayout><AutomationsPage /></AppLayout>}
                            />
                            {/* Builder MUST be outside AppLayout (full-screen canvas) */}
                            <Route
                                path="/automations/:id"
                                element={<AutomationBuilderPage />}
                            />
                            {/* Campaign builder — MUST be before wildcard */}
                            <Route
                                path="/campaigns/:campaignId/content"
                                element={<CampaignBuilderPage />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </TranslationProvider>
    </ThemeProvider>
);

export default App;