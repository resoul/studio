import { useState } from 'react';
import { CATEGORIES } from '@/modules/dashboard/mock/categories';
import { COMPANIES } from '@/modules/dashboard/mock/companies';
import { CONNECTION_STRENGTHS } from '@/modules/dashboard/mock/connection-strengths';
import { mockContacts } from '@/modules/dashboard/mock/contacts';
import { EMPLOYEE_RANGES } from '@/modules/dashboard/mock/employee-ranges';
import { ESTIMATED_ARRS } from '@/modules/dashboard/mock/estimated-arrs';
import { Company } from '@/modules/dashboard/types/company';
import { ConnectionStrength } from '@/modules/dashboard/types/connection-strength';
import { EmployeeRange } from '@/modules/dashboard/types/employee-range';
import { EstimatedArr } from '@/modules/dashboard/types/estimated-arr';
import {
  RiFacebookLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
} from '@remixicon/react';
import {
  ArrowUpRight,
  BadgeDollarSign,
  BadgeInfo,
  Building2,
  CalendarPlus,
  Cast,
  ChevronRight,
  Copy,
  Globe,
  Headset,
  Mail,
  MapPin,
  Phone,
  SquarePen,
  Tag,
  UserPlus,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function CompanyExtendedDetailsCompany() {
  const [company] = useState<Company>({ ...COMPANIES[0] });
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isGeneralAllOpen, setIsGeneralAllOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Collapsible
        className="space-y-2 relative"
        open={isGeneralOpen}
        onOpenChange={setIsGeneralOpen}
      >
        <div className="group flex items-center justify-between gap-2.5">
          <CollapsibleTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-sm text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent ps-1.5 -ms-1.5"
            >
              <ChevronRight className="[[data-state=open]_&]:rotate-90" />
              Company Details
            </Button>
          </CollapsibleTrigger>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" mode="icon">
                  <SquarePen />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="left">
                Edit company details
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <CollapsibleContent>
          {/* General details */}
          <div className="grid grid-cols-5 gap-2.5">
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-muted-foreground" />
                Company name
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={toAbsoluteUrl(company.logo || '')}
                    alt="company"
                  />
                  <AvatarFallback>{company.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-mono">{company.name}</span>
              </div>
            </div>
            {/* Company website */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Globe className="size-3.5 text-muted-foreground" />
                Website
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Link
                  to={company.domain || ''}
                  className="text-primary underline"
                >
                  {company.domain}
                </Link>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </div>
            </div>
            {/* Company description */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <BadgeInfo className="size-3.5 text-muted-foreground" />
                Description
              </div>
            </div>
            <div className="col-span-3">
              <div className="text-mono truncate">{company.description}</div>
            </div>
            {/* Company address */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Location
              </div>
            </div>
            <div className="col-span-3">
              <div className="text-mono truncate">
                {company.address}, {company.city}, {company.state},{' '}
                {company.zip}
              </div>
            </div>
            {/* Company phone */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Phone
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center text-mono">
                {company.phone}
                <Button
                  variant="dim"
                  mode="icon"
                  size="icon"
                  className="size-6"
                >
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
            {/* Company email */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email
              </div>
            </div>
            <div className="col-span-3">
              <Link
                to={`mailto:${company.email || '#'}`}
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                {company.email}
              </Link>
            </div>
            {/* Company categories */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-muted-foreground" />
                Categories
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-1">
                {company.categoryIds?.map((categoryId) => {
                  const badge = CATEGORIES.find((b) => b.id === categoryId);

                  return (
                    <Badge
                      key={categoryId}
                      className={cn('shrink-0', badge?.color)}
                    >
                      {badge ? badge.name : categoryId}
                    </Badge>
                  );
                })}
              </div>
            </div>
            {/* Company team */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Users className="size-3.5 text-muted-foreground" />
                Team
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex truncate overflow-hidden gap-1.5">
                {company.contactIds?.map((contactId) => {
                  const contact = mockContacts.find((c) => c.id === contactId);
                  return contact ? (
                    <div
                      key={contactId}
                      className="group cursor-pointer flex items-center gap-1 px-1 border border-border rounded-full bg-accent/50"
                    >
                      <Avatar className="size-4 my-1">
                        <AvatarImage
                          src={toAbsoluteUrl(contact.avatar || '')}
                          alt={contact.name}
                        />
                        <AvatarFallback className="border-0 text-[11px] font-semibold bg-green-500 text-white">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="border-r border-border h-full"></div>

                      <span className="truncate max-w-[100px] text-xs group-hover:text-primary">
                        {contact.name}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            {/* Company connection */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Cast className="size-3.5 text-muted-foreground" />
                Connection Strength
              </div>
            </div>
            <div className="col-span-3">
              {(() => {
                const value = company.connectionStrengthId;
                const item = CONNECTION_STRENGTHS.find(
                  (item: ConnectionStrength) => item.id === value,
                );

                return item ? (
                  <div className="inline-flex items-center gap-1.5">
                    <span
                      className={cn('rounded-full size-2', item.color)}
                    ></span>
                    <span className="text-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                );
              })()}
            </div>
            {/* Company Estimated Arr */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <BadgeDollarSign className="size-3.5 text-muted-foreground" />
                Estimated Arr
              </div>
            </div>
            <div className="col-span-3">
              {(() => {
                const value = company.estimatedArrId;
                const badge = ESTIMATED_ARRS.find(
                  (badge: EstimatedArr) => badge.id === value,
                );

                return badge ? (
                  <Badge className={cn('shrink-0', badge.color)}>
                    {badge.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                );
              })()}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* All details */}
      <Collapsible
        className="space-y-2 relative"
        open={isGeneralAllOpen}
        onOpenChange={setIsGeneralAllOpen}
      >
        <CollapsibleContent>
          <div className="grid grid-cols-5 gap-2.5">
            {/* Company employee */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <UserPlus className="size-3.5 text-muted-foreground" />
                Employee range
              </div>
            </div>
            <div className="col-span-3">
              {(() => {
                const value = company.employeeRangeId;
                const badge = EMPLOYEE_RANGES.find(
                  (item: EmployeeRange) => item.id === value,
                );

                return (
                  <Badge className={cn('shrink-0', badge?.color)}>
                    {badge?.name}
                  </Badge>
                );
              })()}
            </div>
            {/* Company last contacted */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Headset className="size-3.5 text-muted-foreground" />
                Last Contacted
              </div>
            </div>
            <div className="col-span-3">{company.lastContacted}</div>
            {/* Company founded */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <CalendarPlus className="size-3.5 text-muted-foreground" />
                Founded
              </div>
            </div>
            <div className="col-span-3">{company.foundedAt?.getFullYear()}</div>
            {/* Company facebook */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <RiTwitterXLine className="size-3.5 text-muted-foreground" />
                <span>Twitter</span>
              </div>
            </div>
            <div className="col-span-3">
              <Link to={company.x || ''} className="text-primary underline">
                {company.x}
              </Link>
            </div>
            {/* Company facebook */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-0.5">
                <RiFacebookLine className="size-4.5 text-muted-foreground -ms-0.5" />
                ​<span>Facebook</span>
              </div>
            </div>
            <div className="col-span-3">
              <Link
                to={company.facebook || ''}
                className="text-primary underline"
              >
                {company.facebook}
              </Link>
            </div>
            {/* Company ​Instagram */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <RiInstagramLine className="size-3.5 text-muted-foreground" />
                <span>Instagram</span>
              </div>
            </div>
            <div className="col-span-3">
              <Link
                to={company.instagram || ''}
                className="text-primary underline"
              >
                {company.instagram}
              </Link>
            </div>
            {/* Company ​linkedIn */}
            <div className="col-span-2 pt-0.5">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <RiLinkedinLine className="size-3.5 text-muted-foreground" />
                <span>LinkedIn</span>
              </div>
            </div>
            <div className="col-span-3">
              <Link
                to={company.linkedin || ''}
                className="text-primary underline"
              >
                {company.linkedin}
              </Link>
            </div>
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs p-1 h-auto text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent"
          >
            {isGeneralAllOpen ? 'Hide all details' : 'Show all details'}
            <ChevronRight className={cn(isGeneralAllOpen && '-rotate-90')} />
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
