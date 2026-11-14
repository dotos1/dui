/**
 * @fileoverview Module `src/standalone/schema-form.component.ts` providing zero-`any` Zoneless Signal declarative form `DuiSchemaFormComponent`.
 * @zh 模块文件 `src/standalone/schema-form.component.ts`，提供受 `@dotos/dui/schema` 驱动的声明式零 `any` Signal 表单组件 `DuiSchemaFormComponent`。
 */

import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  ModelSignal,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  DuiFormFieldConfig,
  DuiFormPrimitiveValue,
  DuiFormSchema,
  DuiSchemaFinding,
  validateDuiFormSchema,
} from '@dotos/dui/schema';

const INITIAL_EMPTY_FORM_MODEL: Record<string, DuiFormPrimitiveValue> = {};
const INITIAL_EMPTY_ERRORS: Readonly<Record<string, string>> = {};

/**
 * Standalone Zoneless declarative form component `<dui-standalone-form>` driven by `@dotos/dui/schema` with 100% zero `any`.
 * @zh 独立 Zoneless 声明式企业表单组件 `<dui-standalone-form>`，由 `@dotos/dui/schema` 驱动，支持 `schema = input.required<DuiFormSchema>()`、`value = model<Record<string, DuiFormPrimitiveValue>>({})` 与 `submitted = output<Record<string, DuiFormPrimitiveValue>>()`。
 */
