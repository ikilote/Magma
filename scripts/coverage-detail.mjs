import { readFileSync } from 'fs';

const raw = readFileSync('./coverage/@ikilote/magma/coverage-final.json', 'utf8');
const cov = JSON.parse(raw);

const target = process.argv[2] ?? 'datetime-picker.component.ts';
const key = Object.keys(cov).find(k => k.endsWith(target));

if (!key) {
    console.log('File not found. Available keys containing target:');
    Object.keys(cov)
        .filter(k => k.includes(target.split('.')[0]))
        .forEach(k => console.log(' ', k));
    process.exit(1);
}

console.log('File:', key);
const f = cov[key];

const uncoveredFns = Object.entries(f.fnMap)
    .filter(([id]) => f.f[id] === 0)
    .map(([id, fn]) => `  fn ${id}: ${fn.name} (line ${fn.loc?.start?.line})`);

const uncoveredBranches = Object.entries(f.branchMap)
    .filter(([id]) => f.b[id].some(v => v === 0))
    .map(([id, b]) => `  branch ${id} [${b.type}] line ${b.loc?.start?.line}  counts=[${f.b[id]}]`);

const uncoveredStmts = Object.entries(f.statementMap)
    .filter(([id]) => f.s[id] === 0)
    .map(([id, loc]) => `  stmt ${id}: line ${loc?.start?.line}`);

console.log(`\n=== Uncovered functions (${uncoveredFns.length}) ===`);
uncoveredFns.forEach(l => console.log(l));
console.log(`\n=== Uncovered branches (${uncoveredBranches.length}) ===`);
uncoveredBranches.forEach(l => console.log(l));
console.log(`\n=== Uncovered statements (${uncoveredStmts.length}) ===`);
uncoveredStmts.forEach(l => console.log(l));
