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

    const switchWorkspaceMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.post(`/workspaces/current/${id}`);
        },
        onSuccess: () => {
             // Invalidate current workspace to refetch
            queryClient.invalidateQueries({ queryKey: ['workspaces', 'current'] });
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

    return {
        workspaces: workspacesQuery.data || [],
        currentWorkspace: currentWorkspaceQuery.data,
        isLoading: workspacesQuery.isLoading || currentWorkspaceQuery.isLoading,
        isError: workspacesQuery.isError || currentWorkspaceQuery.isError,
        switchWorkspace: switchWorkspaceMutation.mutate,
        isSwitching: switchWorkspaceMutation.isPending,
        createWorkspace: createWorkspaceMutation,
        updateWorkspace: updateWorkspaceMutation,
    };
};
