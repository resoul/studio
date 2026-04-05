import { useTranslation } from '@/hooks/useTranslation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useMembers } from '@/hooks/use-members';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, Mail, UserPlus, Trash, RotateCcw, XCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Content } from '@/layout/components/content';
import { PageHeader } from "@/modules/settings/pages/members/page-header";
import { SettingsSheet } from '../../components/settings-sheet';

export default function MembersPage() {
  const { t } = useTranslation();
  const { currentWorkspace, inviteUser, resendInvite, revokeInvite, useInvites } = useWorkspaces();
  const { members, removeMember } = useMembers(currentWorkspace?.id);
  const { data: invites = [] } = useInvites(currentWorkspace?.id);

  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  const handleInvite = useCallback(async () => {
    if (!currentWorkspace || !inviteEmail) return;
    try {
      await inviteUser.mutateAsync({
        workspaceId: currentWorkspace.id,
        email: inviteEmail,
        role: inviteRole,
        sendEmail: true,
      });
      toast.success(t('layout.invite.success'));
      setInviteEmail('');
      setIsInviteOpen(false);
    } catch (err) {
      toast.error('Failed to send invitation');
    }
  }, [currentWorkspace, inviteEmail, inviteRole, inviteUser, t]);

  const handleResend = useCallback(async (email: string) => {
    if (!currentWorkspace) return;
    try {
      await resendInvite.mutateAsync({ workspaceId: currentWorkspace.id, email });
      toast.success(t('layout.invite.success'));
    } catch (err) {
      toast.error('Failed to resend invitation');
    }
  }, [currentWorkspace, resendInvite, t]);

  const handleRevoke = useCallback(async (email: string) => {
    if (!currentWorkspace) return;
    try {
      await revokeInvite.mutateAsync({ workspaceId: currentWorkspace.id, email });
      toast.success('Invitation revoked');
    } catch (err) {
      toast.error('Failed to revoke invitation');
    }
  }, [currentWorkspace, revokeInvite]);

  const handleRemoveMember = useCallback(async (userId: string) => {
    if (!confirm(t('layout.members.removeConfirm'))) return;
    try {
      await removeMember.mutateAsync(userId);
      toast.success(t('layout.members.removeSuccess'));
    } catch (err) {
      toast.error('Failed to remove member');
    }
  }, [removeMember, t]);

  return (
    <>
        <PageHeader onCreate={() => {setSettingsSheetOpen(true)}} />
        <div className="container-fluid">
            <Content className="block space-y-6 py-5">
                <div className="flex items-center justify-between">
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t('layout.sidebar.invite')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('layout.invite.title')}</DialogTitle>
                                <DialogDescription>
                                    {t('layout.invite.sendEmail')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('layout.invite.email')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">{t('layout.invite.role')}</Label>
                                    <Select
                                        value={inviteRole}
                                        onValueChange={(v: any) => setInviteRole(v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">{t('layout.invite.role.admin')}</SelectItem>
                                            <SelectItem value="member">{t('layout.invite.role.member')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleInvite} disabled={!inviteEmail || inviteUser.isPending}>
                                    {t('layout.invite.send')}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Active Members */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">{t('layout.members.activeMembers')}</h2>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('layout.sidebar.profile')}</TableHead>
                                    <TableHead>{t('layout.invite.email')}</TableHead>
                                    <TableHead>{t('layout.invite.role')}</TableHead>
                                    <TableHead className="w-[100px] text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.user_id}>
                                        <TableCell className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback className="uppercase">
                                                    {member.first_name?.[0]}{member.last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                      <span className="font-medium">
                        {member.first_name} {member.last_name}
                      </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={member.role === 'admin' ? 'primary' : 'secondary'}>
                                                {member.role === 'admin' ? t('layout.invite.role.admin') : t('layout.invite.role.member')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleRemoveMember(member.user_id)}
                                                        disabled={currentWorkspace?.owner_id === member.user_id}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        {t('layout.members.remove')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pending Invites */}
                {invites.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{t('layout.members.pendingInvites')}</h2>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('layout.invite.email')}</TableHead>
                                        <TableHead>{t('layout.invite.role')}</TableHead>
                                        <TableHead>{t('layout.invites.column.status')}</TableHead>
                                        <TableHead className="w-[100px] text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites.map((invite) => {
                                        const isExpired = new Date(invite.expires_at) < new Date();
                                        return (
                                            <TableRow key={invite.token}>
                                                <TableCell className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {invite.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {invite.role === 'admin' ? t('layout.invite.role.admin') : t('layout.invite.role.member')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={isExpired ? 'destructive' : 'success'}>
                                                        {isExpired ? t('layout.invites.status.expired') : t('layout.invites.status.active')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleResend(invite.email)}>
                                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                                {t('layout.invites.resend')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleRevoke(invite.email)}
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                {t('layout.invites.revoke')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </Content>
        </div>

        {settingsSheetOpen && (
            <SettingsSheet
                open={settingsSheetOpen}
                onOpenChange={() => {setSettingsSheetOpen(true)}}
                onEditClick={() => {console.log('Edit clicked')}}
            />
        )}
    </>
  );
}
