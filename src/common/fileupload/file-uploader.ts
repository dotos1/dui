/**
 * @fileoverview Module `src/common/fileupload/file-uploader.ts` providing file uploader definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-uploader.ts`，提供文件上传器相关的定义与实现。
 */

import { EventEmitter } from '@angular/core';
import { FileLikeObject } from './file-like-object';
import { FileItem } from './file-item';
import { FileType } from './file-type';

/**
 * Executes `isFile` to handle is file.
 * @zh 执行 `isFile`，用于是否为文件。
 * @param value - value parameter (`any`) / 值参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isFile(value): boolean {
  return (File && value instanceof File);
}

/**
 * Interface `Headers` defining the contract and properties for headers.
 * @zh 接口 `Headers`，定义请求头的数据结构契约与属性规范。
 */
export interface Headers {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
}

/**
 * Interface `ImageResult` defining the contract and properties for image result.
 * @zh 接口 `ImageResult`，定义图像结果的数据结构契约与属性规范。
 */
export interface ImageResult {
  /**
   * Property `file` (`File`) storing file.
   * @zh 属性 `file`（类型：`File`），用于存储或配置文件。
   */
  file: File;
  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  url: string;
  /**
   * Property `dataURL` (`string`) storing data url.
   * @zh 属性 `dataURL`（类型：`string`），用于存储或配置数据链接地址。
   */
  dataURL?: string;
  /**
   * Property `error` (`any`) storing error.
   * @zh 属性 `error`（类型：`any`），用于存储或配置错误。
   */
  error?;
  /**
   * Property `resized` (`{ dataURL: string; type: string; }`) storing resized.
   * @zh 属性 `resized`（类型：`{ dataURL: string; type: string; }`），用于存储或配置已调整尺寸。
   */
  resized?: {
    dataURL: string;
    type: string;
  }
}

/**
 * Interface `ImageFileProcessor` defining the contract and properties for image file processor.
 * @zh 接口 `ImageFileProcessor`，定义图像文件处理器的数据结构契约与属性规范。
 */
export interface ImageFileProcessor {
  /**
   * Executes `process` to handle process.
   * @zh 执行 `process`，用于处理。
   * @param dateURL - date url parameter (`string`) / 日期链接地址参数（`string`）
   * @returns Result of type `Promise<string>` / 类型为 `Promise<string>` 的返回值
   */
  process(dateURL: string): Promise<string>;
}

/**
 * Type alias `ParsedResponseHeaders` representing parsed response headers (`{ [headerFieldName: string]: string }`).
 * @zh 类型别名 `ParsedResponseHeaders`，表示已解析响应请求头（`{ [headerFieldName: string]: string }`）。
 */
export type ParsedResponseHeaders = { [headerFieldName: string]: string };

/**
 * Type alias `FilterFunction` representing filter function (`{ name: string, fn: (item?: FileLikeObject, options?: FileUploaderOpti...`).
 * @zh 类型别名 `FilterFunction`，表示过滤函数（`{ name: string, fn: (item?: FileLikeObject, options?: FileUploaderOpti...`）。
 */
export type FilterFunction = {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string,
  /**
   * Property `fn` (`(item?: FileLikeObject, options?: FileUploaderOptions) => boolean`) storing fn.
   * @zh 属性 `fn`（类型：`(item?: FileLikeObject, options?: FileUploaderOptions) => boolean`），用于存储或配置函数。
   */
  fn: (item?: FileLikeObject, options?: FileUploaderOptions) => boolean
};

/**
 * Interface `ResizeOptions` defining the contract and properties for resize options.
 * @zh 接口 `ResizeOptions`，定义调整尺寸配置选项的数据结构契约与属性规范。
 */
export interface ResizeOptions {
  /**
   * Property `maxHeight` (`number`) storing max height.
   * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
   */
  maxHeight?: number;
  /**
   * Property `maxWidth` (`number`) storing max width.
   * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
   */
  maxWidth?: number;
  /**
   * Property `quality` (`number`) storing quality.
   * @zh 属性 `quality`（类型：`number`），用于存储或配置quality。
   */
  quality?: number;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?: string;
}

