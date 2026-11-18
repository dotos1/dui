#!/usr/bin/env node
/**
 * Angular Material 22 样式引用与死变量门禁（style-ref-gate.mjs · W6 实读集合校验版）
 *
 * 检查项（Angular >= 22）：
 * 1. 严禁任何 `--mdc-*` CSS 自定义属性声明或 `var(--mdc-*)` 引用；
 * 2. 校验全仓（含 `src/theme/`、`src/theming/`、组件 `.scss`/`.css`/`.ts`）所有 `--mat-*` / `--cdk-*`
 *    变量声明与 `var(--mat-*)` 引用必须存在于 `@angular/material@22`、`@angular/cdk@22` 或 `dui`
 *    组件实际读取的 CSS 变量集合中（严禁写入无组件读取的死变量）；
 * 3. 严禁使用 Material 22 已移除的内部类名，并棘轮守护 `.mdc-*` 类选择器上限（`mdc-class-baseline.json`）；
 * 4. 棘轮守护 `::ng-deep` 出现次数上限（`ng-deep-baseline.json`）；
 * 5. 支持 `--selftest` 注入死变量必红自测与 `--write-snapshot` 更新实读变量快照。
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'ng22-material-baseline.json'), 'utf8'));
const removedClasses = new Set(baseline.removedClasses18To22 || []);
const SNAPSHOT_PATH = path.join(__dirname, 'ng22-component-vars-snapshot.json');

const args = process.argv.slice(2);
let repoDir = process.cwd();
let allowlistFile = '';
let runSelfTest = false;
let writeSnapshot = false;
let extraProbeFile = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--repo' && args[i + 1]) {
    repoDir = path.resolve(args[++i]);
  } else if (args[i] === '--allowlist' && args[i + 1]) {
    allowlistFile = path.resolve(args[++i]);
  } else if (args[i] === '--selftest') {
    runSelfTest = true;
  } else if (args[i] === '--write-snapshot') {
    writeSnapshot = true;
  } else if (args[i] === '--probe-file' && args[i + 1]) {
    extraProbeFile = path.resolve(args[++i]);
  }
}

function walkDirFiles(dir, exts, ignoreDirs = new Set()) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        if (!ignoreDirs.has(ent.name)) stack.push(path.join(cur, ent.name));
      } else if (ent.isFile() && exts.some((ext) => ent.name.endsWith(ext))) {
        out.push(path.join(cur, ent.name));
      }
    }
  }
  return out;
}

/**
 * Extracts all `var(--mat-*)` / `var(--cdk-*)` actually read by `@angular/material`, `@angular/cdk`,
 * and `@angular/material/core` system definitions (or loads snapshot when `node_modules` is absent).
 */
