import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Supabase URL or Service Role Key is missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Parse SQL VALUES clause safely (handles strings, numbers, NULLs, escaped single quotes)
function parseSqlValues(valuesStr) {
  const rows = [];
  let i = 0;
  const len = valuesStr.length;

  while (i < len) {
    // Skip to next '('
    while (i < len && valuesStr[i] !== '(') {
      i++;
    }
    if (i >= len) break;
    i++; // Skip '('

    const rowValues = [];
    let currentVal = '';
    let inString = false;

    while (i < len) {
      const char = valuesStr[i];
      if (inString) {
        if (char === "'") {
          // Check if it's an escaped single quote (SQL uses '' for ')
          if (i + 1 < len && valuesStr[i + 1] === "'") {
            currentVal += "'";
            i += 2;
            continue;
          } else {
            inString = false;
            i++;
            continue;
          }
        }
        currentVal += char;
        i++;
      } else {
        if (char === "'") {
          inString = true;
          i++;
        } else if (char === ')') {
          // End of row
          rowValues.push(currentVal.trim());
          i++;
          break;
        } else if (char === ',') {
          rowValues.push(currentVal.trim());
          currentVal = '';
          i++;
        } else {
          currentVal += char;
          i++;
        }
      }
    }

    // Map raw parsed values (convert 'NULL' to null, strip quotes, etc.)
    const mappedRow = rowValues.map(val => {
      const upper = val.toUpperCase();
      if (upper === 'NULL') return null;
      // If it looks like a number, parse it
      if (!isNaN(val) && val !== '') return Number(val);
      // Clean JSON casting if any (e.g. '{"a": 1}'::jsonb -> we just want the JSON string)
      if (val.includes('::jsonb')) {
        let cleanJson = val.split('::jsonb')[0];
        if (cleanJson.startsWith("'") && cleanJson.endsWith("'")) {
          cleanJson = cleanJson.slice(1, -1);
        }
        return JSON.parse(cleanJson);
      }
      return val;
    });

    rows.push(mappedRow);
  }

  return rows;
}

async function main() {
  const sqlPath = path.resolve('database/002_seed_data_updated.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Find all INSERT INTO statements
  // Regex matches INSERT INTO public.<table_name> (<columns>) VALUES <values>;
  const insertRegex = /INSERT\s+INTO\s+public\.(\w+)\s*\(([^)]+)\)\s*VALUES([\s\S]+?);/gi;
  let match;
  const inserts = [];

  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const columns = match[2].split(',').map(c => c.trim());
    const valuesStr = match[3];
    
    const rows = parseSqlValues(valuesStr);
    
    // Map rows to objects
    const data = rows.map((row, idx) => {
      const obj = {};
      columns.forEach((col, colIdx) => {
        obj[col] = row[colIdx];
      });
      // Assign explicit id to maintain foreign key consistency
      if (['gedung', 'fakultas', 'program_studi', 'fasilitas'].includes(tableName)) {
        obj.id = idx + 1;
      }
      return obj;
    });

    inserts.push({ tableName, data });
  }

  console.log(`Parsed ${inserts.length} INSERT statements from SQL file.`);

  // We should truncate/delete tables in reverse order of foreign keys
  // order of tables: fasilitas -> program_studi -> fakultas -> gedung
  const deleteOrder = ['fasilitas', 'program_studi', 'fakultas', 'gedung'];
  console.log('Truncating tables in database...');
  for (const table of deleteOrder) {
    const { error } = await supabase.from(table).delete().neq('id', 0);
    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
      process.exit(1);
    }
    console.log(`- Cleared table ${table}`);
  }

  // Insert tables in dependency order: gedung -> fakultas -> program_studi -> fasilitas
  const insertOrder = ['gedung', 'fakultas', 'program_studi', 'fasilitas'];
  for (const table of insertOrder) {
    const insertObj = inserts.find(i => i.tableName === table);
    if (!insertObj) {
      console.log(`No insert data found for table ${table}, skipping.`);
      continue;
    }

    console.log(`Seeding table ${table} with ${insertObj.data.length} rows...`);
    // Batch inserts to prevent payload size issues
    const batchSize = 50;
    for (let i = 0; i < insertObj.data.length; i += batchSize) {
      const batch = insertObj.data.slice(i, i + batchSize);
      const { error } = await supabase.from(table).insert(batch);
      if (error) {
        console.error(`Error inserting into ${table} (batch starting at index ${i}):`, error);
        process.exit(1);
      }
    }
    console.log(`- Successfully seeded ${table}`);
  }

  console.log('All tables successfully seeded!');
}

main().catch(err => {
  console.error('Fatal error during seeding:', err);
});
