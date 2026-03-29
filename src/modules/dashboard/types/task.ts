export interface Task {
  id: string;
  title: string;
  content: string;
  companyIds?: string[];
  contactIds?: string[];
  dealIds?: string[];
  createdBy: string;
  dueAt: Date;
  completedAt?: Date;
  completedBy?: string;
  assignedContactIds?: string[];
  status?: 'pending' | 'completed' | 'in_progress';
  priority?: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}
