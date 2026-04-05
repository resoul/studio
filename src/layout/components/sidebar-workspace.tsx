import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Globe,
  LogOut,
  Palette,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useWorkspaces } from '@/hooks/use-workspaces';

import { useAuth } from '@/hooks/use-auth';
import { useCallback } from 'react';

interface WorkspaceMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

const workspaceMenuItems: WorkspaceMenuItem[] = [
  {
    id: 'overview',
    title: 'Workspace Overview',
    description: 'Manage your workspace settings and preferences',
    icon: Building2,
    href: '/settings/workspace',
  },
  {
    id: 'members',
    title: 'Team Members',
    description: 'Invite, manage, and organize your team',
    icon: Users,
    href: '/settings/members',
    badge: '24',
    variant: 'secondary',
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    description: 'Manage subscriptions, invoices, and payment methods',
    icon: CreditCard,
    href: '/settings/billing',
    badge: 'Pro Plan',
    variant: 'primary',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect with third-party tools and services',
    icon: Zap,
    href: '/settings/integrations',
    badge: '8 Active',
    variant: 'success',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Manage authentication, permissions, and data protection',
    icon: Shield,
    href: '/settings/security',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize themes, branding, and visual settings',
    icon: Palette,
    href: '/settings/appearance',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email, push, and in-app notifications',
    icon: Bell,
    href: '/settings/notifications',
  },
  {
    id: 'regional',
    title: 'Regional Settings',
    description: 'Language, timezone, and localization preferences',
    icon: Globe,
    href: '/settings/regional',
  },
];

interface SidebarWorkspaceProps {
  onSwitchToDefault: () => void;
}

export function SidebarWorkspace({ onSwitchToDefault }: SidebarWorkspaceProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { currentWorkspace } = useWorkspaces();
  const { logout, profile } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'destructive';
      case 'pro':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="size-3 text-emerald-500" />;
      case 'trial':
        return <AlertCircle className="size-3 text-amber-500" />;
      default:
        return <AlertCircle className="size-3 text-red-500" />;
    }
  };

  if (!currentWorkspace) return null;

  return (
    <>
      {/* Header - Same style as default sidebar */}
      <div className="group flex justify-between items-center gap-2.5 border-b border-border h-(--sidebar-header-height) shrink-0 px-2.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchToDefault}
            className="flex items-center gap-2 text-sm hover:bg-accent"
          >
            <ChevronLeft className="size-4" />
            <span className="in-data-[sidebar-collapsed]:hidden">
              {t('layout.workspace.backToCrm')}
            </span>
          </Button>
        </div>
      </div>

      {/* Workspace Info - Compact version */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="size-8">
            <AvatarImage src={currentWorkspace.logo_url} alt={currentWorkspace.name} />
            <AvatarFallback className="text-sm font-semibold">
               {currentWorkspace.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {currentWorkspace.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge
                variant={getPlanBadgeVariant('pro')} // Mocking plan for now
                size="sm"
              >
                Pro
              </Badge>
              {getStatusIcon('active')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Same style as default sidebar */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {workspaceMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                   ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <Icon className="size-4" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{item.title}</span>
                  {item.badge && (
                    <Badge variant={item.variant || 'secondary'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Same style as default sidebar */}
      <div className="flex items-center justify-between p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={profile?.avatar_url} alt={`${profile?.first_name} ${profile?.last_name}`} />
            <AvatarFallback className="text-xs uppercase">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[100px]">
            {profile?.first_name} {profile?.last_name}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={handleLogout}
        >
          <LogOut className="size-3 mr-2" />
          {t('layout.workspace.logout')}
        </Button>
      </div>
    </>
  );
}

