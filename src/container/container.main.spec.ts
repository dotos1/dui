import { ChangeDetectorRef, ComponentRef, ViewContainerRef, ViewRef } from '@angular/core';
import { ComponentBase } from '@dotos1/dui/core';
import { MixedCollection } from '@dotos1/dui/core/cache';
import { DuiToolbarComponent } from '@dotos1/dui/ui/toolbar';
import { Container } from './container.main';

function fakeDetectRef(): ChangeDetectorRef {
  return jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges', 'markForCheck', 'detach', 'reattach']);
}

function makeContainer(): Container {
  const c = new Container(null, null, fakeDetectRef());
  c.viewContainer = jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', ['insert']);
  return c;
}

function makeChild(id: string): ComponentBase {
  const child = new ComponentBase(fakeDetectRef());
  child.id = id;
  child.reference = { hostView: {} as ViewRef } as ComponentRef<ComponentBase>;
  return child;
}

describe('Container.add / insert', () => {
  /** 复核 F11：xtype 写错或缺失时原来 add 静默返回 null，insert 直接抛 TypeError */
  it('add 拿不到组件时告警并返回 null', () => {
    const warn = spyOn(console, 'warn');
    const c = makeContainer();
    expect(c.add({ title: '没有 xtype' })).toBeNull();
    expect(warn).toHaveBeenCalled();
    expect(c.items.getCount()).toBe(0);
  });

  it('insert 拿不到组件时告警并返回 null，不抛错', () => {
    const warn = spyOn(console, 'warn');
    const c = makeContainer();
    expect(() => c.insert(0, { title: '没有 xtype' })).not.toThrow();
    expect(c.insert(0, { title: '没有 xtype' })).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  /** 原来直接添加已创建的实例时没有返回值，Toolbar.addItem / addSeparator 等声明返回组件、实际拿到 undefined */
  it('add 已创建的实例时返回该实例', () => {
    const c = makeContainer();
    const child = makeChild('a');
    expect(c.add(child)).toBe(child);
    expect(c.items.get('a')).toBe(child);
  });

  it('批量 add 返回各子项', () => {
    const c = makeContainer();
    const a = makeChild('a');
    const b = makeChild('b');
    expect(c.add([a, b])).toEqual([a, b]);
    expect(c.items.getCount()).toBe(2);
  });
});

describe('DuiToolbarComponent 禁用 / 启用子项', () => {
  /** 原来调用 item.disable()——disable 是 getter，禁用状态下会抛 "not a function"；enable() 根本不存在 */
  it('onDisable / onEnable 通过 disable 属性切换子项', () => {
    const child = makeChild('btn');
    const items = new MixedCollection<ComponentBase>();
    items.add(child);
    const host = { items } as DuiToolbarComponent;
    DuiToolbarComponent.prototype.onDisable.call(host);
    expect(child.disabled).toBe(true);
    DuiToolbarComponent.prototype.onEnable.call(host);
    expect(child.disabled).toBe(false);
  });
});
