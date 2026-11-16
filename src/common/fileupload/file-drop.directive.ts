/**
 * @fileoverview Module `src/common/fileupload/file-drop.directive.ts` providing file drop directive definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-drop.directive.ts`，提供文件放置指令相关的定义与实现。
 */

import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { HostBinding, Renderer2 } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ICanDisable, mixinDisabled } from '@dotos1/dui/core/behaviors';

import { FileUploader, FileUploaderOptions, FilterFunction } from './file-uploader';

/**
 * Class `FileDropBase` encapsulating file drop base data structures and logic in `src/common/fileupload`.
 * @zh 类 `FileDropBase`，封装 `src/common/fileupload` 中的文件放置基础数据结构与处理逻辑。
 */
export class FileDropBase { }
/**
 * Constant/variable `_FileDropMixinBase` defining file drop mixin base in `src/common/fileupload`.
 * @zh 常量/变量 `_FileDropMixinBase`，定义 `src/common/fileupload` 中的文件放置Mixin基础。
 */
export const _FileDropMixinBase = mixinDisabled(FileDropBase);

/**
 * Turns the host element into a file drop zone that queues dropped files into a
 * {@link FileUploader} instance.
 * @zh 将宿主元素变为文件放置区，拖入的文件会被加入到 {@link FileUploader} 实例的上传队列中。
 */
@Directive({
  selector: '[duiFileDrop]',
  inputs: ['disabled'],
  standalone: false
})
export class FileDropDirective extends _FileDropMixinBase implements ICanDisable {
  /**
   * The uploader instance that dropped files are queued into.
   * @zh 拖入的文件会被加入到该上传器实例的队列中。
   */
  @Input() public uploader: FileUploader;
  /**
   * @zh 有文件正拖拽悬停在放置区上方时发出（true/false）。
   * @zh 有文件正拖拽悬停在放置区上方时发出（true/false）。
   */
  @Output() public fileOver = new EventEmitter();
  /**
   * Output event emitter `onFileDrop` (`EventEmitter<File[]>`) firing when on file drop occurs.
   * @zh 文件被放置后发出，携带放下的文件列表。
   * @zh 文件被放置后发出，携带放下的文件列表。
   */
  @Output() public onFileDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  /**
   * Property `element` (`ElementRef<any>`) storing element.
   * @zh 属性 `element`（类型：`ElementRef<any>`），用于存储或配置元素。
   */
  protected element: ElementRef;

  /**
   * Creates an instance of `FileDropDirective` and initializes its dependencies and internal state.
   * @zh 创建 `FileDropDirective` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   */
  public constructor(private _renderer: Renderer2, element: ElementRef) {
    super();
    this.element = element;
  }

  /**
   * Property `_multiple` (`boolean`) storing multiple (default: `false`).
   * @zh 属性 `_multiple`（类型：`boolean`），用于存储或配置多个（默认值：`false`）。
   */
  private _multiple: boolean = false;

  /**
   * Input setter `multiple` updating multiple.
   * @zh 是否允许一次放置多个文件。
   * @zh 是否允许一次放置多个文件。
   */
  @Input('multiple')
  set multiple(multiple: boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }


  /**
   * Host-bound getter `multipleBinding` (`string`) computing multiple binding.
   * @zh 内部使用，绑定宿主的原生 `multiple` 属性。
   * @zh 内部使用，绑定宿主的原生 `multiple` 属性。
   */
  @HostBinding('attr.multiple')
  get multipleBinding(): string {
    return this._multiple ? '' : undefined;
  }

  /**
   * Host-bound getter `disabledBinding` (`string`) computing disabled binding.
   * @zh 内部使用，绑定宿主的原生 `disabled` 属性。
   * @zh 内部使用，绑定宿主的原生 `disabled` 属性。
   */
  @HostBinding('attr.disabled')
  get disabledBinding(): string {
    return this.disabled ? '' : undefined;
  }


  /**
   * Returns the uploader's current options, used when queuing dropped files.
   * @zh 返回上传器当前的选项，用于加入放置的文件时使用。
   */
  public getOptions(): FileUploaderOptions {
    return this.uploader.options;
  }

  /**
   * Returns the filter functions applied when queuing dropped files (none by default).
   * @zh 返回加入放置的文件时应用的过滤函数（默认为空）。
   */
  /** 文件过滤器：返回 undefined 表示用 uploader.options.filters（原来返回 {}，效果相同） */
  public getFilters(): FilterFunction[] | string | undefined {
    return undefined;
  }

  /**
   * @hidden Handles the native `drop` event: queues the dropped files into `uploader`.
   * @zh 内部使用，处理原生 `drop` 事件：将放置的文件加入 `uploader` 队列。
   */
  @HostListener('drop', ['$event'])
  public onDrop(event): void {
    if (!this.disabled) {
      const transfer = this._getTransfer(event);
      if (!transfer) {
        return;
      }
      const options = this.getOptions();
      const filters = this.getFilters();
      this._preventAndStop(event);
      this.uploader.addToQueue(transfer.files, options, filters);
      this.fileOver.emit(false);
      this.onFileDrop.emit(transfer.files);
    }
    //  this._renderer.removeClass(this.element.nativeElement, 'drop-zone');
  }


  /**
   * @hidden Handles the native `dragenter` event: adds the `drop-zone` CSS class.
   * @zh 内部使用，处理原生 `dragenter` 事件：添加 `drop-zone` CSS 类。
   */
  @HostListener('dragenter', ['$event'])
  onDragEnter(event: Event): void {
    if (!this.disabled) {
      this._renderer.addClass(this.element.nativeElement, 'drop-zone');
    }
    this._preventAndStop(event);
  }


  /**
   * @hidden Handles the native `dragover` event: sets the drop effect based on whether files
   * are present, and emits `fileOver(true)` when allowed.
   * @zh 内部使用，处理原生 `dragover` 事件：根据是否存在文件设置放置效果，
   * 并在允许时发出 `fileOver(true)`。
   */
  @HostListener('dragover', ['$event'])
  public onDragOver(event): void {
    const transfer = this._getTransfer(event);
    if (this.disabled || !this._haveFiles(transfer.types)) {
      transfer.dropEffect = 'none';
      return;
    }
    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  /**
   * @hidden Handles the native `dragleave` event: removes the `drop-zone` CSS class and emits `fileOver(false)`.
   * @zh 内部使用，处理原生 `dragleave` 事件：移除 `drop-zone` CSS 类并发出 `fileOver(false)`。
   */
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event) {
    if ((this as unknown as { element? }).element) {
      if (event.currentTarget === (this as unknown as { element? }).element[0]) {
        return;
      }
    }
    this._renderer.removeClass(this.element.nativeElement, 'drop-zone');
    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  /**
   * Executes `_getTransfer` to handle get transfer.
   * @zh 执行 `_getTransfer`，用于获取Transfer。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  protected _getTransfer(event) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  /**
   * Executes `_preventAndStop` to handle prevent and stop.
   * @zh 执行 `_preventAndStop`，用于阻止默认And停止。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   * @returns Result of type `void` / 类型为 `void` 的返回值
   */
  protected _preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Executes `_haveFiles` to handle have files.
   * @zh 执行 `_haveFiles`，用于具有文件列表。
   * @param types - types parameter (`any`) / 类型列表参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  protected _haveFiles(types) {
    if (!types) {
      return false;
    }
    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }
}
