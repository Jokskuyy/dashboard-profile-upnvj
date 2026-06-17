import fs from 'fs';
import { categorizeFacility, generateDescription } from './facility-filler.js';

const filePath = 'database/002_seed_data.sql';
console.log(`Processing ${filePath}...`);

let fileContent = fs.readFileSync(filePath, 'utf8');

// The regex captures 7 fields from a tuple:
// 1: name (string)
// 2: desc (string or NULL or $$)
// 3: type (string or NULL)
// 4: lantai (number or string or NULL)
// 5: foto (string or NULL)
// 6: gedung id (number)
// 7: unity object name (string or NULL)
const regex = /\(\s*'([^']+)'\s*,\s*(NULL|'[^']*'|\$\$.*?\$\$)\s*,\s*(NULL|'[^']*')\s*,\s*([^,]+)\s*,\s*(NULL|'[^']*')\s*,\s*(\d+)\s*,\s*(NULL|'[^']*')\s*\)/g;

let modifiedCount = 0;

fileContent = fileContent.replace(regex, (match, name, descMatch, typeMatch, lantai, foto, gedung, unity) => {
    let currentDesc = descMatch === 'NULL' ? '' : descMatch.replace(/^'|'$/g, '').replace(/^\$\$|\$\$$/g, '');
    let currentType = typeMatch === 'NULL' ? '' : typeMatch.replace(/^'|'$/g, '');

    const newType = categorizeFacility(name);
    
    let newDesc = currentDesc;
    let isModified = false;
    
    if (newDesc.length < 10 || newDesc.toLowerCase().includes('ruang untuk')) {
        newDesc = generateDescription(name, newType);
        isModified = true;
    } 
    
    if (currentType !== newType) {
        isModified = true;
    }

    if (isModified) {
        modifiedCount++;
    }

    const safeDesc = newDesc ? `$$${newDesc}$$` : 'NULL';
    const safeType = newType ? `'${newType}'` : 'NULL';

    return `(
    '${name}',
    ${safeDesc},
    ${safeType},
    ${lantai.trim()},
    ${foto.trim()},
    ${gedung.trim()},
    ${unity.trim()}
)`;
});

fs.writeFileSync(filePath, fileContent, 'utf8');

console.log(`Successfully processed ${filePath}.`);
console.log(`Modified ${modifiedCount} tuples.`);
