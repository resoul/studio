import { Content } from '@/layout/components/content';
import { Company } from './company';
import { PageHeader } from './page-header';

export function CompanyPage() {
  return (
    <>
      <PageHeader />
      <Content className="grid py-0">
        <Company />
      </Content>
    </>
  );
}
