/**
 * @fileoverview Module `src/core/cache/mixed.collection.ts` providing mixed collection definitions and implementation.
 * @zh 模块文件 `src/core/cache/mixed.collection.ts`：既能按下标、又能按键取元素的有序集合（ExtJS MixedCollection 的移植）。
 */


import { DuiBase } from '@dotos1/dui/base';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from 'events';

/** 集合元素的键 */
export type CollectionKey = string | number;

/** 取键函数：默认取元素的 `id` */
export type CollectionKeyFn<T> = (o: T) => CollectionKey;

/**
 * 有序集合：保留插入顺序，同时维护「键 → 元素」映射。
 * @zh 类 `MixedCollection`，元素类型为 `T`。
 */
export class MixedCollection<T> extends EventEmitter {
  /** 元素（按顺序） */
  items: T[] = [];
  /** 键 → 元素 */
  map: { [key: string]: T } = {};
  /** 与 items 一一对应的键 */
  keys: CollectionKey[] = [];
  /** 元素个数 */
  length = 0;
  /** 元素变化时推送当前 items */
  itemsSubject = new BehaviorSubject<T[]>([]);

  /** 是否允许函数作为元素 */
  public allowFunctions = false;

  constructor(allowFunctions?: boolean, keyFn?: CollectionKeyFn<T>) {
    super();
    this.allowFunctions = allowFunctions === true;
    if (keyFn) {
      this.getKey = keyFn;
    }
  }

