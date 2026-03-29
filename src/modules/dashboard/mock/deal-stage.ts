// Array mapping category badge unique id to Tailwind classes
// Update the ids as needed to match your category source

export interface CategoryBadge {
  id: string;
  className: string;
}

export const CATEGORY_BADGES: CategoryBadge[] = [
  {
    id: '1',
    className: 'bg-yellow-50 text-yellow-800',
  },
  {
    id: '2',
    className: 'bg-green-50 text-green-800',
  },
];
