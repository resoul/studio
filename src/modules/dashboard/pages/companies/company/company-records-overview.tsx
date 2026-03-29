import { CompanyRecordsOverviewActivity } from './company-records-overview-activity';
import { CompanyRecordsOverviewHighlights } from './company-records-overview-highlights';
import { CompanyRecordsOverviewNotes } from './company-records-overview-notes';
import { CompanyRecordsOverviewTasks } from './company-records-overview-tasks';

export function CompanyRecordsOverview() {
  return (
    <div className="space-y-6">
      <CompanyRecordsOverviewHighlights />
      <CompanyRecordsOverviewActivity />
      <CompanyRecordsOverviewNotes />
      <CompanyRecordsOverviewTasks />
    </div>
  );
}
