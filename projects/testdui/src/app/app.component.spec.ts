/**
 * @fileoverview Module `projects/testdui/src/app/app.component.spec.ts` providing app component spec definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/app.component.spec.ts`，提供app组件spec相关的定义与实现。
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DotosConfigService, ThemeService } from '@dotos1/dui/theme';
import { TranslationService } from '@dotos1/dui/translator';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { AppComponent } from './app.component';

// AppComponent 是 standalone:false（与 master 一致），这里按 NgModule 组件声明；
// 只验证能实例化与默认标题，模板渲染由 tools/m2-parity 的真浏览器比对覆盖。
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: {} },
        { provide: DotosConfigService, useValue: {} },
        { provide: TranslationService, useValue: { userLang: 'zh' } },
        { provide: LocalStorageService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(AppComponent, '')
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have the 'testdui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('testdui');
  });
});