  /** 添加元素：只传元素时用 getKey 取键 */
  add(o: T): T;
  add(key: CollectionKey, o: T): T;
  add(keyOrItem: CollectionKey | T, item?: T): T {
    let key: CollectionKey;
    let o: T;
    if (arguments.length == 1) {
      o = keyOrItem as T;
      key = this.getKey(o);
    } else {
      key = keyOrItem as CollectionKey;
      o = item;
    }
    if (typeof key != 'undefined' && key !== null) {
      const old = this.map[key];
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

  /** 取元素的键，默认是 `id`；构造时可传 keyFn 覆盖 */
  getKey(o: T): CollectionKey {
    return (o as { id?: CollectionKey }).id;
  }

  /** 替换同键元素；键不存在时等同 add */
  replace(o: T): T;
  replace(key: CollectionKey, o: T): T;
  replace(keyOrItem: CollectionKey | T, item?: T): T {
    let key: CollectionKey;
    let o: T;
    if (arguments.length == 1) {
      o = keyOrItem as T;
      key = this.getKey(o);
    } else {
      key = keyOrItem as CollectionKey;
      o = item;
    }
    const old = this.map[key];
    if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
      return this.add(key, o);
    }
    const index = this.indexOfKey(key);
    this.items[index] = o;
    this.itemsSubject.next(this.items);
    this.map[key] = o;
    return o;
  }

  /** 批量添加：数组按 getKey 取键；对象按属性名作键 */
  addAll(objs: T[] | { [key: string]: T }): void {
    if (Array.isArray(objs) && objs.length > 0) {
      for (let i = 0, len = objs.length; i < len; i++) {
        this.add(objs[i]);
      }
    } else {
      for (const key in objs) {
        const value = (objs as { [key: string]: T })[key];
        if (this.allowFunctions || typeof value != 'function') {
          this.add(key, value);
        }
      }
    }
  }

  /** 逐个调用 fn(item, index, length)；fn 返回 false 时停止 */
  each(fn: (item: T, index: number, length: number) => unknown, scope?: object): void {
    const items = [...this.items];
    for (let i = 0, len = items.length; i < len; i++) {
      if (fn.call(scope || items[i], items[i], i, len) === false) {
        break;
      }
    }
    this.itemsSubject.next(this.items);
  }

  /** 逐个调用 fn(key, item, index, length) */
  eachKey(fn: (key: CollectionKey, item: T, index: number, length: number) => unknown, scope?: object): void {
    for (let i = 0, len = this.keys.length; i < len; i++) {
      fn.call(scope || window, this.keys[i], this.items[i], i, len);
    }
    this.itemsSubject.next(this.items);
  }

  /** 返回第一个让 fn(item, key) 为真的元素，没有则 null */
  find(fn: (item: T, key: CollectionKey) => unknown, scope?: object): T | null {
    for (let i = 0, len = this.items.length; i < len; i++) {
      if (fn.call(scope || window, this.items[i], this.keys[i])) {
        return this.items[i];
      }
    }
    return null;
  }

  /** 在指定位置插入；只传 (index, item) 时用 getKey 取键 */
  insert(index: number, o: T): T;
  insert(index: number, key: CollectionKey, o: T): T;
  insert(index: number, keyOrItem: CollectionKey | T, item?: T): T {
    let key: CollectionKey;
    let o: T;
    if (arguments.length == 2) {
      o = keyOrItem as T;
      key = this.getKey(o);
    } else {
      key = keyOrItem as CollectionKey;
      o = item;
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

  /** 移除元素；不在集合里时返回 false */
  remove(o: T): T | false {
    return this.removeAt(this.indexOf(o));
  }

  /** 按下标移除；下标越界时返回 false */
  removeAt(index: number): T | false {
    if (index < this.length && index >= 0) {
      this.length--;
      const o = this.items[index];
      this.items.splice(index, 1);
      this.itemsSubject.next(this.items);
      const key = this.keys[index];
      if (typeof key != 'undefined') {
        delete this.map[key];
      }
      this.keys.splice(index, 1);
      return o;
    }
    return false;
  }

  /** 移除并返回最后一个元素 */
  pop(): T | false {
    return this.removeAt(this.length - 1);
  }

  /** 按键移除 */
  removeKey(key: CollectionKey): T | false {
    return this.removeAt(this.indexOfKey(key));
  }

  getCount(): number {
    return this.length;
  }

  indexOf(o: T): number {
    return this.items.indexOf(o);
  }

  indexOfKey(key: CollectionKey): number {
    return this.keys.indexOf(key);
  }

  /** 先按键找，找不到且 key 是数字时按下标取；函数元素在不允许时返回 null */
  get(key: CollectionKey): T | null {
    const mk = this.map[key];
    const item = mk !== undefined ? mk : typeof key == 'number' ? this.items[key] : undefined;
    return typeof item != 'function' || this.allowFunctions ? item : null;
  }

  itemAt(index: number): T {
    return this.items[index];
  }

  key(key: CollectionKey): T {
    return this.map[key];
  }

  contains(o: T): boolean {
    return this.indexOf(o) != -1;
  }

  containsKey(key: CollectionKey): boolean {
    return typeof this.map[key] != 'undefined';
  }

  clear(): void {
    this.length = 0;
    this.items = [];
    this.keys = [];
    this.map = {};
  }

  first(): T {
    return this.items[0];
  }

  last(): T {
    return this.items[this.length - 1];
  }

  _sort(property: 'key' | 'value', dir: string, fn?: (a: unknown, b: unknown) => number): void {
    const dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1;
    const keys = this.keys;
    const items = this.items;
    const compare = fn || ((a: unknown, b: unknown) => (a as number) - (b as number));
    const c: Array<{ key: CollectionKey; value: T; index: number }> = [];

    for (let i = 0, len = items.length; i < len; i++) {
      c[c.length] = { key: keys[i], value: items[i], index: i };
    }

    //sort the temporary array
    c.sort(function (a, b) {
      let v = compare(a[property], b[property]) * dsc;
      if (v === 0) {
        v = a.index < b.index ? -1 : 1;
      }
      return v;
    });

    for (let i = 0, len = c.length; i < len; i++) {
      items[i] = c[i].value;
      keys[i] = c[i].key;
    }
  }

  sort(dir: string, fn?: (a: T, b: T) => number): void {
    this._sort('value', dir, fn as (a: unknown, b: unknown) => number);
  }

  /** 按 {旧位置: 新位置} 重排 */
  reorder(mapping: { [oldIndex: number]: number }): void {
    const items = this.items;
    const length = items.length;
    const order: T[] = [];
    const remaining: T[] = [];

    //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
    for (const oldIndex in mapping) {
      order[mapping[oldIndex]] = items[oldIndex];
    }
    for (let index = 0; index < length; index++) {
      if (mapping[index] == undefined) {
        remaining.push(items[index]);
      }
    }
    for (let index = 0; index < length; index++) {
      if (order[index] == undefined) {
        order[index] = remaining.shift();
      }
    }
    this.clear();
    this.addAll(order);
  }

  keySort(dir: string, fn?: (a: CollectionKey, b: CollectionKey) => number): void {
    this._sort(
      'key',
      dir,
      (fn as (a: unknown, b: unknown) => number) ||
        function (a: unknown, b: unknown) {
          const v1 = String(a).toUpperCase(),
            v2 = String(b).toUpperCase();
          return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
        }
    );
  }

  /** 取 [start, end] 区间的元素（end 默认最后一个；start > end 时倒序） */
  getRange(start?: number, end?: number): T[] {
    const items = this.items;
    if (items.length < 1) {
      return [];
    }
    start = start || 0;
    end = Math.min(typeof end == 'undefined' ? this.length - 1 : end, this.length - 1);
    const r: T[] = [];
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        r[r.length] = items[i];
      }
    } else {
      for (let i = start; i >= end; i--) {
        r[r.length] = items[i];
      }
    }
    return r;
  }

  /** 按属性值过滤，返回新集合 */
  filter(property: string, value: string | RegExp, anyMatch: boolean, caseSensitive: boolean): MixedCollection<T> {
    if (DuiBase.isEmpty(value, false)) {
      return this.clone();
    }
    const matcher = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.filterBy(function (o: T) {
      return o && matcher.test(String((o as Record<string, unknown>)[property]));
    });
  }

  /** 按 fn(item, key) 过滤，返回新集合 */
  filterBy(fn: (item: T, key: CollectionKey) => unknown, scope?: object): MixedCollection<T> {
    const r = new MixedCollection<T>();
    r.getKey = this.getKey;
    const k = this.keys,
      it = this.items;
    for (let i = 0, len = it.length; i < len; i++) {
      if (fn.call(scope || this, it[i], k[i])) {
        r.add(k[i], it[i]);
      }
    }
    return r;
  }

  findIndex(property: string, value: string | RegExp, start: number, anyMatch: boolean, caseSensitive: boolean): number {
    if (DuiBase.isEmpty(value, false)) {
      return -1;
    }
    const matcher = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.findIndexBy(
      function (o: T) {
        return o && matcher.test(String((o as Record<string, unknown>)[property]));
      },
      null,
      start
    );
  }

  findIndexBy(fn: (item: T, key: CollectionKey) => unknown, scope: object, start: number): number {
    const k = this.keys,
      it = this.items;
    for (let i = start || 0, len = it.length; i < len; i++) {
      if (fn.call(scope || this, it[i], k[i])) {
        return i;
      }
    }
    return -1;
  }

  /** 字符串转成匹配用的正则；已经是正则则原样返回 */
  createValueMatcher(value: string | RegExp, anyMatch: boolean, caseSensitive: boolean, exactMatch?: boolean): RegExp {
    if (value instanceof RegExp) {
      return value;
    }
    const er = DuiBase.escapeRe;
    let pattern = String(value);
    if (anyMatch === true) {
      pattern = er(pattern);
    } else {
      pattern = '^' + er(pattern);
      if (exactMatch === true) {
        pattern += '$';
      }
    }
    return new RegExp(pattern, caseSensitive ? '' : 'i');
  }

  /** 浅拷贝成新集合 */
  clone(): MixedCollection<T> {
    const r = new MixedCollection<T>();
    const k = this.keys,
      it = this.items;
    for (let i = 0, len = it.length; i < len; i++) {
      r.add(k[i], it[i]);
    }
    r.getKey = this.getKey;
    return r;
  }
}
