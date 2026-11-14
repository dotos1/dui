/**
 * @fileoverview Module `src/ui/speeddial/speed-dial.ts` providing speed dial definitions and implementation.
 * @zh 模块文件 `src/ui/speeddial/speed-dial.ts`，提供速度dial相关的定义与实现。
 */

import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { Subscription, forkJoin, fromEvent, race, timer } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Constant/variable `Z_INDEX_ITEM` defining z index item in `src/ui/speeddial`.
 * @zh 常量/变量 `Z_INDEX_ITEM`，定义 `src/ui/speeddial` 中的Z坐标索引条目。
 */
const Z_INDEX_ITEM = 23;

import { DOCUMENT } from '@angular/common';

/**
 * Type alias `Direction` representing direction (`'up' | 'down' | 'left' | 'right'`).
 * @zh 类型别名 `Direction`，表示方向（`'up' | 'down' | 'left' | 'right'`）。
 */
export type Direction = 'up' | 'down' | 'left' | 'right';
/**
 * Type alias `AnimationMode` representing animation mode (`'fling' | 'scale'`).
 * @zh 类型别名 `AnimationMode`，表示动画模式（`'fling' | 'scale'`）。
 */
export type AnimationMode = 'fling' | 'scale';


/**
 * Angular component `SpeedDialActionsComponent` (selector: 'speed-dial-actions') providing speed dial actions component presentation and interaction in `src/ui/speeddial`.
 * @zh Angular 组件 `SpeedDialActionsComponent`（selector: 'speed-dial-actions'），提供速度Dial动作列表组件的视图渲染与交互逻辑（位于 `src/ui/speeddial`）。
 */
@Component({
  selector: 'speed-dial-actions',
  template: `
        <ng-content select="[mat-mini-fab]" *ngIf="miniFabVisible"></ng-content>`,
        host: {hostID: 'speed-dial-actions' + Math.random().toString(36).substring(2, 15)},
  standalone: false,
})
export class SpeedDialActionsComponent implements AfterContentInit {

  /**
   * Property `_parent` (`SpeedDialComponent`) storing parent.
   * @zh 属性 `_parent`（类型：`SpeedDialComponent`），用于存储或配置父级。
   */
  private _parent: SpeedDialComponent;

  /**
   * Template/content query reference `_buttons` (`QueryList<MatMiniFabButton>`) targeting buttons.
   * @zh 模板/内容视图查询引用 `_buttons`（`@ContentChildren`），指向按钮。
   */
  @ContentChildren(MatMiniFabButton) _buttons: QueryList<MatMiniFabButton>;


  /**
   * Whether the min-fab button exist in DOM

   * @zh 属性 `miniFabVisible`（类型：`boolean`），用于存储或配置miniFab可见（默认值：`false`）。
   */
  public miniFabVisible = false;

  /**
   * The timeout ID for the callback to show the mini-fab buttons

   * @zh 属性 `showMiniFabAnimation`（类型：`number`），用于存储或配置显示MiniFab动画。
   */
  private showMiniFabAnimation: ReturnType<typeof setTimeout>;


  /**
   * Property `hideMiniFab` (`Subscription`) storing hide mini fab.
   * @zh 属性 `hideMiniFab`（类型：`Subscription`），用于存储或配置隐藏MiniFab。
   */
  private hideMiniFab: Subscription | null;

  /**
   * Creates an instance of `SpeedDialActionsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SpeedDialActionsComponent` 实例，并初始化其依赖项与内部状态。
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(injector: Injector, private renderer: Renderer2) {
    this._parent = injector.get(SpeedDialComponent);
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    this._buttons.changes.subscribe(() => {
      this.initButtonStates();
      this._parent.setActionsVisibility();
    });
    this.initButtonStates();
  }

  /**
   * Executes `initButtonStates` to handle init button states.
   * @zh 执行 `initButtonStates`，用于初始化按钮状态。
   */
  private initButtonStates(): void {
    this._buttons.forEach((button, i) => {
      this.renderer.addClass(button. _elementRef.nativeElement, 'action-item');
      this.changeElementStyle(button. _elementRef.nativeElement, 'z-index', '' + (Z_INDEX_ITEM - i));
    });
  }

  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   */
  show(): void {
    if (!this._buttons) {
      return;
    }
    this.resetAnimationState();
    this.miniFabVisible = true;
    this.showMiniFabAnimation = setTimeout(() => {
      this._buttons.forEach((button, i) => {
        let transitionDelay = 0;
        let transform;
        if (this._parent.animationMode === 'scale') {
          transitionDelay = 3 + (65 * i);
          transform = 'scale(1)';
        } else {
          transform = this.getTranslateFunction('0');
        }
        const hostElement = button. _elementRef.nativeElement;
        this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
        this.changeElementStyle(hostElement, 'opacity', '1');
        this.changeElementStyle(hostElement, 'transform', transform);
       this.changeElementStyle(hostElement, 'display', "block");
      });
    }, 50);
  }

