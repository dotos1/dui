/**
 * Represents a result type that can either hold a successful value of type `T` or an error value of type `E`.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error value.

 * @zh 类型别名 `Result`，表示结果（`Ok<T> | Err<E>`）。
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * The data type for the resized image.

 * @zh 类型别名 `DataType`，表示数据类型（`'image/png' | 'image/jpeg' | 'image/webp'`）。
 */
export type DataType = 'image/png' | 'image/jpeg' | 'image/webp';

/**
 * The options for image resizing.
 * @interface Options
 *
 * @property {DataType} [type] - The data type for the resized image.
 * @property {number} [width] - The desired width of the resized image.
 * @property {number} [height] - The desired height of the resized image.
 * @property {number} [quality] - The optional quality setting for the resized image.

 * @zh 接口 `Options`，定义配置选项的数据结构契约与属性规范。
 */
export interface Options {
    /**
     * Property `type` (`DataType`) storing type.
     * @zh 属性 `type`（类型：`DataType`），用于存储或配置类型。
     */
    type?: DataType;
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width?: number;
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height?: number;
    /**
     * Property `quality` (`number`) storing quality.
     * @zh 属性 `quality`（类型：`number`），用于存储或配置quality。
     */
    quality?: number;
}

/**
 * Executes `resizeImg` to handle resize img.
 * @zh 执行 `resizeImg`，用于调整尺寸图片。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param opt - opt parameter (`Options`) / 选项参数（`Options`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
export function resizeImg(img: File, opt: Options): Promise<Result<string, string>> {
    const callback = (imageBase64: string): Promise<Result<string, string>> => {
        const callback = (image: HTMLImageElement): Result<string, string> => {
            const dimensionsResult = getDimensions(opt, image);
            if (!dimensionsResult.ok) {
                return dimensionsResult as Err<string>;
            }
            const { width, height } = dimensionsResult.value;

            return resize(image, width, height, opt.quality, opt.type);
        };
        return loadImageAndCall(imageBase64, callback)
    };

    return readImageAndCallWithOpt(img, opt, callback);
}

/**
 * Executes `resizeImage` to handle resize image.
 * @zh 执行 `resizeImage`，用于调整尺寸图像。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param width - width parameter (`number`) / 宽度参数（`number`）
 * @param height - height parameter (`number`) / 高度参数（`number`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @param type - type parameter (`DataType`) / 类型参数（`DataType`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
export function resizeImage(
    img: File,
    width: number,
    height: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (imageBase64: string): Promise<Result<string, string>> => {
        return resizeWidthAndHeight(imageBase64, width, height, quality, type);
    };

    return readImageAndCall(img, callback, quality);
}

/**
 * Resizes an image to a specific width while maintaining the aspect ratio, using the provided `File` object as input.
 *
 * @param {File} img - The `File` object representing the image file.
 * @param {number} width - The desired width of the resized image.
 * @param {number} [quality] - The optional quality setting for the resized image.
 * @param {DataType} [type] - The optional data type for the resized image.
 * @returns {Promise<Result<string, string>>} - A promise that resolves to a result object indicating the resizing result.
 *                                              Returns `ok(resizedDataUrl)` with the resized image data URL
 *                                              if the resizing is successful, or `err(errorMessage)` if an error occurs.

 * @zh 执行 `resizeImageWidth`，用于调整尺寸图像宽度。
 */
export function resizeImageWidth(
    img: File,
    width: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (imageBase64: string): Promise<Result<string, string>> => {
        return resizeWidth(imageBase64, width, quality, type);
    };

    return readImageAndCall(img, callback, quality);
}

/**
 * Resizes an image to a specific height while maintaining the aspect ratio, using the provided `File` object as input.
 *
 * @param {File} img - The `File` object representing the image file.
 * @param {number} height - The desired height of the resized image.
 * @param {number} [quality] - The optional quality setting for the resized image.
 * @param {DataType} [type] - The optional data type for the resized image.
 * @returns {Promise<Result<string, string>>} - A promise that resolves to a result object indicating the resizing result.
 *                                              Returns `ok(resizedDataUrl)` with the resized image data URL
 *                                              if the resizing is successful, or `err(errorMessage)` if an error occurs.

 * @zh 执行 `resizeImageHeight`，用于调整尺寸图像高度。
 */
export function resizeImageHeight(
    img: File,
    height: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (imageBase64: string): Promise<Result<string, string>> => {
        return resizeHeight(imageBase64, height, quality, type);
    };

    return readImageAndCall(img, callback, quality);
}

