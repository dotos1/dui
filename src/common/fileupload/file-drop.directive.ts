import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { HostBinding, Renderer2 } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CanDisable, mixinDisabled } from '@angular/material/core';

import { FileUploader, FileUploaderOptions } from './file-uploader';

export class FileDropBase { }
export const _FileDropMixinBase = mixinDisabled(FileDropBase);

/**
 * Turns the host element into a file drop zone that queues dropped files into a
 * {@link FileUploader} instance.
 * @zh 将宿主元素变为文件放置区，拖入的文件会被加入到 {@link FileUploader} 实例的上传队列中。
 */
@Directive({
  selector: '[duiFileDrop]',
  inputs: ['disabled']
})
export class FileDropDirective extends _FileDropMixinBase implements CanDisable {
  /**
   * The uploader instance that dropped files are queued into.
   * @zh 拖入的文件会被加入到该上传器实例的队列中。
   */
  @Input() public uploader: FileUploader;
  /** @zh 有文件正拖拽悬停在放置区上方时发出（true/false）。 */
  @Output() public fileOver: EventEmitter<any> = new EventEmitter();
  /** @zh 文件被放置后发出，携带放下的文件列表。 */
  @Output() public onFileDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  protected element: ElementRef;

  public constructor(private _renderer: Renderer2, element: ElementRef) {
    super();
    this.element = element;
  }

  private _multiple: boolean = false;

  /** @zh 是否允许一次放置多个文件。 */
  @Input('multiple')
  set multiple(multiple: boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }


  /** @zh 内部使用，绑定宿主的原生 `multiple` 属性。 */
  @HostBinding('attr.multiple')
  get multipleBinding(): string {
    return this._multiple ? '' : undefined;
  }

  /** @zh 内部使用，绑定宿主的原生 `disabled` 属性。 */
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
  public getFilters(): any {
    return {};
  }

  /**
   * @hidden Handles the native `drop` event: queues the dropped files into `uploader`.
   * @zh 内部使用，处理原生 `drop` 事件：将放置的文件加入 `uploader` 队列。
   */
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
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
  public onDragOver(event: any): void {
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
  public onDragLeave(event: any): any {
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }
    this._renderer.removeClass(this.element.nativeElement, 'drop-zone');
    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  protected _getTransfer(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event: any): any {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types: any): any {
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
