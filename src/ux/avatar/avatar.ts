/**
 * @fileoverview Module `src/ux/avatar/avatar.ts` providing avatar definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar.ts`，提供头像相关的定义与实现。
 */

import { SafeUrl } from '@angular/platform-browser';
import { IAVatar } from './avatar.interface';

/**
 * Class `Avatar` encapsulating avatar data structures and logic in `src/ux/avatar`.
 * @zh 类 `Avatar`，封装 `src/ux/avatar` 中的头像数据结构与处理逻辑。
 */
export class Avatar implements IAVatar {

  /**
   * Creates an instance of `Avatar` and initializes its dependencies and internal state.
   * @zh 创建 `Avatar` 实例，并初始化其依赖项与内部状态。
   * @param id - Injected or initial id (`string`) / 注入或传入的唯一标识（`string`）
   * @param name - Injected or initial name (`string`) / 注入或传入的名称（`string`）
   * @param src - Injected or initial src (`string | SafeUrl`) / 注入或传入的源路径（`string | SafeUrl`）
   */
  constructor(
    public id: string,
    public name: string,
    public src?: string|SafeUrl) {
  }

  /**
   * Executes `getAvatar` to handle get avatar.
   * @zh 执行 `getAvatar`，用于获取头像。
   * @param size - size parameter (`number`) / 尺寸参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getAvatar(size: number): string {
    return this.getInitials(this.name, size);
  }

  /**
   * Executes `getInitials` to handle get initials.
   * @zh 执行 `getInitials`，用于获取初始。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param size - size parameter (`number`) / 尺寸参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getInitials(name: string, size: number): string {
    name = String(name ?? '').trim();
    if (!name) {
      return '';
    }
    const initials = name.split(' ');
    if (size && size < initials.length) {
      return this.constructInitials(initials.slice(0, size));
    } else {
      return this.constructInitials(initials);
    }
  }

  /**
   * Executes `constructInitials` to handle construct initials.
   * @zh 执行 `constructInitials`，用于构造初始。
   * @param elements - elements parameter (`string[]`) / 元素列表参数（`string[]`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private constructInitials(elements: string[]): string {
    if (!elements || !elements.length) {
      return '';
    }
    return elements
      .filter(element => element && element.length > 0)
      .map(element => element[0].toUpperCase())
      .join('');
  }
}
