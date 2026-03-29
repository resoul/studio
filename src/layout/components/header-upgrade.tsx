import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeaderUpgrade() {
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white hover:from-blue-600 hover:text-white"
      >
        <Award className="size-4 text-white" />
        Upgrade
      </Button>
    </div>
  );
}
