/**
 * @fileoverview Module `src/micro-app/micro-app.types.ts` defining contracts for multi-framework micro-frontend bridging.
 * @zh 模块文件 `src/micro-app/micro-app.types.ts`，定义多框架微前端桥接容器的类型契约与挂载协议描述符。
 */

import type { Type } from '@angular/core';
import type { DuiMicroAppEventBus } from './micro-app-event-bus.service';

/**
 * Supported M3 color schemes synchronized from host `ThemeService` to mounted micro-apps.
 * @zh 宿主 `ThemeService` 同步至微应用的 M3 色彩方案枚举联合类型。
 */
export type DuiMicroAppColorScheme = 'light' | 'dark' | 'darkblue';

/**
 * Supported UI density tiers synchronized from host `ThemeService` to mounted micro-apps.
 * @zh 宿主 `ThemeService` 同步至微应用的紧凑度档位联合类型。
 */
export type DuiMicroAppDensity = 'compact' | 'normal' | 'loose';

/**
 * Supported remote micro-app loading and mounting protocols.
 * @zh 支持的远程微应用加载与挂载协议类型。
 */
export type DuiMicroAppProtocol = 'esm-mount' | 'native-federation' | 'webpack-mf';

/**
 * Event payload structure emitted on `microEvent` output and DOM `CustomEvent('dui:micro-app-event')`.
 * @zh 微应用跨框架事件载荷结构，用于 `microEvent` 输出与浏览器 `CustomEvent('dui:micro-app-event')` 互通。
 */
export interface DuiMicroAppEventPayload<TPayload = unknown> {
  /**
   * Event topic identifier.
   * @zh 事件主题名称。
   */
  readonly topic: string;
  /**
   * Strongly-typed or unknown event payload data.
   * @zh 事件携带的数据负载。
   */
  readonly payload: TPayload;
  /**
   * Optional origin identifier used to prevent echo loops across DOM CustomEvent bridges.
   * @zh 可选事件源标识，用于防止浏览器 CustomEvent 桥接回环重复触发。
   */
  readonly sourceId?: string;
}

/**
 * Host context injected into remote micro-applications during `mount` and `update` lifecycle hooks.
 * @zh 宿主注入给远程微应用 `mount` 与 `update` 生命周期钩子的上下文契约。
 */
export interface DuiMicroAppContext {
  /**
   * `@dotos/dui` host library version string.
   * @zh 宿主 `@dotos/dui` 版本号。
   */
  readonly hostVersion: string;
  /**
   * Active M3 `--mat-sys-*` and `--dui-*` CSS custom property map.
   * @zh 当前激活的 M3 `--mat-sys-*` 与 `--dui-*` CSS 变量键值映射表。
   */
  readonly themeTokens: Record<string, string>;
  /**
   * Active host color scheme (`'light' | 'dark' | 'darkblue'`).
   * @zh 当前宿主色彩方案（`'light' | 'dark' | 'darkblue'`）。
   */
  readonly colorScheme: DuiMicroAppColorScheme;
  /**
   * Active host UI density tier (`'compact' | 'normal' | 'loose'`).
   * @zh 当前宿主界面密度档位（`'compact' | 'normal' | 'loose'`）。
   */
  readonly density: DuiMicroAppDensity;
  /**
   * Current authentication bearer token (or `null` when anonymous).
   * @zh 当前认证令牌（未登录时为 `null`）。
   */
  readonly authToken: string | null;
  /**
   * Current active locale code (e.g. `'zh_CN'`, `'en_US'`).
   * @zh 当前激活的区域语言代码（例如 `'zh_CN'`、`'en_US'`）。
   */
  readonly locale: string;
  /**
   * Custom business properties passed from `<dui-micro-app [props]="...">`.
   * @zh 从 `<dui-micro-app [props]="...">` 传入的业务属性字典。
   */
  readonly props: Record<string, unknown>;
  /**
   * Shared cross-framework event bus instance.
   * @zh 跨框架共享事件总线实例。
   */
  readonly eventBus: DuiMicroAppEventBus;
}

/**
 * Standard lifecycle module exported by framework-agnostic ESM micro-frontends (React 18/19, Vue 3, cross-major Angular).
 * @zh 跨框架独立 ESM 微应用（React 18/19、Vue 3、跨大版本 Angular）导出的标准生命周期模块契约。
 */
export interface DuiMicroAppLifecycleModule {
  /**
   * Mounts the micro-application into the target DOM element or ShadowRoot.
   * May optionally return a synchronous cleanup function.
   * @zh 将微应用挂载至目标宿主元素或 ShadowRoot，可选返回清理卸载函数。
   */
  mount(
    el: HTMLElement,
    context: DuiMicroAppContext,
  ): void | (() => void) | Promise<void | (() => void)>;
  /**
   * Optional reactive update hook invoked whenever `props`, `locale`, `authToken`, or M3 theme tokens change.
   * @zh 可选更新钩子，当 `props`、`locale`、`authToken` 或 M3 主题变量变化时触发。
   */
  update?(el: HTMLElement, context: DuiMicroAppContext): void | Promise<void>;
  /**
   * Optional teardown hook invoked when `<dui-micro-app>` is destroyed or switched to another remote.
   * @zh 可选卸载钩子，当 `<dui-micro-app>` 销毁或切换远端描述符时调用。
   */
  unmount?(el: HTMLElement): void | Promise<void>;
  /**
   * Optional Angular standalone component class when bridging same-major Angular remotes.
   * @zh 同大版本 Angular 远端可选导出的 Standalone 组件类型。
   */
  component?: Type<unknown>;
}

