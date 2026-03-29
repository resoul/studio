import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeaderHelp() {
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        mode="icon"
        className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
      >
        <CircleHelp className="size-4 text-white" />
      </Button>
    </div>
  );
}
