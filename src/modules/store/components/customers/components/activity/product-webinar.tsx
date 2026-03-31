'use client';

import { CalendarClock, SquareDashedBottomCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AvatarGroup } from '@/components/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TimelineItem } from './timeline-item';

const ActivitiesProductWebinar = () => {
  return (
    <TimelineItem icon={CalendarClock} className="text-yellow-500" line={true}>
      <div className="flex flex-col pb-2.5">
        <span className="text-sm text-foreground font-normal">
          Jenny attended a webinar on new product features.
        </span>
        <span className="text-xs text-muted-foreground/80 font-normal">
          3 days ago, 11:45 AM
        </span>
      </div>
      <Card className="shadow-none p-4">
        <div className="flex flex-wrap gap-2.5">
          <SquareDashedBottomCode
            size={20}
            className="text-violet-500"
          />
          <div className="flex flex-col gap-5 grow">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-medium text-foreground cursor-pointer hover:text-primary mb-1 leading-4">
                  Leadership Development Series: Part 1
                </span>
                <span className="text-xs text-muted-foreground/80 font-normal">
                  The first installment of a leadership development series.
                </span>
              </div>
              <Button mode="link" underlined="dashed">
                <Link to="/account/members/teams">View</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-7.5">
              <div className="flex items-center gap-1.5">
                <span className="text-2sm font-normal text-muted-foreground/80">
                  Code:
                </span>
                <span className="text-2sm text-primary medium">#leaderdev-1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2sm font-normal text-muted-foreground/80">
                  Progress:
                </span>
                <Progress
                  value={80}
                  indicatorClassName="bg-green-500 min-w-[120px] rounded-full"
                  className="h-1"
                />
              </div>
              <div className="flex items-center gap-1.5 lg:min-w-24 shrink-0 max-w-auto">
                <span className="text-2sm font-normal text-muted-foreground/80">
                  Guests:
                </span>
                <AvatarGroup>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-4.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-1.png" />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarFallback className="text-foreground ring-background bg-background text-2sm">
                      K
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="size-7">
                    <AvatarImage src="/media/avatars/300-2.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </TimelineItem>
  );
};

export { ActivitiesProductWebinar };
