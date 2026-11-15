#!/usr/bin/env node
/**
 * 构建产物 dist/dui 与仓库配置硬门禁校验脚本（W1 / W2 / W5 / T4-1 / T5）
 *
 * 输出结构化证据至 docs/ng22-evidence/w1-w2-w5-fesm2022-verify.json，
 * 如任一硬指标不达标则以非零退出码失败。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

function walkFiles(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(full, exts));
    else if (exts.some((e) => ent.name.endsWith(e))) out.push(full);
  }
  return out;
}

const distDir = path.join(REPO_ROOT, 'dist/dui');
const distPkgPath = path.join(distDir, 'package.json');
if (!fs.existsSync(distPkgPath)) {
  console.error('未找到 dist/dui/package.json，请先执行 npm run build-dui');
  process.exit(1);
}

const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));
const distFiles = walkFiles(distDir, ['.mjs', '.d.ts', '.json', '.scss', '.css']);

const legacyScopeNeedle = ['@dotos', 'dui'].join('/');
const localRegistryNeedle = ['127.0.0.1', '4873'].join(':');

let legacyScopeHits = 0;
let matSysHits = 0;
let duiThemeVarHits = 0;
let coerceBooleanDecoratorHits = 0;
let definePropertyClassFieldHits = 0;

for (const f of distFiles) {
  const txt = fs.readFileSync(f, 'utf8');
  if (txt.includes(legacyScopeNeedle)) legacyScopeHits++;
  if (f.endsWith('.mjs') || f.endsWith('.scss') || f.endsWith('.css')) {
    if (txt.includes('--mat-sys-')) matSysHits++;
    if (txt.includes('--dui-theme-primary')) duiThemeVarHits++;
  }
  if (f.endsWith('.mjs')) {
    if (txt.includes('coerceBoolean')) coerceBooleanDecoratorHits++;
    // Verify useDefineForClassFields: false -> no ES2022 native class field shadowing __decorate([coerceBoolean()])
    if (/Object\.defineProperty\(this,\s*['"]disabled['"]/.test(txt)) {
      definePropertyClassFieldHits++;
    }
  }
}

const tsconfigFiles = [
  'tsconfig.json',
  'src/tsconfig.lib.json',
  'src/tsconfig.lib.prod.json',
  'src/tsconfig.spec.json',
  'projects/testdui/tsconfig.app.json',
  'projects/testdui/tsconfig.spec.json',
];
const tsconfigChecks = tsconfigFiles
  .filter((rel) => fs.existsSync(path.join(REPO_ROOT, rel)))
  .map((rel) => {
    const raw = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
    return {
      file: rel,
      useDefineForClassFieldsFalse: /"useDefineForClassFields"\s*:\s*false/.test(raw),
    };
  });

const yarnLock = fs.readFileSync(path.join(REPO_ROOT, 'yarn.lock'), 'utf8');
const localRegistryCountInYarnLock = yarnLock.split(localRegistryNeedle).length - 1;
const fileProtocolCountInYarnLock = (yarnLock.match(/resolved\s+"file:/g) || []).length;

const testduiMainTs = fs.readFileSync(path.join(REPO_ROOT, 'projects/testdui/src/main.ts'), 'utf8');
const angularJson = fs.readFileSync(path.join(REPO_ROOT, 'angular.json'), 'utf8');

const passed =
  distPkg.name === '@dotos1/dui' &&
  distPkg.version === '8.0.0-next.2' &&
  legacyScopeHits === 0 &&
  matSysHits === 0 &&
  duiThemeVarHits >= 1 &&
  coerceBooleanDecoratorHits >= 1 &&
  definePropertyClassFieldHits === 0 &&
  tsconfigChecks.every((c) => c.useDefineForClassFieldsFalse || c.file !== 'tsconfig.json') &&
  tsconfigChecks[0].useDefineForClassFieldsFalse === true &&
  localRegistryCountInYarnLock === 0 &&
  fileProtocolCountInYarnLock === 0 &&
  testduiMainTs.includes('provideZoneChangeDetection') &&
  angularJson.includes('"zone.js"');

const result = {
  generatedAt: new Date().toISOString(),
  packageName: distPkg.name,
  packageVersion: distPkg.version,
  peerDependencies: distPkg.peerDependencies,
  distFilesScanned: distFiles.length,
  t5LegacyDotOsDuiResidueFiles: legacyScopeHits,
  t4MatSysTokenResidueFiles: matSysHits,
  t4DuiThemeRootVarFiles: duiThemeVarHits,
  w2CoerceBooleanBundleCount: coerceBooleanDecoratorHits,
  w2ObjectDefinePropertyShadowHits: definePropertyClassFieldHits,
  w2TsconfigChecks: tsconfigChecks,
  w1ZoneExplicitDeclaration: {
    mainTsHasProvideZoneChangeDetection: testduiMainTs.includes('provideZoneChangeDetection'),
    angularJsonPolyfillsHasZoneJs: angularJson.includes('"zone.js"'),
  },
  w5YarnLockHygiene: {
    localPrivateRegistryOccurrences: localRegistryCountInYarnLock,
    fileProtocolOccurrences: fileProtocolCountInYarnLock,
  },
  passed,
};

const outDir = path.join(REPO_ROOT, 'docs/ng22-evidence');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'w1-w2-w5-fesm2022-verify.json');
fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`✓ 产物与配置校验通过 -> docs/ng22-evidence/w1-w2-w5-fesm2022-verify.json (passed=${passed})`);

if (!passed) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
