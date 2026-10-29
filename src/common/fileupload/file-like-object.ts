/**
 * @fileoverview Module `src/common/fileupload/file-like-object.ts` providing file like object definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-like-object.ts`，提供文件like对象相关的定义与实现。
 */

/**
 * Executes `isElement` to handle is element.
 * @zh 执行 `isElement`，用于是否为元素。
 * @param node - node parameter (`any`) / 节点参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isElement(node): boolean {
  return !!(node && (node.nodeName || node.prop && node.attr && node.find));
}

/**
 * Class `FileLikeObject` encapsulating file like object data structures and logic in `src/common/fileupload`.
 * @zh 类 `FileLikeObject`，封装 `src/common/fileupload` 中的文件Like对象数据结构与处理逻辑。
 */
export class FileLikeObject {
  /**
   * Property `lastModifiedDate` (`any`) storing last modified date.
   * @zh 属性 `lastModifiedDate`（类型：`any`），用于存储或配置末尾Modified日期。
   */
  public lastModifiedDate;
  /**
   * Property `size` (`any`) storing size.
   * @zh 属性 `size`（类型：`any`），用于存储或配置尺寸。
   */
  public size;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  public type: string;
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  public name: string;
  /**
   * Property `rawFile` (`any`) storing raw file.
   * @zh 属性 `rawFile`（类型：`any`），用于存储或配置原始文件。
   */
  public rawFile;

  /**
   * Creates an instance of `FileLikeObject` and initializes its dependencies and internal state.
   * @zh 创建 `FileLikeObject` 实例，并初始化其依赖项与内部状态。
   * @param fileOrInput - Injected or initial file or input (`any`) / 注入或传入的文件Or输入属性（`any`）
   */
  public constructor(fileOrInput) {
    this.rawFile = fileOrInput;
    const isInput = isElement(fileOrInput);
    const fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
    const postfix = typeof fakePathOrObject === 'string' ? 'FakePath' : 'Object';
    const method = '_createFrom' + postfix;
    (this as unknown)[ method ](fakePathOrObject);
  }

  /**
   * Executes `_createFromFakePath` to handle create from fake path.
   * @zh 执行 `_createFromFakePath`，用于创建从Fake路径。
   * @param path - path parameter (`string`) / 路径参数（`string`）
   */
  public _createFromFakePath(path: string): void {
    this.lastModifiedDate = void 0;
    this.size = void 0;
    this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
    this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
  }

  /**
   * Executes `_createFromObject` to handle create from object.
   * @zh 执行 `_createFromObject`，用于创建从对象。
   * @param object - object parameter (`{ size: number; type: string; name: string; }`) / 对象参数（`{ size: number; type: string; name: string; }`）
   */
  public _createFromObject(object: { size: number, type: string, name: string }): void {
    this.size = object.size;
    this.type = object.type;
    this.name = object.name;
  }
}
