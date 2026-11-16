/**
 * @fileoverview Module `src/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

// @dotos1/dui 的 API 全部通过二级入口点提供，例如：
//   import { ThemeService } from '@dotos1/dui/theme';
//   import { AuthModule }   from '@dotos1/dui/core/auth';
// 主入口刻意不导出任何内容，以避免把全部 102 个入口点拉进消费者的构建图。
// ng-packagr 要求入口文件必须有导出，故保留这个空的 default export。
export default {};
