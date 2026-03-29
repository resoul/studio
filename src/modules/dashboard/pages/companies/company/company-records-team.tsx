import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TeamMember = {
  name: string;
  email: string;
  position: string;
  avatar?: string;
  initial?: string;
  joinDate: string;
  teamSize: number;
  teamMembers: {
    name: string;
    avatar: string;
    initial: string;
  }[];
};

const teamMembers: TeamMember[] = [
  {
    name: 'Brian Johnson',
    email: 'brian@keenthemes.com',
    position: 'CEO',
    avatar: '',
    initial: 'B',
    joinDate: 'April 10, 2025',
    teamSize: 3,
    teamMembers: [
      {
        name: 'Sarah Williams',
        avatar: toAbsoluteUrl('/media/avatars/300-6.png'),
        initial: 'S',
      },
      {
        name: 'Michael Chen',
        avatar: toAbsoluteUrl('/media/avatars/300-4.png'),
        initial: 'M',
      },
      { name: 'Emily Davis', avatar: '', initial: 'E' },
    ],
  },
  {
    name: 'Robert Anderson',
    email: 'robert@keenthemes.com',
    position: 'CTO',
    avatar: toAbsoluteUrl('/media/avatars/300-2.png'),
    initial: 'R',
    joinDate: 'August 25, 2025',
    teamSize: 2,
    teamMembers: [
      {
        name: 'David Brown',
        avatar: toAbsoluteUrl('/media/avatars/300-8.png'),
        initial: 'D',
      },
      { name: 'Jessica Lee', avatar: '', initial: 'J' },
    ],
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@keenthemes.com',
    position: 'Marketing Director',
    avatar: toAbsoluteUrl('/media/avatars/300-6.png'),
    initial: 'S',
    joinDate: 'June 20, 2025',
    teamSize: 1,
    teamMembers: [],
  },
  {
    name: 'Michael Chen',
    email: 'michael@keenthemes.com',
    position: 'Lead Developer',
    avatar: toAbsoluteUrl('/media/avatars/300-4.png'),
    initial: 'M',
    joinDate: 'July 5, 2025',
    teamSize: 1,
    teamMembers: [],
  },
  {
    name: 'Emily Davis',
    email: 'emily@keenthemes.com',
    position: 'Product Manager',
    avatar: '',
    initial: 'E',
    joinDate: 'September 10, 2025',
    teamSize: 1,
    teamMembers: [],
  },
  {
    name: 'David Brown',
    email: 'david@keenthemes.com',
    position: 'Sales Manager',
    avatar: toAbsoluteUrl('/media/avatars/300-8.png'),
    initial: 'D',
    joinDate: 'March 1, 2025',
    teamSize: 1,
    teamMembers: [],
  },
  {
    name: 'Jessica Lee',
    email: 'jessica@keenthemes.com',
    position: 'HR Manager',
    avatar: '',
    initial: 'J',
    joinDate: 'August 15, 2025',
    teamSize: 1,
    teamMembers: [],
  },
];

export function CompanyRecordsTeam() {
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Team</h2>
        <Button variant="outline" size="sm" className="gap-1">
          + Add Person
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border bg-background">
        <table className="min-w-full divide-y divide-border">
          <tbody className="divide-y divide-border">
            {teamMembers.map((member, idx) => {
              const isPastDate = new Date(member.joinDate) < new Date();
              const visibleTeamMembers = member.teamMembers.length
                ? member.teamMembers
                : [
                    {
                      name: member.name,
                      avatar: member.avatar ?? '',
                      initial: member.initial ?? member.name[0],
                    },
                  ];

              return (
                <tr key={idx}>
                  <td className="px-3 py-2 w-7">
                    <div className="flex justify-center">
                      <Checkbox size="sm" />
                    </div>
                  </td>
                  <td className="px-0 py-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium hover:text-primary">
                      <Avatar className="size-6">
                        {member.avatar && (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        )}
                        <AvatarFallback>{member.initial?.[0]}</AvatarFallback>
                      </Avatar>
                      <Link
                        to="#"
                        className="font-medium text-sm hover:text-primary"
                      >
                        {member.name ? member.name : member.email}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-primary underline text-end">
                    <Link to={`mailto:${member.email}`}>{member.email}</Link>
                  </td>
                  <td className="px-3 py-2 flex items-center justify-end">
                    <div className="ms-auto flex items-center gap-2">
                      <Badge
                        appearance={isPastDate ? 'light' : undefined}
                        variant={isPastDate ? 'destructive' : 'secondary'}
                        size="sm"
                      >
                        <Calendar className="size-3.5" /> {member.joinDate}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Users className="size-3.5" />
                              {Math.max(1, member.teamMembers.length)} People
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className={`
                              p-2 gap-2
                              ${visibleTeamMembers.length === 1 ? 'flex flex-col' : ''}
                              ${visibleTeamMembers.length === 2 || visibleTeamMembers.length === 3 ? 'flex flex-row' : ''}
                              ${visibleTeamMembers.length > 3 ? 'flex flex-wrap max-w-xs' : ''}
                            `}
                          >
                            {visibleTeamMembers.map((teamMember, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1"
                              >
                                <Avatar className="size-5">
                                  {teamMember.avatar ? (
                                    <AvatarImage
                                      src={teamMember.avatar}
                                      alt={teamMember.name}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {teamMember.initial}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <span className="text-xs font-medium whitespace-nowrap">
                                  {teamMember.name}
                                </span>
                              </div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
