import { PendingWorkspaceInvite } from '@/types/auth';

export function getActivePendingInvites(
  invites: PendingWorkspaceInvite[],
  now: Date = new Date(),
): PendingWorkspaceInvite[] {
  return invites.filter((invite) => new Date(invite.expires_at) > now);
}
