import { useNavigate } from 'react-router-dom';
import { Content } from '@/layout/components/content';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Content className="py-0">
            <div className="flex grow">
                <div className="flex h-full flex-col items-center justify-center gap-4">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <p className="text-muted-foreground">Page not found</p>
                    <button
                        className="text-primary hover:underline"
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </Content>
    );
}