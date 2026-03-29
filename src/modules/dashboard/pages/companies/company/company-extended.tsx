import { Building2, MessagesSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyExtendedComments } from './company-extended-comments';
import { CompanyExtendedDetails } from './company-extended-details';

export function CompanyExtended() {
  return (
    <Tabs defaultValue="profile" className="grow text-sm">
      <TabsList
        variant="line"
        className="px-5 gap-6 bg-transparent [&_button]:border-b [&_button_svg]:size-3.5"
      >
        <TabsTrigger value="profile">
          <Building2 /> Details
        </TabsTrigger>
        <TabsTrigger value="comments">
          <MessagesSquare />
          Comments
          <Badge variant="warning" size="xs">
            5
          </Badge>
        </TabsTrigger>
      </TabsList>
      <ScrollArea className="w-full h-[calc(100vh-10rem)]">
        <div className="px-5 py-2">
          <TabsContent value="profile">
            <CompanyExtendedDetails />
          </TabsContent>
          <TabsContent value="comments">
            <CompanyExtendedComments />
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
}
