/**
 * @fileoverview Unit tests verifying DynamicComponent under simulated `ngJitMode=false` production builds (`*ngIf`, `*ngFor`, pipes, `extraImports`, and `ngOnChanges`).
 * @zh 验证 `DynamicComponent` 在模拟 `ngJitMode=false` 生产构建下 `*ngIf`、`*ngFor`、内置管道、`extraImports` 与 `ngOnChanges` 动态更新的单测。
 */

import '@angular/compiler';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Input,
  NgModule,
  Pipe,
  PipeTransform,
  Type,
  ɵdepsTracker,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DynamicModule } from './dynamic.module';

@Component({
  selector: 'spec-standalone-pill',
  standalone: true,
  template: `<span class="standalone-pill">[SA:{{ label }}]</span>`,
})
class SpecStandalonePillComponent {
  @Input() label: string = '';
}

@Directive({
  selector: '[specBadgeAttr]',
  standalone: true,
})
class SpecBadgeAttrDirective {
  @Input() set specBadgeAttr(val: string) {
    this.el.nativeElement.setAttribute('data-spec-badge', val);
  }

  constructor(private readonly el: ElementRef<HTMLElement>) {}
}

@Pipe({
  name: 'specBracket',
  standalone: true,
})
class SpecBracketPipe implements PipeTransform {
  transform(value: unknown): string {
    return `<${String(value ?? '')}>`;
  }
}

@Component({
  selector: 'spec-module-btn',
  standalone: false,
  template: `<button type="button" class="module-btn-inner">{{ caption }}</button>`,
})
class SpecModuleBtnComponent {
  @Input() caption: string = '';
}

