import { Link } from 'react-router-dom';
import { getInitials, toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Note {
  logo: string;
  org: string;
  title: string;
  content: string;
  author: string;
  color: 'red' | 'yellow' | 'green' | 'gray';
  date: string;
}

const notes: Note[] = [
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
    content: 'Team meeting tomorrow at 2 PM.',
    author: 'Sarah Wilson',
    color: 'red',
    date: 'May 23, 2025',
  },
  {
    logo: toAbsoluteUrl('/media/brand-logos/android.svg'),
    org: 'Business Solutions Co',
    title: 'Client Feedback',
    content: 'Client requested more dashboard features.',
    author: 'Michael Johnson',
    color: 'yellow',
    date: 'May 14, 2025',
  },
];

interface NotesCardProps {
  className?: string;
}

export function NotesFavorite({ className }: NotesCardProps) {
  return (
    <div className={cn(className)}>
      <div className="grid">
        <div className="flex items-stretch gap-3 overflow-x-auto">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="w-full min-w-[275px] max-w-[300px] rounded-xl border bg-background p-2.5 flex flex-col justify-between"
            >
              <div className="mb-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Avatar className="flex items-center justify-center size-5">
                    <AvatarImage
                      className="size-4 rounded-none"
                      src={note.logo}
                      alt={note.org}
                    />
                    <AvatarFallback className="border-0 text-[11px] font-semibold bg-yellow-500 text-white">
                      {note.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
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
                  <Avatar className="size-4">
                    <AvatarImage
                      src={toAbsoluteUrl(
                        `/media/avatars/300-${(idx % 8) + 1}.png`,
                      )}
                      alt={note.author}
                    />
                    <AvatarFallback>{getInitials(note.author)}</AvatarFallback>
                  </Avatar>
                  <Link to="#" className="text-mono text-xs hover:text-primary">
                    {note.author}
                  </Link>
                </div>
                <span className="shrink-0 text-xs">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
