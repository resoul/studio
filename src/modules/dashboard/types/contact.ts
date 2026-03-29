export interface Contact {
  id: string;
  avatar: string;
  initials?: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  company?: string;
  address?: string;
  state?: string;
  city?: string;
  zip?: string;
  country?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    medium?: string;
    stackoverflow?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  logo?: string;
}
