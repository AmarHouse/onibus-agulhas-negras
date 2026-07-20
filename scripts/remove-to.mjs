import fs from 'fs';

const src = fs.readFileSync('app.js', 'utf8');

// Real lines com dado confirmado (ambos sentidos são saídas reais)
const REAL_CODES = ['IT01','IT02','RPE','P135','PEN','MAR','RJO','RJO-EXEC','RNI','EPR','QRI'];

// Para cada linha estimada, remover `to: { ... }`
// Estratégia: encontrar cada object SCHEDULE por regex, capturar o to interno, remover

// Match each full schedule object
// We need to find the last `to:` block within each non-real schedule and remove it
// The to: block is always at the end before `}` closing the schedule object

let result = src;

// Match each line, extract code and full to: block
// Pattern: to: { name: "...", times: { weekday: [...], saturday: [...], sunday: [...], holiday: [...] } }
// This is the last property before the closing `}` of each schedule object

// Approach: find every `, to: {` block that belongs to a non-real code
// We need to be smarter - find each schedule entry, check code, remove its to

// Simpler: regex replace to: blocks for specific codes
// For lines with identical times (17 items): to: has 17 entries each day
// For lines with 8-10 items (320 etc.): to: has fewer entries
// We match any to: block by the name+times pattern

const TO_PATTERN = /,\s*to:\s*\{\s*name:\s*"[^"]*",\s*times:\s*\{\s*weekday:\s*\[[^\]]*\],\s*saturday:\s*\[[^\]]*\],\s*sunday:\s*\[[^\]]*\],\s*holiday:\s*\[[^\]]*\]\s*\}\s*\}/g;

// But this would remove ALL to blocks, including real ones. We need to guard.
// Instead, process line by line:

// Find each schedule entry - but the whole thing is one long line!
// Look at the file format - each schedule is on its own line.
const lines = src.split('\n');
const outLines = [];

for (let line of lines) {
  // Check if this line has a code we should NOT remove to from
  let isReal = false;
  for (const code of REAL_CODES) {
    if (line.includes(`code: "${code}"`)) {
      isReal = true;
      break;
    }
  }

  if (!isReal && line.includes(', to: {')) {
    // Remove the to: block from this line
    // The to: block spans from ", to: {" to the end before the final "}"
    // Safe to remove: find last ", to:" and everything to the last "}"
    const lastTo = line.lastIndexOf(', to:');
    if (lastTo !== -1) {
      // Remove from ", to:" to end. The line should end with "}" (closing the object)
      // The removed part ends at the last `}` (closing the schedule object)
      // But we need to keep one `}` - the closing of the schedule object
      // to: { name: "...", times: {...} } } 
      // We need to keep the last `}` that closes the schedule, remove the to block
      
      // After removal, the line becomes: { code: ..., ..., from: {...} }
      // Which ends with `}` (from) then we add `}` (schedule)
      // The to block starts with ", to: {" and ends with `} }`
      // After removing it, we need the line to end with `}` not `}}`
      
      // Let me just remove from ", to:" to the second-to-last "}"
      // Actually the to block is: to: { name: "...", times: {...} }
      // Which adds 2 closing braces: one for times, one for to
      // And the line ends with `}` closing the schedule
      // So we have: ... } } } (times, to, schedule)
      // We're removing the to block + its 2 braces, keeping just `}` (schedule)
      
      let before = line.substring(0, lastTo);
      // The to block at full: , to: { name: "...", times: {weekday:[],..., holiday:[]} }
      // After removal, line should be: "    { code: ..., ..., from: {...} }," 
      // The original before the to block has a trailing `}` closing `from`
      // Actually no, the to block comes after from. So before contains the `from: {...} }` (from + closing brace?)
      // Let me trace: { code:..., name:..., ..., from: { name: "...", times: {...} }, to: {...} }
      // The `from` object: { name: "...", times: {...} } — the `}` closes `times`, another `}` closes `from`
      // Then `, to: {...}` follows
      // After removing to: {...}, we need to add `}` to close the schedule
      
      // Let me just look at what's in `before` by its last char
      // Actually I think the pattern is: ...from: {name:"",times:{...}} }
      // Wait, let me look at the actual data format:
      // from: { name: "X", times: { weekday: [...], ... } }, to: { ... }
      // The from: { ... } — the inner `}` closes times, the outer `}` closes from
      // Then comma, then to:
      // So before = "...from: { name: "...", times: {...} }" (without trailing comma of to)
      // After removing to block, we just leave before as-is
      // But the line originally: ...from {...} }, to: {...} },
      // Wait no, the comma after `}` (closing from) is already in the source
      
      // Line format: { code:..., name:..., ..., from: { name: "...", times: {...} }, to: { name: "...", times: {...} } },
      // So before = part up to and including the `from: { name: "...", times: {...} }` 
      // The `from` object ends with `}` then `, to:` follows
      // So before ends with `}` (closing `from`)
      // And after the to block, there's `}` (closing schedule) then `,`
      
      // So: { code:..., from: { name:"...", times:{...} } }, to: { name:"...", times:{...} } },
      // Broken down: 
      //   { code:..., from: { name:"...", times:{...} } }  <- up to before
      //   , to: { name:"...", times:{...} } },              <- removed
      // Keeping before and re-adding " }," for the schedule close and comma
      
      // Actually wait - the `from` already closes itself, so after from we have `}`
      // Then the schedule itself needs a closing `}`
      // So line = { code..., ..., from: { name, times: {..., holiday:[] } } }, to: { name, times: {...} } },
      //               ^--- schedule open         ^--- from close        ^--- to close ---^    ^- comma
      //                                                                    ^--- schedule close ^
      
      // So the `}` after to: block closes the schedule.
      // When we remove to: block, we need to add `}` to close the schedule.
      
      // Let me just use replace on the to: block directly
      // Match: , to: { name: "anything-but-quotes", times: { weekday: [...], saturday: [...], sunday: [...], holiday: [...] } }
      
      // Actually let me use a simpler approach - remove to as a complete chunk
      line = line.replace(/,\s*to:\s*\{\s*name:\s*"[^"]*"\s*,\s*times:\s*\{\s*weekday:\s*\[[^\]]*\]\s*,\s*saturday:\s*\[[^\]]*\]\s*,\s*sunday:\s*\[[^\]]*\]\s*,\s*holiday:\s*\[[^\]]*\]\s*\}\s*\}/, '');
    }
  }
  outLines.push(line);
}

const modified = outLines.join('\n');
fs.writeFileSync('app.js', modified, 'utf8');
console.log('Pronto! to: removido de todas as linhas estimadas.');
