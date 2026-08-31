/**
 * 组件基类。
 *
 * <p>自研,替代 LEGACY 衍生的 `Base`(254 行)。见 duix 的
 * `lib/PEEL-CLEANUP-PLAN.md` §P6。
 *
 * <p><b>剩下的只有事件总线。</b>旧 `Base` 有两套东西:
 *
 * <ul>
 *   <li><b>属性系统</b> —— `properties` / `changedProperties` / `oldProperties` /
 *       `bulkChanges` / `isProtectedOnChange` / `dataBind()` / `serverDataBind()` /
 *       `clearChanges()`,配合 `@Property` / `@NotifyChanges` 使用。
 *       <u>dui 的组件一个都没用过这套</u>(LEGACY 归零门扫过:`@Property` 在
 *       dui 里零命中),它一直是空转的。整块删除。</li>
 *   <li><b>事件总线</b> —— `on` / `off` / `trigger` / `addEventListener` /
 *       `removeEventListener`。这个是活的:`ComponentBase` 全靠它,
 *       `trigger` 在 dui 与下游有近百处调用。保留。</li>
 * </ul>
 *
 * <p>还删掉了 `addInstance()` —— 它往宿主元素上刷 `e-lib` 与
 * `e-<模块名小写>` 两个类名(LEGACY 的 CSS 命名空间),并把实例挂到
 * `element.dui_instances` 上。两者全库零读取者(逐个 grep 过),
 * 随之 `getModuleName()` 也不再是抽象成员 —— 子类自己留着无妨。
 *
 * <p><b>`trigger()` 永远返回 `undefined`</b>,见 `Observer.notify` 的说明。
 */

import { Observer } from './observer';
import { isUndefined, extend } from './util';

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
   * 发事件。**只走总线**。
   *
   * <p><b>这里曾经还会调「同名的实例成员」</b> —— `trigger('change', e)` 时若
   * `this.change` 是个函数就一并调用,注释写的理由是"这条是旧行为,配置式组件
   * 靠它支持 `{ change: fn }` 这种写法"。<u>那条注释是错的,旧实现从来没执行过
   * 这段。</u>旧代码是:
   *
   * <pre>
   *   const isColEName = new RegExp(']');      // ← 注意匹配的是右方括号
   *   …
   *   if (isColEName.test(eventName)) { …调同名成员… }
   * </pre>
   *
   * <p>那个正则是给 `columns[0].field` 这类<b>属性路径</b>准备的(LEGACY 的属性系统
   * 遗留),而事件名里不可能出现 `]` —— 所以这个分支对任何一个真实事件名都是
   * <b>死代码</b>。自研版把守卫丢了、把死代码"恢复"成了活代码,后果是:
   *
   * <ol>
   *   <li><b>无限递归。</b>下游把事件转发方法<u>按事件名命名</u>是常规写法,
   *       比如 duix 的树表卡片有 50 个
   *       `headerCellInfo(e) { this.trigger("headerCellInfo", e); }` ——
   *       `trigger` 调同名成员、同名成员再 `trigger`,一进去就
   *       `Maximum call stack size exceeded`,整页白屏。实测能力页 card 一载入就炸。</li>
   *   <li><b>回调跑两遍。</b>调用方自己也会派发同名成员(duix 平表卡片的
   *       `fire()` 就是),于是 config 里写的 `actionBegin` 之类被调两次。
   *       字典管理那份配置在 `actionBegin` 里 `this.max_index_id++`,跑两遍就跳号。</li>
   *   <li><b>`ComponentBase` 自己也中招。</b>`ngOnDestroy()` 先
   *       `trigger('onDestroy', this)` 再 `this.onDestroy()` —— 同名成员那条路
   *       让 `onDestroy()` 执行了两次。</li>
   * </ol>
   *
   * <p>所以整段删掉,回到旧实现的<u>实际</u>行为:只通知总线。`successHandler`
   * 不受影响 —— `Observer.notify()` 本来就负责调它(两条分支都调),
   * 旧实现在这里的那次调用属于"名字里带 `]` 时多调一次",不是常规路径。
   *
   * <p>需要"配置里写个同名函数就当回调"这种形状的,由调用方自己派发
   * (duix 的 `fire()` 已经这么做了),不要放回总线里 —— 放回来就分不清
   * "转发方法"和"回调",递归会再来一次。
   */
  trigger(eventName: string, eventProp?: Object, successHandler?: Function, errorHandler?: Function): void | object {
    if (this.isDestroyed === true) { return; }
    return this.modelObserver.notify(eventName, eventProp, successHandler, errorHandler) as object;
  }

  destroy(): void {
    this.modelObserver.destroy();
    this.isDestroyed = true;
  }
}
