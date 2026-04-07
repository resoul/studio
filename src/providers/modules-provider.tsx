import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { ProtectedRoute } from '@/components/protected-route';
import { GlobalChatNotifications } from '@/components/global-chat-notifications';
import { GlobalInviteRealtimeSync } from '@/components/global-invite-realtime-sync';

const DashboardModule = lazy(() => import('@/modules/dashboard'));
const FormModule = lazy(() => import('@/modules/forms'));
const TagsModule = lazy(() => import('@/modules/tags'));
const FieldsModule = lazy(() => import('@/modules/fields'));
const ListsModule = lazy(() => import('@/modules/lists'));
const TrackingModule = lazy(() => import('@/modules/tracking'));
const StorageModule = lazy(() => import('@/modules/storage'));
const AutomationModule = lazy(() => import('@/modules/automations'));
const CampaignModule = lazy(() => import('@/modules/campaigns'));
const EventsModule = lazy(() => import('@/modules/events'));
const SettingsModule = lazy(() => import('@/modules/settings'));
const StoreModule = lazy(() => import('@/modules/store'));
const ErrorModule = lazy(() => import('@/modules/errors'));
const AuthModule = lazy(() => import('@/modules/auth'));
const OnboardingModule = lazy(() => import('@/modules/onboarding'));
const WorkspacesModule = lazy(() => import('@/modules/workspaces'));
const ChatModule = lazy(() => import('@/modules/chat'));
const WorkspaceInvitePage = lazy(() => import('@/modules/workspaces/pages/invite/page'));

export function ModulesProvider() {
    return (
        <>
            {/*
                Renderless — listens to WS events and fires toast notifications.
                Placed here so it has Router + Auth + Realtime context.
                Only shows toasts when the user is authenticated (useWorkspaces
                returns nothing until auth resolves).
            */}
            <GlobalChatNotifications />
            <GlobalInviteRealtimeSync />

            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                    path="/invites/:token"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <WorkspaceInvitePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/auth/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <AuthModule />
                        </Suspense>
                    }
                />
                <Route
                    path="/onboarding/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <OnboardingModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/dashboard/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <DashboardModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/forms/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <FormModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/tags/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <TagsModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/fields/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <FieldsModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/lists/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <ListsModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/tracking/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <TrackingModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/storage/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <StorageModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/automations/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <AutomationModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/campaigns/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <CampaignModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/events/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <EventsModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/settings/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <SettingsModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/chat/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <ChatModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/store/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ProtectedRoute>
                                <StoreModule />
                            </ProtectedRoute>
                        </Suspense>
                    }
                />
                <Route
                    path="/workspaces/*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <WorkspacesModule />
                        </Suspense>
                    }
                />
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<ScreenLoader />}>
                            <ErrorModule />
                        </Suspense>
                    }
                />
            </Routes>
        </>
    );
}
