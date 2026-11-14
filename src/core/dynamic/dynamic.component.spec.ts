/**
 * @fileoverview Unit tests for `@dotos/dui/core/dynamic` (`DynamicComponent` M3-7 AOT Schema, Safe Micro-Template & Lazy JIT).
 * @zh `@dotos/dui/core/dynamic`（`<dui-dynamic>` AOT 卡片 Schema、安全微模板无编译器渲染与复杂 Angular 模板按需异步 JIT）单元测试。
 */

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DuiDynamicCardSchema,
  DynamicComponent,
  DynamicModule,
  isSafeMicroTemplate,
  readDynamicSafePath,
} from './public-api';

describe('DynamicComponent (M3-7: AOT Schema + Safe Micro-Template + On-Demand Async JIT)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicModule],
    }).compileComponents();
  });

  it('renders DuiDynamicCardSchema purely in AOT without loading @angular/compiler', async () => {
    const fixture: ComponentFixture<DynamicComponent> = TestBed.createComponent(DynamicComponent);
    const comp = fixture.componentInstance;
    const jitSpy = spyOn(comp, 'ensureJitCompilerLoaded').and.callThrough();

    const cardSchema: DuiDynamicCardSchema = {
      type: 'dui-card',
      title: '工单 {{ data.code }}',
      subtitleField: 'department',
      statusField: 'stateLabel',
      statusTone: 'success',
      fields: [
        { key: 'assignee.name', label: '负责人' },
        { key: 'priority', label: '优先级', value: 'P{{ data.priority }}' },
      ],
    };

    comp.schema = cardSchema;
    comp.data = {
      code: 'WO-2026-09',
      department: '智能制造部',
      stateLabel: '已完成',
      priority: 1,
      assignee: { name: '张工' },
    };

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(comp.renderMode).toBe('schema');
    expect(jitSpy).not.toHaveBeenCalled();

    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.querySelector('.dui-dynamic-card__title')?.textContent).toBe('工单 WO-2026-09');
    expect(hostEl.querySelector('.dui-dynamic-card__subtitle')?.textContent).toBe('智能制造部');
    const badge = hostEl.querySelector('.dui-dynamic-card__badge');
    expect(badge?.textContent).toBe('已完成');
    expect(badge?.getAttribute('data-tone')).toBe('success');

    const values = Array.from<Element>(
      hostEl.querySelectorAll('.dui-dynamic-card__value'),
    ).map((el) => el.textContent?.trim());
    expect(values).toEqual(['张工', 'P1']);
  });

  it('auto-detects JSON {"type":"dui-card", ...} passed via legacy [tmpl] input in AOT mode', async () => {
    const fixture = TestBed.createComponent(DynamicComponent);
    const comp = fixture.componentInstance;
    const jitSpy = spyOn(comp, 'ensureJitCompilerLoaded').and.callThrough();

    comp.tmpl = JSON.stringify({
      type: 'dui-card',
      titleField: 'title',
      status: '进行中',
      statusTone: 'primary',
      fields: [{ key: 'owner', label: '责任人' }],
    });
    comp.data = { title: '产线巡检看板', owner: '李工' };

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(comp.renderMode).toBe('schema');
    expect(jitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.dui-dynamic-card__title')?.textContent).toBe(
      '产线巡检看板',
    );
  });

  it('renders standard HTML kanban micro-templates in AOT without loading @angular/compiler and neutralizes XSS', async () => {
    const fixture = TestBed.createComponent(DynamicComponent);
    const comp = fixture.componentInstance;
    const jitSpy = spyOn(comp, 'ensureJitCompilerLoaded').and.callThrough();

    const kanbanTemplate = `
      <div class="kanban-card" data-code="{{ data.code }}">
        <h4>{{ data.title }}</h4>
        <p class="owner">{{ owner.name }}</p>
      </div>
    `;
    expect(isSafeMicroTemplate(kanbanTemplate)).toBe(true);

    comp.tmpl = kanbanTemplate;
    comp.data = {
      code: 'KB-88',
      title: '<img src=x onerror=alert(1)>设备保养',
      owner: { name: '王工' },
    };

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(comp.renderMode).toBe('micro-template');
    expect(jitSpy).not.toHaveBeenCalled();

    const cardEl = fixture.nativeElement.querySelector('.kanban-card') as HTMLElement | null;
    expect(cardEl).not.toBeNull();
    expect(cardEl?.getAttribute('data-code')).toBe('KB-88');
    // Interpolated HTML characters must remain literal text, never parsed into live <img> elements
    expect(cardEl?.querySelector('img')).toBeNull();
    expect(cardEl?.querySelector('h4')?.textContent).toBe('<img src=x onerror=alert(1)>设备保养');
    expect(cardEl?.querySelector('.owner')?.textContent).toBe('王工');

    // Re-rendering on data change updates micro-template DOM cleanly
    const prevData = comp.data;
    comp.data = { code: 'KB-99', title: '二次点检', owner: { name: '赵工' } };
    comp.ngOnChanges({ data: new SimpleChange(prevData, comp.data, false) });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h4')?.textContent).toBe('二次点检');
    expect(jitSpy).not.toHaveBeenCalled();
  });

  it('lazily loads @angular/compiler on demand when complex Angular syntax (*ngIf / *ngFor / pipes) is detected', async () => {
    const complexTemplate = `
      <div class="jit-box" *ngIf="data?.visible">
        <span class="jit-item" *ngFor="let tag of data.tags">{{ tag }}</span>
      </div>
    `;
    expect(isSafeMicroTemplate(complexTemplate)).toBe(false);

    const fixture = TestBed.createComponent(DynamicComponent);
    const comp = fixture.componentInstance;
    const jitSpy = spyOn(comp, 'ensureJitCompilerLoaded').and.callThrough();

    comp.tmpl = complexTemplate;
    comp.data = { visible: true, tags: ['M3', 'LazyJIT'] };

    fixture.detectChanges();
    await fixture.whenStable();
    // Flush async import('@angular/compiler') + createComponent microtasks
    await new Promise<void>((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();

    expect(comp.renderMode).toBe('jit');
    expect(jitSpy).toHaveBeenCalledTimes(1);

    const items = Array.from<Element>(
      fixture.nativeElement.querySelectorAll('.jit-item'),
    ).map((el) => el.textContent?.trim());
    expect(items).toEqual(['M3', 'LazyJIT']);
  });

  it('blocks prototype pollution paths in readDynamicSafePath', () => {
    const sample = { safe: 'ok' };
    expect(readDynamicSafePath(sample, 'data.safe')).toBe('ok');
    expect(readDynamicSafePath(sample, '__proto__.polluted')).toBeUndefined();
    expect(readDynamicSafePath(sample, 'constructor.prototype')).toBeUndefined();
  });
});
