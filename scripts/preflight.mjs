import fs from 'fs';

const files = ['index.html', 'app.js', 'style.css', 'sw.js', 'manifest.json'];
let errors = [];

for (const f of files) {
  if (!fs.existsSync(f)) { errors.push(`${f}: arquivo não encontrado`); continue; }
  const s = fs.readFileSync(f, 'utf8');
  
  if (f === 'app.js') {
    if (s.includes('console.log') || s.includes('console.warn')) errors.push('app.js: console.log/warn presente');
    if (s.includes('debugger')) errors.push('app.js: debugger presente');
  }

  if (f === 'index.html') {
    if (s.includes('pedroluz.github.io')) errors.push('index.html: URL antiga do pix ainda presente');
    if (!s.includes('pix-br.pages.dev')) errors.push('index.html: nova URL do pix ausente');
    if (!s.includes('Pedro Luz')) errors.push('index.html: crédito Pedro Luz ausente');
    if (!s.includes('abrirPix')) errors.push('index.html: função abrirPix ausente');
    if (s.includes('icon-bus')) errors.push('index.html: classe icon-bus residual');
  }

  if (f === 'style.css') {
    if (s.includes('linear-gradient')) errors.push('style.css: linear-gradient ainda presente no header');
    if (s.includes('opacity: 0.75')) errors.push('style.css: opacity 0.75 residual no footer');
    if (!s.includes('.pix-cta')) errors.push('style.css: .pix-cta ausente');
  }
}

// Check for stale test files
const stale = ['test.js'];
for (const f of stale) {
  if (fs.existsSync(f)) errors.push(`${f}: arquivo teste residual — remover antes de subir`);
}

// Verify .gitignore exists
if (!fs.existsSync('.gitignore')) errors.push('.gitignore: ausente');

// Check scripts are not committed (they should probably be in .gitignore)
const scriptsDir = './scripts';
if (fs.existsSync(scriptsDir)) {
  const scripts = fs.readdirSync(scriptsDir);
  if (scripts.length > 0) errors.push(`scripts/: ${scripts.length} arquivos — lembrar de .gitignore`);
}

if (errors.length === 0) {
  console.log('✅ Tudo pronto para subir!');
} else {
  console.log('⚠️  Problemas encontrados:');
  for (const e of errors) console.log('  -', e);
}
