import { Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Item14() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center grow gap-2.5 px-5">
      <div className="flex items-center justify-center size-8 bg-green-500-soft rounded-full border border-success-transparent">
        <Check className="text-lg text-green-500" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-secondary-foreground">
          {t('layout.notifications.accountVerified')}
        </span>
        <span className="font-medium text-muted-foreground text-xs">
          2 days ago
        </span>
      </div>
    </div>
  );
}
