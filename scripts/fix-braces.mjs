import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

// For each line in SCHEDULES array, if braces are unbalanced, fix
// Also: detect lines missing the final } of schedule

// Strategy: for each line, count { and }, if { > } add missing ones before the ,

const lines = s.split('\n');
const fixed = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Only process lines that are inside the SCHEDULES array
  // (between const SCHEDULES = [ and ]; )
  if (i === 0 || (fixed.length > 0 && line.trim() === '];')) {
    fixed.push(line);
    continue;
  }
  
  // Check if this is a schedule line (starts with spaces then {)
  if (line.trim().startsWith('{')) {
    // Count braces (excluding those inside strings)
    let opens = 0;
    let inString = false;
    let stringChar = '';
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (inString) {
        if (ch === '\\') { c++; continue; }
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"') { inString = true; stringChar = '"'; continue; }
      if (ch === '{') opens++;
      if (ch === '}') opens--;
    }
    
    if (opens > 0) {
      // Missing closing braces. Add them before the final comma
      // Find the last , and insert closing braces before it
      // Actually, handle edge cases: the line may end with }, 
      // We need to add opens extra } before the final ,
      const lastComma = line.lastIndexOf(',');
      if (lastComma > 0) {
        // Check there's a newline or end after the comma
        const afterComma = line.substring(lastComma + 1).trim();
        if (afterComma === '' || afterComma === '\r') {
          // Add missing braces before the comma
          line = line.substring(0, lastComma) + ' }'.repeat(opens) + ',';
        }
      }
    }
  }
  
  fixed.push(line);
}

fs.writeFileSync('app.js', fixed.join('\n'), 'utf8');
console.log('Fixed braces');

// Verify
const f = fs.readFileSync('app.js', 'utf8');
const verifyLines = f.split('\n');
let errors = 0;
let inArray = false;
for (let i = 0; i < verifyLines.length; i++) {
  const line = verifyLines[i];
  if (line.includes('const SCHEDULES = [')) inArray = true;
  if (inArray && line.trim().startsWith('{')) {
    let opens = 0, inStr = false, strChar = '';
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (inStr) { if (ch === '\\') c++; else if (ch === strChar) inStr = false; continue; }
      if (ch === '"') { inStr = true; strChar = '"'; continue; }
      if (ch === '{') opens++;
      if (ch === '}') opens--;
    }
    if (opens !== 0) {
      const code = (line.match(/code:\s*"([^"]+)"/) || [])[1] || '?';
      console.log('  ERROR line', (i+1), 'code:', code, 'opens left:', opens);
      errors++;
    }
  }
  if (line.trim() === '];') inArray = false;
}
console.log(errors === 0 ? 'All lines balanced!' : errors + ' lines unbalanced');
