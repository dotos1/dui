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

  @HostBinding('class.mat-mdc-button') matButtonClass = true;
  @HostBinding('class.dui-breadcrumb') tdBreadCrumbClass = true;

  // Sets the icon url shown between breadcrumbs. Defaults to 'chevron_right'
  public get separatorIcon(): string {
    return this._separatorIcon;
  }
  public set separatorIcon(separatorIcon: string) {
    this._separatorIcon = separatorIcon;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  public get displayIcon(): boolean {
    return this._displayIcon;
  }
  public set displayIcon(displayIcon: boolean) {
    this._displayIcon = displayIcon;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  get displayCrumb(): boolean {
    return this._displayCrumb;
  }


  set displayCrumb(shouldDisplay: boolean) {
    this._displayCrumb = shouldDisplay;
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
    });
  }


  get width(): number {
    return this._width;
  }


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


  _handleIconClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
