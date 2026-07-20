import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

// Replace single-quoted strings with double-quoted strings everywhere
// Match: `'some text'` -> `"some text"`
// But be careful not to break unicode escapes
  
// Step 1: Replace all 'text' with "text" 
// This is a simple approach - better to target only to: blocks
// But the entire file is consistent: original uses double quotes, restored uses single

// Simple replacer: find single-quoted strings and convert
// Pattern: '...' where ... doesn't contain quotes or escapes
s = s.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');

fs.writeFileSync('app.js', s, 'utf8');
console.log('Converted single quotes to double quotes');
