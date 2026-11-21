/**
 * @fileoverview Module `src/form/field/numberfield.component.spec.ts`: regression spec for number-field `unit` handling.
 * @zh 模块文件 `src/form/field/numberfield.component.spec.ts`：数字字段 `unit` 配置的回归测试（字符串写法曾导致 `reading 'filter'` 报错）。
 */

import { NumberFieldComponent, normalizeUnit } from './numberfield.component';

describe('normalizeUnit', () => {
  it('字符串写法 -> 单个单位', () => {
    expect(normalizeUnit('m')).toEqual({ nativeUnit: 'm', units: [{ id: 'm', name: 'm', factor: 1, offset: 0 }] });
  });
  it('无单位 -> null', () => {
    expect(normalizeUnit(undefined)).toBeNull();
    expect(normalizeUnit('')).toBeNull();
  });
  it('完整写法保持不变', () => {
    const u = { nativeUnit: 'C', units: [{ id: 'C', name: '摄氏', factor: 1, offset: 0 }, { id: 'F', name: '华氏', factor: 1.8, offset: 32 }] };
    expect(normalizeUnit(u)).toEqual(u);
  });
  it('缺 units 的对象不崩溃', () => {
    expect(normalizeUnit({ nativeUnit: 'kg' })?.units.map(x => x.id)).toEqual(['kg']);
  });
  it('字符串数组', () => {
    expect(normalizeUnit(['m', 'km'])?.nativeUnit).toBe('m');
  });
});

describe('NumberFieldComponent unit', () => {
  function make(unit: unknown, value: number | null) {
    const self: any = Object.create(NumberFieldComponent.prototype);
    self.units = [];
    self.defaultUnit = '';
    self.currentUnit = '';
    self.field = { unit, formControl: { value, patchValue: (v: unknown) => (self.field.formControl.value = v) } };
    const cfg = normalizeUnit(unit);
    if (cfg) { self.unitCfg = cfg; self.defaultUnit = cfg.nativeUnit; self.currentUnit = cfg.nativeUnit; self.units = cfg.units; }
    return self as NumberFieldComponent & { field: any };
  }
  it("unit: 'm' 输入不报错", () => {
    const c = make('m', 5);
    expect(() => c.onChange({})).not.toThrow();
    expect(c.field.inputValue).toBe(5);
  });
  it('换算写法仍然换算', () => {
    const c = make({ nativeUnit: 'C', units: [{ id: 'C', name: 'C', factor: 1, offset: 0 }, { id: 'F', name: 'F', factor: 1.8, offset: 32 }] }, 0);
    c.unitchange({ value: 'F' });
    expect(c.field.inputValue).toBe(32);
  });
});