/**
 * Represents a successful result value containing a value of type `T`.
 *
 * @template T - The type of the successful value.

 * @zh 类型别名 `Ok`，表示确认（`{ ok: true, value: T }`）。
 */
type Ok<T> = { ok: true, value: T };

/**
 * Represents an error result value containing an error value of type `E`.
 *
 * @template E - The type of the error value.

 * @zh 类型别名 `Err`，表示错误（`{ ok: false, error: E }`）。
 */
type Err<E> = { ok: false, error: E };

/**
 * The type for resolving a Promise with a Result object.

 * @zh 类型别名 `PromiseResolve`，表示Promise解析（`(value: Result<string, string>) => void`）。
 */
type PromiseResolve = (value: Result<string, string>) => void;

/**
 * The dimensions of an image.
 * @interface Dimensions
 *
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.

 * @zh 接口 `Dimensions`，定义维度列表的数据结构契约与属性规范。
 */
interface Dimensions {
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width: number;
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height: number;
}

/**
 * Creates a successful result object with the given value.
 *
 * @param value - The value representing the successful result.
 * @returns {Ok} - A successful result object containing the provided value.
 * @template T - The type of the successful value.

 * @zh 常量/变量 `ok`，定义 `src/util` 中的确认。
 */
const ok = <T>(value: T): Ok<T> => {
    return { ok: true, value };
}

/**
 * Creates an error result object with the given error.
 *
 * @param error - The error representing the unsuccessful result.
 * @returns {Err} - An error result object containing the provided error.
 * @template E - The type of the error value.

 * @zh 常量/变量 `err`，定义 `src/util` 中的错误。
 */
const err = <E>(error: E): Err<E> => {
    return { ok: false, error };
}

/**
 * Executes `resizeWidthAndHeight` to handle resize width and height.
 * @zh 执行 `resizeWidthAndHeight`，用于调整尺寸宽度And高度。
 * @param imageBase64 - image base64 parameter (`string`) / 图像Base64参数（`string`）
 * @param width - width parameter (`number`) / 宽度参数（`number`）
 * @param height - height parameter (`number`) / 高度参数（`number`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @param type - type parameter (`DataType`) / 类型参数（`DataType`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function resizeWidthAndHeight(
    imageBase64: string,
    width: number,
    height: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (image: HTMLImageElement): Result<string, string> => {
        return resize(image, width, height, quality, type);
    }

    return loadImageAndCall(imageBase64, callback);
}

/**
 * Executes `resizeWidth` to handle resize width.
 * @zh 执行 `resizeWidth`，用于调整尺寸宽度。
 * @param imageBase64 - image base64 parameter (`string`) / 图像Base64参数（`string`）
 * @param width - width parameter (`number`) / 宽度参数（`number`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @param type - type parameter (`DataType`) / 类型参数（`DataType`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function resizeWidth(
    imageBase64: string,
    width: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (image: HTMLImageElement): Result<string, string> => {
        const dimensions = { width: image.width, height: image.height };
        const height = scaleHeight(dimensions, width);

        return resize(image, width, height, quality, type);
    }

    return loadImageAndCall(imageBase64, callback);
}

/**
 * Executes `resizeHeight` to handle resize height.
 * @zh 执行 `resizeHeight`，用于调整尺寸高度。
 * @param imageBase64 - image base64 parameter (`string`) / 图像Base64参数（`string`）
 * @param height - height parameter (`number`) / 高度参数（`number`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @param type - type parameter (`DataType`) / 类型参数（`DataType`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function resizeHeight(
    imageBase64: string,
    height: number,
    quality?: number,
    type?: DataType
): Promise<Result<string, string>> {
    const callback = (image: HTMLImageElement): Result<string, string> => {
        const dimensions = { width: image.width, height: image.height };
        const width = scaleWidth(dimensions, height);

        return resize(image, width, height, quality, type);
    }

    return loadImageAndCall(imageBase64, callback);
}

/**
 * Executes `getDimensions` to handle get dimensions.
 * @zh 执行 `getDimensions`，用于获取维度列表。
 * @param opt - opt parameter (`Options`) / 选项参数（`Options`）
 * @param image - image parameter (`HTMLImageElement`) / 图像参数（`HTMLImageElement`）
 * @returns Result of type `Result<Dimensions, string>` / 类型为 `Result<Dimensions, string>` 的返回值
 */
