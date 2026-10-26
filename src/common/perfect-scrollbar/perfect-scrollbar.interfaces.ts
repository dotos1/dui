/**
 * @fileoverview Module `src/common/perfect-scrollbar/perfect-scrollbar.interfaces.ts` providing perfect scrollbar interfaces definitions and implementation.
 * @zh 模块文件 `src/common/perfect-scrollbar/perfect-scrollbar.interfaces.ts`，提供perfect滚动条interfaces相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';

/**
 * Angular dependency-injection token `PERFECT_SCROLLBAR_CONFIG` for providing perfect scrollbar config.
 * @zh Angular 依赖注入令牌 `PERFECT_SCROLLBAR_CONFIG`，用于提供与注入PERFECT滚动条配置。
 */
export const PERFECT_SCROLLBAR_CONFIG = new InjectionToken('PERFECT_SCROLLBAR_CONFIG');

/**
 * Class `Geometry` encapsulating geometry data structures and logic in `src/common/perfect-scrollbar`.
 * @zh 类 `Geometry`，封装 `src/common/perfect-scrollbar` 中的几何体数据结构与处理逻辑。
 */
export class Geometry {
    /**
     * Property `x` (`number`) storing x.
     * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
     */
    public x: number;
    /**
     * Property `y` (`number`) storing y.
     * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
     */
    public y: number;

    /**
     * Property `w` (`number`) storing w.
     * @zh 属性 `w`（类型：`number`），用于存储或配置w。
     */
    public w: number;
    /**
     * Property `h` (`number`) storing h.
     * @zh 属性 `h`（类型：`number`），用于存储或配置h。
     */
    public h: number;

    /**
     * Creates an instance of `Geometry` and initializes its dependencies and internal state.
     * @zh 创建 `Geometry` 实例，并初始化其依赖项与内部状态。
     * @param x - Injected or initial x (`number`) / 注入或传入的X坐标（`number`）
     * @param y - Injected or initial y (`number`) / 注入或传入的Y坐标（`number`）
     * @param w - Injected or initial w (`number`) / 注入或传入的w（`number`）
     * @param h - Injected or initial h (`number`) / 注入或传入的h（`number`）
     */
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

/**
 * Class `Position` encapsulating position data structures and logic in `src/common/perfect-scrollbar`.
 * @zh 类 `Position`，封装 `src/common/perfect-scrollbar` 中的位置数据结构与处理逻辑。
 */
export class Position {
    /**
     * Property `x` (`number | 'start' | 'end'`) storing x.
     * @zh 属性 `x`（类型：`number | 'start' | 'end'`），用于存储或配置X坐标。
     */
    public x: number | 'start' | 'end';
    /**
     * Property `y` (`number | 'start' | 'end'`) storing y.
     * @zh 属性 `y`（类型：`number | 'start' | 'end'`），用于存储或配置Y坐标。
     */
    public y: number | 'start' | 'end';

    /**
     * Creates an instance of `Position` and initializes its dependencies and internal state.
     * @zh 创建 `Position` 实例，并初始化其依赖项与内部状态。
     * @param x - Injected or initial x (`number | 'start' | 'end'`) / 注入或传入的X坐标（`number | 'start' | 'end'`）
     * @param y - Injected or initial y (`number | 'start' | 'end'`) / 注入或传入的Y坐标（`number | 'start' | 'end'`）
     */
    constructor(x: number | 'start' | 'end', y: number | 'start' | 'end') {
        this.x = x;
        this.y = y;
    }
}

/**
 * Type alias `PerfectScrollbarEvent` representing perfect scrollbar event (`| 'psScrollY' | 'psScrollX' | 'psScrollUp' | 'psScrollDown' | 'psScrol...`).
 * @zh 类型别名 `PerfectScrollbarEvent`，表示Perfect滚动条事件（`| 'psScrollY' | 'psScrollX' | 'psScrollUp' | 'psScrollDown' | 'psScrol...`）。
 */
export type PerfectScrollbarEvent =
    | 'psScrollY'
    | 'psScrollX'
    | 'psScrollUp'
    | 'psScrollDown'
    | 'psScrollLeft'
    | 'psScrollRight'
    | 'psYReachEnd'
    | 'psYReachStart'
    | 'psXReachEnd'
    | 'psXReachStart';

/**
 * Constant/variable `PerfectScrollbarEvents` defining perfect scrollbar events in `src/common/perfect-scrollbar`.
 * @zh 常量/变量 `PerfectScrollbarEvents`，定义 `src/common/perfect-scrollbar` 中的Perfect滚动条事件集合。
 */
export const PerfectScrollbarEvents: PerfectScrollbarEvent[] = [
    'psScrollY',
    'psScrollX',

    'psScrollUp',
    'psScrollDown',
    'psScrollLeft',
    'psScrollRight',

    'psYReachEnd',
    'psYReachStart',
    'psXReachEnd',
    'psXReachStart',
];

/**
 * Interface `PerfectScrollbarConfigInterface` defining the contract and properties for perfect scrollbar config interface.
 * @zh 接口 `PerfectScrollbarConfigInterface`，定义Perfect滚动条配置Interface的数据结构契约与属性规范。
 */
export interface PerfectScrollbarConfigInterface {
    /**
     * Property `handlers` (`string[]`) storing handlers.
     * @zh 属性 `handlers`（类型：`string[]`），用于存储或配置处理器。
     */
    handlers?: string[];

