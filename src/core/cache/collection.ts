import { BaseObject } from "./base-obejct";


export class Collection extends BaseObject {

  private array_=[];

  private unique_;

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

  clear() {
    while (this.getLength() > 0) {
      this.pop();
    }
  }

  extend(arr) {
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      this.push(arr[i]);
    }
    return this;
  }

  forEach(f) {
    const array = this.array_;
    for (let i = 0, ii = array.length; i < ii; ++i) {
      f(array[i], i, array);
    }
  }

  getArray() {
    return this.array_;
  }

  item(index) {
    return this.array_[index];
  }

  getLength() {
    return this.get("length");
  }

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
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  push(elem) {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    const n = this.getLength();
    this.insertAt(n, elem);
    return this.getLength();
  }
  remove(elem) {
    const arr = this.array_;
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      if (arr[i] === elem) {
        return this.removeAt(i);
      }
    }
    return undefined;
  }
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

  updateLength_() {
    this.set('length', this.array_.length);
  }

  assertUnique_(elem, except?) {
    for (let i = 0, ii = this.array_.length; i < ii; ++i) {
      if (this.array_[i] === elem && i !== except) {
        throw new Error();
      }
    }
  }
}
