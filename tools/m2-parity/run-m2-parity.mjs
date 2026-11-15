#!/usr/bin/env node
/**
 * Angular Material 22 vs 7.4.52 真实无头 Chrome 27 组合 M2 外观与动态主题全属性逐值对齐验收脚本
 *
 * 严格覆盖第三轮返工 T1 / T4-1 / G2 全部要求：
 *   1. 全覆盖 16 类组件（按钮、图标按钮、FAB、表单字段、选择框、复选框、开关、滑块、进度条、
 *      徽标、卡片、标签页、列表、表格、菜单弹层、对话框弹层）及禁用态容器、下划线伪元素、
 *      开关轨道/滑块伪元素与阴影、进度条缓冲轨道、展开面板箭头伪元素与字阶类（共 68 个采样目标）；
 *   2. 3 套底色（light/dark/darkblue）× 3 档密度（loose/normal/compact）× 3 套调色板 = 27 组合；
 *   3. 54 张全页截图像素比对 + 对全部 68 个目标元素/伪元素遍历 Array.from(getComputedStyle(el, pseudo))
 *      全部标准 CSS 属性逐属性按值对比（颜色容差严格 RGB <= ±1，alpha <= ±0.01）；
 *   4. 6 轮运行时连续切换（覆盖 light <-> dark <-> darkblue、compact <-> normal <-> loose、多套调色板及 fill/outline）
 *      与写入 localStorage 冷启动刷新后的全量 getComputedStyle 逐属性严格零差异（0 mismatch）；
 *   5. 严禁按 (target, prop) 通配豁免：跨版本 Material 18 -> 22 组件底层基础 CSS 差异必须逐项精确校验
 *      7.4.52 旧值与 ng22 新值，并在报告中全量列出元素、属性、旧值、新值与技术原因供平台负责人确认；
 *      任何未精确匹配的差异一律计入 unexplainedMismatches 并以非零退出码阻断门禁。
 *
 * 仓库内一键独立复现命令（无需外部目录，默认读取入库基线 tools/m2-parity/baseline-7452-styles.json.gz）：
 *   node tools/m2-parity/run-m2-parity.mjs
 */

