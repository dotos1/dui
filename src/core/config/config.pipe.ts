/**
 * @fileoverview Module `src/core/config/config.pipe.ts` providing config pipe definitions and implementation.
 * @zh 模块文件 `src/core/config/config.pipe.ts`，提供配置管道相关的定义与实现。
 */

// angular
import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * Angular pipe `ConfigPipe` (name: 'config') transforming values for config pipe display in templates.
 * @zh Angular 管道 `ConfigPipe`（name: 'config'），在模板中转换数据以用于配置管道展示。
 */
@Pipe({
  name: 'config'
})
export class ConfigPipe implements PipeTransform {
  /**
   * Creates an instance of `ConfigPipe` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigPipe` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`ConfigService`) / 注入或传入的配置（`ConfigService`）
   */
  constructor(private readonly config: ConfigService) {
  }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`string | string[]`) / 值参数（`string | string[]`）
   * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
   */
  transform(value: string | Array<string>) {
    return this.config.getSettings(value);
  }
}
