export interface Company {
  id: string;
  logo?: string;
  name: string;
  domain?: string;
  email?: string;
  phone?: string;
  description?: string;
  categoryIds?: string[];
  contactIds?: string[];
  address?: string;
  state?: string;
  city?: string;
  zip?: string;
  country?: string;
  angelList?: string;
  linkedin?: string;
  connectionStrengthId?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  createdAt: Date;
  updatedAt: Date;
  foundedAt?: Date;
  estimatedArrId?: string;
  employeeRangeId?: string;
  lastInteractionAt?: Date;
  lastContacted?: string;
  teamId?: string;
  badge?: {
    name: string;
    state: string;
  };
}
