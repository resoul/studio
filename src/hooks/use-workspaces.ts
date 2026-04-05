import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo_url: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface WorkspaceConfig {
    user_id: string;
    workspace_id: string;
    language: string;
    theme: string;
    is_current: boolean;
}

export interface WorkspaceInvite {
    token: string;
    workspace_id: string;
    email: string;
    role: string;
    expires_at: string;
    created_at: string;
}

export const useWorkspaces = () => {
    const queryClient = useQueryClient();

    const workspacesQuery = useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const { data } = await api.get<Workspace[]>('/workspaces');
            return data;
        },
    });

    const currentWorkspaceQuery = useQuery({
        queryKey: ['workspaces', 'current'],
        queryFn: async () => {
            const { data } = await api.get<Workspace>('/workspaces/current');
            return data;
        },
    });

    const workspaceConfigQuery = useQuery({
        queryKey: ['workspaces', 'config'],
        queryFn: async () => {
            const { data } = await api.get<WorkspaceConfig>('/workspaces/config');
            return data;
        },
    });

    const switchWorkspaceMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/workspaces/current/${id}`);
        },
        onSuccess: () => {
             // Invalidate current workspace and config to refetch
            queryClient.invalidateQueries({ queryKey: ['workspaces', 'current'] });
            queryClient.invalidateQueries({ queryKey: ['workspaces', 'config'] });
        },
    });

    const createWorkspaceMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post<Workspace>('/workspaces', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });

    const updateWorkspaceMutation = useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            const { data } = await api.patch<Workspace>(`/workspaces/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            if (data.id === currentWorkspaceQuery.data?.id) {
                queryClient.invalidateQueries({ queryKey: ['workspaces', 'current'] });
            }
        },
    });

    const updateConfigMutation = useMutation({
        mutationFn: async ({ id, language, theme }: { id: string; language?: string; theme?: string }) => {
            await api.patch(`/workspaces/config/${id}`, { language, theme });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', 'config'] });
        },
    });

    const inviteUserMutation = useMutation({
        mutationFn: async ({ workspaceId, email, role, sendEmail }: { workspaceId: string; email: string; role: string; sendEmail: boolean }) => {
            const { data } = await api.post<WorkspaceInvite>(`/workspaces/${workspaceId}/invites`, { email, role, send_email: sendEmail });
            return data;
        },
        onSuccess: (_, { workspaceId }) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'invites'] });
        },
    });

    const resendInviteMutation = useMutation({
        mutationFn: async ({ workspaceId, email }: { workspaceId: string; email: string }) => {
            const { data } = await api.post<WorkspaceInvite>(`/workspaces/${workspaceId}/invites/resend`, { email });
            return data;
        },
        onSuccess: (_, { workspaceId }) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'invites'] });
        },
    });

    const revokeInviteMutation = useMutation({
        mutationFn: async ({ workspaceId, email }: { workspaceId: string; email: string }) => {
            await api.delete(`/workspaces/${workspaceId}/invites/${email}`);
        },
        onSuccess: (_, { workspaceId }) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'invites'] });
        },
    });

    const useInvites = (workspaceId?: string) => {
        return useQuery({
            queryKey: ['workspaces', workspaceId, 'invites'],
            queryFn: async () => {
                if (!workspaceId) return [];
                const { data } = await api.get<WorkspaceInvite[]>(`/workspaces/${workspaceId}/invites`);
                return data;
            },
            enabled: !!workspaceId,
        });
    };

    return {
        workspaces: workspacesQuery.data || [],
        currentWorkspace: currentWorkspaceQuery.data,
        config: workspaceConfigQuery.data,
        isLoading: workspacesQuery.isLoading || currentWorkspaceQuery.isLoading || workspaceConfigQuery.isLoading,
        isError: workspacesQuery.isError || currentWorkspaceQuery.isError || workspaceConfigQuery.isError,
        switchWorkspace: switchWorkspaceMutation.mutate,
        isSwitching: switchWorkspaceMutation.isPending,
        createWorkspace: createWorkspaceMutation,
        updateWorkspace: updateWorkspaceMutation,
        updateConfig: updateConfigMutation.mutate,
        inviteUser: inviteUserMutation,
        resendInvite: resendInviteMutation,
        revokeInvite: revokeInviteMutation,
        useInvites,
    };
};
