import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

// Find boundary between SCHEDULES data (start double quotes) and JS code
const dataEnd = s.indexOf('\n  var BUS_STOPS = [');
const schedulesPart = s.substring(0, dataEnd);
let codePart = s.substring(dataEnd);

// Replace ALL " at JS string delimiters with '
// But only those that delimit strings containing HTML with attributes

// Strategy: find " that are string delimiters in the JS code.
// The JS code uses ' for HTML strings and " for simple strings.
// After fix-quotes, ALL ' became ".
// We need to convert back the " that should be '

// For each " in codePart:
//   - Look at context: if content between this " and matching " contains 
//     an HTML tag with attributes (="), this " should be '
//   - Otherwise keep as "

let out = '';
let i = 0;

while (i < codePart.length) {
  // Find next "
  const dq = codePart.indexOf('"', i);
  if (dq === -1) { out += codePart.substring(i); break; }
  
  // Check if this " starts a string (preceded by = + ( space etc.)
  const prev = dq > 0 ? codePart[dq - 1] : undefined;
  const prev2 = dq > 1 ? codePart.substring(dq - 2, dq) : '';
  
  // If preceded by letter or digit, it might be part of a regex like /"/g
  // In that case, skip it
  if (prev && /[a-zA-Z0-9_\]\)]/.test(prev) && prev2 !== '\\"') {
    out += codePart[i];
    i++;
    continue;
  }
  
  // If preceded by =, +, (, <space>, it's likely a string start
  // Find matching closing "
  let j = dq + 1;
  while (j < codePart.length) {
    const ch = codePart[j];
    if (ch === '\\') { j += 2; continue; }
    if (ch === '"') break;
    j++;
  }
  
  if (j >= codePart.length) { out += codePart.substring(i); break; }
  
  // Extract content
  const content = codePart.substring(dq + 1, j);
  
  // Check if this is an HTML string with attributes
  // Pattern: contains ="... inside the string
  if (content.indexOf('="') >= 0) {
    // This should be single-quoted
    out += codePart.substring(i, dq);
    out += "'" + content + "'";
    i = j + 1;
  } else {
    // Keep as double-quoted
    out += codePart.substring(i, j + 1);
    i = j + 1;
  }
}

s = schedulesPart + out;
fs.writeFileSync('app.js', s, 'utf8');
console.log('Fixed HTML strings delimiters');
