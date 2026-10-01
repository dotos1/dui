import {
  Component,
  ElementRef,
  HostBinding,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

/**
 * A single crumb item rendered inside {@link BreadcrumbsComponent}.
 * @zh {@link BreadcrumbsComponent} 内渲染的单个面包屑项。
 */
@Component({
  selector: 'dui-breadcrumb, a[dui-breadcrumb]',
  styleUrls: ['./breadcrumb.component.scss'],
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements AfterViewInit {
  private _displayCrumb = true;
  private _width = 0;
  private _displayIcon = true;
  private _separatorIcon = 'chevron_right';

  /** @zh 内部使用，始终为 `true`，用于绑定 Material 按钮宿主类名。 */
  @HostBinding('class.mat-mdc-button') matButtonClass = true;
  /** @zh 内部使用，始终为 `true`，用于绑定 `dui-breadcrumb` 宿主类名。 */
  @HostBinding('class.dui-breadcrumb') tdBreadCrumbClass = true;

  /**
   * The Material icon name shown as the separator after this crumb. Set by the parent
   * {@link BreadcrumbsComponent}. Defaults to `chevron_right`.
   * @zh 显示在本面包屑项之后的分隔符 Material 图标名称，由父级 {@link BreadcrumbsComponent} 设置，
   * 默认为 `chevron_right`。
   */
  public get separatorIcon(): string {
    return this._separatorIcon;
  }
  /**
   * The Material icon name shown as the separator after this crumb. Set by the parent
   * {@link BreadcrumbsComponent}. Defaults to `chevron_right`.
   * @zh 显示在本面包屑项之后的分隔符 Material 图标名称，由父级 {@link BreadcrumbsComponent} 设置，
   * 默认为 `chevron_right`。
   */
  public set separatorIcon(separatorIcon: string) {
    this._separatorIcon = separatorIcon;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Whether the separator icon is shown after this crumb (`false` for the last crumb).
   * @zh 是否在本面包屑项之后显示分隔符图标（最后一项为 `false`）。
   */
  public get displayIcon(): boolean {
    return this._displayIcon;
  }
  /**
   * Whether the separator icon is shown after this crumb (`false` for the last crumb).
   * @zh 是否在本面包屑项之后显示分隔符图标（最后一项为 `false`）。
   */
  public set displayIcon(displayIcon: boolean) {
    this._displayIcon = displayIcon;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Whether this crumb is currently displayed (set to `false` by the parent when it no longer
   * fits the available width).
   * @zh 本面包屑项当前是否显示（当父容器宽度不足时会被父级设置为 `false`）。
   */
  get displayCrumb(): boolean {
    return this._displayCrumb;
  }


  /**
   * Whether this crumb is currently displayed (set to `false` by the parent when it no longer
   * fits the available width).
   * @zh 本面包屑项当前是否显示（当父容器宽度不足时会被父级设置为 `false`）。
   */
  set displayCrumb(shouldDisplay: boolean) {
    this._displayCrumb = shouldDisplay;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }


  /**
   * The crumb's rendered width in pixels, measured after view init.
   * @zh 面包屑项渲染后的宽度（像素），在视图初始化后测量得出。
   */
  get width(): number {
    return this._width;
  }


  /** @zh 内部使用，绑定宿主的 `display` 样式，隐藏时设置为 `'none'`。 */
  @HostBinding('style.display')
  get displayBinding(): string | undefined {
      return this._displayCrumb ? undefined : 'none';
  }

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._width = (<HTMLElement>(
        this._elementRef.nativeElement
      )).getBoundingClientRect().width;
      this._changeDetectorRef.markForCheck();
    });
  }


  /**
   * @hidden Stops the separator icon's click from bubbling up to the crumb's own click handler.
   * @zh 内部使用，阻止分隔符图标的点击事件冒泡到面包屑项自身的点击处理器。
   */
  _handleIconClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
