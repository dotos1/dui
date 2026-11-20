/**
 * @fileoverview Shared AMD loader bootstrap for Monaco, coordinated through a page-wide key.
 * @zh 模块文件 `src/ux/code-editor/monaco-amd-loader.ts`：页面级共用的 Monaco AMD 加载器引导。
 */

/** Monaco 的 AMD 加载器（`vs/loader.js` 挂到 window 上的 `require`）的最小形状。 */
export interface MonacoAmdRequire {
  (deps: string[], cb: () => void): void;
  config(c: unknown): void;
}

/**
 * 页面级共享键。dui 的 td-code-editor 和 duix 的 Monaco 组件都通过它协调：谁先需要加载器谁注入一次
 * `loader.js` 并配 `vs` 路径，后来的直接等同一个 Promise。原来两边各自在「没有 window.require」时注入，
 * 同一页同时有两种编辑器时第二次执行报 `Identifier '_amdLoaderGlobal' has already been declared`。
 * duix 侧按同一键名实现同一协议（不依赖本函数，避免要求 dui 的最低版本）。
 */
export const MONACO_AMD_LOADER_KEY = '__dotosMonacoAmdLoader';

/** Monaco 资源的缺省位置，与 duix 的 MonacoEditorModule 缺省（`./assets/monaco/min/vs`）一致。 */
export const DEFAULT_MONACO_VS_PATH = 'assets/monaco/min/vs';

/**
 * 确保页面上有 Monaco 的 AMD 加载器。已有（任何来源）就直接用；否则注入一次 `<vsPath>/loader.js` 并配置 `vs` 路径。
 * @zh 确保页面上有且只有一个 Monaco AMD 加载器。
 * @param vsPath - Monaco `vs` 目录的地址 / Monaco `vs` 目录的地址
 * @returns 加载器（`window.require`）
 */
export function ensureMonacoAmdLoader(vsPath: string = DEFAULT_MONACO_VS_PATH): Promise<MonacoAmdRequire> {
  const pending: unknown = Reflect.get(globalThis, MONACO_AMD_LOADER_KEY);
  if (pending instanceof Promise) {
    return pending;
  }
  const existing: unknown = Reflect.get(globalThis, 'require');
  let p: Promise<MonacoAmdRequire>;
  if (isAmdRequire(existing)) {
    p = Promise.resolve(existing);
  } else {
    const path = vsPath.replace(/\/+$/, '');
    p = new Promise<MonacoAmdRequire>((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `${path}/loader.js`;
      s.addEventListener('load', () => {
        const req: unknown = Reflect.get(globalThis, 'require');
        if (!isAmdRequire(req)) {
          reject(new Error(`Monaco loader did not define require: ${s.src}`));
          return;
        }
        req.config({ paths: { vs: path } });
        resolve(req);
      });
      s.addEventListener('error', () => {
        Reflect.deleteProperty(globalThis, MONACO_AMD_LOADER_KEY);
        reject(new Error(`Monaco loader not found: ${s.src}`));
      });
      document.body.appendChild(s);
    });
  }
  Reflect.set(globalThis, MONACO_AMD_LOADER_KEY, p);
  return p;
}

function isAmdRequire(v: unknown): v is MonacoAmdRequire {
  return typeof v === 'function' && typeof Reflect.get(v, 'config') === 'function';
}
