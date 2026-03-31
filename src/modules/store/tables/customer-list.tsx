'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Eye,
  Info,
  Search,
  SquarePen,
  Trash,
  X,
  ChevronUp,
  Copy,
  Download,
  Link,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CustomerDetailsSheet } from '../components/customer-details-sheet';
import { CustomerFormSheet } from '../components/customer-form-sheet';
import { Avatar, AvatarImage, AvatarFallback, AvatarIndicator, AvatarStatus } from '@/components/ui/avatar';
import { VariantProps } from 'class-variance-authority';
import { Separator } from '@/components/ui/separator';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface IData {
  user: string;
  id: string;
  customerInfo: {
    image: string;
    title: string;
    label: string;
    statusColor: VariantProps<typeof AvatarStatus>['variant'];
    verified?: boolean;
  };
  location: {
    name: string;
    flag: string;
  };
  total: string;
  price: string;
  status: {
    label: string;
    variant: string;
  };
  created: string;
  updated: string;
}

export type CustomerListDisplaySheet = "customerDetails" | "createCustomer" | "editCustomer";

interface  CustomerListProps {
  displaySheet?: CustomerListDisplaySheet;
  shouldOpenSheet?: boolean;
  onSheetClose?: () => void;
}

const mockData: IData[] = [
  {
    id: '1',
    user: '583920-XT',
    customerInfo: {
      image: '300-13.png',
      title: 'Mia Martinez',
      label: 'miamartinez@gmail.com',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    created: '118',
    total: '$9,794.00',
    price: '$83.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '18 Aug, 2025',
  },
  {
    id: '2',
    user: '104761-BQ',
    customerInfo: {
      image: '300-12.png',
      title: 'Liam Brown',
      label: 'Uliam.brown@ukrmail.ua',
      statusColor: 'online',
      verified: false,
    },
    location: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    created: '35',
    total: '$3,465.00',
    price: '$99.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '20 Jan, 2025',
  },
  {
    id: '3',
    user: '847305-ZR',
    customerInfo: {
      image: '300-17.png',
      title: 'Noah Garcia',
      label: 'noah.garcia@mail.my',
      statusColor: 'busy', // yellow-500
      verified: false,
    },
    location: {
      name: 'Malaysiaa',
      flag: 'malaysia.svg',
    },
    created: '6',
    total: '$$720.00',
    price: '$120.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '19 Feb, 2025',
  },
  {
    id: '4',
    user: '229176-LK',
    customerInfo: {
      image: '300-8.png',
      title: 'Bob Robinson',
      label: 'robert.rn@outlook.com',
      statusColor: 'online',
      verified: false,
    },
    location: {
      name: 'USA',
      flag: 'usa.svg',
    },
    created: '17',
    total: '$1,224.00',
    price: '$72.00',
    status: {
      label: 'Banned',
      variant: 'destructive',
    },
    updated: '16 Mar, 2025',
  },
  {
    id: '5',
    user: '671452-VN',
    customerInfo: {
      image: '300-1.png',
      title: 'Davis',
      label: 'olivia.davis@canadamail.ca',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    created: '732',
    total: '$123,808.00',
    price: '$169.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '29 Mar, 2025',
  },
  {
    id: '6',
    user: '398274-JY',
    customerInfo: {
      image: '300-7.png',
      title: 'Emma Chen',
      label: 'emma.chen@estonianet.ee',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    created: '2',
    total: '$220.00',
    price: '$110.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '9 Aug, 2025',
  },
  {
    id: '7',
    user: '750163-DP',
    customerInfo: {
      image: '300-4.png',
      title: 'Ethan Wilson',
      label: 'ethan.wilson@usmail.com',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'USA',
      flag: 'usa.svg',
    },
    created: '97',
    total: '$4,753.00',
    price: '$49.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '22 Jul, 2025',
  },
  {
    id: '8',
    user: '912048-MF',
    customerInfo: {
      image: '300-34.png',
      title: 'Sophia Patel',
      label: 'sophia.patel@indiamail.in',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'India',
      flag: 'india.svg',
    },
    created: '105',
    total: '$24,150.00',
    price: '$230.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '28 Apr, 2025',
  },
  {
    id: '9',
    user: '336791-TA',
    customerInfo: {
      image: '300-3.png',
      title: 'Lucas Anderson',
      label: 'Blucas.anderson@canadamail.ca',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    created: '284',
    total: '$39,760.00',
    price: '$140.00',
    status: {
      label: 'Banned',
      variant: 'destructive',
    },
    updated: '10 Jan, 2025',
  },
  {
    id: '10',
    user: '508234-WS',
    customerInfo: {
      image: '300-26.png',
      title: 'James Liu',
      label: 'HC-9031',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'Netherlands',
      flag: 'netherlands.svg',
    },
    created: '49',
    total: '$4,116.00',
    price: '$84.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '22 Jul, 2025',
  },
  {
    id: '11',
    user: '847392-KL',
    customerInfo: {
      image: '300-16.png',
      title: 'Sarah Johnson',
      label: 'sarah.johnson@email.com',
      statusColor: 'online',
      verified: false,
    },
    location: {
      name: 'Australia',
      flag: 'australia.svg',
    },
    created: '23',
    total: '$2,875.00',
    price: '$125.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '15 Dec, 2024',
  },
  {
    id: '12',
    user: '293847-MN',
    customerInfo: {
      image: '300-18.png',
      title: 'Michael Chen',
      label: 'michael.chen@outlook.com',
      statusColor: 'busy',
      verified: true,
    },
    location: {
      name: 'Singapore',
      flag: 'singapore.svg',
    },
    created: '67',
    total: '$8,450.00',
    price: '$126.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '3 Nov, 2024',
  },
  {
    id: '13',
    user: '564738-PQ',
    customerInfo: {
      image: '300-23.png',
      title: 'Emily Rodriguez',
      label: 'emily.rodriguez@yahoo.com',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'Spain',
      flag: 'spain.svg',
    },
    created: '12',
    total: '$1,680.00',
    price: '$140.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '28 Oct, 2024',
  },
  {
    id: '14',
    user: '918273-RS',
    customerInfo: {
      image: '300-25.png',
      title: 'David Kim',
      label: 'david.kim@gmail.com',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'South Korea',
      flag: 'south-korea.svg',
    },
    created: '89',
    total: '$12,340.00',
    price: '$139.00',
    status: {
      label: 'Banned',
      variant: 'destructive',
    },
    updated: '12 Sep, 2024',
  },
  {
    id: '15',
    user: '456789-TU',
    customerInfo: {
      image: '300-15.png',
      title: 'Lisa Thompson',
      label: 'lisa.thompson@hotmail.com',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'United Kingdom',
      flag: 'united-kingdom.svg',
    },
    created: '34',
    total: '$4,250.00',
    price: '$125.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '5 Aug, 2024',
  },
  {
    id: '16',
    user: '789012-VW',
    customerInfo: {
      image: '300-19.png',
      title: 'Alexandre Dubois',
      label: 'alexandre.dubois@orange.fr',
      statusColor: 'busy',
      verified: false,
    },
    location: {
      name: 'France',
      flag: 'france.svg',
    },
    created: '45',
    total: '$5,670.00',
    price: '$126.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '18 Jul, 2024',
  },
  {
    id: '17',
    user: '234567-XY',
    customerInfo: {
      image: '300-28.png',
      title: 'Maria Silva',
      label: 'maria.silva@uol.com.br',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'Brazil',
      flag: 'brazil.svg',
    },
    created: '78',
    total: '$9,120.00',
    price: '$117.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '2 Jun, 2024',
  },
  {
    id: '18',
    user: '567890-ZA',
    customerInfo: {
      image: '300-22.png',
      title: 'Hiroshi Tanaka',
      label: 'hiroshi.tanaka@yahoo.co.jp',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'Japan',
      flag: 'japan.svg',
    },
    created: '156',
    total: '$18,750.00',
    price: '$120.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '25 May, 2024',
  },
  {
    id: '19',
    user: '890123-BC',
    customerInfo: {
      image: '300-13.png',
      title: 'Anna Kowalski',
      label: 'anna.kowalski@wp.pl',
      statusColor: 'busy',
      verified: false,
    },
    location: {
      name: 'Poland',
      flag: 'poland.svg',
    },
    created: '29',
    total: '$3,480.00',
    price: '$120.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '14 Apr, 2024',
  },
  {
    id: '20',
    user: '123456-DE',
    customerInfo: {
      image: '300-28.png',
      title: 'Carlos Mendez',
      label: 'carlos.mendez@telefonica.net',
      statusColor: 'busy',
      verified: false,
    },
    location: {
      name: 'Mexico',
      flag: 'mexico.svg',
    },
    created: '91',
    total: '$10,890.00',
    price: '$120.00',
    status: {
      label: 'Banned',
      variant: 'destructive',
    },
    updated: '8 Mar, 2024',
  },
  {
    id: '21',
    user: '456789-EF',
    customerInfo: {
      image: '300-5.png',
      title: 'Priya Sharma',
      label: 'priya.sharma@rediffmail.com',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'India',
      flag: 'india.svg',
    },
    created: '203',
    total: '$24,360.00',
    price: '$120.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '22 Feb, 2024',
  },
  {
    id: '22',
    user: '789012-GH',
    customerInfo: {
      image: '300-17.png',
      title: 'Ahmed Hassan',
      label: 'ahmed.hassan@emirates.net.ae',
      statusColor: 'offline',
      verified: false,
    },
    location: {
      name: 'USA',
      flag: 'usa.svg',
    },
    created: '67',
    total: '$8,040.00',
    price: '$120.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '15 Jan, 2024',
  },
  {
    id: '23',
    user: '234567-IJ',
    customerInfo: {
      image: '300-28.png',
      title: 'Isabella Rossi',
      label: 'isabella.rossi@libero.it',
      statusColor: 'online',
      verified: false,
    },
    location: {
      name: 'Italy',
      flag: 'italy.svg',
    },
    created: '38',
    total: '$4,560.00',
    price: '$120.00',
    status: {
      label: 'Inactive',
      variant: 'warning',
    },
    updated: '3 Dec, 2023',
  },
  {
    id: '24',
    user: '567890-KL',
    customerInfo: {
      image: '300-9.png',
      title: 'Ryan O\'Connor',
      label: 'ryan.oconnor@eircom.net',
      statusColor: 'online',
      verified: true,
    },
    location: {
      name: 'Ireland',
      flag: 'ireland.svg',
    },
    created: '112',
    total: '$13,440.00',
    price: '$120.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    updated: '18 Nov, 2023',
  },
  {
    id: '25',
    user: '890123-MN',
    customerInfo: {
      image: '300-19.png',
      title: 'Sofia Petrov',
      label: 'sofia.petrov@mail.ru',
      statusColor: 'busy',
      verified: false,
    },
    location: {
      name: 'Russia',
      flag: 'russia.svg',
    },
    created: '45',
    total: '$5,400.00',
    price: '$120.00',
    status: {
      label: 'Banned',
      variant: 'destructive',
    },
    updated: '7 Oct, 2023',
  },
];

// CustomerAvatar component
const CustomerAvatar = ({ 
  image, 
  statusColor, 
  verified 
}: { 
  image: string; 
  statusColor?: VariantProps<typeof AvatarStatus>['variant'];
  verified?: boolean; 
}) => {

  return (
    <Avatar>
      <AvatarImage src={image} alt="@reui" />
      <AvatarFallback>CH</AvatarFallback>
      {verified ? (
        <AvatarIndicator className="end-0.5 top-0.5">
          <div className="absolute -top-1 -right-1 size-3.5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 16" fill="none" className="text-blue-500">
              <path d="M14.5425 6.89749L13.5 5.83999C13.4273 5.76877 13.3699 5.6835 13.3312 5.58937C13.2925 5.49525 13.2734 5.39424 13.275 5.29249V3.79249C13.274 3.58699 13.2324 3.38371 13.1527 3.19432C13.0729 3.00494 12.9565 2.83318 12.8101 2.68892C12.6638 2.54466 12.4904 2.43073 12.2998 2.35369C12.1093 2.27665 11.9055 2.23801 11.7 2.23999H10.2C10.0982 2.24159 9.99722 2.22247 9.9031 2.18378C9.80898 2.1451 9.72371 2.08767 9.65249 2.01499L8.60249 0.957487C8.30998 0.665289 7.91344 0.50116 7.49999 0.50116C7.08654 0.50116 6.68999 0.665289 6.39749 0.957487L5.33999 1.99999C5.26876 2.07267 5.1835 2.1301 5.08937 2.16879C4.99525 2.20747 4.89424 2.22659 4.79249 2.22499H3.29249C3.08699 2.22597 2.88371 2.26754 2.69432 2.34731C2.50494 2.42709 2.33318 2.54349 2.18892 2.68985C2.04466 2.8362 1.93073 3.00961 1.85369 3.20013C1.77665 3.39064 1.73801 3.5945 1.73999 3.79999V5.29999C1.74159 5.40174 1.72247 5.50275 1.68378 5.59687C1.6451 5.691 1.58767 5.77627 1.51499 5.84749L0.457487 6.89749C0.165289 7.19 0.00115967 7.58654 0.00115967 7.99999C0.00115967 8.41344 0.165289 8.80998 0.457487 9.10249L1.49999 10.16C1.57267 10.2312 1.6301 10.3165 1.66878 10.4106C1.70747 10.5047 1.72659 10.6057 1.72499 10.7075V12.2075C1.72597 12.413 1.76754 12.6163 1.84731 12.8056C1.92709 12.995 2.04349 13.1668 2.18985 13.3111C2.3362 13.4553 2.50961 13.5692 2.70013 13.6463C2.89064 13.7233 3.0945 13.762 3.29999 13.76H4.79999C4.90174 13.7584 5.00275 13.7775 5.09687 13.8162C5.191 13.8549 5.27627 13.9123 5.34749 13.985L6.40499 15.0425C6.69749 15.3347 7.09404 15.4988 7.50749 15.4988C7.92094 15.4988 8.31748 15.3347 8.60999 15.0425L9.65999 14C9.73121 13.9273 9.81647 13.8699 9.9106 13.8312C10.0047 13.7925 10.1057 13.7734 10.2075 13.775H11.7075C12.1212 13.775 12.518 13.6106 12.8106 13.3181C13.1031 13.0255 13.2675 12.6287 13.2675 12.215V10.715C13.2659 10.6132 13.285 10.5122 13.3237 10.4181C13.3624 10.324 13.4198 10.2387 13.4925 10.1675L14.55 9.10999C14.6953 8.96452 14.8104 8.79176 14.8887 8.60164C14.9671 8.41152 15.007 8.20779 15.0063 8.00218C15.0056 7.79656 14.9643 7.59311 14.8847 7.40353C14.8051 7.21394 14.6888 7.04197 14.5425 6.89749ZM10.635 6.64999L6.95249 10.25C6.90055 10.3026 6.83864 10.3443 6.77038 10.3726C6.70212 10.4009 6.62889 10.4153 6.55499 10.415C6.48062 10.4139 6.40719 10.3982 6.33896 10.3685C6.27073 10.3389 6.20905 10.2961 6.15749 10.2425L4.37999 8.44249C4.32532 8.39044 4.28169 8.32793 4.25169 8.25867C4.22169 8.18941 4.20593 8.11482 4.20536 8.03934C4.20479 7.96387 4.21941 7.88905 4.24836 7.81934C4.27731 7.74964 4.31999 7.68647 4.37387 7.63361C4.42774 7.58074 4.4917 7.53926 4.56194 7.51163C4.63218 7.484 4.70726 7.47079 4.78271 7.47278C4.85816 7.47478 4.93244 7.49194 5.00112 7.52324C5.0698 7.55454 5.13148 7.59935 5.18249 7.65499L6.56249 9.05749L9.84749 5.84749C9.95296 5.74215 10.0959 5.68298 10.245 5.68298C10.394 5.68298 10.537 5.74215 10.6425 5.84749C10.6953 5.90034 10.737 5.96318 10.7653 6.03234C10.7935 6.1015 10.8077 6.1756 10.807 6.25031C10.8063 6.32502 10.7908 6.39884 10.7612 6.46746C10.7317 6.53608 10.6888 6.59813 10.635 6.64999Z" fill="currentColor"/>
            </svg>
          </div>
        </AvatarIndicator>
        ) : (
          <AvatarIndicator className="-end-1.5 -top-1.5">
            <AvatarStatus variant={statusColor} className="size-2.5" />
          </AvatarIndicator>
        )
      }
    </Avatar>
  );
};

export function CustomerListTable({
  displaySheet,
  shouldOpenSheet,
  onSheetClose,
}: CustomerListProps) {
  const [data, setData] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState('');

  // Search input state
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Customer details sheet state
  const [isCustomerSheetOpen, setIsCustomerSheetOpen] = useState(false);
  
  // Customer form sheet state
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [customerFormMode, setCustomerFormMode] = useState<'new' | 'edit'>('new');
  
  // Delete confirmation state
  const [customerToDelete, setCustomerToDelete] = useState<IData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Group actions state
  const [isGroupDeleteDialogOpen, setIsGroupDeleteDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updated', desc: true },
  ]);
  const [selectedLastMoved] = useState<string[]>([]);

  // Handle opening customer details sheet
  const handleOpenCustomerDetails = (customer: IData) => {
    console.log('Opening customer details for:', customer);
    setIsCustomerSheetOpen(true);
  };

  // Handle opening customer form sheet
  const handleOpenCustomerForm = (mode: 'new' | 'edit', customer?: IData) => {
    console.log(`Opening customer form for ${mode} mode:`, customer);
    setCustomerFormMode(mode);
    setIsCustomerFormOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (customer: IData) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (customerToDelete) {
      // Remove customer from data array
      setData(prevData => prevData.filter(customer => customer.id !== customerToDelete.id));
      
      toast.custom(
        (t) => (
          <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
            <AlertIcon>
              <Info />
            </AlertIcon>
            <AlertTitle>Customer "{customerToDelete.customerInfo.title}" deleted successfully</AlertTitle>
          </Alert>
        ),
        {
          duration: 5000,
        },
      );
      console.log('Delete customer:', customerToDelete.id);
      setCustomerToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setCustomerToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Group actions handlers
  const handleGroupStatusChange = (status: string) => {
    const selectedRowIds = Object.keys(rowSelection);
    console.log(`Changing status to ${status} for rows:`, selectedRowIds);
    
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Info />
          </AlertIcon>
          <AlertTitle>Status updated to {status} for {selectedRowIds.length} customers</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
  };

  const handleGroupDuplicate = () => {
    const selectedRowIds = Object.keys(rowSelection);
    console.log('Duplicating rows:', selectedRowIds);
    
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Info />
          </AlertIcon>
          <AlertTitle>Duplicated {selectedRowIds.length} customers</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
  };

  const handleGroupExport = () => {
    const selectedRowIds = Object.keys(rowSelection);
    console.log('Exporting rows:', selectedRowIds);
    
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Info />
          </AlertIcon>
          <AlertTitle>Exported {selectedRowIds.length} customers</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
  };

  const handleGroupDelete = () => {
    setIsGroupDeleteDialogOpen(true);
  };

  const handleConfirmGroupDelete = () => {
    const selectedRowIds = Object.keys(rowSelection);
    // Remove selected customers from data
    setData(prevData => prevData.filter(customer => !selectedRowIds.includes(customer.id)));
    
    // Clear selection
    setRowSelection({});
    
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Info />
          </AlertIcon>
          <AlertTitle>Deleted {selectedRowIds.length} customers</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
    
    setIsGroupDeleteDialogOpen(false);
  };

  const handleCancelGroupDelete = () => {
    setIsGroupDeleteDialogOpen(false);
  };

  const ColumnInputFilter = <TData, TValue>({
    column,
  }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        variant="sm"
        className="w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 45, 
        maxSize: 45,
        minSize: 45,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'user',
        accessorFn: (row) => row.user,
        header: ({ column }) => (
          <DataGridColumnHeader title="User ID" column={column} />
        ),
        cell: (info) => (
          <span 
            className="text-sm text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors"
            onClick={() => handleOpenCustomerDetails(info.row.original)}
          >
            {info.row.original.user}
          </span>
        ),
        enableSorting: true,
        size: 110,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'customerInfo',
        accessorFn: (row) => row.customerInfo,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Customer"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          const customerInfo = info.row.getValue('customerInfo') as IData['customerInfo'];

          return (
            <div className="flex items-center gap-2.5">
              <CustomerAvatar
                image={toAbsoluteUrl(`/media/avatars/${customerInfo.image}`)}
                statusColor={customerInfo.statusColor}
                verified={customerInfo.verified}
              />
              <div className="flex flex-col gap-1 truncate">
                <span
                  className="text-sm font-medium text-foreground leading-3.5 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => console.log('View customer:', customerInfo.title)}
                >
                  {customerInfo.title}
                </span>
                <span className="text-xs font-normal text-secondary-foreground">
                  {customerInfo.label}
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 240,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'location',
        accessorFn: (row) => row.location,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Country"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          const location = info.row.getValue('location') as IData['location'];

          return (
            <div className="flex items-center gap-1.5">
              <img
                src={toAbsoluteUrl(`/media/flags/${location.flag}`)}
                className="h-4 rounded-full"
                alt="image"
              />
              <span className="text-sm eading-none text-foreground font-normal">
                {location.name}
              </span>
            </div>
          );
        },
        enableSorting: true,
        size: 130,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'created',
        accessorFn: (row) => row.created,
        header: ({ column }) => (
          <DataGridColumnHeader title="Orders" column={column} />
        ),
        cell: (info) => {
          return info.row.original.created;
        },
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'total',
        accessorFn: (row) => row.total,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Spent" column={column} />
        ),
        cell: (info) => {
          return (
            <div>{info.row.original.total}</div>
          );
        },
        enableSorting: true,
        size: 110,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'price',
        accessorFn: (row) => row.price,
        header: ({ column }) => (
          <DataGridColumnHeader title="Avg. Spent" column={column} />
        ),
        cell: (info) => {
          return <div>{info.row.original.price}</div>;
        },
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: (info) => {
          const status = info.row.original.status;
          const variant = status.variant as keyof BadgeProps['variant'];
          return (
            <Badge
              variant={variant}
              appearance="light"
            >
              {status.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 90,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'updated',
        accessorFn: (row) => row.updated,
        header: ({ column }) => (
          <DataGridColumnHeader title="Last Order" column={column} />
        ),
        cell: (info) => {
          return info.row.original.updated;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => {
          const customerId = row.getValue('id') as string;

          const handleView = () => {
            console.log('View customer:', customerId);
            setIsCustomerSheetOpen(true);
          };

          const handleEdit = () => {
            console.log('Edit customer:', customerId);
            handleOpenCustomerForm('edit', row.original);
          };

          const handleDelete = () => {
            handleDeleteClick(row.original);
          };

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                mode="icon"
                onClick={handleView}
                title="View customer"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                mode="icon"
                onClick={handleEdit}
                title="Edit customer"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                mode="icon"
                onClick={handleDelete}
                title="Delete customer"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        size: 110,
      },
    ],
    [], // Same columns for all tabs
  );

  // Apply search and last moved filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter - only search in customer title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.customerInfo.title.toLowerCase().includes(query),
      );
    }

    return result;
  }, [data, searchQuery]);

  // Get selected rows count
  const selectedRowsCount = Object.keys(rowSelection).length;
  const totalRowsCount = filteredData.length;

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [searchQuery, selectedLastMoved]);

  // Sync inputValue with searchQuery when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: 10, // Fixed 10 items per page
      },
      sorting,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // Reset pagination when filters change
  useEffect(() => {
    table.setPageIndex(0);
  }, [table, searchQuery, selectedLastMoved]);

  // Handle displaySheet prop to automatically open sheets
  useEffect(() => {
    console.log('displaySheet effect triggered:', { displaySheet, shouldOpenSheet });
    if (displaySheet && shouldOpenSheet) {
      console.log('Opening sheet for:', displaySheet);
      switch (displaySheet) {
        case 'customerDetails':
          setIsCustomerSheetOpen(true);
          break;
        case 'createCustomer':
          setCustomerFormMode('new');
          setIsCustomerFormOpen(true);
          break;
        case 'editCustomer':
          setCustomerFormMode('edit');
          setIsCustomerFormOpen(true);
          break;
      }
    }
  }, [displaySheet, shouldOpenSheet]);

  // Handle form sheet close
  const handleCustomerFormClose = (open: boolean) => {
    setIsCustomerFormOpen(open);
    if (!open && onSheetClose) {
      onSheetClose(); // Notify parent that sheet is closed
    }
  };

  // Handle details sheet close
  const handleCustomerDetailsClose = (open: boolean) => {
    setIsCustomerSheetOpen(open);
    if (!open && onSheetClose) {
      onSheetClose(); // Notify parent that sheet is closed
    }
  };

  // Handle edit click from details sheet
  const handleEditFromDetails = () => {
    // Close details sheet
    setIsCustomerSheetOpen(false);
    // Open form sheet in edit mode
    setCustomerFormMode('edit');
    setIsCustomerFormOpen(true);
  };


  // Search input handlers
  const handleClearInput = () => {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  // Bottom Action Bar Component
  const BottomActionBar = () => {
    if (selectedRowsCount === 0) return null;

    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
        <div className="dark bg-zinc-950 text-white rounded-xl px-2 py-1 shadow-lg border">
          <div className="flex items-center gap-4">
            {/* Selection Count */}
            <span className="text-sm font-medium ps-3 pe-1">
              {selectedRowsCount} of {totalRowsCount} selected
            </span>

            <Separator className="h-10" orientation="vertical" />

            {/* Change Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="dark">
                  <Link className="h-4 w-4 mr-2" />
                  Change status
                  <ChevronUp className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="dark">
                <DropdownMenuItem onClick={() => handleGroupStatusChange('Active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupStatusChange('Inactive')}>
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupStatusChange('Pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGroupStatusChange('Banned')}>
                  Banned
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator className="h-8 bg-zinc-700" orientation="vertical" />

            {/* Duplicate Action */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGroupDuplicate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>

            <Separator className="h-8 bg-zinc-700" orientation="vertical" />

            {/* Export Action */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGroupExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Separator className="h-8 bg-zinc-700" orientation="vertical" />

            {/* Delete Action */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGroupDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader className="py-3 flex-nowrap">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-semibold text-foreground leading-0">Customers</h3>
            <CardToolbar className="flex items-center gap-2">
              {/* Search */}
              <div className="w-full max-w-[200px]">
                <InputWrapper>
                  <Search />
                  <Input
                    placeholder="Search by ID"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    onClick={handleClearInput}
                    variant="dim"
                    className="-me-4"
                    disabled={inputValue === ''}
                  >
                    {inputValue !== '' && <X size={16} />}
                  </Button>
                </InputWrapper>
              </div>
            </CardToolbar>
          </div>
        </CardHeader>

        {/* Table Content */}
        <DataGrid
          table={table}
          recordCount={filteredData?.length || 0}
          tableLayout={{
            columnsPinnable: true,
            columnsMovable: true,
            columnsVisibility: true,
            cellBorder: true,
          }}
        >
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </DataGrid>
      </Card>

      {/* Bottom Action Bar */}
      <BottomActionBar />

      {/* Customer Details Sheet */}
      <CustomerDetailsSheet 
        open={isCustomerSheetOpen} 
        onOpenChange={handleCustomerDetailsClose}
        onEditClick={handleEditFromDetails}
      />

      {/* Customer Form Sheet */}
      <CustomerFormSheet
        mode={customerFormMode}
        open={isCustomerFormOpen}
        onOpenChange={handleCustomerFormClose}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{customerToDelete?.customerInfo.title}</strong>? 
              This action cannot be undone. All customer data, orders, and associated information will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Group Delete Confirmation Dialog */}
      <AlertDialog open={isGroupDeleteDialogOpen} onOpenChange={setIsGroupDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Customers</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedRowsCount} customers</strong>? 
              This action cannot be undone. All customer data, orders, and associated information will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelGroupDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive" 
              onClick={handleConfirmGroupDelete}
            >
              Delete {selectedRowsCount} Customers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}