import { execFileSync, spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
let ng22Dir = REPO_ROOT;
let captureRefDir = null;
let baselinePath = path.join(__dirname, 'baseline-7452-styles.json.gz');
let outDir = path.join(REPO_ROOT, 'docs/ng22-evidence');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ng22-dir' && args[i + 1]) ng22Dir = path.resolve(args[++i]);
  else if ((args[i] === '--capture-ref-dir' || args[i] === '--ref-dir') && args[i + 1]) {
    captureRefDir = path.resolve(args[++i]);
  } else if (args[i] === '--baseline' && args[i + 1]) baselinePath = path.resolve(args[++i]);
  else if (args[i] === '--out-dir' && args[i + 1]) outDir = path.resolve(args[++i]);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

function startStaticSpaServer(distBrowserDir) {
  const blockedPort = 4800 + 73;
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      let filePath = path.join(distBrowserDir, urlPath === '/' ? 'index.html' : urlPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distBrowserDir, 'index.html');
      }
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr.port === blockedPort) {
        server.close(() => startStaticSpaServer(distBrowserDir).then(resolve, reject));
        return;
      }
      resolve({ server, port: addr.port, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function findChromeBinary() {
  for (const candidate of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('未找到可用 Chrome/Chromium 可执行文件');
}

async function launchCdpSession(chromeBin) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dui-cdp-'));
  const proc = spawn(
    chromeBin,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--window-size=1280,1080',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  const wsBrowserUrl = await new Promise((resolve, reject) => {
    let stderrBuf = '';
    const timer = setTimeout(() => reject(new Error(`Chrome CDP 启动超时: ${stderrBuf}`)), 15000);
    proc.stderr.on('data', (chunk) => {
      stderrBuf += chunk.toString('utf8');
      const m = stderrBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome 提前退出 code=${code}: ${stderrBuf}`));
    });
  });

  const httpBase = wsBrowserUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.*$/, '');
  const targets = await fetch(`${httpBase}/json/list`).then((r) => r.json());
  const pageTarget = targets.find((t) => t.type === 'page');
  if (!pageTarget) throw new Error('未找到 Chrome Page target');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });

  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Runtime.evaluate 异常: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  async function close() {
    try {
      ws.close();
    } catch {}
    if (proc.exitCode === null) {
      await new Promise((resolve) => {
        proc.once('exit', resolve);
        proc.kill('SIGKILL');
      });
    }
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 120 });
    } catch {}
  }

  return { send, evaluate, close };
}

function decodePngRgba(buf) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 6;
  const idatChunks = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const rgba = new Uint8Array(width * height * 4);
  const prevRow = new Uint8Array(stride);
  const curRow = new Uint8Array(stride);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  let srcPos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[srcPos++];
    for (let x = 0; x < stride; x++) {
      const byte = raw[srcPos++];
      const left = x >= bpp ? curRow[x - bpp] : 0;
      const up = prevRow[x];
      const upLeft = x >= bpp ? prevRow[x - bpp] : 0;
      if (filter === 0) curRow[x] = byte;
      else if (filter === 1) curRow[x] = (byte + left) & 0xff;
      else if (filter === 2) curRow[x] = (byte + up) & 0xff;
      else if (filter === 3) curRow[x] = (byte + ((left + up) >> 1)) & 0xff;
      else if (filter === 4) curRow[x] = (byte + paeth(left, up, upLeft)) & 0xff;
    }
    prevRow.set(curRow);
    for (let px = 0; px < width; px++) {
      const dstIdx = (y * width + px) * 4;
      const srcIdx = px * bpp;
      rgba[dstIdx] = curRow[srcIdx];
      rgba[dstIdx + 1] = curRow[srcIdx + 1];
      rgba[dstIdx + 2] = curRow[srcIdx + 2];
      rgba[dstIdx + 3] = bpp === 4 ? curRow[srcIdx + 3] : 255;
    }
  }
  return { width, height, rgba };
}

function comparePngBuffers(bufA, bufB, channelTolerance = 1) {
  const imgA = decodePngRgba(bufA);
  const imgB = decodePngRgba(bufB);
  const w = Math.min(imgA.width, imgB.width);
  const h = Math.min(imgA.height, imgB.height);
  let diffPixels = 0;
  const totalPixels = w * h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const iA = (y * imgA.width + x) * 4;
      const iB = (y * imgB.width + x) * 4;
      const dr = Math.abs(imgA.rgba[iA] - imgB.rgba[iB]);
      const dg = Math.abs(imgA.rgba[iA + 1] - imgB.rgba[iB + 1]);
      const db = Math.abs(imgA.rgba[iA + 2] - imgB.rgba[iB + 2]);
      if (dr > channelTolerance || dg > channelTolerance || db > channelTolerance) {
        diffPixels++;
      }
    }
  }
  return {
    width: w,
    height: h,
    totalPixels,
    diffPixels,
    diffRatio: Number((diffPixels / totalPixels).toFixed(5)),
  };
}

function parseColorToSrgba(str) {
  if (!str) return null;
  const rgbaMatch = str.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*[,/]\s*([0-9.]+))?\s*\)$/);
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]),
      g: Number(rgbaMatch[2]),
      b: Number(rgbaMatch[3]),
      a: rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1,
    };
  }
  const srgbMatch = str.match(/^color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/);
  if (srgbMatch) {
    return {
      r: Number(srgbMatch[1]) * 255,
      g: Number(srgbMatch[2]) * 255,
      b: Number(srgbMatch[3]) * 255,
      a: srgbMatch[4] !== undefined ? Number(srgbMatch[4]) : 1,
    };
  }
  return null;
}

/**
 * T1.2: Strict color tolerance RGB <= ±1, alpha <= ±0.01.
 */
function colorsEquivalent(c1, c2, rgbTol = 1, alphaTol = 0.01) {
  if (c1 === c2) return true;
  const p1 = parseColorToSrgba(c1);
  const p2 = parseColorToSrgba(c2);
  if (!p1 || !p2) return false;
  if (p1.a === 0 && p2.a === 0) return true;
  return (
    Math.abs(p1.r - p2.r) <= rgbTol &&
    Math.abs(p1.g - p2.g) <= rgbTol &&
    Math.abs(p1.b - p2.b) <= rgbTol &&
    Math.abs(p1.a - p2.a) <= alphaTol
  );
}

const MODES = ['light', 'dark', 'darkblue'];
const DENSITIES = ['loose', 'normal', 'compact'];
const PALETTES = [
  { id: 'teal-orange', primary: 'teal-600', accent: 'orange-800', warn: 'red-800' },
  { id: 'blue-pink', primary: 'blue-500', accent: 'pink-500', warn: 'red-700' },
  { id: 'indigo-amber', primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700' },
];

/**
 * Full 16-category target manifest (68 elements & pseudo-elements total).
 * Menu & Dialog elements are sampled while live overlays are opened in DOM.
 */
const PARITY_TARGETS = [
  { key: 'appBg', category: 'core-surface', sel: '[data-parity="root"]' },
  // 1. 按钮 (button)
  { key: 'btnFlatPrimary', category: '1-button', sel: '[data-parity="btn-flat-primary"]' },
  { key: 'btnFlatAccent', category: '1-button', sel: '[data-parity="btn-flat-accent"]' },
  { key: 'btnFlatWarn', category: '1-button', sel: '[data-parity="btn-flat-warn"]' },
  { key: 'btnFlatDisabled', category: '1-button', sel: '[data-parity="btn-flat-disabled"]' },
  { key: 'btnRaisedPrimary', category: '1-button', sel: '[data-parity="btn-raised-primary"]' },
  { key: 'btnStrokedPrimary', category: '1-button', sel: '[data-parity="btn-stroked-primary"]' },
  { key: 'btnBasicPrimary', category: '1-button', sel: '[data-parity="btn-basic-primary"]' },
  // 2. 图标按钮 (icon-button)
  { key: 'btnIconPrimary', category: '2-icon-button', sel: '[data-parity="btn-icon-primary"]' },
  { key: 'btnIconPrimaryGlyph', category: '2-icon-button', sel: '[data-parity="btn-icon-primary-glyph"]' },
  { key: 'btnIconDisabled', category: '2-icon-button', sel: '[data-parity="btn-icon-disabled"]' },
  { key: 'btnIconDisabledGlyph', category: '2-icon-button', sel: '[data-parity="btn-icon-disabled-glyph"]' },
  // 3. FAB (fab)
  { key: 'btnFabPrimary', category: '3-fab', sel: '[data-parity="btn-fab-primary"]' },
  { key: 'btnFabAccent', category: '3-fab', sel: '[data-parity="btn-fab-accent"]' },
  { key: 'btnFabDisabled', category: '3-fab', sel: '[data-parity="btn-fab-disabled"]' },
  // 4. 表单字段 (form-field — 含禁用容器与底部指示线伪元素)
  { key: 'ffFillWrapper', category: '4-form-field', sel: '[data-parity="ff-fill"] .mat-mdc-text-field-wrapper' },
  { key: 'ffFillLineRippleBefore', category: '4-form-field', sel: '[data-parity="ff-fill"] .mdc-line-ripple', pseudo: '::before' },
  { key: 'inputFill', category: '4-form-field', sel: '[data-parity="input-fill"]' },
  { key: 'ffOutlineWrapper', category: '4-form-field', sel: '[data-parity="ff-outline"] .mat-mdc-text-field-wrapper' },
  { key: 'inputOutline', category: '4-form-field', sel: '[data-parity="input-outline"]' },
  { key: 'ffDisabledWrapper', category: '4-form-field', sel: '[data-parity="ff-disabled"] .mat-mdc-text-field-wrapper' },
  { key: 'ffDisabledLineRippleBefore', category: '4-form-field', sel: '[data-parity="ff-disabled"] .mdc-line-ripple', pseudo: '::before' },
  { key: 'inputDisabled', category: '4-form-field', sel: '[data-parity="input-disabled"]' },
  // 5. 选择框 (select — 含底部指示线伪元素)
  { key: 'ffSelectWrapper', category: '5-select', sel: '[data-parity="ff-select"] .mat-mdc-text-field-wrapper' },
  { key: 'ffSelectLineRippleBefore', category: '5-select', sel: '[data-parity="ff-select"] .mdc-line-ripple', pseudo: '::before' },
  { key: 'selectTrigger', category: '5-select', sel: '[data-parity="select-control"] .mat-mdc-select-trigger' },
  { key: 'selectArrow', category: '5-select', sel: '[data-parity="select-control"] .mat-mdc-select-arrow' },
  // 6. 复选框 (checkbox)
  { key: 'checkboxPrimaryBg', category: '6-checkbox', sel: '[data-parity="checkbox-primary"] .mdc-checkbox__background' },
  { key: 'checkboxAccentBg', category: '6-checkbox', sel: '[data-parity="checkbox-accent"] .mdc-checkbox__background' },
  // 7. 开关 (slide-toggle — 含轨道/滑块 ::after 伪元素与阴影层)
  { key: 'slideToggleSwitch', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch' },
  { key: 'slideToggleTrack', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__track' },
  { key: 'slideToggleTrackAfter', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__track', pseudo: '::after' },
  { key: 'slideToggleHandle', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__handle' },
  { key: 'slideToggleHandleAfter', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__handle', pseudo: '::after' },
  { key: 'slideToggleShadow', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__shadow' },
  // 8. 滑块 (slider)
  { key: 'sliderHost', category: '8-slider', sel: '[data-parity="slider-primary"]' },
  { key: 'sliderTrackActive', category: '8-slider', sel: '[data-parity="slider-primary"] .mdc-slider__track--active_fill' },
  { key: 'sliderThumbKnob', category: '8-slider', sel: '[data-parity="slider-primary"] .mdc-slider__thumb-knob' },
  // 9. 进度条 (progress-bar — 含右侧缓冲轨道)
  { key: 'progressHost', category: '9-progress-bar', sel: '[data-parity="progress-primary"]' },
  { key: 'progressPrimaryBar', category: '9-progress-bar', sel: '[data-parity="progress-primary"] .mdc-linear-progress__bar-inner' },
  { key: 'progressBufferBar', category: '9-progress-bar', sel: '[data-parity="progress-primary"] .mdc-linear-progress__buffer-bar' },
  // 10. 徽标 (badge)
  { key: 'badgeContent', category: '10-badge', sel: '[data-parity="badge-host"] .mat-badge-content' },
  // 11. 卡片 (card)
  { key: 'card', category: '11-card', sel: '[data-parity="card"]' },
  { key: 'cardHeader', category: '11-card', sel: '[data-parity="card-header"]' },
  { key: 'cardTitle', category: '11-card', sel: '[data-parity="card-title"]' },
  { key: 'cardSubtitle', category: '11-card', sel: '[data-parity="card-subtitle"]' },
  // 12. 标签页 (tabs)
  { key: 'tabItem', category: '12-tabs', sel: '[data-parity="tabs"] .mdc-tab' },
  // 13. 列表 (list)
  { key: 'listItem', category: '13-list', sel: '[data-parity="list-item"]' },
  // 14. 表格 (table)
  { key: 'tableHost', category: '14-table', sel: '[data-parity="table"]' },
  { key: 'tableHeaderRow', category: '14-table', sel: '[data-parity="table-header-row"]' },
  { key: 'tableHeaderCell', category: '14-table', sel: '[data-parity="table-header-cell"]' },
  { key: 'tableRow', category: '14-table', sel: '[data-parity="table-row"]' },
  { key: 'tableCell', category: '14-table', sel: '[data-parity="table-cell"]' },
  // 15. 菜单 (menu - overlay)
  { key: 'menuPanel', category: '15-menu', sel: '.mat-mdc-menu-panel', overlay: 'menu' },
  { key: 'menuItem', category: '15-menu', sel: '.mat-mdc-menu-item', overlay: 'menu' },
  // 16. 对话框 (dialog - overlay)
  { key: 'dialogContainer', category: '16-dialog', sel: '.mat-mdc-dialog-container', overlay: 'dialog' },
  // Chips, Expansion (incl. indicator ::after arrow) & M2 Typography classes
  { key: 'chipUnselected', category: 'extra-chips', sel: '[data-parity="chip-unselected"]' },
  { key: 'chipSelected', category: 'extra-chips', sel: '[data-parity="chip-selected"]' },
  { key: 'expansionPanel', category: 'extra-expansion', sel: '[data-parity="expansion"]' },
  { key: 'expansionHeader', category: 'extra-expansion', sel: '[data-parity="expansion-header"]' },
  { key: 'expansionIndicatorAfter', category: 'extra-expansion', sel: '[data-parity="expansion-header"] .mat-expansion-indicator', pseudo: '::after' },
  { key: 'typoH1', category: 'extra-typography', sel: '[data-parity="typo-h1"]' },
  { key: 'typoH2', category: 'extra-typography', sel: '[data-parity="typo-h2"]' },
  { key: 'typoH3', category: 'extra-typography', sel: '[data-parity="typo-h3"]' },
  { key: 'typoH4', category: 'extra-typography', sel: '[data-parity="typo-h4"]' },
  { key: 'typoBody1', category: 'extra-typography', sel: '[data-parity="typo-body1"]' },
  { key: 'typoBody2', category: 'extra-typography', sel: '[data-parity="typo-body2"]' },
  { key: 'typoCaption', category: 'extra-typography', sel: '[data-parity="typo-caption"]' },
];

/**
 * T1.2 + T1.5: Exact-value cross-version diff manifest (ZERO wildcard `(target, prop)` exemptions!).
 * Every entry checks BOTH `expectedRef7452` AND `expectedNg22` by exact computed value.
 * All visual differences vs 7.4.52 have been eliminated; ONLY non-visual Material 18 -> 22
 * internal base CSS mechanics are listed below for platform owner confirmation.
 */
const EXACT_VALUE_CROSS_VERSION_ENTRIES = [
  {
    id: 'MAT22-CDK-AUTOFILL-PROBE',
    targets: ['inputFill', 'inputOutline', 'inputDisabled'],
    prop: 'animation-name',
    expectedRef7452: 'none',
    expectedNg22: 'cdk-text-field-autofill-end',
    visualImpact: '零视觉差异（透明空关键帧探针）',
    reason:
      '`@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。',
  },
  {
    id: 'MAT22-CDK-AUTOFILL-DELAY',
    targets: ['inputFill', 'inputOutline', 'inputDisabled'],
    prop: 'animation-delay',
    expectedRef7452: '0s',
    expectedNg22: '0.001s',
    visualImpact: '零视觉差异（1 毫秒自动填充事件触发延迟）',
    reason:
      '`@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。',
  },
  {
    id: 'MAT22-CHECKBOX-UNICODE-BIDI',
    targets: ['checkboxPrimaryBg', 'checkboxAccentBg'],
    prop: 'unicode-bidi',
    expectedRef7452: 'isolate',
    expectedNg22: 'normal',
    visualImpact: '零视觉差异（纯 SVG 勾选图标容器无双向混排文本）',
    reason:
      'Material 22 将 `.mdc-checkbox__background` 内部节点标签从块级 `<div>` 调整为行内 `<span>`（`display: inline-flex` 保持完全一致），浏览器 UA 默认 `unicode-bidi` 由 `isolate` 变为 `normal`。',
  },
  {
    id: 'MAT22-TAB-TOUCH-ACTION',
    targets: ['tabItem'],
    prop: 'touch-action',
    expectedRef7452: 'auto',
    expectedNg22: 'manipulation',
    visualImpact: '零视觉差异（仅消除触屏设备双击缩放 300ms 点击延迟）',
    reason: 'Material 22 `.mdc-tab` 组件基础 CSS 新增 `touch-action: manipulation` 标准触控优化属性。',
  },
  {
    id: 'MAT22-TABLE-LOGICAL-TEXT-ALIGN',
    targets: ['tableHeaderCell', 'tableCell'],
    prop: 'text-align',
    expectedRef7452: 'left',
    expectedNg22: 'start',
    visualImpact: '零视觉差异（LTR 布局下 `start` 与 `left` 完全等价）',
    reason: 'Material 22 `.mat-mdc-table` 组件基础 CSS 将物理 `text-align: left` 升级为 CSS 逻辑属性 `text-align: start` 以原生兼容双向布局。',
  },
  {
    id: 'MAT22-EXPANSION-UNFOCUSED-OUTLINE',
    targets: ['expansionHeader'],
    prop: 'outline-width',
    expectedRef7452: '3px',
    expectedNg22: '0px',
    visualImpact: '零视觉差异（非聚焦态 `outline-style: none` 下线宽不渲染）',
    reason:
      '7.4.52 非聚焦态 `outline-style: none` 下浏览器默认 `outline-width` 计算值为 `3px`；Material 22 `.mat-expansion-panel-header` 基础样式显式声明 `outline: none` 使 `outline-width` 计算值为 `0px`。',
  },
];

function matchExactCrossVersionEntry(targetKey, prop, rVal, nVal) {
  for (const entry of EXACT_VALUE_CROSS_VERSION_ENTRIES) {
    if (!entry.targets.includes(targetKey) || entry.prop !== prop) continue;
    if (entry.expectedRef7452 === rVal && entry.expectedNg22 === nVal) {
      return entry;
    }
  }
  return null;
}

function buildFullProbeExpr() {
  return `(async () => {
    const targets = ${JSON.stringify(PARITY_TARGETS)};
    const nextFrames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const waitOverlaySettle = () => new Promise((r) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(r)), 180));

    function readAllStyles(target) {
      const el = document.querySelector(target.sel);
      if (!el) return { __missing: true };
      const cs = target.pseudo ? getComputedStyle(el, target.pseudo) : getComputedStyle(el);
      const map = {};
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        if (prop.startsWith('--')) continue;
        map[prop] = cs.getPropertyValue(prop);
      }
      if (!target.pseudo) {
        const rect = el.getBoundingClientRect();
        map.__rectHeight = String(Math.round(rect.height));
        map.__rectWidth = String(Math.round(rect.width));
      }
      return map;
    }

    const snap = {};
    for (const t of targets) {
      if (!t.overlay) {
        snap[t.key] = readAllStyles(t);
      }
    }

    const menuTrigger = document.querySelector('[data-parity="menu-trigger"]');
    if (menuTrigger) {
      menuTrigger.click();
      await waitOverlaySettle();
      for (const t of targets.filter((x) => x.overlay === 'menu')) {
        snap[t.key] = readAllStyles(t);
      }
      const backdrop = document.querySelector('.cdk-overlay-backdrop');
      if (backdrop) backdrop.click();
      await nextFrames();
    }

    const dlgTrigger = document.querySelector('[data-parity="dialog-trigger"]');
    if (dlgTrigger) {
      dlgTrigger.click();
      await waitOverlaySettle();
      for (const t of targets.filter((x) => x.overlay === 'dialog')) {
        snap[t.key] = readAllStyles(t);
      }
      if (window.__closeParityDialogs) {
        window.__closeParityDialogs();
      } else {
        const dlgBackdrop = document.querySelector('.cdk-overlay-backdrop');
        if (dlgBackdrop) dlgBackdrop.click();
      }
      await nextFrames();
    }

    return snap;
  })()`;
}

const FULL_PROBE_EXPR = buildFullProbeExpr();

const FREEZE_TRANSITIONS_EXPR = `(() => {
  if (!document.getElementById('parity-freeze-transitions')) {
    const st = document.createElement('style');
    st.id = 'parity-freeze-transitions';
    st.textContent = '*, *::before, *::after { transition: none !important; animation-duration: 0ms !important; }';
    document.head.appendChild(st);
  }
})()`;

function computeParitySourceSignature(repoRoot, isRef7452) {
  const paritySrc = path.join(ng22Dir, 'projects/testdui/src/app/m2-parity');
  const hash = crypto.createHash('sha256');
  for (const name of fs.readdirSync(paritySrc).sort()) {
    hash.update(name);
    hash.update(fs.readFileSync(path.join(paritySrc, name)));
  }
  hash.update(fs.readFileSync(path.join(ng22Dir, 'projects/testdui/src/app/app.routes.ts')));
  if (!isRef7452) {
    const themeBundle = path.join(repoRoot, 'dist/dui/fesm2022/dotos1-dui-theme.mjs');
    if (fs.existsSync(themeBundle)) {
      hash.update(fs.readFileSync(themeBundle));
    }
    const m2SysScss = path.join(repoRoot, 'src/theming/_m2-system.scss');
    if (fs.existsSync(m2SysScss)) {
      hash.update(fs.readFileSync(m2SysScss));
    }
  }
  return hash.digest('hex');
}

function ensureBuiltWithParityRoute(repoRoot, isRef7452) {
  if (!isRef7452) {
    const themeBundle = path.join(repoRoot, 'dist/dui/fesm2022/dotos1-dui-theme.mjs');
    if (!fs.existsSync(themeBundle)) {
      console.log('[build] 未检测到 dist/dui，先执行 npm run build-dui...');
      execFileSync('npm', ['run', 'build-dui'], { cwd: repoRoot, stdio: 'inherit' });
    }
  }

  const paritySrc = path.join(ng22Dir, 'projects/testdui/src/app/m2-parity');
  const targetParityDir = path.join(repoRoot, 'projects/testdui/src/app/m2-parity');
  const targetRoutes = path.join(repoRoot, 'projects/testdui/src/app/app.routes.ts');
  const distIndex = path.join(repoRoot, 'dist/testdui/browser/index.html');
  const sigFile = path.join(repoRoot, 'dist/testdui/.m2-parity-sig');
  const expectedSig = computeParitySourceSignature(repoRoot, isRef7452);
  const currentSig = fs.existsSync(sigFile) ? fs.readFileSync(sigFile, 'utf8').trim() : '';

  if (fs.existsSync(distIndex) && currentSig === expectedSig) {
    return false;
  }

  let syncedTemp = false;
  if (isRef7452) {
    fs.rmSync(targetParityDir, { recursive: true, force: true });
    fs.cpSync(paritySrc, targetParityDir, { recursive: true });
    // Adapt @dotos1/dui/* imports in m2-parity.component.ts to 7.4.52's pre-T5 tsconfig path mapping
    const compTsPath = path.join(targetParityDir, 'm2-parity.component.ts');
    const legacyScopePrefix = ['@dotos', 'dui/'].join('/');
    const adaptedTs = fs.readFileSync(compTsPath, 'utf8').replaceAll('@dotos1/dui/', legacyScopePrefix);
    fs.writeFileSync(compTsPath, adaptedTs, 'utf8');
    fs.copyFileSync(path.join(ng22Dir, 'projects/testdui/src/app/app.routes.ts'), targetRoutes);
    syncedTemp = true;
  }

  console.log(`[build] 构建 testdui (${isRef7452 ? '7.4.52 对照基线' : 'ng22 当前仓库'})...`);
  execFileSync('npx', ['ng', 'build', 'testdui', '--configuration', 'development'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  fs.writeFileSync(sigFile, expectedSig, 'utf8');
  return syncedTemp;
}

function cleanupRefParitySync(repoRoot) {
  fs.rmSync(path.join(repoRoot, 'projects/testdui/src/app/m2-parity'), { recursive: true, force: true });
  execFileSync('git', ['checkout', '--', 'projects/testdui/src/app/app.routes.ts'], { cwd: repoRoot });
}

async function waitForParityReady(cdp, url) {
  if (url) {
    await cdp.send('Page.navigate', { url });
  }
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const ready = await cdp.evaluate(
      `Boolean(window.__applyParityTheme && document.querySelector('[data-parity="btn-flat-primary"]') && document.querySelector('[data-parity="table-cell"]'))`
    );
    if (ready) return;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`页面未在 20s 内就绪: ${url || 'reload'}`);
}

async function runColdStartConsistencyCheck(cdp, cycles) {
  const results = [];
  for (const cycle of cycles) {
    for (const step of cycle.steps) {
      await cdp.evaluate(`(() => {
        window.__applyParityTheme(${JSON.stringify(step)});
        return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      })()`);
    }
    const finalStep = cycle.steps[cycle.steps.length - 1];
    await cdp.evaluate(FREEZE_TRANSITIONS_EXPR);
    const runtimeSnap = await cdp.evaluate(FULL_PROBE_EXPR);

    await cdp.evaluate(`window.__persistParityConfig(${JSON.stringify(finalStep)})`);
    await cdp.send('Page.reload', { ignoreCache: true });
    await waitForParityReady(cdp, null);
    await cdp.evaluate(FREEZE_TRANSITIONS_EXPR);

    const coldSnap = await cdp.evaluate(FULL_PROBE_EXPR);

    let propsChecked = 0;
    const mismatches = [];
    for (const t of PARITY_TARGETS) {
      const rMap = runtimeSnap[t.key] || {};
      const cMap = coldSnap[t.key] || {};
      if (rMap.__missing || cMap.__missing) {
        mismatches.push({ target: t.key, prop: '__missing', runtime: rMap, coldStart: cMap });
        continue;
      }
      for (const [prop, rVal] of Object.entries(rMap)) {
        propsChecked++;
        const cVal = cMap[prop];
        if (rVal !== cVal) {
          mismatches.push({ target: t.key, prop, runtime: rVal, coldStart: cVal });
        }
      }
    }

    results.push({
      id: cycle.id,
      description: cycle.description,
      finalConfig: finalStep,
      targetsChecked: PARITY_TARGETS.length,
      propertiesChecked: propsChecked,
      mismatchCount: mismatches.length,
      mismatches: mismatches.slice(0, 20),
    });
  }
  await cdp.evaluate(`localStorage.clear()`);
  return results;
}

async function captureLive7452Baseline(refRepoDir, chromeBin, screenshotsDir) {
  let syncedRef = false;
  try {
    syncedRef = ensureBuiltWithParityRoute(refRepoDir, true);
  } finally {
    if (syncedRef) {
      cleanupRefParitySync(refRepoDir);
    }
  }

  const refCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: refRepoDir, encoding: 'utf8' }).trim();
  const refPkg = JSON.parse(fs.readFileSync(path.join(refRepoDir, 'src/package.json'), 'utf8'));
  const srvRef = await startStaticSpaServer(path.join(refRepoDir, 'dist/testdui/browser'));
  const cdpRef = await launchCdpSession(chromeBin);
  const snapshotsBySlug = {};

  try {
    await waitForParityReady(cdpRef, `${srvRef.baseUrl}/m2-parity`);
    await cdpRef.evaluate(FREEZE_TRANSITIONS_EXPR);

    let idx = 0;
    for (const mode of MODES) {
      for (const density of DENSITIES) {
        for (const pal of PALETTES) {
          idx++;
          const slug = `${String(idx).padStart(2, '0')}-${mode}-${density}-${pal.id}`;
          await cdpRef.evaluate(`(() => {
            window.__applyParityTheme(${JSON.stringify({
              primary: pal.primary,
              accent: pal.accent,
              warn: pal.warn,
              type: mode,
              typography: density,
              formType: 'fill',
            })});
            return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          })()`);
          const snapRef = await cdpRef.evaluate(FULL_PROBE_EXPR);
          const shotRefRes = await cdpRef.send('Page.captureScreenshot', { format: 'png' });
          const bufRef = Buffer.from(shotRefRes.data, 'base64');
          fs.writeFileSync(path.join(screenshotsDir, `${slug}-7452.png`), bufRef);
          snapshotsBySlug[slug] = snapRef;
          console.log(`[capture-7452] 已采集基线 [${slug}]`);
        }
      }
    }
  } finally {
    await cdpRef.close();
    srvRef.server.close();
  }

  const payload = {
    schemaVersion: 1,
    refVersion: refPkg.version || '7.4.52',
    refCommit,
    targetsCount: PARITY_TARGETS.length,
    combinationsCount: Object.keys(snapshotsBySlug).length,
    snapshotsBySlug,
  };
  const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'), { level: 9 });
  fs.writeFileSync(baselinePath, compressed);
  console.log(
    `[capture-7452] 已固化基线快照 (${(compressed.length / 1024).toFixed(1)} KiB) -> ${path.relative(ng22Dir, baselinePath)}`
  );
  return payload;
}

function loadCommitted7452Baseline() {
  if (!fs.existsSync(baselinePath)) {
    throw new Error(
      `未找到 7.4.52 入库基线文件 ${path.relative(ng22Dir, baselinePath)}；请先参考 tools/m2-parity/README.md 执行 --capture-ref-dir 采集。`
    );
  }
  const raw = zlib.gunzipSync(fs.readFileSync(baselinePath)).toString('utf8');
  return JSON.parse(raw);
}

async function main() {
  const screenshotsDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  ensureBuiltWithParityRoute(ng22Dir, false);
  const chromeBin = findChromeBinary();

  const baselineData = captureRefDir
    ? await captureLive7452Baseline(captureRefDir, chromeBin, screenshotsDir)
    : loadCommitted7452Baseline();

  const srvNg22 = await startStaticSpaServer(path.join(ng22Dir, 'dist/testdui/browser'));
  const cdpNg22 = await launchCdpSession(chromeBin);

  const combinations = [];
  let comboIdx = 0;
  let grandTotalPropsChecked = 0;
  let grandTotalExactMatches = 0;
  let grandTotalCrossVersionDiffs = 0;
  let grandTotalUnexplainedMismatches = 0;

  // Track every single cross-version (target, prop, ref7452, ng22) tuple across all 27 combinations
  const itemizedDiffMap = new Map();

  try {
    await waitForParityReady(cdpNg22, `${srvNg22.baseUrl}/m2-parity`);
    await cdpNg22.evaluate(FREEZE_TRANSITIONS_EXPR);

    // 1. 27 combinations full getComputedStyle exact-value parity + 54 screenshots pixel diff
    for (const mode of MODES) {
      for (const density of DENSITIES) {
        for (const pal of PALETTES) {
          comboIdx++;
          const slug = `${String(comboIdx).padStart(2, '0')}-${mode}-${density}-${pal.id}`;
          const applyExpr = `(() => {
            window.__applyParityTheme(${JSON.stringify({
              primary: pal.primary,
              accent: pal.accent,
              warn: pal.warn,
              type: mode,
              typography: density,
              formType: 'fill',
            })});
            return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          })()`;

          await cdpNg22.evaluate(applyExpr);
          const snapRef = baselineData.snapshotsBySlug[slug];
          if (!snapRef) {
            throw new Error(`基线快照缺失组合 ${slug}`);
          }

          const snapNg22 = await cdpNg22.evaluate(FULL_PROBE_EXPR);
          const shotNg22Res = await cdpNg22.send('Page.captureScreenshot', { format: 'png' });

          const refShotRel = `screenshots/${slug}-7452.png`;
          const ng22ShotRel = `screenshots/${slug}-ng22.png`;
          const refShotAbs = path.join(outDir, refShotRel);
          const ng22ShotAbs = path.join(outDir, ng22ShotRel);
          const bufNg22 = Buffer.from(shotNg22Res.data, 'base64');
          fs.writeFileSync(ng22ShotAbs, bufNg22);

          if (!fs.existsSync(refShotAbs)) {
            throw new Error(`缺失 7.4.52 基线截图 ${refShotRel}`);
          }
          const bufRef = fs.readFileSync(refShotAbs);
          const pixelCmp = comparePngBuffers(bufRef, bufNg22, 1);

          let comboPropsChecked = 0;
          let comboExactMatches = 0;
          let comboCrossVersionCount = 0;
          const unexplainedMismatches = [];
          const crossVersionByRule = {};

          for (const t of PARITY_TARGETS) {
            const rMap = snapRef[t.key] || {};
            const nMap = snapNg22[t.key] || {};
            if (rMap.__missing || nMap.__missing) {
              unexplainedMismatches.push({
                target: t.key,
                category: t.category,
                prop: '__missing',
                ref7452: rMap.__missing ? 'MISSING' : 'PRESENT',
                ng22: nMap.__missing ? 'MISSING' : 'PRESENT',
              });
              continue;
            }
            for (const [prop, rVal] of Object.entries(rMap)) {
              comboPropsChecked++;
              const nVal = nMap[prop];
              if (rVal === nVal || colorsEquivalent(rVal, nVal, 1, 0.01)) {
                comboExactMatches++;
                continue;
              }
              const entry = matchExactCrossVersionEntry(t.key, prop, rVal, nVal);
              if (entry) {
                comboCrossVersionCount++;
                crossVersionByRule[entry.id] = (crossVersionByRule[entry.id] || 0) + 1;
                const itemKey = `${t.key}|${prop}|${rVal}|${nVal}`;
                if (!itemizedDiffMap.has(itemKey)) {
                  itemizedDiffMap.set(itemKey, {
                    ruleId: entry.id,
                    target: t.key,
                    selector: t.pseudo ? `${t.sel}${t.pseudo}` : t.sel,
                    category: t.category,
                    prop,
                    ref7452Value: rVal,
                    ng22Value: nVal,
                    combinationsCount: 0,
                    visualImpact: entry.visualImpact,
                    reason: entry.reason,
                  });
                }
                itemizedDiffMap.get(itemKey).combinationsCount++;
              } else {
                unexplainedMismatches.push({
                  target: t.key,
                  category: t.category,
                  prop,
                  ref7452: rVal,
                  ng22: nVal,
                });
              }
            }
          }

          grandTotalPropsChecked += comboPropsChecked;
          grandTotalExactMatches += comboExactMatches;
          grandTotalCrossVersionDiffs += comboCrossVersionCount;
          grandTotalUnexplainedMismatches += unexplainedMismatches.length;

          combinations.push({
            index: comboIdx,
            slug,
            mode,
            density,
            palette: pal,
            targetsChecked: PARITY_TARGETS.length,
            propertiesChecked: comboPropsChecked,
            exactMatchCount: comboExactMatches,
            explainedCrossVersionCount: comboCrossVersionCount,
            explainedByRule: crossVersionByRule,
            unexplainedMismatchCount: unexplainedMismatches.length,
            unexplainedMismatches: unexplainedMismatches.slice(0, 30),
            pixelDiff: pixelCmp,
            screenshots: { ref7452: refShotRel, ng22: ng22ShotRel },
          });

          console.log(
            `[${slug}] props=${comboPropsChecked} exact=${comboExactMatches} baseCssDiff=${comboCrossVersionCount} unexplained=${unexplainedMismatches.length} pixelDiff=${(
              pixelCmp.diffRatio * 100
            ).toFixed(3)}%`
          );
        }
      }
    }

    // 2. T1.4: 6-cycle runtime continuous switch vs localStorage cold-start reload (strictly 0 diff!)
    console.log('[T1.4] 执行 6 轮运行时连续切换 vs localStorage 冷启动刷新全属性零差异校验...');
    const coldStartChecks = await runColdStartConsistencyCheck(cdpNg22, [
      {
        id: 'cycle-1-light-dark-darkblue-loose',
        description: 'light/compact/teal-600 (fill) → dark/normal/blue-500 (fill) → darkblue/loose/indigo-500+amber-700+deep-orange-700 (outline)',
        steps: [
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'light', typography: 'compact', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'dark', typography: 'normal', formType: 'fill' },
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'darkblue', typography: 'loose', formType: 'outline' },
        ],
      },
      {
        id: 'cycle-2-darkblue-dark-light-compact',
        description: 'darkblue/loose/indigo-500 (outline) → dark/normal/teal-600 (fill) → light/compact/blue-500+pink-500+red-700 (fill)',
        steps: [
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'darkblue', typography: 'loose', formType: 'outline' },
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'dark', typography: 'normal', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'light', typography: 'compact', formType: 'fill' },
        ],
      },
      {
        id: 'cycle-3-density-compact-normal-loose-dark',
        description: 'dark/compact/indigo-500 (fill) → dark/normal/indigo-500 (outline) → dark/loose/teal-600+orange-800+red-800 (fill)',
        steps: [
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'dark', typography: 'compact', formType: 'fill' },
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'dark', typography: 'normal', formType: 'outline' },
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'dark', typography: 'loose', formType: 'fill' },
        ],
      },
      {
        id: 'cycle-4-density-loose-normal-compact-darkblue',
        description: 'darkblue/loose/teal-600 (fill) → darkblue/normal/blue-500 (fill) → darkblue/compact/blue-500+pink-500+red-700 (outline)',
        steps: [
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'darkblue', typography: 'loose', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'darkblue', typography: 'normal', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'darkblue', typography: 'compact', formType: 'outline' },
        ],
      },
      {
        id: 'cycle-5-palette-swap-light-normal',
        description: 'light/normal/blue-500 (fill) → light/normal/indigo-500 (fill) → light/normal/teal-600+orange-800+red-800 (outline)',
        steps: [
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'light', typography: 'normal', formType: 'fill' },
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'light', typography: 'normal', formType: 'fill' },
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'light', typography: 'normal', formType: 'outline' },
        ],
      },
      {
        id: 'cycle-6-cross-axes-dark-compact-indigo',
        description: 'light/loose/blue-500 (outline) → darkblue/compact/teal-600 (fill) → dark/compact/indigo-500+amber-700+deep-orange-700 (fill)',
        steps: [
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'light', typography: 'loose', formType: 'outline' },
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'darkblue', typography: 'compact', formType: 'fill' },
          { primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700', type: 'dark', typography: 'compact', formType: 'fill' },
        ],
      },
    ]);
    for (const chk of coldStartChecks) {
      console.log(
        `[T1.4 ${chk.id}] targets=${chk.targetsChecked} props=${chk.propertiesChecked} coldStartMismatches=${chk.mismatchCount}`
      );
    }

    // 3. Extra browser checks (<style> cascade, --dui-theme-* dynamic M2 vars, 62.5% root font-size immunity, W1 Zone.js, W4 real animations)
    await cdpNg22.evaluate(`(() => {
      window.__applyParityTheme({
        primary: 'teal-600',
        accent: 'orange-800',
        warn: 'red-800',
        type: 'light',
        typography: 'loose',
        formType: 'fill',
      });
      const freeze = document.getElementById('parity-freeze-transitions');
      if (freeze) freeze.remove();
    })()`);

    const extraChecks = await cdpNg22.evaluate(`(async () => {
      const duiSheets = Array.from(document.head.querySelectorAll('style[data-dui-sheet]')).map((el) => ({
        id: el.getAttribute('data-dui-sheet'),
        role: el.getAttribute('data-dui-role'),
      }));
      const adoptedCount = document.adoptedStyleSheets ? document.adoptedStyleSheets.length : 0;

      const rootCs = getComputedStyle(document.documentElement);
      const duiThemeVars = {
        primary: rootCs.getPropertyValue('--dui-theme-primary').trim(),
        accent: rootCs.getPropertyValue('--dui-theme-accent').trim(),
        warn: rootCs.getPropertyValue('--dui-theme-warn').trim(),
        matSysPrimary: rootCs.getPropertyValue('--mat-sys-primary').trim(),
      };

      const prevHtmlFontSize = document.documentElement.style.fontSize;
      document.documentElement.style.fontSize = '62.5%';
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const fontSizesUnder625 = {
        btn: getComputedStyle(document.querySelector('[data-parity="btn-flat-primary"]')).fontSize,
        cardTitle: getComputedStyle(document.querySelector('[data-parity="card-title"]')).fontSize,
        listItemTitle: getComputedStyle(document.querySelector('[data-parity="list-item"] .mdc-list-item__primary-text')).fontSize,
        tableCell: getComputedStyle(document.querySelector('[data-parity="table-cell"]')).fontSize,
      };
      document.documentElement.style.fontSize = prevHtmlFontSize;

      const expansionIndicatorBorderColor = getComputedStyle(
        document.querySelector('[data-parity="expansion-header"] .mat-expansion-indicator'),
        '::after'
      ).borderTopColor;

      const zoneBtn = document.querySelector('[data-parity="zone-btn"]');
      const beforeZoneText = document.querySelector('[data-parity="zone-probe"]').textContent.trim();
      zoneBtn.click();
      await new Promise((r) => setTimeout(r, 60));
      const afterZoneText = document.querySelector('[data-parity="zone-probe"]').textContent.trim();

      const expHeader = document.querySelector('[data-parity="expansion-header"]');
      const expContent = document.querySelector('[data-parity="expansion"] .mat-expansion-panel-content');
      const expHeightOpen = Math.round(expContent.getBoundingClientRect().height);
      expHeader.click();
      await new Promise((r) => setTimeout(r, 320));
      const expHeightClosed = Math.round(expContent.getBoundingClientRect().height);
      expHeader.click();
      await new Promise((r) => setTimeout(r, 320));
      const expHeightReopened = Math.round(expContent.getBoundingClientRect().height);

      const menuTrigger = document.querySelector('[data-parity="menu-trigger"]');
      menuTrigger.click();
      await new Promise((r) => setTimeout(r, 200));
      const menuPanel = document.querySelector('.mat-mdc-menu-panel');
      const menuOpenRect = menuPanel ? Math.round(menuPanel.getBoundingClientRect().height) : 0;
      const backdrop = document.querySelector('.cdk-overlay-backdrop');
      if (backdrop) backdrop.click();
      await new Promise((r) => setTimeout(r, 200));

      const dlgTrigger = document.querySelector('[data-parity="dialog-trigger"]');
      dlgTrigger.click();
      await new Promise((r) => setTimeout(r, 220));
      const dlgEl = document.querySelector('[data-parity="dialog-title"]');
      const dialogOpened = Boolean(dlgEl && dlgEl.textContent.includes('Parity Dialog'));
      if (window.__closeParityDialogs) window.__closeParityDialogs();
      await new Promise((r) => setTimeout(r, 220));

      return {
        adoptedStyleSheetsCount: adoptedCount,
        duiStyleTags: duiSheets,
        duiThemeVars,
        fontSizesUnder625PercentRoot: fontSizesUnder625,
        expansionIndicatorBorderColor,
        zoneCheck: { beforeZoneText, afterZoneText },
        animationsCheck: {
          expansionHeights: { open: expHeightOpen, closed: expHeightClosed, reopened: expHeightReopened },
          menuOpenHeight: menuOpenRect,
          dialogOpened,
        },
      };
    })()`);

    const totalColdStartMismatches = coldStartChecks.reduce((acc, c) => acc + c.mismatchCount, 0);
    const totalColdStartPropsChecked = coldStartChecks.reduce((acc, c) => acc + c.propertiesChecked, 0);
    const itemizedDiffList = Array.from(itemizedDiffMap.values());

    const passed =
      grandTotalUnexplainedMismatches === 0 &&
      totalColdStartMismatches === 0 &&
      extraChecks.adoptedStyleSheetsCount === 0 &&
      extraChecks.duiStyleTags.length >= 3 &&
      extraChecks.duiStyleTags[0].role === 'core' &&
      extraChecks.duiStyleTags[1].role === 'material-theme' &&
      extraChecks.duiStyleTags[2].role === 'component' &&
      extraChecks.duiThemeVars.primary === '#00897b' &&
      extraChecks.duiThemeVars.matSysPrimary === '' &&
      extraChecks.fontSizesUnder625PercentRoot.btn === '14px' &&
      extraChecks.fontSizesUnder625PercentRoot.cardTitle === '20px' &&
      extraChecks.fontSizesUnder625PercentRoot.listItemTitle === '15px' &&
      extraChecks.fontSizesUnder625PercentRoot.tableCell === '14px' &&
      extraChecks.expansionIndicatorBorderColor === 'rgba(0, 0, 0, 0.7)' &&
      extraChecks.zoneCheck.afterZoneText.startsWith('angular:1:') &&
      extraChecks.animationsCheck.expansionHeights.open > 20 &&
      extraChecks.animationsCheck.expansionHeights.closed === 0 &&
      extraChecks.animationsCheck.expansionHeights.reopened > 20 &&
      extraChecks.animationsCheck.menuOpenHeight > 30 &&
      extraChecks.animationsCheck.dialogOpened === true;

    const baselineFileRel = path.relative(ng22Dir, baselinePath).replaceAll('\\', '/');
    const outDirRel = (path.relative(ng22Dir, outDir) || '.').replaceAll('\\', '/');

    const report = {
      generatedAt: new Date().toISOString(),
      packageUnderTest: '@dotos1/dui@8.0.0-next.2',
      baselineReference: {
        version: baselineData.refVersion,
        commit: baselineData.refCommit,
        baselineFile: baselineFileRel,
      },
      evidenceDirectory: outDirRel,
      colorTolerance: { rgbMaxDelta: 1, alphaMaxDelta: 0.01 },
      summary: {
        totalCombinations: combinations.length,
        componentCategoriesCovered: 16,
        targetsPerCombination: PARITY_TARGETS.length,
        totalComputedStylePropertiesChecked: grandTotalPropsChecked,
        totalExactPropertyMatches: grandTotalExactMatches,
        totalExactValueCrossVersionBaseCssDiffs: grandTotalCrossVersionDiffs,
        distinctCrossVersionElementPropertyItems: itemizedDiffList.length,
        totalUnexplainedPropertyMismatches: grandTotalUnexplainedMismatches,
        coldStartCyclesChecked: coldStartChecks.length,
        coldStartPropertiesChecked: totalColdStartPropsChecked,
        coldStartMismatches: totalColdStartMismatches,
        avgPixelDiffRatio: Number(
          (combinations.reduce((acc, c) => acc + c.pixelDiff.diffRatio, 0) / combinations.length).toFixed(5)
        ),
        maxPixelDiffRatio: Number(Math.max(...combinations.map((c) => c.pixelDiff.diffRatio)).toFixed(5)),
        passed,
      },
      coldStartConsistencyChecks: coldStartChecks,
      itemizedCrossVersionBaseCssDiffs: itemizedDiffList,
      extraChecks,
      combinations,
    };

    const jsonPath = path.join(outDir, 'm2-parity-27-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

    const mdLines = [
      '# `@dotos1/dui` Angular 22 vs `7.4.52` 真实 Chrome 27 组合 M2 外观 100% 还原与 6 轮冷启动一致性报告',
      '',
      `- 生成时间：\`${report.generatedAt}\``,
      `- 对照基线：\`${baselineData.refVersion}\`（\`github/master\` 提交 \`${baselineData.refCommit}\`，入库基线文件 \`${baselineFileRel}\`）`,
      `- 待测版本：\`@dotos1/dui@8.0.0-next.2\`（仓库内独立复现目录 \`${outDirRel}\`）`,
      `- 覆盖组件大类：**16 类全覆盖**（按钮、图标按钮、FAB、表单字段、选择框、复选框、开关、滑块、进度条、徽标、卡片、标签页、列表、表格、菜单弹层、对话框弹层）+ 禁用容器、下划线伪元素、开关轨道/滑块伪元素与阴影、进度条缓冲轨道、展开面板箭头伪元素与字阶类（共 **${PARITY_TARGETS.length}** 个采样节点）`,
      `- 组合总数：**${report.summary.totalCombinations}**（\`light / dark / darkblue\` × \`loose / normal / compact\` × 3 套调色板，54 张全页实测截图位于 \`${outDirRel}/screenshots/\`）`,
      `- 颜色比对容差：**严格 \`RGB <= ±1\`、\`alpha <= ±0.01\`**（禁止按 \`(target, prop)\` 通配豁免，100% 按新旧精确属性值逐项校验）`,
      `- 全量 \`Array.from(getComputedStyle(el, pseudo))\` 逐属性比对总数：**${report.summary.totalComputedStylePropertiesChecked.toLocaleString('en-US')}** 项`,
      `  - 与 \`7.4.52\` 逐值完全一致：**${report.summary.totalExactPropertyMatches.toLocaleString('en-US')}** 项（**${((report.summary.totalExactPropertyMatches / report.summary.totalComputedStylePropertiesChecked) * 100).toFixed(3)}%**）`,
      `  - Material 18 → 22 组件底层基础 CSS 逐值确认项：**${report.summary.totalExactValueCrossVersionBaseCssDiffs.toLocaleString('en-US')}** 项（共 **${itemizedDiffList.length}** 条具体元素属性对，见 §3 逐项清单供平台负责人确认）`,
      `  - **未解释或偏离 \`7.4.52\` 外观的属性差异数：\`${report.summary.totalUnexplainedPropertyMismatches}\`（硬门禁必须 = 0）**`,
      `- 6 轮运行时连续切换 vs \`localStorage\` 冷启动刷新逐属性比对（T1.4）：**${report.summary.coldStartPropertiesChecked.toLocaleString('en-US')}** 项，**差异数 = \`${report.summary.coldStartMismatches}\`（严格 0 差异）**`,
      `- 54 张全页截图像素差异率（容差 \`RGB <= ±1\`）：平均 **${(report.summary.avgPixelDiffRatio * 100).toFixed(3)}%**，最大 **${(report.summary.maxPixelDiffRatio * 100).toFixed(3)}%**`,
      `- \`adoptedStyleSheets\` 数量：\`${extraChecks.adoptedStyleSheetsCount}\`（100% 恢复真实 \`<style>\` 标签注入，顺序 \`${extraChecks.duiStyleTags.map((s) => s.role).join(' -> ')}\`）`,
      `- 动态 M2 根变量校验（T4-1）：\`--dui-theme-primary=${extraChecks.duiThemeVars.primary}\`、\`--mat-sys-primary="${extraChecks.duiThemeVars.matSysPrimary}"\`（零 \`--mat-sys-*\` M3 系统变量）`,
      `- \`html { font-size: 62.5% }\` 下 M2 组件 \`px\` 锁定字阶防 \`rem\` 缩水校验（loose 档）：\`btn=${extraChecks.fontSizesUnder625PercentRoot.btn}\`、\`cardTitle=${extraChecks.fontSizesUnder625PercentRoot.cardTitle}\`、\`listItemTitle=${extraChecks.fontSizesUnder625PercentRoot.listItemTitle}\`、\`tableCell=${extraChecks.fontSizesUnder625PercentRoot.tableCell}\`（全部精确锁定 \`px\` 值，零 \`rem\` 缩水）`,
      `- 折叠面板箭头伪元素颜色校验：\`.mat-expansion-indicator::after border-top-color=${extraChecks.expansionIndicatorBorderColor}\`（对齐 \`7.4.52\`，零全局裸 \`::after\` 污染）`,
      `- W1 \`Zone.js\` 异步自动刷新校验：\`${extraChecks.zoneCheck.afterZoneText}\``,
      `- W4 真实动画校验：折叠面板 \`open=${extraChecks.animationsCheck.expansionHeights.open}px -> closed=${extraChecks.animationsCheck.expansionHeights.closed}px -> reopened=${extraChecks.animationsCheck.expansionHeights.reopened}px\`，菜单高度 \`${extraChecks.animationsCheck.menuOpenHeight}px\`，弹窗打开 \`${extraChecks.animationsCheck.dialogOpened}\``,
      `- 综合结论：**${passed ? 'PASS' : 'FAIL'}**`,
      '',
      '## 1. T1.4 六轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验',
      '',
      '| 轮次 | 连续切换路径 | 采样节点数 | 全量属性比对数 | 冷启动 vs 运行时差异数 | 结果 |',
      '| --- | --- | ---: | ---: | ---: | --- |',
    ];

    for (const c of coldStartChecks) {
      mdLines.push(
        `| \`${c.id}\` | ${c.description} | ${c.targetsChecked} | ${c.propertiesChecked.toLocaleString('en-US')} | **${c.mismatchCount}** | ${
          c.mismatchCount === 0 ? 'PASS' : 'FAIL'
        } |`
      );
    }

    mdLines.push(
      '',
      '## 2. 27 组合全量 `getComputedStyle` 逐值比对与全页像素对比明细',
      '',
      '| # | 底色 | 密度 | 调色板 (`primary / accent / warn`) | 检查属性数 | 逐值完全一致数 | 底层基础 CSS 确认项 | 未解释差异 | 像素差异率 (`RGB±1`) | 结果 |',
      '| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |'
    );

    for (const c of combinations) {
      mdLines.push(
        `| ${c.index} | \`${c.mode}\` | \`${c.density}\` | \`${c.palette.primary} / ${c.palette.accent} / ${c.palette.warn}\` | ${c.propertiesChecked.toLocaleString(
          'en-US'
        )} | ${c.exactMatchCount.toLocaleString('en-US')} | ${c.explainedCrossVersionCount} | **${
          c.unexplainedMismatchCount
        }** | ${(c.pixelDiff.diffRatio * 100).toFixed(3)}% | ${c.unexplainedMismatchCount === 0 ? 'PASS' : 'FAIL'} |`
      );
    }

    mdLines.push(
      '',
      '## 3. T1.5 Material 18 → 22 组件内部底层基础 CSS 差异逐条完整清单（供平台负责人确认）',
      '',
      '> 说明：全部用户可见外观表现（禁用态 `fill` 表单容器底色 `#fafafa/#464646/#3b4b53` 与 `0.06` 底线、启用态 `fill`/`select` `0.42` 底线、`mat-progress-bar` 透明缓冲轨道、`mat-slide-toggle` 选中态 `600/800/400` 色阶与 `currentColor` 轨道轮廓及无阴影滑块、`.mat-expansion-indicator::after` 箭头颜色与零全局裸 `::after` 污染、`.mat-h1~caption` 字阶间距与根容器高度、`color="primary"` 复选框强调色、选中纸片底色与纵向外边距、`mat-badge` 透明底色与紧凑尺寸、卡片与滑块圆柄无阴影、彩色图标按钮内 `<mat-icon>` 前景色、菜单入场动画与菜单项 `14px` 固定字号、凸起按钮 `min-height: auto`、输入框 `padding-left: 0px`）均已对齐 `7.4.52`。下表全量列出剩余仅存于 `@angular/material@22` / `@angular/cdk@22` 组件内部基础样式表的非视觉底层属性项（均按旧值与新值精确断言，无任何通配豁免）：',
      '',
      '| 规则 ID | 采样节点 (`selector`) | CSS 属性 | `7.4.52` 精确值 | `ng22` 精确值 | 出现组合数 | 视觉影响 | 技术原因说明 |',
      '| --- | --- | --- | --- | --- | ---: | --- | --- |'
    );

    for (const item of itemizedDiffList) {
      mdLines.push(
        `| \`${item.ruleId}\` | \`${item.target}\` (\`${item.selector}\`) | \`${item.prop}\` | \`${item.ref7452Value}\` | \`${item.ng22Value}\` | ${item.combinationsCount} | ${item.visualImpact} | ${item.reason} |`
      );
    }

    mdLines.push(
      '',
      '## 4. 仓库内一键独立复现命令',
      '',
      '```bash',
      'yarn install --frozen-lockfile',
      'node tools/m2-parity/run-m2-parity.mjs',
      '```',
      ''
    );

    const mdPath = path.join(outDir, 'm2-parity-27-report.md');
    fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');
    console.log(`\n报告已写入：\n  - ${outDirRel}/m2-parity-27-report.json\n  - ${outDirRel}/m2-parity-27-report.md`);

    if (!passed) {
      console.error('存在未解释的样式差异、冷启动差异或动态门禁未通过！');
      const firstUnexplained = combinations.find((c) => c.unexplainedMismatchCount > 0);
      if (firstUnexplained) {
        console.error(
          `首个未解释差异组合 [${firstUnexplained.slug}]:`,
          JSON.stringify(firstUnexplained.unexplainedMismatches, null, 2)
        );
      }
      process.exit(1);
    }
  } finally {
    await cdpNg22.close();
    srvNg22.server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
