import {
    BriefcaseBusiness,
    Building2,
    CheckSquare,
    CircleEllipsis,
    GalleryVerticalEnd,
    Home,
    Users,
    FormInput,
    Tag,
    Radio,
    HardDrive,
    Zap,
    Mails,
    Database
} from 'lucide-react';

import { NavConfig } from './types';

export const MAIN_NAV: NavConfig = [
    {
        title: 'Dashboard',
        icon: Home,
        path: '/dashboard/dashboard',
        id: 'dashboard',
    },
    {
        title: 'Campaigns',
        icon: Mails,
        path: '/campaigns/create',
        id: 'campaigns-main',
    },
    {
        title: 'Automations',
        icon: Zap,
        path: '/automations/automations',
        id: 'automations-main',
    },
    {
        title: 'Forms',
        icon: FormInput,
        path: '/forms/main',
        id: 'form-main',
    },
    {
        title: 'Tags',
        icon: Tag,
        path: '/tags/lists',
        id: 'tags-main',
    },
    {
        title: 'Lists',
        icon: Users,
        path: '/lists/contacts',
        id: 'lists-main',
    },
    {
        title: 'Site & Events',
        icon: Radio,
        path: '/tracking/tracking',
        id: 'tracking-main',
    },
    {
        title: 'Storage',
        icon: HardDrive,
        path: '/storage/storage',
        id: 'storage-main',
    },
    {
        title: 'Field Manager',
        icon: Database,
        path: '/fields/lists',
        id: 'fields-main',
    },
    {
        icon: CheckSquare,
        title: 'Tasks',
        path: '/dashboard/tasks',
        pinnable: true,
        pinned: true,
        badge: '3',
        id: 'tasks',
        more: true,
        new: {
            tooltip: 'New Task',
            path: '/dashboard/tasks/new',
        },
    },
    {
        icon: CheckSquare,
        title: 'Store',
        path: '/store/order-list',
        pinnable: true,
        pinned: true,
        badge: '3',
        id: 'store',
        more: true,
        new: {
            tooltip: 'New Order',
            path: '/store/order-list/new',
        },
    },
    {
        icon: GalleryVerticalEnd,
        title: 'Notes',
        path: '/dashboard/notes',
        pinnable: true,
        pinned: true,
        id: 'notes',
        new: {
            tooltip: 'New Notes',
            path: '/dashboard/notes',
        },
    },
    {
        icon: Users,
        title: 'Contacts',
        path: '/dashboard/contacts',
        pinnable: true,
        pinned: true,
        id: 'contacts',
        new: {
            tooltip: 'New Contact',
            path: '/dashboard/contacts',
        },
    },
    {
        icon: Building2,
        title: 'Companies',
        path: '/dashboard/companies',
        pinnable: true,
        pinned: true,
        id: 'companies',
        new: {
            tooltip: 'New Company',
            path: '/dashboard/companies',
        },
    },

    {
        icon: BriefcaseBusiness,
        title: 'Company',
        path: '/dashboard/company',
        pinnable: true,
        pinned: true,
        id: 'company',
    },

    {
        icon: CircleEllipsis,
        title: 'More',
        id: 'more',
        dropdown: true,
    },
];
