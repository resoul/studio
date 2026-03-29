import { useState } from 'react';
import {
  CalendarClock,
  CalendarRange,
  ChevronDown,
  Settings,
  SquareDashedBottomCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AvatarGroup } from '@/components/avatar-group';

type ActivityItem = {
  user: string;
  avatar: string;
  initial: string;
  color: string;
  action: string;
  noteTitle?: string;
  noteContent?: string;
  org?: string;
  target?: string;
  targetUrl?: string;
  icon?: string | React.ReactNode;
  time: string;
};

type Activity = {
  date: string;
  items: ActivityItem[];
};

const activitiesByMonth: Record<string, Activity[]> = {
  'June 2025': [
    {
      date: '2025-06-08',
      items: [
        {
          user: 'Christopher Brown',
          avatar:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          initial: 'CB',
          color: 'red',
          action: 'added a note',
          noteTitle: 'Q2 Sales Strategy',
          noteContent:
            'Updated sales strategy for Q2 focusing on enterprise clients.',
          org: 'KeenThemes',
          time: '13 days ago',
        },
      ],
    },
    {
      date: '2025-06-01',
      items: [
        {
          user: 'James Brown',
          avatar: '',
          initial: '',
          color: 'red',
          action: 'changed',
          target: 'June Deals',
          targetUrl: '#',
          icon: <Settings className="size-3.5 text-muted-foreground" />,
          time: '8 days ago',
        },
      ],
    },
  ],
  'May 2025': [
    {
      date: '2025-05-27',
      items: [
        {
          user: 'James Wilson',
          avatar:
            'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          initial: 'JW',
          color: 'yellow',
          action: 'added a note',
          noteTitle: 'Marketing Strategy Update',
          noteContent: 'Updated marketing strategy for Q3 campaigns.',
          org: 'Digital Solutions Ltd.',
          time: '13 days ago',
        },
        {
          avatar: '',
          user: 'Christopher Smith',
          initial: 'CS',
          color: 'red',
          action: 'added a note',
          noteTitle: 'Project Status Update',
          noteContent: 'Updated project timeline and milestones for Q3.',
          org: 'Business Solutions Co.',
          icon: <Settings className="size-3.5 text-muted-foreground" />,
          time: '13 days ago',
        },
        {
          user: 'Olivia Brown',
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          initial: 'OB',
          color: 'red',
          action: 'added a note',
          noteTitle: 'Client Onboarding Checklist',
          noteContent:
            'Created comprehensive onboarding checklist for new clients.Updated marketing strategy for Q3 campaigns.',
          org: 'Creative Studios',
          time: '15 days ago',
        },
        {
          user: 'John Smith',
          avatar:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          initial: 'JS',
          color: 'gray',
          action: 'completed',
          noteTitle: 'Q2 Sales Report',
          time: '15 days ago',
        },
        {
          user: 'Sarah Johnson',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          initial: 'SJ',
          color: 'yellow',
          action: 'updated',
          noteTitle: 'Marketing Strategy',
          noteContent: 'Updated marketing strategy for Q3 campaigns.',
          org: 'Tech Innovators Inc',
          time: '15 days ago',
        },
      ],
    },
  ],
};

