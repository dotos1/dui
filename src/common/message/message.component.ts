/**
 * @fileoverview Module `src/common/message/message.component.ts` providing message component definitions and implementation.
 * @zh 模块文件 `src/common/message/message.component.ts`，提供消息组件相关的定义与实现。
 */

import {
  Component,
  Directive,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
  TemplateRef,
  ViewChild,
  HostBinding,
  HostListener,
  ChangeDetectorRef, ChangeDetectionStrategy,
} from '@angular/core';

import { duiCollapseAnimation } from './collapse.animation';

/**
 * @hidden Marks the internal view-container anchor that {@link MessageComponent} attaches
 * its content into, lazily.
 * @zh 内部使用，标记 {@link MessageComponent} 用于延迟挂载内容的视图容器锚点。
 */
@Directive({
  selector: '[duiMessageContainer]',
  standalone: false,
})
export class MessageContainerDirective {
  /**
   * Creates an instance of `MessageContainerDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MessageContainerDirective` 实例，并初始化其依赖项与内部状态。
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   */
  constructor(public viewContainer: ViewContainerRef) {}
}

/**
 * Dismissible inline message/banner with a label, optional sublabel/icon, and a collapse
 * animation on open/close.
 * @zh 可关闭的行内消息/横幅，带标题、可选副标题/图标，展开/收起时带折叠动画。
 */