/**
 * Interface `FileUploaderOptions` defining the contract and properties for file uploader options.
 * @zh 接口 `FileUploaderOptions`，定义文件上传器配置选项的数据结构契约与属性规范。
 */
export interface FileUploaderOptions {
  /**
   * Property `allowedMimeType` (`string[]`) storing allowed mime type.
   * @zh 属性 `allowedMimeType`（类型：`string[]`），用于存储或配置允许的MIME类型类型。
   */
  allowedMimeType?: string[];
  /**
   * Property `allowedFileType` (`string[]`) storing allowed file type.
   * @zh 属性 `allowedFileType`（类型：`string[]`），用于存储或配置允许的文件类型。
   */
  allowedFileType?: string[];
  /**
   * Property `autoUpload` (`boolean`) storing auto upload.
   * @zh 属性 `autoUpload`（类型：`boolean`），用于存储或配置自动上传。
   */
  autoUpload?: boolean;
  /**
   * Property `resize` (`ResizeOptions`) storing resize.
   * @zh 属性 `resize`（类型：`ResizeOptions`），用于存储或配置调整尺寸。
   */
  resize?: ResizeOptions;
  /**
   * Property `isHTML5` (`boolean`) storing is html5.
   * @zh 属性 `isHTML5`（类型：`boolean`），用于存储或配置是否为HTML5。
   */
  isHTML5?: boolean;
  /**
   * Property `filters` (`FilterFunction[]`) storing filters.
   * @zh 属性 `filters`（类型：`FilterFunction[]`），用于存储或配置过滤器列表。
   */
  filters?: FilterFunction[];
  /**
   * Property `headers` (`Headers[]`) storing headers.
   * @zh 属性 `headers`（类型：`Headers[]`），用于存储或配置请求头。
   */
  headers?: Headers[];
  /**
   * Property `method` (`string`) storing method.
   * @zh 属性 `method`（类型：`string`），用于存储或配置方法。
   */
  method?: string;
  /**
   * Property `authToken` (`string`) storing auth token.
   * @zh 属性 `authToken`（类型：`string`），用于存储或配置认证令牌。
   */
  authToken?: string;
  /**
   * Property `maxFileSize` (`number`) storing max file size.
   * @zh 属性 `maxFileSize`（类型：`number`），用于存储或配置最大值文件尺寸。
   */
  maxFileSize?: number;
  /**
   * Property `queueLimit` (`number`) storing queue limit.
   * @zh 属性 `queueLimit`（类型：`number`），用于存储或配置队列限制。
   */
  queueLimit?: number;
  /**
   * Property `removeAfterUpload` (`boolean`) storing remove after upload.
   * @zh 属性 `removeAfterUpload`（类型：`boolean`），用于存储或配置移除之后上传。
   */
  removeAfterUpload?: boolean;
  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  url?: string;
  /**
   * Property `disableMultipart` (`boolean`) storing disable multipart.
   * @zh 属性 `disableMultipart`（类型：`boolean`），用于存储或配置禁用Multipart。
   */
  disableMultipart?: boolean;
  /**
   * Property `itemAlias` (`string`) storing item alias.
   * @zh 属性 `itemAlias`（类型：`string`），用于存储或配置条目Alias。
   */
  itemAlias?: string;
  /**
   * Property `authTokenHeader` (`string`) storing auth token header.
   * @zh 属性 `authTokenHeader`（类型：`string`），用于存储或配置认证令牌表头。
   */
  authTokenHeader?: string;
  /**
   * Property `additionalParameter` (`{ [key: string]: any }`) storing additional parameter.
   * @zh 属性 `additionalParameter`（类型：`{ [key: string]: any }`），用于存储或配置additional参数。
   */
  additionalParameter?: { [key: string]: unknown };
  /**
   * Property `parametersBeforeFiles` (`boolean`) storing parameters before files.
   * @zh 属性 `parametersBeforeFiles`（类型：`boolean`），用于存储或配置参数列表之前文件列表。
   */
  parametersBeforeFiles?: boolean;
  /**
   * Property `formatDataFunction` (`Function`) storing format data function.
   * @zh 属性 `formatDataFunction`（类型：`Function`），用于存储或配置格式化数据函数。
   */
  formatDataFunction?: Function;
  /**
   * Property `formatDataFunctionIsAsync` (`boolean`) storing format data function is async.
   * @zh 属性 `formatDataFunctionIsAsync`（类型：`boolean`），用于存储或配置格式化数据函数是否为Async。
   */
  formatDataFunctionIsAsync?: boolean;
}

