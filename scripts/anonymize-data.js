#!/usr/bin/env node

/**
 * Data Anonymization Script
 * 
 * This script helps anonymize sensitive data in JSON files
 * before committing to public repository.
 * 
 * Usage:
 *   node scripts/anonymize-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = path.join(__dirname, '../public/data');
const OUTPUT_DIR = path.join(__dirname, '../public/data-anonymized');

// Anonymization rules
const ANONYMIZE_CONFIG = {
  // Replace real emails with generic ones
  email: (email) => {
    if (!email || !email.includes('@')) return email;
    const domain = email.split('@')[1];
    return `user${Math.floor(Math.random() * 9999)}@${domain}`;
  },
  
  // Mask phone numbers
  phone: (phone) => {
    if (!phone) return phone;
    return phone.replace(/\d/g, 'X');
  },
  
  // Keep names but make them generic
  name: (name) => {
    if (!name) return name;
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}. ${parts[parts.length - 1][0]}***`;
    }
    return `${name[0]}***`;
  },
  
  // Remove addresses
  address: () => '[Address Hidden]',
};

// Fields to anonymize
const SENSITIVE_FIELDS = {
  email: ANONYMIZE_CONFIG.email,
  phone: ANONYMIZE_CONFIG.phone,
  nama: ANONYMIZE_CONFIG.name,
  name: ANONYMIZE_CONFIG.name,
  alamat: ANONYMIZE_CONFIG.address,
  address: ANONYMIZE_CONFIG.address,
  telepon: ANONYMIZE_CONFIG.phone,
  kontak: ANONYMIZE_CONFIG.phone,
};

/**
 * Anonymize object recursively
 */
function anonymizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => anonymizeObject(item));
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    
    // Check if this field should be anonymized
    if (SENSITIVE_FIELDS[lowerKey]) {
      result[key] = SENSITIVE_FIELDS[lowerKey](value);
    } else if (typeof value === 'object') {
      result[key] = anonymizeObject(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Process a single JSON file
 */
function processFile(filename) {
  const inputPath = path.join(DATA_DIR, filename);
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  console.log(`\n📄 Processing: ${filename}`);
  
  try {
    // Read file
    const content = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(content);
    
    // Anonymize
    const anonymized = anonymizeObject(data);
    
    // Write output
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    fs.writeFileSync(
      outputPath,
      JSON.stringify(anonymized, null, 2),
      'utf8'
    );
    
    console.log(`   ✅ Anonymized → ${outputPath}`);
    
    // Show sample changes
    const original = JSON.stringify(data).length;
    const result = JSON.stringify(anonymized).length;
    console.log(`   📊 Size: ${original} → ${result} bytes`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔒 Data Anonymization Script');
  console.log('================================\n');
  console.log(`Input:  ${DATA_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  
  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`\n❌ Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }
  
  // Get all JSON files
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('\n⚠️  No JSON files found in data directory');
    process.exit(0);
  }
  
  console.log(`\n📁 Found ${files.length} JSON file(s)\n`);
  
  // Process each file
  files.forEach(processFile);
  
  console.log('\n================================');
  console.log('✅ Anonymization complete!\n');
  console.log('Next steps:');
  console.log('1. Review anonymized files in:', OUTPUT_DIR);
  console.log('2. If satisfied, replace original files:');
  console.log(`   cp ${OUTPUT_DIR}/* ${DATA_DIR}/`);
  console.log('3. Commit to Git');
  console.log('\n⚠️  Warning: This will overwrite original data!');
  console.log('   Make sure you have backups!\n');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { anonymizeObject, processFile };
