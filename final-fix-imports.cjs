/**
 * Final comprehensive import path fixer
 * Fixes all relative import paths based on actual file locations
 */

const fs = require('fs');
const path = require('path');

// Map each directory to the correct relative paths needed
const pathFixes = {
  // Components in src/components/common/ need ../../
  'src/components/common': {
    '../contexts/LanguageContext': '../../contexts/LanguageContext',
    '../contexts/AuthContext': '../../contexts/AuthContext',
    '../assets/': '../../assets/',
  },
  
  // Components in src/components/auth/ need ../../
  'src/components/auth': {
    '../contexts/LanguageContext': '../../contexts/LanguageContext',
    '../contexts/AuthContext': '../../contexts/AuthContext',
  },
  
  // Components in src/components/analytics/ need ../../
  'src/components/analytics': {
    '../contexts/LanguageContext': '../../contexts/LanguageContext',
    '../services/analytics/trackingService': '../../services/analytics/trackingService',
  },
  
  // Components in src/components/campus-map/ need ../../
  'src/components/campus-map': {
    '../contexts/LanguageContext': '../../contexts/LanguageContext',
  },
  
  // Components in src/components/dashboard/sections/ need ../../../
  'src/components/dashboard/sections': {
    '../contexts/LanguageContext': '../../../contexts/LanguageContext',
    '../utils/staticData': '../../../utils/staticData',
    '../types': '../../../types',
    './FacultyBarChart': '../../charts/FacultyBarChart',
    './DepartmentBarChart': '../../charts/DepartmentBarChart',
    './ProgramBarChart': '../../charts/ProgramBarChart',
    './campus-map/CampusMapViewer': '../../campus-map/CampusMapViewer',
  },
  
  // Components in src/components/admin/analytics/ need ../../../
  'src/components/admin/analytics': {
    '../services/analytics/trackingService': '../../../services/analytics/trackingService',
  },
  
  // Modals in src/components/modals/crud/ need ../../../
  'src/components/modals/crud': {
    '../services/api/dataService': '../../../services/api/dataService',
  },
};

function getDirectoryKey(filePath) {
  const normalized = path.normalize(filePath).replace(/\\/g, '/');
  
  for (const dirKey of Object.keys(pathFixes)) {
    if (normalized.includes(dirKey.replace(/\\/g, '/'))) {
      return dirKey;
    }
  }
  
  return null;
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const dirKey = getDirectoryKey(filePath);
  
  if (!dirKey || !pathFixes[dirKey]) {
    return false;
  }
  
  const fixes = pathFixes[dirKey];
  let changed = false;
  
  for (const [oldPath, newPath] of Object.entries(fixes)) {
    // Handle both single and double quotes
    const patterns = [
      { old: `from '${oldPath}'`, new: `from '${newPath}'` },
      { old: `from "${oldPath}"`, new: `from "${newPath}"` },
      { old: `from '${oldPath}';`, new: `from '${newPath}';` },
      { old: `from "${oldPath}";`, new: `from "${newPath}";` },
    ];
    
    for (const pattern of patterns) {
      if (content.includes(pattern.old)) {
        content = content.replace(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.new);
        changed = true;
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  
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

console.log('🔄 Fixing all import paths comprehensively...\n');

let fixedCount = 0;
const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
  if (fixImportsInFile(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files!`);
