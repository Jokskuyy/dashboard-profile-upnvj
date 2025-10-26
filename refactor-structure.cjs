/**
 * Refactoring script - Move files to new modular structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define file movements
const movements = [
  // Common components
  { from: 'src/components/Header.tsx', to: 'src/components/common/Header.tsx' },
  { from: 'src/components/Footer.tsx', to: 'src/components/common/Footer.tsx' },
  { from: 'src/components/LanguageToggle.tsx', to: 'src/components/common/LanguageToggle.tsx' },
  { from: 'src/components/Toast.tsx', to: 'src/components/common/Toast.tsx' },
  { from: 'src/components/ProtectedRoute.tsx', to: 'src/components/common/ProtectedRoute.tsx' },
  
  // Dashboard components
  { from: 'src/components/Dashboard.tsx', to: 'src/components/dashboard/Dashboard.tsx' },
  { from: 'src/components/KPICard.tsx', to: 'src/components/dashboard/KPICard.tsx' },
  
  // Dashboard sections
  { from: 'src/components/AccreditationSection.tsx', to: 'src/components/dashboard/sections/AccreditationSection.tsx' },
  { from: 'src/components/AssetsSection.tsx', to: 'src/components/dashboard/sections/AssetsSection.tsx' },
  { from: 'src/components/CampusMapSection.tsx', to: 'src/components/dashboard/sections/CampusMapSection.tsx' },
  { from: 'src/components/ProfessorsSection.tsx', to: 'src/components/dashboard/sections/ProfessorsSection.tsx' },
  { from: 'src/components/StudentsSection.tsx', to: 'src/components/dashboard/sections/StudentsSection.tsx' },
  
  // Admin components
  { from: 'src/components/AdminDashboard.tsx', to: 'src/components/admin/AdminDashboard.tsx' },
  { from: 'src/components/AdminAnalytics.tsx', to: 'src/components/admin/AdminAnalytics.tsx' },
  { from: 'src/components/AdminTrafficAnalytics.tsx', to: 'src/components/admin/analytics/AdminTrafficAnalytics.tsx' },
  
  // Analytics
  { from: 'src/components/Analytics.tsx', to: 'src/components/analytics/Analytics.tsx' },
  { from: 'src/components/TrafficOverview.tsx', to: 'src/components/analytics/TrafficOverview.tsx' },
  
  // Charts
  { from: 'src/components/DepartmentBarChart.tsx', to: 'src/components/charts/DepartmentBarChart.tsx' },
  { from: 'src/components/FacultyBarChart.tsx', to: 'src/components/charts/FacultyBarChart.tsx' },
  { from: 'src/components/ProgramBarChart.tsx', to: 'src/components/charts/ProgramBarChart.tsx' },
  
  // Auth
  { from: 'src/components/Login.tsx', to: 'src/components/auth/Login.tsx' },
  
  // Campus Map
  { from: 'src/components/CampusMapViewer.tsx', to: 'src/components/campus-map/CampusMapViewer.tsx' },
  
  // Modals - CRUD
  { from: 'src/components/modals/AccreditationModal.tsx', to: 'src/components/modals/crud/AccreditationModal.tsx' },
  { from: 'src/components/modals/AssetModal.tsx', to: 'src/components/modals/crud/AssetModal.tsx' },
  { from: 'src/components/modals/AssetDetailModal.tsx', to: 'src/components/modals/crud/AssetDetailModal.tsx' },
  { from: 'src/components/modals/DepartmentModal.tsx', to: 'src/components/modals/crud/DepartmentModal.tsx' },
  { from: 'src/components/modals/ProfessorModal.tsx', to: 'src/components/modals/crud/ProfessorModal.tsx' },
  { from: 'src/components/modals/ProgramModal.tsx', to: 'src/components/modals/crud/ProgramModal.tsx' },
  { from: 'src/components/modals/StudentModal.tsx', to: 'src/components/modals/crud/StudentModal.tsx' },
  
  // Modals - Shared
  { from: 'src/components/modals/DeleteConfirmModal.tsx', to: 'src/components/modals/shared/DeleteConfirmModal.tsx' },
  
  // Services
  { from: 'src/services/api.ts', to: 'src/services/api/api.ts' },
  { from: 'src/services/dataService.ts', to: 'src/services/api/dataService.ts' },
  { from: 'src/services/trackingService.ts', to: 'src/services/analytics/trackingService.ts' },
];

console.log('🚀 Starting refactoring process...\n');

// Move files using git mv
let movedCount = 0;
let errorCount = 0;

movements.forEach(({ from, to }) => {
  try {
    const fromPath = path.resolve(__dirname, from);
    const toPath = path.resolve(__dirname, to);
    
    if (!fs.existsSync(fromPath)) {
      console.log(`⚠️  Skip: ${from} (doesn't exist)`);
      return;
    }
    
    // Ensure directory exists
    const toDir = path.dirname(toPath);
    if (!fs.existsSync(toDir)) {
      fs.mkdirSync(toDir, { recursive: true });
    }
    
    // Use git mv
    execSync(`git mv "${fromPath}" "${toPath}"`, { stdio: 'pipe' });
    console.log(`✅ Moved: ${from} → ${to}`);
    movedCount++;
  } catch (error) {
    console.log(`❌ Error moving ${from}: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Moved: ${movedCount} files`);
console.log(`  ❌ Errors: ${errorCount} files`);
console.log(`\n✨ Refactoring complete!`);
