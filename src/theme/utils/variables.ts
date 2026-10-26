/**
 * @fileoverview Module `src/theme/utils/variables.ts` providing variables definitions and implementation.
 * @zh 模块文件 `src/theme/utils/variables.ts`，提供variables相关的定义与实现。
 */


/**
 * Constant/variable `matXsmall` defining mat xsmall in `src/theme/utils`.
 * @zh 常量/变量 `matXsmall`，定义 `src/theme/utils` 中的MaterialXsmall。
 */
export const matXsmall= 'max-width: 599px';
/**
 * Constant/variable `matSmall` defining mat small in `src/theme/utils`.
 * @zh 常量/变量 `matSmall`，定义 `src/theme/utils` 中的MaterialSmall。
 */
export const matSmall= 'max-width: 959px';

/**
 * Constant/variable `zIndexFab` defining z index fab in `src/theme/utils`.
 * @zh 常量/变量 `zIndexFab`，定义 `src/theme/utils` 中的Z坐标索引Fab。
 */
export const  zIndexFab= '20 !default';
/**
 * Constant/variable `zIndexDrawer` defining z index drawer in `src/theme/utils`.
 * @zh 常量/变量 `zIndexDrawer`，定义 `src/theme/utils` 中的Z坐标索引抽屉面板。
 */
export const  zIndexDrawer= "100 !default";

// Global constants
/**
 * Constant/variable `pi` defining pi in `src/theme/utils`.
 * @zh 常量/变量 `pi`，定义 `src/theme/utils` 中的pi。
 */
export const  pi= 3.14159265;

// Padding between input toggles and their labels
/**
 * Constant/variable `matTogglePadding` defining mat toggle padding in `src/theme/utils`.
 * @zh 常量/变量 `matTogglePadding`，定义 `src/theme/utils` 中的Material开关内边距。
 */
export const  matTogglePadding=' 8px !default';
// Width and height of input toggles
/**
 * Constant/variable `matToggleSize` defining mat toggle size in `src/theme/utils`.
 * @zh 常量/变量 `matToggleSize`，定义 `src/theme/utils` 中的Material开关尺寸。
 */
export const  matToggleSize=' 20px !default';

// Easing Curves
// TODO(jelbourn): all of these need to be revisited

// The default animation curves used by material design.
/**
 * Constant/variable `matLinearOutSlowInTimingFunction` defining mat linear out slow in timing function in `src/theme/utils`.
 * @zh 常量/变量 `matLinearOutSlowInTimingFunction`，定义 `src/theme/utils` 中的MaterialLinear输出Slow在时间函数。
 */
export const  matLinearOutSlowInTimingFunction= 'cubic-bezier(0, 0, 0.2, 0.1) !default';
/**
 * Constant/variable `matFastOutSlowInTimingFunction` defining mat fast out slow in timing function in `src/theme/utils`.
 * @zh 常量/变量 `matFastOutSlowInTimingFunction`，定义 `src/theme/utils` 中的MaterialFast输出Slow在时间函数。
 */
export const  matFastOutSlowInTimingFunction= 'cubic-bezier(0.4, 0, 0.2, 1) !default';
/**
 * Constant/variable `matFastOutLinearInTimingFunction` defining mat fast out linear in timing function in `src/theme/utils`.
 * @zh 常量/变量 `matFastOutLinearInTimingFunction`，定义 `src/theme/utils` 中的MaterialFast输出Linear在时间函数。
 */
export const  matFastOutLinearInTimingFunction= 'cubic-bezier(0.4, 0, 1, 1) !default';

/**
 * Constant/variable `easeInOutCurveFunction` defining ease in out curve function in `src/theme/utils`.
 * @zh 常量/变量 `easeInOutCurveFunction`，定义 `src/theme/utils` 中的ease在输出曲线函数。
 */
export const  easeInOutCurveFunction= 'cubic-bezier(0.35, 0, 0.25, 1) !default';

/**
 * Constant/variable `swiftEaseOutDuration` defining swift ease out duration in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseOutDuration`，定义 `src/theme/utils` 中的swiftEase输出持续时间。
 */
export const  swiftEaseOutDuration= '400ms !default';
/**
 * Constant/variable `swiftEaseOutTimingFunction` defining swift ease out timing function in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseOutTimingFunction`，定义 `src/theme/utils` 中的swiftEase输出时间函数。
 */
export const  swiftEaseOutTimingFunction= 'cubic-bezier(0.25, 0.8, 0.25, 1) !default';
/**
 * Constant/variable `swiftEaseOut` defining swift ease out in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseOut`，定义 `src/theme/utils` 中的swiftEase输出。
 */
export const  swiftEaseOut= 'all '+ swiftEaseOutDuration +' '+ swiftEaseOutTimingFunction+' !default';

/**
 * Constant/variable `swiftEaseInDuration` defining swift ease in duration in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseInDuration`，定义 `src/theme/utils` 中的swiftEase在持续时间。
 */
export const  swiftEaseInDuration= '300ms !default';
/**
 * Constant/variable `swiftEaseInTimingFunction` defining swift ease in timing function in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseInTimingFunction`，定义 `src/theme/utils` 中的swiftEase在时间函数。
 */
export const  swiftEaseInTimingFunction= 'cubic-bezier(0.55, 0, 0.55, 0.2) !default';
/**
 * Constant/variable `swiftEaseIn` defining swift ease in in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseIn`，定义 `src/theme/utils` 中的swiftEase在。
 */
export const  swiftEaseIn=' all '+swiftEaseInDuration+' '+ swiftEaseInTimingFunction+' !default';

/**
 * Constant/variable `swiftEaseInOutDuration` defining swift ease in out duration in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseInOutDuration`，定义 `src/theme/utils` 中的swiftEase在输出持续时间。
 */
export const swiftEaseInOutDuration=' 500ms !default';
/**
 * Constant/variable `swiftEaseInOutTimingFunction` defining swift ease in out timing function in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseInOutTimingFunction`，定义 `src/theme/utils` 中的swiftEase在输出时间函数。
 */
export const swiftEaseInOutTimingFunction= easeInOutCurveFunction+' !default';
/**
 * Constant/variable `swiftEaseInOut` defining swift ease in out in `src/theme/utils`.
 * @zh 常量/变量 `swiftEaseInOut`，定义 `src/theme/utils` 中的swiftEase在输出。
 */
export const swiftEaseInOut=' all '+swiftEaseInOutDuration+' '+ swiftEaseInOutTimingFunction+' !default';

/**
 * Constant/variable `swiftLinearDuration` defining swift linear duration in `src/theme/utils`.
 * @zh 常量/变量 `swiftLinearDuration`，定义 `src/theme/utils` 中的swiftLinear持续时间。
 */
export const swiftLinearDuration=' 80ms !default';
/**
 * Constant/variable `swiftLinearTimingFunction` defining swift linear timing function in `src/theme/utils`.
 * @zh 常量/变量 `swiftLinearTimingFunction`，定义 `src/theme/utils` 中的swiftLinear时间函数。
 */
export const swiftLinearTimingFunction=' linear !default';
/**
 * Constant/variable `swiftLinear` defining swift linear in `src/theme/utils`.
 * @zh 常量/变量 `swiftLinear`，定义 `src/theme/utils` 中的swiftLinear。
 */
export const swiftLinear=' all '+swiftLinearDuration+' '+ swiftLinearTimingFunction+' !default';
