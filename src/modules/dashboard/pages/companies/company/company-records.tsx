import {
  Activity,
  Bell,
  GalleryVerticalEnd,
  Grid2x2Check,
  ListTodo,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyRecordsActivity } from './company-records-activity';
import { CompanyRecordsFiles } from './company-records-files';
import { CompanyRecordsNotes } from './company-records-notes';
import { CompanyRecordsOverview } from './company-records-overview';
import { CompanyRecordsTasks } from './company-records-tasks';
import { CompanyRecordsTeam } from './company-records-team';

export function CompanyRecords() {
  return (
    <Tabs defaultValue="profile" className="grow text-sm">
      <TabsList
        variant="line"
        className="px-5 gap-6 bg-transparent [&_button]:border-b [&_button_svg]:size-4 [&_button]:text-secondary-foreground"
      >
        <TabsTrigger value="profile">
          <Grid2x2Check /> Overview
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Activity /> Activity
        </TabsTrigger>
        <TabsTrigger value="team">
          <Bell />
          Team
        </TabsTrigger>
        <TabsTrigger value="notes">
          <GalleryVerticalEnd />
          Notes
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <ListTodo />
          Tasks
          <Badge variant="primary" size="xs">
            3
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="files">
          <Bell />
          Files
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="w-full h-[calc(100vh-10rem)]">
        <div className="px-5 py-2">
          <TabsContent value="profile">
            <CompanyRecordsOverview />
          </TabsContent>
          <TabsContent value="activity">
            <CompanyRecordsActivity />
          </TabsContent>
          <TabsContent value="team">
            <CompanyRecordsTeam />
          </TabsContent>
          <TabsContent value="notes">
            <CompanyRecordsNotes />
          </TabsContent>
          <TabsContent value="tasks">
            <CompanyRecordsTasks />
          </TabsContent>
          <TabsContent value="files">
            <CompanyRecordsFiles />
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
}
