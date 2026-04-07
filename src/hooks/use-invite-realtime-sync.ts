import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePresence } from './use-presence';
import { useAuth } from './use-auth';

export function useInviteRealtimeSync() {
  const { addMessageListener } = usePresence();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      return;
    }

    return addMessageListener((event: unknown) => {
      const envelope = event as Record<string, unknown>;
      if (envelope.type !== 'INVITE') {
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['api-user'] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    });
  }, [addMessageListener, queryClient, user]);
}
