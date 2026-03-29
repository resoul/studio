import { Activity, CalendarClock, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Content } from '@/layout/components/content';
import { DealList } from './deal-list';
import { PageHeader } from './page-header';

export function DealsPage() {
  return (
    <>
      <PageHeader />
      <Content className="py-0">
        <div className="flex grow">
          <Tabs defaultValue="today" className="grow text-sm">
            <TabsList
              variant="line"
              className="px-5 gap-6 bg-transparent [&_button]:border-b [&_button_svg]:size-4 [&_button]:text-secondary-foreground"
            >
              <TabsTrigger value="today">
                <Activity /> Active
              </TabsTrigger>
              <TabsTrigger value="week">
                <CheckCircle2 /> Closed
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CalendarClock /> Upcoming
              </TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              <DealList filter="today" />
            </TabsContent>
            <TabsContent value="week">
              <DealList filter="week" />
            </TabsContent>
            <TabsContent value="completed">
              <DealList filter="completed" />
            </TabsContent>
          </Tabs>
        </div>
      </Content>
    </>
  );
}
