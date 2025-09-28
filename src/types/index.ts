// Language types
export type Language = "id" | "en";

// KPI data types
export interface Professor {
  id: string;
  name: string;
  title: string;
  faculty: string;
  expertise: string[];
  email: string;
  image?: string;
}

export interface Accreditation {
  id: string;
  program: string;
  level: string;
  accreditor: string;
  validUntil: string;
  status: "active" | "expired" | "pending";
}

export interface StudentData {
  faculty: string;
  totalStudents: number;
  undergraduate: number;
  graduate: number;
  postgraduate: number;
}

// Assets/Facilities types
export interface AssetDetail {
  id: string;
  name: string;
  room: string;
  building: string;
  capacity?: number;
  equipment?: string[];
  description?: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
  details: AssetDetail[];
}

// API response types for future MySQL integration
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
