/**
 * @fileoverview Module `src/ux/windows/window/interfaces/input-params.interface.ts` providing input params interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/interfaces/input-params.interface.ts`，提供输入属性参数集合interface相关的定义与实现。
 */

import { Type } from '@angular/core';
import { ɵDynamicWindowRefModel } from '../classes';

/**
 * Interface `ɵDynamicWindowInputParams` defining the contract and properties for ɵdynamic window input params.
 * @internal
 * @zh 接口 `ɵDynamicWindowInputParams`，定义ɵDynamic窗口输入属性参数集合的数据结构契约与属性规范。
 */
export interface ɵDynamicWindowInputParams {
    /**
     * Property `component` (`Type<unknown>`) storing component.
     * @zh 属性 `component`（类型：`Type<unknown>`），用于存储或配置组件。
     */
    component: Type<unknown>;
    /**
     * Property `windowRef` (`ɵDynamicWindowRefModel`) storing window ref.
     * @zh 属性 `windowRef`（类型：`ɵDynamicWindowRefModel`），用于存储或配置窗口引用。
     */
    windowRef: ɵDynamicWindowRefModel;
}
