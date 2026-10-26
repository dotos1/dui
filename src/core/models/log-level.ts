/**
 * @fileoverview Module `src/core/models/log-level.ts` providing log level definitions and implementation.
 * @zh 模块文件 `src/core/models/log-level.ts`，提供日志层级相关的定义与实现。
 */

/**
 * Enumeration `LogLevel` defining supported log level constants.
 * @zh 枚举 `LogLevel`，定义支持的日志层级常量集合。
 */
export enum LogLevel {
  /**
   * Enum member `LogLevel.Info` = 1 representing info.
   * @zh 枚举项 `LogLevel.Info` = 1，表示信息。
   */
  Info = 1,
  /**
   * Enum member `LogLevel.Warn` = 2 representing warn.
   * @zh 枚举项 `LogLevel.Warn` = 2，表示警告色。
   */
  Warn = 2,
  /**
   * Enum member `LogLevel.Error` = 3 representing error.
   * @zh 枚举项 `LogLevel.Error` = 3，表示错误。
   */
  Error = 3,
  /**
   * Enum member `LogLevel.Debug` = 4 representing debug.
   * @zh 枚举项 `LogLevel.Debug` = 4，表示Debug。
   */
  Debug = 4
}