@Component({
  selector: 'dui-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [duiCollapseAnimation],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MessageComponent implements AfterViewInit {
  /**
   * Property `_color` (`string`) storing color.
   * @zh 属性 `_color`（类型：`string`），用于存储或配置颜色。
   */
  private _color!: string;
  /**
   * Property `_opened` (`boolean`) storing opened (default: `true`).
   * @zh 属性 `_opened`（类型：`boolean`），用于存储或配置是否展开（默认值：`true`）。
   */
  private _opened = true;
  /**
   * Property `_hidden` (`boolean`) storing hidden (default: `false`).
   * @zh 属性 `_hidden`（类型：`boolean`），用于存储或配置隐藏（默认值：`false`）。
   */
  private _hidden = false;
  /**
   * Property `_animating` (`boolean`) storing animating (default: `false`).
   * @zh 属性 `_animating`（类型：`boolean`），用于存储或配置动画执行中（默认值：`false`）。
   */
  private _animating = false;
  /**
   * Property `_initialized` (`boolean`) storing initialized (default: `false`).
   * @zh 属性 `_initialized`（类型：`boolean`），用于存储或配置已初始化（默认值：`false`）。
   */
  private _initialized = false;

  /**
   * Template/content query reference `_childElement` (`MessageContainerDirective`) targeting child element.
   * @zh 模板/内容视图查询引用 `_childElement`（`@ViewChild`），指向子级元素。
   */
  @ViewChild(MessageContainerDirective, { static: true })
  _childElement?: MessageContainerDirective;
  /**
   * Template/content query reference `_template` (`TemplateRef<unknown>`) targeting template.
   * @zh 模板/内容视图查询引用 `_template`（`@ViewChild`），指向模板。
   */
  @ViewChild(TemplateRef) _template!: TemplateRef<unknown>;

  /**
   * Binding host to duiCollapse animation

   * @zh 宿主绑定读取器 `collapsedAnimation`（绑定至 `@duiCollapse`），计算并返回已折叠动画。
   */
  @HostBinding('@duiCollapse')
  get collapsedAnimation() {
    return { value: !this._opened, duration: 100 };
  }

  /**
   * Binding host to display style when hidden

   * @zh 宿主绑定读取器 `hidden`（绑定至 `style.display`），计算并返回隐藏。
   */
  @HostBinding('style.display')
  get hidden(): string {
    return this._hidden ? 'none' : '';
  }

  /**
   * label: string
   *
   * Sets the label of the message.

   * @zh 输入属性 `label`（类型：`string`），用于配置标签。
   */
  @Input() label?: string;

  /**
   * sublabel?: string
   *
   * Sets the sublabel of the message.

   * @zh 输入属性 `sublabel`（类型：`string`），用于配置副标签。
   */
  @Input() sublabel?: string;


  /**
   * Input property `icon` (`string`) configuring icon (default: `'info'`).
   * @zh 消息图标名称，默认为 `'info'`。
   * @zh 消息图标名称，默认为 `'info'`。
   */
  @Input() icon?: string = 'info';

  /**
   * The message's theme color; `primary`/`accent`/`warn` apply Material theme classes,
   * any other value is used directly as a color-name-based background/text class pair.
   * @zh 消息的主题色；`primary`/`accent`/`warn` 会应用 Material 主题类，
   * 其他值会被直接用作基于颜色名称的背景/文字类名。
   */
  @Input()
  set color(color: string) {
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'mat-' + this._color
    );
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'bgc-' + this._color + '-100'
    );
    this._renderer.removeClass(
      this._elementRef.nativeElement,
      'tc-' + this._color + '-700'
    );
    if (color === 'primary' || color === 'accent' || color === 'warn') {
      this._renderer.addClass(this._elementRef.nativeElement, 'mat-' + color);
    } else {
      this._renderer.addClass(
        this._elementRef.nativeElement,
        'bgc-' + color + '-100'
      );
      this._renderer.addClass(
        this._elementRef.nativeElement,
        'tc-' + color + '-700'
      );
    }
    this._color = color;
    this._changeDetectorRef.markForCheck();
  }
  /**
   * The message's current theme color.
   * @zh 消息当前的主题色。
   */
  get color(): string {
    return this._color;
  }

  /**
   * opened?: boolean
   *
   * Shows or hiddes the message depending on its value.
   * Defaults to 'true'.

   * @zh 输入属性 `opened` 的设置器，用于更新是否展开。
   */
  @Input()
  set opened(opened: boolean) {
    if (this._initialized) {
      if (opened) {
        this.open();
      } else {
        this.close();
      }
    } else {
      this._opened = opened;
    }
  }
  /**
   * Whether the message is currently open (visible).
   * @zh 消息当前是否处于展开（可见）状态。
   */
  get opened(): boolean {
    return this._opened;
  }

  /**
   * Creates an instance of `MessageComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MessageComponent` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef
  ) {
    this._renderer.addClass(this._elementRef.nativeElement, 'dui-message');
  }

  /**
   * Detach element when close animation is finished to set animating state to false
   * hidden state to true and detach element from DOM

   * @zh 宿主事件监听方法 `animationDoneListener`，响应 `@duiCollapse.done` 事件以处理动画完成监听器。
   */
  @HostListener('@duiCollapse.done')
  animationDoneListener(): void {
    if (!this._opened) {
      this._hidden = true;
      this._detach();
    }
    this._animating = false;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Initializes the component and attaches the content.

   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    Promise.resolve(undefined).then(() => {
      if (this._opened) {
        this._attach();
      }
      this._initialized = true;
    });
  }

  /**
   * Renders the message on screen
   * Validates if there is an animation currently and if its already opened

   * @zh 执行 `open`，用于打开。
   */
  open(): void {
    if (!this._opened && !this._animating) {
      this._opened = true;
      this._attach();
      this._startAnimationState();
    }
  }

  /**
   * Removes the message content from screen.
   * Validates if there is an animation currently and if its already closed

   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    if (this._opened && !this._animating) {
      this._opened = false;
      this._startAnimationState();
    }
  }

  /**
   * Toggles between open and close depending on state.

   * @zh 执行 `toggle`，用于开关。
   */
  toggle(): void {
    if (this._opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Method to set the state before starting an animation

   * @zh 执行 `_startAnimationState`，用于开始动画状态。
   */
  private _startAnimationState(): void {
    this._animating = true;
    this._hidden = false;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Method to attach template to DOM

   * @zh 执行 `_attach`，用于挂载。
   */
  private _attach(): void {
    this._childElement?.viewContainer.createEmbeddedView(this._template);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Method to detach template from DOM

   * @zh 执行 `_detach`，用于卸载。
   */
  private _detach(): void {
    this._childElement?.viewContainer.clear();
    this._changeDetectorRef.markForCheck();
  }
}
