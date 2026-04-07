export interface UserVerifiableAddress {
  id?: string;
  value: string;
  verified: boolean;
  via?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserTraits {
  email?: string;
  name?: {
    first?: string;
    last?: string;
  } | string;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  verifiable_addresses?: UserVerifiableAddress[];
  traits?: UserTraits;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  completed: boolean;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string;
}

export interface PendingWorkspaceInvite {
  token: string;
  workspace_id: string;
  workspace_name: string;
  workspace_slug: string;
  workspace_logo: string;
  role: string;
  expires_at: string;
  created_at: string;
}

export interface ApiUserMeResponse {
  identity: UserProfile;
  profile?: Profile;
  workspaces?: Workspace[];
  onboarded?: boolean;
  profile_completed?: boolean;
  has_workspaces?: boolean;
  pending_invites?: PendingWorkspaceInvite[];
}

export interface ApiUserResult {
  user: UserProfile | null;
  profile?: Profile;
  workspaces?: Workspace[];
  pendingInvites: PendingWorkspaceInvite[];
  profileCompleted: boolean;
  hasWorkspaces: boolean;
  isVerified: boolean;
  isOnboarded: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  profile?: Profile;
  workspaces?: Workspace[];
  pendingInvites: PendingWorkspaceInvite[];
  profileCompleted: boolean;
  hasWorkspaces: boolean;
  isLoading: boolean;
  isError: boolean;
  isVerified: boolean;
  isOnboarded: boolean;
  logout: () => Promise<void>;
}
