import fs from 'fs';
const s = fs.readFileSync('app.js', 'utf8');

console.log('Total codes:', (s.match(/code:/g) || []).length);
console.log('P135:', s.includes('"P135"') ? 'OK' : 'FALTA!');
console.log('PEN sexta:', s.includes('Sexta tem saída extra') ? 'OK' : 'FALTA!');
console.log('RJO 18:30:', s.includes('18:30') && s.includes('"RJO"') ? 'OK' : 'FALTA!');
console.log('Label Saídas:', s.includes("'Saídas'") ? 'OK' : 'FALTA!');
console.log('getCurrentDayType:', s.includes('getCurrentDayType') ? 'OK' : 'FALTA!');
console.log('FERIADOS_FIXOS:', s.includes('FERIADOS_FIXOS') ? 'OK' : 'FALTA!');
console.log('toMinutes fix:', s.includes('substring(0, 5)') ? 'OK' : 'FALTA!');
console.log('Focus trap:', s.includes('focusable') ? 'OK' : 'FALTA!');
console.log('CSS vars:', s.includes('var(--text-sm)') ? 'OK' : 'FALTA!');
console.log('Tarifa R$:', (s.match(/R\$/g) || []).length, 'ocorrências');

// Check tabs
const codeTests = [
  {code:'IT02', tab:'penedo', label:'IT02 + penedo'},
  {code:'PR02', tab:'resende', label:'PR02 + resende'},
  {code:'RJO', tab:'resende', label:'RJO + resende'},
  {code:'RJO-EXEC', tab:'resende', label:'RJOx + resende'},
  {code:'RNI', tab:'resende', label:'RNI + resende'},
  {code:'EPR', tab:'resende', label:'EPR + resende'},
];
for (const t of codeTests) {
  const idx = s.indexOf(`"${t.code}"`);
  if (idx === -1) { console.log(`${t.label}: code nao encontrado`); continue; }
  const chunk = s.substring(idx, idx + 200);
  const hasTab = chunk.includes(`"${t.tab}"`);
  console.log(`${t.label}: ${hasTab ? 'OK' : 'FALTA!'}`);
}
