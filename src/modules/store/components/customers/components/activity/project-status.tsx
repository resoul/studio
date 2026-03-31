'use client';

import { Rocket } from 'lucide-react';
import { TimelineItem } from './timeline-item';

const ActivitiesProjectStatus = () => {
  return (
    <TimelineItem icon={Rocket} className="text-indigo-500" line={false}>
      <div className="flex flex-col">
        <div className="text-sm text-foreground font-normal">
          Completed phase one of client project ahead of schedule.
        </div>
        <span className="text-xs text-muted-foreground/80 font-normal">
          6 days ago, 10:45 AM
        </span>
      </div>
    </TimelineItem>
  );
};

export { ActivitiesProjectStatus };
