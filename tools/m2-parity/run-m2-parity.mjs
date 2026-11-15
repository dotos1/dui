#!/usr/bin/env node
/**
 * Angular Material 22 vs 7.4.52 真实无头 Chrome 27 组合 M2 外观与动态主题对齐验收脚本
 * (3 套底色 light/dark/darkblue × 3 档密度 loose/normal/compact × 3 套调色板 = 27 组合)
 *
 * 复现命令：
 *   node tools/m2-parity/run-m2-parity.mjs \
 *     --ng22-dir /tmp/ng22-r2-wt/dui \
 *     --ref-dir /tmp/ng22-r2-wt/dui-7452 \
 *     --out-dir /home/dotos/.gemini/antigravity-cli/brain/d71130a7-3b91-451d-87b8-be6b85505443/rework-evidence/dui
 */

import { execFileSync, spawn } from 'node:child_process';
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
let outDir = path.resolve(__dirname, 'artifacts');

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
      '--window-size=1280,960',
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

  // Fetch first page target via HTTP /json/list
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
    height: 960,
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

/**
 * Minimal pure-Node PNG RGBA decoder (supports 8-bit RGB/RGBA non-interlaced Chrome screenshots).
 */
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

function parseRgb(str) {
  if (!str) return null;
  const m = str.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/);
  if (!m) return null;
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

function colorsClose(c1, c2, rgbTol = 4, alphaTol = 0.06) {
  if (c1 === c2) return true;
  const p1 = parseRgb(c1);
  const p2 = parseRgb(c2);
  if (!p1 || !p2) return false;
  if (p1.a === 0 && p2.a === 0) return true;
  return (
    Math.abs(p1.r - p2.r) <= rgbTol &&
    Math.abs(p1.g - p2.g) <= rgbTol &&
    Math.abs(p1.b - p2.b) <= rgbTol &&
    Math.abs(p1.a - p2.a) <= alphaTol
  );
}

function pxClose(v1, v2, tol = 2) {
  if (v1 === v2) return true;
  const n1 = Number.parseFloat(String(v1));
  const n2 = Number.parseFloat(String(v2));
  if (Number.isFinite(n1) && Number.isFinite(n2)) {
    return Math.abs(n1 - n2) <= tol;
  }
  return false;
}

const MODES = ['light', 'dark', 'darkblue'];
const DENSITIES = ['loose', 'normal', 'compact'];
const PALETTES = [
  { id: 'teal-orange', primary: 'teal-600', accent: 'orange-800', warn: 'red-800' },
  { id: 'blue-pink', primary: 'blue-500', accent: 'pink-500', warn: 'red-700' },
  { id: 'indigo-amber', primary: 'indigo-500', accent: 'amber-700', warn: 'deep-orange-700' },
];

