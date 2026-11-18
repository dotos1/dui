/**
 * @fileoverview 颜色选择器 ControlValueAccessor 语义回归测试。
 * @zh 负责人 11-15 定：保留「外部写值不回写表单」的修正。
 * master（7.4.x）上 writeValue 会再调用 onChange / onTouched 并发 colorChanged，
 * 导致主题设置页仅打开就把表单标脏、配置回写本地存储，并可能写入 '-' 之类错值。
 * 按 Angular ControlValueAccessor 约定，writeValue 只更新视图，不通知表单；用户操作才通知。
 */

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent（ControlValueAccessor 语义）', () => {
  function setup() {
    const cmp = new ColorPickerComponent();
    const changes: unknown[] = [];
    const touches: unknown[] = [];
    const emitted: unknown[] = [];
    cmp.registerOnChange((v: unknown) => changes.push(v));
    cmp.registerOnTouched((v: unknown) => touches.push(v));
    cmp.colorChanged.subscribe((v: unknown) => emitted.push(v));
    return { cmp, changes, touches, emitted };
  }

  it('writeValue 只更新选中色，不回调表单、不发 colorChanged', () => {
    const { cmp, changes, touches, emitted } = setup();
    cmp.writeValue('blue-500');
    expect(cmp.selectedColor.class).toBe('blue-500');
    expect(changes).toEqual([]);
    expect(touches).toEqual([]);
    expect(emitted.length).toBe(0);
  });

  it('writeValue 传空值时保持原状', () => {
    const { cmp, changes } = setup();
    cmp.writeValue('blue-500');
    cmp.writeValue(null);
    expect(cmp.selectedColor.class).toBe('blue-500');
    expect(changes).toEqual([]);
  });

  it('用户改色时仍通知表单并发 colorChanged', () => {
    const { cmp, changes, touches, emitted } = setup();
    cmp.writeValue('blue-500');
    cmp.updateSelectedColor();
    expect(changes).toEqual([]); // 颜色未变，不重复通知
    cmp.selectedHue = '700';
    cmp.updateSelectedColor();
    expect(changes).toEqual(['blue-700']);
    expect(touches).toEqual(['blue-700']);
    expect(emitted.length).toBe(1);
  });
});