@Component({
  selector: 'dui-standalone-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="dui-s-form"
      [class.dui-s-form--compact]="resolvedDensity() === 'compact'"
      [class.dui-s-form--normal]="resolvedDensity() === 'normal'"
      [class.dui-s-form--loose]="resolvedDensity() === 'loose'"
      [attr.aria-label]="schema().title || schema().id"
      novalidate
      (submit)="handleSubmit($event)">
      @if (schema().title || schema().description) {
        <header class="dui-s-form__header">
          @if (schema().title) {
            <h3 class="dui-s-form__title">{{ schema().title }}</h3>
          }
          @if (schema().description) {
            <p class="dui-s-form__desc">{{ schema().description }}</p>
          }
        </header>
      }

      @if (schemaErrors().length > 0) {
        <div class="dui-s-form__schema-alert" role="alert">
          @for (finding of schemaErrors(); track finding.path + finding.code) {
            <div class="dui-s-form__schema-alert-item">
              <strong>[{{ finding.code }}] {{ finding.path }}:</strong> {{ finding.message }}
              <span class="dui-s-form__schema-hint">{{ finding.hint }}</span>
            </div>
          }
        </div>
      }

      <div
        class="dui-s-form__grid"
        [style.grid-template-columns]="'repeat(' + resolvedColumns() + ', minmax(0, 1fr))'">
        @for (field of schema().fields; track field.key) {
          <div
            class="dui-s-form__field"
            [style.grid-column]="'span ' + resolveColSpan(field)">
            @if (field.type !== 'checkbox' && field.type !== 'switch') {
              <label class="dui-s-form__label" [attr.for]="controlId(field.key)">
                <span>{{ field.label }}</span>
                @if (field.required) {
                  <span class="dui-s-form__req" aria-hidden="true">*</span>
                }
              </label>
            }

            @switch (field.type) {
              @case ('textarea') {
                <textarea
                  class="dui-s-form__control dui-s-form__textarea"
                  [attr.id]="controlId(field.key)"
                  [attr.placeholder]="field.placeholder ?? ''"
                  [disabled]="field.disabled === true"
                  [required]="field.required === true"
                  [attr.aria-invalid]="fieldError(field.key) ? 'true' : null"
                  [value]="readStringValue(field)"
                  (input)="onTextLikeInput(field, $event)"></textarea>
              }
              @case ('select') {
                <select
                  class="dui-s-form__control"
                  [attr.id]="controlId(field.key)"
                  [disabled]="field.disabled === true"
                  [required]="field.required === true"
                  [attr.aria-invalid]="fieldError(field.key) ? 'true' : null"
                  (change)="onSelectChange(field, $event)">
                  <option value="" [selected]="readRawValue(field) === null || readRawValue(field) === ''">
                    {{ field.placeholder || '-- 请选择 --' }}
                  </option>
                  @for (opt of field.options ?? []; track opt.label + '' + opt.value) {
                    <option
                      [value]="String(opt.value)"
                      [disabled]="opt.disabled === true"
                      [selected]="readRawValue(field) === opt.value">
                      {{ opt.label }}
                    </option>
                  }
                </select>
              }
              @case ('radio') {
                <div class="dui-s-form__radios" role="radiogroup" [attr.aria-label]="field.label">
                  @for (opt of field.options ?? []; track opt.label + '' + opt.value) {
                    <label class="dui-s-form__choice">
                      <input
                        type="radio"
                        [attr.name]="schema().id + '-' + field.key"
                        [disabled]="field.disabled === true || opt.disabled === true"
                        [checked]="readRawValue(field) === opt.value"
                        (change)="updateFieldValue(field.key, opt.value)" />
                      <span>{{ opt.label }}</span>
                    </label>
                  }
                </div>
              }
              @case ('checkbox') {
                <label class="dui-s-form__choice">
                  <input
                    type="checkbox"
                    [attr.id]="controlId(field.key)"
                    [disabled]="field.disabled === true"
                    [checked]="readBooleanValue(field)"
                    (change)="onCheckboxChange(field.key, $event)" />
                  <span>{{ field.label }}</span>
                </label>
              }
              @case ('switch') {
                <label class="dui-s-form__choice dui-s-form__switch">
                  <input
                    type="checkbox"
                    role="switch"
                    [attr.id]="controlId(field.key)"
                    [disabled]="field.disabled === true"
                    [checked]="readBooleanValue(field)"
                    (change)="onCheckboxChange(field.key, $event)" />
                  <span>{{ field.label }}</span>
                </label>
              }
              @case ('number') {
                <input
                  type="number"
                  class="dui-s-form__control"
                  [attr.id]="controlId(field.key)"
                  [attr.placeholder]="field.placeholder ?? ''"
                  [attr.min]="field.min ?? null"
                  [attr.max]="field.max ?? null"
                  [attr.step]="field.step ?? null"
                  [disabled]="field.disabled === true"
                  [required]="field.required === true"
                  [attr.aria-invalid]="fieldError(field.key) ? 'true' : null"
                  [value]="readNumberInputString(field)"
                  (input)="onNumberInput(field, $event)" />
              }
              @default {
                <input
                  class="dui-s-form__control"
                  [attr.type]="field.type"
                  [attr.id]="controlId(field.key)"
                  [attr.placeholder]="field.placeholder ?? ''"
                  [disabled]="field.disabled === true"
                  [required]="field.required === true"
                  [attr.aria-invalid]="fieldError(field.key) ? 'true' : null"
                  [value]="readStringValue(field)"
                  (input)="onTextLikeInput(field, $event)" />
              }
            }

            @if (fieldError(field.key)) {
              <span class="dui-s-form__error" role="alert">{{ fieldError(field.key) }}</span>
            } @else if (field.hint) {
              <span class="dui-s-form__hint">{{ field.hint }}</span>
            }
          </div>
        }
      </div>

      <footer class="dui-s-form__actions">
        @if (schema().resetLabel) {
          <button type="button" class="dui-s-form__btn dui-s-form__btn--reset" (click)="resetForm()">
            {{ schema().resetLabel }}
          </button>
        }
        <button type="submit" class="dui-s-form__btn dui-s-form__btn--submit">
          {{ schema().submitLabel || '提交' }}
        </button>
      </footer>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dui-s-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-form__header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .dui-s-form__title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .dui-s-form__desc {
        margin: 0;
        font-size: 12px;
        color: var(--mat-sys-on-surface-variant, #3f4948);
      }
      .dui-s-form__schema-alert {
        padding: 10px 12px;
        border-radius: 6px;
        background-color: var(--mat-sys-error-container, #ffdad6);
        color: var(--mat-sys-on-error-container, #410002);
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .dui-s-form__schema-hint {
        display: block;
        opacity: 0.9;
      }
      .dui-s-form__grid {
        display: grid;
        gap: 12px 16px;
      }
      .dui-s-form--compact .dui-s-form__grid {
        gap: 8px 12px;
      }
      .dui-s-form__field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .dui-s-form__label {
        font-size: 12px;
        font-weight: 500;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-form__req {
        margin-left: 2px;
        color: var(--dui-warn, var(--mat-sys-error, #ba1a1a));
      }
      .dui-s-form__control {
        box-sizing: border-box;
        width: 100%;
        height: 34px;
        padding: 0 10px;
        border-radius: 6px;
        border: 1px solid var(--dui-outline-variant, var(--mat-sys-outline, #6f7979));
        background-color: var(--dui-surface, var(--mat-sys-surface, #ffffff));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
        font-family: inherit;
        font-size: 13px;
      }
      .dui-s-form--compact .dui-s-form__control {
        height: 28px;
        font-size: 12px;
      }
      .dui-s-form--loose .dui-s-form__control {
        height: 40px;
        font-size: 14px;
      }
      .dui-s-form__textarea {
        min-height: 72px;
        padding: 8px 10px;
        resize: vertical;
      }
      .dui-s-form__control:focus-visible {
        outline: 2px solid var(--dui-primary, var(--mat-sys-primary, #006a6a));
        outline-offset: 1px;
      }
      .dui-s-form__radios {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        min-height: 30px;
        align-items: center;
      }
      .dui-s-form__choice {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        cursor: pointer;
      }
      .dui-s-form__hint {
        font-size: 11px;
        color: var(--mat-sys-on-surface-variant, #3f4948);
      }
      .dui-s-form__error {
        font-size: 11px;
        color: var(--dui-warn, var(--mat-sys-error, #ba1a1a));
      }
      .dui-s-form__actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 4px;
      }
      .dui-s-form__btn {
        height: 34px;
        padding: 0 16px;
        border-radius: 6px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
      }
      .dui-s-form__btn--reset {
        border: 1px solid var(--dui-outline-variant, var(--mat-sys-outline, #6f7979));
        background: transparent;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-form__btn--submit {
        border: 1px solid transparent;
        background-color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
        color: var(--dui-on-primary, var(--mat-sys-on-primary, #ffffff));
      }
    `,
  ],
})
export class DuiSchemaFormComponent {
  protected readonly String: StringConstructor = String;

  /**
   * Required Signal input `schema` (`InputSignal<DuiFormSchema>`) driving form layout and validation.
   * @zh 必填 Signal 输入 `schema`，传入由 `@dotos/dui/schema` 定义的声明式表单配置。
   */
  readonly schema: InputSignal<DuiFormSchema> = input.required<DuiFormSchema>();

  /**
   * Two-way Signal model `value` (`ModelSignal<Record<string, DuiFormPrimitiveValue>>`) storing form field values without `any`.
   * @zh 双向绑定 Signal 模型 `value`，存储严格零 `any` 的表单字段键值对象。
   */
  readonly value: ModelSignal<Record<string, DuiFormPrimitiveValue>> =
    model<Record<string, DuiFormPrimitiveValue>>(INITIAL_EMPTY_FORM_MODEL);

  /**
   * Signal output `submitted` (`OutputEmitterRef<Record<string, DuiFormPrimitiveValue>>`) emitting validated form payload on submit.
   * @zh Signal 输出 `submitted`，在全部字段校验通过后发出归一化后的表单键值数据。
   */
  readonly submitted: OutputEmitterRef<Record<string, DuiFormPrimitiveValue>> =
    output<Record<string, DuiFormPrimitiveValue>>();

  private readonly _validationErrors: WritableSignal<Readonly<Record<string, string>>> =
    signal<Readonly<Record<string, string>>>(INITIAL_EMPTY_ERRORS);

  /**
   * Computed signal `schemaErrors` validating `schema()` via `validateDuiFormSchema`.
   * @zh 计算属性 `schemaErrors`，调用 `validateDuiFormSchema` 实时检测 Schema 自身结构错误。
   */
  readonly schemaErrors: Signal<readonly DuiSchemaFinding[]> = computed<readonly DuiSchemaFinding[]>(() => {
    const res = validateDuiFormSchema(this.schema());
    return res.findings.filter((f) => f.severity === 'error');
  });

  /**
   * Computed signal `resolvedColumns` returning 1..4 CSS Grid columns.
   * @zh 计算属性 `resolvedColumns`，返回表单 CSS Grid 布局列数（默认 `1`）。
   */
  readonly resolvedColumns: Signal<number> = computed<number>(() => this.schema().columns ?? 1);

  /**
   * Computed signal `resolvedDensity` returning `'compact' | 'normal' | 'loose'`.
   * @zh 计算属性 `resolvedDensity`，返回表单高密度模式档位（默认 `'normal'`）。
   */
  readonly resolvedDensity: Signal<'compact' | 'normal' | 'loose'> = computed<'compact' | 'normal' | 'loose'>(
    () => this.schema().density ?? 'normal',
  );

  /**
   * Computes DOM `id` for a given field `key`.
   * @zh 生成指定字段的唯一控件 DOM `id`。
   * @param key - Field key (`string`) / 字段键名（`string`）
   * @returns Control DOM ID (`string`) / 控件 DOM ID（`string`）
   */
  controlId(key: string): string {
    return `dui-form-${this.schema().id}-${key}`;
  }

  /**
   * Clamps field `colSpan` to `[1, resolvedColumns()]`.
   * @zh 计算字段在当前网格列数下的安全跨列数。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @returns Effective column span (`number`) / 实际跨列数（`number`）
   */
  resolveColSpan(field: DuiFormFieldConfig): number {
    const maxCols = this.resolvedColumns();
    const requested = field.colSpan ?? 1;
    return Math.min(Math.max(1, requested), maxCols);
  }

  /**
   * Reads effective value of a field from `value()` model or `field.defaultValue`.
   * @zh 读取字段当前有效值（优先取 `value()` 模型，未设置时回退 `field.defaultValue`）。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @returns Primitive value (`DuiFormPrimitiveValue`) / 字段基础值（`DuiFormPrimitiveValue`）
   */
  readRawValue(field: DuiFormFieldConfig): DuiFormPrimitiveValue {
    const currentModel = this.value();
    if (Object.prototype.hasOwnProperty.call(currentModel, field.key)) {
      return currentModel[field.key] ?? null;
    }
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }
    if (field.type === 'checkbox' || field.type === 'switch') {
      return false;
    }
    return null;
  }

  /**
   * Reads string representation for text-like controls.
   * @zh 读取文本类控件的字符串显示值。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @returns String value (`string`) / 字符串值（`string`）
   */
  readStringValue(field: DuiFormFieldConfig): string {
    const raw = this.readRawValue(field);
    return raw === null || raw === undefined ? '' : String(raw);
  }

  /**
   * Reads string representation for numeric input controls.
   * @zh 读取数值型输入框的字符串显示值。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @returns Numeric string (`string`) / 数值字符串（`string`）
   */
  readNumberInputString(field: DuiFormFieldConfig): string {
    const raw = this.readRawValue(field);
    return typeof raw === 'number' && Number.isFinite(raw) ? String(raw) : '';
  }

  /**
   * Reads boolean state for `checkbox` and `switch` controls.
   * @zh 读取复选框与开关控件的布尔选中值。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @returns Boolean state (`boolean`) / 布尔状态（`boolean`）
   */
  readBooleanValue(field: DuiFormFieldConfig): boolean {
    return this.readRawValue(field) === true;
  }

  /**
   * Reads current validation error message for `key`, if any.
   * @zh 获取指定字段当前的校验错误提示文本。
   * @param key - Field key (`string`) / 字段键名（`string`）
   * @returns Error message or empty string (`string`) / 错误信息或空字符串（`string`）
   */
  fieldError(key: string): string {
    return this._validationErrors()[key] ?? '';
  }

  /**
   * Immutably updates a single field value in `value` Signal model and clears its stale error.
   * @zh 不可变更新单个字段值至 `value` 模型，并清理该字段的旧错误提示。
   * @param key - Field key (`string`) / 字段键名（`string`）
   * @param nextVal - New primitive value (`DuiFormPrimitiveValue`) / 新字段值（`DuiFormPrimitiveValue`）
   */
  updateFieldValue(key: string, nextVal: DuiFormPrimitiveValue): void {
    this.value.update((prev) => ({
      ...prev,
      [key]: nextVal,
    }));
    const errs = this._validationErrors();
    if (errs[key]) {
      const copy: Record<string, string> = { ...errs };
      delete copy[key];
      this._validationErrors.set(copy);
    }
  }

  /**
   * Handles native `input` events on text/textarea/email/password/date controls.
   * @zh 处理文本、多行文本、邮箱、密码、日期输入框的输入变更事件。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @param event - DOM Event (`Event`) / 原生输入事件（`Event`）
   */
  onTextLikeInput(field: DuiFormFieldConfig, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
    this.updateFieldValue(field.key, target ? target.value : '');
  }

  /**
   * Handles native `input` events on numeric controls.
   * @zh 处理数值型输入框变更事件并转换为有限 `number` 或 `null`。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @param event - DOM Event (`Event`) / 原生输入事件（`Event`）
   */
  onNumberInput(field: DuiFormFieldConfig, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const raw = target ? target.value.trim() : '';
    if (raw.length === 0) {
      this.updateFieldValue(field.key, null);
      return;
    }
    const parsed = Number(raw);
    this.updateFieldValue(field.key, Number.isFinite(parsed) ? parsed : null);
  }

  /**
   * Handles native `change` events on `<select>` controls while preserving original option value types.
   * @zh 处理下拉选择框变更事件，并还原匹配选项的原始类型（string/number/boolean）。
   * @param field - Field config (`DuiFormFieldConfig`) / 字段配置（`DuiFormFieldConfig`）
   * @param event - DOM Event (`Event`) / 原生变更事件（`Event`）
   */
  onSelectChange(field: DuiFormFieldConfig, event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const selectedStr = target ? target.value : '';
    if (selectedStr === '') {
      this.updateFieldValue(field.key, null);
      return;
    }
    const matched = (field.options ?? []).find((opt) => String(opt.value) === selectedStr);
    this.updateFieldValue(field.key, matched ? matched.value : selectedStr);
  }

  /**
   * Handles native `change` events on `checkbox` and `switch` controls.
   * @zh 处理复选框或开关控件的勾选变更事件。
   * @param key - Field key (`string`) / 字段键名（`string`）
   * @param event - DOM Event (`Event`) / 原生变更事件（`Event`）
   */
  onCheckboxChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.updateFieldValue(key, target ? target.checked : false);
  }

  /**
   * Resets all fields back to their schema `defaultValue` (or empty default) and clears validation errors.
   * @zh 将表单所有字段重置回 Schema 定义的默认值并清空校验错误。
   */
  resetForm(): void {
    const defaults: Record<string, DuiFormPrimitiveValue> = {};
    for (const field of this.schema().fields) {
      if (field.defaultValue !== undefined) {
        defaults[field.key] = field.defaultValue;
      } else if (field.type === 'checkbox' || field.type === 'switch') {
        defaults[field.key] = false;
      } else {
        defaults[field.key] = null;
      }
    }
    this.value.set(defaults);
    this._validationErrors.set(INITIAL_EMPTY_ERRORS);
  }

  /**
   * Validates all active fields against `schema()` constraints and emits `submitted` if valid.
   * @zh 校验所有启用字段的值约束，全部通过后更新 `value` 并触发 `submitted` 输出事件。
   * @param event - Optional submit event (`Event`) / 表单提交事件（`Event`）
   * @returns Whether form submission succeeded (`boolean`) / 是否通过校验并成功提交（`boolean`）
   */
  handleSubmit(event?: Event): boolean {
    event?.preventDefault();
    if (this.schemaErrors().length > 0) {
      return false;
    }

    const payload: Record<string, DuiFormPrimitiveValue> = {};
    const errors: Record<string, string> = {};

    for (const field of this.schema().fields) {
      const val = this.readRawValue(field);
      payload[field.key] = val;
      if (field.disabled) {
        continue;
      }

      const isEmpty =
        val === null ||
        val === undefined ||
        (typeof val === 'string' && val.trim().length === 0) ||
        ((field.type === 'checkbox' || field.type === 'switch') && field.required === true && val !== true);

      if (field.required && isEmpty) {
        errors[field.key] = `${field.label} 为必填项`;
        continue;
      }

      if (typeof val === 'number') {
        if (field.min !== undefined && val < field.min) {
          errors[field.key] = `${field.label} 不能小于 ${field.min}`;
          continue;
        }
        if (field.max !== undefined && val > field.max) {
          errors[field.key] = `${field.label} 不能大于 ${field.max}`;
          continue;
        }
      }

      if (typeof val === 'string' && val.length > 0) {
        if (field.minLength !== undefined && val.length < field.minLength) {
          errors[field.key] = `${field.label} 长度不能少于 ${field.minLength} 个字符`;
          continue;
        }
        if (field.maxLength !== undefined && val.length > field.maxLength) {
          errors[field.key] = `${field.label} 长度不能超过 ${field.maxLength} 个字符`;
          continue;
        }
        if (field.pattern) {
          const regex = new RegExp(field.pattern);
          if (!regex.test(val)) {
            errors[field.key] = `${field.label} 格式不匹配要求`;
            continue;
          }
        }
      }
    }

    this._validationErrors.set(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    }

    this.value.set(payload);
    this.submitted.emit(payload);
    return true;
  }
}
