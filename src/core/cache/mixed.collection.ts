/**
 * @fileoverview Module `src/core/cache/mixed.collection.ts` providing mixed collection definitions and implementation.
 * @zh 模块文件 `src/core/cache/mixed.collection.ts`，提供mixed集合相关的定义与实现。
 */


import { DuiBase } from '@dotos/dui/base';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from 'events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Class `MixedCollection` encapsulating mixed collection data structures and logic in `src/core/cache`.
 * @zh 类 `MixedCollection`，封装 `src/core/cache` 中的Mixed集合数据结构与处理逻辑。
 */
export class MixedCollection<T>  extends EventEmitter{
  /**
   * Property `items` (`any`) storing items (default: `[]`).
   * @zh 属性 `items`（类型：`any`），用于存储或配置条目列表（默认值：`[]`）。
   */
  items = [];
  /**
   * Property `map` (`any`) storing map (default: `{}`).
   * @zh 属性 `map`（类型：`any`），用于存储或配置映射表（默认值：`{}`）。
   */
  map = {};
  /**
   * Property `keys` (`any`) storing keys (default: `[]`).
   * @zh 属性 `keys`（类型：`any`），用于存储或配置键列表（默认值：`[]`）。
   */
  keys = [];
  /**
   * Property `length` (`any`) storing length (default: `0`).
   * @zh 属性 `length`（类型：`any`），用于存储或配置长度（默认值：`0`）。
   */
  length = 0;
  /**
   * Property `itemsSubject` (`BehaviorSubject<Array<any>>`) storing items subject (default: `new BehaviorSubject([])`).
   * @zh 属性 `itemsSubject`（类型：`BehaviorSubject<Array<any>>`），用于存储或配置条目列表主题流（默认值：`new BehaviorSubject([])`）。
   */
  itemsSubject=new BehaviorSubject([]);

  /**
   * Property `allowFunctions` (`boolean`) storing allow functions (default: `false`).
   * @zh 属性 `allowFunctions`（类型：`boolean`），用于存储或配置允许函数（默认值：`false`）。
   */
  public allowFunctions = false;

  /**
   * Creates an instance of `MixedCollection` and initializes its dependencies and internal state.
   * @zh 创建 `MixedCollection` 实例，并初始化其依赖项与内部状态。
   * @param allowFunctions - Injected or initial allow functions (`any`) / 注入或传入的允许函数（`any`）
   * @param keyFn - Injected or initial key fn (`any`) / 注入或传入的键函数（`any`）
   */
  constructor(allowFunctions?, keyFn?) {
    super();
    this.allowFunctions = allowFunctions === true;
    if (keyFn) {
      this.getKey = keyFn;
    }
  }


  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param o - o parameter (`Object`) / o参数（`Object`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  add(key, o?: Object): Object {
    if (arguments.length == 1) {
      o = arguments[0];
      key = this.getKey(o);
    }
    if (typeof key != 'undefined' && key !== null) {
      let old = this.map[key];
      if (typeof old != 'undefined') {
        return this.replace(key, o);
      }
      this.map[key] = o;
    }
    this.length++;
    this.items.push(o);
    this.keys.push(key);
    this.itemsSubject.next(this.items);
    return o;
  }

  /**
   * Executes `getKey` to handle get key.
   * @zh 执行 `getKey`，用于获取键。
   * @param o - o parameter (`any`) / o参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getKey(o) {
    return o.id;
  }

  /**
   * Executes `replace` to handle replace.
   * @zh 执行 `replace`，用于替换。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param o - o parameter (`any`) / o参数（`any`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  replace(key: string, o): Object {
    if (arguments.length == 1) {
      o = arguments[0];
      key = this.getKey(o);
    }
    let old = this.map[key];
    if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
      return this.add(key, o);
    }
    let index = this.indexOfKey(key);
    this.items[index] = o;
    this.itemsSubject.next(this.items);
    this.map[key] = o;
    return o;
  }

  /**
   * Executes `addAll` to handle add all.
   * @zh 执行 `addAll`，用于添加全部。
   * @param objs - objs parameter (`Object | any[]`) / 对象参数（`Object | any[]`）
   */
  addAll(objs) {
    if (Array.isArray(objs) && objs.length > 0) {
      let args = arguments.length > 1 ? arguments : objs;
      for (let i = 0, len = args.length; i < len; i++) {
        this.add(args[i]);
      }
    } else {
      for (let key in objs) {
        if (this.allowFunctions || typeof objs[key] != 'function') {
          this.add(key, objs[key]);
        }
      }
    }
  }

