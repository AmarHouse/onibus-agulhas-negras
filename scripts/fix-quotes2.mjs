import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

// The SCHEDULES array is from line 4 to line with '];' followed by newline
// Everything BEFORE the SCHEDULES should keep its original quoting
// Everything AFTER the SCHEDULES should use single quotes for JS strings

// Strategy: split into SCHEDULES part and the rest (BUS_STOPS, functions)
// For the SCHEDULES part, keep double quotes
// For the REST, restore single quotes for strings

const schedulesEnd = s.indexOf('\n  var BUS_STOPS = [');
if (schedulesEnd === -1) {
  console.log('Cannot find BUS_STOPS boundary');
  process.exit(1);
}

const schedulesPart = s.substring(0, schedulesEnd);
const restPart = s.substring(schedulesEnd);

// In the rest part, convert "strings" back to 'strings' BUT only for outer delimiters,
// not for inner quotes like class="empty-state"
// Strategy: find strings that contain HTML with =", and keep them as single-quoted

// Simpler: replace all double quotes used as string delimiters with single quotes
// A string delimiter is a " that is:
// 1. Preceded by = or whitespace or ( or , or ; or [ or + or return or ?
// 2. Followed by non-whitespace content

// Actually, let me just target the known broken patterns
// The issue is specifically: container.innerHTML = "<div...>"

// Quickest fix: in the rest part, convert outer double quotes back to single
// while preserving double quotes inside strings

let result = '';
let inString = false;
let stringChar = '';
let i = 0;

// Process schedules part as-is
result += schedulesPart;

// Process rest part carefully
for (i = 0; i < restPart.length; i++) {
  const ch = restPart[i];
  
  if (inString) {
    if (ch === '\\') {
      result += ch;
      i++;
      if (i < restPart.length) result += restPart[i];
      continue;
    }
    if (ch === stringChar) {
      inString = false;
      // Close with the same char we opened with
      result += ch;
      continue;
    }
    result += ch;
    continue;
  }
  
  // Not in string
  if (ch === '"') {
    // Check if this is a double quote that should stay (inside SCHEDULES data)
    // or one that should be converted (JS code)
    
    // Look at context: if we're processing restPart (after SCHEDULES),
    // ALL " delimiters in the JS code should be ' for compatibility
    // But " inside HTML strings like class="..." should stay as "
    
    // Actually, the ORIGINAL code used ' for all JS string delimiters.
    // After the quote fix, EVERYTHING became ".
    // I need to convert the outer " back to ' while keeping inner " intact.
    
    // Peek forward to see if there's an HTML-like tag
    // If the string contains =", it's an HTML string and needs ' outer delimiter
    // If not, it's a plain JS string
    
    // The safest: check if the next few chars look like HTML (<div etc.)
    const peek = restPart.substring(i + 1, Math.min(i + 50, restPart.length));
    const containsHtml = peek.includes('<div') || peek.includes('<span') || peek.includes('<button');
    
    if (containsHtml) {
      // Convert to single quote delimiter
      result += "'";
      inString = true;
      stringChar = "'";
    } else {
      // Keep as double quote, but let's check if it was originally single
      // Just keep as is for now
      result += ch;
      inString = true;
      stringChar = ch;
    }
    continue;
  }
  
  result += ch;
}

fs.writeFileSync('app.js', result, 'utf8');
console.log('Fixed quotes');
