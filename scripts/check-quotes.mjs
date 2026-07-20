import fs from 'fs';
const s = fs.readFileSync('app.js', 'utf8');
let idx = s.indexOf('"<');
let count = 0;
while (idx >= 0) {
  const start = Math.max(0, idx - 30);
  const end = Math.min(s.length, idx + 60);
  console.log(`#${++count} at ${idx}:`, JSON.stringify(s.substring(start, end)));
  idx = s.indexOf('"<', idx + 1);
}
if (count === 0) console.log('No broken "< patterns found');