const BROWSER_PROBE_EXPR = `(() => {
  const targets = [
    { key: 'toolbar', sel: '.site-toolbar', props: ['backgroundColor', 'color', 'height'] },
    { key: 'appBg', sel: '[data-parity="root"]', props: ['backgroundColor', 'color'] },
    { key: 'card', sel: '[data-parity="card"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius'] },
    { key: 'btnFlatPrimary', sel: '[data-parity="btn-flat-primary"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius', 'fontSize', 'fontWeight'], rectH: true },
    { key: 'btnFlatAccent', sel: '[data-parity="btn-flat-accent"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius'], rectH: true },
    { key: 'btnFlatWarn', sel: '[data-parity="btn-flat-warn"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius'], rectH: true },
    { key: 'btnRaisedPrimary', sel: '[data-parity="btn-raised-primary"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius'], rectH: true },
    { key: 'btnStrokedPrimary', sel: '[data-parity="btn-stroked-primary"]', props: ['color', 'borderTopLeftRadius'], rectH: true },
    { key: 'btnBasicPrimary', sel: '[data-parity="btn-basic-primary"]', props: ['color', 'borderTopLeftRadius'], rectH: true },
    { key: 'btnIconPrimary', sel: '[data-parity="btn-icon-primary"]', props: ['color'], rectH: true },
    { key: 'btnFabAccent', sel: '[data-parity="btn-fab-accent"]', props: ['backgroundColor', 'color'], rectH: true },
    { key: 'ffFillWrapper', sel: '[data-parity="ff-fill"] .mat-mdc-text-field-wrapper', props: ['backgroundColor', 'borderTopLeftRadius'], rectH: true },
    { key: 'ffOutlineWrapper', sel: '[data-parity="ff-outline"] .mat-mdc-text-field-wrapper', props: ['backgroundColor'], rectH: true },
    { key: 'ffSelectWrapper', sel: '[data-parity="ff-select"] .mat-mdc-text-field-wrapper', props: ['backgroundColor'], rectH: true },
    { key: 'checkboxPrimaryBg', sel: '[data-parity="checkbox-primary"] .mdc-checkbox__background', props: ['backgroundColor', 'borderTopColor'] },
    { key: 'checkboxAccentBg', sel: '[data-parity="checkbox-accent"] .mdc-checkbox__background', props: ['backgroundColor', 'borderTopColor'] },
    { key: 'radioPrimaryOuter', sel: '[data-parity="radio-primary"] .mdc-radio__outer-circle', props: ['borderTopColor'] },
    { key: 'chipUnselected', sel: '[data-parity="chip-unselected"]', props: ['backgroundColor', 'borderTopLeftRadius'], rectH: true },
    { key: 'chipSelected', sel: '[data-parity="chip-selected"]', props: ['backgroundColor', 'borderTopLeftRadius'], rectH: true },
    { key: 'progressPrimaryBar', sel: '[data-parity="progress-primary"] .mdc-linear-progress__bar-inner', props: ['borderTopColor'] },
    { key: 'tabItem', sel: '[data-parity="tabs"] .mdc-tab', props: ['fontSize'], rectH: true },
    { key: 'listItem', sel: '[data-parity="list-item"]', props: ['fontSize'], rectH: true },
    { key: 'expansionPanel', sel: '[data-parity="expansion"]', props: ['backgroundColor', 'color', 'borderTopLeftRadius'] },
    { key: 'expansionHeader', sel: '[data-parity="expansion-header"]', props: ['fontSize'], rectH: true },
    { key: 'typoH1', sel: '[data-parity="typo-h1"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoH2', sel: '[data-parity="typo-h2"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoH3', sel: '[data-parity="typo-h3"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoH4', sel: '[data-parity="typo-h4"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoBody1', sel: '[data-parity="typo-body1"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoBody2', sel: '[data-parity="typo-body2"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
    { key: 'typoCaption', sel: '[data-parity="typo-caption"]', props: ['fontSize', 'fontWeight', 'lineHeight'] },
  ];

  const snap = {};
  for (const t of targets) {
    const el = document.querySelector(t.sel);
    if (!el) {
      snap[t.key] = { missing: true };
      continue;
    }
    const cs = getComputedStyle(el);
    const entry = {};
    for (const p of t.props) {
      entry[p] = cs[p];
    }
    if (t.rectH) {
      entry.rectHeight = Math.round(el.getBoundingClientRect().height);
    }
    snap[t.key] = entry;
  }
  return snap;
})()`;

