import fs from 'fs';
const s = fs.readFileSync('app.js','utf8');
const sw = fs.readFileSync('sw.js','utf8');

let ok = 0, fail = 0;
function check(name, cond) { if(cond){ok++;console.log('  OK',name)}else{fail++;console.log('  FAIL',name)} }

check('Estado offline salvo', s.includes('busao-tab'));
check('Query salva', s.includes('busao-query'));
check('SW network-first', sw.includes('fetch(e.request)'));
check('SW offline fallback', sw.includes('index.html'));
check('SW app.js nao pre-cached (network-first)', !sw.includes('/app.js'));
check('Tab click salva', s.includes("localStorage.setItem('busao-tab'"));
check('Query input salva', s.includes("localStorage.setItem('busao-query'"));
check('Query restore', s.includes("localStorage.getItem('busao-query'"));

console.log(`\n${ok}/${ok+fail} checks passing`);
