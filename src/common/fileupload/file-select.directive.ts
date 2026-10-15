import {
  Directive, EventEmitter, ElementRef, Input,  Host,
  HostListener, Output, Optional, Inject, InjectionToken, HostBinding, OnChanges
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgModel } from '@angular/forms';
import { FileUploader, ResizeOptions, ImageFileProcessor, ImageResult } from './file-uploader';
import { fileToDataURL, getImageTypeFromDataUrl, resizeImage } from './utils';

export const IMAGE_FILE_PROCESSOR = new InjectionToken<ImageFileProcessor>('ImageFileProcessor');

/**
 * Attach to a native `<input type="file">` to queue selected files into a {@link FileUploader},
 * with optional client-side image resizing/processing via `imageSelected`.
 * @zh 附加到原生 `<input type="file">` 上，将选中的文件加入 {@link FileUploader} 队列，
 * 并通过 `imageSelected` 提供可选的客户端图片缩放/处理结果。
 */
@Directive({ selector: '[duiFileSelect]' })
export class FileSelectDirective implements OnChanges{
  /**
   * The uploader instance that selected files are queued into.
   * @zh 选中的文件会被加入到该上传器实例的队列中。
   */
  @Input() public uploader: FileUploader;

  /** @zh 文件选择完成后发出。 */
  @Output() public onFileSelected: EventEmitter<File[] | FileList | File> = new EventEmitter<File[] | FileList | File>();

  /**
   * Emits per-selected-image results (data URL, optional resize, or error) once processed.
   * @zh 每张被选中的图片处理完成后发出结果（data URL、可选的缩放结果，或错误）。
   */
  @Output() imageSelected = new EventEmitter<ImageResult>();


  protected element: ElementRef;

  private _multiple: boolean = false;

  /** @zh 是否允许一次选择多个文件。 */
  @Input('multiple')
  set multiple(multiple: boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }

  /** @zh 内部使用，绑定宿主的原生 `multiple` 属性。 */
  @HostBinding('attr.multiple')
  get multipleBinding(): string {
    return this._multiple ? '' : undefined;
  }

  /**
   * The native `accept` attribute value, derived from the uploader's `allowedFileType` option.
   * @zh 原生 `accept` 属性值，根据上传器的 `allowedFileType` 选项推导得出。
   */
  @HostBinding('attr.accept')
  get accept(): string {
    const options = this.getOptions();
    if (options?.allowedFileType) {
      const accepts = options.allowedFileType.map(ext => ext.toLowerCase());
      return accepts.join(",");
    } else {
      return undefined;
    }
  }

  public constructor(element: ElementRef,
    @Optional() @Host() private model: NgModel,
    @Optional() @Inject(IMAGE_FILE_PROCESSOR) private imageFileProcessors: ImageFileProcessor[]) {
    this.element = element;
    this.imageFileProcessors = imageFileProcessors || [];
  }

  ngOnChanges(): void {
    let options = this.uploader?.options;
    if (!options) {
      return;
    }
    if (!options.resize) {
      this.uploader.options.resize = {};
    }
    if (options.allowedFileType) {
      options.allowedFileType = options.allowedFileType.map(ext => ext.toLowerCase());
    }
  }

  /**
   * @hidden Handles the native `change` event: queues selected files into `uploader` and emits
   * `onFileSelected`/`imageSelected` results.
   * @zh 内部使用，处理原生 `change` 事件：将选中的文件加入 `uploader` 队列，
   * 并发出 `onFileSelected`/`imageSelected` 结果。
   */
  @HostListener('change', ['$event'])
  async readFiles(event) {
    const fileList: FileList = this.element.nativeElement.files;
    const files: File[] = fileList ? Array.from(fileList) : [];
    const options = this.getOptions();
    const filters = this.getFilters();
    const allowedTypes = options?.allowedFileType ? options.allowedFileType.map((ext: string) => ext.toLowerCase()) : undefined;
    // 先发 onFileSelected 再入队,uploader 可以不绑(b8c5e5c 复核)。
    // iotos 的 file-input 就只用 duiFileSelect + (onFileSelected),没有 [uploader]:
    // b8c5e5c 把 this.uploader.addToQueue 挪到 emit 前面,uploader 为空时这里先抛
    // TypeError,onFileSelected 永远不发,选了文件界面上什么都不发生。
    if (files.length > 0) {
      const value: File[] | FileList | File = this._multiple ? (files.length > 1 ? fileList : files[0]) : files[0];
      this.model ? this.model.update.emit(value) : this.onFileSelected.emit(value);
    }
    this.uploader?.addToQueue(files, options, filters);
    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
    for (let file of files) {
      const result: ImageResult = {
        file,
        url: URL.createObjectURL(file)
      };
      let ext: string = file.name.split('.').pop();
      ext = ext && ext.toLowerCase();

      if (ext && allowedTypes
        && allowedTypes.length
        && allowedTypes.indexOf('.' + ext) === -1) {
        result.error = new Error('Extension Not Allowed');
      } else {
        try {
          result.dataURL = await fileToDataURL(file);
          for (const processor of this.imageFileProcessors) {
            result.dataURL = await processor.process(result.dataURL);
          }
          result.resized = await this.resize(result.dataURL, options?.resize);
        } catch (e) {
          result.error = e;
        }
      }
      this.imageSelected.emit(result);
    }
  }

  private async resize(dataURL: string, options: ResizeOptions): Promise<{ dataURL: string, type: string }> {
    if (!options) return null;
    const resisedDataUrl = await resizeImage(dataURL, options);
    return {
      dataURL: resisedDataUrl,
      type: getImageTypeFromDataUrl(resisedDataUrl)
    };
  }

  /**
   * Returns the uploader's current options, used when queuing selected files.
   * @zh 返回上传器当前的选项，用于加入选中的文件时使用。
   */
  public getOptions(): any {
    return this.uploader ? this.uploader.options : undefined;
  }

  /**
   * Returns the filter functions applied when queuing selected files (none by default).
   * @zh 返回加入选中的文件时应用的过滤函数（默认为空）。
   */
  public getFilters(): any {
    return {};
  }

  /**
   * Whether the native `<input>` value should be cleared after selection (when `multiple` is set).
   * @zh 选择完成后是否应清空原生 `<input>` 的值（当设置了 `multiple` 时）。
   */
  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }
}
