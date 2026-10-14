
import { DuiBase } from '@dotos/dui/base';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from 'events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class MixedCollection<T>  extends EventEmitter{
  items: any = [];
  map: any = {};
  keys: any = [];
  length: any = 0;
  itemsSubject:BehaviorSubject<Array<any>>=new BehaviorSubject([]);

  public allowFunctions = false;

  constructor(allowFunctions?, keyFn?) {
    super();
    this.allowFunctions = allowFunctions === true;
    if (keyFn) {
      this.getKey = keyFn;
    }
  }


  add(key: any, o?: Object): Object {
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

  getKey(o): any {
    return o.id;
  }

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

  addAll(objs: Object | any[]) {
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

  each(fn: Function, scope?: any) {
    let items = [].concat(this.items);
    for (let i = 0, len = items.length; i < len; i++) {
      if (fn.call(scope || items[i], items[i], i, len) === false) {
        break;
      }
    }
    this.itemsSubject.next(this.items);
  }

  eachKey(fn: Function, scope: Object) {
    for (let i = 0, len = this.keys.length; i < len; i++) {
      fn.call(scope || window, this.keys[i], this.items[i], i, len);
    }
    this.itemsSubject.next(this.items);
  }

  find(fn: Function, scope: Object): Object {
    for (let i = 0, len = this.items.length; i < len; i++) {
      if (fn.call(scope || window, this.items[i], this.keys[i])) {
        return this.items[i];
      }
    }
    return null;
  }

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

  remove(o: Object): Object {
    return this.removeAt(this.indexOf(o));
  }

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

  pop() {
    return this.removeAt(this.length - 1);
  }

  removeKey(key: string): Object {
    return this.removeAt(this.indexOfKey(key));
  }

  getCount(): number {
    return this.length;
  }

  indexOf(o: Object): number {
    return this.items.indexOf(o);
  }

  indexOfKey(key: string): number {
    return this.keys.indexOf(key);
  }

  get(key: number | string): Object {
    let mk = this.map[key], item = mk !== undefined ? mk : typeof key == 'number' ? this.items[key] : undefined;
    return typeof item != 'function' || this.allowFunctions ? item : null;
  }

  itemAt(index: number): Object {
    return this.items[index];
  }

  key(key: number | string): Object {
    return this.map[key];
  }

  contains(o: Object): boolean {
    return this.indexOf(o) != -1;
  }

  containsKey(key: string): boolean {
    return typeof this.map[key] != 'undefined';
  }

  clear() {
    this.length = 0;
    this.items = [];
    this.keys = [];
    this.map = {};
  }

  first(): Object {
    return this.items[0];
  }

  last(): Object {
    return this.items[this.length - 1];
  }

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

  sort(dir, fn: Function) {
    this._sort('value', dir, fn);
  }

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

  keySort(dir, fn: Function) {
    this._sort('key', dir, fn ||
      function (a, b) {
        let v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
        return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
      });
  }

  getRange(start, end): Array<any> {
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

  filter(property: string, value: any, anyMatch: boolean, caseSensitive: boolean): MixedCollection<any> {
    if (DuiBase.isEmpty(value, false)) {
      return this.clone();
    }
    value = this.createValueMatcher(value, anyMatch, caseSensitive);
    return this.filterBy(
      function (o) {
        return o && value.test(o[property]);
      });
  }

  filterBy(fn: Function, scope?: any): MixedCollection<any> {
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

  findIndexBy(fn: Function, scope: Object, start: number): number {
    let k = this.keys, it = this.items;
    for (let i = start || 0, len = it.length; i < len; i++) {
      if (fn.call(scope || this, it[i], k[i])) {
        return i;
      }
    }
    return -1;
  }

  createValueMatcher(value: any, anyMatch: boolean, caseSensitive: boolean, exactMatch?: boolean) {
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

  clone(): MixedCollection<any> {
    let r = new MixedCollection();
    let k = this.keys, it = this.items;
    for (let i = 0, len = it.length; i < len; i++) {
      r.add(k[i], it[i]);
    }
    r.getKey = this.getKey;
    return r;
  }
}
