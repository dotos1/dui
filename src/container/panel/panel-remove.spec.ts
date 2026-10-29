import { ChangeDetectorRef, ComponentRef, ViewContainerRef, ViewRef } from '@angular/core';
import { ComponentBase } from '@dotos/dui/core';
import { Container } from '../container.main';
import { AbstractPanel } from './abstract.panel';
import { AbstractPanel as LayoutAbstractPanel } from '../layout/component/abstract.panel';
import { LayoutComponent } from '../layout/component/layout.component';

/**
 * 复核 F3：259e4e5 让三处 remove() 由「无返回值」改成返回被移除的组件，
 * 符合父类 Container.remove(): ComponentBase 的约定。这里锁定这个行为。
 */
describe('面板 remove() 返回被移除的组件', () => {
  function setup(): { host: Container; child: ComponentBase; view: jasmine.SpyObj<ViewContainerRef> } {
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges', 'markForCheck', 'detach']);
    const host = new Container(null, null, cdr);
    const view = jasmine.createSpyObj<ViewContainerRef>('ViewContainerRef', ['insert', 'indexOf', 'remove']);
    view.indexOf.and.returnValue(0);
    host.viewContainer = view;
    host.autoDestroy = false;
    const child = new ComponentBase(cdr);
    child.id = 'c1';
    child.reference = { hostView: {} as ViewRef } as ComponentRef<ComponentBase>;
    host.add(child);
    return { host, child, view };
  }

  const cases: Array<[string, (c: ComponentBase | string) => ComponentBase]> = [
    ['panel/AbstractPanel', function (this: Container, c) { return AbstractPanel.prototype.remove.call(this, c); }],
    ['layout/AbstractPanel', function (this: Container, c) { return LayoutAbstractPanel.prototype.remove.call(this, c); }],
    ['LayoutComponent', function (this: Container, c) { return LayoutComponent.prototype.remove.call(this, c); }],
  ];

  for (const [name, remove] of cases) {
    it(name, () => {
      const { host, child, view } = setup();
      expect(remove.call(host, 'c1')).toBe(child);
      expect(view.remove).toHaveBeenCalledWith(0);
      expect(host.items.getCount()).toBe(0);
    });
  }
});
