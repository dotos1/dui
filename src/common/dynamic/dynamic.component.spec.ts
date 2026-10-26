/**
 * @fileoverview Module `src/common/dynamic/dynamic.component.spec.ts` providing dynamic component spec definitions and implementation.
 * @zh 模块文件 `src/common/dynamic/dynamic.component.spec.ts`，提供动态组件spec相关的定义与实现。
 */

import { SimpleChange } from '@angular/core';
import { DynamicExtensionComponent } from './dynamic.component';

/**
 * b8c5e5c 复核:加载完成后 config 再变,不能重新 updateInstance()(→ instance.init())。
 * duix/aios 的 xyflow node-wrapper 的 config getter 每次返回新对象,
 * 响应它就等于每一轮变更检测都把节点重新 init 一遍。
 */
describe('DynamicExtensionComponent.ngOnChanges(b8c5e5c 复核)', () => {
  function loaded(): any {
    const self: any = Object.create(DynamicExtensionComponent.prototype);
    self.loaded = true;
    self.config = { xtype: 'x', id: 'n1' };
    self.updateInstance = jasmine.createSpy('updateInstance');
    self.proxy = jasmine.createSpy('proxy');
    return self;
  }

  it('config 换成新对象时不重新 init', () => {
    const self = loaded();
    const prev = self.config;
    self.ngOnChanges({ config: new SimpleChange(prev, { xtype: 'x', id: 'n1' }, false) });
    expect(self.updateInstance).not.toHaveBeenCalled();
  });

  it('config 变成空值时直接返回、不抛', () => {
    const self = loaded();
    expect(() => self.ngOnChanges({ config: new SimpleChange(self.config, null, false) })).not.toThrow();
    expect(self.updateInstance).not.toHaveBeenCalled();
  });
});
