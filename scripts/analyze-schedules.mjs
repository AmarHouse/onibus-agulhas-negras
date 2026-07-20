import fs from 'fs';

const src = fs.readFileSync('app.js', 'utf8');

// Extract SCHEDULES block
const m = src.match(/SCHEDULES\s*=\s*\[([\s\S]*?)\n\];/);
if (!m) { console.log('SCHEDULES not found'); process.exit(1); }
const block = m[1];

// Parse each line object
const objRe = /\{([\s\S]*?)\n\s*\}/g;
let objMatch;
const lines = [];
let idx = 0;
while ((objMatch = objRe.exec(block)) !== null) {
  const body = objMatch[1];
  const code = (body.match(/code:\s*"([^"]*)"/) || [])[1] || '?';
  const name = (body.match(/name:\s*"([^"]*)"/) || [])[1] || '?';
  const operator = (body.match(/operator:\s*"([^"]*)"/) || [])[1] || '?';
  const info = (body.match(/info:\s*"([^"]*)"/) || [])[1] || '';
  const tabs = (body.match(/tabs:\s*\[([^\]]*)\]/) || [])[1] || '';
  const fromName = (body.match(/from:\s*\{\s*name:\s*"([^"]*)"/) || [])[1] || '?';
  const toName = (body.match(/to:\s*\{\s*name:\s*"([^"]*)"/) || [])[1] || '?';

  // Count times
  const timesCount = (body.match(/":\s*\[/g) || []).length; // day keys like:
  const allTimes = body.match(/"(\d{2}:\d{2}(?:\s*[GM])?)/g) || [];
  const uniqueTimes = [...new Set(allTimes.map(t => t.replace(/"/g, '')))];

  // Check for day keys
  const dayKeys = [];
  const dayRe = /(?:weekday|saturday|sunday|holiday):\s*\[/g;
  let dm;
  while ((dm = dayRe.exec(body)) !== null) {
    dayKeys.push(dm[0].split(':')[0]);
  }

  lines.push({
    idx: ++idx,
    code,
    name,
    operator,
    tabs: tabs.replace(/"/g, '').split(',').map(s => s.trim()).filter(Boolean),
    fromName,
    toName,
    info,
    dayKeys,
    totalTimes: uniqueTimes.length,
    sampleTimes: uniqueTimes.slice(0, 8)
  });
}

console.log('=== MAPEAMENTO DE LINHAS ===');
console.log('Total:', lines.length, '\n');

for (const l of lines) {
  console.log(`${l.idx}. [${l.code}] ${l.name}`);
  console.log(`   Operador: ${l.operator}`);
  console.log(`   Tabs: [${l.tabs.join(', ')}]`);
  console.log(`   Rota: ${l.fromName} ↔ ${l.toName}`);
  console.log(`   Dias: [${l.dayKeys.join(', ')}]`);
  console.log(`   Total horários únicos: ${l.totalTimes}`);
  console.log(`   Amostra: ${l.sampleTimes.join(', ')}`);
  if (l.info) console.log(`   Info: ${l.info}`);
  console.log();
}

// Cross-city analysis
console.log('=== ANÁLISE INTERMUNICIPAL ===');
const cities = ['resende', 'itatiaia', 'penedo', 'quatis', 'porto-real'];
for (const l of lines) {
  const route = (l.name + ' ' + l.fromName + ' ' + l.toName).toLowerCase();
  const mentionedCities = cities.filter(c => route.includes(c.replace('-', ' ')));
  if (mentionedCities.length > 1) {
    const missingTabs = mentionedCities.filter(c => !l.tabs.includes(c));
    if (missingTabs.length > 0) {
      console.log(`PROBLEMA: [${l.code}] ${l.name}`);
      console.log(`  Cidades na rota: ${mentionedCities.join(', ')}`);
      console.log(`  Tabs atuais: [${l.tabs.join(', ')}]`);
      console.log(`  Tabs faltando: [${missingTabs.join(', ')}]`);
      console.log();
    }
  }
}