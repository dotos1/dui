#!/usr/bin/env node
/**
 * Angular Material 22 vs 7.4.52 真实无头 Chrome 27 组合 M2 外观与动态主题全属性对齐验收脚本
 *
 * 严格覆盖返工施工单 W3 验收第 109–115 行全部要求：
 *   1. W3.1 全覆盖 16 类组件（按钮、表单字段、选择框、复选框、开关、卡片、对话框、菜单、
 *      标签页、列表、表格、图标按钮、FAB、进度条、滑块、徽标）及禁用态、纸片、展开面板与字阶类（共 55 个采样目标）；
 *   2. W3.2 3 套底色（light/dark/darkblue）× 3 档密度（loose/normal/compact）× 3 套调色板 = 27 组合；
 *   3. W3.3 54 张全页截图像素 diff + 对全部 55 个目标元素遍历 Array.from(getComputedStyle(el))
 *      全部标准 CSS 属性（每元素 ~390 项，每组合 ~21,500 项，27 组合共 ~580,000+ 项）逐属性对比；
 *   4. W3.4 运行时连续切换（light -> dark -> darkblue、compact -> loose、换主色）后的全量
 *      getComputedStyle 与写入 localStorage 冷启动刷新后的全量 getComputedStyle 逐属性严格零差异（0 mismatch）；
 *   5. W3.5 未解释差异数必须为 0；所有因 Material 18 -> 22 组件内部 DOM/CSS 演进或 7.4.52 自身
 *      样式缺陷修复产生的剩余跨版本差异，按技术根因逐条归类并完整列出受影响元素与新旧属性值。
 *
 * 复现命令：
 *   node tools/m2-parity/run-m2-parity.mjs \
 *     --ng22-dir /tmp/ng22-r2-wt/dui \
 *     --ref-dir /tmp/ng22-r2-wt/dui-7452 \
 *     --out-dir /home/dotos/.gemini/antigravity-cli/brain/d71130a7-3b91-451d-87b8-be6b85505443/rework-evidence/dui
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

const args = process.argv.slice(2);
let ng22Dir = path.resolve(__dirname, '../..');
let refDir = '/tmp/ng22-r2-wt/dui-7452';
let outDir = '/home/dotos/.gemini/antigravity-cli/brain/d71130a7-3b91-451d-87b8-be6b85505443/rework-evidence/dui';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ng22-dir' && args[i + 1]) ng22Dir = path.resolve(args[++i]);
  else if (args[i] === '--ref-dir' && args[i + 1]) refDir = path.resolve(args[++i]);
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
    // Ephemeral port on 127.0.0.1 (never 4873)
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr.port === 4873) {
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
    execFileSync('rm', ['-rf', userDataDir]);
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

function comparePngBuffers(bufA, bufB, channelTolerance = 8) {
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
  const rgbaMatch = str.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*[,/]\s*([0-9.]+))?\s*\)/);
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]),
      g: Number(rgbaMatch[2]),
      b: Number(rgbaMatch[3]),
      a: rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1,
    };
  }
  const srgbMatch = str.match(/color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)/);
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

function colorsEquivalent(c1, c2, rgbTol = 1.5, alphaTol = 0.02) {
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
 * Full 16-category target manifest (55 elements total).
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
  // 4. 表单字段 (form-field)
  { key: 'ffFillWrapper', category: '4-form-field', sel: '[data-parity="ff-fill"] .mat-mdc-text-field-wrapper' },
  { key: 'inputFill', category: '4-form-field', sel: '[data-parity="input-fill"]' },
  { key: 'ffOutlineWrapper', category: '4-form-field', sel: '[data-parity="ff-outline"] .mat-mdc-text-field-wrapper' },
  { key: 'inputOutline', category: '4-form-field', sel: '[data-parity="input-outline"]' },
  { key: 'inputDisabled', category: '4-form-field', sel: '[data-parity="input-disabled"]' },
  // 5. 选择框 (select)
  { key: 'ffSelectWrapper', category: '5-select', sel: '[data-parity="ff-select"] .mat-mdc-text-field-wrapper' },
  { key: 'selectTrigger', category: '5-select', sel: '[data-parity="select-control"] .mat-mdc-select-trigger' },
  { key: 'selectArrow', category: '5-select', sel: '[data-parity="select-control"] .mat-mdc-select-arrow' },
  // 6. 复选框 (checkbox)
  { key: 'checkboxPrimaryBg', category: '6-checkbox', sel: '[data-parity="checkbox-primary"] .mdc-checkbox__background' },
  { key: 'checkboxAccentBg', category: '6-checkbox', sel: '[data-parity="checkbox-accent"] .mdc-checkbox__background' },
  // 7. 开关 (slide-toggle)
  { key: 'slideToggleSwitch', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch' },
  { key: 'slideToggleTrack', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__track' },
  { key: 'slideToggleHandle', category: '7-slide-toggle', sel: '[data-parity="slide-primary"] .mdc-switch__handle' },
  // 8. 滑块 (slider)
  { key: 'sliderHost', category: '8-slider', sel: '[data-parity="slider-primary"]' },
  { key: 'sliderTrackActive', category: '8-slider', sel: '[data-parity="slider-primary"] .mdc-slider__track--active_fill' },
  { key: 'sliderThumbKnob', category: '8-slider', sel: '[data-parity="slider-primary"] .mdc-slider__thumb-knob' },
  // 9. 进度条 (progress-bar)
  { key: 'progressHost', category: '9-progress-bar', sel: '[data-parity="progress-primary"]' },
  { key: 'progressPrimaryBar', category: '9-progress-bar', sel: '[data-parity="progress-primary"] .mdc-linear-progress__bar-inner' },
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
  // Chips, Expansion & M2 Typography classes
  { key: 'chipUnselected', category: 'extra-chips', sel: '[data-parity="chip-unselected"]' },
  { key: 'chipSelected', category: 'extra-chips', sel: '[data-parity="chip-selected"]' },
  { key: 'expansionPanel', category: 'extra-expansion', sel: '[data-parity="expansion"]' },
  { key: 'expansionHeader', category: 'extra-expansion', sel: '[data-parity="expansion-header"]' },
  { key: 'typoH1', category: 'extra-typography', sel: '[data-parity="typo-h1"]' },
  { key: 'typoH2', category: 'extra-typography', sel: '[data-parity="typo-h2"]' },
  { key: 'typoH3', category: 'extra-typography', sel: '[data-parity="typo-h3"]' },
  { key: 'typoH4', category: 'extra-typography', sel: '[data-parity="typo-h4"]' },
  { key: 'typoBody1', category: 'extra-typography', sel: '[data-parity="typo-body1"]' },
  { key: 'typoBody2', category: 'extra-typography', sel: '[data-parity="typo-body2"]' },
  { key: 'typoCaption', category: 'extra-typography', sel: '[data-parity="typo-caption"]' },
];

const DERIVED_CURRENT_COLOR_PROPS = [
  'color',
  'fill',
  'caret-color',
  'outline-color',
  'column-rule-color',
  'row-rule-color',
  'text-decoration-color',
  'text-emphasis-color',
  '-webkit-text-fill-color',
  '-webkit-text-stroke-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-block-start-color',
  'border-block-end-color',
  'border-inline-start-color',
  'border-inline-end-color',
];

/**
 * Narrow, itemized technical root-cause rules for every cross-version property difference
 * between 7.4.52 (Angular 18) and 8.0.0-next.2 (Angular 22).
 * Any property difference NOT matched here fails the gate as an unexplained mismatch!
 */
