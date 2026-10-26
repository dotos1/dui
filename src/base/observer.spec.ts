/**
 * @fileoverview Module `src/base/observer.spec.ts` providing observer spec definitions and implementation.
 * @zh 模块文件 `src/base/observer.spec.ts`，提供观察者spec相关的定义与实现。
 */

import { Observer } from './observer';

/** b8c5e5c 复核:destroy 之后 on/off 静默返回(拆卸顺序里很常见),notify 仍然会抛。 */
describe('Observer destroy 之后(b8c5e5c 复核)', () => {
  it('on / off 不抛', () => {
    const ob = new Observer();
    const fn = () => {};
    ob.on('e', fn);
    ob.destroy();
    expect(() => ob.off('e', fn)).not.toThrow();
    expect(() => ob.on('e', fn)).not.toThrow();
  });
  it('notify 仍然抛(把「销毁后还在发事件」暴露出来)', () => {
    const ob = new Observer();
    ob.destroy();
    expect(() => ob.notify('e', {})).toThrow();
  });
});
