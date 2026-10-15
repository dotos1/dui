/**
 * 极小事件总线。
 *
 * <p>自研,替代 EJ2 衍生的那份(121 行)。见 duix 的
 * `lib/PEEL-CLEANUP-PLAN.md` §P6。
 *
 * <p>三处按旧行为对齐、看着都像"应该修一下"但不能改的地方:
 *
 * <ol>
 *   <li><b>同一个函数重复 `on` 只登记一次。</b>去重键是函数引用本身。</li>
 *   <li><b>`notify` 一个没人登记的事件返回 `undefined`</b>,不抛也不返回空数组。</li>
 *   <li><b>`destroy()` 之后再 `notify` 会抛。</b>旧实现把内部表置成
 *       `undefined`,下一次 `notify` 在 `.slice()` 上炸。这不是好设计,
 *       但改成静默忽略会把"组件销毁后还有人发事件"这个真实缺陷藏起来 ——
 *       它现在是会响的。</li>
 * </ol>
 *
 * <p>与旧实现<b>有意不同</b>的一处:`destroy()` 之后的 `on` / `off` 静默返回
 * (b8c5e5c 复核)。旧实现在这里同样在 `hasOwnProperty` 上炸,但这两个调用
 * 多半来自拆卸顺序 —— 父组件先 destroy,子组件随后在自己的 ngOnDestroy 里
 * `off` —— 炸出来的 TypeError 会打断后面的清理,而它并不指向真实缺陷。
 * 销毁后 `notify` 仍然会抛,见上面第 3 条。
 */

export interface BoundOptions {
  handler?: Function;
  context?: Object;
  event?: string;
  id?: string;
}

export class Observer {
  private boundedEvents: { [key: string]: BoundOptions[] } | undefined = {};
  private context: Object;

  constructor(context?: Object) { this.context = context || this; }

  on(property: string, handler: Function, context?: Object, id?: string): void {
    if (!handler) { return; }
    const 表 = this.boundedEvents;
    if (!表) { return; }   // destroy 之后,见类注释
    const cntxt = context || this.context;
    if (Object.prototype.hasOwnProperty.call(表, property)) {
      if (!表[property].some((e) => e.handler === handler)) {
        表[property].push({ handler, context: cntxt, id });
      }
    } else {
      表[property] = [{ handler, context: cntxt, id }];
    }
  }

  /** `handler` 不给就摘掉该事件的全部登记。 */
  off(property: string, handler?: Function, id?: string): void {
    const 表 = this.boundedEvents;
    if (!表) { return; }   // destroy 之后,见类注释
    if (!Object.prototype.hasOwnProperty.call(表, property)) { return; }
    if (!handler && !id) { delete 表[property]; return; }
    表[property] = 表[property].filter(
      (e) => !(handler ? e.handler === handler : true) || !(id ? e.id === id : true),
    );
  }

  /**
   * 触发。
   *
   * <p><b>永远返回 `undefined`。</b>旧实现两条分支都没有 return 值,
   * 而 `Base.trigger()` 会把这个返回值再往外传 —— 也就是说
   * `trigger()` 的返回值一直是 `undefined`。看着像"忘了 return",
   * 但已经有调用方按"没有返回值"写了,补上会让 `if (obj.trigger(...))`
   * 这类写法悄悄改变分支。
   *
   * <p><b>`successHandler` 在事件没人登记时也会调</b>,而且 `this` 绑的是
   * <u>Observer 自己</u>,不是登记时给的 context。两条都是旧行为。
   *
   * <p>`errorHandler` 旧实现根本没用过,保留形参只为签名兼容。
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notify(property: string, argument?: Object, successHandler?: Function, errorHandler?: Function): void | Object {
    const 表 = this.boundedEvents!;   // destroy 之后是 undefined —— 见类注释第 3 条
    const 登记 = 表[property];
    if (!登记) {
      if (successHandler) { successHandler.call(this, argument); }
      return;
    }
    // 拷一份再遍历:回调里可能 off 掉自己。
    for (const e of 登记.slice()) {
      if (e.handler) { e.handler.call(e.context, argument); }
    }
    if (successHandler) { successHandler.call(this, argument); }
  }

  /** `notify` 的别名。同样不返回值。 */
  emit(property: string, argument?: Object, successHandler?: Function, errorHandler?: Function): void | Object {
    this.notify(property, argument, successHandler, errorHandler);
  }

  destroy(): void {
    this.boundedEvents = undefined;
    this.context = undefined as never;
  }
}
