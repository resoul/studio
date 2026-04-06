import { useEffect, useState } from 'react';
import { RegistrationFlow } from '@ory/client';
import { kratos } from '@/lib/kratos';
import { KratosForm } from '../components/kratos-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UpdateRegistrationFlowBody } from '@ory/client';

const RegistrationPage = () => {
    const [flow, setFlow] = useState<RegistrationFlow | null>(null);
    const { user, isVerified, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('return_to') ?? '';

    useEffect(() => {
        if (isAuthLoading) return;

        if (user && isVerified) {
            navigate(returnTo || '/dashboard', { replace: true });
            return;
        }

        kratos
            .createBrowserRegistrationFlow({ returnTo })
            .then(({ data }) => setFlow(data))
            .catch(console.error);
    }, [returnTo, user, isVerified, isAuthLoading, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const body = Object.fromEntries(formData);

        kratos
            .updateRegistrationFlow({
                flow: flow?.id || '',
                updateRegistrationFlowBody: {
                    method: 'password',
                    ...body,
                } as UpdateRegistrationFlowBody,
            })
            .then(() => {
                setFlow(null);
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

    if (!flow && !user) {
        const isInvite = returnTo.includes('/invites/');
        // Build login link that preserves return_to
        const loginHref = returnTo
            ? `/auth/login?return_to=${encodeURIComponent(returnTo)}`
            : '/auth/login';

        return (
            <div className="flex h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {isInvite ? 'Almost there!' : 'Check your email'}
                        </CardTitle>
                        <CardDescription>
                            {isInvite
                                ? "Please check your email to verify your account. After verification, you'll be redirected back to accept your workspace invitation."
                                : "We've sent you a verification link. Please check your inbox and follow the instructions to complete your registration."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={loginHref}>Back to Login</Link>
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
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email and password to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <KratosForm ui={flow.ui} onSubmit={handleSubmit} />
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link
                            to={returnTo ? `/auth/login?return_to=${encodeURIComponent(returnTo)}` : '/auth/login'}
                            className="text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegistrationPage;
