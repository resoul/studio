import { useEffect, useState } from 'react';
import { VerificationFlow } from '@ory/client';
import { kratos } from '@/lib/kratos';
import { KratosForm } from '../components/kratos-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const VerificationPage = () => {
    const [flow, setFlow] = useState<VerificationFlow | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const flowId = searchParams.get('flow');
    const code = searchParams.get('code');

    useEffect(() => {
        if (flowId) {
            kratos
                .getVerificationFlow({ id: flowId })
                .then(({ data }) => setFlow(data))
                .catch(console.error);
        } else {
            kratos
                .createBrowserVerificationFlow()
                .then(({ data }) => setFlow(data))
                .catch(console.error);
        }
    }, [flowId]);

    useEffect(() => {
        if (flow && code) {
            // Automatically submit if code is present in URL
            handleSubmit(code);
        }
    }, [flow, code]);

    const handleSubmit = (codeValue?: string) => {
        const body = codeValue ? { method: 'code', code: codeValue } : {};
        
        kratos
            .updateVerificationFlow({
                flow: flow?.id || '',
                updateVerificationFlowBody: body as any,
            })
            .then(() => {
                // Verification success!
                // Per user request: redirect to login
                navigate('/auth/login?message=verification_success');
            })
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
                    <CardTitle className="text-2xl">Verify your account</CardTitle>
                    <CardDescription>
                        Enter the verification code sent to your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <KratosForm
                        ui={flow.ui}
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleSubmit(formData.get('code') as string);
                        }}
                    />
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

export default VerificationPage;
