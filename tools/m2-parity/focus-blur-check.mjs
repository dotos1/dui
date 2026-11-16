#!/usr/bin/env node
/**
 * @fileoverview 真浏览器交互检查：form-card 里点字段 A、再点字段 B 后，A 不能还处于聚焦态。
 * @zh 6.3.0 校核发现的回归（Material 22 的 mat-form-field 只在控件 stateChanges 时刷新 mat-focused，
 * dui 的 MatField 失焦时没发 stateChanges，前一个字段一直高亮）。本脚本用无头 Chrome（CDP）真实鼠标点击，
 * 在 `/focus-check?formType=fill|outline` 宿主页上逐对字段断言：
 *   - B 聚焦后 B 有 `mat-focused` / `mdc-text-field--focused`；
 *   - A 不再有 `mat-focused` / `mdc-text-field--focused`，且 A 的标签颜色与未聚焦时一致；
 *   - 点页面空白处后所有字段都不处于聚焦态。
 *
 * 用法（仓库根目录，先 `npx ng build testdui --configuration development`）：
 *   node tools/m2-parity/focus-blur-check.mjs [--dist dist/testdui/browser] [--out <报告.json>] [--mat-focused-only]
 * 7.4.52（master）对照：把 `projects/testdui/src/app/focus-check` 拷到 master 工作树、改 `@dotos1/` 为 `@dotos/`、
 * 加同名路由并构建，再用 `--dist <master 工作树>/dist/testdui/browser` 运行同一脚本。
 * 退出码：0 通过；1 有断言失败。
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const argVal = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const distDir = path.resolve(argVal('--dist', 'dist/testdui/browser'));
const outFile = argVal('--out', '');
// 7.4.52（Material 18）只有宿主绑定 [class.mat-focused] 随变更检测刷新，内层 mdc-text-field--focused /
// 下划线 / 轮廓线同样靠 stateChanges，本来就会残留；对照 7.4.52 时用本开关只断言 mat-focused。
const matFocusedOnly = args.includes('--mat-focused-only');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function serve(dir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let file = path.join(dir, urlPath === '/' ? 'index.html' : urlPath);
      if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(dir, 'index.html');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}

async function launch() {
  const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) => fs.existsSync(p));
  if (!chrome) throw new Error('未找到 Chrome/Chromium');
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dui-focus-'));
  const proc = spawn(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--window-size=1280,900', '--remote-debugging-port=0', `--user-data-dir=${userDataDir}`, 'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const t = setTimeout(() => reject(new Error('Chrome 启动超时: ' + buf)), 15000);
    proc.stderr.on('data', (c) => {
      buf += c.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(t); resolve(m[1]); }
    });
  });
  const httpBase = wsUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.*$/, '');
  const page = (await fetch(`${httpBase}/json/list`).then((r) => r.json())).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 1;
  const pending = new Map();
  const errors = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(msg.params.exceptionDetails).slice(0, 400));
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(JSON.stringify(msg.params.args).slice(0, 600));
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = id++;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const close = async () => {
    try { ws.close(); } catch { /* 已关闭 */ }
    proc.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 200));
    fs.rmSync(userDataDir, { recursive: true, force: true });
  };
  return { send, evaluate, close, errors };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 页面里执行：采集每个 mat-form-field 的聚焦相关 class 与计算样式。 */
const SNAPSHOT = `(() => [...document.querySelectorAll('[data-focus-check] mat-form-field')].map((ff, i) => {
  const tf = ff.querySelector('.mdc-text-field');
  const label = ff.querySelector('.mdc-floating-label, mat-label');
  const outline = ff.querySelector('.mdc-notched-outline__leading');
  const ripple = ff.querySelector('.mdc-line-ripple');
  const cs = (el, p) => el ? getComputedStyle(el).getPropertyValue(p) : null;
  return {
    i,
    name: (ff.querySelector('input, mat-select') || {}).getAttribute?.('id') || ('#' + i),
    appearance: ff.classList.contains('mat-form-field-appearance-outline') ? 'outline' : 'fill',
    matFocused: ff.classList.contains('mat-focused'),
    mdcFocused: !!tf && tf.classList.contains('mdc-text-field--focused'),
    containsActive: ff.contains(document.activeElement),
    labelColor: cs(label, 'color'),
    outlineColor: cs(outline, 'border-top-color'),
    outlineWidth: cs(outline, 'border-top-width'),
    rippleAfterOpacity: ripple ? getComputedStyle(ripple, '::after').opacity : null,
    textFieldBg: cs(tf, 'background-color'),
  };
}))()`;

async function clickCenter(cdp, expr) {
  const rect = await cdp.evaluate(`(() => { const el = ${expr}; if (!el) return null; el.scrollIntoView({block:'center'}); const r = el.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()`);
  if (!rect) throw new Error('找不到点击目标: ' + expr);
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', { type, x: rect.x, y: rect.y, button: 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
  }
  await sleep(350);
}

