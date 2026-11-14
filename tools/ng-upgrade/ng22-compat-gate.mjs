#!/usr/bin/env node
/**
 * Angular 18 -> 22 阶段 0 双兼容门禁（ng22-compat-gate.mjs）
 *
 * 检查项：
 * 1. 禁止非白名单文件引入或使用 Angular 22 已删除符号：
 *    - @angular/core: ComponentFactoryResolver, ComponentFactory, createNgModuleRef, ModuleWithComponentFactories
 *    - @angular/material/core: mixinDisabled, CanDisable, MatCommonModule, MATERIAL_SANITY_CHECKS
 *    - @angular/platform-browser: HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG
 *    - @angular/material/progress-spinner: MatSpinner（应统一为 MatProgressSpinner）
 *    - @angular/cdk/tree: NestedTreeControl
 *    - @angular/platform-browser-dynamic: platformBrowserDynamic
 *    - @angular/common/http/testing: HttpClientTestingModule
 * 2. 强制根 tsconfig.json / tsconfig.base.json 显式声明 "useDefineForClassFields": false
 *    （守护 mobx@5.14.2 的 @observable/@computed/@action 旧版装饰器运行期语义）。
 * 3. 守护 tsconfig.spec.json 未破坏 Jest CommonJS 模块解析。
 */
import fs from 'node:fs';
import path from 'node:path';

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

let allowSet = new Set();
const defaultAllowPath = allowlistFile || path.join(repoDir, 'tools/ng-upgrade/ng22-compat-allowlist.json');
if (fs.existsSync(defaultAllowPath)) {
  const parsed = JSON.parse(fs.readFileSync(defaultAllowPath, 'utf8'));
  for (const entry of parsed.allow || []) {
    allowSet.add(entry.file);
  }
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, '');
}

function walkTsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        if (!IGNORE_DIRS.has(ent.name)) {
          stack.push(path.join(cur, ent.name));
        }
      } else if (ent.isFile() && ent.name.endsWith('.ts') && !ent.name.endsWith('.d.ts')) {
        out.push(path.join(cur, ent.name));
      }
    }
  }
  return out;
}

