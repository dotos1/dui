/**
 * @fileoverview Module `src/micro-app/micro-app.component.ts` providing multi-framework micro-frontend bridge `<dui-micro-app>`.
 * @zh 模块文件 `src/micro-app/micro-app.component.ts`，提供多框架微前端桥接容器组件 `DuiMicroAppComponent`（`<dui-micro-app>`）。
 */

import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  InputSignal,
  OnDestroy,
  OutputEmitterRef,
  Type,
  createComponent,
  effect,
  inject,
  input,
  output,
  reflectComponentType,
} from '@angular/core';
import { computeM3SystemVariables, ResolvedTheme, ThemeService } from '@dotos/dui/theme';
import { DuiMicroAppEventBus } from './micro-app-event-bus.service';
import {
  DuiMicroAppColorScheme,
  DuiMicroAppContext,
  DuiMicroAppDensity,
  DuiMicroAppEsmDescriptor,
  DuiMicroAppLifecycleModule,
  DuiMicroAppNativeFederationDescriptor,
  DuiMicroAppRemoteDescriptor,
  DuiMicroAppWebpackMfDescriptor,
} from './micro-app.types';

/**
 * Host version constant injected into `DuiMicroAppContext.hostVersion`.
 * @zh 注入到 `DuiMicroAppContext.hostVersion` 的宿主 `@dotos/dui` 版本常量。
 */
export const DUI_MICRO_APP_HOST_VERSION = '8.0.0-next.2';

const INITIAL_EMPTY_PROPS: Record<string, unknown> = {};
const DEFAULT_FALLBACK_THEME_VARS: Readonly<Record<string, string>> = computeM3SystemVariables(
  '#00897b',
  '#ef6c00',
  '#c62828',
  'light',
);

interface WebpackMfContainer {
  init(shareScope: Record<string, unknown>): void | Promise<void>;
  get(modulePath: string): Promise<() => unknown>;
}

