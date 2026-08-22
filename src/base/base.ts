/**
 * 组件基类。
 *
 * <p>自研,替代 EJ2 衍生的 `Base`(254 行)。见 duix 的
 * `lib/PEEL-CLEANUP-PLAN.md` §P6。
 *
 * <p><b>剩下的只有事件总线。</b>旧 `Base` 有两套东西:
 *
 * <ul>
 *   <li><b>属性系统</b> —— `properties` / `changedProperties` / `oldProperties` /
 *       `bulkChanges` / `isProtectedOnChange` / `dataBind()` / `serverDataBind()` /
 *       `clearChanges()`,配合 `@Property` / `@NotifyPropertyChanges` 使用。
 *       <u>dui 的组件一个都没用过这套</u>(EJ2 归零门扫过:`@Property` 在
 *       dui 里零命中),它一直是空转的。整块删除。</li>
 *   <li><b>事件总线</b> —— `on` / `off` / `trigger` / `addEventListener` /
 *       `removeEventListener`。这个是活的:`ComponentBase` 全靠它,
 *       `trigger` 在 dui 与下游有近百处调用。保留。</li>
 * </ul>
 *
 * <p>还删掉了 `addInstance()` —— 它往宿主元素上刷 `e-lib` 与
 * `e-<模块名小写>` 两个类名(EJ2 的 CSS 命名空间),并把实例挂到
 * `element.dui_instances` 上。两者全库零读取者(逐个 grep 过),
 * 随之 `getModuleName()` 也不再是抽象成员 —— 子类自己留着无妨。
 *
 * <p><b>`trigger()` 永远返回 `undefined`</b>,见 `Observer.notify` 的说明。
 */

import { Observer } from './observer';
import { isUndefined, isNullOrUndefined, extend } from './util';

/** 默认区域。旧实现放在这里,`@dotos/dui/translator` 现在有自己的一份。 */
export const defaultCulture = 'en-US';

export interface AngularEventEmitter {
  subscribe?: (generatorOrNext?: unknown, error?: unknown, complete?: unknown) => unknown;
}

/** 事件回调的类型。Angular 的 `EventEmitter` 也满足它。 */
export type EmitType<T> = AngularEventEmitter & ((arg?: T, ...rest: unknown[]) => void);

export interface BaseEventArgs {
  /** 事件名。 */
  name?: string;
}

export class Base<ElementType extends HTMLElement> {
  element!: ElementType;
  isDestroyed = false;

  protected modelObserver: Observer;

  constructor(options?: Object, element?: ElementType | string) {
    this.modelObserver = new Observer(this);

    if (!isUndefined(element)) {
      this.element = (typeof element === 'string'
        ? document.querySelector(element)
        : element) as ElementType;
    }
    if (!isUndefined(options)) {
      this.setProperties(options as Record<string, unknown>, true);
    }
    this.isDestroyed = false;
  }

  /**
   * 批量写属性。
   *
   * <p>旧实现在这里还会记 `changedProperties` 并调 `dataBind()` 触发
   * `onPropertyChanged` —— 那是属性系统的一部分,已随之删除。
   * 现在它就是一次浅合并,`muteOnChange` 形参保留只为不改调用方
   * (28 处调用里没有一处真正依赖"不静默"那条路的副作用:
   *  `dataBind()` 在旧实现里也只是把变更表交给 `onPropertyChanged`,
   *  而 dui 侧的实现体是空的)。
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setProperties(prop: Record<string, unknown>, muteOnChange?: boolean): void {
    extend(this as unknown as Record<string, unknown>, prop);
  }

  on(eventName: string, handler: Function, scope?: Object): void {
    this.modelObserver.on(eventName, handler, scope);
  }

  addEventListener(eventName: string, handler: Function): void {
    this.modelObserver.on(eventName, handler);
  }

  off(eventName: string, handler?: Function): void {
    this.modelObserver.off(eventName, handler);
  }

  removeEventListener(eventName: string, handler: Function): void {
    this.modelObserver.off(eventName, handler);
  }

  /**
   * 发事件。
   *
   * <p>除了走总线,还会看**同名的实例成员**:`trigger('change', e)` 时若
   * `this.change` 是个函数就一并调用。这条是旧行为,配置式组件靠它
   * 支持 `{ change: fn }` 这种写法。
   */
  trigger(eventName: string, eventProp?: Object, successHandler?: Function, errorHandler?: Function): void | object {
    if (this.isDestroyed === true) { return; }
    const data = this.modelObserver.notify(eventName, eventProp, successHandler, errorHandler) as object;

    const 同名 = (this as unknown as Record<string, unknown>)[eventName];
    if (typeof 同名 === 'function') {
      (同名 as Function).call(this, eventProp);
      if (successHandler) { successHandler.call(this, eventProp); }
    } else if (successHandler && !isNullOrUndefined(同名)) {
      successHandler.call(this, eventProp);
    }
    return data;
  }

  destroy(): void {
    this.modelObserver.destroy();
    this.isDestroyed = true;
  }
}
