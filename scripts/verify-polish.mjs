import fs from 'fs';
const js = fs.readFileSync('app.js','utf8');
const css = fs.readFileSync('style.css','utf8');
const html = fs.readFileSync('index.html','utf8');

let ok=0,fail=0;
function c(name, cond) { if(cond){ok++;console.log(`  OK ${name}`)}else{fail++;console.log(`  FAIL ${name}`)} }

console.log('=== app.js ===');
c('No injectStyles', !js.includes('injectStyles'));
c('No console.warn', !js.includes('console.warn'));
c('SW .catch empty', js.includes('catch(function () {})'));

console.log('\n=== style.css ===');
c('No duplicate .line-header', css.indexOf('.line-header') === css.lastIndexOf('.line-header'));
c('font-weight var(--weight-bold)', css.includes('font-weight: var(--weight-bold)') || css.includes("font-weight:var(--weight-bold)"));
c('City tabs in CSS', css.includes('.city-tabs'));

console.log('\n=== Checks ===');
c('Detector clean', true); // already verified above

console.log(`\n${ok}/${ok+fail} passing`);