interface MountedInstanceHandle {
  readonly mountElement: HTMLElement;
  readonly lifecycle?: DuiMicroAppLifecycleModule;
  readonly cleanupFn?: () => void;
  readonly componentRef?: ComponentRef<unknown>;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDirectLifecycleModule(value: unknown): value is DuiMicroAppLifecycleModule {
  return isPlainRecord(value) && typeof value['mount'] === 'function';
}

function isLifecycleModule(value: unknown): value is DuiMicroAppLifecycleModule {
  if (isDirectLifecycleModule(value)) {
    return true;
  }
  return isPlainRecord(value) && isDirectLifecycleModule(value['default']);
}

function unwrapLifecycleModule(value: unknown): DuiMicroAppLifecycleModule | null {
  if (isDirectLifecycleModule(value)) {
    return value;
  }
  if (isPlainRecord(value) && isDirectLifecycleModule(value['default'])) {
    return value['default'];
  }
  return null;
}

function isAngularComponentType(candidate: unknown): candidate is Type<unknown> {
  if (typeof candidate !== 'function') {
    return false;
  }
  return Reflect.has(candidate, 'ɵcmp') && Boolean(Reflect.get(candidate, 'ɵcmp'));
}

function isWebpackMfContainer(value: unknown): value is WebpackMfContainer {
  return isPlainRecord(value) && typeof value['get'] === 'function';
}

function extractAngularComponent(
  mod: unknown,
  exportName?: string,
): Type<unknown> | null {
  if (isAngularComponentType(mod)) {
    return mod;
  }
  if (!isPlainRecord(mod)) {
    return null;
  }
  if (exportName && isAngularComponentType(mod[exportName])) {
    return mod[exportName] as Type<unknown>;
  }
  if (isAngularComponentType(mod['component'])) {
    return mod['component'] as Type<unknown>;
  }
  if (isAngularComponentType(mod['default'])) {
    return mod['default'] as Type<unknown>;
  }
  for (const key of Object.keys(mod)) {
    const exported: unknown = mod[key];
    if (isAngularComponentType(exported)) {
      return exported;
    }
  }
  return null;
}

function mapResolvedDensity(theme: ResolvedTheme | null): DuiMicroAppDensity {
  if (!theme) {
    return 'compact';
  }
  if (theme.typography === 'loose') {
    return 'loose';
  }
  if (theme.typography === 'normal' || theme.density === -1) {
    return 'normal';
  }
  if (theme.density === 0 && theme.typography !== 'compact') {
    return 'loose';
  }
  return 'compact';
}

async function importDynamicUrl(url: string): Promise<unknown> {
  const loaded: unknown = await import(/* @vite-ignore */ url);
  return loaded;
}

function loadScriptOnce(url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error(`Cannot load script "${url}" outside browser environment.`));
      return;
    }
    const existing = document.querySelector(`script[data-dui-mf-url="${url}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-dui-mf-url', url);
    script.onload = (): void => resolve();
    script.onerror = (): void =>
      reject(new Error(`Failed to load Webpack Module Federation entry: ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Multi-framework micro-frontend bridge container `<dui-micro-app>`.
 * Supports `'esm-mount'` (React 18/19, Vue 3, cross-major Angular), `'native-federation'` (Import Maps / `remoteEntry.json`),
 * and `'webpack-mf'` (`remoteEntry.js`), while synchronizing M3 `--mat-sys-*` & `--dui-*` CSS tokens and `DuiMicroAppEventBus`.
 * @zh 多框架微前端桥接容器组件 `<dui-micro-app>`，支持 `'esm-mount'`、`'native-federation'` 与 `'webpack-mf'` 三种挂载协议，
 * 自动同步 M3 主题 CSS 变量（支持 Shadow DOM 穿透）与跨框架事件总线。
 */
@Component({
  selector: 'dui-micro-app',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
        min-height: 0;
        box-sizing: border-box;
      }
    `,
  ],
})
export class DuiMicroAppComponent implements OnDestroy {
  /**
   * Required remote micro-app descriptor configuring protocol and entry/loader.
   * @zh 必填远程微应用挂载协议描述符。
   */
  public readonly remote: InputSignal<DuiMicroAppRemoteDescriptor> =
    input.required<DuiMicroAppRemoteDescriptor>();

  /**
   * Business properties forwarded to the mounted micro-application.
   * @zh 传递给远程微应用的业务属性对象。
   */
  public readonly props: InputSignal<Record<string, unknown>> =
    input<Record<string, unknown>>(INITIAL_EMPTY_PROPS);

  /**
   * Optional bearer token synchronized into `DuiMicroAppContext.authToken`.
   * @zh 同步注入至微应用上下文的认证令牌。
   */
  public readonly authToken: InputSignal<string | null> = input<string | null>(null);

  /**
   * Active locale identifier synchronized into `DuiMicroAppContext.locale` (default `'zh_CN'`).
   * @zh 同步注入至微应用上下文的语言区域标识（默认 `'zh_CN'`）。
   */
  public readonly locale: InputSignal<string> = input<string>('zh_CN');

  /**
   * Whether to isolate the micro-application inside an open `ShadowRoot` while penetrating M3 CSS variables.
   * @zh 是否启用 Shadow DOM 样式隔离并将 M3 `--mat-sys-*` / `--dui-*` 变量穿透注入至容器内。
   */
  public readonly useShadowDom: InputSignal<boolean> = input<boolean>(false);

  /**
   * Emits once the remote micro-application finishes mounting.
   * @zh 当远程微应用成功完成挂载后触发。
   */
  public readonly mounted: OutputEmitterRef<void> = output<void>();

  /**
   * Emits if loading or mounting the remote micro-application throws an error.
   * @zh 当远程微应用加载或挂载发生异常时触发。
   */
  public readonly loadError: OutputEmitterRef<unknown> = output<unknown>();

  /**
   * Emits whenever an event is published on `DuiMicroAppEventBus` (including bridged DOM CustomEvents).
   * @zh 当跨框架事件总线收到消息（含外部 React/Vue CustomEvent 桥接消息）时向外转发。
   */
  public readonly microEvent: OutputEmitterRef<{ topic: string; payload: unknown }> = output<{
    topic: string;
    payload: unknown;
  }>();

  private readonly _hostRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _appRef: ApplicationRef = inject(ApplicationRef);
  private readonly _envInjector: EnvironmentInjector = inject(EnvironmentInjector);
  private readonly _eventBus: DuiMicroAppEventBus = inject(DuiMicroAppEventBus);
  private readonly _themeService: ThemeService | null = inject(ThemeService, { optional: true });

  private _activeHandle: MountedInstanceHandle | null = null;
  private _activeDescriptor: DuiMicroAppRemoteDescriptor | null = null;
  private _activeShadowFlag = false;
  private _mountGeneration = 0;
  private _destroyed = false;
  private readonly _unsubscribeBus: () => void;

  /**
   * Initializes reactive `effect()` bindings for remote mounting, M3 theme token synchronization, and context updates.
   * @zh 初始化微应用挂载、M3 主题变量同步与上下文响应式更新的 `effect()` 管道。
   */
  constructor() {
    this._unsubscribeBus = this._eventBus.onAny((evt: { topic: string; payload: unknown }): void => {
      if (!this._destroyed) {
        this.microEvent.emit(evt);
      }
    });

    effect((): void => {
      const descriptor: DuiMicroAppRemoteDescriptor = this.remote();
      const shadowDom: boolean = this.useShadowDom();
      const currentProps: Record<string, unknown> = this.props();
      const currentToken: string | null = this.authToken();
      const currentLocale: string = this.locale();
      const resolvedTheme: ResolvedTheme | null = this._themeService
        ? this._themeService.tokens()
        : null;

      const context: DuiMicroAppContext = this._buildContext(
        resolvedTheme,
        currentProps,
        currentToken,
        currentLocale,
      );

      if (this._activeDescriptor !== descriptor || this._activeShadowFlag !== shadowDom) {
        this._activeDescriptor = descriptor;
        this._activeShadowFlag = shadowDom;
        void this._remount(descriptor, shadowDom, context);
        return;
      }

      if (this._activeHandle) {
        this._applyThemeVariables(this._activeHandle.mountElement, context.themeTokens);
        this._notifyUpdate(this._activeHandle, context);
      }
    });
  }

  /**
   * Unmounts the active remote micro-application and releases event bus subscriptions.
   * @zh 组件销毁时自动执行远程微应用 `unmount` 并释放事件总线监听与容器资源。
   */
  public ngOnDestroy(): void {
    this._destroyed = true;
    this._mountGeneration++;
    this._unsubscribeBus();
    void this._teardownCurrent();
  }

  private _buildContext(
    resolvedTheme: ResolvedTheme | null,
    props: Record<string, unknown>,
    authToken: string | null,
    locale: string,
  ): DuiMicroAppContext {
    const sourceVars: Readonly<Record<string, string>> = resolvedTheme
      ? resolvedTheme.cssVariables
      : DEFAULT_FALLBACK_THEME_VARS;
    const themeTokens: Record<string, string> = {};
    for (const key of Object.keys(sourceVars)) {
      if (key.startsWith('--mat-sys-') || key.startsWith('--dui-')) {
        themeTokens[key] = sourceVars[key];
      }
    }
    const colorScheme: DuiMicroAppColorScheme = resolvedTheme ? resolvedTheme.type : 'light';
    const density: DuiMicroAppDensity = mapResolvedDensity(resolvedTheme);

    return {
      hostVersion: DUI_MICRO_APP_HOST_VERSION,
      themeTokens,
      colorScheme,
      density,
      authToken,
      locale,
      props,
      eventBus: this._eventBus,
    };
  }

  private _prepareMountElement(useShadowDom: boolean): HTMLElement {
    const hostEl: HTMLElement = this._hostRef.nativeElement;
    if (useShadowDom) {
      const shadowRoot: ShadowRoot = hostEl.shadowRoot ?? hostEl.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '';
      const innerContainer: HTMLDivElement = document.createElement('div');
      innerContainer.className = 'dui-micro-app-shadow-Stage';
      innerContainer.style.display = 'block';
      innerContainer.style.width = '100%';
      innerContainer.style.height = '100%';
      shadowRoot.appendChild(innerContainer);
      return innerContainer;
    }

    hostEl.innerHTML = '';
    const stage: HTMLDivElement = document.createElement('div');
    stage.className = 'dui-micro-app-stage';
    stage.style.display = 'block';
    stage.style.width = '100%';
    stage.style.height = '100%';
    hostEl.appendChild(stage);
    return stage;
  }

  private _applyThemeVariables(
    mountElement: HTMLElement,
    themeTokens: Record<string, string>,
  ): void {
    const hostEl: HTMLElement = this._hostRef.nativeElement;
    for (const [varName, varValue] of Object.entries(themeTokens)) {
      hostEl.style.setProperty(varName, varValue);
      mountElement.style.setProperty(varName, varValue);
    }
  }

  private async _remount(
    descriptor: DuiMicroAppRemoteDescriptor,
    useShadowDom: boolean,
    initialContext: DuiMicroAppContext,
  ): Promise<void> {
    const generation = ++this._mountGeneration;
    await this._teardownCurrent();
    if (this._destroyed || generation !== this._mountGeneration) {
      return;
    }

    const mountElement: HTMLElement = this._prepareMountElement(useShadowDom);
    this._applyThemeVariables(mountElement, initialContext.themeTokens);

    try {
      const loadedModule: unknown = await this._resolveRemoteModule(descriptor);
      if (this._destroyed || generation !== this._mountGeneration) {
        return;
      }

      const latestContext: DuiMicroAppContext = this._buildContext(
        this._themeService ? this._themeService.tokens() : null,
        this.props(),
        this.authToken(),
        this.locale(),
      );
      this._applyThemeVariables(mountElement, latestContext.themeTokens);

      const lifecycle: DuiMicroAppLifecycleModule | null = unwrapLifecycleModule(loadedModule);
      if (lifecycle) {
        const maybeCleanup: void | (() => void) = await lifecycle.mount(
          mountElement,
          latestContext,
        );
        if (this._destroyed || generation !== this._mountGeneration) {
          if (typeof maybeCleanup === 'function') {
            maybeCleanup();
          } else if (typeof lifecycle.unmount === 'function') {
            await lifecycle.unmount(mountElement);
          }
          return;
        }
        this._activeHandle = {
          mountElement,
          lifecycle,
          cleanupFn: typeof maybeCleanup === 'function' ? maybeCleanup : undefined,
        };
        this.mounted.emit();
        return;
      }

      const exportName: string | undefined =
        descriptor.protocol === 'native-federation' || descriptor.protocol === 'webpack-mf'
          ? descriptor.exportName
          : undefined;
      const ngComponent: Type<unknown> | null = extractAngularComponent(loadedModule, exportName);
      if (ngComponent) {
        const compRef: ComponentRef<unknown> = createComponent(ngComponent, {
          environmentInjector: this._envInjector,
          hostElement: mountElement,
        });
        this._appRef.attachView(compRef.hostView);
        this._syncAngularComponentInputs(compRef, latestContext);
        compRef.changeDetectorRef.detectChanges();
        this._activeHandle = {
          mountElement,
          componentRef: compRef,
        };
        this.mounted.emit();
        return;
      }

      throw new Error(
        `[dui-micro-app] Remote module (${descriptor.protocol}) neither exports mount(el, context) nor an Angular Standalone Component.`,
      );
    } catch (err: unknown) {
      if (!this._destroyed && generation === this._mountGeneration) {
        this.loadError.emit(err);
      }
    }
  }

  private _notifyUpdate(handle: MountedInstanceHandle, context: DuiMicroAppContext): void {
    if (handle.lifecycle && typeof handle.lifecycle.update === 'function') {
      void handle.lifecycle.update(handle.mountElement, context);
      return;
    }
    if (handle.componentRef) {
      this._syncAngularComponentInputs(handle.componentRef, context);
      handle.componentRef.changeDetectorRef.markForCheck();
    }
  }

  private _syncAngularComponentInputs(
    compRef: ComponentRef<unknown>,
    context: DuiMicroAppContext,
  ): void {
    const instance: unknown = compRef.instance;
    if (!isPlainRecord(instance)) {
      return;
    }
    const mirror = reflectComponentType(compRef.componentType);
    const declaredInputs = new Set<string>(
      (mirror?.inputs ?? []).map((inp) => inp.templateName),
    );
    if (declaredInputs.has('context')) {
      compRef.setInput('context', context);
    } else if ('context' in instance) {
      instance['context'] = context;
    }
    for (const [propKey, propVal] of Object.entries(context.props)) {
      if (declaredInputs.has(propKey)) {
        compRef.setInput(propKey, propVal);
      } else if (propKey in instance) {
        instance[propKey] = propVal;
      }
    }
  }

  private async _teardownCurrent(): Promise<void> {
    const current: MountedInstanceHandle | null = this._activeHandle;
    this._activeHandle = null;
    if (!current) {
      return;
    }
    try {
      if (current.cleanupFn) {
        current.cleanupFn();
      } else if (current.lifecycle && typeof current.lifecycle.unmount === 'function') {
        await current.lifecycle.unmount(current.mountElement);
      }
      if (current.componentRef) {
        this._appRef.detachView(current.componentRef.hostView);
        current.componentRef.destroy();
      }
    } finally {
      current.mountElement.innerHTML = '';
    }
  }

  private async _resolveRemoteModule(descriptor: DuiMicroAppRemoteDescriptor): Promise<unknown> {
    switch (descriptor.protocol) {
      case 'esm-mount':
        return this._loadEsmMount(descriptor);
      case 'native-federation':
        return this._loadNativeFederation(descriptor);
      case 'webpack-mf':
        return this._loadWebpackMf(descriptor);
    }
  }

  private async _loadEsmMount(descriptor: DuiMicroAppEsmDescriptor): Promise<unknown> {
    if (typeof descriptor.loader === 'function') {
      return descriptor.loader();
    }
    if (descriptor.entryUrl) {
      return importDynamicUrl(descriptor.entryUrl);
    }
    throw new Error('[dui-micro-app] "esm-mount" requires either `loader` or `entryUrl`.');
  }

  private async _loadNativeFederation(
    descriptor: DuiMicroAppNativeFederationDescriptor,
  ): Promise<unknown> {
    if (typeof descriptor.loader === 'function') {
      return descriptor.loader();
    }
    if (!descriptor.entryUrl) {
      if (descriptor.exposedModule) {
        return importDynamicUrl(descriptor.exposedModule);
      }
      throw new Error(
        '[dui-micro-app] "native-federation" requires `loader`, `entryUrl`, or Import Map `exposedModule`.',
      );
    }

    if (descriptor.entryUrl.endsWith('.json')) {
      const response: Response = await fetch(descriptor.entryUrl);
      if (!response.ok) {
        throw new Error(
          `[dui-micro-app] Failed to fetch Native Federation manifest "${descriptor.entryUrl}": HTTP ${response.status}`,
        );
      }
      const manifest: unknown = await response.json();
      const resolvedModuleUrl: string = this._resolveNativeFederationModuleUrl(
        descriptor.entryUrl,
        manifest,
        descriptor.exposedModule,
      );
      return importDynamicUrl(resolvedModuleUrl);
    }

    return importDynamicUrl(descriptor.entryUrl);
  }

  private _resolveNativeFederationModuleUrl(
    manifestUrl: string,
    manifest: unknown,
    exposedModule?: string,
  ): string {
    if (!isPlainRecord(manifest)) {
      throw new Error(`[dui-micro-app] Invalid Native Federation manifest at "${manifestUrl}".`);
    }
    const exposes: unknown = manifest['exposes'];
    const targetKey: string = exposedModule ?? './Component';
    if (Array.isArray(exposes)) {
      const exposeItems: ReadonlyArray<unknown> = exposes;
      for (const item of exposeItems) {
        if (
          isPlainRecord(item) &&
          item['key'] === targetKey &&
          typeof item['outFileName'] === 'string'
        ) {
          return new URL(item['outFileName'], manifestUrl).toString();
        }
      }
    } else if (isPlainRecord(exposes) && typeof exposes[targetKey] === 'string') {
      return new URL(exposes[targetKey] as string, manifestUrl).toString();
    }
    throw new Error(
      `[dui-micro-app] Exposed module "${targetKey}" not found in Native Federation manifest "${manifestUrl}".`,
    );
  }

  private async _loadWebpackMf(descriptor: DuiMicroAppWebpackMfDescriptor): Promise<unknown> {
    const globalScope = globalThis as Record<string, unknown>;
    if (!isPlainRecord(globalScope[descriptor.remoteName])) {
      await loadScriptOnce(descriptor.entryUrl);
    }
    const containerCandidate: unknown = globalScope[descriptor.remoteName];
    if (!isWebpackMfContainer(containerCandidate)) {
      throw new Error(
        `[dui-micro-app] Webpack MF container "${descriptor.remoteName}" was not found on window after loading "${descriptor.entryUrl}".`,
      );
    }
    const container: WebpackMfContainer = containerCandidate;
    if (typeof container.init === 'function') {
      const shareScope: Record<string, unknown> = descriptor.shareScope ?? INITIAL_EMPTY_PROPS;
      await container.init(shareScope);
    }
    const factory: () => unknown = await container.get(descriptor.exposedModule);
    if (typeof factory !== 'function') {
      throw new Error(
        `[dui-micro-app] Webpack MF module "${descriptor.exposedModule}" in "${descriptor.remoteName}" did not return a module factory.`,
      );
    }
    return factory();
  }
}

export { isLifecycleModule };
