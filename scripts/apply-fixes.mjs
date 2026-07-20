import fs from 'fs';

// 1. Load fresh app.js from fix-app.mjs
let app = fs.readFileSync('app.js', 'utf8');

// 2. Replace SCHEDULES with corrected data
const newSchedules = fs.readFileSync('scripts/schedules-data.txt', 'utf8');
const oldSchedulesMatch = app.match(/const SCHEDULES = \[[\s\S]*?\n  \];/);
if (oldSchedulesMatch) {
  app = app.replace(oldSchedulesMatch[0], newSchedules);
} else {
  console.log('Could not find SCHEDULES in app.js');
}

// 3. Apply JS improvements

// Replace getCurrentDay with getCurrentDayType + FERIADOS_FIXOS
app = app.replace(
  `  function getCurrentDay() {`,
  `  function getCurrentDay() {`
);
// The original fix-app.mjs has a simpler getCurrentDay
// I need to add getCurrentDayType and FERIADOS_FIXOS

// Add FERIADOS_FIXOS after BUS_STOPS
app = app.replace(
  '  const state = {',
  `  var FERIADOS_FIXOS = {
    '01-01': true, '21-04': true, '01-05': true, '07-09': true,
    '12-10': true, '02-11': true, '15-11': true, '20-11': true,
    '25-12': true
  };

  function getCurrentDayType() {
    var tipo = getCurrentDay();
    var hoje = new Date();
    var chave = ('0' + (hoje.getDate()+1)).slice(-2) + '-' + ('0' + (hoje.getMonth()+1)).slice(-2);
    var mes = hoje.getMonth() + 1;
    var dia = hoje.getDate();
    if (FERIADOS_FIXOS[chave]) return 'holiday';
    if (mes === 2 && dia >= 12 && dia <= 18) return 'holiday';
    if (mes === 4 && dia >= 17 && dia <= 21) return 'holiday';
    return tipo;
  }

  const state = {`
);

// Fix toMinutes to strip G/M suffixes
app = app.replace(
  '    var parts = t.split(\':\');',
  '    var clean = t.substring(0, 5);\n    var parts = clean.split(\':\');'
);

// state.currentDay should use getCurrentDayType
app = app.replace(
  "    currentDay: getCurrentDay(),",
  "    currentDay: getCurrentDayType(),"
);

// Fix "Chegadas" -> "Saídas"
app = app.replace(
  "renderDirection(s.to, 'Chegadas')",
  "renderDirection(s.to, 'Saídas')"
);

// Add modal focus trap (after initModal)
app = app.replace(
  `  function initModal() {
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }`,
  `  function initModal() {
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        var modal = document.getElementById('detailModal');
        if (!modal.classList.contains('hidden')) {
          var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable.length === 0) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    });
  }`
);

// Update injectStyles to use CSS variables
app = app.replace(
  `.city-tabs{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px}.city-tabs::-webkit-scrollbar{display:none}.city-btn{flex-shrink:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:.82rem;font-weight:500;color:var(--text2);cursor:pointer;transition:all .2s;white-space:nowrap}.city-btn:hover{border-color:var(--primary);color:var(--primary)}.city-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}.operator-badge{font-size:.65rem;color:var(--text2);background:var(--surface2);padding:3px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;font-weight:500}`,
  `.city-tabs{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px}.city-tabs::-webkit-scrollbar{display:none}.city-btn{flex-shrink:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 16px;font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text2);cursor:pointer;transition:all .2s;white-space:nowrap}.city-btn:hover{border-color:var(--primary);color:var(--primary)}.city-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}.operator-badge{font-size:var(--text-caption);color:var(--text2);background:var(--surface2);padding:3px 8px;border-radius:4px;flex-shrink:0;white-space:nowrap;font-weight:var(--weight-medium)}`
);

// Update font-size references in HTML strings to use CSS variables
// Find .78rem -> var(--text-caption), .72rem -> var(--text-caption), .82rem -> var(--text-sm), .85rem -> var(--text-sm)
app = app.replace(/font-size:\.78rem/g, 'font-size:var(--text-caption)');
app = app.replace(/font-size:\.72rem/g, 'font-size:var(--text-caption)');
app = app.replace(/font-size:\.82rem/g, 'font-size:var(--text-sm)');
app = app.replace(/font-size:\.85rem/g, 'font-size:var(--text-sm)');
app = app.replace(/font-weight:500/g, 'font-weight:var(--weight-medium)');
app = app.replace(/font-weight:600/g, 'font-weight:var(--weight-semibold)');

// Save
fs.writeFileSync('app.js', app, 'utf8');
console.log('app.js updated with all improvements!');
