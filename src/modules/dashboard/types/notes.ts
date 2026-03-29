export interface Notes {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  dueAt: Date;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  assignedContactIds: string[];
  companyIds: string[];
  dealIds?: string[];
  completedAt?: Date;
  completedBy?: string;
  logo?: string;
}
