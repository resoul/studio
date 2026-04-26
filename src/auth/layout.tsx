import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function ClassicLayout() {
    return (
        <>
            <style>
                {`
          .page-bg {
            background-image: url('${toAbsoluteUrl('/bg-10.png')}');
          }
          .dark .page-bg {
            background-image: url('${toAbsoluteUrl('/bg-10-dark.png')}');
          }
        `}
            </style>
            <div className="flex flex-col items-center justify-center grow bg-center bg-no-repeat page-bg">
                <div className="m-5">
                    <Link to="/">
                        <img
                            src={toAbsoluteUrl('/studio.png')}
                            className="h-[35px] max-w-none"
                            alt=""
                        />
                    </Link>
                </div>
                <Card className="w-full max-w-[400px]">
                    <CardContent className="p-6">
                        <Outlet />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
