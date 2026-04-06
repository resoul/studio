import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export default function OnboardingWorkspaceSelectPage() {
    const navigate = useNavigate();
    const { workspaces } = useAuth();
    const { switchWorkspace } = useWorkspaces();

    const handleSelect = (workspaceId: string) => {
        switchWorkspace(workspaceId);
        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Choose a workspace
                    </CardTitle>
                    <CardDescription>
                        Select the workspace you want to open, or create a new one.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {workspaces?.map((ws) => (
                        <button
                            key={ws.id}
                            onClick={() => handleSelect(ws.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                        >
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={(ws as any).logo_url} alt={ws.name} />
                                <AvatarFallback className="font-bold">
                                    {ws.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{ws.name}</p>
                                {(ws as any).description && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        {(ws as any).description}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => navigate('/onboarding/workspace', { replace: true })}
                    >
                        <Plus className="size-4 mr-2" />
                        Create new workspace
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
