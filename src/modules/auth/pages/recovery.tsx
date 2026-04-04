import { useEffect, useState } from 'react';
import { RecoveryFlow } from '@ory/client';
import { kratos } from '@/lib/kratos';
import { KratosForm } from '../components/kratos-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useSearchParams } from 'react-router-dom';

const RecoveryPage = () => {
    const [flow, setFlow] = useState<RecoveryFlow | null>(null);
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('return_to') || '';

    useEffect(() => {
        kratos
            .createBrowserRecoveryFlow({ returnTo })
            .then(({ data }) => setFlow(data))
            .catch(console.error);
    }, [returnTo]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const body = Object.fromEntries(formData);

        kratos
            .updateRecoveryFlow({
                flow: flow?.id || '',
                updateRecoveryFlowBody: {
                    method: 'code',
                    ...body,
                } as any,
            })
            .then(({ data }) => setFlow(data))
            .catch((err) => {
                if (err.response?.status === 400) {
                    setFlow(err.response.data);
                } else {
                    console.error(err);
                }
            });
    };

    if (!flow) return null;

    return (
        <div className="flex h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Recover your account</CardTitle>
                    <CardDescription>
                        Enter your email to receive a recovery code.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <KratosForm ui={flow.ui} onSubmit={handleSubmit} />
                    <div className="mt-4 text-center text-sm">
                        <Link to="/auth/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecoveryPage;