/**
 * Descriptor for `'esm-mount'` protocol (standalone ESM bundle or custom async loader).
 * @zh `'esm-mount'` 协议远程描述符（支持传入 `entryUrl` 动态 `import()` 或直接传入 `loader`）。
 */
export interface DuiMicroAppEsmDescriptor {
  /**
   * Protocol discriminator `'esm-mount'`.
   * @zh 协议类型字面量 `'esm-mount'`。
   */
  readonly protocol: 'esm-mount';
  /**
   * Optional logical name of the micro-app.
   * @zh 微应用可选逻辑名称。
   */
  readonly name?: string;
  /**
   * Remote ESM entry URL loaded via native `import(/* @vite-ignore *\/ entryUrl)`.
   * @zh 通过原生动态 `import()` 加载的远程 ESM 入口 URL。
   */
  readonly entryUrl?: string;
  /**
   * Direct async module loader function returning a `DuiMicroAppLifecycleModule`.
   * @zh 直接返回微应用生命周期模块的异步加载器函数。
   */
  readonly loader?: () => Promise<DuiMicroAppLifecycleModule>;
}

/**
 * Descriptor for `'native-federation'` protocol (Import Maps / `remoteEntry.json` manifest).
 * @zh `'native-federation'` 协议远程描述符（基于标准 Import Maps 或 `remoteEntry.json` 清单）。
 */
export interface DuiMicroAppNativeFederationDescriptor {
  /**
   * Protocol discriminator `'native-federation'`.
   * @zh 协议类型字面量 `'native-federation'`。
   */
  readonly protocol: 'native-federation';
  /**
   * Optional remote name in Native Federation manifest.
   * @zh Native Federation 清单中的远端名称。
   */
  readonly name?: string;
  /**
   * URL to `remoteEntry.json` manifest (or direct module URL if `exposedModule` is already resolved via Import Maps).
   * @zh `remoteEntry.json` 清单地址（若通过 Import Maps 解析也可直接传入模块地址）。
   */
  readonly entryUrl?: string;
  /**
   * Exposed module key in `remoteEntry.json` (e.g. `'./Component'` or `'./mount'`).
   * @zh `remoteEntry.json` 中暴露的模块键名（如 `'./Component'` 或 `'./mount'`）。
   */
  readonly exposedModule?: string;
  /**
   * Named export of the Angular Standalone Component if not exported as `default` or `mount`.
   * @zh 当远端模块导出具名 Angular Standalone 组件时的导出符号名称。
   */
  readonly exportName?: string;
  /**
   * Optional custom loader override for testing or pre-registered Import Map specifiers.
   * @zh 可选自定义模块加载函数（适用于测试桩或预注册 Import Maps 模块说明符）。
   */
  readonly loader?: () => Promise<Record<string, unknown> | DuiMicroAppLifecycleModule>;
}

/**
 * Descriptor for `'webpack-mf'` legacy protocol (`remoteEntry.js` `window[remoteName].init/get`).
 * @zh `'webpack-mf'` 向后兼容协议描述符（兼容现行 Webpack Module Federation `window[remoteName].init/get`）。
 */
export interface DuiMicroAppWebpackMfDescriptor {
  /**
   * Protocol discriminator `'webpack-mf'`.
   * @zh 协议类型字面量 `'webpack-mf'`。
   */
  readonly protocol: 'webpack-mf';
  /**
   * Global container name registered on `window` (e.g. `'mesRemote'`).
   * @zh 挂载在 `window` 上的 Webpack 远端容器全局变量名。
   */
  readonly remoteName: string;
  /**
   * URL to Webpack `remoteEntry.js` script.
   * @zh Webpack `remoteEntry.js` 脚本地址。
   */
  readonly entryUrl: string;
  /**
   * Exposed module path requested via `container.get(exposedModule)` (e.g. `'./App'`).
   * @zh 通过 `container.get(exposedModule)` 请求的暴露模块路径（如 `'./App'`）。
   */
  readonly exposedModule: string;
  /**
   * Optional export symbol name when exposing an Angular Standalone component.
   * @zh 暴露 Angular Standalone 组件时的可选导出符号名。
   */
  readonly exportName?: string;
  /**
   * Optional Webpack share scope object passed to `container.init(shareScope)`.
   * @zh 传递给 `container.init(shareScope)` 的可选共享作用域对象。
   */
  readonly shareScope?: Record<string, unknown>;
}

/**
 * Discriminated union of all supported remote micro-app descriptors.
 * @zh 支持的全部微前端远程挂载协议描述符联合类型。
 */
export type DuiMicroAppRemoteDescriptor =
  | DuiMicroAppEsmDescriptor
  | DuiMicroAppNativeFederationDescriptor
  | DuiMicroAppWebpackMfDescriptor;
