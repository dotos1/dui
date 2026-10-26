/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar-ext.ts` providing ng scrollbar ext definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar-ext.ts`，提供Angular滚动条ext相关的定义与实现。
 */

import {
  Component,
  Input,
  inject,
  signal,
  effect,
  computed,
  untracked,
  createComponent,
  booleanAttribute,
  input,
  contentChild,
  Signal,
  InputSignal,
  WritableSignal,
  Injector,
  Renderer2,
  ComponentRef,
  ApplicationRef,
  ChangeDetectionStrategy,
  EffectCleanupRegisterFn
} from '@angular/core';
import { ScrollViewport, ViewportAdapter } from './viewport';
import { NgScrollbar } from './ng-scrollbar';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

/**
 * `ng-scrollbar` variant that renders custom scrollbar overlays on top of an *external*
 * viewport element (`[scrollViewport]`) that you control, instead of an internal one.
 * @zh `ng-scrollbar` 的外部视口版本，在你自行提供的外部视口元素（`[scrollViewport]`）上方
 * 渲染自定义滚动条覆层，而不是使用内部视口。
 */
@Component({
  standalone: true,
  selector: 'ng-scrollbar[externalViewport]',
  exportAs: 'ngScrollbar',
  template: '<ng-content/>',
  styleUrls: ['ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {

    ngSkipHydration: 'true',
    '[class.ng-scrollbar-external-viewport]': 'true'
  },
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbarExt },
    { provide: NgScrollbarCore, useExisting: NgScrollbar },
    ViewportAdapter
  ],
})
export class NgScrollbarExt extends NgScrollbarCore {

  /**
   * Property `renderer` (`Renderer2`) storing renderer (default: `inject(Renderer2)`).
   * @zh 属性 `renderer`（类型：`Renderer2`），用于存储或配置渲染器（默认值：`inject(Renderer2)`）。
   */
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Property `appRef` (`ApplicationRef`) storing app ref (default: `inject(ApplicationRef)`).
   * @zh 属性 `appRef`（类型：`ApplicationRef`），用于存储或配置app引用（默认值：`inject(ApplicationRef)`）。
   */
  private readonly appRef: ApplicationRef = inject(ApplicationRef);

  /**
   * Property `_scrollbarsRef` (`ComponentRef<Scrollbars>`) storing scrollbars ref.
   * @zh 属性 `_scrollbarsRef`（类型：`ComponentRef<Scrollbars>`），用于存储或配置滚动条引用。
   */
  _scrollbarsRef: ComponentRef<Scrollbars>;

  /**
   * Property `_scrollbars` (`WritableSignal<Scrollbars>`) storing scrollbars (default: `signal<Scrollbars>(null)`).
   * @zh 属性 `_scrollbars`（类型：`WritableSignal<Scrollbars>`），用于存储或配置滚动条（默认值：`signal<Scrollbars>(null)`）。
   */
  _scrollbars: WritableSignal<Scrollbars> = signal<Scrollbars>(null);

  /**
   * Selector used to query the viewport element.

   * @zh 属性 `externalViewport`（类型：`InputSignal<string>`），用于存储或配置外部视口（默认值：`input<string>()`）。
   */
  externalViewport: InputSignal<string> = input<string>();

  /**
   * Selector used to query the content wrapper element.

   * @zh 属性 `externalContentWrapper`（类型：`InputSignal<string>`），用于存储或配置外部内容包装器（默认值：`input<string>()`）。
   */
  externalContentWrapper: InputSignal<string> = input<string>();

  /**
   * Selector used to query the spacer element (virtual scroll integration).
   * In the case of integrating the scrollbar with a virtual scroll component,
   * a spacer element is typically created to match the real size of the content.
   * The scrollbar will use the size of this spacer element for calculations instead of the content wrapper size.

   * @zh 属性 `externalSpacer`（类型：`InputSignal<string>`），用于存储或配置外部Spacer（默认值：`input<string>()`）。
   */
  externalSpacer: InputSignal<string> = input<string>();

  // At the time being, InputSignal value cannot be overridden programmatically from another directive,
  /**
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的视口元素覆盖值。
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的视口元素覆盖值。
   */
  altViewport: WritableSignal<HTMLElement> = signal<HTMLElement>(null);
  /**
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的内容包裹层元素覆盖值。
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的内容包裹层元素覆盖值。
   */
  altContentWrapper: WritableSignal<HTMLElement> = signal<HTMLElement>(null);
  /**
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的占位符元素覆盖值。
   * @zh 内部使用，由 {@link AsyncDetection} 等辅助指令写入的占位符元素覆盖值。
   */
  altSpacer: WritableSignal<HTMLElement> = signal<HTMLElement>(null);

  /**
   * The resolved external viewport element (from `[scrollViewport]`, `altViewport`, or the
   * `externalViewport` selector).
   * @zh 解析出的外部视口元素（来自 `[scrollViewport]`、`altViewport` 或 `externalViewport` 选择器）。
   */
  viewportElement: Signal<HTMLElement> = computed(() => {
    if (this.customViewport()) {
      return this.customViewport().nativeElement;
    }
    if (this.altViewport()) {
      return this.altViewport();
    }
    // If viewport selector was defined, query the element
    const selector: string = this.externalViewport();
    return selector ? this.nativeElement.querySelector(selector) : null;
  });

