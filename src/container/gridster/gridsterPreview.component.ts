/**
 * @fileoverview Module `src/container/gridster/gridsterPreview.component.ts` providing gridster preview component definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterPreview.component.ts`，提供网格拖拽布局预览组件相关的定义与实现。
 */

import {Component, ElementRef, OnDestroy, Renderer2, ViewEncapsulation, Inject} from '@angular/core';

import {GridsterComponent} from './gridster.component';

/**
 * Angular component `GridsterPreviewComponent` (selector: 'gridster-preview') providing gridster preview component presentation and interaction in `src/container/gridster`.
 * @zh Angular 组件 `GridsterPreviewComponent`（selector: 'gridster-preview'），提供网格拖拽布局预览组件的视图渲染与交互逻辑（位于 `src/container/gridster`）。
 */
@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrls: ['./gridsterPreview.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-gridster-preview' + Math.random().toString(36).substring(2, 15),
  }
})
export class GridsterPreviewComponent implements OnDestroy {
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `gridster` (`GridsterComponent`) storing gridster.
   * @zh 属性 `gridster`（类型：`GridsterComponent`），用于存储或配置网格拖拽布局。
   */
  gridster: GridsterComponent;

  /**
   * Creates an instance of `GridsterPreviewComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GridsterPreviewComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param gridster - Injected or initial gridster (`GridsterComponent`) / 注入或传入的网格拖拽布局（`GridsterComponent`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(@Inject(ElementRef)  el: ElementRef,  gridster: GridsterComponent, @Inject(Renderer2) public renderer: Renderer2) {
    this.el = el.nativeElement;
    this.gridster = gridster;
    this.gridster.previewStyle = this.previewStyle.bind(this);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    delete this.el;
    delete this.gridster.previewStyle;
    delete this.gridster;
  }

  /**
   * Executes `previewStyle` to handle preview style.
   * @zh 执行 `previewStyle`，用于预览样式。
   * @param drag - drag parameter (`boolean`) / 拖拽参数（`boolean`）
   */
  previewStyle(drag?: boolean): void {
    if (!this.gridster.movingItem) {
      this.renderer.setStyle(this.el, 'display', '');
    } else {
      if (this.gridster.compact && drag) {
        this.gridster.compact.checkCompactItem(this.gridster.movingItem);
      }
      this.renderer.setStyle(this.el, 'display', 'block');
      this.gridster.gridRenderer.updateItem(this.el, this.gridster.movingItem, this.renderer);
    }
  }
}
