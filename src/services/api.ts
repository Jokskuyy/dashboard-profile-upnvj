// API Configuration for future MySQL integration
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    PROFESSORS: '/professors',
    STUDENTS: '/students',
    ACCREDITATION: '/accreditation',
    FACULTIES: '/faculties',
    STATISTICS: '/statistics'
  }
};

// API Service Class for Microservices Architecture
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Professor Service Methods
  async getProfessors(params?: { page?: number; limit?: number; faculty?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.faculty) searchParams.append('faculty', params.faculty);
    
    const query = searchParams.toString();
    return this.request(`${API_CONFIG.ENDPOINTS.PROFESSORS}${query ? `?${query}` : ''}`);
  }

  async getProfessorById(id: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.PROFESSORS}/${id}`);
  }

  // Student Service Methods
  async getStudentStatistics() {
    return this.request(`${API_CONFIG.ENDPOINTS.STUDENTS}/statistics`);
  }

  async getStudentsByFaculty(faculty: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.STUDENTS}?faculty=${faculty}`);
  }

  // Accreditation Service Methods
  async getAccreditations(params?: { status?: string; program?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.program) searchParams.append('program', params.program);
    
    const query = searchParams.toString();
    return this.request(`${API_CONFIG.ENDPOINTS.ACCREDITATION}${query ? `?${query}` : ''}`);
  }

  // Faculty Service Methods
  async getFaculties() {
    return this.request(API_CONFIG.ENDPOINTS.FACULTIES);
  }

  // Statistics Service Methods
  async getOverallStatistics() {
    return this.request(API_CONFIG.ENDPOINTS.STATISTICS);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database connection configuration (for future MySQL setup)
export const DB_CONFIG = {
  host: process.env.VITE_DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_DB_PORT || '3306'),
  database: process.env.VITE_DB_NAME || 'upnvj_dashboard',
  user: process.env.VITE_DB_USER || 'root',
  password: process.env.VITE_DB_PASSWORD || '',
};

// Future MySQL table schemas for reference
export const DB_SCHEMAS = {
  professors: `
    CREATE TABLE professors (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(100) NOT NULL,
      faculty_id VARCHAR(36) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      expertise JSON,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    )
  `,
  students: `
    CREATE TABLE students (
      id VARCHAR(36) PRIMARY KEY,
      student_id VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      faculty_id VARCHAR(36) NOT NULL,
      program VARCHAR(100) NOT NULL,
      level ENUM('undergraduate', 'graduate', 'postgraduate') NOT NULL,
      enrollment_year YEAR NOT NULL,
      status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (faculty_id) REFERENCES faculties(id)
    )
  `,
  accreditations: `
    CREATE TABLE accreditations (
      id VARCHAR(36) PRIMARY KEY,
      program VARCHAR(255) NOT NULL,
      level VARCHAR(50) NOT NULL,
      accreditor VARCHAR(100) NOT NULL,
      grade VARCHAR(10),
      valid_from DATE NOT NULL,
      valid_until DATE NOT NULL,
      status ENUM('active', 'expired', 'pending') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  faculties: `
    CREATE TABLE faculties (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      short_name VARCHAR(50) NOT NULL,
      description TEXT,
      established_year YEAR,
      dean_id VARCHAR(36),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (dean_id) REFERENCES professors(id)
    )
  `
};
