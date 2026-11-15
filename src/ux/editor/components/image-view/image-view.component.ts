/**
 * @fileoverview Module `src/ux/editor/components/image-view/image-view.component.ts` providing image view component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/components/image-view/image-view.component.ts`，提供图像视图组件相关的定义与实现。
 */

import {
  Component, ElementRef, EventEmitter,
  Input, OnDestroy, Output, ViewChild, ChangeDetectionStrategy,
} from '@angular/core';
import { EditorView } from 'prosemirror-view';

/**
 * Angular component `ImageViewComponent` (selector: 'ux-image-view') providing image view component presentation and interaction in `src/ux/editor/components/image-view`.
 * @zh Angular 组件 `ImageViewComponent`（selector: 'ux-image-view'），提供图像视图组件的视图渲染与交互逻辑（位于 `src/ux/editor/components/image-view`）。
 */
@Component({
  selector: 'ux-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  
})

export class ImageViewComponent implements OnDestroy {
  /**
   * Input property `src` (`string`) configuring src.
   * @zh 输入属性 `src`（类型：`string`），用于配置源路径。
   */
  @Input() src: string;
  /**
   * Input property `alt` (`string`) configuring alt (default: `''`).
   * @zh 输入属性 `alt`（类型：`string`），用于配置alt（默认值：`''`）。
   */
  @Input() alt = '';
  /**
   * Input property `title` (`string`) configuring title (default: `''`).
   * @zh 输入属性 `title`（类型：`string`），用于配置标题（默认值：`''`）。
   */
  @Input() title = '';
  /**
   * Input property `outerWidth` (`string`) configuring outer width (default: `''`).
   * @zh 输入属性 `outerWidth`（类型：`string`），用于配置外部宽度（默认值：`''`）。
   */
  @Input() outerWidth = '';
  /**
   * Input property `selected` (`boolean`) configuring selected (default: `false`).
   * @zh 输入属性 `selected`（类型：`boolean`），用于配置已选中（默认值：`false`）。
   */
  @Input() selected = false;
  /**
   * Input property `view` (`EditorView`) configuring view.
   * @zh 输入属性 `view`（类型：`EditorView`），用于配置视图。
   */
  @Input() view: EditorView;

  /**
   * Output event emitter `imageResize` (`EventEmitter<any>`) firing when image resize occurs.
   * @zh 输出事件 `imageResize`（类型：`EventEmitter<any>`），当触发图像调整尺寸时向外发出事件。
   */
  @Output() imageResize = new EventEmitter();

  /**
   * Template/content query reference `imgEl` (`ElementRef<any>`) targeting img el.
   * @zh 模板/内容视图查询引用 `imgEl`（`@ViewChild`），指向图片DOM元素。
   */
  @ViewChild('imgEl', { static: true }) imgEl: ElementRef;

  /**
   * Property `activeCleanup` (`() => void`) storing active cleanup.
   * @zh 属性 `activeCleanup`（类型：`() => void`），用于存储或配置激活Cleanup。
   */
  private activeCleanup?: () => void;

  /**
   * Executes `startResizing` to handle start resizing.
   * @zh 执行 `startResizing`，用于开始调整尺寸中。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   */
  startResizing(e: MouseEvent, direction: string): void {
    e.preventDefault();
    this.resizeImage(e, direction);
  }

  /**
   * Executes `resizeImage` to handle resize image.
   * @zh 执行 `resizeImage`，用于调整尺寸图像。
   * @param evt - evt parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   */
  resizeImage(evt: MouseEvent, direction: string): void {
    this.activeCleanup?.();
    const startX = evt.pageX;
    const startWidth = this.imgEl.nativeElement.clientWidth;

    const isLeftResize = direction === 'left';

    const { width } = window.getComputedStyle(this.view.dom);
    const editorWidth = parseInt(width, 10);

    const onMouseMove = (e: MouseEvent) => {
      const currentX = e.pageX;
      const diffInPx = currentX - startX;
      const computedWidth = isLeftResize ? startWidth - diffInPx : startWidth + diffInPx;

      // prevent image overflow the editor
      // prevent resizng below 20px
      if (computedWidth > editorWidth || computedWidth < 20) {
        return;
      }

      this.outerWidth = `${computedWidth}px`;
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.activeCleanup = undefined;
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      cleanup();
      this.imageResize.emit();
    };

    this.activeCleanup = cleanup;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.activeCleanup?.();
  }
}
