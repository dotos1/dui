#!/usr/bin/env node
/**
 * Angular Material 22 样式门禁（style-ref-gate.mjs · M2-3 正式收口版）
 *
 * 检查项：
 * - Angular < 22：保持双兼容检查（命中 18 移除变量需双写 22 变量）；
 * - Angular >= 22（M2-3 正式收口）：
 *   1. 严禁残留 Material 18 已移除的 `--mdc-*` / `--mat-app-*` 旧变量（含阶段 0 双写兜底分支）；
 *   2. 严禁在样式选择器中直接覆盖 `.mdc-*` 内部私有类名（守护 M3 组件封装边界）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapMaterial18To22Token, MATERIAL_18_TO_22_CLASSES } from './ng22-token-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'ng22-material-baseline.json'), 'utf8'));
const removedVars = new Set([
  ...baseline.removedVars18To22,
  '--mdc-theme-primary',
  '--mdc-theme-error',
  '--mdc-dialog-container-elevation-shadow',
  '--mdc-checkbox-state-layer-size',
]);
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

let isNg22Plus = false;
const pkgPath = path.join(repoDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}), ...(pkg.peerDependencies || {}) };
  const m = String(allDeps['@angular/core'] || '').match(/(\d+)/);
  if (m && Number(m[1]) >= 22) isNg22Plus = true;
}

let mdcClassMaxCount = 0;
const mdcBaselinePath = path.join(repoDir, 'tools/ng-upgrade/mdc-class-baseline.json');
if (fs.existsSync(mdcBaselinePath)) {
  const parsedMdc = JSON.parse(fs.readFileSync(mdcBaselinePath, 'utf8'));
  if (typeof parsedMdc.maxCount === 'number') mdcClassMaxCount = parsedMdc.maxCount;
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
let mdcClassHits = 0;
const mdcClassSamples = [];

for (const file of files) {
  const rel = path.relative(repoDir, file).replace(/\\/g, '/');
  if (allowSet.has(rel)) continue;
  if (rel.startsWith('tools/') || rel.startsWith('projects/testdui/src/assets/')) continue;
  if (rel.startsWith('src/theme/')) continue;

  const raw = fs.readFileSync(file, 'utf8');
  const stripped = stripCssAndJsComments(raw);
  const lines = stripped.split('\n');

  lines.forEach((line, idx) => {
    for (const m of line.matchAll(/--(?:mat|mdc|cdk)-[a-z0-9-]+/g)) {
      const tok = m[0];
      if (!removedVars.has(tok) || tok === '--mat-app-' || tok === '--mat-mdc-') continue;
      const mapped = mapMaterial18To22Token(tok);
      if (isNg22Plus) {
        if (tok.startsWith('--mdc-') || (v22Vars.has(mapped) && mapped !== tok)) {
          violations.push(`${rel}:${idx + 1} -> M2-3 严禁残留已废弃 Material 18 变量 [${tok}]（请清理为纯 v22 令牌 [${mapped}]）`);
        }
      } else {
        if (!v22Vars.has(mapped) || mapped === tok) continue;
        const windowText = lines.slice(Math.max(0, idx - 3), Math.min(lines.length, idx + 4)).join('\n');
        if (!windowText.includes(mapped)) {
          violations.push(`${rel}:${idx + 1} -> Material 18 变量 [${tok}] 在 22 已移除，需在同一规则块双写 [${mapped}]`);
        }
      }
    }

    if (file.endsWith('.scss') || file.endsWith('.css')) {
      for (const m of line.matchAll(/\.(?:mat|mdc|cdk)-[a-zA-Z0-9_-]+/g)) {
        const cls = m[0].slice(1);
        if (isNg22Plus && cls.startsWith('mdc-')) {
          if (removedClasses.has(cls)) {
            violations.push(`${rel}:${idx + 1} -> M2-3 严禁使用 Material 22 已移除的内部类选择器 [.${cls}]`);
          } else {
            mdcClassHits++;
            if (mdcClassSamples.length < 15) mdcClassSamples.push(`${rel}:${idx + 1} (.${cls})`);
          }
        } else if (removedClasses.has(cls)) {
          const replacement = MATERIAL_18_TO_22_CLASSES[cls];
          if (!replacement) continue;
          const windowText = lines.slice(Math.max(0, idx - 2), Math.min(lines.length, idx + 3)).join('\n');
          if (!windowText.includes(replacement)) {
            violations.push(`${rel}:${idx + 1} -> Material 18 内部类名 [.${cls}] 在 22 已移除，需双写 [.${replacement}]`);
          }
        }
      }
    }
  });
}

if (isNg22Plus && mdcClassHits > mdcClassMaxCount) {
  violations.push(
    `[no-mdc-class] 检测到 ${mdcClassHits} 处直接 .mdc-* 内部类覆盖，超出基线上限 (${mdcClassMaxCount})：${mdcClassSamples.join('; ')}`,
  );
}

if (violations.length > 0) {
  console.error(`✗ style-ref-gate 失败（共 ${violations.length} 处违规，Ng22=${isNg22Plus}，仓库：${repoDir}）：`);
  for (const v of violations.slice(0, 60)) {
    console.error(`  - ${v}`);
  }
  if (violations.length > 60) {
    console.error(`  ... 其余 ${violations.length - 60} 处已省略`);
  }
  process.exit(1);
}

console.log(`✓ style-ref-gate 通过（扫描 ${files.length} 个样式/源码文件，Ng22=${isNg22Plus}，仓库：${path.basename(repoDir)}）`);
