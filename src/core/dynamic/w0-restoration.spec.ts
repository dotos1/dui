/**
 * @fileoverview Unit tests for W0 restored capabilities: DuiBase.registerComponentFactory (1-arg & 2-arg), DynamicComponent, and *mobxAutorun.
 * @zh W0 核心能力恢复单测：`DuiBase.registerComponentFactory` 单参/双参重载、`DynamicComponent` 同步动态模板编译与 `*mobxAutorun` 响应式刷新。
 */

import '@angular/compiler';
import { Component, Input, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { action, computed, makeObservable, observable } from 'mobx';
import { DuiBase } from '../../base/duibase';
import { MobxAngularModule } from '../mobx/mobx.module';
import { DynamicModule } from './dynamic.module';

@Component({
  selector: 'w0-reg-badge',
  standalone: false,
  template: `<span class="reg-badge">{{ title }}</span>`,
})
class RegisteredBadgeComponent {
  @Input() title = 'badge';
}

@Component({
  selector: 'w0-reg-chip, w0-reg-chip-alt',
  standalone: false,
  template: `<span class="reg-chip">{{ text }}</span>`,
})
class RegisteredChipComponent {
  @Input() text = 'chip';
}

@NgModule({
  declarations: [RegisteredBadgeComponent, RegisteredChipComponent],
  exports: [RegisteredBadgeComponent, RegisteredChipComponent],
})
class W0RegisteredWidgetsModule {}

class ReactiveCounterStore {
  @observable count = 1;

  constructor() {
    makeObservable(this);
  }

  @computed get doubled(): number {
    return this.count * 2;
  }

  @action increment(): void {
    this.count += 1;
  }
}

@Component({
  standalone: false,
  template: `
    <div class="mobx-view" *mobxAutorun>
      <span class="count-val">{{ store.count }}</span>
      <span class="doubled-val">{{ store.doubled }}</span>
    </div>
  `,
})
class MobxAutorunHostComponent {
  store = new ReactiveCounterStore();
}

@Component({
  standalone: false,
  template: `
    <dui-dynamic
      [tmpl]="tpl"
      [data]="ctx"
    ></dui-dynamic>
  `,
})
class DynamicHostComponent {
  tpl = `<div class="dyn-rendered">{{ data.greeting }} - {{ data.count }}</div>`;
  ctx = { greeting: 'Hello DUI 22', count: 42 };
}

describe('W0 Restored DuiBase.registerComponentFactory, DynamicComponent, and *mobxAutorun', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicModule, MobxAngularModule, W0RegisteredWidgetsModule],
      declarations: [MobxAutorunHostComponent, DynamicHostComponent],
    }).compileComponents();
  });

  it('supports both legacy 2-arg registerComponentFactory(resolver, components) and 1-arg registerComponentFactory(components)', () => {
    const legacyResolverPlaceholder = { name: 'legacy-cfr' };
    DuiBase.registerComponentFactory(legacyResolverPlaceholder, [RegisteredBadgeComponent]);
    DuiBase.registerComponentFactory([RegisteredChipComponent]);

    expect(DuiBase.hasComponentFactory('w0-reg-badge')).toBe(true);
    expect(DuiBase.getComponentType('w0-reg-badge')).toBe(RegisteredBadgeComponent);
    expect(DuiBase.hasComponentFactory('w0-reg-chip')).toBe(true);
    expect(DuiBase.hasComponentFactory('w0-reg-chip-alt')).toBe(true);
    expect(DuiBase.getComponentType('w0-reg-chip')).toBe(RegisteredChipComponent);
  });

  it('compiles and renders <dui-dynamic [tmpl] [data]> synchronously', () => {
    const fixture = TestBed.createComponent(DynamicHostComponent);
    fixture.detectChanges();

    const parentEl = (fixture.nativeElement as HTMLElement).parentElement ?? (fixture.nativeElement as HTMLElement);
    const dynEl = parentEl.querySelector('.dyn-rendered') as HTMLElement;
    expect(dynEl).toBeTruthy();
    expect(dynEl.textContent?.trim()).toBe('Hello DUI 22 - 42');
    fixture.destroy();
  });

  it('re-renders *mobxAutorun view automatically when MobX 6 @observable mutates under useDefineForClassFields: false', () => {
    const fixture = TestBed.createComponent(MobxAutorunHostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.querySelector('.count-val')?.textContent).toBe('1');
    expect(hostEl.querySelector('.doubled-val')?.textContent).toBe('2');

    fixture.componentInstance.store.increment();
    expect(hostEl.querySelector('.count-val')?.textContent).toBe('2');
    expect(hostEl.querySelector('.doubled-val')?.textContent).toBe('4');

    fixture.componentInstance.store.increment();
    expect(hostEl.querySelector('.count-val')?.textContent).toBe('3');
    expect(hostEl.querySelector('.doubled-val')?.textContent).toBe('6');

    fixture.destroy();
  });
});
