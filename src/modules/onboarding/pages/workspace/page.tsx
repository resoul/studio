import { MouseEvent, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name is too short'),
  slug: z.string().min(2, 'Workspace URL is too short').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens are allowed'),
  description: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

export default function OnboardingWorkspacePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pendingInvites } = useAuth();

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const { watch, setValue } = form;
  const name = watch('name');

  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [name, setValue]);

  const onSubmit = async (values: WorkspaceFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    if (values.description) formData.append('description', values.description);

    try {
      await api.post('/workspaces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Workspace created successfully');
      await queryClient.invalidateQueries({ queryKey: ['api-user'] });
      navigate('/');
    } catch (error) {
      toast.error('Failed to create workspace');
      console.error(error);
    }
  };

  const { mutate: acceptInvite, isPending: isAcceptInvitePending } = useMutation({
    mutationFn: async (token: string) => {
      await api.post(`/workspaces/invites/${token}/accept`);
    },
    onSuccess: async () => {
      toast.success(t('onboarding.workspace.joinSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['api-user'] });
      navigate('/', { replace: true });
    },
    onError: () => {
      toast.error(t('onboarding.workspace.joinError'));
    },
  });

  const handleAcceptInvite = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const token = event.currentTarget.dataset.token;
    if (!token) {
      return;
    }
    acceptInvite(token);
  }, [acceptInvite]);

  const getRoleLabel = useCallback((role: string) => {
    if (role === 'admin') {
      return t('layout.invite.role.admin');
    }
    return t('layout.invite.role.member');
  }, [t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-xl shadow-lg border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('onboarding.workspace.title')}
          </CardTitle>
          <CardDescription>
            {t('onboarding.workspace.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {pendingInvites.length > 0 && (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  {t('onboarding.workspace.pendingInvitesTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('onboarding.workspace.pendingInvitesDescription')}
                </p>
              </div>
              <div className="space-y-2">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.token}
                    className="flex items-center justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={invite.workspace_logo} alt={invite.workspace_name} />
                        <AvatarFallback>{invite.workspace_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{invite.workspace_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t('onboarding.workspace.inviteRole')}: {getRoleLabel(invite.role)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t('onboarding.workspace.inviteExpires')}: {new Date(invite.expires_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      data-token={invite.token}
                      onClick={handleAcceptInvite}
                      disabled={isAcceptInvitePending || form.formState.isSubmitting}
                    >
                      {isAcceptInvitePending ? t('onboarding.workspace.joining') : t('onboarding.workspace.join')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingInvites.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <p className="text-center text-xs uppercase tracking-wide text-muted-foreground">
                {t('onboarding.workspace.orCreate')}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('onboarding.workspace.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('onboarding.workspace.slug')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground shrink-0">studio.com/</span>
                        <Input placeholder="my-team" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is this workspace for?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : t('onboarding.workspace.create')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
