import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DuiBase } from '@dotos/dui/base';
import { DuiToolbarModule } from './toolbar.module';

/**
 * F10：constructButton 把不带 xtype 的按钮缺省成 'dui-button'。
 * 只导入工具栏模块的应用也必须能查到按钮工厂，否则会抛 "dui-button not exits in factory"。
 */
describe('DuiToolbarModule 注册按钮工厂', () => {
  it('只导入 DuiToolbarModule 时 dui-button 工厂已注册', () => {
    DuiBase['componentFactoryMap'].delete('dui-button');
    TestBed.configureTestingModule({ imports: [NoopAnimationsModule, DuiToolbarModule] });
    TestBed.inject(DuiToolbarModule);
    expect(DuiBase.getComponentFactory('dui-button')).toBeTruthy();
  });
});
