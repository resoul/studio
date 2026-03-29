import { CompanyExtended } from './company-extended';
import { CompanyRecords } from './company-records';

export function Company() {
  return (
    <div className="grow overflow-x-auto">
      <div className="p-0 flex grow">
        <div className="flex grow border-e border-border">
          <CompanyRecords />
        </div>
        <div className="flex shrink-0 w-[500px]">
          <CompanyExtended />
        </div>
      </div>
    </div>
  );
}