function getDimensions(opt: Options, image: HTMLImageElement): Result<Dimensions, string> {
    if (opt.width !== undefined && opt.height !== undefined) {
        return ok({ width: opt.width, height: opt.height });
    }

    const dimensions = { width: image.width, height: image.height };
    if (opt.width !== undefined && opt.height === undefined) {
        return ok({ width: opt.width, height: scaleHeight(dimensions, opt.width) });
    }

    if (opt.width === undefined && opt.height !== undefined) {
        return ok({ width: scaleWidth(dimensions, opt.height), height: opt.height });
    }

    // should never happen if `validate` function is called before this function
    return err('Unknown dimensions due to invalid options object');
}

/**
 * Executes `readImageAndCallWithOpt` to handle read image and call with opt.
 * @zh 执行 `readImageAndCallWithOpt`，用于读取图像And调用带有选项。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param opt - opt parameter (`Options`) / 选项参数（`Options`）
 * @param callback - callback parameter (`(imageBase64: string) => Promise<Result<string, string>>`) / 回调函数参数（`(imageBase64: string) => Promise<Result<string, string>>`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function readImageAndCallWithOpt(
    img: File,
    opt: Options,
    callback: (imageBase64: string) => Promise<Result<string, string>>
): Promise<Result<string, string>> {
    return new Promise(resolve => {
        const isValid = validateWithOpt(img, opt);
        if (!isValid.ok) {
            resolve(isValid);
            return;
        }

        readImageFileAndResolveCallback(img, resolve, callback);
    });
}

/**
 * Executes `readImageAndCall` to handle read image and call.
 * @zh 执行 `readImageAndCall`，用于读取图像And调用。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param callback - callback parameter (`(imageBase64: string) => Promise<Result<string, string>>`) / 回调函数参数（`(imageBase64: string) => Promise<Result<string, string>>`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function readImageAndCall(
    img: File,
    callback: (imageBase64: string) => Promise<Result<string, string>>,
    quality?: number
): Promise<Result<string, string>> {
    return new Promise(resolve => {
        const isValid = validate(img, quality);
        if (!isValid.ok) {
            resolve(isValid);
            return;
        }

        readImageFileAndResolveCallback(img, resolve, callback);
    });
}

/**
 * Executes `readImageFileAndResolveCallback` to handle read image file and resolve callback.
 * @zh 执行 `readImageFileAndResolveCallback`，用于读取图像文件And解析回调函数。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param resolve - resolve parameter (`PromiseResolve`) / 解析参数（`PromiseResolve`）
 * @param callback - callback parameter (`(imageBase64: string) => Promise<Result<string, string>>`) / 回调函数参数（`(imageBase64: string) => Promise<Result<string, string>>`）
 */
function readImageFileAndResolveCallback(
    img: File,
    resolve: PromiseResolve,
    callback: (imageBase64: string) => Promise<Result<string, string>>
) {
    const reader = new FileReader;
    reader.addEventListener('abort', () => resolve(err('Reading image file was aborted!')));
    reader.addEventListener('error', () => resolve(err('Error while reading image file!')));
    reader.addEventListener('load', async () => {
        if (typeof reader.result !== 'string') {
            resolve(err('Loaded image file is not of type (base64) string!'));
            return;
        }

        const result = await callback(reader.result);
        resolve(result);
    });

    reader.readAsDataURL(img);
}

/**
 * Executes `loadImageAndCall` to handle load image and call.
 * @zh 执行 `loadImageAndCall`，用于加载图像And调用。
 * @param imageBase64 - image base64 parameter (`string`) / 图像Base64参数（`string`）
 * @param callback - callback parameter (`(image: HTMLImageElement) => Result<string, string>`) / 回调函数参数（`(image: HTMLImageElement) => Result<string, string>`）
 * @returns Result of type `Promise<Result<string, string>>` / 类型为 `Promise<Result<string, string>>` 的返回值
 */
function loadImageAndCall(
    imageBase64: string,
    callback: (image: HTMLImageElement) => Result<string, string>
): Promise<Result<string, string>> {
    return new Promise(resolve => {
        const image = new Image;
        image.addEventListener('abort', () => resolve(err('Loading image with base64 string aborted!')));
        image.addEventListener('error', () => resolve(err('Error while loading image with base64 string!')));
        image.addEventListener('load', () => {
            resolve(callback(image));
        });

        image.src = imageBase64;
    });
}

/**
 * Executes `resize` to handle resize.
 * @zh 执行 `resize`，用于调整尺寸。
 * @param image - image parameter (`HTMLImageElement`) / 图像参数（`HTMLImageElement`）
 * @param width - width parameter (`number`) / 宽度参数（`number`）
 * @param height - height parameter (`number`) / 高度参数（`number`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @param type - type parameter (`DataType`) / 类型参数（`DataType`）
 * @returns Result of type `Result<string, string>` / 类型为 `Result<string, string>` 的返回值
 */