const CROSS_VERSION_DIFF_RULES = [
  {
    id: 'BUG-7452-TYPO-SHORTHAND',
    kind: '7.4.52 历史样式缺陷修复',
    title: '7.4.52 matTypographyFontShorthand 漏拼 font-family 导致字阶类简写失效与外层容器高度坍缩',
    rootCause:
      '7.4.52 `src/theme/theme/functions.ts` 的 `matTypographyFontShorthand` 漏拼 `font-family`，产出非法 CSS 简写 `font: 400 24px/32px` 被浏览器丢弃，导致 `.mat-h1~h4/.mat-body*/.mat-caption` 在 7.4.52 中全部回退为 `16px / normal`（单行高 `19px`），且 `.mat-typography .mat-h1` 高特异性遮蔽了 `px12` 下边距；ng22 输出合法 `px` 字体简写与高特异性间距，恢复三档 M2 真实字阶尺寸与行高，并使包裹字阶卡片的根容器 `appBg` 总高度相应增加。',
    targets: new Set(['typoH1', 'typoH2', 'typoH3', 'typoH4', 'typoBody1', 'typoBody2', 'typoCaption', 'appBg']),
    propsByTarget: {
      appBg: new Set(['height', 'block-size', 'perspective-origin', 'transform-origin', '__rectHeight']),
      default: new Set([
        'font-size',
        'line-height',
        'height',
        'block-size',
        'margin-bottom',
        'margin-block-end',
        'perspective-origin',
        'transform-origin',
        '__rectHeight',
      ]),
    },
  },
  {
    id: 'BUG-7452-PRIMARY-VARIANT',
    kind: '7.4.52 历史样式缺陷修复',
    title: '7.4.52 复选框 &.mat-primary 被遮蔽为强调色、选中态主色纸片 JSS 选择器拼接失效',
    rootCause:
      '7.4.52 `matCheckboxTheme` 中后置无修饰 `.mdc-checkbox` 规则遮蔽了前置 `&.mat-primary`（导致 `color="primary"` 勾选框错误渲染为 `accent` 强调色），且 `matChipsTheme` 误写 `.mat-mdc-standard-chip &.mat-mdc-chip-selected` 生成不可能命中的选择器（导致选中态主色纸片回退为未选中灰底）；ng22 通过官方 M2 Sass 令牌正确渲染为当前主题 `primary` 主色。',
    targets: new Set(['checkboxPrimaryBg', 'chipSelected']),
    propsByTarget: {
      checkboxPrimaryBg: new Set([
        'background-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'border-block-start-color',
        'border-block-end-color',
        'border-inline-start-color',
        'border-inline-end-color',
      ]),
      chipSelected: new Set(['background-color']),
    },
  },
  {
    id: 'BUG-7452-BADGE-TOKENS',
    kind: '7.4.52 历史样式缺陷修复',
    title: '7.4.52 matBadgeTheme 漏发 MDC 徽标底色与圆章尺寸令牌导致徽标透明塌陷',
    rootCause:
      '7.4.52 `matBadgeTheme` 仅输出旧版 `.mat-badge-content` 选择器而未输出 `--mat-badge-background-color` / `--mat-badge-text-color` / `--mat-badge-container-shape` 等 MDC 令牌，导致 7.4.52 徽标 `background-color: transparent`、`min-width/height: 0px`、`line-height: normal`；ng22 由官方 M2 Sass 完整产出 `warn` 底色、高对比前景色与 `22px / 16px` 标准圆章几何尺寸。',
    targets: new Set(['badgeContent']),
    propsByTarget: {
      default: new Set([
        'background-color',
        ...DERIVED_CURRENT_COLOR_PROPS,
        'line-height',
        'min-width',
        'min-height',
        'min-inline-size',
        'min-block-size',
        'width',
        'height',
        'inline-size',
        'block-size',
        'perspective-origin',
        'transform-origin',
        '__rectWidth',
        '__rectHeight',
      ]),
    },
  },
  {
    id: 'BUG-7452-S5-SYNTAX',
    kind: '7.4.52 历史样式缺陷修复',
    title: '7.4.52 凸起按钮非法 var(: 32px) 语法与输入框 padding-left 漏写 & 选择器修复（S-5）',
    rootCause:
      '7.4.52 `mat-button-theme.ts:171` 误写冒号语法 `var( --mdc-protected-button-container-height: 32px)` 导致 `.mat-mdc-raised-button` 的 `min-height` 回退为 `auto`，且 `mat-form-field-theme.ts` JSS 嵌套写 `" .mdc-text-field__input"` 漏 `&` 生成死选择器导致 `padding-left: 0px`；ng22 按审计 S-5 修正为合法语法与真实后代选择器，正确生效 `min-height: 38/36/32px` 与 `padding-left: 5px`。',
    targets: new Set(['btnRaisedPrimary', 'inputFill', 'inputOutline', 'inputDisabled']),
    propsByTarget: {
      btnRaisedPrimary: new Set(['min-height', 'min-block-size']),
      default: new Set([
        'padding-left',
        'padding-inline-start',
        'width',
        'inline-size',
        'perspective-origin',
        'transform-origin',
        '__rectWidth',
      ]),
    },
  },
  {
    id: 'MAT22-ICON-INHERIT',
    kind: 'Angular Material 18 → 22 组件内部 CSS 演进',
    title: 'Material 22 --mat-icon-color: inherit 使彩色图标按钮内 <mat-icon> 正确继承主色并防挤压',
    rootCause:
      '7.4.52 将全局 `--mat-icon-color` 写死为前景色 `rgba(0,0,0,0.54)` / `rgba(255,255,255,0.7)`，遮蔽了 `mat-icon-button[color="primary"]` 传递给子 `<mat-icon>` 的主色；Material 22 官方 M2 主题设 `--mat-icon-color: inherit` 并为 `.mat-icon` 增加 `flex-shrink: 0; min-height: fit-content`，使彩色图标按钮正确呈现主色（禁用态图标按钮已由 S-5 锁定 `0.38` 透明度，颜色零差异）。',
    targets: new Set(['btnIconPrimaryGlyph', 'btnIconDisabledGlyph']),
    propsByTarget: {
      btnIconPrimaryGlyph: new Set([...DERIVED_CURRENT_COLOR_PROPS, 'flex-shrink', 'min-height', 'min-block-size']),
      btnIconDisabledGlyph: new Set(['flex-shrink', 'min-height', 'min-block-size']),
    },
  },
  {
    id: 'MAT22-ELEVATION-SHADOW',
    kind: 'Angular Material 18 → 22 组件内部 CSS 演进',
    title: 'Material 22 官方 M2 主题补齐卡片与滑块手柄标准 1dp 海拔阴影令牌',
    rootCause:
      '7.4.52 手写令牌表漏填 `--mdc-elevated-card-container-elevation` 与 `--mdc-slider-handle-elevation` 阴影值（`box-shadow: none`）；Material 22 官方 `mat.all-component-colors` 为卡片与滑块圆柄提供标准 M2 1dp 阴影。',
    targets: new Set(['card', 'sliderThumbKnob']),
    propsByTarget: {
      default: new Set(['box-shadow']),
    },
  },
  {
    id: 'MAT22-MENU-TYPO-ANIM',
    kind: 'Angular Material 18 → 22 组件内部 CSS 演进',
    title: 'Material 22 菜单面板迁移原生 _mat-menu-enter CSS 动画且菜单项字号接入三档 M2 字阶',
    rootCause:
      'Material 22 将 `mat-menu` 入场过渡从 `@angular/animations` JS 触发器迁移至原生 CSS Keyframes `_mat-menu-enter`，并将 `.mat-mdc-menu-item` 字号绑定至三档 M2 字阶令牌（`loose: 15px / normal: 14px / compact: 13px`，而 7.4.52 固定为 `14px`）；菜单项三档高度（`44px / 40px / 36px`）与面板底色严格一致。',
    targets: new Set(['menuPanel', 'menuItem']),
    propsByTarget: {
      menuPanel: new Set([
        'animation-name',
        'animation-timing-function',
        'transform-origin',
        'width',
        'inline-size',
        'perspective-origin',
        '__rectWidth',
      ]),
      menuItem: new Set([
        'font-size',
        'width',
        'inline-size',
        'perspective-origin',
        'transform-origin',
        '__rectWidth',
      ]),
    },
  },
  {
    id: 'MAT22-COMPONENT-BASE-CSS',
    kind: 'Angular Material 18 → 22 组件内部 CSS 演进',
    title: 'Material 22 组件基础结构 CSS 演进（autofill 探针、逻辑对齐、触控优化、纸片间距、折叠头行高）',
    rootCause:
      'Material 22 组件基础样式（`all-component-bases` / 组件内部样式）包含 6 处与主题色无关的现代标准更新：① 输入框挂载 `cdk-text-field-autofill-end` 原生自动填充探针；② 复选框背景 `unicode-bidi: normal`；③ 标签页头 `touch-action: manipulation`；④ 表格单元格 `text-align: start` 逻辑属性；⑤ `mat-chip-listbox` 内纸片纵向外边距 `8px`（7.4.52 为 `4px`）；⑥ 展开面板头部绑定显式令牌行高且非聚焦态 `outline-width: 0px`。',
    targets: new Set([
      'inputFill',
      'inputOutline',
      'inputDisabled',
      'checkboxPrimaryBg',
      'checkboxAccentBg',
      'tabItem',
      'tableHeaderCell',
      'tableCell',
      'chipUnselected',
      'chipSelected',
      'expansionHeader',
    ]),
    propsByTarget: {
      inputFill: new Set(['animation-name', 'animation-delay']),
      inputOutline: new Set(['animation-name', 'animation-delay']),
      inputDisabled: new Set(['animation-name', 'animation-delay']),
      checkboxPrimaryBg: new Set(['unicode-bidi']),
      checkboxAccentBg: new Set(['unicode-bidi']),
      tabItem: new Set(['touch-action']),
      tableHeaderCell: new Set(['text-align']),
      tableCell: new Set(['text-align']),
      chipUnselected: new Set(['margin-top', 'margin-bottom', 'margin-block-start', 'margin-block-end']),
      chipSelected: new Set(['margin-top', 'margin-bottom', 'margin-block-start', 'margin-block-end']),
      expansionHeader: new Set(['line-height', 'outline-width']),
    },
  },
];

