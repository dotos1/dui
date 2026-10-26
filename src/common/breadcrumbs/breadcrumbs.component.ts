/**
 * @fileoverview Module `src/common/breadcrumbs/breadcrumbs.component.ts` providing breadcrumbs component definitions and implementation.
 * @zh 模块文件 `src/common/breadcrumbs/breadcrumbs.component.ts`，提供面包屑导航组件相关的定义与实现。
 */

import {
  Component,
  ContentChildren,
  QueryList,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterContentInit,
  ChangeDetectorRef,
  ElementRef,
  Input,
  HostBinding,
} from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

/**
 * Container for {@link BreadcrumbComponent} items; automatically collapses/hides crumbs that
 * no longer fit the available width on resize.
 * @zh {@link BreadcrumbComponent} 面包屑项的容器；在窗口尺寸变化时自动折叠/隐藏放不下的面包屑项。
 */
@Component({
  selector: 'dui-breadcrumbs',
  styleUrls: ['./breadcrumbs.component.scss'],
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  /**
   * Property `_resizing` (`boolean`) storing resizing (default: `false`).
   * @zh 属性 `_resizing`（类型：`boolean`），用于存储或配置调整尺寸中（默认值：`false`）。
   */
  private _resizing = false;
  /**
   * Property `_separatorIcon` (`string`) storing separator icon (default: `'chevron_right'`).
   * @zh 属性 `_separatorIcon`（类型：`string`），用于存储或配置separator图标（默认值：`'chevron_right'`）。
   */
  private _separatorIcon = 'chevron_right';
  /**
   * Property `_destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `_destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private _destroy$ = new Subject<void>();

  /**
   * Host binding `tdBreadCrumbsClass` bound to host attribute/property `class.dui-breadcrumbs` for td bread crumbs class.
   * @zh 内部使用，始终为 `true`，用于绑定 `dui-breadcrumbs` 宿主类名。
   * @zh 内部使用，始终为 `true`，用于绑定 `dui-breadcrumbs` 宿主类名。
   */
  @HostBinding('class.dui-breadcrumbs') tdBreadCrumbsClass = true;

  /**
   * Template/content query reference `_breadcrumbs` (`@ContentChildren`) targeting breadcrumbs.
   * @zh 模板/内容视图查询引用 `_breadcrumbs`（`@ContentChildren`），指向面包屑导航。
   */
  @ContentChildren(BreadcrumbComponent, { descendants: true })
  _breadcrumbs!: QueryList<BreadcrumbComponent>;
  /**
   * The child breadcrumbs currently hidden because they don't fit the available width.
   * @zh 因宽度不足而当前被隐藏的子面包屑项。
   */
  hiddenBreadcrumbs: BreadcrumbComponent[] = [];


  /**
   * The Material icon name used as the separator between breadcrumb items. Defaults to `chevron_right`.
   * @zh 用作面包屑项之间分隔符的 Material 图标名称，默认为 `chevron_right`。
   */
  @Input() public set separatorIcon(separatorIcon: string) {
    this._separatorIcon = separatorIcon;
    this.setCrumbIcons();
  }
  /**
   * The Material icon name used as the separator between breadcrumb items. Defaults to `chevron_right`.
   * @zh 用作面包屑项之间分隔符的 Material 图标名称，默认为 `chevron_right`。
   */
  public get separatorIcon(): string {
    return this._separatorIcon;
  }

  /**
   * Creates an instance of `BreadcrumbsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `BreadcrumbsComponent` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(10), takeUntil(this._destroy$))
      .subscribe(() => {
        if (!this._resizing) {
          this._resizing = true;
          setTimeout(() => {
            this._calculateVisibility();
            this._resizing = false;
            this._changeDetectorRef.markForCheck();
          }, 100);
        }
      });
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    this._breadcrumbs.changes
      .pipe(startWith(this._breadcrumbs), takeUntil(this._destroy$))
      .subscribe(() => {
        this.setCrumbIcons();
        this._calculateVisibility();
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  /**
   * The host element's content-box width (outer width minus border/margin/padding).
   * @zh 宿主元素的内容区宽度（外部宽度减去边框/外边距/内边距）。
   */
  get nativeElementWidth(): number {
    const element: HTMLElement = <HTMLElement>this._elementRef.nativeElement;
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const borderLeft: number = parseInt(style.borderLeft, 10);
    const borderRight: number = parseInt(style.borderRight, 10);
    const marginLeft: number = parseInt(style.marginLeft, 10);
    const marginRight: number = parseInt(style.marginRight, 10);
    const paddingLeft: number = parseInt(style.paddingLeft, 10);
    const paddingRight: number = parseInt(style.paddingRight, 10);

    return (
      element.getBoundingClientRect().width -
      borderLeft -
      borderRight -
      marginLeft -
      marginRight -
      paddingLeft -
      paddingRight
    );
  }

  /**
   * The number of projected breadcrumb items.
   * @zh 投影的面包屑项数量。
   */
  get count(): number {
    return this._breadcrumbs ? this._breadcrumbs.length : 0;
  }

  /**
   * Executes `setCrumbIcons` to handle set crumb icons.
   * @zh 执行 `setCrumbIcons`，用于集合Crumb图标集合。
   */
  private setCrumbIcons(): void {
    if (this._breadcrumbs) {
      const breadcrumbArray: BreadcrumbComponent[] =
        this._breadcrumbs.toArray();
      breadcrumbArray.forEach(
        (breadcrumb: BreadcrumbComponent, index: number) => {
          breadcrumb.separatorIcon = this.separatorIcon;
          // don't show the icon on the last breadcrumb
          breadcrumb.displayIcon = index < breadcrumbArray.length - 1;
        }
      );
    }
  }

  /**
   * Executes `_calculateVisibility` to handle calculate visibility.
   * @zh 执行 `_calculateVisibility`，用于计算Visibility。
   */
  private _calculateVisibility(): void {
    const crumbsArray: BreadcrumbComponent[] = this._breadcrumbs.toArray();
    let crumbWidthSum = 0;
    const hiddenCrumbs: BreadcrumbComponent[] = [];
    const containerWidth = this.nativeElementWidth;
    // loop through crumbs in reverse order to calculate which ones should be removed
    for (let i: number = crumbsArray.length - 1; i >= 0; i--) {
      const breadcrumb: BreadcrumbComponent = crumbsArray[i];

      if (crumbWidthSum + breadcrumb.width > containerWidth) {
        breadcrumb.displayCrumb = false;
        hiddenCrumbs.push(breadcrumb);
      } else {
        // else we show it
        breadcrumb.displayCrumb = true;
      }
      crumbWidthSum += breadcrumb.width;
    }

    this.hiddenBreadcrumbs = hiddenCrumbs;
    this._changeDetectorRef.markForCheck();
  }
}
