/**
 * @fileoverview Module `src/core/models/console.ts` providing console definitions and implementation.
 * @zh 模块文件 `src/core/models/console.ts`，提供console相关的定义与实现。
 */

/**
 * Interface `Console` defining the contract and properties for console.
 * @zh 接口 `Console`，定义Console的数据结构契约与属性规范。
 */
export interface Console {
  /**
   * Executes `log` to handle log.
   * @zh 执行 `log`，用于日志。
   * @param m - m parameter (`any`) / m参数（`any`）
   */
  log(m): void;
  /**
   * Executes `debug` to handle debug.
   * @zh 执行 `debug`，用于debug。
   * @param m - m parameter (`any`) / m参数（`any`）
   */
  debug(m): void;
  /**
   * Executes `error` to handle error.
   * @zh 执行 `error`，用于错误。
   * @param m - m parameter (`any`) / m参数（`any`）
   */
  error(m): void;
  /**
   * Executes `warn` to handle warn.
   * @zh 执行 `warn`，用于警告色。
   * @param m - m parameter (`any`) / m参数（`any`）
   */
  warn(m): void;
  /**
   * Executes `info` to handle info.
   * @zh 执行 `info`，用于信息。
   * @param m - m parameter (`any`) / m参数（`any`）
   */
  info(m): void;
}
