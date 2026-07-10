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

  @Input('multiple')
  set multiple(multiple: boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }


  @HostBinding('attr.multiple')
  get multipleBinding(): string {
    return this._multiple ? '' : undefined;
  }

  @HostBinding('attr.disabled')
  get disabledBinding(): string {
    return this.disabled ? '' : undefined;
  }


  public getOptions(): FileUploaderOptions {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

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


  @HostListener('dragenter', ['$event'])
  onDragEnter(event: Event): void {
    if (!this.disabled) {
      this._renderer.addClass(this.element.nativeElement, 'drop-zone');
    }
    this._preventAndStop(event);
  }


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
