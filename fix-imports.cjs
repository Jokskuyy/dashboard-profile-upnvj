/**
 * Fix all relative imports based on new directory structure
 */

const fs = require('fs');
const path = require('path');

// Map of file locations to their required path depth
const fixMap = {
  // Components in src/components/common/ need ../../ for contexts/types/utils
  'src/components/common/': {
    '../contexts/': '../../contexts/',
    '../types': '../../types',
    '../utils/': '../../utils/',
    '../services/': '../../services/',
  },
  
  // Components in src/components/dashboard/ need ../../ for contexts/types/utils  
  'src/components/dashboard/': {
    '../contexts/': '../../contexts/',
    '../types': '../../types',
    '../utils/': '../../utils/',
    '../services/': '../../services/',
  },
  
  // Components in src/components/dashboard/sections/ need ../../../
  'src/components/dashboard/sections/': {
    '../contexts/': '../../../contexts/',
    '../types': '../../../types',
    '../utils/': '../../../utils/',
    '../services/': '../../../services/',
    './FacultyBarChart': '../../charts/FacultyBarChart',
    './DepartmentBarChart': '../../charts/DepartmentBarChart',
    './ProgramBarChart': '../../charts/ProgramBarChart',
    './campus-map/CampusMapViewer': '../../campus-map/CampusMapViewer',
  },
  
  // Components in src/components/admin/ need ../../
  'src/components/admin/': {
    '../contexts/': '../../contexts/',
    '../types': '../../types',
    '../utils/': '../../utils/',
    '../services/': '../../services/',
  },
  
  // Components in src/components/admin/analytics/ need ../../../
  'src/components/admin/analytics/': {
    '../services/analytics/trackingService': '../../../services/analytics/trackingService',
  },
  
  // Components in src/components/analytics/ need ../../
  'src/components/analytics/': {
    '../contexts/': '../../contexts/',
    '../types': '../../types',
    '../services/analytics/trackingService': '../../services/analytics/trackingService',
  },
  
  // Components in src/components/auth/ need ../../
  'src/components/auth/': {
    '../contexts/': '../../contexts/',
  },
  
  // Components in src/components/charts/ need ../../
  'src/components/charts/': {
    '../types': '../../types',
  },
  
  // Components in src/components/campus-map/ need ../../
  'src/components/campus-map/': {
    '../contexts/': '../../contexts/',
  },
  
  // Modals in src/components/modals/crud/ need ../../
  'src/components/modals/crud/': {
    '../../types': '../../../types',
    '../../services/api/dataService': '../../../services/api/dataService',
  },
  
  // Services in src/services/api/ need ../../
  'src/services/api/': {
    '../types': '../../types',
  },
};

function getRelativePath(filePath) {
  const normalized = path.normalize(filePath).replace(/\\/g, '/');
  for (const [dirPath, _] of Object.entries(fixMap)) {
    if (normalized.includes(dirPath.replace(/\\/g, '/'))) {
      return dirPath;
    }
  }
  return null;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const dirPath = getRelativePath(filePath);
  
  if (!dirPath) return false;
  
  const replacements = fixMap[dirPath];
  let changed = false;
  
  for (const [oldPath, newPath] of Object.entries(replacements)) {
    // Handle both single and double quotes, preserve original quote style
    const singleQuoteRegex = new RegExp(
      `from '${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`,
      'g'
    );
    const doubleQuoteRegex = new RegExp(
      `from "${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
      'g'
    );
    
    if (singleQuoteRegex.test(content)) {
      content = content.replace(singleQuoteRegex, `from '${newPath}'`);
      changed = true;
    }
    if (doubleQuoteRegex.test(content)) {
      content = content.replace(doubleQuoteRegex, `from "${newPath}"`);
      changed = true;
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

console.log('🔄 Fixing all relative imports...\n');

let fixedCount = 0;
const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
  if (fixImports(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files!`);