async function runFormType(cdp, base, formType) {
  await cdp.send('Page.navigate', { url: `${base}/focus-check?formType=${formType}` });
  const deadline = Date.now() + 20000;
  let count = 0;
  while (Date.now() < deadline) {
    count = await cdp.evaluate(`document.querySelectorAll('[data-focus-check] mat-form-field').length`).catch(() => 0);
    if (count >= 4) break;
    await sleep(250);
  }
  if (count < 4) {
    const html = await cdp.evaluate(`(document.querySelector("router-outlet")?.parentElement?.innerHTML || "").slice(0, 3000) + " | url=" + location.href`).catch(() => '');
    throw new Error(`[${formType}] 页面没渲染出表单字段（找到 ${count} 个 mat-form-field）\n页面错误: ${cdp.errors.join('\n')}\n页面: ${html}`);
  }
  await sleep(800);
  const idle = await cdp.evaluate(SNAPSHOT);
  const failures = [];
  const steps = [];
  // 只点文本 / 数字输入（前 4 个字段），与 menu 页「点 A 再点 B」一致。
  const inputs = idle.slice(0, 4).map((f) => f.i);
  const pairs = [];
  for (let k = 0; k + 1 < inputs.length; k++) pairs.push([inputs[k], inputs[k + 1]]);
  pairs.push([inputs[inputs.length - 1], inputs[0]]);
  for (const [a, b] of pairs) {
    const sel = (i) => `document.querySelectorAll('[data-focus-check] mat-form-field')[${i}].querySelector('input')`;
    await clickCenter(cdp, sel(a));
    const afterA = await cdp.evaluate(SNAPSHOT);
    await clickCenter(cdp, sel(b));
    const afterB = await cdp.evaluate(SNAPSHOT);
    const A = afterB[a];
    const B = afterB[b];
    const step = { formType, a, b, afterA: afterA[a], A, B, idleA: idle[a] };
    steps.push(step);
    if (A.appearance !== formType) failures.push(`[${formType}] 外观没切到 ${formType}（实际 ${A.appearance}）`);
    if (!afterA[a].matFocused) failures.push(`[${formType}] 点字段 ${a} 后它没进入聚焦态`);
    if (!B.matFocused || !B.mdcFocused) failures.push(`[${formType}] 点字段 ${b} 后它没进入聚焦态`);
    if (matFocusedOnly) {
      if (A.matFocused) failures.push(`[${formType}] 点字段 ${b} 后，字段 ${a} 仍保留 mat-focused`);
      continue;
    }
    if (A.matFocused || A.mdcFocused) failures.push(`[${formType}] 点字段 ${b} 后，字段 ${a} 仍保留聚焦 class（mat-focused=${A.matFocused}, mdc-text-field--focused=${A.mdcFocused}）`);
    if (A.labelColor !== idle[a].labelColor && afterB[a].labelColor === afterA[a].labelColor && afterA[a].labelColor !== idle[a].labelColor) {
      failures.push(`[${formType}] 字段 ${a} 失焦后标签颜色仍是聚焦色 ${A.labelColor}（未聚焦 ${idle[a].labelColor}）`);
    }
    if (formType === 'outline' && A.outlineWidth !== idle[a].outlineWidth) {
      failures.push(`[${formType}] 字段 ${a} 失焦后轮廓线宽 ${A.outlineWidth}，未聚焦应为 ${idle[a].outlineWidth}`);
    }
    if (formType === 'fill' && A.rippleAfterOpacity !== idle[a].rippleAfterOpacity) {
      failures.push(`[${formType}] 字段 ${a} 失焦后下划线高亮 opacity=${A.rippleAfterOpacity}，未聚焦应为 ${idle[a].rippleAfterOpacity}`);
    }
  }
  // 点空白处：全部失焦。
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 1270, y: 890, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 1270, y: 890, button: 'left', clickCount: 1 });
  await cdp.evaluate(`document.activeElement && document.activeElement.blur && document.activeElement.blur()`);
  await sleep(350);
  const end = await cdp.evaluate(SNAPSHOT);
  end.forEach((f) => {
    if (f.matFocused || (!matFocusedOnly && f.mdcFocused)) failures.push(`[${formType}] 全部失焦后字段 ${f.i} 仍处于聚焦态`);
  });
  return { failures, steps, idle, end };
}

const { server, base } = await serve(distDir);
const cdp = await launch();
const report = { distDir, results: {} };
let failures = [];
try {
  for (const formType of ['fill', 'outline']) {
    const r = await runFormType(cdp, base, formType);
    report.results[formType] = r;
    failures = failures.concat(r.failures);
  }
} finally {
  await cdp.close();
  server.close();
}
report.failures = failures;
report.pageErrors = cdp.errors;
if (outFile) fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
for (const ft of Object.keys(report.results)) {
  const s = report.results[ft].steps[0];
  console.log(`[${ft}] 点 ${s.a} 再点 ${s.b}：A mat-focused=${s.A.matFocused} mdc--focused=${s.A.mdcFocused} 标签色=${s.A.labelColor}（未聚焦 ${s.idleA.labelColor}）；B mat-focused=${s.B.matFocused}`);
}
if (failures.length) {
  console.log(`失败 ${failures.length} 条：`);
  failures.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
console.log(`通过：字段失焦后不再处于聚焦态（fill / outline${matFocusedOnly ? '，仅断言 mat-focused' : ''}）`);
