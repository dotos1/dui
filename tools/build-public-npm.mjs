#!/usr/bin/env node
/**
 * WP2-A —— `@dotos/dui` 公网 npm 发布产物构建与合规自检流水线脚本
 *
 * 功能：
 *   1. 读取 `dist/dui`（由 `ng-packagr` 生成的 APF FESM2022 产物），完整复制到干净目录 `dist/dui-public`；
 *   2. 将 `dist/dui-public/package.json` 重写为公网包元数据：
 *      - `name`: `"@dotos/dui"`
 *      - `version`: 默认 `"8.0.0"`（可通过 `--version <v>` 或 `--version=<v>` 覆盖）
 *      - `license`: `"MIT"`
 *      - 移除内部 `scripts.prebuild` 与私服配置，注入标准公网 `publishConfig`
 *   3. 批量将 `dist/dui-public` 内所有 `.mjs` / `.d.ts` / `package.json` 及随包文档中的 `@dotos1/dui` 重写为 `@dotos/dui`；
 *   4. 执行自动化出厂合规自检：
 *      - 0 处 `@dotos1/` 内部作用域残留；
 *      - 0 处内网 IP / 私服端口残留（`192.168.`、`4873`、`npmmirror`、`npm.pkg.github.com`）；
 *      - `LICENSE`、`README.md`、`THIRD-PARTY-NOTICES.md`、`llms.txt` 齐全且非空；
 *      - 执行 `npm pack --dry-run` 验证 tarball 可打包性并打印体积统计。
 *
 * 用法：
 *   node tools/build-public-npm.mjs [--version 8.0.0]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

/**
 * 解析命令行参数中的目标版本号（默认 8.0.0）。
 */
function parseTargetVersion(argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--version' && argv[i + 1]) {
      return argv[i + 1].trim();
    }
    if (arg.startsWith('--version=')) {
      return arg.slice('--version='.length).trim();
    }
  }
  return '8.0.0';
}

/**
 * 递归遍历目录下所有文件。
 */
function walkAllFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAllFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const TEXT_EXT_RE = /\.(mjs|cjs|js|d\.ts|ts|json|map|scss|sass|css|md|txt)$/i;

