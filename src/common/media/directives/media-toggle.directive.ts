/**
 * @fileoverview Module `src/common/media/directives/media-toggle.directive.ts` providing media toggle directive definitions and implementation.
 * @zh 模块文件 `src/common/media/directives/media-toggle.directive.ts`，提供媒体开关指令相关的定义与实现。
 */

import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaService } from '../services/media.service';

/**
 * Toggles attributes/classes/styles on the host element based on whether a
 * {@link MediaService} media query (`extMediaToggle`) currently matches.
 * @zh 根据 {@link MediaService} 媒体查询（`extMediaToggle`）当前是否匹配，
 * 在宿主元素上切换属性/类名/样式。
 */
@Directive({
  selector: '[extMediaToggle]',
})
export class MediaToggleDirective implements OnInit, OnDestroy {

  /**
   * Property `_subscription` (`Subscription`) storing subscription.
   * @zh 属性 `_subscription`（类型：`Subscription`），用于存储或配置订阅对象。
   */
  private _subscription: Subscription;
  /**
   * Property `_query` (`string`) storing query.
   * @zh 属性 `_query`（类型：`string`），用于存储或配置查询。
   */
  private _query: string;
  /**
   * Property `_matches` (`boolean`) storing matches (default: `false`).
   * @zh 属性 `_matches`（类型：`boolean`），用于存储或配置匹配（默认值：`false`）。
   */
  private _matches: boolean = false;
  /**
   * Property `_attributes` (`{[key: string]: string}`) storing attributes (default: `{}`).
   * @zh 属性 `_attributes`（类型：`{[key: string]: string}`），用于存储或配置属性列表（默认值：`{}`）。
   */
  private _attributes: {[key: string]: string} = {};
  /**
   * Property `_styles` (`{[key: string]: string}`) storing styles (default: `{}`).
   * @zh 属性 `_styles`（类型：`{[key: string]: string}`），用于存储或配置样式集合（默认值：`{}`）。
   */
  private _styles: {[key: string]: string} = {};
  /**
   * Property `_classes` (`string[]`) storing classes (default: `[]`).
   * @zh 属性 `_classes`（类型：`string[]`），用于存储或配置类名集合（默认值：`[]`）。
   */
  private _classes: string[] = [];

  /**
   * extMediaToggle: string
   * Media query used to evaluate screen/window size.
   * Toggles attributes, classes and styles if media query is matched.

   * @zh 输入属性 `query` 的设置器，用于更新查询。
   */
  @Input('extMediaToggle')
  set query(query: string) {
    if (!query) {
      throw new Error('Query needed for [extMediaToggle] directive.');
    }
    this._query = query;
  }

  /**
   * mediaAttributes: {[key: string]: string}
   * Attributes to be toggled when media query matches.

   * @zh 输入属性 `attributes` 的设置器，用于更新属性列表。
   */
  @Input('mediaAttributes')
  set attributes(attributes) {
    this._attributes = attributes;
  }

  /**
   * mediaClasses: string[]
   * CSS Classes to be toggled when media query matches.

   * @zh 输入属性 `classes` 的设置器，用于更新类名集合。
   */
  @Input('mediaClasses')
  set classes(classes: string[]) {
    this._classes = classes;
  }

  /**
   * mediaStyles: {[key: string]: string}
   * CSS Styles to be toggled when media query matches.

   * @zh 输入属性 `styles` 的设置器，用于更新样式集合。
   */
  @Input('mediaStyles')
  set styles(styles) {
    this._styles = styles;
  }

  /**
   * Creates an instance of `MediaToggleDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MediaToggleDirective` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param _mediaService - Injected or initial media service (`MediaService`) / 注入或传入的媒体服务（`MediaService`）
   */
  constructor(private _renderer: Renderer2, private _elementRef: ElementRef, private _mediaService: MediaService) { }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this._mediaChange(this._mediaService.query(this._query));
    this._subscription = this._mediaService.registerQuery(this._query).subscribe((matches: boolean) => {
      this._mediaChange(matches);
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * Executes `_mediaChange` to handle media change.
   * @zh 执行 `_mediaChange`，用于媒体变更。
   * @param matches - matches parameter (`boolean`) / 匹配参数（`boolean`）
   */
  private _mediaChange(matches: boolean): void {
    this._matches = matches;
    this._changeAttributes();
    this._changeClasses();
    this._changeStyles();
  }

  /**
   * Executes `_changeAttributes` to handle change attributes.
   * @zh 执行 `_changeAttributes`，用于变更属性列表。
   */
  private _changeAttributes(): void {
    for (const attr in this._attributes) {
      if (this._matches) {
        this._renderer.setAttribute(this._elementRef.nativeElement, attr, this._attributes[attr]);
      } else {
        this._renderer.removeAttribute(this._elementRef.nativeElement, attr);
      }
    }
  }

  /**
   * Executes `_changeClasses` to handle change classes.
   * @zh 执行 `_changeClasses`，用于变更类名集合。
   */
  private _changeClasses(): void {
    this._classes.forEach((className: string) => {
      if (this._matches) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
      } else {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
      }
    });
  }

  /**
   * Executes `_changeStyles` to handle change styles.
   * @zh 执行 `_changeStyles`，用于变更样式集合。
   */
  private _changeStyles(): void {
    for (const style in this._styles) {
      if (this._matches) {
        this._renderer.setStyle(this._elementRef.nativeElement, style, this._styles[style]);
      } else {
        this._renderer.removeStyle(this._elementRef.nativeElement, style);
      }
    }
  }
}
