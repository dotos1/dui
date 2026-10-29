/**
 * @fileoverview Module `src/common/fileupload/file-item.ts` providing file item definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-item.ts`，提供文件条目相关的定义与实现。
 */

import { FileLikeObject } from './file-like-object';
import { FileUploader, ParsedResponseHeaders, FileUploaderOptions } from './file-uploader';

/**
 * A single queued/uploading file within a {@link FileUploader}, tracking its own progress,
 * status flags, and the underlying XHR.
 * @zh {@link FileUploader} 队列中的单个文件条目，跟踪自身的上传进度、状态标志及底层 XHR。
 */
export class FileItem {
  /**
   * Property `file` (`FileLikeObject`) storing file.
   * @zh 属性 `file`（类型：`FileLikeObject`），用于存储或配置文件。
   */
  public file: FileLikeObject;
  /**
   * Property `_file` (`File`) storing file.
   * @zh 属性 `_file`（类型：`File`），用于存储或配置文件。
   */
  public _file: File;
  /**
   * Property `alias` (`string`) storing alias.
   * @zh 属性 `alias`（类型：`string`），用于存储或配置alias。
   */
  public alias: string;
  /**
   * Property `url` (`string`) storing url (default: `'/'`).
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址（默认值：`'/'`）。
   */
  public url: string = '/';
  /**
   * Property `method` (`string`) storing method.
   * @zh 属性 `method`（类型：`string`），用于存储或配置方法。
   */
  public method: string;
  /**
   * Property `headers` (`any[]`) storing headers (default: `[]`).
   * @zh 属性 `headers`（类型：`any[]`），用于存储或配置请求头（默认值：`[]`）。
   */
  public headers = [];
  /**
   * Property `withCredentials` (`boolean`) storing with credentials (default: `true`).
   * @zh 属性 `withCredentials`（类型：`boolean`），用于存储或配置带有Credentials（默认值：`true`）。
   */
  public withCredentials: boolean = true;
  /**
   * Property `formData` (`any[]`) storing form data (default: `[]`).
   * @zh 属性 `formData`（类型：`any[]`），用于存储或配置表单数据（默认值：`[]`）。
   */
  public formData = [];
  /**
   * Property `isReady` (`boolean`) storing is ready (default: `false`).
   * @zh 属性 `isReady`（类型：`boolean`），用于存储或配置是否为就绪（默认值：`false`）。
   */
  public isReady: boolean = false;
  /**
   * Property `isUploading` (`boolean`) storing is uploading (default: `false`).
   * @zh 属性 `isUploading`（类型：`boolean`），用于存储或配置是否为上传（默认值：`false`）。
   */
  public isUploading: boolean = false;
  /**
   * Property `isUploaded` (`boolean`) storing is uploaded (default: `false`).
   * @zh 属性 `isUploaded`（类型：`boolean`），用于存储或配置是否为已上传（默认值：`false`）。
   */
  public isUploaded: boolean = false;
  /**
   * Property `isSuccess` (`boolean`) storing is success (default: `false`).
   * @zh 属性 `isSuccess`（类型：`boolean`），用于存储或配置是否为成功（默认值：`false`）。
   */
  public isSuccess: boolean = false;
  /**
   * Property `isCancel` (`boolean`) storing is cancel (default: `false`).
   * @zh 属性 `isCancel`（类型：`boolean`），用于存储或配置是否为取消（默认值：`false`）。
   */
  public isCancel: boolean = false;
  /**
   * Property `isError` (`boolean`) storing is error (default: `false`).
   * @zh 属性 `isError`（类型：`boolean`），用于存储或配置是否为错误（默认值：`false`）。
   */
  public isError: boolean = false;
  /**
   * Property `progress` (`number`) storing progress (default: `0`).
   * @zh 属性 `progress`（类型：`number`），用于存储或配置进度条（默认值：`0`）。
   */
  public progress: number = 0;
  /**
   * Property `index` (`number`) storing index (default: `void 0`).
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引（默认值：`void 0`）。
   */
  public index: number = void 0;
  /**
   * Property `_xhr` (`XMLHttpRequest`) storing xhr.
   * @zh 属性 `_xhr`（类型：`XMLHttpRequest`），用于存储或配置xhr。
   */
  public _xhr: XMLHttpRequest;
  /**
   * Property `_form` (`any`) storing form.
   * @zh 属性 `_form`（类型：`any`），用于存储或配置表单。
   */
  public _form;

  /**
   * Property `uploader` (`FileUploader`) storing uploader.
   * @zh 属性 `uploader`（类型：`FileUploader`），用于存储或配置上传器。
   */
  protected uploader: FileUploader;
  /**
   * Property `some` (`File`) storing some.
   * @zh 属性 `some`（类型：`File`），用于存储或配置部分。
   */
  protected some: File;
  /**
   * Property `options` (`FileUploaderOptions`) storing options.
   * @zh 属性 `options`（类型：`FileUploaderOptions`），用于存储或配置配置选项。
   */
  protected options: FileUploaderOptions;

  /**
   * Creates an instance of `FileItem` and initializes its dependencies and internal state.
   * @zh 创建 `FileItem` 实例，并初始化其依赖项与内部状态。
   * @param uploader - Injected or initial uploader (`FileUploader`) / 注入或传入的上传器（`FileUploader`）
   * @param some - Injected or initial some (`File`) / 注入或传入的部分（`File`）
   * @param options - Injected or initial options (`FileUploaderOptions`) / 注入或传入的配置选项（`FileUploaderOptions`）
   */
  public constructor(uploader: FileUploader, some: File, options: FileUploaderOptions) {
    this.uploader = uploader;
    this.some = some;
    this.options = options;
    this.file = new FileLikeObject(some);
    this._file = some;
    if (uploader.options) {
      this.method = uploader.options.method || 'POST';
      this.alias = uploader.options.itemAlias || 'file';
    }
    this.url = uploader.options.url;
  }

