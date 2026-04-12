import { AccordionMenuItem } from '@/components/ui/accordion-menu';
import { type SearchSettingsItem } from './types';

export function SearchSettingsItems({
  items,
}: {
  items: SearchSettingsItem[];
}) {
  return (
    <>
      {items.map((item, index) => (
        <AccordionMenuItem key={index} value={item.info}>
          <item.icon size={16} />
          <span>{item.info}</span>
        </AccordionMenuItem>
      ))}
    </>
  );
}
