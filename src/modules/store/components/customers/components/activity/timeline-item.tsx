'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface TimelineItemProps {
  icon: LucideIcon;
  line: boolean;
  children: ReactNode;
  removeSpace?: boolean;
  className?: string;
}

export function TimelineItem({
  line,
  icon: Icon,
  children,
  removeSpace,
  className,
}: TimelineItemProps) {
  return (
    <div className="flex items-start relative">
      {line && (
        <div className="w-10 start-0 top-10.5 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s-2 border-s-input h-[calc(100%-28px)]"></div>
      )}
      <div className="flex items-center justify-center rounded-md bg-background border border-border size-10 shrink-0">
        <div className="flex items-center justify-center bg-accent/70 rounded-md size-[34px]">
          <Icon size={18} className={className || ""} />
        </div>
      </div> 
      <div className={`ps-2.5 ${!removeSpace ? 'mb-5 pt-0.5' : ''} text-base grow`}>
        {children}
      </div>
    </div>
  );
}
