/**
 * Complete Import Path Migration Script
 * Updates all imports after directory restructuring
 */

const fs = require('fs');
const path = require('path');

// Component import patterns to update
const patterns = [
  // App.tsx level imports - already done manually
  
  // Within dashboard folder - sections imports
  {
    match: /from ['"]\.\.\/\.\.\/(\w+Section)['"]/g,
    replace: "from './sections/$1'"
  },
  
  // Within sections - need to go up to common
  {
    match: /from ['"]\.\.\/\.\.\/Header['"]/g,
    replace: "from '../../common/Header'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/Footer['"]/g,
    replace: "from '../../common/Footer'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/LanguageToggle['"]/g,
    replace: "from '../../common/LanguageToggle'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/Toast['"]/g,
    replace: "from '../../common/Toast'"
  },
  
  // Bar charts imports (from dashboard sections)
  {
    match: /from ['"]\.\.\/\.\.\/DepartmentBarChart['"]/g,
    replace: "from '../../charts/DepartmentBarChart'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/FacultyBarChart['"]/g,
    replace: "from '../../charts/FacultyBarChart'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/ProgramBarChart['"]/g,
    replace: "from '../../charts/ProgramBarChart'"
  },
  
  // Modal imports (from dashboard sections and admin)
  {
    match: /from ['"]\.\.\/modals\/(\w+Modal)['"]/g,
    replace: "from '../modals/crud/$1'"
  },
  {
    match: /from ['"]\.\/modals\/(\w+Modal)['"]/g,
    replace: "from './modals/crud/$1'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/modals\/(\w+Modal)['"]/g,
    replace: "from '../../modals/crud/$1'"
  },
  
  // DeleteConfirmModal (shared)
  {
    match: /from ['"]\.\.\/modals\/DeleteConfirmModal['"]/g,
    replace: "from '../modals/shared/DeleteConfirmModal'"
  },
  {
    match: /from ['"]\.\/modals\/DeleteConfirmModal['"]/g,
    replace: "from './modals/shared/DeleteConfirmModal'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/modals\/DeleteConfirmModal['"]/g,
    replace: "from '../../modals/shared/DeleteConfirmModal'"
  },
  
  // Services - api and dataService
  {
    match: /from ['"]\.\.\/services\/api['"]/g,
    replace: "from '../services/api/api'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/services\/api['"]/g,
    replace: "from '../../services/api/api'"
  },
  {
    match: /from ['"]\.\/services\/api['"]/g,
    replace: "from './services/api/api'"
  },
  
  {
    match: /from ['"]\.\.\/services\/dataService['"]/g,
    replace: "from '../services/api/dataService'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/services\/dataService['"]/g,
    replace: "from '../../services/api/dataService'"
  },
  {
    match: /from ['"]\.\/services\/dataService['"]/g,
    replace: "from './services/api/dataService'"
  },
  
  // Services - trackingService
  {
    match: /from ['"]\.\.\/services\/trackingService['"]/g,
    replace: "from '../services/analytics/trackingService'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/services\/trackingService['"]/g,
    replace: "from '../../services/analytics/trackingService'"
  },
  {
    match: /from ['"]\.\/services\/trackingService['"]/g,
    replace: "from './services/analytics/trackingService'"
  },
  
  // CampusMapViewer imports
  {
    match: /from ['"]\.\.\/CampusMapViewer['"]/g,
    replace: "from '../campus-map/CampusMapViewer'"
  },
  {
    match: /from ['"]\.\.\/\.\.\/CampusMapViewer['"]/g,
    replace: "from '../../campus-map/CampusMapViewer'"
  },
  {
    match: /from ['"]\.\/CampusMapViewer['"]/g,
    replace: "from './campus-map/CampusMapViewer'"
  },
  
  // Analytics components (for Header/LanguageToggle)
  {
    match: /from ['"]\.\/Analytics['"]/g,
    replace: "from '../analytics/Analytics'"
  },
  {
    match: /from ['"]\.\.\/Analytics['"]/g,
    replace: "from '../analytics/Analytics'"
  },
  
  // AdminTrafficAnalytics
  {
    match: /from ['"]\.\/AdminTrafficAnalytics['"]/g,
    replace: "from './analytics/AdminTrafficAnalytics'"
  },
  {
    match: /from ['"]\.\.\/AdminTrafficAnalytics['"]/g,
    replace: "from '../admin/analytics/AdminTrafficAnalytics'"
  },
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  const originalContent = content;
  
  patterns.forEach(({ match, replace }) => {
    const before = content;
    content = content.replace(match, replace);
    if (content !== before) {
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
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

console.log('🔄 Starting comprehensive import migration...\n');

walkDir(srcDir, (filePath) => {
  if (updateFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Migration complete! Updated ${updatedCount} files.`);
