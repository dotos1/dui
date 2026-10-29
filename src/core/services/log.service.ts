/**
 * @fileoverview Module `src/core/services/log.service.ts` providing log service definitions and implementation.
 * @zh 模块文件 `src/core/services/log.service.ts`，提供日志服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { ConfigService } from '@dotos/dui/core/config';


/**
 * Class `LogLevelsEnum` encapsulating log levels enum data structures and logic in `src/core/services`.
 * @zh 类 `LogLevelsEnum`，封装 `src/core/services` 中的日志层级Enum数据结构与处理逻辑。
 */
export class LogLevelsEnum extends Number {
  /**
   * Property `TRACE` (`number`) storing trace (default: `5`).
   * @zh 属性 `TRACE`（类型：`number`），用于存储或配置TRACE（默认值：`5`）。
   */
  static TRACE: number = 5;
  /**
   * Property `DEBUG` (`number`) storing debug (default: `4`).
   * @zh 属性 `DEBUG`（类型：`number`），用于存储或配置DEBUG（默认值：`4`）。
   */
  static DEBUG: number = 4;
  /**
   * Property `INFO` (`number`) storing info (default: `3`).
   * @zh 属性 `INFO`（类型：`number`），用于存储或配置信息（默认值：`3`）。
   */
  static INFO: number = 3;
  /**
   * Property `WARN` (`number`) storing warn (default: `2`).
   * @zh 属性 `WARN`（类型：`number`），用于存储或配置警告色（默认值：`2`）。
   */
  static WARN: number = 2;
  /**
   * Property `ERROR` (`number`) storing error (default: `1`).
   * @zh 属性 `ERROR`（类型：`number`），用于存储或配置错误（默认值：`1`）。
   */
  static ERROR: number = 1;
  /**
   * Property `SILENT` (`number`) storing silent (default: `0`).
   * @zh 属性 `SILENT`（类型：`number`），用于存储或配置SILENT（默认值：`0`）。
   */
  static SILENT: number = 0;
}

/**
 * Constant/variable `logLevels` defining log levels in `src/core/services`.
 * @zh 常量/变量 `logLevels`，定义 `src/core/services` 中的日志层级。
 */
export let logLevels = [
  {level: LogLevelsEnum.TRACE, name: 'TRACE'},
  {level: LogLevelsEnum.DEBUG, name: 'DEBUG'},
  {level: LogLevelsEnum.INFO, name: 'INFO'},
  {level: LogLevelsEnum.WARN, name: 'WARN'},
  {level: LogLevelsEnum.ERROR, name: 'ERROR'},
  {level: LogLevelsEnum.SILENT, name: 'SILENT'}
];


