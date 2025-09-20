import type { Professor, Accreditation, StudentData } from '../types';

// Faculty data with abbreviations
export interface FacultyInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export const facultiesData: FacultyInfo[] = [
  { id: 'ft', name: 'Fakultas Teknik', shortName: 'FT', color: '#3B82F6' },
  { id: 'feb', name: 'Fakultas Ekonomi dan Bisnis', shortName: 'FEB', color: '#10B981' },
  { id: 'fik', name: 'Fakultas Ilmu Komputer', shortName: 'FIK', color: '#8B5CF6' },
  { id: 'fh', name: 'Fakultas Hukum', shortName: 'FH', color: '#F59E0B' },
  { id: 'fisip', name: 'Fakultas Ilmu Sosial dan Politik', shortName: 'FISIP', color: '#EF4444' },
  { id: 'fikes', name: 'Fakultas Ilmu Kesehatan', shortName: 'FIKES', color: '#06B6D4' }
];

export const professorsData: Professor[] = [
  // Fakultas Teknik (FT) - 8 dosen
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
    name: 'Dr. Eng. Bambang Suryadi, S.T., M.T.',
    title: 'Associate Professor',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Mesin', 'Termodinamika', 'Energi Terbarukan'],
    email: 'bambang.suryadi@upnvj.ac.id'
  },
  {
    id: '3',
    name: 'Dr. Ir. Candra Wijaya, M.T.',
    title: 'Associate Professor',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Elektro', 'Sistem Kontrol', 'Robotika'],
    email: 'candra.wijaya@upnvj.ac.id'
  },
  {
    id: '4',
    name: 'Dr. Dwi Hartono, S.T., M.Eng.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Industri', 'Sistem Produksi', 'Lean Manufacturing'],
    email: 'dwi.hartono@upnvj.ac.id'
  },
  {
    id: '5',
    name: 'Dr. Eka Permata, S.T., M.T.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Teknik',
    expertise: ['Arsitektur', 'Desain Sustainable', 'Urban Planning'],
    email: 'eka.permata@upnvj.ac.id'
  },
  {
    id: '6',
    name: 'Fitri Andayani, S.T., M.T.',
    title: 'Lecturer',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Lingkungan', 'Pengolahan Air', 'Waste Management'],
    email: 'fitri.andayani@upnvj.ac.id'
  },
  {
    id: '7',
    name: 'Gunawan Pratama, S.T., M.T.',
    title: 'Lecturer',
    faculty: 'Fakultas Teknik',
    expertise: ['Geoteknik', 'Struktur Bangunan', 'Material Konstruksi'],
    email: 'gunawan.pratama@upnvj.ac.id'
  },
  {
    id: '8',
    name: 'Hendra Kusuma, S.T., M.T.',
    title: 'Lecturer',
    faculty: 'Fakultas Teknik',
    expertise: ['Teknik Sipil', 'Hidrolika', 'Irigasi'],
    email: 'hendra.kusuma@upnvj.ac.id'
  },

  // Fakultas Ekonomi dan Bisnis (FEB) - 7 dosen
  {
    id: '9',
    name: 'Dr. Siti Aminah, S.E., M.M.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Manajemen Keuangan', 'Akuntansi', 'Ekonomi Bisnis'],
    email: 'siti.aminah@upnvj.ac.id'
  },
  {
    id: '10',
    name: 'Prof. Dr. Indra Wijaya, S.E., M.M.',
    title: 'Professor',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Manajemen Strategis', 'Kewirausahaan', 'Bisnis Digital'],
    email: 'indra.wijaya@upnvj.ac.id'
  },
  {
    id: '11',
    name: 'Dr. Joko Prasetyo, S.E., M.Ak.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Akuntansi Manajemen', 'Audit', 'Perpajakan'],
    email: 'joko.prasetyo@upnvj.ac.id'
  },
  {
    id: '12',
    name: 'Dr. Kartika Sari, S.E., M.M.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Manajemen SDM', 'Organizational Behavior', 'Leadership'],
    email: 'kartika.sari@upnvj.ac.id'
  },
  {
    id: '13',
    name: 'Lestari Wulandari, S.E., M.M.',
    title: 'Lecturer',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Pemasaran Digital', 'Brand Management', 'Consumer Behavior'],
    email: 'lestari.wulandari@upnvj.ac.id'
  },
  {
    id: '14',
    name: 'Maya Sari, S.E., M.E.',
    title: 'Lecturer',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Ekonomi Makro', 'Ekonomi Pembangunan', 'Ekonomi Regional'],
    email: 'maya.sari@upnvj.ac.id'
  },
  {
    id: '15',
    name: 'Nur Rahman, S.E., M.M.',
    title: 'Lecturer',
    faculty: 'Fakultas Ekonomi dan Bisnis',
    expertise: ['Manajemen Operasi', 'Supply Chain', 'Logistics'],
    email: 'nur.rahman@upnvj.ac.id'
  },

  // Fakultas Ilmu Komputer (FIK) - 6 dosen
  {
    id: '16',
    name: 'Dr. Budi Santoso, S.Kom., M.T.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
    email: 'budi.santoso@upnvj.ac.id'
  },
  {
    id: '17',
    name: 'Dr. Andi Prasetyo, S.Kom., M.Kom.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Software Engineering', 'Web Development', 'Mobile Apps'],
    email: 'andi.prasetyo@upnvj.ac.id'
  },
  {
    id: '18',
    name: 'Citra Dewi, S.Kom., M.Kom.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Database Systems', 'Big Data', 'Data Mining'],
    email: 'citra.dewi@upnvj.ac.id'
  },
  {
    id: '19',
    name: 'Denny Kurniawan, S.Kom., M.T.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Network Security', 'Cybersecurity', 'Ethical Hacking'],
    email: 'denny.kurniawan@upnvj.ac.id'
  },
  {
    id: '20',
    name: 'Eko Wahyudi, S.Kom., M.Kom.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Game Development', 'Computer Graphics', 'UI/UX Design'],
    email: 'eko.wahyudi@upnvj.ac.id'
  },
  {
    id: '21',
    name: 'Fajar Nugroho, S.Kom., M.T.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Komputer',
    expertise: ['Cloud Computing', 'DevOps', 'System Administration'],
    email: 'fajar.nugroho@upnvj.ac.id'
  },

  // Fakultas Hukum (FH) - 5 dosen
  {
    id: '22',
    name: 'Dr. Rina Kartika, S.H., M.H.',
    title: 'Associate Professor',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Internasional', 'Hukum Bisnis', 'HAM'],
    email: 'rina.kartika@upnvj.ac.id'
  },
  {
    id: '23',
    name: 'Prof. Dr. Agus Salim, S.H., M.H.',
    title: 'Professor',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Pidana', 'Hukum Acara Pidana', 'Kriminologi'],
    email: 'agus.salim@upnvj.ac.id'
  },
  {
    id: '24',
    name: 'Dr. Budi Hartono, S.H., M.H.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Perdata', 'Hukum Kontrak', 'Hukum Keluarga'],
    email: 'budi.hartono@upnvj.ac.id'
  },
  {
    id: '25',
    name: 'Chandra Kirana, S.H., M.H.',
    title: 'Lecturer',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Tata Negara', 'Hukum Administrasi', 'Good Governance'],
    email: 'chandra.kirana@upnvj.ac.id'
  },
  {
    id: '26',
    name: 'Dian Permata, S.H., M.H.',
    title: 'Lecturer',
    faculty: 'Fakultas Hukum',
    expertise: ['Hukum Lingkungan', 'Hukum Agraria', 'Hukum Sumber Daya Alam'],
    email: 'dian.permata@upnvj.ac.id'
  },

  // Fakultas Ilmu Sosial dan Politik (FISIP) - 4 dosen
  {
    id: '27',
    name: 'Dr. Muhammad Fadli, S.Sos., M.A.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    expertise: ['Hubungan Internasional', 'Politik Luar Negeri', 'Diplomasi'],
    email: 'muhammad.fadli@upnvj.ac.id'
  },
  {
    id: '28',
    name: 'Dr. Ayu Lestari, S.IP., M.A.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    expertise: ['Ilmu Politik', 'Demokrasi', 'Partai Politik'],
    email: 'ayu.lestari@upnvj.ac.id'
  },
  {
    id: '29',
    name: 'Bima Sakti, S.Sos., M.Si.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    expertise: ['Sosiologi', 'Antropologi', 'Masyarakat Urban'],
    email: 'bima.sakti@upnvj.ac.id'
  },
  {
    id: '30',
    name: 'Citra Andini, S.I.Kom., M.A.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Sosial dan Politik',
    expertise: ['Komunikasi Massa', 'Media Digital', 'Public Relations'],
    email: 'citra.andini@upnvj.ac.id'
  },

  // Fakultas Ilmu Kesehatan (FIKES) - 3 dosen
  {
    id: '31',
    name: 'Dr. dr. Endang Sari, M.Kes.',
    title: 'Associate Professor',
    faculty: 'Fakultas Ilmu Kesehatan',
    expertise: ['Kesehatan Masyarakat', 'Epidemiologi', 'Biostatistik'],
    email: 'endang.sari@upnvj.ac.id'
  },
  {
    id: '32',
    name: 'Fitria Rahma, S.Kep., M.Kep.',
    title: 'Assistant Professor',
    faculty: 'Fakultas Ilmu Kesehatan',
    expertise: ['Keperawatan', 'Keperawatan Anak', 'Pediatric Care'],
    email: 'fitria.rahma@upnvj.ac.id'
  },
  {
    id: '33',
    name: 'Gita Puspita, S.Gz., M.Gizi.',
    title: 'Lecturer',
    faculty: 'Fakultas Ilmu Kesehatan',
    expertise: ['Ilmu Gizi', 'Nutrisi Klinis', 'Diet Therapy'],
    email: 'gita.puspita@upnvj.ac.id'
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

// Helper functions for faculty data
export const getProfessorsByFaculty = () => {
  return facultiesData.map(faculty => {
    const professors = professorsData.filter(prof => prof.faculty === faculty.name);
    return {
      ...faculty,
      count: professors.length,
      professors
    };
  });
};

export const getStudentsByFaculty = () => {
  return facultiesData.map(faculty => {
    const students = studentData.find(student => student.faculty === faculty.name);
    return {
      ...faculty,
      ...students,
      count: students?.totalStudents || 0
    };
  });
};

export const getFacultyByName = (facultyName: string) => {
  return facultiesData.find(faculty => faculty.name === facultyName);
};

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
