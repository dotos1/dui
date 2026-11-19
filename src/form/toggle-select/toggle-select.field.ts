/**
 * @fileoverview Module `src/form/toggle-select/toggle-select.field.ts` providing the dui-form field type `toggle-select-field`.
 * @zh 模块文件 `src/form/toggle-select/toggle-select.field.ts`，提供 dui-form 字段类型 `toggle-select-field`（分段切换选择）。
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatField } from '@dotos1/dui/form';

/**
 * dui-form field type `toggle-select-field`: a segmented toggle bound to the field's FormControl; options come from `field.options` (`{ name, value }`). Use with the `label-field` wrapper. `toggle-select` itself is a standalone control (ControlValueAccessor) and is not a dui-form field type.
 * @zh dui-form 字段类型 `toggle-select-field`：分段切换，绑定字段的 FormControl；选项取 `field.options`（`{ name, value }`），配 `label-field` 包装器用。`toggle-select` 本身是独立控件（ControlValueAccessor），不是 dui-form 字段类型。
 */
@Component({
  selector: 'toggle-select-field',
  template: `
    <toggle-header
      [options]="field.options || []"
      [value]="formControl.value"
      [appearance]="field.appearance || 'stroked'"
      [disabled]="field.readonly || formControl.disabled"
      ignoreMdLgSize="true"
      useSelectOnMdLg="false"
      [disablePagination]="true"
      (valueChange)="formControl.setValue($event); formControl.markAsDirty()">
    </toggle-header>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { hostID: 'toggle-select-field' + Math.random().toString(36).substring(2, 15) },
  standalone: false,
})
export class ToggleSelectFieldComponent extends MatField {}