/**
 * Injectable Angular service `LogService` managing log service state and operations in `src/core/services`.
 * @zh 可注入的 Angular 服务 `LogService`，管理 `src/core/services` 中的日志服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class LogService {

  /**
   * Gets the current current log level (`currentLogLevel: any`).
   * @zh 获取当前当前日志层级（`currentLogLevel: any`）。
   */
  get currentLogLevel() {
    if (this._currentLogLevel !== undefined) {
      return this._currentLogLevel;
    }else{
      let configLevel: string = this.appConfig.get<string>('logLevel');
      if (configLevel) {
        return this.getLogLevel(configLevel);
      }else if(this.localStore.get('logLevel')){
        configLevel =this.localStore.get('logLevel');
        return this.getLogLevel(configLevel);
      }
      return LogLevelsEnum.TRACE;
    }
  }

  /**
   * Sets the current log level (`currentLogLevel`).
   * @zh 设置当前日志层级（`currentLogLevel`）。
   * @param level - New current log level value (`any`) / 新的当前日志层级值（`any`）
   */
  set currentLogLevel(level) {
    if(typeof(level)=='string'){
      this._currentLogLevel=this.getLogLevel(level);
    }else{
      this._currentLogLevel=level;
    }
  }

  /**
   * Property `_currentLogLevel` (`any`) storing current log level.
   * @zh 属性 `_currentLogLevel`（类型：`any`），用于存储或配置当前日志层级。
   */
  _currentLogLevel;

  /**
   * Property `onMessage` (`any`) storing on message.
   * @zh 属性 `onMessage`（类型：`any`），用于存储或配置当消息。
   */
  onMessage;

  /**
   * Creates an instance of `LogService` and initializes its dependencies and internal state.
   * @zh 创建 `LogService` 实例，并初始化其依赖项与内部状态。
   * @param appConfig - Injected or initial app config (`ConfigService`) / 注入或传入的app配置（`ConfigService`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   */
  constructor(private appConfig: ConfigService,
    public localStore: LocalStorageService) {
    this.onMessage = new Subject();
  }

  /**
   * Logs a message at the "ERROR" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `error`，用于错误。
   */
  error(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.ERROR) {
      this.messageBus(message, 'ERROR');
      console.error(message, ...optionalParams);
    }
  }

  /**
   * Logs a message at the "DEBUG" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `debug`，用于debug。
   */
  debug(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.DEBUG) {
      this.messageBus(message, 'DEBUG');
      // eslint-disable-next-line no-restricted-syntax, no-console
      console.debug(message, ...optionalParams);
    }
  }

  /**
   * Logs a message at the "INFO" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `info`，用于信息。
   */
  info(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.INFO) {

      this.messageBus(message, 'INFO');

     
      // eslint-disable-next-line no-restricted-syntax, no-console
      console.info(message, ...optionalParams);
    }
  }

  /**
   * Logs a message at any level from "TRACE" upwards.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `log`，用于日志。
   */
  log(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

      this.messageBus(message, 'LOG');

      console.log(message, ...optionalParams);
    }
  }

  /**
   * Logs a message at the "TRACE" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `trace`，用于trace。
   */
  trace(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.TRACE) {

      this.messageBus(message, 'TRACE');

      // eslint-disable-next-line no-restricted-syntax, no-console
      console.trace(message, ...optionalParams);
    }
  }

  /**
   * Logs a message at the "WARN" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `warn`，用于警告色。
   */
  warn(message?, ...optionalParams) {
    if (this.currentLogLevel >= LogLevelsEnum.WARN) {

      this.messageBus(message, 'WARN');

      console.warn(message, ...optionalParams);
    }
  }

  /**
   * Logs a message if a boolean test fails.
   * @param test Test value (typically a boolean expression)
   * @param message Message to show if test is false
   * @param optionalParams Interpolation values for the message in "printf" format

   * @zh 执行 `assert`，用于断言。
   */
  assert(test?: boolean, message?: string, ...optionalParams) {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      if (!test) {
        this.messageBus(message, 'ASSERT');
      }

      console.assert(test, message, ...optionalParams);
    }
  }

  /**
   * Starts an indented group of log messages.
   * @param groupTitle Title shown at the start of the group
   * @param optionalParams Interpolation values for the title in "printf" format

   * @zh 执行 `group`，用于分组。
   */
  group(groupTitle?: string, ...optionalParams) {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      console.group(groupTitle, ...optionalParams);
    }
  }

  /**
   * Ends a indented group of log messages.

   * @zh 执行 `groupEnd`，用于分组结束。
   */
  groupEnd() {
    if (this.currentLogLevel !== LogLevelsEnum.SILENT) {
      console.groupEnd();
    }
  }

  /**
   * Converts a log level name string into its numeric equivalent.
   * @param level Level name
   * @returns Numeric log level

   * @zh 执行 `getLogLevel`，用于获取日志层级。
   */
  getLogLevel(level: string): LogLevelsEnum {
    const referencedLevel = logLevels.find((currentLevel: { name? }) => {
      return currentLevel.name.toLocaleLowerCase() === level.toLocaleLowerCase();
    });

    return referencedLevel ? referencedLevel.level : 5;
  }

  /**
   * Triggers notification callback for log messages.
   * @param text Message text
   * @param logLevel Log level for the message

   * @zh 执行 `messageBus`，用于消息Bus。
   */
  messageBus(text: string, logLevel: string) {
    this.onMessage.next({ text: text, type: logLevel });
  }
}
