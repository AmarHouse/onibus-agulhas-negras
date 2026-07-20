import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

const dataEnd = s.indexOf('\n  var BUS_STOPS = [');
const schedulesPart = s.substring(0, dataEnd);
let codePart = s.substring(dataEnd);

let out = '';
let i = 0;

while (i < codePart.length) {
  // Find next " that might be a string delimiter
  const dq = codePart.indexOf('"', i);
  if (dq === -1) { out += codePart.substring(i); break; }
  
  const prev = dq > 0 ? codePart[dq - 1] : '';
  
  // Skip if preceded by letter/digit (regex pattern like /"/g or already handled)
  if (/[a-zA-Z0-9_\]\)]/.test(prev)) {
    out += codePart[i];
    i++;
    continue;
  }
  
  // This " might start a string. Find the matching close.
  // For HTML strings with attributes, we need to find the REAL closing "
  // The real closing " is the one that's followed by +, ;, ), or EOF
  // NOT the one inside an attribute like class="
  
  let j = dq + 1;
  let depth = 0; // track nesting of attributes? No, just look for pattern
  
  while (j < codePart.length) {
    if (codePart[j] === '\\') { j += 2; continue; }
    
    if (codePart[j] === '"') {
      // Potential closing ". Check context:
      // If next non-space char is + or ; or ) or , or . or ] or },
      // OR if preceded by > (closing tag), this is likely the real close
      const nextNonSpace = codePart.substring(j + 1).match(/\S/);
      const nextChar = nextNonSpace ? nextNonSpace[0] : '';
      
      const prevNonSpace = codePart.substring(0, j).match(/(\S)\s*$/);
      const prevChar = prevNonSpace ? prevNonSpace[1] : '';
      
      if (prevChar === '>' || /[+;),\].}]/.test(nextChar)) {
        // This is the real closing "
        break;
      }
      // Otherwise, this " is inside the string (e.g., attribute value)
    }
    j++;
  }
  
  if (j >= codePart.length) { out += codePart.substring(i); break; }
  
  const content = codePart.substring(dq + 1, j);
  
  // If content looks like HTML with attributes, use single quote
  if (content.indexOf('="') >= 0 || content.indexOf("><") >= 0) {
    out += codePart.substring(i, dq);
    out += "'" + content + "'";
  } else {
    out += codePart.substring(i, j + 1);
  }
  
  i = j + 1;
}

s = schedulesPart + out;
fs.writeFileSync('app.js', s, 'utf8');
console.log('Fixed HTML strings');
