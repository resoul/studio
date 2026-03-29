import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';

const DashboardModule = lazy(() => import('@/modules/dashboard'));
const FormModule = lazy(() => import('@/modules/forms'));
const TagsModule = lazy(() => import('@/modules/tags'));
const FieldsModule = lazy(() => import('@/modules/fields'));
const ListsModule = lazy(() => import('@/modules/lists'));
const TrackingModule = lazy(() => import('@/modules/tracking'));
const StorageModule = lazy(() => import('@/modules/storage'));
const AutomationModule = lazy(() => import('@/modules/automations'));
const СampaignModule = lazy(() => import('@/modules/campaigns'));

export function ModulesProvider() {
    return (
        <Routes>
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
                        <СampaignModule />
                    </Suspense>
                }
            />
        </Routes>
    );
}