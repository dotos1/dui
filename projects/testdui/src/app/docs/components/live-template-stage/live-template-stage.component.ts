/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-template-stage/live-template-stage.component.ts` providing an in-place runtime template compiler stage.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-template-stage/live-template-stage.component.ts`，提供原位实时编译渲染 Angular 模板的沙箱舞台组件。
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
  ɵcompileComponent,
} from '@angular/core';

import { liveSandboxRuntimeImports } from './live-sandbox.runtime-scope';
import {
  JsonObject,
  LiveCompilePhase,
  LiveCompileStatus,
  LiveStageEvent,
  parseJsonObject,
} from './live-sandbox.types';

/**
 * Type alias `LiveLogFn` for the `log(label, payload?)` callback exposed to sandbox templates.
 * @zh 类型别名 `LiveLogFn`，沙箱模板中可调用的 `log(label, payload?)` 回调签名。
 */
export type LiveLogFn = (label: string, payload?: unknown) => void;

/**
 * Interface `LiveSandboxHost` describing the context object of runtime-compiled templates.
 * @zh 接口 `LiveSandboxHost`，运行时编译模板的上下文（模板中可直接访问 `state` 与 `log()`）。
 */
export interface LiveSandboxHost {
  /**
   * Parsed state JSON.
   * @zh 解析自状态 JSON 的数据。
   */
  state: JsonObject;
  /**
   * Event logger flowing back to the page console.
   * @zh 事件回流函数，写入页面右侧事件控制台。
   */
  log: LiveLogFn;
}

/**
 * Compiles a fresh standalone component type for the given template.
 * @zh 为给定模板编译一个全新的独立组件类型（每次编译都新建 class，避免 ɵcmp 缓存）。
 * @param template - Angular template source / Angular 模板源码
 * @returns Component type / 组件类型
 */
function buildSandboxComponent(template: string): Type<LiveSandboxHost> {
  class LiveSandboxRuntimeHost implements LiveSandboxHost {
    state: JsonObject = {};
    log: LiveLogFn = () => undefined;
  }
  // 不走 @Input：生产构建（ngDevMode=false）不执行 ɵsetClassMetadata，装饰器输入元数据会丢失；
  // 这里直接给实例属性赋值，开发 / 生产两种构建行为一致。ɵcmp 为惰性 getter，模板语法错误会在 createComponent 时抛出。
  ɵcompileComponent(LiveSandboxRuntimeHost, {
    selector: 'dui-live-sandbox-root',
    template,
    standalone: true,
    imports: liveSandboxRuntimeImports(),
    changeDetection: ChangeDetectionStrategy.Default,
  });
  return LiveSandboxRuntimeHost;
}

/**
 * Extracts a readable message from a thrown value.
 * @zh 从异常中提取可读信息。
 * @param err - Thrown value / 异常值
 * @returns Message text / 信息文本
 */
function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message || err.name;
  }
  return String(err);
}

/**
 * Serializes a log payload for the event console.
 * @zh 将 log 负载序列化为事件控制台文本。
 * @param payload - Payload / 负载
 * @returns Serialized text / 序列化文本
 */
function serializePayload(payload: unknown): string {
  if (payload === undefined) {
    return '';
  }
  if (typeof payload === 'string') {
    return payload;
  }
  if (typeof Event !== 'undefined' && payload instanceof Event) {
    const target = payload.target;
    const value = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement ? ` value="${target.value}"` : '';
    return `[${payload.type}]${value}`;
  }
  try {
    return JSON.stringify(payload) ?? String(payload);
  } catch {
    return String(payload);
  }
}

/**
 * Angular component `LiveTemplateStageComponent` (selector: 'app-live-template-stage') compiling and rendering editable templates in place.
 * @zh Angular 组件 `LiveTemplateStageComponent`（selector: 'app-live-template-stage'），220ms 防抖原位编译模板；仅状态变化时不重编译；任何阶段出错都保留上一帧视图并上报诊断。
 */
