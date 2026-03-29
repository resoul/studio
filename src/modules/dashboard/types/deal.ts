export interface Deal {
  id: string;
  title: string;
  content: string;
  companyIds?: string[];
  contactIds?: string[];
  dealIds?: string[];
  userName: string;
  dueAt: Date;
  completedAt?: Date;
  completedBy?: string;
  assignedContactIds?: string[];
  status?: 'pending' | 'completed' | 'in_progress' | 'In progress';
  priority?: 'high' | 'medium' | 'low';
  comments?: number;
  amount?: number;
  currency?: 'USD' | 'EUR' | 'RUB';
  paymentDate?: Date;
  paymentType?: 'cash' | 'bank_transfer' | 'invoice';
  contractNumber?: string;
  discount?: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
