import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScreenLoader } from '@/components/screen-loader';
import api from '@/lib/api';
import { kratos } from '@/lib/kratos';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface InvitePreview {
    id: string;
    slug: string;
    name: string;
    logo_url: string;
    members_count: number;
    email: string;
}

export default function WorkspaceInvitePage() {
    const { token } = useParams<{ token: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { user, isLoading: isAuthLoading } = useAuth();

    const returnTo = encodeURIComponent(location.pathname);

    // Not logged in → go to registration preserving return_to
    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate(`/auth/registration?return_to=${returnTo}`, { replace: true });
        }
    }, [user, isAuthLoading, navigate, returnTo]);

    const { data: invite, isLoading, isError } = useQuery<InvitePreview>({
        queryKey: ['workspace-invite', token],
        queryFn: async () => {
            const { data } = await api.get(`/workspaces/invites/${token}/preview`);
            return data;
        },
        enabled: !!token,
    });

    // Get current user email from Kratos identity traits
    const currentUserEmail = (() => {
        if (!user) return null;
        const traits = (user as any)?.traits;
        return traits?.email ?? null;
    })();

    // Email mismatch — auto logout and redirect back
    const emailMismatch =
        invite && currentUserEmail && invite.email.toLowerCase() !== currentUserEmail.toLowerCase();

    useEffect(() => {
        if (!emailMismatch) return;
        const doLogout = async () => {
            try {
                const { data: logoutData } = await kratos.createBrowserLogoutFlow();
                // After logout, Kratos redirects to logout_url; we then go to login with return_to
                window.location.href = `${logoutData.logout_url}&return_to=${encodeURIComponent(
                    `/auth/login?return_to=${returnTo}`,
                )}`;
            } catch {
                // Fallback: just redirect to login
                navigate(`/auth/login?return_to=${returnTo}`, { replace: true });
            }
        };
        doLogout();
    }, [emailMismatch, navigate, returnTo]);

    const acceptMutation = useMutation({
        mutationFn: async () => {
            await api.post(`/workspaces/invites/${token}/accept`);
        },
        onSuccess: async () => {
            toast.success('Joined workspace successfully');
            await queryClient.invalidateQueries({ queryKey: ['api-user'] });
            // After accepting, go through onboarding profile if not completed,
            // otherwise straight to dashboard
            navigate('/');
        },
        onError: () => {
            toast.error('Failed to join workspace');
        },
    });

    if (isAuthLoading || isLoading) return <ScreenLoader />;

    // While logout is happening
    if (emailMismatch) return <ScreenLoader />;

    if (isError || !invite) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md text-center py-12 border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-destructive">Invalid or Expired Invite</CardTitle>
                        <CardDescription>
                            This invitation link is no longer valid. Please ask for a new invite.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                            <AvatarImage src={invite.logo_url} alt={invite.name} />
                            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                {invite.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {t('onboarding.workspace.invitationTitle')}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {t('onboarding.workspace.invitationDescription').replace('{name}', invite.name)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    {invite.email && currentUserEmail && (
                        <Alert variant="secondary">
                            <AlertDescription className="text-sm">
                                Invite sent to <strong>{invite.email}</strong>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                        <div className="text-sm font-medium">Members</div>
                        <div className="font-bold text-primary">{invite.members_count}</div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg font-semibold"
                        size="lg"
                        onClick={() => acceptMutation.mutate()}
                        disabled={acceptMutation.isPending}
                    >
                        {acceptMutation.isPending ? 'Joining...' : t('onboarding.workspace.accept')}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => navigate('/')}
                        disabled={acceptMutation.isPending}
                    >
                        Not now
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
