'use client';

import { Smile } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TimelineItem } from './timeline-item';

const ActivitiesPhotographyWorkshop = () => {
  return (
    <TimelineItem icon={Smile} className="text-green-400" line={true}>
      <div className="flex flex-col pb-2.5">
        <span className="text-sm text-foreground font-normal">
          Jenny attended a Nature Photography Immersion workshop
        </span>
        <span className="text-xs text-muted-foreground/80 font-normal">
          3 days ago, 11:45 AM
        </span>
      </div>
      <Card className="shadow-none">
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex items-center gap-5 shrink-0">
                <div className="border border-orange-200 rounded-lg  max-h-20">
                  <div className="flex items-center justify-center border-b border-b-orange-200 bg-orange-50 dark:border-orange-950 dark:bg-orange-950/30 rounded-t-lg">
                    <span className="text-2sm text-orange-400 font-medium p-2">
                      Apr
                    </span>
                  </div>
                  <div className="flex items-center justify-center size-12">
                    <span className="font-medium text-secondary-foreground text-2xl tracking-tight">
                      02
                    </span>
                  </div>
                </div>
                <img
                  src={toAbsoluteUrl('/media/images/600x400/8.jpg')}
                  className="rounded-lg max-h-20 max-w-full"
                  alt="image"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <Button
                  mode="link"
                  asChild
                  className="text-xs text-orange-400 leading-[14px] hover:text-primary-active mb-px"
                >
                  <Link to="#">Photo Workshop</Link>
                </Button>
                <Button
                  mode="link"
                  asChild
                  className="text-base font-medium hover:text-primary text-foreground leading-4"
                >
                  <Link to="#">Nature Photography Immersion</Link>
                </Button>
                <p className="text-xs text-secondary-foreground font-normal leading-[12px]">
                  Enhance your nature photography skills in a hands-on workshop
                  guided by experienced photographers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TimelineItem>
  );
};

export { ActivitiesPhotographyWorkshop };