function main() {
  const targetVersion = parseTargetVersion(process.argv.slice(2));
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(targetVersion)) {
    console.error(`✗ [build-public-npm] 非法语义化版本号: "${targetVersion}"`);
    process.exit(1);
  }

  const srcDistDir = path.join(REPO_ROOT, 'dist/dui');
  const pubDistDir = path.join(REPO_ROOT, 'dist/dui-public');

  if (!fs.existsSync(path.join(srcDistDir, 'package.json'))) {
    console.error(`✗ [build-public-npm] 未找到 ${srcDistDir}/package.json，请先执行 npm run build-dui`);
    process.exit(1);
  }

  // 1. 清理并复制构建产物至 dist/dui-public
  fs.rmSync(pubDistDir, { recursive: true, force: true });
  fs.cpSync(srcDistDir, pubDistDir, { recursive: true });

  // 确保根目录的 LICENSE / README.md / THIRD-PARTY-NOTICES.md 与 src/llms.txt 最新同步到公网包根目录
  for (const docName of ['LICENSE', 'README.md', 'THIRD-PARTY-NOTICES.md']) {
    const rootDoc = path.join(REPO_ROOT, docName);
    if (fs.existsSync(rootDoc)) {
      fs.copyFileSync(rootDoc, path.join(pubDistDir, docName));
    }
  }
  const srcLlms = path.join(REPO_ROOT, 'src/llms.txt');
  if (fs.existsSync(srcLlms)) {
    fs.copyFileSync(srcLlms, path.join(pubDistDir, 'llms.txt'));
  }

  // 2. 批量将内部作用域 @dotos1/dui 重写为公网作用域 @dotos/dui
  const allFiles = walkAllFiles(pubDistDir);
  let rewrittenFileCount = 0;

  for (const filePath of allFiles) {
    const baseName = path.basename(filePath);
    if (!TEXT_EXT_RE.test(baseName) && baseName !== 'LICENSE') {
      continue;
    }
    const original = fs.readFileSync(filePath, 'utf8');
    let next = original;

    // 清理公网文档与 llms.txt 中的内部私服别名提示，保持公网包零内部作用域泄漏
    if (baseName.endsWith('.md') || baseName === 'llms.txt') {
      next = next
        .replace(/ \(Internal registry alias: `@dotos1\/dui`\)/g, '')
        .replace(/ \(internal scope alias: `@dotos1\/dui`\)/g, '')
        .replace(/（内部作用域别名：`@dotos1\/dui`）/g, '')
        .replace(/ \(internal alias: `@dotos1\/dui[^`]*`\)/g, '');
    }

    next = next.replace(/@dotos1\/dui/g, '@dotos/dui');

    if (next !== original) {
      fs.writeFileSync(filePath, next, 'utf8');
      rewrittenFileCount++;
    }
  }

  // 3. 规范化 dist/dui-public/package.json
  const pubPkgPath = path.join(pubDistDir, 'package.json');
  const pubPkg = JSON.parse(fs.readFileSync(pubPkgPath, 'utf8'));

  pubPkg.name = '@dotos/dui';
  pubPkg.version = targetVersion;
  pubPkg.license = 'MIT';

  if (pubPkg.scripts) {
    delete pubPkg.scripts.prebuild;
    if (Object.keys(pubPkg.scripts).length === 0) {
      delete pubPkg.scripts;
    }
  }

  pubPkg.publishConfig = {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  };

  if (pubPkg.exports && typeof pubPkg.exports === 'object') {
    pubPkg.exports['./llms.txt'] = {
      default: './llms.txt',
    };
  }

  fs.writeFileSync(pubPkgPath, JSON.stringify(pubPkg, null, 2) + '\n', 'utf8');

  // 4. 自动化合规与零残留自检
  const errors = [];
  const requiredDocs = ['LICENSE', 'README.md', 'THIRD-PARTY-NOTICES.md', 'llms.txt'];
  for (const reqFile of requiredDocs) {
    const p = path.join(pubDistDir, reqFile);
    if (!fs.existsSync(p) || fs.statSync(p).size === 0) {
      errors.push(`[缺失必需文件] dist/dui-public/${reqFile} 不存在或为空`);
    }
  }

  const verifyPkg = JSON.parse(fs.readFileSync(pubPkgPath, 'utf8'));
  if (verifyPkg.name !== '@dotos/dui') {
    errors.push(`[package.json] name 必须为 "@dotos/dui"，实为 "${verifyPkg.name}"`);
  }
  if (verifyPkg.license !== 'MIT') {
    errors.push(`[package.json] license 必须为 "MIT"，实为 "${verifyPkg.license}"`);
  }
  if (verifyPkg.scripts?.prebuild) {
    errors.push(`[package.json] 仍残留内部 scripts.prebuild`);
  }
  if (
    verifyPkg.publishConfig?.access !== 'public' ||
    verifyPkg.publishConfig?.registry !== 'https://registry.npmjs.org/'
  ) {
    errors.push(`[package.json] publishConfig 未正确指向公网 registry.npmjs.org`);
  }

  const forbiddenPatterns = [
    { label: '@dotos1/ 内部作用域残留', regex: /@dotos1\// },
    { label: '内网 IP (192.168.*)', regex: /\b192\.168\.\d{1,3}\.\d{1,3}\b/ },
    { label: '私服端口 (4873)', regex: /:4873\b|\b4873\b/ },
    { label: '国内镜像或私服域名残留', regex: /npmmirror|npm\.pkg\.github\.com/ },
  ];

  for (const filePath of walkAllFiles(pubDistDir)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(pubDistDir, filePath);
    for (const rule of forbiddenPatterns) {
      // 注意：sourcemap 的 mappings/hash 若偶然含数字 4873 不误报，仅对非 .map 或端口形式严查
      if (rule.label === '私服端口 (4873)' && filePath.endsWith('.map')) {
        if (/:4873\b/.test(content)) {
          errors.push(`[${rule.label}] ${rel}`);
        }
        continue;
      }
      if (rule.regex.test(content)) {
        errors.push(`[${rule.label}] 命中文件: ${rel}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`✗ [build-public-npm] 公网包自检失败（共 ${errors.length} 项）：`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  // 5. 执行 npm pack --dry-run 验证可打包性并统计体积
  let packJsonRaw = '';
  try {
    packJsonRaw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
      cwd: pubDistDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    console.error('✗ [build-public-npm] npm pack --dry-run 执行失败：', err.stderr || err.message);
    process.exit(1);
  }

  const packInfo = JSON.parse(packJsonRaw)[0];
  const packedMB = (packInfo.size / (1024 * 1024)).toFixed(2);
  const unpackedMB = (packInfo.unpackedSize / (1024 * 1024)).toFixed(2);

  console.log(
    `✓ [build-public-npm] 自检全绿：${packInfo.name}@${packInfo.version} ` +
      `(重写文件=${rewrittenFileCount}, 打包文件数=${packInfo.entryCount}, ` +
      `tarball=${packedMB} MB, unpacked=${unpackedMB} MB, 0 @dotos1/ 残留, 0 内网/私服残留)`
  );
}

main();