function buildLiveReadVarSet(rootDir) {
  const liveVars = new Set();
  const sysVars = new Set();
  const nmMat = path.join(rootDir, 'node_modules/@angular/material');
  const nmCdk = path.join(rootDir, 'node_modules/@angular/cdk');

  if (fs.existsSync(nmMat)) {
    for (const file of [
      ...walkDirFiles(path.join(nmMat, 'fesm2022'), ['.mjs', '.js', '.css']),
      ...walkDirFiles(path.join(nmCdk, 'fesm2022'), ['.mjs', '.js', '.css']),
    ]) {
      const txt = fs.readFileSync(file, 'utf8');
      for (const m of txt.matchAll(/var\(\s*(--(?:mat|cdk)-[a-z0-9-]+)/g)) {
        liveVars.add(m[1]);
      }
    }

    for (const file of walkDirFiles(path.join(nmMat, 'core'), ['.scss'])) {
      const txt = fs.readFileSync(file, 'utf8');
      for (const m of txt.matchAll(/var\(\s*(--(?:mat|cdk)-[a-z0-9-]+)/g)) {
        liveVars.add(m[1]);
      }
      for (const m of txt.matchAll(/token-utils\.slot\(\s*([a-z0-9-]+)/g)) {
        liveVars.add(`--mat-${m[1]}`);
      }
      for (const m of txt.matchAll(/(--mat-sys-[a-z0-9-]+)/g)) {
        sysVars.add(m[1]);
      }
    }

    // Also include all --mat-sys-* keys declared in M2/M3 system definitions
    const sysScss = path.join(nmMat, 'core/tokens/m2/_md-sys-color.scss');
    const sysTypeScss = path.join(nmMat, 'core/tokens/m2/_md-sys-typescale.scss');
    for (const f of [sysScss, sysTypeScss]) {
      if (fs.existsSync(f)) {
        const txt = fs.readFileSync(f, 'utf8');
        for (const m of txt.matchAll(/^\s*['"]?([a-z0-9-]+)['"]?\s*:/gm)) {
          sysVars.add(`--mat-sys-${m[1]}`);
        }
      }
    }
    for (const extraSys of [
      '--mat-sys-level0',
      '--mat-sys-level1',
      '--mat-sys-level2',
      '--mat-sys-level3',
      '--mat-sys-level4',
      '--mat-sys-level5',
      '--mat-sys-corner-extra-large',
      '--mat-sys-corner-extra-large-top',
      '--mat-sys-corner-extra-small',
      '--mat-sys-corner-extra-small-top',
      '--mat-sys-corner-full',
      '--mat-sys-corner-large',
      '--mat-sys-corner-large-end',
      '--mat-sys-corner-large-start',
      '--mat-sys-corner-large-top',
      '--mat-sys-corner-medium',
      '--mat-sys-corner-none',
      '--mat-sys-corner-small',
      '--mat-sys-dragged-state-layer-opacity',
      '--mat-sys-focus-state-layer-opacity',
      '--mat-sys-hover-state-layer-opacity',
      '--mat-sys-pressed-state-layer-opacity',
    ]) {
      sysVars.add(extraSys);
    }
    for (const role of [
      'display-large',
      'display-medium',
      'display-small',
      'headline-large',
      'headline-medium',
      'headline-small',
      'title-large',
      'title-medium',
      'title-small',
      'body-large',
      'body-medium',
      'body-small',
      'label-large',
      'label-medium',
      'label-small',
    ]) {
      for (const prop of ['font', 'line-height', 'size', 'tracking', 'weight']) {
        sysVars.add(`--mat-sys-${role}-${prop}`);
      }
    }
    sysVars.add('--mat-sys-label-large-weight-prominent');
    for (let z = 0; z <= 24; z++) {
      liveVars.add(`--mat-app-elevation-shadow-level-${z}`);
    }

    if (writeSnapshot) {
      fs.writeFileSync(
        SNAPSHOT_PATH,
        JSON.stringify(
          {
            materialVersion: '22.2.7',
            liveComponentReadVars: [...liveVars].sort(),
            systemVars: [...sysVars].sort(),
          },
          null,
          2
        ) + '\n',
        'utf8'
      );
    }
  } else if (fs.existsSync(SNAPSHOT_PATH)) {
    const snap = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    for (const v of snap.liveComponentReadVars || []) liveVars.add(v);
    for (const v of snap.systemVars || []) sysVars.add(v);
  }

  return { liveVars, sysVars };
}

if (runSelfTest) {
  const probes = [
    {
      name: '死变量声明 (--mat-nonexistent-dead-token-w6: 12px)',
      css: `.selftest-a {\n  --mat-nonexistent-dead-token-w6: 12px;\n}\n`,
      expected: '--mat-nonexistent-dead-token-w6',
    },
    {
      name: '死变量读取 (var(--mat-also-dead-token-w6))',
      css: `.selftest-b {\n  color: var(--mat-also-dead-token-w6);\n}\n`,
      expected: '--mat-also-dead-token-w6',
    },
    {
      name: '已移除 MDC 变量 (--mdc-legacy-dead-token-w6)',
      css: `.selftest-c {\n  --mdc-legacy-dead-token-w6: #000;\n}\n`,
      expected: '--mdc-legacy-dead-token-w6',
    },
    {
      name: 'M2 模式下禁用 M3 系统令牌 (var(--mat-sys-primary))',
      css: `.selftest-d {\n  color: var(--mat-sys-primary, #3f51b5);\n}\n`,
      expected: '--mat-sys-primary',
    },
  ];

  const tmpProbe = path.join(os.tmpdir(), `dui-style-ref-selftest-${process.pid}.scss`);
  try {
    for (const p of probes) {
      fs.writeFileSync(tmpProbe, p.css, 'utf8');
      let failedAsExpected = false;
      let errOut = '';
      try {
        execFileSync(process.execPath, [__filename, '--repo', repoDir, '--probe-file', tmpProbe], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (err) {
        failedAsExpected = true;
        errOut = String(err.stderr || err.stdout || err.message);
      }
      if (!failedAsExpected || !errOut.includes(p.expected)) {
        console.error(`✗ [selftest] 探针「${p.name}」未按预期判红：\n${errOut}`);
        process.exit(1);
      }
      console.log(`✓ [selftest] 探针「${p.name}」成功拦截 (exit 1)`);
    }

    const normalOut = execFileSync(process.execPath, [__filename, '--repo', repoDir], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(normalOut.trim());
    process.exit(0);
  } finally {
    if (fs.existsSync(tmpProbe)) fs.unlinkSync(tmpProbe);
  }
}

const { liveVars, sysVars } = buildLiveReadVarSet(repoDir);

let mdcClassMaxCount = 0;
const mdcBaselinePath = path.join(repoDir, 'tools/ng-upgrade/mdc-class-baseline.json');
if (fs.existsSync(mdcBaselinePath)) {
  const parsedMdc = JSON.parse(fs.readFileSync(mdcBaselinePath, 'utf8'));
  if (typeof parsedMdc.maxCount === 'number') mdcClassMaxCount = parsedMdc.maxCount;
}

let ngDeepMaxCount = 0;
const ngDeepBaselinePath = path.join(repoDir, 'tools/ng-upgrade/ng-deep-baseline.json');
if (fs.existsSync(ngDeepBaselinePath)) {
  const parsedDeep = JSON.parse(fs.readFileSync(ngDeepBaselinePath, 'utf8'));
  if (typeof parsedDeep.maxCount === 'number') ngDeepMaxCount = parsedDeep.maxCount;
}

const allowSet = new Set();
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
  'tools',
]);

function stripComments(code, isTs) {
  let res = code.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  if (isTs || true) {
    res = res.replace(/(^|[^:])\/\/.*$/gm, '$1');
  }
  return res;
}

const files = walkDirFiles(repoDir, ['.scss', '.css', '.ts', '.html'], IGNORE_DIRS).filter(
  (f) => !f.endsWith('.d.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.test.ts')
);
if (extraProbeFile && fs.existsSync(extraProbeFile)) {
  files.push(extraProbeFile);
}

const violations = [];
let mdcClassHits = 0;
const mdcClassSamples = [];
let ngDeepHits = 0;
const ngDeepSamples = [];

for (const file of files) {
  const rel = file.startsWith(repoDir)
    ? path.relative(repoDir, file).replace(/\\/g, '/')
    : path.basename(file);
  if (allowSet.has(rel)) continue;
  if (rel.startsWith('projects/testdui/src/assets/')) continue;

  const raw = fs.readFileSync(file, 'utf8');
  const stripped = stripComments(raw, file.endsWith('.ts'));
  const lines = stripped.split('\n');
  const isStyleFile = file.endsWith('.scss') || file.endsWith('.css');
  const isThemeOrStyleFile = isStyleFile || rel.startsWith('src/theme/') || file.endsWith('.ts');

  lines.forEach((line, idx) => {
    if (isThemeOrStyleFile) {
      // Match real CSS custom property declarations (`--mat-foo:` / `"--mat-foo":`) or `var(--mat-foo)` references,
      // avoiding BEM class modifiers like `.item--mat-foo`.
      const varTokens = new Set();
      for (const m of line.matchAll(/var\(\s*(--(?:mat|mdc|cdk)-[a-z0-9-]+)/g)) {
        varTokens.add(m[1]);
      }
      for (const m of line.matchAll(/(?:^|[\s{;'"`(,])(--(?:mat|mdc|cdk)-[a-z0-9-]+)\s*['"`]?\s*:/g)) {
        varTokens.add(m[1]);
      }

      for (const tok of varTokens) {
        if (tok.startsWith('--mdc-')) {
          violations.push(`${rel}:${idx + 1} -> 严禁使用已移除的 MDC 变量 [${tok}]`);
          continue;
        }
        if (tok.startsWith('--mat-sys-')) {
          violations.push(
            `${rel}:${idx + 1} -> 严禁在 M2 主题模式下声明或引用 M3 系统令牌 [${tok}]（M2 动态主题不定义该变量，请改用 Material 22 M2 实读组件令牌或 --dui-primary-color / --dui-warn-color）`
          );
          continue;
        }
        if (!liveVars.has(tok)) {
          violations.push(
            `${rel}:${idx + 1} -> 死 CSS 变量 [${tok}]：Angular Material/CDK 22 组件均未读取该变量`
          );
        }
      }
    }

    if (isStyleFile) {
      for (const m of line.matchAll(/\.(?:mat|mdc|cdk)-[a-zA-Z0-9_-]+/g)) {
        const cls = m[0].slice(1);
        if (cls.startsWith('mdc-')) {
          if (removedClasses.has(cls)) {
            violations.push(`${rel}:${idx + 1} -> 严禁使用 Material 22 已移除的内部类选择器 [.${cls}]`);
          } else if (rel !== 'src/theming/_m2-system.scss') {
            mdcClassHits++;
            if (mdcClassSamples.length < 15) mdcClassSamples.push(`${rel}:${idx + 1} (.${cls})`);
          }
        } else if (removedClasses.has(cls)) {
          violations.push(`${rel}:${idx + 1} -> 严禁使用 Material 22 已移除的类名 [.${cls}]`);
        }
      }
    }

    if (isStyleFile || file.endsWith('.ts')) {
      const deepMatches = line.match(/::ng-deep\b/g);
      if (deepMatches) {
        ngDeepHits += deepMatches.length;
        if (ngDeepSamples.length < 15) ngDeepSamples.push(`${rel}:${idx + 1}`);
      }
    }
  });
}

if (mdcClassHits > mdcClassMaxCount) {
  violations.push(
    `[no-mdc-class] 检测到 ${mdcClassHits} 处 .mdc-* 内部类覆盖，超出基线上限 (${mdcClassMaxCount})：${mdcClassSamples.join('; ')}`
  );
}

if (ngDeepHits > ngDeepMaxCount) {
  violations.push(
    `[no-ng-deep] 检测到 ${ngDeepHits} 处 ::ng-deep，超出基线上限 (${ngDeepMaxCount})：${ngDeepSamples.join('; ')}`
  );
}

if (violations.length > 0) {
  console.error(`✗ style-ref-gate 失败（共 ${violations.length} 处违规，liveVars=${liveVars.size}，仓库：${repoDir}）：`);
  for (const v of violations.slice(0, 60)) {
    console.error(`  - ${v}`);
  }
  if (violations.length > 60) {
    console.error(`  ... 其余 ${violations.length - 60} 处已省略`);
  }
  process.exit(1);
}

console.log(
  `✓ style-ref-gate 通过（扫描 ${files.length} 个文件，实读变量池=${liveVars.size}，.mdc-*=${mdcClassHits}/${mdcClassMaxCount}，::ng-deep=${ngDeepHits}/${ngDeepMaxCount}，仓库：${path.basename(repoDir)}）`
);