@NgModule({
  declarations: [SpecModuleBtnComponent],
  exports: [SpecModuleBtnComponent],
})
class SpecModuleBtnModule {}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="spec-host">
      <dui-dynamic
        [tmpl]="tmpl"
        [data]="data"
        [extraImports]="extraImports"
      ></dui-dynamic>
    </div>
  `,
})
class DynamicProdSpecHostComponent {
  tmpl: string = `
    <div class="prod-dyn-root" [ngClass]="{ 'active-card': data.show }" [ngStyle]="{ 'font-weight': '600' }">
      <h4 class="prod-title">{{ data.title | uppercase | specBracket }}</h4>
      <span class="prod-if-true" *ngIf="data.show">VISIBLE_BRANCH</span>
      <span class="prod-if-false" *ngIf="!data.show">HIDDEN_BRANCH</span>
      <ul class="prod-list">
        <li class="prod-item" *ngFor="let item of data.items; index as i">{{ i }}:{{ item }}</li>
      </ul>
      <div [ngSwitch]="data.mode" class="prod-switch">
        <span *ngSwitchCase="'alpha'">MODE_ALPHA</span>
        <span *ngSwitchDefault>MODE_DEFAULT</span>
      </div>
      <div class="prod-kv">
        <span class="kv-pair" *ngFor="let kv of data.meta | keyvalue">{{ kv.key }}={{ kv.value }}</span>
      </div>
      <spec-standalone-pill [specBadgeAttr]="data.pillText" [label]="data.pillText"></spec-standalone-pill>
      <spec-module-btn [caption]="data.btnText"></spec-module-btn>
    </div>
  `;

  data: Record<string, unknown> = {
    title: 'board card',
    show: true,
    items: ['cpu', 'mem', 'disk'],
    mode: 'alpha',
    meta: { env: 'prod' },
    pillText: 'v8',
    btnText: 'Run Action',
  };

  extraImports: ReadonlyArray<Type<unknown>> = [
    SpecStandalonePillComponent,
    SpecBadgeAttrDirective,
    SpecBracketPipe,
    SpecModuleBtnModule,
  ];
}

describe('DynamicComponent production-mode (`ngJitMode=false`) standalone directives & extraImports', () => {
  let savedExportsDescriptor: PropertyDescriptor | undefined;
  let savedImportsDescriptor: PropertyDescriptor | undefined;

  beforeEach(async () => {
    const modDef: unknown = Reflect.get(CommonModule, 'ɵmod');
    if (typeof modDef === 'object' && modDef !== null) {
      savedExportsDescriptor = Object.getOwnPropertyDescriptor(modDef, 'exports');
      savedImportsDescriptor = Object.getOwnPropertyDescriptor(modDef, 'imports');
      // 模拟生产构建（ngJitMode=false）摇掉 ɵɵsetNgModuleScope 后 CommonModule.ɵmod 导出为空的真实形态
      Object.defineProperty(modDef, 'exports', { value: [], configurable: true, writable: true });
      Object.defineProperty(modDef, 'imports', { value: [], configurable: true, writable: true });
      ɵdepsTracker.clearScopeCacheFor(CommonModule);
    }

    await TestBed.configureTestingModule({
      imports: [DynamicModule],
      declarations: [DynamicProdSpecHostComponent],
    }).compileComponents();
  });

  afterEach(() => {
    const modDef: unknown = Reflect.get(CommonModule, 'ɵmod');
    if (typeof modDef === 'object' && modDef !== null) {
      if (savedExportsDescriptor) {
        Object.defineProperty(modDef, 'exports', savedExportsDescriptor);
      }
      if (savedImportsDescriptor) {
        Object.defineProperty(modDef, 'imports', savedImportsDescriptor);
      }
      ɵdepsTracker.clearScopeCacheFor(CommonModule);
    }
  });

  it('renders *ngIf, *ngFor, ngSwitch, ngClass/ngStyle, common pipes, and extraImports when CommonModule scope is stripped', () => {
    const fixture = TestBed.createComponent(DynamicProdSpecHostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement as HTMLElement;
    const rootEl = hostEl.querySelector('.prod-dyn-root') as HTMLElement;
    expect(rootEl).not.toBeNull();
    expect(rootEl.classList.contains('active-card')).toBe(true);
    expect(hostEl.querySelector('.prod-title')?.textContent?.trim()).toBe('<BOARD CARD>');
    expect(hostEl.querySelector('.prod-if-true')?.textContent?.trim()).toBe('VISIBLE_BRANCH');
    expect(hostEl.querySelector('.prod-if-false')).toBeNull();

    const items = Array.from(hostEl.querySelectorAll('.prod-item')).map((el) => el.textContent?.trim());
    expect(items).toEqual(['0:cpu', '1:mem', '2:disk']);
    expect(hostEl.querySelector('.prod-switch')?.textContent?.trim()).toBe('MODE_ALPHA');
    expect(hostEl.querySelector('.kv-pair')?.textContent?.trim()).toBe('env=prod');

    const pillHost = hostEl.querySelector('spec-standalone-pill') as HTMLElement;
    expect(pillHost.getAttribute('data-spec-badge')).toBe('v8');
    expect(hostEl.querySelector('.standalone-pill')?.textContent?.trim()).toBe('[SA:v8]');
    expect(hostEl.querySelector('.module-btn-inner')?.textContent?.trim()).toBe('Run Action');

    fixture.destroy();
  });

  it('reactively updates [data] and recompiles on [tmpl] / [extraImports] changes via ngOnChanges', () => {
    const fixture = TestBed.createComponent(DynamicProdSpecHostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.querySelector('.prod-if-true')).not.toBeNull();

    // 仅更新 data：不重编译模板即可切换 *ngIf 分支与列表内容
    fixture.componentInstance.data = {
      ...fixture.componentInstance.data,
      show: false,
      items: ['net'],
      mode: 'other',
    };
    fixture.detectChanges();

    expect(hostEl.querySelector('.prod-if-true')).toBeNull();
    expect(hostEl.querySelector('.prod-if-false')?.textContent?.trim()).toBe('HIDDEN_BRANCH');
    const updatedItems = Array.from(hostEl.querySelectorAll('.prod-item')).map((el) => el.textContent?.trim());
    expect(updatedItems).toEqual(['0:net']);
    expect(hostEl.querySelector('.prod-switch')?.textContent?.trim()).toBe('MODE_DEFAULT');

    // 更新 tmpl：触发重编译挂载新模板
    fixture.componentInstance.tmpl = `<div class="recompiled-tpl">{{ data.items | slice:0:1 | json }}</div>`;
    fixture.detectChanges();

    expect(hostEl.querySelector('.prod-dyn-root')).toBeNull();
    expect(hostEl.querySelector('.recompiled-tpl')?.textContent?.trim()).toContain('net');

    fixture.destroy();
  });
});
