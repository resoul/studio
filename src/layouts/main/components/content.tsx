import { Outlet } from 'react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import { Container } from '@/components/common/container';
import { Breadcrumb } from './breadcrumb';

export function Content() {
  const mobile = useIsMobile();

  return (
    <div className="grow content pt-5" role="content">
      {mobile && (
        <Container>
          <Breadcrumb />
        </Container>
      )}
      <Outlet />
    </div>
  );
}
