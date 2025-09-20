import type { Professor, Accreditation, StudentData } from '../types';

export const professorsData: Professor[] = [
  {
    id: '1',
    name: 'Prof. Dr. Ir. Ahmad Dahlan, M.T.',
    title: 'Professor',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Sipil', 'Manajemen Konstruksi', 'Teknologi Beton'],
    email: 'ahmad.dahlan@upnvj.ac.id'
  },
  {
    id: '2',
    name: 'Dr. Siti Aminah, S.E., M.M.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Manajemen Keuangan', 'Akuntansi', 'Ekonomi Bisnis'],
    email: 'siti.aminah@upnvj.ac.id'
  },
  {
    id: '3',
    name: 'Dr. Budi Santoso, S.Kom., M.T.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
    email: 'budi.santoso@upnvj.ac.id'
  },
  {
    id: '4',
    name: 'Dr. Rina Kartika, S.H., M.H.',
    title: 'Associate Professor',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Internasional', 'Hukum Bisnis', 'HAM'],
    email: 'rina.kartika@upnvj.ac.id'
  },
  {
    id: '5',
    name: 'Dr. Muhammad Fadli, S.Sos., M.A.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    expertise: ['Hubungan Internasional', 'Politik Luar Negeri', 'Diplomasi'],
    email: 'muhammad.fadli@upnvj.ac.id'
  }
];

export const accreditationData: Accreditation[] = [
  {
    id: '1',
    program: 'Teknik Sipil',
    level: 'S1',
    accreditor: 'BAN-PT',
    validUntil: '2026-12-31',
    status: 'active'
  },
  {
    id: '2',
    program: 'Manajemen',
    level: 'S1',
    accreditor: 'BAN-PT',
    validUntil: '2025-08-15',
    status: 'active'
  },
  {
    id: '3',
    program: 'Sistem Informasi',
    level: 'S1',
    accreditor: 'BAN-PT',
    validUntil: '2027-03-20',
    status: 'active'
  },
  {
    id: '4',
    program: 'Hukum',
    level: 'S1',
    accreditor: 'BAN-PT',
    validUntil: '2025-11-10',
    status: 'active'
  },
  {
    id: '5',
    program: 'Hubungan Internasional',
    level: 'S1',
    accreditor: 'BAN-PT',
    validUntil: '2026-05-25',
    status: 'active'
  },
  {
    id: '6',
    program: 'Akuntansi',
    level: 'S2',
    accreditor: 'BAN-PT',
    validUntil: '2025-01-15',
    status: 'active'
  }
];

export const studentData: StudentData[] = [
  {
    faculty: 'Fakultas Teknik',
    totalStudents: 2850,
    undergraduate: 2450,
    graduate: 350,
    postgraduate: 50
  },
  {
    faculty: 'Fakultas Ekonomi dan Bisnis',
    totalStudents: 3200,
    undergraduate: 2800,
    graduate: 380,
    postgraduate: 20
  },
  {
    faculty: 'Fakultas Ilmu Komputer',
    totalStudents: 1950,
    undergraduate: 1750,
    graduate: 180,
    postgraduate: 20
  },
  {
    faculty: 'Fakultas Hukum',
    totalStudents: 1650,
    undergraduate: 1450,
    graduate: 180,
    postgraduate: 20
  },
  {
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    totalStudents: 1400,
    undergraduate: 1200,
    graduate: 180,
    postgraduate: 20
  },
  {
    faculty: 'Fakultas Ilmu Kesehatan',
    totalStudents: 980,
    undergraduate: 850,
    graduate: 120,
    postgraduate: 10
  }
];

// Calculate total statistics
export const getTotalStats = () => {
  const totalStudents = studentData.reduce((acc, faculty) => acc + faculty.totalStudents, 0);
  const totalProfessors = professorsData.length;
  const activeAccreditations = accreditationData.filter(acc => acc.status === 'active').length;
  
  return {
    totalStudents,
    totalProfessors,
    activeAccreditations,
    totalFaculties: studentData.length
  };
};