function resize(
    image: HTMLImageElement,
    width: number,
    height: number,
    quality?: number,
    type?: DataType
): Result<string, string> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context === null) {
        return err('Canvas 2d context not available!');
    }
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    const dataType = type !== undefined ? type : 'image/png';
    const resized = canvas.toDataURL(dataType, quality);
    return ok(resized);
}

/**
 * Executes `scaleHeight` to handle scale height.
 * @zh 执行 `scaleHeight`，用于缩放高度。
 * @param dimensions - dimensions parameter (`Dimensions`) / 维度列表参数（`Dimensions`）
 * @param resizedWidth - resized width parameter (`number`) / 已调整尺寸宽度参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function scaleHeight(dimensions: Dimensions, resizedWidth: number): number {
    return (dimensions.height / dimensions.width) * resizedWidth;
}

/**
 * Executes `scaleWidth` to handle scale width.
 * @zh 执行 `scaleWidth`，用于缩放宽度。
 * @param dimensions - dimensions parameter (`Dimensions`) / 维度列表参数（`Dimensions`）
 * @param resizedHeight - resized height parameter (`number`) / 已调整尺寸高度参数（`number`）
 * @returns Result of type `number` / 类型为 `number` 的返回值
 */
function scaleWidth(dimensions: Dimensions, resizedHeight: number): number {
    return (dimensions.width / dimensions.height) * resizedHeight;
}

/**
 * Executes `validate` to handle validate.
 * @zh 执行 `validate`，用于校验。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param quality - quality parameter (`number`) / quality参数（`number`）
 * @returns Result of type `Result<undefined, string>` / 类型为 `Result<undefined, string>` 的返回值
 */
function validate(img: File, quality?: number): Result<undefined, string> {
    const errors: Array<string> = [];

    checkImageType(img, errors);
    checkQuality(quality, errors);

    return validateResult(errors);
}

/**
 * Executes `validateWithOpt` to handle validate with opt.
 * @zh 执行 `validateWithOpt`，用于校验带有选项。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param opt - opt parameter (`Options`) / 选项参数（`Options`）
 * @returns Result of type `Result<undefined, string>` / 类型为 `Result<undefined, string>` 的返回值
 */
function validateWithOpt(img: File, opt: Options): Result<undefined, string> {
    const errors: Array<string> = [];

    checkImageType(img, errors);
    checkOptions(opt, errors);

    return validateResult(errors);
}

/**
 * Executes `validateResult` to handle validate result.
 * @zh 执行 `validateResult`，用于校验结果。
 * @param errors - errors parameter (`Array<string>`) / 错误列表参数（`Array<string>`）
 * @returns Result of type `Result<undefined, string>` / 类型为 `Result<undefined, string>` 的返回值
 */
function validateResult(errors: Array<string>): Result<undefined, string> {
    if (errors.length > 0) {
        const msg = errors.join(' - ');

        return err(msg);
    }

    return ok(undefined);
}

/**
 * Executes `checkOptions` to handle check options.
 * @zh 执行 `checkOptions`，用于检查配置选项。
 * @param opt - opt parameter (`Options`) / 选项参数（`Options`）
 * @param errors - errors parameter (`Array<string>`) / 错误列表参数（`Array<string>`）
 */
function checkOptions(opt: Options, errors: Array<string>): void {
    if (opt.width === undefined && opt.height === undefined) {
        errors.push('Either width or height must be set');
    }

    checkQuality(opt.quality, errors);
}

/**
 * Executes `checkImageType` to handle check image type.
 * @zh 执行 `checkImageType`，用于检查图像类型。
 * @param img - img parameter (`File`) / 图片参数（`File`）
 * @param errors - errors parameter (`Array<string>`) / 错误列表参数（`Array<string>`）
 */
function checkImageType(img: File, errors: Array<string>): void {
    if (!img.type.startsWith('image/')) {
        errors.push(`Invalid type (${img.type}). Only images starting with 'image/' are allowed.`);
    }
}

/**
 * Executes `checkQuality` to handle check quality.
 * @zh 执行 `checkQuality`，用于检查Quality。
 * @param quality - quality parameter (`number | undefined`) / quality参数（`number | undefined`）
 * @param errors - errors parameter (`Array<string>`) / 错误列表参数（`Array<string>`）
 */
function checkQuality(quality: number | undefined, errors: Array<string>): void {
    if (quality !== undefined && (quality < 0.1 || quality > 1.0)) {
        errors.push(`Invalid argument 'quality' (${quality}). Value must be between 0.1 and 1.0`);
    }
}