/**
 * Manages an upload queue of {@link FileItem}s: adding/filtering files, tracking overall
 * progress, and driving each item's XHR upload.
 * @zh 管理上传队列中的 {@link FileItem}：添加/过滤文件、跟踪整体进度，
 * 并驱动每个条目的 XHR 上传。
 */
export class FileUploader {

  /**
   * Property `authToken` (`string`) storing auth token.
   * @zh 属性 `authToken`（类型：`string`），用于存储或配置认证令牌。
   */
  public authToken: string;
  /**
   * Property `isUploading` (`boolean`) storing is uploading (default: `false`).
   * @zh 属性 `isUploading`（类型：`boolean`），用于存储或配置是否为上传（默认值：`false`）。
   */
  public isUploading: boolean = false;
  /**
   * Property `queue` (`FileItem[]`) storing queue (default: `[]`).
   * @zh 属性 `queue`（类型：`FileItem[]`），用于存储或配置队列（默认值：`[]`）。
   */
  public queue: FileItem[] = [];
  /**
   * Property `progress` (`number`) storing progress (default: `0`).
   * @zh 属性 `progress`（类型：`number`），用于存储或配置进度条（默认值：`0`）。
   */
  public progress: number = 0;
  /**
   * Property `_nextIndex` (`number`) storing next index (default: `0`).
   * @zh 属性 `_nextIndex`（类型：`number`），用于存储或配置下一个索引（默认值：`0`）。
   */
  public _nextIndex: number = 0;
  /**
   * Property `autoUpload` (`any`) storing auto upload.
   * @zh 属性 `autoUpload`（类型：`any`），用于存储或配置自动上传。
   */
  public autoUpload;
  /**
   * Property `authTokenHeader` (`string`) storing auth token header.
   * @zh 属性 `authTokenHeader`（类型：`string`），用于存储或配置认证令牌表头。
   */
  public authTokenHeader: string;
  /**
   * Property `uploaderResponse` (`EventEmitter<any>`) storing uploader response.
   * @zh 属性 `uploaderResponse`（类型：`EventEmitter<any>`），用于存储或配置上传器响应。
   */
  public uploaderResponse;

  /**
   * Property `options` (`FileUploaderOptions`) storing options.
   * @zh 属性 `options`（类型：`FileUploaderOptions`），用于存储或配置配置选项。
   */
  public options: FileUploaderOptions = {
    autoUpload: false,
    isHTML5: true,
    filters: [],
    removeAfterUpload: false,
    disableMultipart: false,
    formatDataFunction: (item: FileItem) => item._file,
    formatDataFunctionIsAsync: false
  };

  /**
   * Property `_failFilterIndex` (`number`) storing fail filter index.
   * @zh 属性 `_failFilterIndex`（类型：`number`），用于存储或配置失败过滤索引。
   */
  protected _failFilterIndex: number;

  /**
   * Creates an instance of `FileUploader` and initializes its dependencies and internal state.
   * @zh 创建 `FileUploader` 实例，并初始化其依赖项与内部状态。
   * @param options - Injected or initial options (`FileUploaderOptions`) / 注入或传入的配置选项（`FileUploaderOptions`）
   */
  public constructor(options: FileUploaderOptions) {
    this.setOptions(options);
    this.uploaderResponse = new EventEmitter();
  }