  /**
   * Executes `each` to handle each.
   * @zh 执行 `each`，用于每个。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`any`) / scope参数（`any`）
   */
  each(fn: Function, scope?) {
    let items = [].concat(this.items);
    for (let i = 0, len = items.length; i < len; i++) {
      if (fn.call(scope || items[i], items[i], i, len) === false) {
        break;
      }
    }
    this.itemsSubject.next(this.items);
  }

  /**
   * Executes `eachKey` to handle each key.
   * @zh 执行 `eachKey`，用于每个键。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`Object`) / scope参数（`Object`）
   */
  eachKey(fn: Function, scope: Object) {
    for (let i = 0, len = this.keys.length; i < len; i++) {
      fn.call(scope || window, this.keys[i], this.items[i], i, len);
    }
    this.itemsSubject.next(this.items);
  }

  /**
   * Executes `find` to handle find.
   * @zh 执行 `find`，用于查找。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`Object`) / scope参数（`Object`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  find(fn: Function, scope: Object): Object {
    for (let i = 0, len = this.items.length; i < len; i++) {
      if (fn.call(scope || window, this.items[i], this.keys[i])) {
        return this.items[i];
      }
    }
    return null;
  }

  /**
   * Executes `insert` to handle insert.
   * @zh 执行 `insert`，用于插入。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param o - o parameter (`Object`) / o参数（`Object`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  insert(index: number, key: string, o: Object): Object {
    if (arguments.length == 2) {
      o = arguments[1];
      key = this.getKey(o);
    }
    if (this.containsKey(key)) {
      this.removeKey(key);
    }
    if (index >= this.length) {
      return this.add(key, o);
    }
    this.length++;
    this.items.splice(index, 0, o);
    this.itemsSubject.next(this.items);
    if (typeof key != 'undefined' && key !== null) {
      this.map[key] = o;
    }
    this.keys.splice(index, 0, key);
    return o;
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param o - o parameter (`Object`) / o参数（`Object`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  remove(o: Object): Object {
    return this.removeAt(this.indexOf(o));
  }

  /**
   * Executes `removeAt` to handle remove at.
   * @zh 执行 `removeAt`，用于移除位于。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  removeAt(index: number): Object {
    if (index < this.length && index >= 0) {
      this.length--;
      let o = this.items[index];
      this.items.splice(index, 1);
      this.itemsSubject.next(this.items);
      let key = this.keys[index];
      if (typeof key != 'undefined') {
        delete this.map[key];
      }
      this.keys.splice(index, 1);
      return o;
    }
    return false;
  }

  /**
   * Executes `pop` to handle pop.
   * @zh 执行 `pop`，用于弹出。
   */
  pop() {
    return this.removeAt(this.length - 1);
  }

