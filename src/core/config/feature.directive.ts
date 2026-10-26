/**
 * @fileoverview Module `src/core/config/feature.directive.ts` providing feature directive definitions and implementation.
 * @zh 模块文件 `src/core/config/feature.directive.ts`，提供feature指令相关的定义与实现。
 */

import {
  Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { FeatureService } from './feature.service';

/**
 * 按功能开关决定渲不渲染。
 *
 * <pre>
 * &lt;button *duiFeature="'sdos.contour'"&gt;等值线&lt;/button&gt;
 * &lt;div *duiFeature="'sdos.ai'; else notLicensed"&gt;…&lt;/div&gt;
 * </pre>
 *
 * <p><b>是不渲染,不是隐藏。</b>关掉的功能连 DOM 都不建 —— 用 `hidden` 或者
 * `display:none` 的话,元素还在页面上,查看源码就能看见任务书里没有的功能名,
 * 而且里面的组件照样会实例化、照样发请求。
 *
 * <p>订了 {@link FeatureService.changed}:各库是在自己模块初始化时才登记功能的,
 * 时机可能<b>晚于</b>这个指令第一次求值。不订的话那些晚登记的功能会一直按
 * "没登记"处理,在客户现场表现为"这个功能怎么也开不出来"。

 * @zh Angular 指令 `FeatureDirective`（selector: '[duiFeature]'），为宿主 DOM 元素附加Feature指令行为。
 */
@Directive({ selector: '[duiFeature]' })
export class FeatureDirective implements OnInit, OnDestroy {

  /**
   * Input setter `duiFeature` updating dui feature.
   * @zh 输入属性 `duiFeature` 的设置器，用于更新DUIFeature。
   * @param key - New dui feature value (`string`) / 新的DUIFeature值（`string`）
   */
  @Input('duiFeature')
  set duiFeature(key: string) {
    this._key = key;
    this.render();
  }

  /**
   * Input setter `duiFeatureElse` updating dui feature else.
   * 关掉时改渲染这个模板。不给就什么都不渲染。
   * @zh 关掉时改渲染这个模板。不给就什么都不渲染。
   */
  @Input('duiFeatureElse')
  set duiFeatureElse(tpl: TemplateRef<unknown>) {
    this._else = tpl;
    this.render();
  }

  /**
   * Property `_key` (`string`) storing key.
   * @zh 属性 `_key`（类型：`string`），用于存储或配置键。
   */
  private _key: string;

  /**
   * Property `_else` (`TemplateRef<any>`) storing else.
   * @zh 属性 `_else`（类型：`TemplateRef<any>`），用于存储或配置else。
   */
  private _else: TemplateRef<unknown>;

  /**
   * Property `shown` (`'main' | 'else' | 'none'`) storing shown (default: `'none'`).
   * 当前渲染的是哪一个,避免每次变更都拆了重建
   * @zh 当前渲染的是哪一个,避免每次变更都拆了重建
   */
  private shown: 'main' | 'else' | 'none' = 'none';

  /**
   * Property `sub` (`Subscription`) storing sub.
   * @zh 属性 `sub`（类型：`Subscription`），用于存储或配置子。
   */
  private sub: Subscription;

  /**
   * Creates an instance of `FeatureDirective` and initializes its dependencies and internal state.
   * @zh 创建 `FeatureDirective` 实例，并初始化其依赖项与内部状态。
   * @param tpl - Injected or initial tpl (`TemplateRef<any>`) / 注入或传入的tpl（`TemplateRef<any>`）
   * @param vcr - Injected or initial vcr (`ViewContainerRef`) / 注入或传入的vcr（`ViewContainerRef`）
   * @param features - Injected or initial features (`FeatureService`) / 注入或传入的features（`FeatureService`）
   */
  constructor(
    private readonly tpl: TemplateRef<unknown>,
    private readonly vcr: ViewContainerRef,
    private readonly features: FeatureService,
  ) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.sub = this.features.changed.subscribe(() => this.render());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Executes `render` to handle render.
   * @zh 执行 `render`，用于渲染。
   */
  private render(): void {
    if (!this.features) {
      return;
    }
    const want: 'main' | 'else' | 'none' =
      this.features.isEnabled(this._key) ? 'main' : (this._else ? 'else' : 'none');
    if (want === this.shown) {
      return;
    }
    this.vcr.clear();
    if (want === 'main') {
      this.vcr.createEmbeddedView(this.tpl);
    } else if (want === 'else') {
      this.vcr.createEmbeddedView(this._else);
    }
    this.shown = want;
  }

}