    /**
     * Property `wheelSpeed` (`number`) storing wheel speed.
     * @zh 属性 `wheelSpeed`（类型：`number`），用于存储或配置滚轮速度。
     */
    wheelSpeed?: number;
    /**
     * Property `swipeEasing` (`boolean`) storing swipe easing.
     * @zh 属性 `swipeEasing`（类型：`boolean`），用于存储或配置swipeEasing。
     */
    swipeEasing?: boolean;

    /**
     * Property `suppressScrollX` (`boolean`) storing suppress scroll x.
     * @zh 属性 `suppressScrollX`（类型：`boolean`），用于存储或配置suppress滚动X坐标。
     */
    suppressScrollX?: boolean;
    /**
     * Property `suppressScrollY` (`boolean`) storing suppress scroll y.
     * @zh 属性 `suppressScrollY`（类型：`boolean`），用于存储或配置suppress滚动Y坐标。
     */
    suppressScrollY?: boolean;

    /**
     * Property `wheelPropagation` (`boolean`) storing wheel propagation.
     * @zh 属性 `wheelPropagation`（类型：`boolean`），用于存储或配置滚轮事件冒泡。
     */
    wheelPropagation?: boolean;
    /**
     * Property `useBothWheelAxes` (`boolean`) storing use both wheel axes.
     * @zh 属性 `useBothWheelAxes`（类型：`boolean`），用于存储或配置使用Both滚轮坐标轴集合。
     */
    useBothWheelAxes?: boolean;

    /**
     * Property `scrollingThreshold` (`number`) storing scrolling threshold.
     * @zh 属性 `scrollingThreshold`（类型：`number`），用于存储或配置滚动中Threshold。
     */
    scrollingThreshold?: number;

    /**
     * Property `minScrollbarLength` (`number`) storing min scrollbar length.
     * @zh 属性 `minScrollbarLength`（类型：`number`），用于存储或配置最小值滚动条长度。
     */
    minScrollbarLength?: number;
    /**
     * Property `maxScrollbarLength` (`number`) storing max scrollbar length.
     * @zh 属性 `maxScrollbarLength`（类型：`number`），用于存储或配置最大值滚动条长度。
     */
    maxScrollbarLength?: number;

    /**
     * Property `scrollXMarginOffset` (`number`) storing scroll x margin offset.
     * @zh 属性 `scrollXMarginOffset`（类型：`number`），用于存储或配置滚动X坐标外边距偏移量。
     */
    scrollXMarginOffset?: number;
    /**
     * Property `scrollYMarginOffset` (`number`) storing scroll y margin offset.
     * @zh 属性 `scrollYMarginOffset`（类型：`number`），用于存储或配置滚动Y坐标外边距偏移量。
     */
    scrollYMarginOffset?: number;
}

/**
 * Class `PerfectScrollbarConfig` encapsulating perfect scrollbar config data structures and logic in `src/common/perfect-scrollbar`.
 * @zh 类 `PerfectScrollbarConfig`，封装 `src/common/perfect-scrollbar` 中的Perfect滚动条配置数据结构与处理逻辑。
 */
export class PerfectScrollbarConfig implements PerfectScrollbarConfigInterface {
    /**
     * Property `handlers` (`string[]`) storing handlers.
     * @zh 属性 `handlers`（类型：`string[]`），用于存储或配置处理器。
     */
    public handlers?: string[];