  /**
   * Executes `removeKey` to handle remove key.
   * @zh 执行 `removeKey`，用于移除键。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  removeKey(key: string): Object {
    return this.removeAt(this.indexOfKey(key));
  }

  /**
   * Executes `getCount` to handle get count.
   * @zh 执行 `getCount`，用于获取计数。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getCount(): number {
    return this.length;
  }

  /**
   * Executes `indexOf` to handle index of.
   * @zh 执行 `indexOf`，用于索引的。
   * @param o - o parameter (`Object`) / o参数（`Object`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  indexOf(o: Object): number {
    return this.items.indexOf(o);
  }

  /**
   * Executes `indexOfKey` to handle index of key.
   * @zh 执行 `indexOfKey`，用于索引的键。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  indexOfKey(key: string): number {
    return this.keys.indexOf(key);
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param key - key parameter (`number | string`) / 键参数（`number | string`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  get(key: number | string): Object {
    let mk = this.map[key], item = mk !== undefined ? mk : typeof key == 'number' ? this.items[key] : undefined;
    return typeof item != 'function' || this.allowFunctions ? item : null;
  }

  /**
   * Executes `itemAt` to handle item at.
   * @zh 执行 `itemAt`，用于条目位于。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  itemAt(index: number): Object {
    return this.items[index];
  }

  /**
   * Executes `key` to handle key.
   * @zh 执行 `key`，用于键。
   * @param key - key parameter (`number | string`) / 键参数（`number | string`）
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  key(key: number | string): Object {
    return this.map[key];
  }

  /**
   * Executes `contains` to handle contains.
   * @zh 执行 `contains`，用于contains。
   * @param o - o parameter (`Object`) / o参数（`Object`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  contains(o: Object): boolean {
    return this.indexOf(o) != -1;
  }

  /**
   * Executes `containsKey` to handle contains key.
   * @zh 执行 `containsKey`，用于contains键。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  containsKey(key: string): boolean {
    return typeof this.map[key] != 'undefined';
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear() {
    this.length = 0;
    this.items = [];
    this.keys = [];
    this.map = {};
  }

  /**
   * Executes `first` to handle first.
   * @zh 执行 `first`，用于首个。
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  first(): Object {
    return this.items[0];
  }

  /**
   * Executes `last` to handle last.
   * @zh 执行 `last`，用于末尾。
   * @returns Result of type `Object` / 类型为 `Object` 的返回值
   */
  last(): Object {
    return this.items[this.length - 1];
  }

  /**
   * Executes `_sort` to handle sort.
   * @zh 执行 `_sort`，用于排序。
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @param dir - dir parameter (`string`) / 目录参数（`string`）
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   */
  _sort(property: string, dir: string, fn: Function) {
    let i, len, dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1,
      c = [], keys = this.keys, items = this.items;
    fn = fn ||
      function (a, b) {
        return a - b;
      };

    for (i = 0, len = items.length; i < len; i++) {
      c[c.length] = { key: keys[i], value: items[i], index: i };
    }

    //sort the temporary array
    c.sort(
      function (a, b) {
        let v = fn(a[property], b[property]) * dsc;
        if (v === 0) {
          v = a.index < b.index ? -1 : 1;
        }
        return v;
      });

    for (i = 0, len = c.length; i < len; i++) {
      items[i] = c[i].value;
      keys[i] = c[i].key;
    }
  }

  /**
   * Executes `sort` to handle sort.
   * @zh 执行 `sort`，用于排序。
   * @param dir - dir parameter (`any`) / 目录参数（`any`）
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   */
  sort(dir, fn: Function) {
    this._sort('value', dir, fn);
  }

  /**
   * Executes `reorder` to handle reorder.
   * @zh 执行 `reorder`，用于重排。
   * @param mapping - mapping parameter (`Object`) / 映射参数（`Object`）
   */
  reorder(mapping: Object) {
    let items = this.items, index = 0, length = items.length, order = [], remaining = [], oldIndex;

    //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
    for (oldIndex in mapping) {
      order[mapping[oldIndex]] = items[oldIndex];
    }
    for (index = 0; index < length; index++) {
      if (mapping[index] == undefined) {
        remaining.push(items[index]);
      }
    }
    for (index = 0; index < length; index++) {
      if (order[index] == undefined) {
        order[index] = remaining.shift();
      }
    }
    this.clear();
    this.addAll(order);
  }

  /**
   * Executes `keySort` to handle key sort.
   * @zh 执行 `keySort`，用于键排序。
   * @param dir - dir parameter (`any`) / 目录参数（`any`）
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   */
  keySort(dir, fn: Function) {
    this._sort('key', dir, fn ||
      function (a, b) {
        let v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
        return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
      });
  }

  /**
   * Executes `getRange` to handle get range.
   * @zh 执行 `getRange`，用于获取范围。
   * @param start - start parameter (`any`) / 开始参数（`any`）
   * @param end - end parameter (`any`) / 结束参数（`any`）
   * @returns Result of type `Array<any>` / 类型为 `Array<any>` 的返回值
   */
  getRange(start, end) {
    let items = this.items;
    if (items.length < 1) {
      return [];
    }
    start = start || 0;
    end = Math.min(typeof end == 'undefined' ? this.length - 1 : end, this.length - 1);
    let i, r = [];
    if (start <= end) {
      for (i = start; i <= end; i++) {
        r[r.length] = items[i];
      }
    } else {
      for (i = start; i >= end; i--) {
        r[r.length] = items[i];
      }
    }
    return r;
  }

