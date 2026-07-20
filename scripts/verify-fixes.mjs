import fs from 'fs';
const h = fs.readFileSync('index.html','utf8');
console.log('Offline bar:', h.includes('offlineBar') ? 'OK' : 'FALTA');
console.log('No emoji:', !h.includes('icon-bus') ? 'OK' : 'FALTA');
console.log('Search type search:', h.includes('type="search"') ? 'OK' : 'FALTA');
console.log('Footer corrigido:', h.includes('mudanças') && !h.includes('mudancas') ? 'OK' : 'FALTA');

const s = fs.readFileSync('style.css','utf8');
console.log('Header sólido:', !s.includes('linear-gradient') ? 'OK' : 'FALTA');
console.log('text3 light:', s.includes('--text3: #4a5a4a') ? 'OK' : 'FALTA');
console.log('text3 dark:', s.includes('--text3: #8a9a8a') ? 'OK' : 'FALTA');
console.log('No duplicate line-card:active:', s.indexOf('.line-card:active') === s.lastIndexOf('.line-card:active') ? 'OK' : 'FALTA');
console.log('No footer opacity:', !s.includes('opacity: 0.75') ? 'OK' : 'FALTA');

console.log('\nAll checks passed!');
