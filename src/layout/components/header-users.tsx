import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function HeaderUsers() {
  return (
    <div className="flex -space-x-2.5">
      <Avatar className="size-7">
        <AvatarImage
          src={toAbsoluteUrl('/media/avatars/300-1.png')}
          alt="user"
          className="border-2 border-zinc-950 hover:z-10"
        />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar className="size-7">
        <AvatarImage
          src={toAbsoluteUrl('/media/avatars/300-3.png')}
          alt="user"
          className="border-2 border-zinc-950 hover:z-10"
        />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar className="size-7">
        <AvatarImage
          src={toAbsoluteUrl('/media/avatars/300-4.png')}
          alt="user"
          className="border-2 border-zinc-950 hover:z-10"
        />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
    </div>
  );
}
