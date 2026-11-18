/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.runtime-scope.ts` providing the runtime (JIT) import list for sandbox templates, working in both development and production builds.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.runtime-scope.ts`，提供沙箱模板运行时（JIT）编译所用的导入清单，保证开发 / 生产构建行为一致。
 *
 * 背景（生产构建的第二个坑）：AOT 产物里 NgModule 的 declarations/exports 由 `ɵɵsetNgModuleScope` 写入，
 * 但该调用被 `ngJitMode` 守卫，production 构建会整段摇掉 —— 运行时编译的独立组件再 import 这些 NgModule，
 * 拿到的导出列表为空，`<dui-button>`、`[(ngModel)]` 等全部“静默失效”（只剩空标签）。
 * 处理方式：
 *   1. CommonModule / Material 改为直接导入独立（standalone）指令、组件与管道，它们的 ɵcmp/ɵdir/ɵpipe 自带完整元数据；
 *   2. 仍需 NgModule 的（Forms 与 `@dotos1/dui` 非独立组件）在导出列表为空时按公开导出补回作用域；开发构建作用域本就完整，不做改动。
 */

import { Type, ɵɵsetNgModuleScope } from '@angular/core';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  KeyValuePipe,
  LowerCasePipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
  PercentPipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  CheckboxControlValueAccessor,
  CheckboxRequiredValidator,
  DefaultValueAccessor,
  EmailValidator,
  FormArrayName,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  FormsModule,
  MaxLengthValidator,
  MaxValidator,
  MinLengthValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgModelGroup,
  NgSelectOption,
  NumberValueAccessor,
  PatternValidator,
  RadioControlValueAccessor,
  RangeValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption,
} from '@angular/forms';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChip, MatChipListbox, MatChipOption, MatChipSet } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatTooltip } from '@angular/material/tooltip';

import { ButtonComponent, ButtonModule } from '@dotos1/dui/ui/button';
import { DuiToolbarComponent, DuiToolbarModule, Fill, Separator, Spacer, TextItem } from '@dotos1/dui/ui/toolbar';
import { AvatarComponent, AvatarModule } from '@dotos1/dui/ux/avatar';
import { HighlightComponent, HighlightModule } from '@dotos1/dui/ux/highlight';
import { CardModule, DuiCardComponent } from '@dotos1/dui/container';

/**
 * Standalone declarables imported directly (self-contained metadata in production).
 * @zh 直接导入的独立指令 / 组件 / 管道（生产构建下元数据依然完整）。
 */
const STANDALONE_DECLARABLES: Type<unknown>[] = [
  NgIf, NgFor, NgClass, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet,
  AsyncPipe, JsonPipe, UpperCasePipe, LowerCasePipe, TitleCasePipe, DecimalPipe, PercentPipe, CurrencyPipe, DatePipe,
  SlicePipe, KeyValuePipe,
  MatBadge, MatButton, MatIconButton, MatAnchor, MatFabButton, MatMiniFabButton,
  MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
  MatCheckbox, MatChip, MatChipSet, MatChipListbox, MatChipOption, MatDivider,
  MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatInput,
  MatProgressBar, MatSlideToggle, MatSlider, MatSliderThumb, MatTooltip,
];

/**
 * Shared forms directives (exported by both FormsModule and ReactiveFormsModule).
 * @zh Forms 共享指令（FormsModule 与 ReactiveFormsModule 都会导出）。
 */
const SHARED_FORM_DIRECTIVES: Type<unknown>[] = [
  ɵNgNoValidate, NgSelectOption, ɵNgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor,
  CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor,
  NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator,
  CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator,
];

/**
 * NgModules still needed at runtime, with their public export lists for scope restoration.
 * @zh 运行时仍需导入的 NgModule 及其公开导出（用于生产构建下补回作用域；模块的 providers 由 ɵinj 提供，不受影响）。
 */
const MODULE_SCOPES: ReadonlyArray<readonly [Type<unknown>, Type<unknown>[]]> = [
  [FormsModule, [...SHARED_FORM_DIRECTIVES, NgModel, NgModelGroup, NgForm]],
  [ReactiveFormsModule, [...SHARED_FORM_DIRECTIVES, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName]],
  [ButtonModule, [ButtonComponent]],
  [DuiToolbarModule, [DuiToolbarComponent, Separator, Spacer, Fill, TextItem]],
  [AvatarModule, [AvatarComponent]],
  [HighlightModule, [HighlightComponent]],
  [CardModule, [DuiCardComponent]],
];

/**
 * Whether module scopes were checked.
 * @zh 是否已检查 / 补回过模块作用域。
 */
let scopesEnsured = false;

/**
 * Returns whether an NgModule class still carries a non-empty runtime export list.
 * @zh 判断 NgModule 运行时导出列表是否完整（非空数组或惰性函数）。
 * @param moduleType - NgModule class / NgModule 类
 * @returns Whether exports are present / 是否存在导出
 */
function hasRuntimeExports(moduleType: Type<unknown>): boolean {
  const def: unknown = Reflect.get(moduleType, 'ɵmod');
  if (typeof def !== 'object' || def === null || !('exports' in def)) {
    return false;
  }
  const exportsValue: unknown = def.exports;
  return typeof exportsValue === 'function' || (Array.isArray(exportsValue) && exportsValue.length > 0);
}

/**
 * Restores stripped NgModule scopes once (production builds only need it).
 * @zh 一次性补回被生产构建摇掉的 NgModule 导出作用域（开发构建下作用域完整，直接跳过）。
 */
function ensureModuleScopes(): void {
  if (scopesEnsured) {
    return;
  }
  scopesEnsured = true;
  for (const [moduleType, exportsList] of MODULE_SCOPES) {
    if (!hasRuntimeExports(moduleType)) {
      ɵɵsetNgModuleScope(moduleType, { exports: exportsList });
    }
  }
}

/**
 * Returns the `imports` array for runtime-compiled sandbox components.
 * @zh 返回运行时编译沙箱组件所用的 `imports` 数组。
 * @returns Import list / 导入清单
 */
export function liveSandboxRuntimeImports(): Type<unknown>[] {
  ensureModuleScopes();
  return [...STANDALONE_DECLARABLES, ...MODULE_SCOPES.map(([moduleType]) => moduleType)];
}