  /**
   * Executes `resetAnimationState` to handle reset animation state.
   * @zh 执行 `resetAnimationState`，用于重置动画状态。
   */
  private resetAnimationState(): void {
    clearTimeout(this.showMiniFabAnimation);
    if (this.hideMiniFab) {
      this.hideMiniFab.unsubscribe();
      this.hideMiniFab = null;
    }
  }

  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   */
  hide(): void {
    if (!this._buttons) {
      return;
    }
    this.resetAnimationState();
    const total = this._buttons.length;
    let maxDelay = 0;
    const obs = this._buttons.map((button, i) => {
      let opacity = '1';
      let transitionDelay = 0;
      let transform;
      if (this._parent.animationMode === 'scale') {
        transitionDelay = 3 + (65 * (total - 1 - i));
        transform = 'scale(0)';
        opacity = '0';
      } else {
        transform = this.getTranslateFunction((55 * (i + 1) - (i * 5)) + 'px');
      }
      maxDelay = Math.max(maxDelay, transitionDelay);
      const hostElement = button. _elementRef.nativeElement;
      this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
      this.changeElementStyle(hostElement, 'opacity', opacity);
      this.changeElementStyle(hostElement, 'transform', transform);
      return fromEvent(hostElement, 'transitionend').pipe(take(1));
    });
    // transitionend 不一定会来:样式值没变(已经是收起状态)、元素不可见、系统开了
    // 「减少动态效果」都不触发。forkJoin 少一个就永远不完成,小按钮停在透明但仍可点击
    // 的状态(b8c5e5c 复核)。最长延迟之后再等 500ms 兜底。
    this.hideMiniFab = race(forkJoin(obs), timer(maxDelay + 500)).subscribe(() => {
      this._buttons.forEach(button => {
        this.changeElementStyle(button._elementRef.nativeElement, 'display', 'none');
      });
      this.miniFabVisible = false;
    });
  }

