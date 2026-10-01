import { Observer } from '@dotos/dui/base';

export class BaseObject extends Observer {

  private values_=null;

  constructor(values?) {
    super();
    if (values !== undefined) {
      this.setProperties(values);
    }
  }

  get(key) {
    let value;
    if (this.values_ && this.values_.hasOwnProperty(key)) {
      value = this.values_[key];
    }
    return value;
  }


  getKeys() {
    return (this.values_ && Object.keys(this.values_)) || [];
  }


  getProperties() {
    return (this.values_ && Object.assign({}, this.values_)) || {};
  }


  hasProperties() {
    return !!this.values_;
  }



  addChangeListener(key, listener) {
    this.emit(`change:${key}`, listener);
  }

  removeChangeListener(key, listener) {
    this.off(`change:${key}`, listener);
  }

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


  setProperties(values, silent?) {
    for (const key in values) {
      this.set(key, values[key], silent);
    }
  }

  applyProperties(source) {
    if (!source.values_) {
      return;
    }
    Object.assign(this.values_ || (this.values_ = {}), source.values_);
  }

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
