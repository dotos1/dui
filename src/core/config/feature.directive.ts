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
 */
@Directive({ selector: '[duiFeature]' })
export class FeatureDirective implements OnInit, OnDestroy {

  @Input('duiFeature')
  set duiFeature(key: string) {
    this._key = key;
    this.render();
  }

  /** 关掉时改渲染这个模板。不给就什么都不渲染。 */
  @Input('duiFeatureElse')
  set duiFeatureElse(tpl: TemplateRef<any>) {
    this._else = tpl;
    this.render();
  }

  private _key: string;

  private _else: TemplateRef<any>;

  /** 当前渲染的是哪一个,避免每次变更都拆了重建 */
  private shown: 'main' | 'else' | 'none' = 'none';

  private sub: Subscription;

  constructor(
    private readonly tpl: TemplateRef<any>,
    private readonly vcr: ViewContainerRef,
    private readonly features: FeatureService,
  ) {
  }

  ngOnInit(): void {
    this.sub = this.features.changed.subscribe(() => this.render());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

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
