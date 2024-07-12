import {
  Directive, EventEmitter, ElementRef, Input,  Host,
  HostListener, Output, Optional, Inject, InjectionToken, HostBinding, OnChanges
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgModel } from '@angular/forms';
import { FileUploader, ResizeOptions, ImageFileProcessor, ImageResult } from './file-uploader';
import { fileToDataURL, getImageTypeFromDataUrl, resizeImage } from './utils';

export const IMAGE_FILE_PROCESSOR = new InjectionToken<ImageFileProcessor>('ImageFileProcessor');

@Directive({ selector: '[duiFileSelect]' })
export class FileSelectDirective implements OnChanges{
  @Input() public uploader: FileUploader;

  @Output() public onFileSelected: EventEmitter<File[] | FileList | File> = new EventEmitter<File[] | FileList | File>();

  @Output() imageSelected = new EventEmitter<ImageResult>();


  protected element: ElementRef;

  private _multiple: boolean = false;

  @Input('multiple')
  set multiple(multiple: boolean) {
    this._multiple = coerceBooleanProperty(multiple);
  }

  @HostBinding('attr.multiple')
  get multipleBinding(): string {
    return this._multiple ? '' : undefined;
  }

  @HostBinding('attr.accept')
  get accept(): string {
    let options = this.getOptions();
    if (options.allowedFileType) {
      options.allowedFileType = options.allowedFileType.map(ext => ext.toLowerCase());
      let accepts = options.allowedFileType;
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
    let options = this.uploader.options;
    if (!options.resize) {
      this.uploader.options.resize = {};
    }
    if (options.allowedFileType) {
      options.allowedFileType = options.allowedFileType.map(ext => ext.toLowerCase());
    }
  }

  @HostListener('change', ['$event'])
  async readFiles(event) {
    const files = this.element.nativeElement.files;
    const options = this.getOptions();
    const filters = this.getFilters();
    if (files.length > 0) {
      const value: FileList | File = this._multiple ? (files.length > 1 ? files : files[0]) : files[0];
      this.model ? this.model.update.emit(value) : this.onFileSelected.emit(value);
    }
    this.uploader.addToQueue(files, options, filters);
    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
    for (let file of event.target.files as File[]) {
      const result: ImageResult = {
        file,
        url: URL.createObjectURL(file)
      };
      let ext: string = file.name.split('.').pop();
      ext = ext && ext.toLowerCase();

      if (ext && options.allowedFileType
        && options.allowedFileType.length
        && options.allowedFileType.indexOf('.' + ext) === -1) {
        result.error = new Error('Extension Not Allowed');
      } else {
        try {
          result.dataURL = await fileToDataURL(file);
          for (const processor of this.imageFileProcessors) {
            result.dataURL = await processor.process(result.dataURL);
          }
          result.resized = await this.resize(result.dataURL, options.resize);
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

  public getOptions(): any {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }
}
