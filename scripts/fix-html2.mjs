import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

const dataEnd = s.indexOf('\n  var BUS_STOPS = [');
const codePart = s.substring(dataEnd);

// Find ALL instances of "< followed by a tag name
// These are broken HTML strings
const regex = /"<([a-zA-Z]+)(\s+[^>]*?)>/g;
let match;
while ((match = regex.exec(codePart)) !== null) {
  const fullMatch = match[0];
  const tagName = match[1];
  console.log(`Found "<${tagName}> pattern at index ${match.index}: ${fullMatch.substring(0, 50)}`);
}

// Alternative: find all broken patterns where a " is used as delimiter but the string contains another "
// Simple approach: find " followed by < and check if there's another " before the next + or ;
let result = '';
let i = 0;

while (i < codePart.length) {
  // Find next " that might start an HTML string
  const idx = codePart.indexOf('"<', i);
  if (idx === -1) { result += codePart.substring(i); break; }
  
  // Check what's before this "
  const before = idx > 0 ? codePart[idx - 1] : '';
  
  // If preceded by =, +, (, space, etc., it's a string start
  if (/[\s=+(\[,;!?:|&]/.test(before) || idx === 0) {
    // Find the matching end: we need the " that closes this string
    // The string is: "<tagname ... ...>"
    // The closing " is after the > that ends the opening tag
    // But there could be attributes with " inside
    
    // Strategy: scan until we find " followed by + or ; or ) or , or .
    // This is the closing delimiter of the HTML string
    
    const fromHere = codePart.substring(idx + 1); // skip the opening "
    let depth = 0;
    let closePos = -1;
    for (let j = 0; j < fromHere.length; j++) {
      const ch = fromHere[j];
      if (ch === '<') depth++;
      if (ch === '>') depth--;
      if (ch === '"' && depth === 0 && j > 0) {
        // This " closes the string (not inside an attribute)
        // Check next char: should be + or ; or ) or , or .
        const nxt = fromHere[j + 1];
        if (/[\s+;),\].]/.test(nxt)) {
          closePos = idx + 1 + j;
          break;
        }
      }
    }
    
    if (closePos > 0) {
      const content = codePart.substring(idx + 1, closePos);
      const beforeStr = codePart.substring(Math.max(0, idx - 3), idx);
      result += codePart.substring(i, idx);
      result += "'" + content + "'";
      i = closePos + 1;
      continue;
    }
  }
  
  result += codePart[i];
  i++;
}

s = s.substring(0, dataEnd) + result;
fs.writeFileSync('app.js', s, 'utf8');
console.log('Done fixing HTML strings');
