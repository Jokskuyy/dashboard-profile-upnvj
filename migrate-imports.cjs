/**
 * Import Path Migration Script
 * This script updates all import paths after directory restructuring
 */

const fs = require('fs');
const path = require('path');

// Mapping of old paths to new paths
const importMappings = {
  // Common components
  "from './Header'": "from './common/Header'",
  "from '../Header'": "from '../common/Header'",
  "from '../../Header'": "from '../../common/Header'",
  "from './components/Header'": "from './components/common/Header'",
  
  "from './Footer'": "from './common/Footer'",
  "from '../Footer'": "from '../common/Footer'",
  "from '../../Footer'": "from '../../common/Footer'",
  "from './components/Footer'": "from './components/common/Footer'",
  
  "from './LanguageToggle'": "from './common/LanguageToggle'",
  "from '../LanguageToggle'": "from '../common/LanguageToggle'",
  "from '../../LanguageToggle'": "from '../../common/LanguageToggle'",
  "from './components/LanguageToggle'": "from './components/common/LanguageToggle'",
  
  "from './Toast'": "from './common/Toast'",
  "from '../Toast'": "from '../common/Toast'",
  "from '../../Toast'": "from '../../common/Toast'",
  "from './components/Toast'": "from './components/common/Toast'",
  
  "from './ProtectedRoute'": "from './common/ProtectedRoute'",
  "from '../ProtectedRoute'": "from '../common/ProtectedRoute'",
  "from '../../ProtectedRoute'": "from '../../common/ProtectedRoute'",
  "from './components/ProtectedRoute'": "from './components/common/ProtectedRoute'",
  
  // Dashboard components
  "from './Dashboard'": "from './dashboard/Dashboard'",
  "from '../Dashboard'": "from '../dashboard/Dashboard'",
  "from './components/Dashboard'": "from './components/dashboard/Dashboard'",
  
  "from './KPICard'": "from './dashboard/KPICard'",
  "from '../KPICard'": "from '../dashboard/KPICard'",
  "from './components/KPICard'": "from './components/dashboard/KPICard'",
  
  // Dashboard sections
  "from './AccreditationSection'": "from './dashboard/sections/AccreditationSection'",
  "from '../AccreditationSection'": "from '../dashboard/sections/AccreditationSection'",
  "from './components/AccreditationSection'": "from './components/dashboard/sections/AccreditationSection'",
  
  "from './AssetsSection'": "from './dashboard/sections/AssetsSection'",
  "from '../AssetsSection'": "from '../dashboard/sections/AssetsSection'",
  "from './components/AssetsSection'": "from './components/dashboard/sections/AssetsSection'",
  
  "from './CampusMapSection'": "from './dashboard/sections/CampusMapSection'",
  "from '../CampusMapSection'": "from '../dashboard/sections/CampusMapSection'",
  "from './components/CampusMapSection'": "from './components/dashboard/sections/CampusMapSection'",
  
  "from './ProfessorsSection'": "from './dashboard/sections/ProfessorsSection'",
  "from '../ProfessorsSection'": "from '../dashboard/sections/ProfessorsSection'",
  "from './components/ProfessorsSection'": "from './components/dashboard/sections/ProfessorsSection'",
  
  "from './StudentsSection'": "from './dashboard/sections/StudentsSection'",
  "from '../StudentsSection'": "from '../dashboard/sections/StudentsSection'",
  "from './components/StudentsSection'": "from './components/dashboard/sections/StudentsSection'",
  
  // Admin components
  "from './AdminDashboard'": "from './admin/AdminDashboard'",
  "from '../AdminDashboard'": "from '../admin/AdminDashboard'",
  "from './components/AdminDashboard'": "from './components/admin/AdminDashboard'",
  
  "from './AdminTrafficAnalytics'": "from './admin/analytics/AdminTrafficAnalytics'",
  "from '../AdminTrafficAnalytics'": "from '../admin/analytics/AdminTrafficAnalytics'",
  "from './components/AdminTrafficAnalytics'": "from './components/admin/analytics/AdminTrafficAnalytics'",
  
  // Analytics
  "from './Analytics'": "from './analytics/Analytics'",
  "from '../Analytics'": "from '../analytics/Analytics'",
  "from './components/Analytics'": "from './components/analytics/Analytics'",
  
  "from './TrafficOverview'": "from './analytics/TrafficOverview'",
  "from '../TrafficOverview'": "from '../analytics/TrafficOverview'",
  "from './components/TrafficOverview'": "from './components/analytics/TrafficOverview'",
  
  // Charts
  "from './DepartmentBarChart'": "from './charts/DepartmentBarChart'",
  "from '../DepartmentBarChart'": "from '../charts/DepartmentBarChart'",
  "from './components/DepartmentBarChart'": "from './components/charts/DepartmentBarChart'",
  
  "from './FacultyBarChart'": "from './charts/FacultyBarChart'",
  "from '../FacultyBarChart'": "from '../charts/FacultyBarChart'",
  "from './components/FacultyBarChart'": "from './components/charts/FacultyBarChart'",
  
  "from './ProgramBarChart'": "from './charts/ProgramBarChart'",
  "from '../ProgramBarChart'": "from '../charts/ProgramBarChart'",
  "from './components/ProgramBarChart'": "from './components/charts/ProgramBarChart'",
  
  // Auth
  "from './Login'": "from './auth/Login'",
  "from '../Login'": "from '../auth/Login'",
  "from './components/Login'": "from './components/auth/Login'",
  
  // Campus Map
  "from './CampusMapViewer'": "from './campus-map/CampusMapViewer'",
  "from '../CampusMapViewer'": "from '../campus-map/CampusMapViewer'",
  "from './components/CampusMapViewer'": "from './components/campus-map/CampusMapViewer'",
  
  // Modals - CRUD
  "from './modals/AccreditationModal'": "from './modals/crud/AccreditationModal'",
  "from '../modals/AccreditationModal'": "from '../modals/crud/AccreditationModal'",
  
  "from './modals/AssetModal'": "from './modals/crud/AssetModal'",
  "from '../modals/AssetModal'": "from '../modals/crud/AssetModal'",
  
  "from './modals/AssetDetailModal'": "from './modals/crud/AssetDetailModal'",
  "from '../modals/AssetDetailModal'": "from '../modals/crud/AssetDetailModal'",
  
  "from './modals/DepartmentModal'": "from './modals/crud/DepartmentModal'",
  "from '../modals/DepartmentModal'": "from '../modals/crud/DepartmentModal'",
  
  "from './modals/ProfessorModal'": "from './modals/crud/ProfessorModal'",
  "from '../modals/ProfessorModal'": "from '../modals/crud/ProfessorModal'",
  
  "from './modals/ProgramModal'": "from './modals/crud/ProgramModal'",
  "from '../modals/ProgramModal'": "from '../modals/crud/ProgramModal'",
  
  "from './modals/StudentModal'": "from './modals/crud/StudentModal'",
  "from '../modals/StudentModal'": "from '../modals/crud/StudentModal'",
  
  // Modals - Shared
  "from './modals/DeleteConfirmModal'": "from './modals/shared/DeleteConfirmModal'",
  "from '../modals/DeleteConfirmModal'": "from '../modals/shared/DeleteConfirmModal'",
  
  // Services
  "from './services/api'": "from './services/api/api'",
  "from '../services/api'": "from '../services/api/api'",
  "from '../../services/api'": "from '../../services/api/api'",
  
  "from './services/dataService'": "from './services/api/dataService'",
  "from '../services/dataService'": "from '../services/api/dataService'",
  "from '../../services/dataService'": "from '../../services/api/dataService'",
  
  "from './services/trackingService'": "from './services/analytics/trackingService'",
  "from '../services/trackingService'": "from '../services/analytics/trackingService'",
  "from '../../services/trackingService'": "from '../../services/analytics/trackingService'",
};

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [oldPath, newPath] of Object.entries(importMappings)) {
    if (content.includes(oldPath)) {
      content = content.replaceAll(oldPath, newPath);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git')) {
        walkDir(filePath, callback);
      }
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

// Run the migration
const srcDir = path.join(__dirname, 'src');
let updatedCount = 0;

console.log('🔄 Starting import path migration...\n');

walkDir(srcDir, (filePath) => {
  if (updateImportsInFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Migration complete! Updated ${updatedCount} files.`);
