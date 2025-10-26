/**
 * Fix quote mismatches in import statements
 */

const fs = require('fs');
const path = require('path');

function fixQuotes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix mixed quotes in import statements: from '..."; or from "...';
  content = content.replace(/from '([^'"]+)";/g, "from '$1';");
  content = content.replace(/from "([^'"]+)';/g, 'from "$1";');
  
  if (content !== original) {
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

console.log('🔄 Fixing quote mismatches...\n');

let fixedCount = 0;
const srcDir = path.join(__dirname, 'src');

walkDir(srcDir, (filePath) => {
  if (fixQuotes(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files!`);