  /**
   * Executes `upload` to handle upload.
   * @zh 执行 `upload`，用于上传。
   */
  public upload(): void {
    try {
      this.uploader.uploadItem(this);
    } catch (e) {
      this.uploader._onCompleteItem(this, '', 0, {});
      this.uploader._onErrorItem(this, '', 0, {});
    }
  }

  /**
   * Executes `cancel` to handle cancel.
   * @zh 执行 `cancel`，用于取消。
   */
  public cancel(): void {
    this.uploader.cancelItem(this);
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   */
  public remove(): void {
    this.uploader.removeFromQueue(this);
  }

  /**
   * Executes `onBeforeUpload` to handle on before upload.
   * @zh 执行 `onBeforeUpload`，用于当之前上传。
   */
  public onBeforeUpload(): void {
    return void 0;
  }

  /**
   * Executes `onBuildForm` to handle on build form.
   * @zh 执行 `onBuildForm`，用于当构建表单。
   * @param form - form parameter (`any`) / 表单参数（`any`）
   * @returns Result of type `{ form: any; }` / 类型为 `{ form: any; }` 的返回值
   */
  public onBuildForm(form) {
    return { form };
  }

  /**
   * Executes `onProgress` to handle on progress.
   * @zh 执行 `onProgress`，用于当进度条。
   * @param progress - progress parameter (`number`) / 进度条参数（`number`）
   * @returns Result of type `{ progress: number; }` / 类型为 `{ progress: number; }` 的返回值
   */
  public onProgress(progress: number) {
    return { progress };
  }

  /**
   * Executes `onSuccess` to handle on success.
   * @zh 执行 `onSuccess`，用于当成功。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `{ response: string; status: number; headers: ParsedResponseHeaders; }` / 类型为 `{ response: string; status: number; headers: ParsedResponseHeaders; }` 的返回值
   */
  public onSuccess(response: string, status: number, headers: ParsedResponseHeaders) {
    return { response, status, headers };
  }

  /**
   * Executes `onError` to handle on error.
   * @zh 执行 `onError`，用于当错误。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `{ response: string; status: number; headers: ParsedResponseHeaders; }` / 类型为 `{ response: string; status: number; headers: ParsedResponseHeaders; }` 的返回值
   */
  public onError(response: string, status: number, headers: ParsedResponseHeaders) {
    return { response, status, headers };
  }

  /**
   * Executes `onCancel` to handle on cancel.
   * @zh 执行 `onCancel`，用于当取消。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `{ response: string; status: number; headers: ParsedResponseHeaders; }` / 类型为 `{ response: string; status: number; headers: ParsedResponseHeaders; }` 的返回值
   */
  public onCancel(response: string, status: number, headers: ParsedResponseHeaders) {
    return { response, status, headers };
  }

  /**
   * Executes `onComplete` to handle on complete.
   * @zh 执行 `onComplete`，用于当完成。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   * @returns Result of type `{ response: string; status: number; headers: ParsedResponseHeaders; }` / 类型为 `{ response: string; status: number; headers: ParsedResponseHeaders; }` 的返回值
   */
  public onComplete(response: string, status: number, headers: ParsedResponseHeaders) {
    return { response, status, headers };
  }

  /**
   * Executes `_onBeforeUpload` to handle on before upload.
   * @zh 执行 `_onBeforeUpload`，用于当之前上传。
   */
  public _onBeforeUpload(): void {
    this.isReady = true;
    this.isUploading = true;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    this.onBeforeUpload();
  }

  /**
   * Executes `_onBuildForm` to handle on build form.
   * @zh 执行 `_onBuildForm`，用于当构建表单。
   * @param form - form parameter (`any`) / 表单参数（`any`）
   */
  public _onBuildForm(form): void {
    this.onBuildForm(form);
  }

  /**
   * Executes `_onProgress` to handle on progress.
   * @zh 执行 `_onProgress`，用于当进度条。
   * @param progress - progress parameter (`number`) / 进度条参数（`number`）
   */
  public _onProgress(progress: number): void {
    this.progress = progress;
    this.onProgress(progress);
  }

  /**
   * Executes `_onSuccess` to handle on success.
   * @zh 执行 `_onSuccess`，用于当成功。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onSuccess(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    this.index = void 0;
    this.onSuccess(response, status, headers);
  }

  /**
   * Executes `_onError` to handle on error.
   * @zh 执行 `_onError`，用于当错误。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onError(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    this.index = void 0;
    this.onError(response, status, headers);
  }

  /**
   * Executes `_onCancel` to handle on cancel.
   * @zh 执行 `_onCancel`，用于当取消。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onCancel(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    this.index = void 0;
    this.onCancel(response, status, headers);
  }

  /**
   * Executes `_onComplete` to handle on complete.
   * @zh 执行 `_onComplete`，用于当完成。
   * @param response - response parameter (`string`) / 响应参数（`string`）
   * @param status - status parameter (`number`) / 状态参数（`number`）
   * @param headers - headers parameter (`ParsedResponseHeaders`) / 请求头参数（`ParsedResponseHeaders`）
   */
  public _onComplete(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.onComplete(response, status, headers);

    if (this.uploader.options.removeAfterUpload) {
      this.remove();
    }
  }

  /**
   * Executes `_prepareToUploading` to handle prepare to uploading.
   * @zh 执行 `_prepareToUploading`，用于prepare转换为上传。
   */
  public _prepareToUploading(): void {
    this.index = this.index || ++this.uploader._nextIndex;
    this.isReady = true;
  }
}
