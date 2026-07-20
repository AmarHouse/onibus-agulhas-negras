import fs from 'fs';
const s = fs.readFileSync('app.js', 'utf8');
console.log('Total code:', (s.match(/code:/g) || []).length);
console.log('P135 presente:', s.includes('"P135"'));
console.log('Disclaimer no rodapé (index.html):', fs.readFileSync('index.html','utf8').includes('pontualidade'));
console.log('Tarifa R$ no app.js:', (s.match(/R\$/g) || []).length, 'ocorrências');

// Valida tabs intermunicipais
const lines = s.split('\n');
for (const l of lines) {
  if (/\{ code: "(IT02|PR02|RJO|RJO-EXEC|RNI|EPR|P135)"/.test(l)) {
    const code = l.match(/code: "([^"]+)"/)[1];
    const tabs = (l.match(/tabs: \[([^\]]+)\]/) || [])[1] || '';
    console.log(`  ${code} -> [${tabs}]`);
  }
}