/**
 * @fileoverview Module `src/tree/mobx-angular/mobx-proxy.ts` providing zero-MobX Angular Signal compatibility exports for tree module consumers.
 * @zh 模块文件 `src/tree/mobx-angular/mobx-proxy.ts`，为树形控件提供零 MobX 依赖的原生 Angular Signal 兼容导出。
 */

export {
  action,
  actionInternal,
  computed,
  DuiCompatActionDecorator,
  DuiCompatComputedDecorator,
  DuiCompatObservableDecorator,
  observable,
} from '@dotos/dui/core/mobx';
