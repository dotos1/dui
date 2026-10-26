/**
 * @fileoverview Module `src/core/cache/collection.ts` providing collection definitions and implementation.
 * @zh 模块文件 `src/core/cache/collection.ts`，提供集合相关的定义与实现。
 */

import { BaseObject } from "./base-obejct";


/**
 * Class `Collection` encapsulating collection data structures and logic in `src/core/cache`.
 * @zh 类 `Collection`，封装 `src/core/cache` 中的集合数据结构与处理逻辑。
 */
export class Collection extends BaseObject {

  /**
   * Property `array_` (`any[]`) storing array (default: `[]`).
   * @zh 属性 `array_`（类型：`any[]`），用于存储或配置数组（默认值：`[]`）。
   */
  private array_=[];

  /**
   * Property `unique_` (`any`) storing unique.
   * @zh 属性 `unique_`（类型：`any`），用于存储或配置唯一。
   */
  private unique_;

  /**
   * Creates an instance of `Collection` and initializes its dependencies and internal state.
   * @zh 创建 `Collection` 实例，并初始化其依赖项与内部状态。
   * @param array - Injected or initial array (`any`) / 注入或传入的数组（`any`）
   * @param options - Injected or initial options (`any`) / 注入或传入的配置选项（`any`）
   */
  constructor(array?, options?) {
    super(options);

    options = options || {};

    this.unique_ = !!options.unique;

    this.array_ = array ? array : [];

    if (this.unique_) {
      for (let i = 0, ii = this.array_.length; i < ii; ++i) {
        this.assertUnique_(this.array_[i], i);
      }
    }
    this.updateLength_();
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear() {
    while (this.getLength() > 0) {
      this.pop();
    }
  }

  /**
   * Executes `extend` to handle extend.
   * @zh 执行 `extend`，用于extend。
   * @param arr - arr parameter (`any`) / arr参数（`any`）
   */
  extend(arr) {
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      this.push(arr[i]);
    }
    return this;
  }

  /**
   * Executes `forEach` to handle for each.
   * @zh 执行 `forEach`，用于用于每个。
   * @param f - f parameter (`any`) / f参数（`any`）
   */
  forEach(f) {
    const array = this.array_;
    for (let i = 0, ii = array.length; i < ii; ++i) {
      f(array[i], i, array);
    }
  }

  /**
   * Executes `getArray` to handle get array.
   * @zh 执行 `getArray`，用于获取数组。
   */
  getArray() {
    return this.array_;
  }

  /**
   * Executes `item` to handle item.
   * @zh 执行 `item`，用于条目。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   */
  item(index) {
    return this.array_[index];
  }

  /**
   * Executes `getLength` to handle get length.
   * @zh 执行 `getLength`，用于获取长度。
   */
  getLength() {
    return this.get("length");
  }

  /**
   * Executes `insertAt` to handle insert at.
   * @zh 执行 `insertAt`，用于插入位于。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   */
  insertAt(index, elem) {
    if (index < 0 || index > this.getLength()) {
      throw new Error('Index out of bounds: ' + index);
    }
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    this.array_.splice(index, 0, elem);
    this.updateLength_();
    this.emit('add',{value:elem,index:index});
  }
  /**
   * Executes `pop` to handle pop.
   * @zh 执行 `pop`，用于弹出。
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Executes `push` to handle push.
   * @zh 执行 `push`，用于推入。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   */
  push(elem) {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    const n = this.getLength();
    this.insertAt(n, elem);
    return this.getLength();
  }
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   */
  remove(elem) {
    const arr = this.array_;
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      if (arr[i] === elem) {
        return this.removeAt(i);
      }
    }
    return undefined;
  }
  /**
   * Executes `removeAt` to handle remove at.
   * @zh 执行 `removeAt`，用于移除位于。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   */
  removeAt(index) {
    if (index < 0 || index >= this.getLength()) {
      return undefined;
    }
    const prev = this.array_[index];
    this.array_.splice(index, 1);
    this.updateLength_();
    this.emit('remove',{prev:prev,index:index});
    return prev;
  }
  /**
   * Executes `setAt` to handle set at.
   * @zh 执行 `setAt`，用于集合位于。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   */
  setAt(index, elem) {
    const n = this.getLength();
    if (index >= n) {
      this.insertAt(index, elem);
      return;
    }
    if (index < 0) {
      throw new Error('Index out of bounds: ' + index);
    }
    if (this.unique_) {
      this.assertUnique_(elem, index);
    }
    const prev = this.array_[index];
    this.array_[index] = elem;
    this.emit('remove',{prev:prev,index:index});
    this.emit('add',{value:elem,index:index});
  }

  /**
   * Executes `updateLength_` to handle update length.
   * @zh 执行 `updateLength_`，用于更新长度。
   */
  updateLength_() {
    this.set('length', this.array_.length);
  }

  /**
   * Executes `assertUnique_` to handle assert unique.
   * @zh 执行 `assertUnique_`，用于断言唯一。
   * @param elem - elem parameter (`any`) / elem参数（`any`）
   * @param except - except parameter (`any`) / except参数（`any`）
   */
  assertUnique_(elem, except?) {
    for (let i = 0, ii = this.array_.length; i < ii; ++i) {
      if (this.array_[i] === elem && i !== except) {
        throw new Error();
      }
    }
  }
}
