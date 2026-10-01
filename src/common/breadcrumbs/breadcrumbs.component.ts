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
  private _resizing = false;
  private _separatorIcon = 'chevron_right';
  private _destroy$ = new Subject<void>();

  /** @zh 内部使用，始终为 `true`，用于绑定 `dui-breadcrumbs` 宿主类名。 */
  @HostBinding('class.dui-breadcrumbs') tdBreadCrumbsClass = true;

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

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

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

  ngAfterContentInit(): void {
    this._breadcrumbs.changes
      .pipe(startWith(this._breadcrumbs), takeUntil(this._destroy$))
      .subscribe(() => {
        this.setCrumbIcons();
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
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

  private _calculateVisibility(): void {
    const crumbsArray: BreadcrumbComponent[] = this._breadcrumbs.toArray();
    let crumbWidthSum = 0;
    const hiddenCrumbs: BreadcrumbComponent[] = [];
    // loop through crumbs in reverse order to calculate which ones should be removed
    for (let i: number = crumbsArray.length - 1; i >= 0; i--) {
      const breadcrumb: BreadcrumbComponent = crumbsArray[i];

      if (crumbWidthSum + breadcrumb.width > this.nativeElementWidth) {
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