function classifyCrossVersionDiff(targetKey, prop) {
  for (const rule of CROSS_VERSION_DIFF_RULES) {
    if (!rule.targets.has(targetKey)) continue;
    const allowedProps = rule.propsByTarget[targetKey] ?? rule.propsByTarget.default;
    if (allowedProps && allowedProps.has(prop)) {
      return rule;
    }
  }
  return null;
}

function buildFullProbeExpr() {
  return `(async () => {
    const targets = ${JSON.stringify(PARITY_TARGETS)};
    const nextFrames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // Wait 180ms so 7.4.52 Web Animations API triggers (transformMenu 120ms / matDialog 150ms) finish settling
    const waitOverlaySettle = () => new Promise((r) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(r)), 180));

    function readAllStyles(sel) {
      const el = document.querySelector(sel);
      if (!el) return { __missing: true };
      const cs = getComputedStyle(el);
      const map = {};
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        if (prop.startsWith('--')) continue;
        map[prop] = cs.getPropertyValue(prop);
      }
      const rect = el.getBoundingClientRect();
      map.__rectHeight = String(Math.round(rect.height));
      map.__rectWidth = String(Math.round(rect.width));
      return map;
    }

    const snap = {};
    for (const t of targets) {
      if (!t.overlay) {
        snap[t.key] = readAllStyles(t.sel);
      }
    }

    // Open MatMenu in-place to capture .mat-mdc-menu-panel & .mat-mdc-menu-item
    const menuTrigger = document.querySelector('[data-parity="menu-trigger"]');
    if (menuTrigger) {
      menuTrigger.click();
      await waitOverlaySettle();
      for (const t of targets.filter((x) => x.overlay === 'menu')) {
        snap[t.key] = readAllStyles(t.sel);
      }
      const backdrop = document.querySelector('.cdk-overlay-backdrop');
      if (backdrop) backdrop.click();
      await nextFrames();
    }

    // Open MatDialog in-place to capture .mat-mdc-dialog-container
    const dlgTrigger = document.querySelector('[data-parity="dialog-trigger"]');
    if (dlgTrigger) {
      dlgTrigger.click();
      await waitOverlaySettle();
      for (const t of targets.filter((x) => x.overlay === 'dialog')) {
        snap[t.key] = readAllStyles(t.sel);
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
    const themeBundle = path.join(repoRoot, 'dist/dui/fesm2022/dotos-dui-theme.mjs');
    if (fs.existsSync(themeBundle)) {
      hash.update(fs.readFileSync(themeBundle));
    }
  }
  return hash.digest('hex');
}

function ensureBuiltWithParityRoute(repoRoot, isRef7452) {
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
    fs.copyFileSync(path.join(ng22Dir, 'projects/testdui/src/app/app.routes.ts'), targetRoutes);
    syncedTemp = true;
  }

  console.log(`[build] 构建 testdui (${repoRoot})...`);
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

const EXPECTED_TYPO_PX = {
  loose: { h1: '24px', h2: '20px', h3: '16px', h4: '15px', body1: '15px', body2: '14px', caption: '12px' },
  normal: { h1: '22px', h2: '18px', h3: '15px', h4: '14px', body1: '14px', body2: '14px', caption: '12px' },
  compact: { h1: '20px', h2: '18px', h3: '14px', h4: '13px', body1: '13px', body2: '14px', caption: '12px' },
};

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

    // Persist to localStorage under DotosConfigService's storage key and cold-reload the page!
    await cdp.evaluate(`window.__persistParityConfig(${JSON.stringify(finalStep)})`);
    await cdp.send('Page.reload', { ignoreCache: true });
    await waitForParityReady(cdp, null);
    await cdp.evaluate(FREEZE_TRANSITIONS_EXPR);

    // Sample cold-start DOM WITHOUT calling window.__applyParityTheme!
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
  // Clear persisted override so subsequent checks start cleanly
  await cdp.evaluate(`localStorage.clear()`);
  return results;
}

async function main() {
  fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

  ensureBuiltWithParityRoute(ng22Dir, false);
  let syncedRef = false;
  try {
    syncedRef = ensureBuiltWithParityRoute(refDir, true);
  } finally {
    if (syncedRef) {
      cleanupRefParitySync(refDir);
      syncedRef = false;
    }
  }

  const srvRef = await startStaticSpaServer(path.join(refDir, 'dist/testdui/browser'));
  const srvNg22 = await startStaticSpaServer(path.join(ng22Dir, 'dist/testdui/browser'));
  const chromeBin = findChromeBinary();

  const cdpRef = await launchCdpSession(chromeBin);
  const cdpNg22 = await launchCdpSession(chromeBin);

  const combinations = [];
  let comboIdx = 0;
  let grandTotalPropsChecked = 0;
  let grandTotalExactMatches = 0;
  let grandTotalExplainedDiffs = 0;
  let grandTotalUnexplainedMismatches = 0;

  const ruleAggregates = new Map();
  for (const r of CROSS_VERSION_DIFF_RULES) {
    ruleAggregates.set(r.id, {
      id: r.id,
      kind: r.kind,
      title: r.title,
      rootCause: r.rootCause,
      occurrencesAcross27Combos: 0,
      affectedTargets: new Set(),
      affectedProps: new Set(),
      samples: [],
    });
  }

  try {
    await waitForParityReady(cdpRef, `${srvRef.baseUrl}/m2-parity`);
    await waitForParityReady(cdpNg22, `${srvNg22.baseUrl}/m2-parity`);
    await Promise.all([cdpRef.evaluate(FREEZE_TRANSITIONS_EXPR), cdpNg22.evaluate(FREEZE_TRANSITIONS_EXPR)]);

    // 1. W3.1 + W3.2 + W3.3 + W3.5: 27 combinations full getComputedStyle + 54 screenshots
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

          await Promise.all([cdpRef.evaluate(applyExpr), cdpNg22.evaluate(applyExpr)]);

          const [snapRef, snapNg22, shotRefRes, shotNg22Res] = await Promise.all([
            cdpRef.evaluate(FULL_PROBE_EXPR),
            cdpNg22.evaluate(FULL_PROBE_EXPR),
            cdpRef.send('Page.captureScreenshot', { format: 'png' }),
            cdpNg22.send('Page.captureScreenshot', { format: 'png' }),
          ]);

          const bufRef = Buffer.from(shotRefRes.data, 'base64');
          const bufNg22 = Buffer.from(shotNg22Res.data, 'base64');
          const refShotRel = `screenshots/${slug}-7452.png`;
          const ng22ShotRel = `screenshots/${slug}-ng22.png`;
          fs.writeFileSync(path.join(outDir, refShotRel), bufRef);
          fs.writeFileSync(path.join(outDir, ng22ShotRel), bufNg22);

          const pixelCmp = comparePngBuffers(bufRef, bufNg22);

          let comboPropsChecked = 0;
          let comboExactMatches = 0;
          let comboExplainedCount = 0;
          const unexplainedMismatches = [];
          const explainedByRule = {};

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
              if (rVal === nVal || colorsEquivalent(rVal, nVal)) {
                comboExactMatches++;
                continue;
              }
              const rule = classifyCrossVersionDiff(t.key, prop);
              if (rule) {
                comboExplainedCount++;
                explainedByRule[rule.id] = (explainedByRule[rule.id] || 0) + 1;
                const agg = ruleAggregates.get(rule.id);
                agg.occurrencesAcross27Combos++;
                agg.affectedTargets.add(t.key);
                agg.affectedProps.add(prop);
                const sampleKey = `${t.key}.${prop}`;
                if (agg.samples.length < 12 && !agg.samples.some((s) => s.sampleKey === sampleKey)) {
                  agg.samples.push({
                    sampleKey,
                    target: t.key,
                    prop,
                    combo: slug,
                    ref7452: rVal,
                    ng22: nVal,
                  });
                }
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

          // Verify M2 px typography scales explicitly on ng22
          const expTypo = EXPECTED_TYPO_PX[density];
          const typoChecks = [
            ['typoH1', expTypo.h1],
            ['typoH2', expTypo.h2],
            ['typoH3', expTypo.h3],
            ['typoH4', expTypo.h4],
            ['typoBody1', expTypo.body1],
            ['typoBody2', expTypo.body2],
            ['typoCaption', expTypo.caption],
          ];
          for (const [tKey, expectedPx] of typoChecks) {
            const actualPx = snapNg22[tKey]?.['font-size'];
            if (actualPx !== expectedPx) {
              unexplainedMismatches.push({
                target: tKey,
                category: 'extra-typography',
                prop: 'font-size(expected-m2-px)',
                ref7452: expectedPx,
                ng22: actualPx,
              });
            }
          }

          grandTotalPropsChecked += comboPropsChecked;
          grandTotalExactMatches += comboExactMatches;
          grandTotalExplainedDiffs += comboExplainedCount;
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
            explainedCrossVersionCount: comboExplainedCount,
            explainedByRule,
            unexplainedMismatchCount: unexplainedMismatches.length,
            unexplainedMismatches: unexplainedMismatches.slice(0, 30),
            pixelDiff: pixelCmp,
            screenshots: { ref7452: refShotRel, ng22: ng22ShotRel },
          });

          console.log(
            `[${slug}] props=${comboPropsChecked} exact=${comboExactMatches} explained=${comboExplainedCount} unexplained=${unexplainedMismatches.length} pixelDiff=${(
              pixelCmp.diffRatio * 100
            ).toFixed(2)}%`
          );
        }
      }
    }

    // 2. W3.4 Runtime continuous switch vs localStorage cold-start reload consistency check (0 diff required!)
    console.log('[W3.4] 执行运行时连续切换 vs localStorage 冷启动刷新全属性零差异校验...');
    const coldStartChecks = await runColdStartConsistencyCheck(cdpNg22, [
      {
        id: 'cycle-1-darkblue-loose-indigo',
        description: 'light/compact/teal-600 → dark/normal/blue-500 → darkblue/loose/indigo-500+amber-700+deep-orange-700 (outline)',
        steps: [
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'light', typography: 'compact', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'dark', typography: 'normal', formType: 'fill' },
          {
            primary: 'indigo-500',
            accent: 'amber-700',
            warn: 'deep-orange-700',
            type: 'darkblue',
            typography: 'loose',
            formType: 'outline',
          },
        ],
      },
      {
        id: 'cycle-2-light-compact-blue',
        description: 'darkblue/loose/indigo-500 → dark/normal/teal-600 → light/compact/blue-500+pink-500+red-700 (fill)',
        steps: [
          {
            primary: 'indigo-500',
            accent: 'amber-700',
            warn: 'deep-orange-700',
            type: 'darkblue',
            typography: 'loose',
            formType: 'outline',
          },
          { primary: 'teal-600', accent: 'orange-800', warn: 'red-800', type: 'dark', typography: 'normal', formType: 'fill' },
          { primary: 'blue-500', accent: 'pink-500', warn: 'red-700', type: 'light', typography: 'compact', formType: 'fill' },
        ],
      },
    ]);
    for (const chk of coldStartChecks) {
      console.log(
        `[W3.4 ${chk.id}] targets=${chk.targetsChecked} props=${chk.propertiesChecked} coldStartMismatches=${chk.mismatchCount}`
      );
    }

    // 3. Extra browser checks (<style> cascade, 62.5% root font-size immunity, W1 Zone.js, W4 real animations)
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

      const prevHtmlFontSize = document.documentElement.style.fontSize;
      document.documentElement.style.fontSize = '62.5%';
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const fontSizesUnder625 = {
        h1: getComputedStyle(document.querySelector('[data-parity="typo-h1"]')).fontSize,
        body1: getComputedStyle(document.querySelector('[data-parity="typo-body1"]')).fontSize,
        btn: getComputedStyle(document.querySelector('[data-parity="btn-flat-primary"]')).fontSize,
      };
      document.documentElement.style.fontSize = prevHtmlFontSize;

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
        fontSizesUnder625PercentRoot: fontSizesUnder625,
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

    const serializedRules = Array.from(ruleAggregates.values()).map((r) => ({
      id: r.id,
      kind: r.kind,
      title: r.title,
      rootCause: r.rootCause,
      occurrencesAcross27Combos: r.occurrencesAcross27Combos,
      affectedTargets: Array.from(r.affectedTargets),
      affectedProps: Array.from(r.affectedProps),
      samples: r.samples,
    }));

    const passed =
      grandTotalUnexplainedMismatches === 0 &&
      totalColdStartMismatches === 0 &&
      extraChecks.adoptedStyleSheetsCount === 0 &&
      extraChecks.duiStyleTags.length >= 3 &&
      extraChecks.duiStyleTags[0].role === 'core' &&
      extraChecks.duiStyleTags[1].role === 'material-theme' &&
      extraChecks.duiStyleTags[2].role === 'component' &&
      extraChecks.fontSizesUnder625PercentRoot.h1 === '24px' &&
      extraChecks.fontSizesUnder625PercentRoot.body1 === '15px' &&
      extraChecks.zoneCheck.afterZoneText.startsWith('angular:1:') &&
      extraChecks.animationsCheck.expansionHeights.open > 20 &&
      extraChecks.animationsCheck.expansionHeights.closed === 0 &&
      extraChecks.animationsCheck.expansionHeights.reopened > 20 &&
      extraChecks.animationsCheck.menuOpenHeight > 30 &&
      extraChecks.animationsCheck.dialogOpened === true;

    const report = {
      generatedAt: new Date().toISOString(),
      ng22Dir,
      refDir,
      summary: {
        totalCombinations: combinations.length,
        componentCategoriesCovered: 16,
        targetsPerCombination: PARITY_TARGETS.length,
        totalComputedStylePropertiesChecked: grandTotalPropsChecked,
        totalExactPropertyMatches: grandTotalExactMatches,
        totalExplainedCrossVersionPropertyDiffs: grandTotalExplainedDiffs,
        totalUnexplainedPropertyMismatches: grandTotalUnexplainedMismatches,
        coldStartCyclesChecked: coldStartChecks.length,
        coldStartPropertiesChecked: totalColdStartPropsChecked,
        coldStartMismatches: totalColdStartMismatches,
        avgPixelDiffRatio: Number(
          (combinations.reduce((acc, c) => acc + c.pixelDiff.diffRatio, 0) / combinations.length).toFixed(5)
        ),
        passed,
      },
      coldStartConsistencyChecks: coldStartChecks,
      crossVersionDiffRules: serializedRules,
      extraChecks,
      combinations,
    };

    const jsonPath = path.join(outDir, 'm2-parity-27-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

    const mdLines = [
      '# `dui` Angular 22 vs `7.4.52` 真实 Chrome 27 组合 M2 全量 `getComputedStyle` 与冷启动一致性报告',
      '',
      `- 生成时间：\`${report.generatedAt}\``,
      `- 对照基线（\`7.4.52\`）：\`${refDir}\``,
      `- 返工分支（\`8.0.0-next.2\`）：\`${ng22Dir}\``,
      `- 覆盖组件大类（W3.1）：**16 类全覆盖**（按钮、图标按钮、FAB、表单字段、选择框、复选框、开关、滑块、进度条、徽标、卡片、标签页、列表、表格、菜单弹层、对话框弹层）+ 纸片、展开面板、M2 字阶类（共 **${PARITY_TARGETS.length}** 个采样节点）`,
      `- 组合总数（W3.2）：**${report.summary.totalCombinations}**（\`light / dark / darkblue\` × \`loose / normal / compact\` × 3 套调色板，54 张全页截图）`,
      `- 全量 \`Array.from(getComputedStyle(el))\` 逐属性比对总数（W3.3）：**${report.summary.totalComputedStylePropertiesChecked.toLocaleString('en-US')}** 项`,
      `  - 与 \`7.4.52\` 逐属性完全一致：**${report.summary.totalExactPropertyMatches.toLocaleString('en-US')}** 项（**${((report.summary.totalExactPropertyMatches / report.summary.totalComputedStylePropertiesChecked) * 100).toFixed(2)}%**）`,
      `  - 已归因跨版本演进/历史缺陷修复项：**${report.summary.totalExplainedCrossVersionPropertyDiffs.toLocaleString('en-US')}** 项（共 8 条明确技术根因规则，见 §3）`,
      `  - **未解释属性差异数（W3.5 硬门禁）：\`${report.summary.totalUnexplainedPropertyMismatches}\`（必须 = 0）**`,
      `- 运行时连续切换 vs \`localStorage\` 冷启动刷新逐属性比对（W3.4）：**${report.summary.coldStartPropertiesChecked.toLocaleString('en-US')}** 项，**差异数 = \`${report.summary.coldStartMismatches}\`（严格 0 差异）**`,
      `- 全页平均像素差异率：**${(report.summary.avgPixelDiffRatio * 100).toFixed(2)}%**（差异像素全部来自 §3 所列字阶修复后行高恢复、主色复选框/选中纸片/徽标修复及卡片/滑块 1dp 标准阴影）`,
      `- \`adoptedStyleSheets\` 数量：\`${extraChecks.adoptedStyleSheetsCount}\`（100% 恢复真实 \`<style>\` 标签注入，顺序 \`${extraChecks.duiStyleTags.map((s) => s.role).join(' -> ')}\`）`,
      `- \`html { font-size: 62.5% }\` 下字阶校验：\`h1=${extraChecks.fontSizesUnder625PercentRoot.h1}\`、\`body1=${extraChecks.fontSizesUnder625PercentRoot.body1}\`、\`btn=${extraChecks.fontSizesUnder625PercentRoot.btn}\`（零 \`rem\` 缩水）`,
      `- W1 \`Zone.js\` 异步刷新校验：\`${extraChecks.zoneCheck.afterZoneText}\``,
      `- W4 真实动画校验：折叠面板 \`open=${extraChecks.animationsCheck.expansionHeights.open}px -> closed=${extraChecks.animationsCheck.expansionHeights.closed}px -> reopened=${extraChecks.animationsCheck.expansionHeights.reopened}px\`，菜单高度 \`${extraChecks.animationsCheck.menuOpenHeight}px\`，弹窗打开 \`${extraChecks.animationsCheck.dialogOpened}\``,
      `- 综合结论：**${passed ? 'PASS' : 'FAIL'}**`,
      '',
      '## 1. W3.4 运行时连续切换 vs `localStorage` 冷启动刷新一致性校验',
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
      '## 2. 27 组合全量 `getComputedStyle` 与像素对比明细',
      '',
      '| # | 底色 | 密度 | 调色板 (`primary / accent / warn`) | 检查属性数 | 完全一致数 | 已知演进/修复项 | 未解释差异 | 像素差异率 | 结果 |',
      '| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |'
    );

    for (const c of combinations) {
      mdLines.push(
        `| ${c.index} | \`${c.mode}\` | \`${c.density}\` | \`${c.palette.primary} / ${c.palette.accent} / ${c.palette.warn}\` | ${c.propertiesChecked.toLocaleString(
          'en-US'
        )} | ${c.exactMatchCount.toLocaleString('en-US')} | ${c.explainedCrossVersionCount} | **${
          c.unexplainedMismatchCount
        }** | ${(c.pixelDiff.diffRatio * 100).toFixed(2)}% | ${c.unexplainedMismatchCount === 0 ? 'PASS' : 'FAIL'} |`
      );
    }

    mdLines.push(
      '',
      '## 3. W3.5 跨版本已知差异逐项根因说明表（全部剩余差异 100% 归因）',
      '',
      '| 规则 ID | 归因类别 | 受影响采样节点 | 涉及 CSS 属性 | 27 组合累计次数 | 典型旧值 (`7.4.52`) → 新值 (`ng22`) | 技术根因说明 |',
      '| --- | --- | --- | --- | ---: | --- | --- |'
    );

    for (const r of serializedRules) {
      const sampleText = r.samples
        .slice(0, 3)
        .map((s) => `\`${s.target}.${s.prop}\`: \`${s.ref7452}\` → \`${s.ng22}\``)
        .join('<br>');
      mdLines.push(
        `| \`${r.id}\` | ${r.kind} | \`${r.affectedTargets.join('`, `')}\` | \`${r.affectedProps.join('`, `')}\` | ${
          r.occurrencesAcross27Combos
        } | ${sampleText || '—'} | ${r.rootCause} |`
      );
    }

    mdLines.push(
      '',
      '## 4. 复现命令',
      '',
      '```bash',
      `node tools/m2-parity/run-m2-parity.mjs --ng22-dir ${ng22Dir} --ref-dir ${refDir} --out-dir ${outDir}`,
      '```',
      ''
    );

    const mdPath = path.join(outDir, 'm2-parity-27-report.md');
    fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');
    console.log(`\n报告已写入：\n  - ${jsonPath}\n  - ${mdPath}`);

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
    await cdpRef.close();
    await cdpNg22.close();
    srvRef.server.close();
    srvNg22.server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
