/**
 * @fileoverview Module `src/form/date/datefield.component.spec.ts` providing datefield component spec definitions and implementation.
 * @zh 模块文件 `src/form/date/datefield.component.spec.ts`，提供datefield组件spec相关的定义与实现。
 */

import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateFieldComponent } from './datefield.component';

/**
 * b8c5e5c 复核:宿主上的 (input) 处理不能走 model→view。
 * 内层 MatDatetimepickerInput 已经把值写进 formControl;这里再 setValue(date)
 * 会经 writeValue 把输入框改写成格式化后的日期,用户敲 "2" 就变成 0002/01/01。
 */
describe('DateFieldComponent._onInput(b8c5e5c 复核)', () => {
  it('不触发 model→view 回写', () => {
    const control = new FormControl<any>(null);
    const writeToView = jasmine.createSpy('writeValue');
    control.registerOnChange(writeToView);   // 等价于内层 input 的值访问器挂上的回调

    const self: any = Object.create(DateFieldComponent.prototype);
    Object.defineProperty(self, 'field', { value: { formControl: control } });
    self._dateAdapter = {
      parse: (v: string) => ({ parsed: v }),
      isValid: () => true,
      getValidDateOrNull: (d: any) => d,
    };
    self.getParseFormat = () => 'YYYY/MM/DD';
    self._cvaOnChange = () => {};
    self._valueChange = new EventEmitter();
    self.dateInput = new EventEmitter();

    self._onInput('2');

    expect(writeToView).not.toHaveBeenCalled();
  });
});