    /**
     * Property `wheelSpeed` (`number`) storing wheel speed.
     * @zh 属性 `wheelSpeed`（类型：`number`），用于存储或配置滚轮速度。
     */
    public wheelSpeed?: number;
    /**
     * Property `swipeEasing` (`boolean`) storing swipe easing.
     * @zh 属性 `swipeEasing`（类型：`boolean`），用于存储或配置swipeEasing。
     */
    public swipeEasing?: boolean;

    /**
     * Property `suppressScrollX` (`boolean`) storing suppress scroll x.
     * @zh 属性 `suppressScrollX`（类型：`boolean`），用于存储或配置suppress滚动X坐标。
     */
    public suppressScrollX?: boolean;
    /**
     * Property `suppressScrollY` (`boolean`) storing suppress scroll y.
     * @zh 属性 `suppressScrollY`（类型：`boolean`），用于存储或配置suppress滚动Y坐标。
     */
    public suppressScrollY?: boolean;

    /**
     * Property `wheelPropagation` (`boolean`) storing wheel propagation.
     * @zh 属性 `wheelPropagation`（类型：`boolean`），用于存储或配置滚轮事件冒泡。
     */
    public wheelPropagation?: boolean;
    /**
     * Property `useBothWheelAxes` (`boolean`) storing use both wheel axes.
     * @zh 属性 `useBothWheelAxes`（类型：`boolean`），用于存储或配置使用Both滚轮坐标轴集合。
     */
    public useBothWheelAxes?: boolean;

    /**
     * Property `scrollingThreshold` (`number`) storing scrolling threshold.
     * @zh 属性 `scrollingThreshold`（类型：`number`），用于存储或配置滚动中Threshold。
     */
    public scrollingThreshold?: number;

    /**
     * Property `minScrollbarLength` (`number`) storing min scrollbar length.
     * @zh 属性 `minScrollbarLength`（类型：`number`），用于存储或配置最小值滚动条长度。
     */
    public minScrollbarLength?: number;
    /**
     * Property `maxScrollbarLength` (`number`) storing max scrollbar length.
     * @zh 属性 `maxScrollbarLength`（类型：`number`），用于存储或配置最大值滚动条长度。
     */
    public maxScrollbarLength?: number;

    /**
     * Property `scrollXMarginOffset` (`number`) storing scroll x margin offset.
     * @zh 属性 `scrollXMarginOffset`（类型：`number`），用于存储或配置滚动X坐标外边距偏移量。
     */
    public scrollXMarginOffset?: number;
    /**
     * Property `scrollYMarginOffset` (`number`) storing scroll y margin offset.
     * @zh 属性 `scrollYMarginOffset`（类型：`number`），用于存储或配置滚动Y坐标外边距偏移量。
     */
    public scrollYMarginOffset?: number;

    /**
     * Creates an instance of `PerfectScrollbarConfig` and initializes its dependencies and internal state.
     * @zh 创建 `PerfectScrollbarConfig` 实例，并初始化其依赖项与内部状态。
     * @param config - Injected or initial config (`PerfectScrollbarConfigInterface`) / 注入或传入的配置（`PerfectScrollbarConfigInterface`）
     */
    constructor(config: PerfectScrollbarConfigInterface = {}) {
        this.assign(config);
    }

    /**
     * Executes `assign` to handle assign.
     * @zh 执行 `assign`，用于赋值。
     * @param config - config parameter (`PerfectScrollbarConfigInterface`) / 配置参数（`PerfectScrollbarConfigInterface`）
     */
    public assign(config: PerfectScrollbarConfigInterface = {}) {
        for (const key in config) {
            this[key as keyof PerfectScrollbarConfig] = config[key as keyof PerfectScrollbarConfigInterface] as never;
        }
    }
}