  /**
   * Executes `getTranslateFunction` to handle get translate function.
   * @zh 执行 `getTranslateFunction`，用于获取翻译函数。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getTranslateFunction(value: string): string {
    const dir = this._parent.direction;
    const translateFn = (dir === 'up' || dir === 'down') ? 'translateY' : 'translateX';
    const sign = (dir === 'down' || dir === 'right') ? '-' : '';
    return translateFn + '(' + sign + value + ')';
  }

  /**
   * Executes `changeElementStyle` to handle change element style.
   * @zh 执行 `changeElementStyle`，用于变更元素样式。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   * @param style - style parameter (`string`) / 样式参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  private changeElementStyle(elem, style: string, value: string) {
    // FIXME - Find a way to create a "wrapper" around the action button(s) provided by the user, so we don't change it's style tag
    this.renderer.setStyle(elem, style, value);
  }
}


/**
 * Angular component `SpeedDialComponent` (selector: 'speed-dial') providing speed dial component presentation and interaction in `src/ui/speeddial`.
 * @zh Angular 组件 `SpeedDialComponent`（selector: 'speed-dial'），提供速度Dial组件的视图渲染与交互逻辑（位于 `src/ui/speeddial`）。
 */
@Component({
    selector: 'speed-dial',
    template: `
        <div class="speed-dial-container">
            <ng-content select="speed-dial-trigger"></ng-content>
            <ng-content select="speed-dial-actions"></ng-content>
        </div>
    `,
    styleUrls: ['./speed-dial.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        hostID: 'speed-dial' + Math.random().toString(36).substring(2, 15)},
    standalone: false
})

export class SpeedDialComponent implements OnDestroy, AfterContentInit {
    /**
     * Property `isInitialized` (`boolean`) storing is initialized (default: `false`).
     * @zh 属性 `isInitialized`（类型：`boolean`），用于存储或配置是否为已初始化（默认值：`false`）。
     */
    private isInitialized = false;
    /**
     * Property `_direction` (`Direction`) storing direction (default: `'up'`).
     * @zh 属性 `_direction`（类型：`Direction`），用于存储或配置方向（默认值：`'up'`）。
     */
    private _direction: Direction = 'up';
    /**
     * Property `_open` (`boolean`) storing open (default: `false`).
     * @zh 属性 `_open`（类型：`boolean`），用于存储或配置打开（默认值：`false`）。
     */
    private _open = false;
    /**
     * Property `_animationMode` (`AnimationMode`) storing animation mode (default: `'fling'`).
     * @zh 属性 `_animationMode`（类型：`AnimationMode`），用于存储或配置动画模式（默认值：`'fling'`）。
     */
    private _animationMode: AnimationMode = 'fling';
    /**
     * Property `_fixed` (`boolean`) storing fixed (default: `false`).
     * @zh 属性 `_fixed`（类型：`boolean`），用于存储或配置固定（默认值：`false`）。
     */
    private _fixed = false;
    /**
     * Property `_documentClickUnlistener` (`() => void`) storing document click unlistener (default: `null`).
     * @zh 属性 `_documentClickUnlistener`（类型：`() => void`），用于存储或配置文档对象点击取消监听器（默认值：`null`）。
     */
    private _documentClickUnlistener: (() => void) | null = null;

    /**
     * Input property `type` (`string`) configuring type (default: `"mat-fab"`).
     * @zh 输入属性 `type`（类型：`string`），用于配置类型（默认值：`"mat-fab"`）。
     */
    @Input() type = "mat-fab";
    /**
     * Whether this speed dial is fixed on screen (user cannot change it by clicking)

     * @zh 输入属性 `fixed`（类型：`boolean`）的读取器，返回当前固定。
     */
    @Input() get fixed(): boolean {
        return this._fixed;
    }

    /**
     * Sets the fixed (`fixed`).
     * @zh 设置固定（`fixed`）。
     * @param fixed - New fixed value (`boolean`) / 新的固定值（`boolean`）
     */
    set fixed(fixed: boolean) {
        this._fixed = fixed;
        this._processOutsideClickState();
    }

    /**
     * Whether this speed dial is opened

     * @zh 输入属性 `open`（类型：`boolean`）的读取器，返回当前打开。
     */
    @HostBinding('class.eco-opened')
    @Input() get open(): boolean {
        return this._open;
    }

    /**
     * Sets the open (`open`).
     * @zh 设置打开（`open`）。
     * @param open - New open value (`boolean`) / 新的打开值（`boolean`）
     */
    set open(open: boolean) {
        const previousOpen = this._open;
        this._open = open;
        if (previousOpen !== this._open) {
            this.openChange.emit(this._open);
            if (this.isInitialized) {
                this.setActionsVisibility();
            }
        }
    }

    /**
     * The direction of the speed dial. Can be 'up', 'down', 'left' or 'right'

     * @zh 输入属性 `direction`（类型：`Direction`）的读取器，返回当前方向。
     */
    @Input() get direction(): Direction {
        return this._direction;
    }

    /**
     * Sets the direction (`direction`).
     * @zh 设置方向（`direction`）。
     * @param direction - New direction value (`Direction`) / 新的方向值（`Direction`）
     */
    set direction(direction: Direction) {
        const previousDirection = this._direction;
        this._direction = direction;
        if (previousDirection !== this.direction) {
            this._setElementClass(previousDirection, false);
            this._setElementClass(this.direction, true);

            if (this.isInitialized) {
                this.setActionsVisibility();
            }
        }
    }

    /**
     * The animation mode to open the speed dial. Can be 'fling' or 'scale'

     * @zh 输入属性 `animationMode`（类型：`AnimationMode`）的读取器，返回当前动画模式。
     */
    @Input() get animationMode(): AnimationMode {
        return this._animationMode;
    }

    /**
     * Sets the animation mode (`animationMode`).
     * @zh 设置动画模式（`animationMode`）。
     * @param animationMode - New animation mode value (`AnimationMode`) / 新的动画模式值（`AnimationMode`）
     */
    set animationMode(animationMode: AnimationMode) {
        const previousAnimationMode = this._animationMode;
        this._animationMode = animationMode;
        if (previousAnimationMode !== this._animationMode) {
            this._setElementClass(previousAnimationMode, false);
            this._setElementClass(this.animationMode, true);

            if (this.isInitialized) {
                // To start another detect lifecycle and force the "close" on the action buttons
                Promise.resolve(null).then(() => this.open = false);
            }
        }
    }

    /**
     * Output event emitter `openChange` (`EventEmitter<boolean>`) firing when open change occurs.
     * @zh 输出事件 `openChange`（类型：`EventEmitter<boolean>`），当触发打开变更时向外发出事件。
     */
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Template/content query reference `_childActions` (`SpeedDialActionsComponent`) targeting child actions.
     * @zh 模板/内容视图查询引用 `_childActions`（`@ContentChild`），指向子级动作列表。
     */
    @ContentChild(SpeedDialActionsComponent) _childActions: SpeedDialActionsComponent;

    /**
     * Creates an instance of `SpeedDialComponent` and initializes its dependencies and internal state.
     * @zh 创建 `SpeedDialComponent` 实例，并初始化其依赖项与内部状态。
     * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
     * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
     * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
     */
    constructor(private elementRef: ElementRef, private renderer: Renderer2,
      @Inject(DOCUMENT) private document) {
    }

    /**
     * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
     * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
     */
    ngAfterContentInit(): void {
        this.isInitialized = true;
        this.setActionsVisibility();
        this._setElementClass(this.direction, true);
        this._setElementClass(this.animationMode, true);
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy() {
        this._unsetDocumentClickListener();
    }

    /**
     * Toggle the open state of this speed dial

     * @zh 执行 `toggle`，用于开关。
     */
    public toggle(): void {
        this.open = !this.open;
    }

    /**
     * Host event listener `_onClick` handling `click` events for on click.
     * @zh 宿主事件监听方法 `_onClick`，响应 `click` 事件以处理当点击。
     */
    @HostListener('click')
    _onClick(): void {
        if (!this.fixed && this.open) {
            this.open = false;
        }
    }

    /**
     * Executes `setActionsVisibility` to handle set actions visibility.
     * @zh 执行 `setActionsVisibility`，用于集合动作列表Visibility。
     */
    setActionsVisibility(): void {
        if (!this._childActions) {
            return;
        }
        if (this.open) {
            this._childActions.show();
        } else {
            this._childActions.hide();
        }
        this._processOutsideClickState();
    }

    /**
     * Executes `_setElementClass` to handle set element class.
     * @zh 执行 `_setElementClass`，用于集合元素类名。
     * @param elemClass - elem class parameter (`string`) / elem类名参数（`string`）
     * @param isAdd - is add parameter (`boolean`) / 是否为添加参数（`boolean`）
     */
    private _setElementClass(elemClass: string, isAdd: boolean): void {
      let finalClass;
      if(this.type=='mat-fab'){
        finalClass = `eco-${elemClass}`;
      }else{
        finalClass = `eco-mini-${elemClass}`;
      }
        if (isAdd) {
            this.renderer.addClass(this.elementRef.nativeElement, finalClass);
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, finalClass);
        }
    }

    /**
     * Executes `_processOutsideClickState` to handle process outside click state.
     * @zh 执行 `_processOutsideClickState`，用于处理外部点击状态。
     */
    private _processOutsideClickState() {
        if (!this.fixed && this.open) {
            this._setDocumentClickListener();
        } else {
            this._unsetDocumentClickListener();
        }
    }

    /**
     * Executes `_setDocumentClickListener` to handle set document click listener.
     * @zh 执行 `_setDocumentClickListener`，用于集合文档对象点击监听器。
     */
    private _setDocumentClickListener() {
        if (!this._documentClickUnlistener) {
            this._documentClickUnlistener = this.renderer.listen(this.document, 'click', () => {
                this.open = false;
            });
        }
    }

    /**
     * Executes `_unsetDocumentClickListener` to handle unset document click listener.
     * @zh 执行 `_unsetDocumentClickListener`，用于unset文档对象点击监听器。
     */
    private _unsetDocumentClickListener() {
        if (this._documentClickUnlistener) {
            this._documentClickUnlistener();
            this._documentClickUnlistener = null;
        }
    }

}