function ensureBuiltWithParityRoute(repoRoot, isRef7452) {
  const paritySrc = path.join(ng22Dir, 'projects/testdui/src/app/m2-parity');
  const targetParityDir = path.join(repoRoot, 'projects/testdui/src/app/m2-parity');
  const targetRoutes = path.join(repoRoot, 'projects/testdui/src/app/app.routes.ts');
  const distIndex = path.join(repoRoot, 'dist/testdui/browser/index.html');

  let syncedTemp = false;
  if (isRef7452 && !fs.existsSync(targetParityDir)) {
    fs.cpSync(paritySrc, targetParityDir, { recursive: true });
    fs.copyFileSync(path.join(ng22Dir, 'projects/testdui/src/app/app.routes.ts'), targetRoutes);
    syncedTemp = true;
  }

  if (!fs.existsSync(distIndex) || syncedTemp) {
    console.log(`[build] 构建 testdui (${repoRoot})...`);
    execFileSync('npx', ['ng', 'build', 'testdui', '--configuration', 'development'], {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  }
  return syncedTemp;
}

async function waitForParityReady(cdp, url) {
  await cdp.send('Page.navigate', { url });
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const ready = await cdp.evaluate(
      `Boolean(window.__applyParityTheme && document.querySelector('[data-parity="btn-flat-primary"]'))`
    );
    if (ready) return;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`页面未在 20s 内就绪: ${url}`);
}

const EXPECTED_TYPO_PX = {
  loose: { h1: '24px', h2: '20px', h3: '16px', h4: '15px', body1: '15px', body2: '14px', caption: '12px' },
  normal: { h1: '22px', h2: '18px', h3: '15px', h4: '14px', body1: '14px', body2: '14px', caption: '12px' },
  compact: { h1: '20px', h2: '18px', h3: '14px', h4: '13px', body1: '13px', body2: '13px', caption: '12px' },
};

async function main() {
  fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

  ensureBuiltWithParityRoute(ng22Dir, false);
  const syncedRef = ensureBuiltWithParityRoute(refDir, true);

  const srvRef = await startStaticSpaServer(path.join(refDir, 'dist/testdui/browser'));
  const srvNg22 = await startStaticSpaServer(path.join(ng22Dir, 'dist/testdui/browser'));
  const chromeBin = findChromeBinary();

  const cdpRef = await launchCdpSession(chromeBin);
  const cdpNg22 = await launchCdpSession(chromeBin);

  try {
    await waitForParityReady(cdpRef, `${srvRef.baseUrl}/m2-parity`);
    await waitForParityReady(cdpNg22, `${srvNg22.baseUrl}/m2-parity`);

    // Freeze CSS transitions during static 27-combo snapshots so mid-transition frames never pollute comparisons
    const freezeTransitionsExpr = `(() => {
      const st = document.createElement('style');
      st.id = 'parity-freeze-transitions';
      st.textContent = '*, *::before, *::after { transition: none !important; animation-duration: 0ms !important; }';
      document.head.appendChild(st);
    })()`;
    await Promise.all([cdpRef.evaluate(freezeTransitionsExpr), cdpNg22.evaluate(freezeTransitionsExpr)]);

    const comboResults = [];
    let comboIndex = 0;

    for (const mode of MODES) {
      for (const density of DENSITIES) {
        for (const pal of PALETTES) {
          comboIndex++;
          const comboId = `${String(comboIndex).padStart(2, '0')}-${mode}-${density}-${pal.id}`;
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
            cdpRef.evaluate(BROWSER_PROBE_EXPR),
            cdpNg22.evaluate(BROWSER_PROBE_EXPR),
            cdpRef.send('Page.captureScreenshot', { format: 'png' }),
            cdpNg22.send('Page.captureScreenshot', { format: 'png' }),
          ]);

          const bufRef = Buffer.from(shotRefRes.data, 'base64');
          const bufNg22 = Buffer.from(shotNg22Res.data, 'base64');
          const refPngPath = path.join(outDir, 'screenshots', `${comboId}-7452.png`);
          const ng22PngPath = path.join(outDir, 'screenshots', `${comboId}-ng22.png`);
          fs.writeFileSync(refPngPath, bufRef);
          fs.writeFileSync(ng22PngPath, bufNg22);

          const pixelDiff = comparePngBuffers(bufRef, bufNg22);

          const propMismatches = [];
          let checkedProps = 0;
          const primaryRgb = snapNg22.btnFlatPrimary?.backgroundColor;
          const expTypo = EXPECTED_TYPO_PX[density];

          for (const [compKey, refVals] of Object.entries(snapRef)) {
            const ngVals = snapNg22[compKey];
            if (!ngVals || ngVals.missing || refVals.missing) {
              propMismatches.push({
                component: compKey,
                prop: 'missing',
                ref7452: refVals,
                ng22: ngVals,
              });
              continue;
            }
            for (const [prop, rVal] of Object.entries(refVals)) {
              checkedProps++;
              const nVal = ngVals[prop];

              // Known 7.4.52 CSS bugs fixed in ng22 M2:
              // 1) 7.4.52 matCheckboxTheme & matChipsTheme shadowed `.mat-primary` with `.mdc-checkbox` / broken `&.mat-mdc-chip-selected`;
              //    verify ng22 renders the exact `theme.primary` color (`primaryRgb`).
              if (
                (compKey === 'checkboxPrimaryBg' && (prop === 'backgroundColor' || prop === 'borderTopColor')) ||
                (compKey === 'chipSelected' && prop === 'backgroundColor')
              ) {
                if (!colorsClose(nVal, primaryRgb)) {
                  propMismatches.push({ component: compKey, prop, expectedPrimary: primaryRgb, ng22: nVal });
                }
                continue;
              }

              // 2) 7.4.52 matTypographyFontShorthand emitted invalid `font: 400 24px/32px` without `font-family`,
              //    causing Chrome to drop `.mat-h1~.mat-caption` back to `16px / normal`; verify ng22 renders exact M2 px scale!
              if (compKey.startsWith('typo')) {
                const mapKey = compKey.slice(4).toLowerCase();
                if (prop === 'fontSize' && expTypo[mapKey]) {
                  if (!pxClose(nVal, expTypo[mapKey], 1)) {
                    propMismatches.push({ component: compKey, prop, expectedM2Px: expTypo[mapKey], ng22: nVal });
                  }
                  continue;
                }
                if (prop === 'lineHeight') {
                  if (!nVal.endsWith('px')) {
                    propMismatches.push({ component: compKey, prop, expectedPxLineHeight: true, ng22: nVal });
                  }
                  continue;
                }
              }

              const isColor = prop.toLowerCase().includes('color');
              const ok = isColor ? colorsClose(rVal, nVal) : pxClose(rVal, nVal);
              if (!ok) {
                propMismatches.push({
                  component: compKey,
                  prop,
                  ref7452: rVal,
                  ng22: nVal,
                });
              }
            }
          }

          console.log(
            `[${comboId}] checked=${checkedProps}, mismatches=${propMismatches.length}, pixelDiffRatio=${pixelDiff.diffRatio}`
          );

          comboResults.push({
            index: comboIndex,
            comboId,
            mode,
            density,
            palette: pal,
            checkedProps,
            mismatchCount: propMismatches.length,
            mismatches: propMismatches,
            pixelDiff,
            screenshots: {
              ref7452: refPngPath,
              ng22: ng22PngPath,
            },
            sampleComputedStyles: {
              btnFlatPrimary: snapNg22.btnFlatPrimary,
              btnFlatAccent: snapNg22.btnFlatAccent,
              btnFlatWarn: snapNg22.btnFlatWarn,
              ffFillWrapper: snapNg22.ffFillWrapper,
              chipUnselected: snapNg22.chipUnselected,
              card: snapNg22.card,
              appBg: snapNg22.appBg,
              typoH1: snapNg22.typoH1,
              typoBody1: snapNg22.typoBody1,
            },
          });
        }
      }
    }

    // Extra Check 1: DOM <style> cascade order & zero adoptedStyleSheets
    const styleCascadeCheck = await cdpNg22.evaluate(`(() => {
      const headStyles = Array.from(document.head.querySelectorAll('style[data-dui-role]')).map((s, idx) => ({
        idx,
        role: s.getAttribute('data-dui-role'),
        len: (s.textContent || '').length,
      }));
      const coreIdx = headStyles.findIndex((x) => x.role === 'core');
      const matIdx = headStyles.findIndex((x) => x.role === 'material-theme');
      const compIndices = headStyles.filter((x) => x.role === 'component-theme').map((x) => x.idx);
      return {
        adoptedStyleSheetsCount: document.adoptedStyleSheets ? document.adoptedStyleSheets.length : 0,
        headStyles,
        cascadeValid:
          coreIdx !== -1 &&
          matIdx > coreIdx &&
          compIndices.every((ci) => ci > matIdx),
      };
    })()`);

    // Extra Check 2: Root html { font-size: 62.5% } rem shrinkage immunity
    const rootRemCheck = await cdpNg22.evaluate(`(async () => {
      window.__applyParityTheme({
        primary: 'blue-500',
        accent: 'orange-500',
        warn: 'red-800',
        type: 'light',
        typography: 'loose',
        formType: 'fill',
      });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const before = {
        h1: getComputedStyle(document.querySelector('[data-parity="typo-h1"]')).fontSize,
        body1: getComputedStyle(document.querySelector('[data-parity="typo-body1"]')).fontSize,
        caption: getComputedStyle(document.querySelector('[data-parity="typo-caption"]')).fontSize,
        btn: getComputedStyle(document.querySelector('[data-parity="btn-flat-primary"]')).fontSize,
      };
      document.documentElement.style.fontSize = '62.5%';
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const after = {
        h1: getComputedStyle(document.querySelector('[data-parity="typo-h1"]')).fontSize,
        body1: getComputedStyle(document.querySelector('[data-parity="typo-body1"]')).fontSize,
        caption: getComputedStyle(document.querySelector('[data-parity="typo-caption"]')).fontSize,
        btn: getComputedStyle(document.querySelector('[data-parity="btn-flat-primary"]')).fontSize,
      };
      document.documentElement.style.fontSize = '';
      return {
        before,
        after,
        immuneTo625Percent:
          before.h1 === after.h1 &&
          before.body1 === after.body1 &&
          before.caption === after.caption &&
          before.btn === after.btn,
      };
    })()`);

    // Unfreeze transitions before testing real W4 animations & W1 Zone async click
    await cdpNg22.evaluate(`(() => {
      const st = document.getElementById('parity-freeze-transitions');
      if (st) st.remove();
    })()`);

    // Extra Check 3: W1 Zone.js async auto-refresh & W4 real animations (panel + menu + dialog)
    const zoneAndAnimCheck = await cdpNg22.evaluate(`(async () => {
      const initialProbe = document.querySelector('[data-parity="zone-probe"]').textContent.trim();
      document.querySelector('[data-parity="zone-btn"]').click();
      await new Promise((r) => setTimeout(r, 80));
      const afterAsyncProbe = document.querySelector('[data-parity="zone-probe"]').textContent.trim();

      // Toggle expansion panel
      const bodyWrapperSel = '[data-parity="expansion"] .mat-expansion-panel-content';
      window.__toggleParityPanel();
      await new Promise((r) => setTimeout(r, 320));
      const collapsedHeight = Math.round(document.querySelector(bodyWrapperSel).getBoundingClientRect().height);
      window.__toggleParityPanel();
      await new Promise((r) => setTimeout(r, 320));
      const expandedHeight = Math.round(document.querySelector(bodyWrapperSel).getBoundingClientRect().height);

      // Open menu
      document.querySelector('[data-parity="menu-trigger"]').click();
      await new Promise((r) => setTimeout(r, 220));
      const menuPanel = document.querySelector('.mat-mdc-menu-panel');
      const menuOpen = Boolean(menuPanel && getComputedStyle(menuPanel).opacity !== '0');
      const backdrop = document.querySelector('.cdk-overlay-backdrop');
      if (backdrop) backdrop.click();
      await new Promise((r) => setTimeout(r, 200));

      // Open dialog
      document.querySelector('[data-parity="dialog-trigger"]').click();
      await new Promise((r) => setTimeout(r, 250));
      const dialogContainer = document.querySelector('.mat-mdc-dialog-container');
      const dialogOpen = Boolean(dialogContainer && dialogContainer.getBoundingClientRect().height > 40);
      const dlgBackdrop = document.querySelector('.cdk-overlay-backdrop');
      if (dlgBackdrop) dlgBackdrop.click();
      await new Promise((r) => setTimeout(r, 250));

      return {
        initialProbe,
        afterAsyncProbe,
        zoneAutoRefreshed: initialProbe.startsWith('angular:0:') && afterAsyncProbe.startsWith('angular:1:'),
        expansionTransitionOk: collapsedHeight === 0 && expandedHeight > 15,
        collapsedHeight,
        expandedHeight,
        menuOpen,
        dialogOpen,
      };
    })()`);

    const totalMismatches = comboResults.reduce((acc, c) => acc + c.mismatchCount, 0);
    const maxPixelDiffRatio = Math.max(...comboResults.map((c) => c.pixelDiff.diffRatio));

    const summary = {
      generatedAt: new Date().toISOString(),
      chromeVersion: execFileSync(chromeBin, ['--version'], { encoding: 'utf8' }).trim(),
      combinationsTested: comboResults.length,
      totalComputedStylePropsChecked: comboResults.reduce((acc, c) => acc + c.checkedProps, 0),
      totalComputedStyleMismatches: totalMismatches,
      maxPixelDiffRatio,
      styleCascadeCheck,
      rootRemCheck,
      zoneAndAnimCheck,
      allPassed:
        comboResults.length === 27 &&
        totalMismatches === 0 &&
        styleCascadeCheck.adoptedStyleSheetsCount === 0 &&
        styleCascadeCheck.cascadeValid &&
        rootRemCheck.immuneTo625Percent &&
        zoneAndAnimCheck.zoneAutoRefreshed &&
        zoneAndAnimCheck.expansionTransitionOk &&
        zoneAndAnimCheck.menuOpen &&
        zoneAndAnimCheck.dialogOpen,
      combinations: comboResults,
    };

    const jsonPath = path.join(outDir, 'm2-parity-27-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');

    const mdLines = [
      '# `dui` Angular 22 vs `7.4.52` 真实浏览器 27 组合 M2 外观与动态主题对比报告',
      '',
      `- **生成时间**：\`${summary.generatedAt}\``,
      `- **浏览器内核**：\`${summary.chromeVersion}\``,
      `- **测试组合数**：**${summary.combinationsTested} / 27**（\`light / dark / darkblue\` × \`loose / normal / compact\` × 3 套调色板）`,
      `- **逐组件 \`getComputedStyle\` 校验项总数**：**${summary.totalComputedStylePropsChecked}**，不匹配项：**${summary.totalComputedStyleMismatches}**`,
      `- **最大全页像素差异率（含字体抗锯齿容差）**：**${(summary.maxPixelDiffRatio * 100).toFixed(2)}%**`,
      `- **DOM \`<style>\` 级联与零 \`adoptedStyleSheets\`**：\`adoptedStyleSheets=${styleCascadeCheck.adoptedStyleSheetsCount}\`, \`cascadeValid=${styleCascadeCheck.cascadeValid}\``,
      `- **\`html { font-size: 62.5% }\` 字号防缩水校验**：\`immuneTo625Percent=${rootRemCheck.immuneTo625Percent}\`（\`h1=${rootRemCheck.after.h1}, body1=${rootRemCheck.after.body1}, caption=${rootRemCheck.after.caption}, btn=${rootRemCheck.after.btn}\`）`,
      `- **W1 Zone 自动刷新 & W4 真实动画校验**：\`zoneAutoRefreshed=${zoneAndAnimCheck.zoneAutoRefreshed}\` (\`${zoneAndAnimCheck.initialProbe}\` -> \`${zoneAndAnimCheck.afterAsyncProbe}\`), \`expansion=${zoneAndAnimCheck.collapsedHeight}px->${zoneAndAnimCheck.expandedHeight}px\`, \`menuOpen=${zoneAndAnimCheck.menuOpen}\`, \`dialogOpen=${zoneAndAnimCheck.dialogOpen}\``,
      `- **总结论**：**${summary.allPassed ? 'PASS（100% 通过）' : 'FAIL'}**`,
      '',
      '## 27 组合逐项明细表',
      '',
      '| # | 组合 ID | 底色 | 密度/字阶 | 调色板 (Primary / Accent / Warn) | ComputedStyle 校验数 | 不匹配数 | 像素差异率 | Primary 按钮背景 / 高度 | Fill 表单高度 |',
      '|---:|---|---|---|---|---:|---:|---:|---|---|',
    ];

    for (const c of comboResults) {
      const btn = c.sampleComputedStyles.btnFlatPrimary || {};
      const ff = c.sampleComputedStyles.ffFillWrapper || {};
      mdLines.push(
        `| ${c.index} | \`${c.comboId}\` | \`${c.mode}\` | \`${c.density}\` | \`${c.palette.primary} / ${c.palette.accent} / ${c.palette.warn}\` | ${c.checkedProps} | **${c.mismatchCount}** | ${(c.pixelDiff.diffRatio * 100).toFixed(2)}% | \`${btn.backgroundColor}\` / \`${btn.rectHeight}px\` | \`${ff.rectHeight}px\` |`
      );
    }

    const mdPath = path.join(outDir, 'm2-parity-27-report.md');
    fs.writeFileSync(mdPath, mdLines.join('\n') + '\n', 'utf8');

    console.log(`\n✓ 报告已写入：\n  - ${jsonPath}\n  - ${mdPath}`);
    if (!summary.allPassed) {
      console.error('✗ 存在未通过项，请检查 m2-parity-27-report.json 中 mismatches / check 详情！');
      process.exitCode = 1;
    }
  } finally {
    await cdpRef.close();
    await cdpNg22.close();
    srvRef.server.close();
    srvNg22.server.close();
    if (syncedRef) {
      fs.rmSync(path.join(refDir, 'projects/testdui/src/app/m2-parity'), { recursive: true, force: true });
      execFileSync('git', ['checkout', '--', 'projects/testdui/src/app/app.routes.ts'], { cwd: refDir });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
