import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Crown,
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

interface Workspace {
  id: string;
  name: string;
  logo?: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  members: number;
  role: 'owner' | 'admin' | 'member';
}

interface WorkspaceMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info';
}

const mockWorkspace: Workspace = {
  id: '1',
  name: 'Acme Corporation',
  logo: '/media/brand-logos/acme.svg',
  plan: 'pro',
  status: 'active',
  members: 24,
  role: 'owner',
};

const workspaceMenuItems: WorkspaceMenuItem[] = [
  {
    id: 'overview',
    title: 'Workspace Overview',
    description: 'Manage your workspace settings and preferences',
    icon: Building2,
    href: '/dashboard/settings/workspace',
  },
  {
    id: 'members',
    title: 'Team Members',
    description: 'Invite, manage, and organize your team',
    icon: Users,
    href: '/dashboard/settings/members',
    badge: '24',
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    description: 'Manage subscriptions, invoices, and payment methods',
    icon: CreditCard,
    href: '/dashboard/settings/billing',
    badge: 'Pro Plan',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect with third-party tools and services',
    icon: Zap,
    href: '/dashboard/settings/integrations',
    badge: '8 Active',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Manage authentication, permissions, and data protection',
    icon: Shield,
    href: '/dashboard/settings/security',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize themes, branding, and visual settings',
    icon: Palette,
    href: '/dashboard/settings/appearance',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email, push, and in-app notifications',
    icon: Bell,
    href: '/dashboard/settings/notifications',
  },
  {
    id: 'regional',
    title: 'Regional Settings',
    description: 'Language, timezone, and localization preferences',
    icon: Globe,
    href: '/dashboard/settings/regional',
  },
];

interface SidebarWorkspaceProps {
  onSwitchToDefault: () => void;
}

export function SidebarWorkspace({ onSwitchToDefault }: SidebarWorkspaceProps) {
  const location = useLocation();
  const { t } = useTranslation();

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
            <AvatarImage src={mockWorkspace.logo} alt={mockWorkspace.name} />
            <AvatarFallback className="text-sm font-semibold">
              {mockWorkspace.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {mockWorkspace.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge
                variant={getPlanBadgeVariant(mockWorkspace.plan)}
                size="sm"
              >
                {mockWorkspace.plan === 'enterprise' && (
                  <Crown className="size-3 mr-1" />
                )}
                {mockWorkspace.plan.charAt(0).toUpperCase() +
                  mockWorkspace.plan.slice(1)}
              </Badge>
              {getStatusIcon(mockWorkspace.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Same style as default sidebar */}
      <nav className="flex-1 p-2 space-y-1">
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
            <AvatarImage src="/media/avatars/300-2.png" alt="User" />
            <AvatarFallback className="text-xs">JD</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">John Doe</span>
        </div>
        <Button variant="ghost" size="sm">
          <LogOut className="size-3 mr-2" />
          {t('layout.workspace.logout')}
        </Button>
      </div>
    </>
  );
}
