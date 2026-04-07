import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface MemberInfo {
  workspace_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  last_seen_at?: string | null;
}

export const useMembers = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: async () => {
      if (!workspaceId) return [];
      const { data } = await api.get<MemberInfo[]>(`/workspaces/${workspaceId}/members`);
      return data;
    },
    enabled: !!workspaceId,
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!workspaceId) return;
      await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
    },
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    isError: membersQuery.isError,
    removeMember: removeMemberMutation,
  };
};