  /**
   * A diagnostic error message if the external viewport element couldn't be resolved, else `null`.
   * @zh 若外部视口元素解析失败则给出诊断错误信息，否则为 `null`。
   */
  viewportError: Signal<string> = computed(() => {
    return !this.viewportElement()
      ? `[NgScrollbar]: Could not find the viewport element for the provided selector "${ this.externalViewport() }"`
      : null;
  });

  /**
   * The resolved external content-wrapper element.
   * @zh 解析出的外部内容包裹层元素。
   */
  contentWrapperElement: Signal<HTMLElement> = computed(() => {
    if (this.altContentWrapper()) {
      return this.altContentWrapper();
    }
    const selector: string = this.externalContentWrapper();
    return selector ? this.nativeElement.querySelector(selector) : null;
  });

  /**
   * A diagnostic error message if the external content-wrapper element couldn't be resolved, else `null`.
   * @zh 若外部内容包裹层元素解析失败则给出诊断错误信息，否则为 `null`。
   */
  contentWrapperError: Signal<string> = computed(() => {
    return !this.contentWrapperElement() && this.externalContentWrapper()
      ? `[NgScrollbar]: Content wrapper element not found for the provided selector "${ this.externalContentWrapper() }"`
      : null;
  });

  /**
   * The resolved external spacer element.
   * @zh 解析出的外部占位符元素。
   */
  spacerElement: Signal<HTMLElement> = computed(() => {
    if (this.altSpacer()) {
      return this.altSpacer();
    }
    const selector: string = this.externalSpacer();
    return selector ? this.nativeElement.querySelector(selector) : null
  });

  /**
   * A diagnostic error message if the external spacer element couldn't be resolved, else `null`.
   * @zh 若外部占位符元素解析失败则给出诊断错误信息，否则为 `null`。
   */
  spacerError: Signal<string> = computed(() => {
    return !this.spacerElement() && this.externalSpacer()
      ? `[NgScrollbar]: Spacer element not found for the provided selector "${ this.externalSpacer() }"`
      : null;
  });

  /**
   * Skip initializing the viewport and the scrollbar
   * this is used when the component needs to wait for 3rd party library to render

   * @zh 输入属性 `skipInit`（类型：`boolean`），用于配置skip初始化。
   */
  @Input({ transform: booleanAttribute }) skipInit: boolean;

  /**
   * Reference to the external viewport directive if used

   * @zh 属性 `customViewport`（类型：`Signal<ScrollViewport>`），用于存储或配置自定义视口。
   */
  customViewport: Signal<ScrollViewport> = contentChild(ScrollViewport, { descendants: true });

  /**
   * Creates an instance of `NgScrollbarExt` and initializes its dependencies and internal state.
   * @zh 创建 `NgScrollbarExt` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect((onCleanup: EffectCleanupRegisterFn) => {
      const viewportElement: HTMLElement = this.viewportElement();
      const spacerElement: HTMLElement = this.spacerElement();
      let contentWrapperElement: HTMLElement = this.contentWrapperElement();

      const viewportError: string = this.viewportError();
      const contentWrapperError: string = this.contentWrapperError();
      const spacerError: string = this.spacerError();

      untracked(() => {
        if (!this.skipInit) {
          const error: string = viewportError || contentWrapperError || spacerError;
          if (error) {
            console.error(error);
          } else {
            // If no external spacer or content wrapper is provided, create a content wrapper element
            if (!spacerElement && !contentWrapperElement) {
              contentWrapperElement = this.renderer.createElement('div');

              // Move all content of the viewport into the content wrapper
              const childNodes: ChildNode[] = Array.from(viewportElement.childNodes);
              childNodes.forEach((node: ChildNode) => this.renderer.appendChild(contentWrapperElement, node));

              // Append the content wrapper to the viewport
              this.renderer.appendChild(viewportElement, contentWrapperElement);
            }

            // Make sure content wrapper element is defined to proceed
            if (contentWrapperElement) {
              // Initialize viewport
              this.viewport.init(viewportElement, contentWrapperElement, spacerElement);
              // Attach scrollbars
              this._attachScrollbars();
            }
          }
        }

        onCleanup(() => {
          if (this._scrollbarsRef) {
            this.appRef.detachView(this._scrollbarsRef.hostView);
            this._scrollbarsRef.destroy();
          }
        })
      });
    });
    super();
  }

  /**
   * Executes `_attachScrollbars` to handle attach scrollbars.
   * @zh 执行 `_attachScrollbars`，用于挂载滚动条。
   */
  _attachScrollbars(): void {
    // Create the scrollbars component
    this._scrollbarsRef = createComponent(Scrollbars, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({ providers: [{ provide: NG_SCROLLBAR, useValue: this }] })
    });
    // Attach scrollbar to the content wrapper
    this.renderer.appendChild(this.viewport.contentWrapperElement, this._scrollbarsRef.location.nativeElement)
    // Attach the host view of the component to the main change detection tree, so that its lifecycle hooks run.
    this.appRef.attachView(this._scrollbarsRef.hostView);
    // Set the scrollbars instance
    this._scrollbars.set(this._scrollbarsRef.instance);
  }
}