  /**
   * Executes `filter` to handle filter.
   * @zh 执行 `filter`，用于过滤。
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param anyMatch - any match parameter (`boolean`) / 任意匹配参数（`boolean`）
   * @param caseSensitive - case sensitive parameter (`boolean`) / caseSensitive参数（`boolean`）
   * @returns Result of type `MixedCollection<any>` / 类型为 `MixedCollection<any>` 的返回值
   */
  filter(property: string, value, anyMatch: boolean, caseSensitive: boolean) {
    if (DuiBase.isEmpty(value, false)) {
      return this.clone();
    }
    value = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.filterBy(
      function (o) {
        return o && value.test(o[property]);
      });
  }

  /**
   * Executes `filterBy` to handle filter by.
   * @zh 执行 `filterBy`，用于过滤按。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`any`) / scope参数（`any`）
   * @returns Result of type `MixedCollection<any>` / 类型为 `MixedCollection<any>` 的返回值
   */
  filterBy(fn: Function, scope?) {
    let r = new MixedCollection();
    r.getKey = this.getKey;
    let k = this.keys, it = this.items;
    for (let i = 0, len = it.length; i < len; i++) {
      if (fn.call(scope || this, it[i], k[i])) {
        r.add(k[i], it[i]);
      }
    }
    return r;
  }

  /**
   * Executes `findIndex` to handle find index.
   * @zh 执行 `findIndex`，用于查找索引。
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param start - start parameter (`number`) / 开始参数（`number`）
   * @param anyMatch - any match parameter (`boolean`) / 任意匹配参数（`boolean`）
   * @param caseSensitive - case sensitive parameter (`boolean`) / caseSensitive参数（`boolean`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  findIndex(property: string, value, start: number, anyMatch: boolean, caseSensitive: boolean): number {
    if (DuiBase.isEmpty(value, false)) {
      return -1;
    }
    value = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.findIndexBy(
      function (o) {
        return o && value.test(o[property]);
      }, null, start);
  }

  /**
   * Executes `findIndexBy` to handle find index by.
   * @zh 执行 `findIndexBy`，用于查找索引按。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   * @param scope - scope parameter (`Object`) / scope参数（`Object`）
   * @param start - start parameter (`number`) / 开始参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  findIndexBy(fn: Function, scope: Object, start: number): number {
    let k = this.keys, it = this.items;
    for (let i = start || 0, len = it.length; i < len; i++) {
      if (fn.call(scope || this, it[i], k[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Executes `createValueMatcher` to handle create value matcher.
   * @zh 执行 `createValueMatcher`，用于创建值匹配器。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param anyMatch - any match parameter (`boolean`) / 任意匹配参数（`boolean`）
   * @param caseSensitive - case sensitive parameter (`boolean`) / caseSensitive参数（`boolean`）
   * @param exactMatch - exact match parameter (`boolean`) / exact匹配参数（`boolean`）
   */
  createValueMatcher(value, anyMatch: boolean, caseSensitive: boolean, exactMatch?: boolean) {
    if (!value.exec) {
      let er = DuiBase.escapeRe;
      value = String(value);
      if (anyMatch === true) {
        value = er(value);
      } else {
        value = '^' + er(value);
        if (exactMatch === true) {
          value += '$';
        }
      }
      value = new RegExp(value, caseSensitive ? '' : 'i');
    }
    return value;
  }

  /**
   * Executes `clone` to handle clone.
   * @zh 执行 `clone`，用于克隆。
   * @returns Result of type `MixedCollection<any>` / 类型为 `MixedCollection<any>` 的返回值
   */
  clone() {
    let r = new MixedCollection();
    let k = this.keys, it = this.items;
    for (let i = 0, len = it.length; i < len; i++) {
      r.add(k[i], it[i]);
    }
    r.getKey = this.getKey;
    return r;
  }
}
