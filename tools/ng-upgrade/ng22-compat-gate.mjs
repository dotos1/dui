#!/usr/bin/env node
/**
 * Angular 18 -> 22 双兼容门禁（ng22-compat-gate.mjs · M0.5 增强版）
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
 * 3. 守护 tsconfig.spec.json 未破坏 Jest 29 CommonJS 模块解析。
 * 4. 守护前端库仓库（含 ng-package.json）的 tsconfig.lib.json / tsconfig.lib.prod.json
 *    显式开启 `"compilationMode": "partial"`（禁止注释掉或退回 full Ivy）。
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
  'out-tsc',
  'build',
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
  let out = '';
  let quote = null;
  let esc = false;
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];
    if (quote) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
      out += c;
    } else if (c === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      if (i < code.length) out += '\n';
    } else if (c === '/' && next === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
        if (code[i] === '\n') out += '\n';
        i++;
      }
      i++;
    } else {
      out += c;
    }
  }
  return out;
}

function walkFiles(dir, predicate, maxDepth = 99, depth = 0) {
  const out = [];
  if (depth > maxDepth || !fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (!IGNORE_DIRS.has(ent.name)) {
        out.push(...walkFiles(path.join(dir, ent.name), predicate, maxDepth, depth + 1));
      }
    } else if (ent.isFile() && predicate(ent.name, path.join(dir, ent.name))) {
      out.push(path.join(dir, ent.name));
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

// 2. Check tsconfig.spec.json if Jest 29 is present
const pkgJsonPath = path.join(repoDir, 'package.json');
if (fs.existsSync(pkgJsonPath)) {
  const pkgObj = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const allDeps = { ...(pkgObj.dependencies || {}), ...(pkgObj.devDependencies || {}) };
  const jestVer = String(allDeps.jest || '');
  const isJest29 = jestVer.includes('29');
  if (isJest29) {
    const specConfigs = walkFiles(repoDir, (name) => name === 'tsconfig.spec.json', 3);
    for (const sc of specConfigs) {
      const raw = stripComments(fs.readFileSync(sc, 'utf8'));
      if (/"moduleResolution"\s*:\s*"bundler"/.test(raw) && !/"module"\s*:\s*"commonjs"/i.test(raw)) {
        violations.push(`[jest-tsconfig] ${path.relative(repoDir, sc)} 在 Jest 29 下不得单独切为非 CommonJS bundler 解析`);
      }
    }
  }
}

// 3. Check Ivy compilationMode: "partial" on library repos
const ngPkgFiles = walkFiles(repoDir, (name) => name === 'ng-package.json', 4);
if (ngPkgFiles.length > 0) {
  const libTsConfigs = walkFiles(
    repoDir,
    (name) => name === 'tsconfig.lib.json' || name === 'tsconfig.lib.prod.json',
    4
  );
  for (const ltc of libTsConfigs) {
    const raw = stripComments(fs.readFileSync(ltc, 'utf8'));
    if (/"compilationMode"\s*:\s*"full"/.test(raw)) {
      violations.push(`[ivy-partial] ${path.relative(repoDir, ltc)} 严禁设置 "compilationMode": "full"`);
    }
    if (path.basename(ltc) === 'tsconfig.lib.json' || path.basename(ltc) === 'tsconfig.lib.prod.json') {
      // Check either this file or its extended tsconfig.lib.json has explicit "compilationMode": "partial"
      const hasHere = /"compilationMode"\s*:\s*"partial"/.test(raw);
      let hasInBase = false;
      if (!hasHere && path.basename(ltc) === 'tsconfig.lib.prod.json') {
        const siblingLib = path.join(path.dirname(ltc), 'tsconfig.lib.json');
        if (fs.existsSync(siblingLib)) {
          hasInBase = /"compilationMode"\s*:\s*"partial"/.test(stripComments(fs.readFileSync(siblingLib, 'utf8')));
        }
      }
      if (!hasHere && !hasInBase) {
        violations.push(`[ivy-partial] ${path.relative(repoDir, ltc)} 必须显式启用 "compilationMode": "partial"`);
      }
    }
  }
}

// 4. Scan TS source files
const tsFiles = walkFiles(repoDir, (name) => name.endsWith('.ts') && !name.endsWith('.d.ts'));
for (const file of tsFiles) {
  const rel = path.relative(repoDir, file).replace(/\\/g, '/');
  if (allowSet.has(rel)) continue;
  if (rel.startsWith('tools/') || rel.startsWith('projects/testdui/src/app/docs/')) continue;
  const raw = fs.readFileSync(file, 'utf8');
  const stripped = stripComments(raw);
  for (const rule of BANNED_PATTERNS) {
    const m = stripped.match(rule.re);
    if (m) {
      const idx = stripped.indexOf(m[0]);
      const line = stripped.slice(0, idx).split('\n').length;
      violations.push(`${rel}:${line} -> 禁止使用 ${rule.name}`);
    }
  }
}

if (violations.length > 0) {
  console.error(`\n[ng22-compat-gate] FAIL (${violations.length} 处违规):`);
  for (const v of violations.slice(0, 80)) {
    console.error(`  - ${v}`);
  }
  if (violations.length > 80) {
    console.error(`  ... 其余 ${violations.length - 80} 处略`);
  }
  process.exit(1);
}

console.log(
  `[ng22-compat-gate] PASS (${path.basename(repoDir)}: 已扫描 ${tsFiles.length} 个 TS 文件，白名单豁免 ${allowSet.size} 个)`
);
