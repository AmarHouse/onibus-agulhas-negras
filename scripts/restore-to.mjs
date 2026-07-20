import fs from 'fs';

// Read the data source script
const srcText = fs.readFileSync('scripts/atualizar-horarios.mjs', 'utf8');
// Find the SCHEDULES array content
const m = srcText.match(/const SCHEDULES = \[([\s\S]*?)\];/);
if (!m) { console.log('SCHEDULES not found in source'); process.exit(1); }

// Read current app.js
let app = fs.readFileSync('app.js', 'utf8');

// Map code -> to JSON block from source
const codeToTo = {};
const lineRe = /\{([\s\S]*?)\n\s*\},?/g;  
const lines = srcText.substring(m.index + 18, m.index + m[0].length - 1); // +18 for "const SCHEDULES = ["
// Actually simpler: find all objects in the SCHEDULES array
const objRe = /\{([^}]*?(?:\{[^}]*\}[^}]*)*)\}/g;
const rawObjs = m[1].match(objRe) || [];

// Re-parse with a more careful approach: tokenize by { } nesting
function extractObjects(text) {
  const results = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        results.push(text.substring(start, i + 1));
        start = -1;
      }
    }
  }
  return results;
}

const objects = extractObjects(m[1].replace(/\n/g, ' '));

const REAL_CODES = ['IT01','IT02','RPE','P135','PEN','MAR','RJO','RJO-EXEC','RNI','EPR','QRI'];

for (const obj of objects) {
  const code = (obj.match(/code:\s*['"](\w+)['"]/) || [])[1];
  if (!code) continue;
  
  // Extract the to: block
  const toMatch = obj.match(/,?\s*to:\s*(\{[\s\S]*?\})/);
  if (toMatch) {
    codeToTo[code] = toMatch[1];
  }
}

console.log('Found to: data for codes:', Object.keys(codeToTo).sort().join(', '));

// Now for each ESTIMATED line in app.js, restore the to: block
const estCodes = Object.keys(codeToTo).filter(c => !REAL_CODES.includes(c));
console.log('Estimated codes to restore to:', estCodes.join(', '));

let changes = 0;
for (const code of estCodes) {
  const toData = codeToTo[code];
  if (!toData) continue;
  
  // In current app.js, find the line with this code that's MISSING a to:
  // They'll have the pattern like: { code: "CODE", ... from: {...} },
  // and LACK ", to: {...}"
  // We need to insert the to: block after the from: block
  
  // Find the from: block end for this code
  const codeIdx = app.indexOf(`code: "${code}"`);
  if (codeIdx === -1) {
    // maybe single-quote
    console.log(`  SKIP ${code}: not found in app.js`);
    continue;
  }
  
  // Check if it already has a to:
  const lineEnd = app.indexOf('},', codeIdx);
  const chunk = app.substring(codeIdx, lineEnd + 2);
  
  if (chunk.includes(', to:')) {
    console.log(`  SKIP ${code}: already has to:`);
    continue;
  }
  
  // Find the end of the from: block (find the last `}` before the end of the object)
  // The chunk ends with }, (closing schedule and comma)
  // Before the last }, there's the from: closing brace
  // We need to insert , to: DATA before the last }
  
  // The chunk looks like: { code:..., from: { name:..., times: {...} } },
  // We need to replace the last }}, with }, to: DATA },
  // Actually let me find the actual pattern by examining the chunk
  
  // Find the last occurrence of '} }' which represents end of from and end of schedule
  // The format: ...from: { name:"...", times:{...} } },
  // We need to insert to: DATA before the final '}'
  
  const lastBrace = chunk.lastIndexOf('}');
  // The positions: ...,from: {...} },
  //                          ^-- lastBrace at the closing of from
  // Then after lastBrace there may be ` }` or just `}`
  // Let me check what's before the `},`
  
  // Actually the cleanest way: replace the from closing + schedule close with from close + to + schedule close
  // The pattern at end is: } }, 
  // Replace the first } (end of times) is already in from block
  
  // The format should be: ...from: { name:"...", times: { ... } }, 
  // We want: ...from: { name:"...", times: { ... } }, to: DATA },
  
  // Replace: the from: block closure (the `}` closing from) followed by `,` (comma before schedule end)
  // With: from close + `, to: DATA }`
  
  // But wait - the structure is nested. Let me think...
  // { code:..., from: { name:..., times: { weekday:[],..., holiday:[] } } },
  // The `}` at position X closes times, `}` at position Y closes from, then `,` closes the schedule
  // Wait no - `},` at the end has `}` closing the schedule AND `,` being the comma separator
  // So: { ... from: {...} } }, where:
  //   - first `}` = closes from (or times? no)
  //   - Actually: { code: ..., from: { name: "X", times: { weekday: [...],... } } },
  //   Inner `}` closes `times`, outer `}` closes `from`, then `}` closes the whole SCHEDULE, then `,`
  //   So: ...times:{...} } },
  //                   ^-- times^  ^-- from^--  ^-- schedule^  ^-- comma
  
  // So we have: from close (`}`) then schedule close (`}`) then comma
  // We need: from close (`}`) then `, to: DATA ` then schedule close (`}`) then comma
  
  // So replace the pattern ` } },` right after from with ` }, to: DATA },`
  
  // Let me find the exact pattern in the chunk
  // Find the from: subsection
  const fromMatch = chunk.match(/from:\s*\{\s*name:\s*"[^"]*",\s*times:\s*\{[^}]*\}\s*\}/);
  if (!fromMatch) {
    console.log(`  SKIP ${code}: cannot find from block`);
    continue;
  }
  
  // Replace the entire from block followed by schedule close with from + to + schedule close
  const oldPattern = fromMatch[0];
  const newPattern = oldPattern + ', to: ' + toData;
  
  // Now find and replace in app.js
  // Be specific: find the code and replace the exact chunk
  const searchStr = app.substring(codeIdx, lineEnd + 2);
  const replaceStr = searchStr.replace(oldPattern, newPattern);
  
  if (searchStr === replaceStr) {
    console.log(`  FAIL ${code}: could not replace`);
  } else {
    const beforeLen = app.length;
    app = app.substring(0, codeIdx) + replaceStr + app.substring(lineEnd + 2);
    console.log(`  OK ${code}: restored to:`);
    changes++;
  }
}

fs.writeFileSync('app.js', app, 'utf8');
console.log(`\nDone! ${changes} changes made.`);

// Verify
const final = fs.readFileSync('app.js', 'utf8');
const toCount = (final.match(/code:/g)||[]).length;
console.log('Total codes:', toCount);
