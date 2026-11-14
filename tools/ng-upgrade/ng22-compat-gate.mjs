#!/usr/bin/env node
/**
 * Angular 22 + TypeScript 6.0 防回流门禁（ng22-compat-gate.mjs · M2-3 正式版）
 *
 * 检查项：
 * 1. 禁止非白名单文件引入或使用 Angular 22 已删除符号（ComponentFactoryResolver, createNgModuleRef, MatCommonModule 等）。
 * 2. 守护根 tsconfig.json / tsconfig.base.json 显式声明 "useDefineForClassFields": false。
 * 3. Angular >= 21：严禁保留 jss / jss-plugin-* 依赖或代码导入（no-jss 门禁）。
 * 4. Angular >= 22（M2-3 新增）：
 *    - 严禁 tsconfig*.json 残留临时过渡开关 "ignoreDeprecations"（TS 6.0 零弃用警告门禁，支持 --allow-ignore-deprecations 仅用于 M2-1 第一步验证）；
 *    - 严禁调用 DuiBase / Dui.registerComponentFactory 双参旧重载签名；
 *    - 守护 ::ng-deep 防新增棘轮门禁（读取 tools/ng-upgrade/ng-deep-baseline.json 的 maxCount）；
 *    - 若当前仓库为底座包 dui（@dotos/dui），严禁保留 mobx / mobx-utils / observable-profiler 依赖或源码导入（M2.5-1 零 MobX 门禁）。
 * 5. 守护前端库仓库（含 ng-package.json）的 tsconfig.lib*.json 显式开启 "compilationMode": "partial"。
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let repoDir = process.cwd();
let allowlistFile = '';
let allowIgnoreDeprecations = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--repo' && args[i + 1]) {
    repoDir = path.resolve(args[++i]);
  } else if (args[i] === '--allowlist' && args[i + 1]) {
    allowlistFile = path.resolve(args[++i]);
  } else if (args[i] === '--allow-ignore-deprecations') {
    allowIgnoreDeprecations = true;
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
      `[tsconfig] 根配置 (${rootTsconfigs.map((f) => path.basename(f)).join(', ')}) 必须显式声明 "useDefineForClassFields": false`,
    );
  }
}

// 2. Version-aware gates (Angular 21+ no-jss; Angular 22+ TS 6.0 zero-deprecations, single-arg registerComponentFactory, dui no-mobx)
let isNg21Plus = false;
let isNg22Plus = false;
let isDuiRepo = false;
const pkgJsonPath = path.join(repoDir, 'package.json');
if (fs.existsSync(pkgJsonPath)) {
  const pkgObj = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  isDuiRepo = pkgObj.name === 'dui' || pkgObj.name === '@dotos/dui' || pkgObj.name === '@dotos1/dui';
  const allDeps = { ...(pkgObj.dependencies || {}), ...(pkgObj.devDependencies || {}), ...(pkgObj.peerDependencies || {}) };
  const ngCoreVer = String(allDeps['@angular/core'] || '');
  const ngMajorMatch = ngCoreVer.match(/(\d+)/);
  if (ngMajorMatch) {
    const major = Number(ngMajorMatch[1]);
    isNg21Plus = major >= 21;
    isNg22Plus = major >= 22;
  }
  if (isNg21Plus) {
    const pkgManifests = walkFiles(repoDir, (name) => name === 'package.json', 4);
    for (const pm of pkgManifests) {
      const mObj = JSON.parse(fs.readFileSync(pm, 'utf8'));
      for (const sec of ['dependencies', 'devDependencies', 'peerDependencies']) {
        for (const depName of Object.keys(mObj[sec] || {})) {
          if (depName === 'jss' || depName.startsWith('jss-plugin-') || depName === '@types/jss') {
            violations.push(`[no-jss] ${path.relative(repoDir, pm)} (${sec}) 严禁保留 JSS 依赖 "${depName}"`);
          }
          if (isNg22Plus && isDuiRepo && (depName === 'mobx' || depName === 'mobx-utils' || depName === 'observable-profiler')) {
            violations.push(`[dui-no-mobx] ${path.relative(repoDir, pm)} (${sec}) 严禁保留 MobX 依赖 "${depName}"`);
          }
        }
      }
    }
  }
}

if (isNg21Plus) {
  BANNED_PATTERNS.push({
    name: 'jss / jss-plugin-* (Angular 21+ 严禁引入 JSS)',
    re: /from\s*['"](?:jss|jss-plugin-[^'"]+)['"]|require\s*\(\s*['"](?:jss|jss-plugin-[^'"]+)['"]\s*\)/,
  });
}

if (isNg22Plus) {
  BANNED_PATTERNS.push({
    name: 'registerComponentFactory 双参旧重载（M2-3 已清理，仅允许单参 [components]）',
    re: /\bregisterComponentFactory\s*\(\s*(?!\[|this\.(?:entryComponents|dynamicComponents)\s*\))[^,\n)]+,/,
  });
  if (isDuiRepo) {
    BANNED_PATTERNS.push({
      name: 'mobx (@dotos/dui M2.5-1 已彻底清退 MobX)',
      re: /from\s*['"](?:mobx|mobx-utils)['"]/,
    });
  }
  if (!allowIgnoreDeprecations) {
    const allTsConfigs = walkFiles(repoDir, (name) => /^tsconfig.*\.json$/.test(name), 5);
    for (const tc of allTsConfigs) {
      const raw = stripComments(fs.readFileSync(tc, 'utf8'));
      if (/"ignoreDeprecations"/.test(raw)) {
        violations.push(`[ts6-no-deprecations] ${path.relative(repoDir, tc)} 严禁保留临时过渡项 "ignoreDeprecations"`);
      }
      if (/"baseUrl"\s*:/.test(raw)) {
        violations.push(`[ts6-no-deprecations] ${path.relative(repoDir, tc)} 严禁保留 TS 6.0 已弃用的 "baseUrl"`);
      }
      if (/"downlevelIteration"\s*:/.test(raw)) {
        violations.push(`[ts6-no-deprecations] ${path.relative(repoDir, tc)} 严禁保留 TS 6.0 已弃用的 "downlevelIteration"`);
      }
      if (/"moduleResolution"\s*:\s*"node(?:10)?"/i.test(raw)) {
        violations.push(`[ts6-no-deprecations] ${path.relative(repoDir, tc)} 严禁保留 TS 6.0 已弃用的 "moduleResolution": "node"`);
      }
    }
  }
}

// 3. Check ::ng-deep ratchet baseline (M2-3)
const ngDeepBaselinePath = path.join(repoDir, 'tools/ng-upgrade/ng-deep-baseline.json');
if (fs.existsSync(ngDeepBaselinePath)) {
  const baselineObj = JSON.parse(fs.readFileSync(ngDeepBaselinePath, 'utf8'));
  const maxCount = typeof baselineObj.maxCount === 'number' ? baselineObj.maxCount : Infinity;
  const styleAndTsFiles = walkFiles(repoDir, (name) => /\.(scss|css|ts)$/.test(name) && !name.endsWith('.d.ts'));
  let actualNgDeep = 0;
  for (const sf of styleAndTsFiles) {
    const rel = path.relative(repoDir, sf).replace(/\\/g, '/');
    if (rel.startsWith('tools/') || rel.startsWith('packages/mcp/') || rel.includes('/examples/')) continue;
    const stripped = stripComments(fs.readFileSync(sf, 'utf8'));
    const matches = stripped.match(/::ng-deep\b/g);
    if (matches) actualNgDeep += matches.length;
  }
  if (actualNgDeep > maxCount) {
    violations.push(
      `[no-new-ng-deep] 当前仓库 ::ng-deep 数量 (${actualNgDeep}) 超出棘轮基线 (${maxCount})，严禁新增 ::ng-deep！`,
    );
  }
}

// 4. Check Ivy compilationMode: "partial" on library repos
const ngPkgFiles = walkFiles(repoDir, (name) => name === 'ng-package.json', 4);
if (ngPkgFiles.length > 0) {
  const libTsConfigs = walkFiles(
    repoDir,
    (name) => name === 'tsconfig.lib.json' || name === 'tsconfig.lib.prod.json',
    4,
  );
  for (const ltc of libTsConfigs) {
    const relLtc = path.relative(repoDir, ltc).replace(/\\/g, '/');
    if (relLtc.startsWith('packages/mcp/')) continue;
    const raw = stripComments(fs.readFileSync(ltc, 'utf8'));
    if (/"compilationMode"\s*:\s*"full"/.test(raw)) {
      violations.push(`[ivy-partial] ${relLtc} 严禁设置 "compilationMode": "full"`);
    }
    const hasHere = /"compilationMode"\s*:\s*"partial"/.test(raw);
    let hasInBase = false;
    if (!hasHere && path.basename(ltc) === 'tsconfig.lib.prod.json') {
      const siblingLib = path.join(path.dirname(ltc), 'tsconfig.lib.json');
      if (fs.existsSync(siblingLib)) {
        hasInBase = /"compilationMode"\s*:\s*"partial"/.test(stripComments(fs.readFileSync(siblingLib, 'utf8')));
      }
    }
    if (!hasHere && !hasInBase) {
      violations.push(`[ivy-partial] ${relLtc} 必须显式启用 "compilationMode": "partial"`);
    }
  }
}

// 5. Scan TS source files
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
  `[ng22-compat-gate] PASS (${path.basename(repoDir)}: 已扫描 ${tsFiles.length} 个 TS 文件，Ng22=${isNg22Plus}，白名单豁免 ${allowSet.size} 个)`,
);
