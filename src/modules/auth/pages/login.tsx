import { useEffect, useState } from 'react';
import { LoginFlow } from '@ory/client';
import { kratos } from '@/lib/kratos';
import { KratosForm } from '../components/kratos-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, MailWarning } from 'lucide-react';
import { UpdateLoginFlowBody } from '@ory/client';

const LoginPage = () => {
    const [flow, setFlow] = useState<LoginFlow | null>(null);
    const { user, isVerified, isLoading: isAuthLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('return_to') ?? '';
    const message = searchParams.get('message');

    useEffect(() => {
        if (isAuthLoading) return;

        if (user && isVerified) {
            navigate(returnTo || '/dashboard', { replace: true });
            return;
        }

        if (user && !isVerified) {
            return;
        }

        kratos
            .createBrowserLoginFlow({ returnTo })
            .then(({ data }) => setFlow(data))
            .catch((err) => {
                console.error('[LoginPage] Flow error:', err.response?.status, err.response?.data);
            });
    }, [returnTo, user, isVerified, isAuthLoading, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const body = Object.fromEntries(formData);

        kratos
            .updateLoginFlow({
                flow: flow?.id || '',
                updateLoginFlowBody: {
                    method: 'password',
                    ...body,
                } as UpdateLoginFlowBody,
            })
            .then(() => {
                // Use return_to if present, otherwise dashboard
                window.location.href = returnTo || '/dashboard';
            })
            .catch((err) => {
                if (err.response?.status === 400) {
                    setFlow(err.response.data);
                } else {
                    console.error(err);
                }
            });
    };

    if (isAuthLoading) return null;

    if (user && !isVerified) {
        return (
            <div className="flex h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <MailWarning className="size-6 text-amber-500" />
                            Email not verified
                        </CardTitle>
                        <CardDescription>
                            You are logged in but your email address has not been verified yet.
                            Please check your inbox to verify your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button
                            onClick={() => {
                                const verifyHref = returnTo
                                    ? `/auth/verification?return_to=${encodeURIComponent(returnTo)}`
                                    : '/auth/verification';
                                navigate(verifyHref);
                            }}
                            className="w-full"
                        >
                            Go to Verification
                        </Button>
                        <Button variant="outline" className="w-full" onClick={logout}>
                            Log out and use a different account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!flow) return null;

    return (
        <div className="flex h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to access the platform.
                    </CardDescription>
                    {message === 'verification_success' && (
                        <Alert variant="success" className="mt-4">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                Your email has been successfully verified! You can now log in.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>
                <CardContent>
                    <KratosForm ui={flow.ui} onSubmit={handleSubmit} />
                    <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <Link
                            to={returnTo ? `/auth/registration?return_to=${encodeURIComponent(returnTo)}` : '/auth/registration'}
                            className="text-primary hover:underline font-medium"
                        >
                            Don't have an account? Sign up
                        </Link>
                        <Link to="/auth/recovery" className="hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
