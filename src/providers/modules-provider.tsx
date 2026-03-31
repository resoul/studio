import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';

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

export function ModulesProvider() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <DashboardModule />
                    </Suspense>
                }
            />
            <Route
                path="/forms/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <FormModule />
                    </Suspense>
                }
            />
            <Route
                path="/tags/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <TagsModule />
                    </Suspense>
                }
            />
            <Route
                path="/fields/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <FieldsModule />
                    </Suspense>
                }
            />
            <Route
                path="/lists/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <ListsModule />
                    </Suspense>
                }
            />
            <Route
                path="/tracking/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <TrackingModule />
                    </Suspense>
                }
            />
            <Route
                path="/storage/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <StorageModule />
                    </Suspense>
                }
            />
            <Route
                path="/automations/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <AutomationModule />
                    </Suspense>
                }
            />
            <Route
                path="/campaigns/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <CampaignModule />
                    </Suspense>
                }
            />
            <Route
                path="/events/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <EventsModule />
                    </Suspense>
                }
            />
            <Route
                path="/settings/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <SettingsModule />
                    </Suspense>
                }
            />
            <Route
                path="/store/*"
                element={
                    <Suspense fallback={<ScreenLoader />}>
                        <StoreModule />
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
    );
}