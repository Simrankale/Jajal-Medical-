export type UserRole = 'admin' | 'viewer' | 'engineer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type CaseStatus = 
  | 'Draft' 
  | 'Planning' 
  | 'In Review' 
  | 'Approved' 
  | 'Completed' 
  | 'Cancelled';

export type CasePriority = 'Low' | 'Medium' | 'High';

export interface MedicalCase {
  id: number;
  case_number: string;
  patient_reference: string;
  surgeon_name: string;
  implant_type: string;
  status: CaseStatus;
  priority: CasePriority;
  surgery_date: string | null; // YYYY-MM-DD or null
  created_by: number; // Foreign key to users.id
  creator?: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  created_at: string;
  updated_at: string;
  notes?: string;
  hospital?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedCases {
  cases: MedicalCase[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DashboardStats {
  total: number;
  draft: number;
  planning: number;
  in_review: number;
  approved: number;
  completed: number;
  cancelled: number;
  priority_counts: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

export interface TestCaseResult {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  expectedStatus: number;
  actualStatus?: number;
  durationMs?: number;
  assertionMessage?: string;
  responsePreview?: string;
}
