import { describe, expect, it } from 'vitest';
import { getActivePendingInvites } from '../../src/layout/components/notifications/get-active-pending-invites';
import { PendingWorkspaceInvite } from '../../src/types/auth';

const createInvite = (overrides: Partial<PendingWorkspaceInvite>): PendingWorkspaceInvite => ({
  token: overrides.token ?? 'token-1',
  workspace_id: overrides.workspace_id ?? 'workspace-1',
  workspace_name: overrides.workspace_name ?? 'Workspace',
  workspace_slug: overrides.workspace_slug ?? 'workspace',
  workspace_logo: overrides.workspace_logo ?? '',
  role: overrides.role ?? 'member',
  expires_at: overrides.expires_at ?? '2026-04-08T10:00:00.000Z',
  created_at: overrides.created_at ?? '2026-04-07T10:00:00.000Z',
});

describe('getActivePendingInvites', () => {
  it('returns only invites that are not expired', () => {
    const invites: PendingWorkspaceInvite[] = [
      createInvite({
        token: 'active-1',
        expires_at: '2026-04-08T10:00:00.000Z',
      }),
      createInvite({
        token: 'expired-1',
        expires_at: '2026-04-06T10:00:00.000Z',
      }),
    ];

    const result = getActivePendingInvites(invites, new Date('2026-04-07T12:00:00.000Z'));

    expect(result).toHaveLength(1);
    expect(result[0].token).toBe('active-1');
  });

  it('returns empty array when all invites are expired', () => {
    const invites: PendingWorkspaceInvite[] = [
      createInvite({
        token: 'expired-1',
        expires_at: '2026-04-01T10:00:00.000Z',
      }),
      createInvite({
        token: 'expired-2',
        expires_at: '2026-04-07T11:59:59.000Z',
      }),
    ];

    const result = getActivePendingInvites(invites, new Date('2026-04-07T12:00:00.000Z'));

    expect(result).toEqual([]);
  });
});
