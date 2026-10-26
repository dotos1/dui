/**
 * @fileoverview Module `src/ux/editor/utils/error.ts` providing error definitions and implementation.
 * @zh 模块文件 `src/ux/editor/utils/error.ts`，提供错误相关的定义与实现。
 */

/**
 * Class `EditorError` encapsulating editor error data structures and logic in `src/ux/editor/utils`.
 * @zh 类 `EditorError`，封装 `src/ux/editor/utils` 中的编辑器错误数据结构与处理逻辑。
 */
class EditorError extends Error {
  /**
   * Creates an instance of `EditorError` and initializes its dependencies and internal state.
   * @zh 创建 `EditorError` 实例，并初始化其依赖项与内部状态。
   * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export default EditorError;
