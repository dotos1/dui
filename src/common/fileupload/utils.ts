/**
 * @fileoverview Module `src/common/fileupload/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/utils.ts`，提供工具集相关的定义与实现。
 */

import { ResizeOptions } from './file-uploader';

/**
 * Executes `createImageFromDataUrl` to handle create image from data url.
 * @zh 执行 `createImageFromDataUrl`，用于创建图像从数据链接地址。
 * @param dataURL - data url parameter (`string`) / 数据链接地址参数（`string`）
 */
export function createImageFromDataUrl(dataURL: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.onload = () => res(image);
    image.onerror = rej;
    image.src = dataURL;
  });
}

/**
 * Executes `resizeImage` to handle resize image.
 * @zh 执行 `resizeImage`，用于调整尺寸图像。
 * @param dataURL - data url parameter (`string`) / 数据链接地址参数（`string`）
 * @param { maxHeight, maxWidth, quality... - { max height, max width, quality parameter (`ResizeOptions`) / {最大值Height,最大值Width,quality参数（`ResizeOptions`）
 */
export async function resizeImage(dataURL: string, {
  maxHeight,
  maxWidth,
  quality = 0.7,
  type = getImageTypeFromDataUrl(dataURL)
}: ResizeOptions = {}) {

  const image = await createImageFromDataUrl(dataURL);

  if (!document) throw new Error('Work only in browser, document not defined');
  const canvas = document.createElement('canvas');

  let height = image.height;
  let width = image.width;

  if (width > maxWidth) {
    height = Math.round(height * maxWidth / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round(width * maxHeight / height);
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  //draw image on canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  // get the data from canvas as 70% jpg (or specified type).
  return canvas.toDataURL(type, quality);
}

/**
 * Executes `fileToDataURL` to handle file to data url.
 * @zh 执行 `fileToDataURL`，用于文件转换为数据链接地址。
 * @param file - file parameter (`File`) / 文件参数（`File`）
 * @returns Result of type `Promise<string>` / 类型为 `Promise<string>` 的返回值
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Constant/variable `typeRE` defining type re in `src/common/fileupload`.
 * @zh 常量/变量 `typeRE`，定义 `src/common/fileupload` 中的类型RE。
 */
const typeRE = /^data:([^,;]+)/;
/**
 * Executes `getImageTypeFromDataUrl` to handle get image type from data url.
 * @zh 执行 `getImageTypeFromDataUrl`，用于获取图像类型从数据链接地址。
 * @param dataURL - data url parameter (`string`) / 数据链接地址参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function getImageTypeFromDataUrl(dataURL: string): string {
  let matches = dataURL.match(typeRE);
  return matches && matches[1] || undefined;
}
