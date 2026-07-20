import fs from 'fs';

const s = fs.readFileSync('app.js', 'utf8');

// Extract all schedules
const lines = [];
const re = /\{ code: "([^"]+)", name: "([^"]+)", operator: "([^"]+)", tabs: \[([^\]]+)\]/g;
let m;
while ((m = re.exec(s)) !== null) {
  const code = m[1];
  const name = m[2];
  const op = m[3];
  const tabs = m[4].replace(/"/g, '').split(',').map(t => t.trim());
  
  // Extract from times count
  const fromIdx = s.indexOf('from:', m.index);
  const toIdx = s.indexOf('to:', fromIdx);
  const chunk = s.substring(fromIdx, toIdx > 0 ? toIdx : fromIdx + 200);
  
  const wk = (chunk.match(/weekday: \[([^\]]*)\]/) || [])[1];
  const sa = (chunk.match(/saturday: \[([^\]]*)\]/) || [])[1];
  const su = (chunk.match(/sunday: \[([^\]]*)\]/) || [])[1];
  const ho = (chunk.match(/holiday: \[([^\]]*)\]/) || [])[1];
  
  const wkCount = wk ? wk.split(',').length : 0;
  const saCount = sa ? sa.split(',').length : 0;
  const suCount = su ? su.split(',').length : 0;
  const hoCount = ho ? ho.split(',').length : 0;

  const hasTo = s.substring(toIdx, toIdx + 10).includes('{');
  
  lines.push({ code, name, op, tabs: tabs.join(','), wk: wkCount, sa: saCount, su: suCount, ho: hoCount, to: hasTo ? 'sim' : 'nao' });
}

console.log('=== VERIFICAÇÃO DE LINHAS ===');
console.log(`Total: ${lines.length} linhas\n`);

console.log('CODIGO | NOME | OPERADOR | TABS | wd | sa | su | ho | to');
console.log('-'.repeat(80));
for (const l of lines) {
  console.log(`${l.code.padEnd(10)} ${l.name.padEnd(35)} ${l.op.substring(0,18).padEnd(18)} [${l.tabs.padEnd(25)}] ${String(l.wk).padEnd(3)} ${String(l.sa).padEnd(3)} ${String(l.su).padEnd(3)} ${String(l.ho).padEnd(3)} ${l.to}`);
}

// Check for common issues
console.log('\n=== PONTOS DE ATENÇÃO ===');
lines.forEach(l => {
  if (!l.to || l.to === 'nao') console.log(`  ⚠️ ${l.code}: sem to (sentido de volta)`);
  if (l.wk === 0 && l.sa === 0 && l.su === 0) console.log(`  ⚠️ ${l.code}: sem horarios`);
  if (l.tabs.includes('itatiaia') && l.op.includes('Itatiaia')) {}
});
