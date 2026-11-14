/**
 * @fileoverview Module `src/core/dynamic/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/core/dynamic/public-api.ts`，提供 `@dotos/dui/core/dynamic` 公开 API 导出定义。
 */

export {
  DuiDynamicCardField,
  DuiDynamicCardSchema,
  DuiDynamicCardTone,
  DuiDynamicRenderMode,
  DynamicComponent,
  ResolvedDynamicCardView,
  isSafeMicroTemplate,
  readDynamicSafePath,
} from './dynamic.component';
export { DynamicModule } from './dynamic.module';
export * from './safeurl.pipe';
