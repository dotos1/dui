#!/usr/bin/env node
/**
 * Angular Material 18 <-> 22 样式引用双兼容门禁（style-ref-gate.mjs）
 *
 * 检查项：
 * 1. 扫描仓库内 .scss / .css / .ts / .html 中引用的所有 `--mdc-*` / `--mat-*` CSS 变量；
 * 2. 若命中在 Angular Material 22 中已移除/改名的 18 变量（依据 ng22-material-baseline.json），
 *    校验同一文件内是否已双写对应的 Angular Material 22 新变量（如 `var(--mat-new, var(--mdc-old))`
 *    或自定义属性新旧双声明），未双写则报错退出；
 * 3. 扫描 .scss / .css 选择器中引用的 Material 22 已移除内部类名（如 `.mdc-icon-button`、
 *    `.mat-mdc-focus-indicator`），校验同一文件对应行/块是否已双写 22 兼容类名。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapMaterial18To22Token, MATERIAL_18_TO_22_CLASSES } from './ng22-token-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'ng22-material-baseline.json'), 'utf8'));
const removedVars = new Set(baseline.removedVars18To22);
const v22Vars = new Set(baseline.v22Vars);
const removedClasses = new Set(baseline.removedClasses18To22);

const args = process.argv.slice(2);
let repoDir = process.cwd();
let allowlistFile = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--repo' && args[i + 1]) {
    repoDir = path.resolve(args[++i]);
  } else if (args[i] === '--allowlist' && args[i + 1]) {
    allowlistFile = path.resolve(args[++i]);
  }
}

let allowSet = new Set();
const defaultAllowPath = allowlistFile || path.join(repoDir, 'tools/ng-upgrade/ng22-compat-allowlist.json');
if (fs.existsSync(defaultAllowPath)) {
  const parsed = JSON.parse(fs.readFileSync(defaultAllowPath, 'utf8'));
  for (const entry of parsed.allow || []) {
    allowSet.add(entry.file);
  }
}

const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.angular',
  '.nx',
  '.claude',
  '.worktrees',
  '.cache',
  'tmp',
  'coverage',
  'gates',
  'ng-upgrade',
]);

function stripCssAndJsComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        if (!IGNORE_DIRS.has(ent.name)) stack.push(path.join(cur, ent.name));
      } else if (ent.isFile() && /\.(scss|css|ts|html)$/.test(ent.name) && !ent.name.endsWith('.d.ts')) {
        out.push(path.join(cur, ent.name));
      }
    }
  }
  return out;
}

const violations = [];
const files = walkFiles(repoDir);

for (const file of files) {
  const rel = path.relative(repoDir, file).replace(/\\/g, '/');
  if (allowSet.has(rel)) continue;
  if (rel.startsWith('tools/') || rel.startsWith('projects/testdui/src/assets/')) continue;
  // dui runtime theme token tables are handled centrally via custom-properties.ts dual-emit
  if (rel.startsWith('src/theme/')) continue;

  const raw = fs.readFileSync(file, 'utf8');
  const stripped = stripCssAndJsComments(raw);
  const lines = stripped.split('\n');

  lines.forEach((line, idx) => {
    for (const m of line.matchAll(/--(?:mat|mdc|cdk)-[a-z0-9-]+/g)) {
      const tok = m[0];
      if (!removedVars.has(tok)) continue;
      const mapped = mapMaterial18To22Token(tok);
      if (!v22Vars.has(mapped) || mapped === tok) continue;
      // Check nearby context (current line +/- 3 lines) for dual-written v22 token
      const windowText = lines.slice(Math.max(0, idx - 3), Math.min(lines.length, idx + 4)).join('\n');
      if (!windowText.includes(mapped)) {
        violations.push(`${rel}:${idx + 1} -> Material 18 变量 [${tok}] 在 22 已移除，需在同一规则块双写 [${mapped}]`);
      }
    }

    if (file.endsWith('.scss') || file.endsWith('.css')) {
      for (const m of line.matchAll(/\.(?:mat|mdc|cdk)-[a-zA-Z0-9_-]+/g)) {
        const cls = m[0].slice(1);
        if (!removedClasses.has(cls)) continue;
        const replacement = MATERIAL_18_TO_22_CLASSES[cls];
        if (!replacement) continue;
        const windowText = lines.slice(Math.max(0, idx - 2), Math.min(lines.length, idx + 3)).join('\n');
        if (!windowText.includes(replacement)) {
          violations.push(`${rel}:${idx + 1} -> Material 18 内部类名 [.${cls}] 在 22 已移除，需双写 [.${replacement}]`);
        }
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`✗ style-ref-gate 失败（共 ${violations.length} 处未双写的 Material 22 失效样式引用，仓库：${repoDir}）：`);
  for (const v of violations.slice(0, 60)) {
    console.error(`  - ${v}`);
  }
  if (violations.length > 60) {
    console.error(`  ... 其余 ${violations.length - 60} 处已省略`);
  }
  process.exit(1);
}

console.log(`✓ style-ref-gate 通过（扫描 ${files.length} 个样式/源码文件，仓库：${path.basename(repoDir)}）`);
