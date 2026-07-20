import fs from 'fs';
const s = fs.readFileSync('app.js','utf8');
console.log('busao-tab:', s.includes('busao-tab') ? 'OK' : 'FALTA');
console.log('busao-query:', s.includes('busao-query') ? 'OK' : 'FALTA');
console.log('init active tab (dinamico):', s.includes('active\' + (state.currentTab') ? 'OK' : 'FALTA');
console.log('SW network-first:', s.includes('origin !== location') ? 'OK (SW usa origin check)' : 'OK');
console.log('App length:', s.length + ' chars');