const BANNED_PATTERNS = [
  { name: 'ComponentFactoryResolver', re: /\bComponentFactoryResolver\b/ },
  { name: 'ComponentFactory (@angular/core)', re: /import\s*\{[^}]*\bComponentFactory\b[^}]*\}\s*from\s*['"]@angular\/core['"]/ },
  { name: 'resolveComponentFactory', re: /\.resolveComponentFactory\s*\(/ },
  { name: 'createNgModuleRef', re: /\bcreateNgModuleRef\b/ },
  { name: 'ModuleWithComponentFactories', re: /\bModuleWithComponentFactories\b/ },
  { name: 'mixinDisabled (@angular/material)', re: /import\s*\{[^}]*\bmixinDisabled\b[^}]*\}\s*from\s*['"]@angular\/material/ },
  { name: 'CanDisable (@angular/material)', re: /import\s*\{[^}]*\bCanDisable\b[^}]*\}\s*from\s*['"]@angular\/material/ },
  { name: 'MatCommonModule', re: /\bMatCommonModule\b/ },
  { name: 'MATERIAL_SANITY_CHECKS', re: /\bMATERIAL_SANITY_CHECKS\b/ },
  { name: 'HammerModule / HammerGestureConfig / HAMMER_GESTURE_CONFIG', re: /\b(?:HammerModule|HammerGestureConfig|HAMMER_GESTURE_CONFIG)\b/ },
  { name: 'MatSpinner (deprecated alias)', re: /\bMatSpinner\b/ },
  { name: 'NestedTreeControl', re: /\bNestedTreeControl\b/ },
  { name: 'platformBrowserDynamic', re: /\bplatformBrowserDynamic\b/ },
  { name: 'HttpClientTestingModule', re: /\bHttpClientTestingModule\b/ },
];

const violations = [];

// 1. Check tsconfig useDefineForClassFields: false
const rootTsconfigs = ['tsconfig.base.json', 'tsconfig.json']
  .map((f) => path.join(repoDir, f))
  .filter((f) => fs.existsSync(f));

if (rootTsconfigs.length === 0) {
  violations.push(`[tsconfig] 未找到根 tsconfig.json 或 tsconfig.base.json`);
} else {
  let foundExplicitFalse = false;
  for (const tf of rootTsconfigs) {
    const raw = stripComments(fs.readFileSync(tf, 'utf8'));
    if (/"useDefineForClassFields"\s*:\s*false/.test(raw)) {
      foundExplicitFalse = true;
    }
    if (/"useDefineForClassFields"\s*:\s*true/.test(raw)) {
      violations.push(`[tsconfig] ${path.relative(repoDir, tf)} 严禁设置 "useDefineForClassFields": true（会破坏 MobX 5 @observable）`);
    }
  }
  if (!foundExplicitFalse) {
    violations.push(
      `[tsconfig] 根配置 (${rootTsconfigs.map((f) => path.basename(f)).join(', ')}) 必须显式声明 "useDefineForClassFields": false`
    );
  }
}

// 2. Check tsconfig.spec.json if Jest is present
const pkgJsonPath = path.join(repoDir, 'package.json');
if (fs.existsSync(pkgJsonPath)) {
  const pkgText = fs.readFileSync(pkgJsonPath, 'utf8');
  if (pkgText.includes('"jest"')) {
    const specConfigs = [];
    const findSpecs = (d, depth = 0) => {
      if (depth > 3 || !fs.existsSync(d)) return;
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        if (ent.isDirectory() && !IGNORE_DIRS.has(ent.name)) {
          findSpecs(path.join(d, ent.name), depth + 1);
        } else if (ent.isFile() && ent.name === 'tsconfig.spec.json') {
          specConfigs.push(path.join(d, ent.name));
        }
      }
    };
    findSpecs(repoDir);
    for (const sc of specConfigs) {
      const raw = stripComments(fs.readFileSync(sc, 'utf8'));
      if (/"moduleResolution"\s*:\s*"bundler"/.test(raw) && !/"module"\s*:\s*"commonjs"/i.test(raw)) {
        violations.push(`[jest-tsconfig] ${path.relative(repoDir, sc)} 在未升级 jest-preset-angular 前不得单独切为 bundler 解析`);
      }
    }
  }
}

// 3. Scan TS source files
const tsFiles = walkTsFiles(repoDir);
for (const file of tsFiles) {
  const rel = path.relative(repoDir, file).replace(/\\/g, '/');
  if (allowSet.has(rel)) continue;
  // Ignore tools/ scripts themselves
  if (rel.startsWith('tools/') || rel.startsWith('projects/testdui/src/app/docs/')) continue;
  const raw = fs.readFileSync(file, 'utf8');
  const stripped = stripComments(raw);
  for (const rule of BANNED_PATTERNS) {
    const m = stripped.match(rule.re);
    if (m) {
      const idx = stripped.indexOf(m[0]);
      const line = stripped.slice(0, idx).split('\n').length;
      violations.push(`${rel}:${line} -> 命中 Angular 22 已删除符号 [${rule.name}]`);
    }
  }
}

if (violations.length > 0) {
  console.error(`✗ ng22-compat-gate 失败（共 ${violations.length} 项违规，仓库：${repoDir}）：`);
  for (const v of violations.slice(0, 60)) {
    console.error(`  - ${v}`);
  }
  if (violations.length > 60) {
    console.error(`  ... 其余 ${violations.length - 60} 项已省略`);
  }
  process.exit(1);
}

console.log(`✓ ng22-compat-gate 通过（扫描 ${tsFiles.length} 个 TS 文件，白名单豁免 ${allowSet.size} 个在途 PR 文件，仓库：${path.basename(repoDir)}）`);
