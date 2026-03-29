import { Link } from 'react-router-dom';
import { getInitials, toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const notes = [
  {
    logo: toAbsoluteUrl('/media/brand-logos/monetha.svg'),
    org: 'KeenThemes',
    title: 'Project Kickoff',
    content: 'Kick-off meeting tomorrow at 10am.',
    author: 'John Smith',
    color: 'red',
    date: 'May 12, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/django.svg'),
    org: 'Tech Innovators Inc',
    title: 'Team Meeting',
    content: 'Weekly team meeting scheduled for tomorrow at 2pm.',
    author: 'Sarah Wilson',
    color: 'red',
    date: 'May 23, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/android.svg'),
    org: 'Business Solutions Co',
    title: 'Client Feedback',
    content: 'Client requested additional features for the dashboard.',
    author: 'Michael Johnson',
    color: 'yellow',
    date: 'May 14, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/bithumb.svg'),
    org: 'Digital Marketing Agency',
    title: 'Feature Request',
    content: 'Client requested support for custom themes and dark mode.',
    author: 'John Doe',
    color: 'yellow',
    date: 'May 24, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/btcexchange.svg'),
    org: 'Enterprise Solutions',
    title: 'Onboarding Feedback',
    content:
      'The onboarding process was smooth but could use more tooltips for new users.',
    author: 'Aleksej Pastor',
    color: 'gray',
    date: 'June 2, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/btcchina.svg'),
    org: 'Data Analytics Corp',
    title: 'Feature Request',
    content: 'Please add support for exporting reports as PDF and Excel.',
    author: 'Robert Johnson',
    color: 'gray',
    date: 'June 3, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/divi.svg'),
    org: 'Creative Studios',
    title: 'Q2 Planning',
    content: 'Kick-off meeting Mon at 10am.',
    author: 'Studio KeenThemes',
    color: 'red',
    date: 'June 5, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/bridgefy.svg'),
    org: 'Digital Solutions',
    title: 'Project Launch',
    content: 'Final review Tue at 2pm.',
    author: 'Team KeenThemes',
    color: 'green',
    date: 'June 24, 2025',
  },
];

export function CompanyRecordsNotes() {
  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Notes</h2>
        <Button variant="outline" size="sm" className="gap-1">
          + Create note
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {notes.map((note, idx) => (
          <Card key={idx} className="bg-background">
            <CardContent className="flex flex-col justify-between">
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <img src={note.logo} alt={note.org} className="size-4.5" />
                  <Link
                    to="#"
                    className="font-normal text-xs hover:text-primary"
                  >
                    {note.org}
                  </Link>
                </div>
                <div className="font-semibold text-sm mb-1">{note.title}</div>
                <div className="text-xs text-muted-foreground">
                  {note.content}
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 mt-auto pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={toAbsoluteUrl(
                        `/media/avatars/300-${(idx % 8) + 1}.png`,
                      )}
                      alt={note.author}
                    />
                    <AvatarFallback>{getInitials(note.author)}</AvatarFallback>
                  </Avatar>
                  <Link
                    to="#"
                    className="font-medium text-mono text-xs hover:text-primary"
                  >
                    {note.author}
                  </Link>
                </div>
                <span className="shrink-0">{note.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