export function CompanyRecordsActivity() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'June 2025': true,
    'May 2025': true,
  });

  return (
    <div className="w-full px-2 sm:px-0">
      <h2 className="text-sm font-semibold mb-6">Activity</h2>

      {Object.entries(activitiesByMonth).map(([month, activityGroups]) => (
        <div key={month} className="relative mb-10">
          <button
            className="flex items-center justify-between w-full gap-0.5 cursor-pointer text-xs font-medium text-muted-foreground mb-5 focus:outline-none select-none"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [month]: !prev[month] }))
            }
            aria-expanded={expanded[month]}
            aria-controls={`timeline-group-${month}`}
            type="button"
          >
            <div className="flex items-center gap-2 shrink-0">
              {month === 'June 2025' ? (
                <CalendarClock className="size-4 z-10" />
              ) : (
                <CalendarRange className="size-4 z-10" />
              )}
              {month}
            </div>

            <Separator className="flex-1 mx-0.5" />

            <span
              className={`transition-transform ${expanded[month] ? '' : '-rotate-90'}`}
            >
              <ChevronDown className="size-4" />
            </span>
          </button>

          <div className={`${expanded[month] ? 'block' : 'hidden'} relative`}>
            <div className="space-y-2.5">
              {activityGroups.map((group, groupIdx) => {
                return (
                  <div key={group.date} className="space-y-5">
                    {group.items.map((item, itemIdx) => {
                      const isLastGroup =
                        groupIdx === activityGroups.length - 1;
                      const isLastItem = itemIdx === group.items.length - 1;
                      const isLast = isLastGroup && isLastItem;

                      return (
                        <div
                          key={`${group.date}-${itemIdx}`}
                          className="relative flex gap-3 mb-5 last:mb-0"
                        >
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 flex-wrap relative">
                                <Avatar className="size-6 relative border-2 border-white">
                                  {!isLast && (
                                    <div className="absolute w-px !h-full min-h-10 bg-border left-2.5 top-5.5" />
                                  )}
                                  <AvatarImage
                                    src={item.avatar}
                                    alt={item.user}
                                  />
                                  <AvatarFallback>
                                    {typeof item.icon === 'string' ? (
                                      <span>{item.icon}</span>
                                    ) : (
                                      item.icon
                                    )}
                                  </AvatarFallback>
                                </Avatar>

                                <Link
                                  to="#"
                                  className="font-medium text-sm hover:text-primary"
                                >
                                  {item.user}
                                </Link>
                                <span className="text-muted-foreground text-sm">
                                  {item.action}
                                </span>
                                {item.target && item.targetUrl && (
                                  <Link
                                    to={item.targetUrl}
                                    className="hover:underline text-primary text-sm"
                                  >
                                    {item.target}
                                  </Link>
                                )}
                                {item.noteTitle && (
                                  <span className="font-semibold text-sm">
                                    {item.noteTitle}
                                  </span>
                                )}
                                {item.org && (
                                  <span className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">
                                    {item.org}
                                  </span>
                                )}
                              </div>

                              {item.noteContent && (
                                <div className="ml-8 text-xs text-muted-foreground mt-0.5">
                                  {item.noteContent}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Extra section per month */}
                    {month === 'June 2025' &&
                      groupIdx === activityGroups.length - 1 && (
                        <Card className="shadow-none px-2.5 py-2 ml-8 -mt-2">
                          <div className="flex gap-2">
                            <SquareDashedBottomCode className="size-5 text-violet-500" />
                            <div className="flex flex-col gap-3 grow">
                              <div className="flex flex-wrap items-center justify-between">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-medium text-mono cursor-pointer hover:text-primary mb-1 leading-4">
                                    Leadership Development Series: Part 1
                                  </span>
                                  <span className="text-xs text-secondary-foreground">
                                    The first installment of a leadership
                                    development series.
                                  </span>
                                </div>
                                <Button
                                  className="-mt-6"
                                  mode="link"
                                  underlined="dashed"
                                >
                                  <Link to="#">View</Link>
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-7.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-medium text-secondary-foreground">
                                    Code:
                                  </span>
                                  <span className="text-sm text-primary">
                                    #leaderdev-1
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm text-secondary-foreground">
                                    Progress:
                                  </span>
                                  <Progress
                                    value={80}
                                    indicatorClassName="bg-green-500 min-w-[120px]"
                                    className="h-1"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm text-secondary-foreground">
                                    Guests:
                                  </span>
                                  <AvatarGroup
                                    size="size-6"
                                    group={[
                                      { filename: '300-4.png' },
                                      { filename: '300-1.png' },
                                      { filename: '300-2.png' },
                                      {
                                        fallback: '+24',
                                        variant:
                                          'text-primary-foreground ring-background bg-primary',
                                      },
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}

                    {month === 'May 2025' &&
                      groupIdx === activityGroups.length - 1 && (
                        <Card className="shadow-none p-2.5 ml-8 -mt-2">
                          <div className="grid gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="border border-orange-200 rounded-lg max-h-20">
                                  <div className="flex items-center justify-center border-b border-b-orange-200 bg-orange-50 dark:border-orange-950 dark:bg-orange-950/30 rounded-t-lg">
                                    <span className="text-sm text-orange-400 font-medium p-2">
                                      Apr
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-center size-12">
                                    <span className="font-medium text-foreground text-sm tracking-tight">
                                      02
                                    </span>
                                  </div>
                                </div>
                                <img
                                  src={toAbsoluteUrl(
                                    '/media/images/600x400/8.jpg',
                                  )}
                                  className="rounded-lg max-h-20 max-w-full"
                                  alt="image"
                                />
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <Button
                                  mode="link"
                                  asChild
                                  className="text-xs text-orange-400 hover:text-primary-active mb-px"
                                >
                                  <Link to="#">
                                    Nature Photography Immersion
                                  </Link>
                                </Button>
                                <Button
                                  mode="link"
                                  asChild
                                  className="text-sm font-medium text-mono hover:text-primary leading-4"
                                >
                                  <Link to="#">
                                    Nature Photography Immersion
                                  </Link>
                                </Button>
                                <p className="text-xs text-foreground leading-[22px]">
                                  Expert-led workshop. Learn advanced techniques
                                  and capture stunning scenes.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
