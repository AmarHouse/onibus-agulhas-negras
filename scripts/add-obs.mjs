import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let m = readFileSync(join(root, 'app.js'), 'utf8');

const ids = [
  '105','125','130','135','140','145','150','155','160','165',
  '175','180','215','235','275','280','285','305','306',
  '310','311','312','320','321','330','340','371','372',
  '505','510','IT02','PR01','PR02'
];

const obs = "Hor\u00e1rio de refer\u00eancia (consulte a empresa)";

let count = 0;
for (const id of ids) {
  const re = new RegExp("(code: '" + id + "'[^}]+?\\} \\},)", 'g');
  m = m.replace(re, (match, before) => {
    if (before.includes('info:')) return match;
    count++;
    return before.slice(0, -1) + ", info: '" + obs + "' },";
  });
}

writeFileSync(join(root, 'app.js'), m);
console.log(count + ' linhas atualizadas');