  /**
   * Executes `setOptions` to handle set options.
   * @zh 执行 `setOptions`，用于集合配置选项。
   * @param options - options parameter (`FileUploaderOptions`) / 配置选项参数（`FileUploaderOptions`）
   */
  public setOptions(options: FileUploaderOptions): void {
    this.options = Object.assign(this.options, options);

    this.authToken = this.options.authToken;
    this.authTokenHeader = this.options.authTokenHeader || 'Authorization';
    this.autoUpload = this.options.autoUpload;
    this.options.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });

    if (this.options.maxFileSize) {
      this.options.filters.unshift({ name: 'fileSize', fn: this._fileSizeFilter });
    }

    if (this.options.allowedFileType) {
      this.options.filters.unshift({ name: 'fileType', fn: this._fileTypeFilter });
    }

    if (this.options.allowedMimeType) {
      this.options.filters.unshift({ name: 'mimeType', fn: this._mimeTypeFilter });
    }

    for (let i = 0; i < this.queue.length; i++) {
      this.queue[i].url = this.options.url;
    }
  }

  /**
   * Executes `addToQueue` to handle add to queue.
   * @zh 执行 `addToQueue`，用于添加转换为队列。
   * @param files - files parameter (`File[]`) / 文件列表参数（`File[]`）
   * @param options - options parameter (`FileUploaderOptions`) / 配置选项参数（`FileUploaderOptions`）
   * @param filters - filters parameter (`FilterFunction[] | string`) / 过滤器列表参数（`FilterFunction[] | string`）
   */
  public addToQueue(files: File[] , options?: FileUploaderOptions, filters?: FilterFunction[] | string): void {
    const list: File[] = [];
    for (const file of files) {
      list.push(file);
    }

    const arrayOfFilters = this._getFilters(filters);
    const count = this.queue.length;
    const addedFileItems: FileItem[] = [];
    list.map((some: File) => {
      if (!options) {
        options = this.options;
      }

      const temp = new FileLikeObject(some);
      if (this._isValidFile(temp, arrayOfFilters, options)) {
        const fileItem = new FileItem(this, some, options);
        addedFileItems.push(fileItem);
        this.queue.push(fileItem);
        this._onAfterAddingFile(fileItem);
      } else {
        const filter = arrayOfFilters[this._failFilterIndex];
        this._onWhenAddingFileFailed(temp, filter, options);
      }
    });
    if (this.queue.length !== count) {
      this._onAfterAddingAll(addedFileItems);
      this.progress = this._getTotalProgress();
    }
    this._render();
    if (this.options.autoUpload) {
      this.uploadAll();
    }
  }

  /**
   * Executes `removeFromQueue` to handle remove from queue.
   * @zh 执行 `removeFromQueue`，用于移除从队列。
   * @param value - value parameter (`FileItem`) / 值参数（`FileItem`）
   */
  public removeFromQueue(value: FileItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    if (item.isUploading) {
      item.cancel();
    }
    this.queue.splice(index, 1);
    this.progress = this._getTotalProgress();
  }

  /**
   * Executes `clearQueue` to handle clear queue.
   * @zh 执行 `clearQueue`，用于清空队列。
   */
  public clearQueue(): void {
    while (this.queue.length) {
      this.queue[0].remove();
    }
    this.progress = 0;
  }

  /**
   * Executes `uploadItem` to handle upload item.
   * @zh 执行 `uploadItem`，用于上传条目。
   * @param value - value parameter (`FileItem`) / 值参数（`FileItem`）
   */
  public uploadItem(value: FileItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    const transport = this.options.isHTML5 ? '_xhrTransport' : '_iframeTransport';
    item._prepareToUploading();
    if (this.isUploading) {
      return;
    }
    this.isUploading = true;
    (this as unknown)[transport](item);
  }

  /**
   * Executes `cancelItem` to handle cancel item.
   * @zh 执行 `cancelItem`，用于取消条目。
   * @param value - value parameter (`FileItem`) / 值参数（`FileItem`）
   */
  public cancelItem(value: FileItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    const prop = this.options.isHTML5 ? item._xhr : item._form;
    if (item && item.isUploading) {
      prop.abort();
    }
  }

  /**
   * Executes `uploadAll` to handle upload all.
   * @zh 执行 `uploadAll`，用于上传全部。
   */
  public uploadAll(): void {
    const items = this.getNotUploadedItems().filter((item: FileItem) => !item.isUploading);
    if (!items.length) {
      return;
    }
    items.map((item: FileItem) => item._prepareToUploading());
    items[0].upload();
  }

  /**
   * Executes `cancelAll` to handle cancel all.
   * @zh 执行 `cancelAll`，用于取消全部。
   */
  public cancelAll(): void {
    const items = this.getNotUploadedItems();
    items.forEach((item: FileItem) => {
      if (!item.isUploading) {
        item.isReady = false;
        item.isCancel = true;
      }
    });
    items.map((item: FileItem) => item.cancel());
  }

  /**
   * Executes `isFile` to handle is file.
   * @zh 执行 `isFile`，用于是否为文件。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public isFile(value): boolean {
    return isFile(value);
  }

  /**
   * Executes `isFileLikeObject` to handle is file like object.
   * @zh 执行 `isFileLikeObject`，用于是否为文件Like对象。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public isFileLikeObject(value): boolean {
    return value instanceof FileLikeObject;
  }

  /**
   * Executes `getIndexOfItem` to handle get index of item.
   * @zh 执行 `getIndexOfItem`，用于获取索引的条目。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  public getIndexOfItem(value): number {
    return typeof value === 'number' ? value : this.queue.indexOf(value);
  }

  /**
   * Executes `getNotUploadedItems` to handle get not uploaded items.
   * @zh 执行 `getNotUploadedItems`，用于获取Not已上传条目列表。
   * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
   */
  public getNotUploadedItems() {
    return this.queue.filter((item: FileItem) => !item.isUploaded);
  }

  /**
   * Executes `getReadyItems` to handle get ready items.
   * @zh 执行 `getReadyItems`，用于获取就绪条目列表。
   * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
   */
  public getReadyItems() {
    return this.queue
      .filter((item: FileItem) => (item.isReady && !item.isUploading))
      .sort((item1: { index? }, item2: { index? }) => item1.index - item2.index);
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  public destroy(): void {
    return void 0;
  }

  /**
   * Executes `onAfterAddingAll` to handle on after adding all.
   * @zh 执行 `onAfterAddingAll`，用于当之后添加全部。
   * @param fileItems - file items parameter (`any`) / 文件条目列表参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onAfterAddingAll(fileItems) {
    return { fileItems };
  }

  /**
   * Executes `onBuildItemForm` to handle on build item form.
   * @zh 执行 `onBuildItemForm`，用于当构建条目表单。
   * @param fileItem - file item parameter (`FileItem`) / 文件条目参数（`FileItem`）
   * @param form - form parameter (`any`) / 表单参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onBuildItemForm(fileItem: FileItem, form) {
    return { fileItem, form };
  }

  /**
   * Executes `onAfterAddingFile` to handle on after adding file.
   * @zh 执行 `onAfterAddingFile`，用于当之后添加文件。
   * @param fileItem - file item parameter (`FileItem`) / 文件条目参数（`FileItem`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onAfterAddingFile(fileItem: FileItem) {
    return { fileItem };
  }

  /**
   * Executes `onWhenAddingFileFailed` to handle on when adding file failed.
   * @zh 执行 `onWhenAddingFileFailed`，用于当When添加文件失败。
   * @param item - item parameter (`FileLikeObject`) / 条目参数（`FileLikeObject`）
   * @param filter - filter parameter (`any`) / 过滤参数（`any`）
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onWhenAddingFileFailed(item: FileLikeObject, filter, options) {
    return { item, filter, options };
  }

  /**
   * Executes `onBeforeUploadItem` to handle on before upload item.
   * @zh 执行 `onBeforeUploadItem`，用于当之前上传条目。
   * @param fileItem - file item parameter (`FileItem`) / 文件条目参数（`FileItem`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onBeforeUploadItem(fileItem: FileItem) {
    return { fileItem };
  }

  /**
   * Executes `onProgressItem` to handle on progress item.
   * @zh 执行 `onProgressItem`，用于当进度条条目。
   * @param fileItem - file item parameter (`FileItem`) / 文件条目参数（`FileItem`）
   * @param progress - progress parameter (`any`) / 进度条参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onProgressItem(fileItem: FileItem, progress) {
    return { fileItem, progress };
  }

  /**
   * Executes `onProgressAll` to handle on progress all.
   * @zh 执行 `onProgressAll`，用于当进度条全部。
   * @param progress - progress parameter (`any`) / 进度条参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onProgressAll(progress) {
    return { progress };
  }

  /**
   * Executes `onSuccessItem` to handle on success item.
   * @zh 执行 `onSuccessItem`，用于当成功条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    return { item, response, status, headers };
  }

  /**
   * Executes `onErrorItem` to handle on error item.
   * @zh 执行 `onErrorItem`，用于当错误条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    return { item, response, status, headers };
  }

  /**
   * Executes `onCancelItem` to handle on cancel item.
   * @zh 执行 `onCancelItem`，用于当取消条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    return { item, response, status, headers };
  }

  /**
   * Executes `onCompleteItem` to handle on complete item.
   * @zh 执行 `onCompleteItem`，用于当完成条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) {
    return { item, response, status, headers };
  }

  /**
   * Executes `onCompleteAll` to handle on complete all.
   * @zh 执行 `onCompleteAll`，用于当完成全部。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public onCompleteAll() {
    return void 0;
  }

  /**
   * Executes `_mimeTypeFilter` to handle mime type filter.
   * @zh 执行 `_mimeTypeFilter`，用于MIME类型类型过滤。
   * @param item - item parameter (`FileLikeObject`) / 条目参数（`FileLikeObject`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public _mimeTypeFilter(item: FileLikeObject): boolean {
    return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
  }

  /**
   * Executes `_fileSizeFilter` to handle file size filter.
   * @zh 执行 `_fileSizeFilter`，用于文件尺寸过滤。
   * @param item - item parameter (`FileLikeObject`) / 条目参数（`FileLikeObject`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public _fileSizeFilter(item: FileLikeObject): boolean {
    return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
  }

  /**
   * Executes `_fileTypeFilter` to handle file type filter.
   * @zh 执行 `_fileTypeFilter`，用于文件类型过滤。
   * @param item - item parameter (`FileLikeObject`) / 条目参数（`FileLikeObject`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public _fileTypeFilter(item: FileLikeObject): boolean {
    return !(this.options.allowedFileType &&
      this.options.allowedFileType.indexOf(FileType.getMimeClass(item)) === -1);
  }

  /**
   * Executes `_onErrorItem` to handle on error item.
   * @zh 执行 `_onErrorItem`，用于当错误条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
  }

  /**
   * Executes `_onCompleteItem` to handle on complete item.
   * @zh 执行 `_onCompleteItem`，用于当完成条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onComplete(response, status, headers);
    this.onCompleteItem(item, response, status, headers);
    const nextItem = this.getReadyItems()[0];
    this.isUploading = false;
    if (nextItem) {
      nextItem.upload();
      return;
    }
    this.onCompleteAll();

    this.progress = this._getTotalProgress();
    this._render();
  }

  /**
   * Executes `_headersGetter` to handle headers getter.
   * @zh 执行 `_headersGetter`，用于请求头Getter。
   * @param parsedHeaders - parsed headers parameter (`ParsedResponseHeaders`) / 已解析请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  protected _headersGetter(parsedHeaders: ParsedResponseHeaders) {
    return (name) => {
      if (name) {
        return parsedHeaders[name.toLowerCase()] || void 0;
      }
      return parsedHeaders;
    };
  }

  /**
   * Executes `_xhrTransport` to handle xhr transport.
   * @zh 执行 `_xhrTransport`，用于xhrTransport。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  protected _xhrTransport(item: FileItem) {


    const xhr = item._xhr = new XMLHttpRequest();
    let sendable;
    this._onBeforeUploadItem(item);
    const uploaderResponse=this.uploaderResponse;

    if (typeof item._file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }
    if (!this.options.disableMultipart) {
      sendable = new FormData();
      this._onBuildItemForm(item, sendable);

      const appendFile = () => sendable.append(item.alias, item._file, item.file.name);
      if (!this.options.parametersBeforeFiles) {
        appendFile();
      }

      if (this.options.additionalParameter !== undefined) {
        Object.keys(this.options.additionalParameter).forEach((key: string) => {
          let paramVal = this.options.additionalParameter[key];
          if (typeof paramVal === 'string' && paramVal.indexOf('{{file_name}}') >= 0) {
            paramVal = paramVal.replace('{{file_name}}', item.file.name);
          }
          sendable.append(key, paramVal);
        });
      }

      if (this.options.parametersBeforeFiles) {
        appendFile();
      }
    } else {
      sendable = this.options.formatDataFunction(item);
    }

    xhr.upload.onprogress = (event: { lengthComputable?; loaded?; total? }) => {
      const progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
      this._onProgressItem(item, progress);
    };
    xhr.onload = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      const gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      const method = '_on' + gist + 'Item';
      (this as unknown)[method](item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onerror = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      this._onErrorItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onabort = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      this._onCancelItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.open(item.method, item.url, true);
    xhr.withCredentials = item.withCredentials;
    if (this.options.headers) {
      for (const header of this.options.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }
    if (item.headers.length) {
      for (const header of item.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }
    if (this.authToken) {
      xhr.setRequestHeader(this.authTokenHeader, this.authToken);
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        uploaderResponse.emit(xhr.responseText);
      }
    };
    if (this.options.formatDataFunctionIsAsync) {
      sendable.then(
        (result) => xhr.send(JSON.stringify(result))
      );
    } else {
      xhr.send(sendable);
    }
    this._render();
  }

  /**
   * Executes `_getTotalProgress` to handle get total progress.
   * @zh 执行 `_getTotalProgress`，用于获取总计进度条。
   * @param value - value parameter (`number`) / 值参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected _getTotalProgress(value: number = 0): number {
    if (this.options.removeAfterUpload) {
      return value;
    }
    const notUploaded = this.getNotUploadedItems().length;
    const uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
    const ratio = 100 / this.queue.length;
    const current = value * ratio / 100;
    return Math.round(uploaded * ratio + current);
  }

  /**
   * Executes `_getFilters` to handle get filters.
   * @zh 执行 `_getFilters`，用于获取过滤器列表。
   * @param filters - filters parameter (`FilterFunction[] | string`) / 过滤器列表参数（`FilterFunction[] | string`）
   * @returns Result of type `FilterFunction[]` / 类型为 `FilterFunction[]` 的返回值
   */
  protected _getFilters(filters: FilterFunction[] | string): FilterFunction[] {
    if (!filters) {
      return this.options.filters;
    }
    if (Array.isArray(filters)) {
      return filters;
    }
    if (typeof filters === 'string') {
      const names = filters.match(/[^\s,]+/g);
      return this.options.filters
        .filter((filter: { name? }) => names.indexOf(filter.name) !== -1);
    }
    return this.options.filters;
  }

  /**
   * Executes `_render` to handle render.
   * @zh 执行 `_render`，用于渲染。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  protected _render() {
    return void 0;
  }

  /**
   * Executes `_queueLimitFilter` to handle queue limit filter.
   * @zh 执行 `_queueLimitFilter`，用于队列限制过滤。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected _queueLimitFilter(): boolean {
    return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
  }

  /**
   * Executes `_isValidFile` to handle is valid file.
   * @zh 执行 `_isValidFile`，用于是否为有效文件。
   * @param file - file parameter (`FileLikeObject`) / 文件参数（`FileLikeObject`）
   * @param filters - filters parameter (`FilterFunction[]`) / 过滤器列表参数（`FilterFunction[]`）
   * @param options - options parameter (`FileUploaderOptions`) / 配置选项参数（`FileUploaderOptions`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected _isValidFile(file: FileLikeObject, filters: FilterFunction[], options: FileUploaderOptions): boolean {
    this._failFilterIndex = -1;
    return !filters.length ? true : filters.every((filter: FilterFunction) => {
      this._failFilterIndex++;
      return filter.fn.call(this, file, options);
    });
  }

  /**
   * Executes `_isSuccessCode` to handle is success code.
   * @zh 执行 `_isSuccessCode`，用于是否为成功编码。
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  protected _isSuccessCode(status: number): boolean {
    return (status >= 200 && status < 300) || status === 304;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `_transformResponse` to handle transform response.
   * @zh 执行 `_transformResponse`，用于转换响应。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  protected _transformResponse(response: string, headers: ParsedResponseHeaders): string {
    return response;
  }

  /**
   * Executes `_parseHeaders` to handle parse headers.
   * @zh 执行 `_parseHeaders`，用于解析请求头。
   * @param headers - headers parameter (`string`) / 请求头参数（`string`）
   * @returns Result of type `ParsedResponseHeaders` / 类型为 `ParsedResponseHeaders` 的返回值
   */
  protected _parseHeaders(headers: string): ParsedResponseHeaders {
    const parsed = {};
    let key;
    let val;
    let i;
    if (!headers) {
      return parsed;
    }
    headers.split('\n').map((line: { indexOf?; slice? }) => {
      i = line.indexOf(':');
      key = line.slice(0, i).trim().toLowerCase();
      val = line.slice(i + 1).trim();
      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });
    return parsed;
  }

  /**
   * Executes `_onWhenAddingFileFailed` to handle on when adding file failed.
   * @zh 执行 `_onWhenAddingFileFailed`，用于当When添加文件失败。
   * @param item - item parameter (`FileLikeObject`) / 条目参数（`FileLikeObject`）
   * @param filter - filter parameter (`any`) / 过滤参数（`any`）
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   */
  protected _onWhenAddingFileFailed(item: FileLikeObject, filter, options): void {
    this.onWhenAddingFileFailed(item, filter, options);
  }

  /**
   * Executes `_onAfterAddingFile` to handle on after adding file.
   * @zh 执行 `_onAfterAddingFile`，用于当之后添加文件。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   */
  protected _onAfterAddingFile(item: FileItem): void {
    this.onAfterAddingFile(item);
  }

  /**
   * Executes `_onAfterAddingAll` to handle on after adding all.
   * @zh 执行 `_onAfterAddingAll`，用于当之后添加全部。
   * @param items - items parameter (`any`) / 条目列表参数（`any`）
   */
  protected _onAfterAddingAll(items): void {
    this.onAfterAddingAll(items);
  }

  /**
   * Executes `_onBeforeUploadItem` to handle on before upload item.
   * @zh 执行 `_onBeforeUploadItem`，用于当之前上传条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   */
  protected _onBeforeUploadItem(item: FileItem): void {
    item._onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  /**
   * Executes `_onBuildItemForm` to handle on build item form.
   * @zh 执行 `_onBuildItemForm`，用于当构建条目表单。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param form - form parameter (`any`) / 表单参数（`any`）
   */
  protected _onBuildItemForm(item: FileItem, form): void {
    item._onBuildForm(form);
    this.onBuildItemForm(item, form);
  }

  /**
   * Executes `_onProgressItem` to handle on progress item.
   * @zh 执行 `_onProgressItem`，用于当进度条条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param progress - progress parameter (`any`) / 进度条参数（`any`）
   */
  protected _onProgressItem(item: FileItem, progress): void {
    const total = this._getTotalProgress(progress);
    this.progress = total;
    item._onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
    this._render();
  }

  /**
   * Executes `_onSuccessItem` to handle on success item.
   * @zh 执行 `_onSuccessItem`，用于当成功条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  protected _onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
  }

  /**
   * Executes `_onCancelItem` to handle on cancel item.
   * @zh 执行 `_onCancelItem`，用于当取消条目。
   * @param item - item parameter (`FileItem`) / 条目参数（`FileItem`）
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  protected _onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
  }
}
