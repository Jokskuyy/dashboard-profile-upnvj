import type { Language } from '../types';

export const translations = {
  id: {
    // Navigation & General
    dashboard: 'Dashboard',
    language: 'Bahasa',
    profile: 'Profil Kampus',
    
    // KPI Section
    kpi: 'Indikator Kinerja Utama',
    professors: 'Dosen',
    accreditation: 'Akreditasi',
    students: 'Mahasiswa',
    campusMap: 'Denah Kampus',
    
    // Professors
    professorsTitle: 'Daftar Dosen',
    professorsSubtitle: 'Tenaga pengajar berkualitas UPNVJ',
    totalProfessors: 'Total Dosen',
    viewAll: 'Lihat Semua',
    expertise: 'Keahlian',
    email: 'Email',
    
    // Accreditation
    accreditationTitle: 'Status Akreditasi',
    accreditationSubtitle: 'Pengakuan kualitas program studi',
    program: 'Program Studi',
    level: 'Jenjang',
    accreditor: 'Pemberi Akreditasi',
    validUntil: 'Berlaku Hingga',
    status: 'Status',
    active: 'Aktif',
    expired: 'Kedaluwarsa',
    pending: 'Pending',
    
    // Students
    studentsTitle: 'Data Mahasiswa',
    studentsSubtitle: 'Jumlah mahasiswa per fakultas',
    totalStudents: 'Total Mahasiswa',
    undergraduate: 'S1',
    graduate: 'S2',
    postgraduate: 'S3',
    faculty: 'Fakultas',
    
    // Campus Map
    campusMapTitle: 'Denah Kampus',
    campusMapSubtitle: 'Jelajahi kampus UPNVJ dalam 3D',
    openMap: 'Buka Denah',
    
    // University Info
    universityName: 'Universitas Pembangunan Nasional Veteran Jakarta',
    universityShort: 'UPNVJ',
    internationalProfile: 'Profil Internasional',
    
    // Footer
    footer: {
      address: 'Jl. RS. Fatmawati, Pondok Labu, Jakarta Selatan 12450',
      phone: 'Telepon: +62 21 7656971',
      email: 'Email: info@upnvj.ac.id',
      copyright: '© 2024 Universitas Pembangunan Nasional Veteran Jakarta. Semua hak dilindungi.'
    }
  },
  
  en: {
    // Navigation & General
    dashboard: 'Dashboard',
    language: 'Language',
    profile: 'University Profile',
    
    // KPI Section
    kpi: 'Key Performance Indicators',
    professors: 'Professors',
    accreditation: 'Accreditation',
    students: 'Students',
    campusMap: 'Campus Map',
    
    // Professors
    professorsTitle: 'Faculty Members',
    professorsSubtitle: 'UPNVJ\'s qualified teaching staff',
    totalProfessors: 'Total Professors',
    viewAll: 'View All',
    expertise: 'Expertise',
    email: 'Email',
    
    // Accreditation
    accreditationTitle: 'Accreditation Status',
    accreditationSubtitle: 'Quality recognition of study programs',
    program: 'Study Program',
    level: 'Level',
    accreditor: 'Accrediting Body',
    validUntil: 'Valid Until',
    status: 'Status',
    active: 'Active',
    expired: 'Expired',
    pending: 'Pending',
    
    // Students
    studentsTitle: 'Student Data',
    studentsSubtitle: 'Number of students per faculty',
    totalStudents: 'Total Students',
    undergraduate: 'Undergraduate',
    graduate: 'Graduate',
    postgraduate: 'Postgraduate',
    faculty: 'Faculty',
    
    // Campus Map
    campusMapTitle: 'Campus Map',
    campusMapSubtitle: 'Explore UPNVJ campus in 3D',
    openMap: 'Open Map',
    
    // University Info
    universityName: 'Pembangunan Nasional Veteran Jakarta University',
    universityShort: 'UPNVJ',
    internationalProfile: 'International Profile',
    
    // Footer
    footer: {
      address: 'Jl. RS. Fatmawati, Pondok Labu, South Jakarta 12450',
      phone: 'Phone: +62 21 7656971',
      email: 'Email: info@upnvj.ac.id',
      copyright: '© 2024 Pembangunan Nasional Veteran Jakarta University. All rights reserved.'
    }
  }
};

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
