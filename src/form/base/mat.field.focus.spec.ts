/**
 * @fileoverview Module `src/form/base/mat.field.focus.spec.ts`: regression spec for stuck focus highlight after blur.
 * @zh 模块文件 `src/form/base/mat.field.focus.spec.ts`：6.3.0 校核回归——点字段 A 再点字段 B，A 仍高亮。
 *
 * Material 22 的 mat-form-field 只在控件 `stateChanges` 发出时调 `_updateFocusState()` 刷新
 * `mat-focused` / `mdc-text-field--focused`（Material 18 的 `mat-focused` 是宿主绑定，随变更检测刷新）。
 * 这里用真实的 `MatFormField.prototype._updateFocusState` 订阅 MatField 的 `stateChanges`，
 * 模拟 `FormAttributes.onFocus` / `onBlur` 写 `field.focused`，断言 A 失焦后不再处于聚焦态。
 * 真浏览器对照见 `tools/m2-parity/focus-blur-check.mjs`。
 */

import { MatFormField } from '@angular/material/form-field';
import { observe } from '@dotos1/dui/core/form';
import { Subject } from 'rxjs';
import { MatField } from './mat.field';

/** 测试里用到的 mat-form-field 内部成员。 */
interface FakeFormField {
  _elementRef: { nativeElement: HTMLElement };
  _textField: { nativeElement: HTMLElement };
  _lineRipple: null;
  _isFocused: boolean | null;
  _control?: unknown;
  _updateFocusState(): void;
}

/** 字段配置里测试关心的部分。 */
interface FieldStub {
  name: string;
  focused?: boolean;
}

/** 测试里用到的 MatField 成员。 */
interface MatFieldUnderTest {
  _field: FieldStub;
  stateChanges: Subject<void>;
  formFieldControl: unknown;
  ngOnInit(): void;
  ngOnDestroy(): void;
  onContainerClick(event: MouseEvent): void;
}

/** 一个最小的 mat-form-field：真实 `_updateFocusState`，宿主与内层 text-field 用 div 代替。 */
function fakeFormField(): FakeFormField {
  const ff: FakeFormField = Object.create(MatFormField.prototype);
  Object.assign(ff, {
    _elementRef: { nativeElement: document.createElement('div') },
    _textField: { nativeElement: document.createElement('div') },
    _lineRipple: null,
    _isFocused: null,
  });
  return ff;
}

/** 不起 TestBed：直接拿 MatField 原型，配字段与 mat-form-field，再按 Material 22 的方式订阅 stateChanges。 */
function mountField(name: string): { field: FieldStub; ff: FakeFormField; self: MatFieldUnderTest; blur: () => void; focus: () => void } {
  const field: FieldStub = { name };
  const ff = fakeFormField();
  Object.defineProperty(field, '__formField__', { value: ff, enumerable: false, configurable: true });
  const self: MatFieldUnderTest = Object.create(MatField.prototype);
  self._field = field;
  self.stateChanges = new Subject<void>();
  self.ngOnInit();
  ff._control = self.formFieldControl;
  self.stateChanges.subscribe(() => ff._updateFocusState());
  ff._updateFocusState();
  // FormAttributes 在输入框上的 focus / blur 处理（form.attributes.ts）。
  const attrObserver = observe<boolean>(field, ['focused'], () => {});
  return {
    field, ff, self,
    focus: () => attrObserver.setValue(true, true),
    blur: () => attrObserver.setValue(false, true),
  };
}

const isFocused = (ff: FakeFormField): { mat: boolean; mdc: boolean } => ({
  mat: ff._elementRef.nativeElement.classList.contains('mat-focused'),
  mdc: ff._textField.nativeElement.classList.contains('mdc-text-field--focused'),
});

describe('MatField 失焦后通知 mat-form-field（6.3.0 回归）', () => {
  it('点字段 A 再点字段 B：A 不再处于聚焦态，B 处于聚焦态', () => {
    const a = mountField('a');
    const b = mountField('b');
    a.self.onContainerClick(new MouseEvent('click'));
    a.focus();
    expect(isFocused(a.ff)).toEqual({ mat: true, mdc: true });

    a.blur();
    b.self.onContainerClick(new MouseEvent('click'));
    b.focus();
    expect(isFocused(a.ff)).toEqual({ mat: false, mdc: false });
    expect(isFocused(b.ff)).toEqual({ mat: true, mdc: true });
  });

  it('键盘切入切出（不经 onContainerClick）也刷新聚焦态', () => {
    const a = mountField('a');
    a.focus();
    expect(isFocused(a.ff).mat).toBe(true);
    a.blur();
    expect(isFocused(a.ff)).toEqual({ mat: false, mdc: false });
  });

  it('FocusMonitor 直接给 field.focused 赋值同样刷新', () => {
    const a = mountField('a');
    a.field.focused = true;
    expect(isFocused(a.ff).mat).toBe(true);
    a.field.focused = false;
    expect(isFocused(a.ff).mat).toBe(false);
  });

  it('销毁后不再向已完成的 stateChanges 发值', () => {
    const a = mountField('a');
    a.self.ngOnDestroy();
    expect(() => { a.field.focused = true; }).not.toThrow();
  });
});

describe('observe().setValue(value, emitEvent)', () => {
  it('默认静默；emitEvent 时只通知其它监听者、不回调自己', () => {
    const o: { focused?: boolean } = {};
    const self = jasmine.createSpy('self');
    const other = jasmine.createSpy('other');
    const mine = observe<boolean>(o, ['focused'], self);
    observe<boolean>(o, ['focused'], other);
    self.calls.reset();
    other.calls.reset();

    mine.setValue(true);
    expect(o.focused).toBe(true);
    expect(other).not.toHaveBeenCalled();

    mine.setValue(false, true);
    expect(other).toHaveBeenCalledWith({ previousValue: true, currentValue: false, firstChange: false });
    expect(self).not.toHaveBeenCalled();

    other.calls.reset();
    mine.setValue(false, true);
    expect(other).not.toHaveBeenCalled();
  });
});
