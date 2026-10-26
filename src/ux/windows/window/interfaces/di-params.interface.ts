/**
 * @fileoverview Module `src/ux/windows/window/interfaces/di-params.interface.ts` providing di params interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/interfaces/di-params.interface.ts`，提供di参数集合interface相关的定义与实现。
 */

import { Injector } from '@angular/core';
import { ɵDynamicWindowRefModel } from '../classes';

/**
 * Interface `ɵDynamicWindowDiParams` defining the contract and properties for ɵdynamic window di params.
 * @internal
 * @zh 接口 `ɵDynamicWindowDiParams`，定义ɵDynamic窗口Di参数集合的数据结构契约与属性规范。
 */
export interface ɵDynamicWindowDiParams {
    /**
     * Property `injector` (`Injector`) storing injector.
     * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器。
     */
    injector: Injector;
    /**
     * Property `windowRef` (`ɵDynamicWindowRefModel`) storing window ref.
     * @zh 属性 `windowRef`（类型：`ɵDynamicWindowRefModel`），用于存储或配置窗口引用。
     */
    windowRef: ɵDynamicWindowRefModel;
}