@Component({
  selector: 'app-live-template-stage',
  standalone: true,
  template: `<div class="lts" data-testid="live-stage"><ng-container #outlet></ng-container></div>`,
  styles: [':host{display:block;width:100%}.lts{width:100%;min-height:120px}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveTemplateStageComponent implements OnChanges, OnDestroy {
  /**
   * Input property `templateCode` (`string`) holding the Angular template to compile.
   * @zh 输入属性 `templateCode`（类型：`string`），待编译的 Angular 模板源码。
   */
  @Input() templateCode = '';

  /**
   * Input property `stateJson` (`string`) holding state JSON exposed as `state`.
   * @zh 输入属性 `stateJson`（类型：`string`），状态 JSON 源文本，在模板中以 `state` 暴露。
   */
  @Input() stateJson = '{}';

  /**
   * Input property `debounceMs` (`number`) debounce delay.
   * @zh 输入属性 `debounceMs`（类型：`number`），防抖延迟（毫秒，默认 220）。
   */
  @Input() debounceMs = 220;

  /**
   * Output `stageEvent` emitting `log()` calls from the template.
   * @zh 输出事件 `stageEvent`，模板中 `log()` 调用回流。
   */
  @Output() readonly stageEvent = new EventEmitter<LiveStageEvent>();

  /**
   * Output `compileStatus` emitting result of each update.
   * @zh 输出事件 `compileStatus`，每次更新（编译 / 状态替换）的结果。
   */
  @Output() readonly compileStatus = new EventEmitter<LiveCompileStatus>();

  /**
   * View container receiving rendered sandbox views.
   * @zh 承载沙箱视图的容器。
   */
  @ViewChild('outlet', { read: ViewContainerRef, static: true }) outlet: ViewContainerRef;

  /**
   * Current rendered sandbox component.
   * @zh 当前已渲染的沙箱组件引用。
   */
  private ref: ComponentRef<LiveSandboxHost> | null = null;

  /**
   * Template source of the current frame.
   * @zh 当前帧对应的模板源码。
   */
  private appliedTemplate: string | null = null;

  /**
   * State JSON text of the current frame.
   * @zh 当前帧对应的状态 JSON 文本。
   */
  private appliedStateText: string | null = null;

  /**
   * Pending debounce timer.
   * @zh 防抖计时器。
   */
  private timer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Environment injector for standalone creation.
   * @zh 用于独立组件创建的环境注入器。
   */
  private readonly environmentInjector = inject(EnvironmentInjector);

  /**
   * Element injector parent for sandbox components.
   * @zh 沙箱组件的元素注入器父级。
   */
  private readonly injector = inject(Injector);

  /**
   * Own change detector.
   * @zh 自身变更检测器。
   */
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Stable logger bound to this stage.
   * @zh 绑定到本舞台的稳定 log 回调。
   */
  private readonly logFn: LiveLogFn = (label: string, payload?: unknown) => {
    const event: LiveStageEvent = { label: String(label), payload: serializePayload(payload) };
    // 推迟到微任务，避免模板在变更检测过程中调用 log() 引发 ExpressionChanged
    Promise.resolve().then(() => this.stageEvent.emit(event));
  };

  /**
   * Schedules a debounced update on input changes.
   * @zh 输入变化时调度防抖更新。
   * @param changes - Angular change set / 变更集合
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['templateCode'] || changes['stateJson']) {
      this.schedule();
    }
  }

  /**
   * Clears timers; rendered views are destroyed with the container.
   * @zh 清理计时器；已渲染视图随容器一并销毁。
   */
  ngOnDestroy(): void {
    this.clearTimer();
    this.ref = null;
  }

  /**
   * Flushes pending changes immediately (Ctrl/Cmd+Enter).
   * @zh 立即执行挂起的更新（Ctrl/Cmd+Enter）。
   * @param force - Recompile even if template unchanged / 即使模板未变也强制重编译
   */
  runNow(force = false): void {
    this.clearTimer();
    if (force) {
      this.appliedTemplate = null;
    }
    this.flush();
  }

  /**
   * Starts the debounce timer.
   * @zh 启动防抖计时。
   */
  private schedule(): void {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush();
    }, Math.max(0, this.debounceMs));
  }

  /**
   * Cancels the debounce timer.
   * @zh 取消防抖计时。
   */
  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Applies current inputs: parse state, then either recompile or patch state.
   * @zh 应用当前输入：先解析状态；模板变化则重编译，否则仅替换 state。
   */
  private flush(): void {
    const start = performance.now();
    let state: JsonObject;
    try {
      state = parseJsonObject(this.stateJson ?? '');
    } catch (err) {
      this.report(false, false, 'state', `状态 JSON 解析失败：${errorMessage(err)}`, start);
      return;
    }

    const needCompile = !this.ref || this.templateCode !== this.appliedTemplate;
    if (needCompile) {
      this.compileAndSwap(state, start);
    } else if (this.stateJson !== this.appliedStateText) {
      this.patchState(state, start);
    }
  }

  /**
   * Compiles a new component, trial-renders it off-screen, and swaps it in only on success.
   * @zh 编译新组件并在离屏宿主中试渲染（含首次变更检测），成功后才替换上一帧。
   * @param state - Parsed state / 已解析状态
   * @param start - Start timestamp / 起始时间戳
   */
  private compileAndSwap(state: JsonObject, start: number): void {
    let trial: ComponentRef<LiveSandboxHost>;
    try {
      const componentType = buildSandboxComponent(this.templateCode ?? '');
      trial = createComponent(componentType, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector,
      });
    } catch (err) {
      this.report(false, true, 'compile', `模板编译失败：${errorMessage(err)}`, start);
      return;
    }

    try {
      trial.instance.state = state;
      trial.instance.log = this.logFn;
      // 运行时错误（如访问 undefined 的属性、未知管道）常在首次变更检测才抛出，离屏先跑一遍
      trial.changeDetectorRef.detectChanges();
    } catch (err) {
      this.safeDestroy(trial);
      this.report(false, true, 'render', `模板渲染失败：${errorMessage(err)}`, start);
      return;
    }

    this.outlet.clear();
    this.outlet.insert(trial.hostView);
    this.ref = trial;
    this.appliedTemplate = this.templateCode;
    this.appliedStateText = this.stateJson;
    this.cdr.markForCheck();
    this.report(true, true, 'render', '', start);
  }

  /**
   * Replaces `state` on the current frame without recompiling; reverts on render error.
   * @zh 不重编译，直接替换当前帧的 `state` 并检测变更；渲染出错时回滚到上一份状态。
   * @param state - Parsed state / 已解析状态
   * @param start - Start timestamp / 起始时间戳
   */
  private patchState(state: JsonObject, start: number): void {
    const ref = this.ref;
    if (!ref) {
      return;
    }
    const previous = ref.instance.state;
    ref.instance.state = state;
    try {
      ref.changeDetectorRef.detectChanges();
    } catch (err) {
      ref.instance.state = previous;
      try {
        ref.changeDetectorRef.detectChanges();
      } catch {
        // 回滚后仍失败时保持现有 DOM，不再继续抛出
      }
      this.report(false, false, 'render', `状态更新后渲染失败（已回滚）：${errorMessage(err)}`, start);
      return;
    }
    ref.changeDetectorRef.markForCheck();
    this.cdr.markForCheck();
    this.appliedStateText = this.stateJson;
    this.report(true, false, 'state', '', start);
  }

  /**
   * Destroys a component ref, swallowing teardown errors.
   * @zh 销毁组件引用，忽略销毁阶段异常。
   * @param ref - Component ref / 组件引用
   */
  private safeDestroy(ref: ComponentRef<LiveSandboxHost>): void {
    try {
      ref.destroy();
    } catch {
      // 半初始化的视图销毁失败可忽略
    }
  }

  /**
   * Emits a compile status.
   * @zh 发出编译状态。
   * @param ok - Success flag / 是否成功
   * @param recompiled - Whether template recompiled / 是否重编译
   * @param phase - Phase / 阶段
   * @param message - Diagnostic / 诊断信息
   * @param start - Start timestamp / 起始时间戳
   */
  private report(ok: boolean, recompiled: boolean, phase: LiveCompilePhase, message: string, start: number): void {
    const durationMs = Math.round((performance.now() - start) * 10) / 10;
    this.compileStatus.emit({ ok, recompiled, phase, message, durationMs });
  }
}
