import fs from 'fs';
let s = fs.readFileSync('app.js', 'utf8');

// Find the boundary between SCHEDULES (with double quotes) and JS code
const dataEnd = s.indexOf('\n  var BUS_STOPS = [');
if (dataEnd === -1) {
  console.log('Cannot find BUS_STOPS boundary');
  process.exit(1);
}

const schedulesPart = s.substring(0, dataEnd);
let codePart = s.substring(dataEnd);

// In codePart, fix broken double-quoted HTML strings.
// Strategy: find strings like "<div ...>" or "<span ...>" or "<button ...>"
// that contain " inside them and convert outer delimiter to '
// Pattern: "<([a-z]+) class="  ->  '<$1 class="
// But we also need to close with ' not "

// More systematic: find all "string" patterns in the code part,
// if the string content contains an HTML tag with an attribute,
// change outer delimiters to single quotes

// Step 1: Find ALL strings that are delimited by " and contain "<tagname" or similar
// Convert them to use ' delimiter
// Safe approach: for each " in the codePart (after data), scan forward to matching "
// If the content has < and =", it's an HTML string -> change delimiters to '

let result = '';
let i = 0;
let prevIdx = 0;

while (i < codePart.length) {
  // Find next " that starts a string (not inside a regex, not part of HTML)
  const dqIdx = codePart.indexOf('"', i);
  if (dqIdx === -1) break;
  
  // Determine if this " starts a string or is part of a regex
  // Check preceding char: if it's a letter, ), ], }, it's likely NOT a string start
  const before = dqIdx > 0 ? codePart[dqIdx - 1] : '';
  const beforeWord = codePart.substring(Math.max(0, dqIdx - 3), dqIdx);
  
  // If preceded by letter/digit, it's not a string start (e.g., typeof" or foo")
  if (/^[a-zA-Z0-9_$)\]}]$/.test(before)) {
    i = dqIdx + 1;
    continue;
  }
  
  if (before === "'" || before === '+' || before === '=>' || before === '=') {
    // Might be a string start
  }
  
  // Find the matching closing "
  let closeIdx = dqIdx + 1;
  let inEscape = false;
  while (closeIdx < codePart.length) {
    const ch = codePart[closeIdx];
    if (inEscape) { inEscape = false; closeIdx++; continue; }
    if (ch === '\\') { inEscape = true; closeIdx++; continue; }
    if (ch === '"') break;
    closeIdx++;
  }
  
  if (closeIdx >= codePart.length) break;
  
  // Extract the string content (without delimiters)
  const content = codePart.substring(dqIdx + 1, closeIdx);
  
  // Check if this string contains HTML with attributes (and thus inner quotes)
  // Pattern: a <tag with =" 
  const hasHtmlWithQuotes = /<[a-z]+\s+[^>]*="/i.test(content);
  
  if (hasHtmlWithQuotes) {
    // This string needs single-quote delimiters
    // Build result up to this point
    result += codePart.substring(prevIdx, dqIdx);
    // Add single quote + content + single quote
    result += "'" + content + "'";
    prevIdx = closeIdx + 1;
  }
  
  i = closeIdx + 1;
}

result += codePart.substring(prevIdx);

// Check for any remaining patterns: concatenated strings where one part starts with HTML
// e.g., "foo" + "<div" -> the " before <div needs to be '

s = schedulesPart + result;
fs.writeFileSync('app.js', s, 'utf8');
console.log('Fixed HTML strings in code section');
