import fs from 'fs';
const s = fs.readFileSync('app.js','utf8');
const h = fs.readFileSync('index.html','utf8');
const sw = fs.readFileSync('sw.js','utf8');

let ok = 0, fail = 0;
function check(name, cond) { if (cond) { ok++; console.log(`  OK ${name}`); } else { fail++; console.log(`  FAIL ${name}`); } }

console.log('=== app.js ===');
check('lastCardCode', s.includes('var lastCardCode'));
check('closeModal refocus', s.includes('lastCardCode.replace'));
check('card tabindex', s.includes('tabindex="0"'));
check('card role', s.includes('role="button"'));
check('keyboard Enter/Space', s.includes("e.key === 'Enter'"));
check('modalTitle id', s.includes('id="modalTitle"'));
check('initOffline', s.includes('initOffline'));
check('search event', s.includes("addEventListener('search'"));

console.log('\n=== index.html ===');
check('aria-modal', h.includes('aria-modal="true"'));
check('role dialog', h.includes('role="dialog"'));
check('offlineBar', h.includes('offlineBar'));
check('search type', h.includes('type="search"'));

console.log('\n=== sw.js ===');
check('icons cached', sw.includes('icon-192.png'));
check('index.html fallback', sw.includes('index.html'));

console.log(`\n${ok}/${ok+fail} checks passing`);
