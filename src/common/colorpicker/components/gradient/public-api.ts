/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

export * from './gradient.module';
export {GradientDialogComponent } from './gradient-dialog.component';
export {GradientFieldsComponent } from './gradient-fields.component';
export {GradientComponent } from './gradient.component';
export { useColorPicker } from './hooks/color-picker';

export type {
  ColorsProps,
  LocalesProps,
  GradientProps,
} from './shared/types.js'
