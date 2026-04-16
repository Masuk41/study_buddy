export interface Department {
  _id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'club_leader' | 'super_admin';
  department?: Department;
  studentId?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Club {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  department?: Department;
  leader?: User;
  requirements?: string;
  coverImage?: string;
  category: 'academic' | 'arts' | 'sports' | 'culture' | 'technology' | 'community' | 'other';
  isActive: boolean;
  members?: User[];
  maxMembers: number;
  foundedYear?: number;
  createdAt: string;
}

export interface Application {
  _id: string;
  user: User | string;
  club: Club | string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  reviewNote?: string;
  reviewedBy?: User;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  club: Club | string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  isPublic: boolean;
  createdBy?: User;
  createdAt: string;
}

export interface AdminStats {
  users: number;
  clubs: number;
  departments: number;
  pendingApplications: number;
}
