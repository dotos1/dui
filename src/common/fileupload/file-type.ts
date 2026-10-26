/**
 * @fileoverview Module `src/common/fileupload/file-type.ts` providing file type definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-type.ts`，提供文件类型相关的定义与实现。
 */

import { FileLikeObject } from './file-like-object';

/**
 * Class `FileType` encapsulating file type data structures and logic in `src/common/fileupload`.
 * @zh 类 `FileType`，封装 `src/common/fileupload` 中的文件类型数据结构与处理逻辑。
 */
export class FileType {
  /*  MS office  */
  /**
   * Property `mime_doc` (`string[]`) storing mime doc.
   * @zh 属性 `mime_doc`（类型：`string[]`），用于存储或配置MIME类型文档。
   */
  public static mime_doc: string[] = [
    'application/msword',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.ms-word.template.macroEnabled.12'
  ];
  /**
   * Property `mime_xsl` (`string[]`) storing mime xsl.
   * @zh 属性 `mime_xsl`（类型：`string[]`），用于存储或配置MIME类型xsl。
   */
  public static mime_xsl: string[] = [
    'application/vnd.ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel.template.macroEnabled.12',
    'application/vnd.ms-excel.addin.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
  ];
  /**
   * Property `mime_ppt` (`string[]`) storing mime ppt.
   * @zh 属性 `mime_ppt`（类型：`string[]`），用于存储或配置MIME类型ppt。
   */
  public static mime_ppt: string[] = [
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    'application/vnd.ms-powerpoint.addin.macroEnabled.12',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
  ];

  /* PSD */
  /**
   * Property `mime_psd` (`string[]`) storing mime psd.
   * @zh 属性 `mime_psd`（类型：`string[]`），用于存储或配置MIME类型psd。
   */
  public static mime_psd: string[] = [
    'image/photoshop',
    'image/x-photoshop',
    'image/psd',
    'application/photoshop',
    'application/psd',
    'zz-application/zz-winassoc-psd'
  ];

  /* Compressed files */
  /**
   * Property `mime_compress` (`string[]`) storing mime compress.
   * @zh 属性 `mime_compress`（类型：`string[]`），用于存储或配置MIME类型compress。
   */
  public static mime_compress: string[] = [
    'application/x-gtar',
    'application/x-gcompress',
    'application/compress',
    'application/x-tar',
    'application/x-rar-compressed',
    'application/octet-stream',
    'application/x-zip-compressed',
    'application/zip-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-bzip2'
  ];

  /**
   * Executes `getMimeClass` to handle get mime class.
   * @zh 执行 `getMimeClass`，用于获取MIME类型类名。
   * @param file - file parameter (`FileLikeObject`) / 文件参数（`FileLikeObject`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static getMimeClass(file: FileLikeObject): string {
    let mimeClass = 'application';
    if (this.mime_psd.indexOf(file.type) !== -1) {
      mimeClass = 'image';
    } else if (file.type.match('image.*')) {
      mimeClass = 'image';
    } else if (file.type.match('video.*')) {
      mimeClass = 'video';
    } else if (file.type.match('audio.*')) {
      mimeClass = 'audio';
    } else if (file.type === 'application/pdf') {
      mimeClass = 'pdf';
    } else if (this.mime_compress.indexOf(file.type) !== -1) {
      mimeClass = 'compress';
    } else if (this.mime_doc.indexOf(file.type) !== -1) {
      mimeClass = 'doc';
    } else if (this.mime_xsl.indexOf(file.type) !== -1) {
      mimeClass = 'xls';
    } else if (this.mime_ppt.indexOf(file.type) !== -1) {
      mimeClass = 'ppt';
    }
    if (mimeClass === 'application') {
      mimeClass = this.fileTypeDetection(file.name);
    }

    return mimeClass;
  }

  /**
   * Executes `fileTypeDetection` to handle file type detection.
   * @zh 执行 `fileTypeDetection`，用于文件类型变更检测。
   * @param inputFilename - input filename parameter (`string`) / 输入属性Filename参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static fileTypeDetection(inputFilename: string): string {
    const types: { [ key: string ]: string } = {
      'jpg': 'image',
      'jpeg': 'image',
      'tif': 'image',
      'psd': 'image',
      'bmp': 'image',
      'png': 'image',
      'nef': 'image',
      'tiff': 'image',
      'cr2': 'image',
      'dwg': 'image',
      'cdr': 'image',
      'ai': 'image',
      'indd': 'image',
      'pin': 'image',
      'cdp': 'image',
      'skp': 'image',
      'stp': 'image',
      '3dm': 'image',
      'mp3': 'audio',
      'wav': 'audio',
      'wma': 'audio',
      'mod': 'audio',
      'm4a': 'audio',
      'compress': 'compress',
      'zip': 'compress',
      'rar': 'compress',
      '7z': 'compress',
      'lz': 'compress',
      'z01': 'compress',
      'bz2': 'compress',
      'gz': 'compress',
      'pdf': 'pdf',
      'xls': 'xls',
      'xlsx': 'xls',
      'ods': 'xls',
      'mp4': 'video',
      'avi': 'video',
      'wmv': 'video',
      'mpg': 'video',
      'mts': 'video',
      'flv': 'video',
      '3gp': 'video',
      'vob': 'video',
      'm4v': 'video',
      'mpeg': 'video',
      'm2ts': 'video',
      'mov': 'video',
      'doc': 'doc',
      'docx': 'doc',
      'eps': 'doc',
      'txt': 'doc',
      'odt': 'doc',
      'rtf': 'doc',
      'ppt': 'ppt',
      'pptx': 'ppt',
      'pps': 'ppt',
      'ppsx': 'ppt',
      'odp': 'ppt'
    };

    const chunks = inputFilename.split('.');
    if (chunks.length < 2) {
      return 'application';
    }
    const extension = chunks[ chunks.length - 1 ].toLowerCase();
    if (types[ extension ] === undefined) {
      return 'application';
    } else {
      return types[ extension ];
    }
  }
}
