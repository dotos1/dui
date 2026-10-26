/**
 * @fileoverview Module `src/core/cache/base-obejct.ts` providing base obejct definitions and implementation.
 * @zh 模块文件 `src/core/cache/base-obejct.ts`，提供基础obejct相关的定义与实现。
 */

import { Observer } from '@dotos/dui/base';

/**
 * Class `BaseObject` encapsulating base object data structures and logic in `src/core/cache`.
 * @zh 类 `BaseObject`，封装 `src/core/cache` 中的基础对象数据结构与处理逻辑。
 */
export class BaseObject extends Observer {

  /**
   * Property `values_` (`any`) storing values (default: `null`).
   * @zh 属性 `values_`（类型：`any`），用于存储或配置值列表（默认值：`null`）。
   */
  private values_=null;

  /**
   * Creates an instance of `BaseObject` and initializes its dependencies and internal state.
   * @zh 创建 `BaseObject` 实例，并初始化其依赖项与内部状态。
   * @param values - Injected or initial values (`any`) / 注入或传入的值列表（`any`）
   */
  constructor(values?) {
    super();
    if (values !== undefined) {
      this.setProperties(values);
    }
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param key - key parameter (`any`) / 键参数（`any`）
   */
  get(key) {
    let value;
    if (this.values_ && this.values_.hasOwnProperty(key)) {
      value = this.values_[key];
    }
    return value;
  }


  /**
   * Executes `getKeys` to handle get keys.
   * @zh 执行 `getKeys`，用于获取键列表。
   */
  getKeys() {
    return (this.values_ && Object.keys(this.values_)) || [];
  }


  /**
   * Executes `getProperties` to handle get properties.
   * @zh 执行 `getProperties`，用于获取属性列表。
   */
  getProperties() {
    return (this.values_ && Object.assign({}, this.values_)) || {};
  }


  /**
   * Executes `hasProperties` to handle has properties.
   * @zh 执行 `hasProperties`，用于是否包含属性列表。
   */
  hasProperties() {
    return !!this.values_;
  }



  /**
   * Executes `addChangeListener` to handle add change listener.
   * @zh 执行 `addChangeListener`，用于添加变更监听器。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param listener - listener parameter (`any`) / 监听器参数（`any`）
   */
  addChangeListener(key, listener) {
    this.on(`change:${key}`, listener);
  }

  /**
   * Executes `removeChangeListener` to handle remove change listener.
   * @zh 执行 `removeChangeListener`，用于移除变更监听器。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param listener - listener parameter (`any`) / 监听器参数（`any`）
   */
  removeChangeListener(key, listener) {
    this.off(`change:${key}`, listener);
  }

  /**
   * Executes `set` to handle set.
   * @zh 执行 `set`，用于集合。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  set(key, value, silent?) {
    const values = this.values_ || (this.values_ = {});
    if (silent) {
      values[key] = value;
    } else {
      const oldValue = values[key];
      values[key] = value;
      if (oldValue !== value) {
        this.notify(key, oldValue);
      }
    }
  }


  /**
   * Executes `setProperties` to handle set properties.
   * @zh 执行 `setProperties`，用于集合属性列表。
   * @param values - values parameter (`any`) / 值列表参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  setProperties(values, silent?) {
    for (const key in values) {
      this.set(key, values[key], silent);
    }
  }

  /**
   * Executes `applyProperties` to handle apply properties.
   * @zh 执行 `applyProperties`，用于应用属性列表。
   * @param source - source parameter (`any`) / 源参数（`any`）
   */
  applyProperties(source) {
    if (!source.values_) {
      return;
    }
    Object.assign(this.values_ || (this.values_ = {}), source.values_);
  }

  /**
   * Executes `unset` to handle unset.
   * @zh 执行 `unset`，用于unset。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  unset(key, silent) {
    if (this.values_ && key in this.values_) {
      const oldValue = this.values_[key];
      delete this.values_[key];
      if (this.values_==null) {
        this.values_ = null;
      }
      if (!silent) {
        this.notify(key, oldValue);
      }
    }
  }
}
