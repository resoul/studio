import { Separator } from '@/components/ui/separator';
import { CompanyExtendedDetailsCompany } from './company-extended-details-company';
import { CompanyExtendedDetailsLists } from './company-extended-details-lists';

export function CompanyExtendedDetails() {
  return (
    <div className="space-y-4">
      <CompanyExtendedDetailsCompany />
      <Separator />
      <CompanyExtendedDetailsLists />
    </div>
  );
}
