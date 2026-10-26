/**
 * @fileoverview Module `src/theme/utils/elevation.ts` providing elevation definitions and implementation.
 * @zh 模块文件 `src/theme/utils/elevation.ts`，提供层级阴影相关的定义与实现。
 */



import { matFastOutSlowInTimingFunction } from './variables';

/**
 * Executes `_getUmbraMap` to handle get umbra map.
 * @zh 执行 `_getUmbraMap`，用于获取Umbra映射表。
 * @param color - color parameter (`any`) / 颜色参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function _getUmbraMap(color, opacity) {
  let o=opacity* 0.2;
  return ({
    0: '0px 0px 0px 0px rgba('+color+' /'+o+')',
    1: '0px 2px 1px -1px rgba('+color+' /'+o+')',
    2: '0px 3px 1px -2px rgba('+color+' /'+o+')',
    3: '0px 3px 3px -2px rgba('+color+' /'+o+')',
    4: '0px 2px 4px -1px rgba('+color+' /'+o+')',
    5: '0px 3px 5px -1px rgba('+color+' /'+o+')',
    6: '0px 3px 5px -1px rgba('+color+' /'+o+')',
    7: '0px 4px 5px -2px rgba('+color+' /'+o+')',
    8: '0px 5px 5px -3px rgba('+color+' /'+o+')',
    9: '0px 5px 6px -3px rgba('+color+' /'+o+')',
    10: '0px 6px 6px -3px rgba('+color+' /'+o+')',
    11: '0px 6px 7px -4px rgba('+color+' /'+o+')',
    12: '0px 7px 8px -4px rgba('+color+' /'+o+')',
    13: '0px 7px 8px -4px rgba('+color+' /'+o+')',
    14: '0px 7px 9px -4px rgba('+color+' /'+o+')',
    15: '0px 8px 9px -5px rgba('+color+' /'+o+')',
    16: '0px 8px 10px -5px rgba('+color+' /'+o+')',
    17: '0px 8px 11px -5px rgba('+color+' /'+o+')',
    18: '0px 9px 11px -5px rgba('+color+' /'+o+')',
    19: '0px 9px 12px -6px rgba('+color+' /'+o+')',
    20: '0px 10px 13px -6px rgba('+color+' /'+o+')',
    21: '0px 10px 13px -6px rgba('+color+' /'+o+')',
    22: '0px 10px 14px -6px rgba('+color+' /'+o+')',
    23: '0px 11px 14px -7px rgba('+color+' /'+o+')',
    24: '0px 11px 15px -7px rgba('+color+' /'+o+')'
  }
  );
}

/**
 * Executes `_getPenumbraMap` to handle get penumbra map.
 * @zh 执行 `_getPenumbraMap`，用于获取Penumbra映射表。
 * @param color - color parameter (`any`) / 颜色参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function _getPenumbraMap(color, opacity) {
  let o=opacity* 0.14;
  return {
    0: '0px 0px 0px 0px rgba('+color+' /'+o+')',
    1: '0px 1px 1px 0px rgba('+color+' /'+o+')',
    2: '0px 2px 2px 0px rgba('+color+' /'+o+')',
    3: '0px 3px 4px 0px rgba('+color+' /'+o+')',
    4: '0px 4px 5px 0px rgba('+color+' /'+o+')',
    5: '0px 5px 8px 0px rgba('+color+' /'+o+')',
    6: '0px 6px 10px 0px rgba('+color+' /'+o+')',
    7: '0px 7px 10px 1px rgba('+color+' /'+o+')',
    8: '0px 8px 10px 1px rgba('+color+' /'+o+')',
    9: '0px 9px 12px 1px rgba('+color+' /'+o+')',
    10: '0px 10px 14px 1px rgba('+color+' /'+o+')',
    11: '0px 11px 15px 1px rgba('+color+' /'+o+')',
    12: '0px 12px 17px 2px rgba('+color+' /'+o+')',
    13: '0px 13px 19px 2px rgba('+color+' /'+o+')',
    14: '0px 14px 21px 2px rgba('+color+' /'+o+')',
    15: '0px 15px 22px 2px rgba('+color+' /'+o+')',
    16: '0px 16px 24px 2px rgba('+color+' /'+o+')',
    17: '0px 17px 26px 2px rgba('+color+' /'+o+')',
    18: '0px 18px 28px 2px rgba('+color+' /'+o+')',
    19: '0px 19px 29px 2px rgba('+color+' /'+o+')',
    20: '0px 20px 31px 3px rgba('+color+' /'+o+')',
    21: '0px 21px 33px 3px rgba('+color+' /'+o+')',
    22: '0px 22px 35px 3px rgba('+color+' /'+o+')',
    23: '0px 23px 36px 3px rgba('+color+' /'+o+')',
    24: '0px 24px 38px 3px rgba('+color+' /'+o+')'
  }
}

/**
 * Executes `_getAmbientMap` to handle get ambient map.
 * @zh 执行 `_getAmbientMap`，用于获取Ambient映射表。
 * @param color - color parameter (`any`) / 颜色参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function _getAmbientMap(color, opacity) {
  let o=opacity* 0.12;
  return {
    0: '0px 0px 0px 0px rgba('+color+' /'+o+')',
    1: '0px 1px 3px 0px rgba('+color+' /'+o+')',
    2: '0px 1px 5px 0px rgba('+color+' /'+o+')',
    3: '0px 1px 8px 0px rgba('+color+' /'+o+')',
    4: '0px 1px 10px 0px rgba('+color+' /'+o+')',
    5: '0px 1px 14px 0px rgba('+color+' /'+o+')',
    6: '0px 1px 18px 0px rgba('+color+' /'+o+')',
    7: '0px 2px 16px 1px rgba('+color+' /'+o+')',
    8: '0px 3px 14px 2px rgba('+color+' /'+o+')',
    9: '0px 3px 16px 2px rgba('+color+' /'+o+')',
    10: '0px 4px 18px 3px rgba('+color+' /'+o+')',
    11: '0px 4px 20px 3px rgba('+color+' /'+o+')',
    12: '0px 5px 22px 4px rgba('+color+' /'+o+')',
    13: '0px 5px 24px 4px rgba('+color+' /'+o+')',
    14: '0px 5px 26px 4px rgba('+color+' /'+o+')',
    15: '0px 6px 28px 5px rgba('+color+' /'+o+')',
    16: '0px 6px 30px 5px rgba('+color+' /'+o+')',
    17: '0px 6px 32px 5px rgba('+color+' /'+o+')',
    18: '0px 7px 34px 6px rgba('+color+' /'+o+')',
    19: '0px 7px 36px 6px rgba('+color+' /'+o+')',
    20: '0px 8px 38px 7px rgba('+color+' /'+o+')',
    21: '0px 8px 40px 7px rgba('+color+' /'+o+')',
    22: '0px 8px 42px 7px rgba('+color+' /'+o+')',
    23: '0px 9px 44px 8px rgba('+color+' /'+o+')',
    24: '0px 9px 46px 8px rgba('+color+' /'+o+')'
  }
}

// The default duration value for elevation transitions.
/**
 * Constant/variable `matElevationTransitionDuration` defining mat elevation transition duration in `src/theme/utils`.
 * @zh 常量/变量 `matElevationTransitionDuration`，定义 `src/theme/utils` 中的Material层级阴影过渡动画持续时间。
 */
export const matElevationTransitionDuration= '280ms !default';

// The default easing value for elevation transitions.
/**
 * Constant/variable `matElevationTransitionTimingFunction` defining mat elevation transition timing function in `src/theme/utils`.
 * @zh 常量/变量 `matElevationTransitionTimingFunction`，定义 `src/theme/utils` 中的Material层级阴影过渡动画时间函数。
 */
export const matElevationTransitionTimingFunction= matFastOutSlowInTimingFunction;

// The default color for elevation shadows.
/**
 * Constant/variable `matElevationColor` defining mat elevation color in `src/theme/utils`.
 * @zh 常量/变量 `matElevationColor`，定义 `src/theme/utils` 中的Material层级阴影颜色。
 */
export const matElevationColor='#000000';

// The default opacity scaling value for elevation shadows.
/**
 * Constant/variable `matElevationOpacity` defining mat elevation opacity in `src/theme/utils`.
 * @zh 常量/变量 `matElevationOpacity`，定义 `src/theme/utils` 中的Material层级阴影不透明度。
 */
export const matElevationOpacity=' 1 !default';

// Prefix for elevation-related selectors.
/**
 * Constant/variable `_matElevationPrefix` defining mat elevation prefix in `src/theme/utils`.
 * @zh 常量/变量 `_matElevationPrefix`，定义 `src/theme/utils` 中的Material层级阴影前缀。
 */
export const _matElevationPrefix= 'mat-elevation-z';

// Applies the correct css rules to an element to give it the elevation specified by $zValue.
// The $zValue must be between 0 and 24.
/**
 * Executes `matElevation` to handle mat elevation.
 * @zh 执行 `matElevation`，用于Material层级阴影。
 * @param zValue - z value parameter (`any`) / Z坐标值参数（`any`）
 * @param color - color parameter (`any`) / 颜色参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function matElevation(zValue, color, opacity) {
  return {
    'box-shadow': _getUmbraMap(color, opacity)[zValue]+','+_getPenumbraMap(color, opacity)[zValue]+','+_getAmbientMap(color, opacity)[zValue]
  }
}

/**
 * Executes `matThemeElevation` to handle mat theme elevation.
 * @zh 执行 `matThemeElevation`，用于Material主题层级阴影。
 * @param zValue - z value parameter (`any`) / Z坐标值参数（`any`）
 * @param theme - theme parameter (`any`) / 主题参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function matThemeElevation(zValue, theme, opacity) {
  //  let elevationColor=matColor(theme.foreground, 'elevation');
  //  let elevationColorOrDefault= elevationColor == null? matElevationColor: elevationColor;
  let elevationColorOrDefault= "0 0 0" ;
  return  matElevation(zValue,elevationColorOrDefault, opacity);
}


/**
 * Executes `matOverridableElevation` to handle mat overridable elevation.
 * @zh 执行 `matOverridableElevation`，用于MaterialOverridable层级阴影。
 * @param zValue - z value parameter (`any`) / Z坐标值参数（`any`）
 * @param color - color parameter (`any`) / 颜色参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function matOverridableElevation(zValue, color, opacity) {
  if(!opacity) opacity=matElevationOpacity;
  return {
    "&:not([class*='mat-elevation-z'])": {
     ...matElevation(zValue, color, opacity)
    }
  }
}

/**
 * Executes `matThemeOverridableElevation` to handle mat theme overridable elevation.
 * @zh 执行 `matThemeOverridableElevation`，用于Material主题Overridable层级阴影。
 * @param zValue - z value parameter (`any`) / Z坐标值参数（`any`）
 * @param theme - theme parameter (`any`) / 主题参数（`any`）
 * @param opacity - opacity parameter (`any`) / 不透明度参数（`any`）
 */
export function matThemeOverridableElevation(zValue, theme, opacity) {
  // let elevationColor=matColor(theme.foreground, 'elevation');
  // let elevationColorOrDefault= elevationColor == null? matElevationColor: elevationColor;
  let elevationColorOrDefault= "0 0 0" ;
  return  matOverridableElevation(zValue,elevationColorOrDefault, opacity);
}


/**
 * Executes `matElevationTransitionPropertyValue` to handle mat elevation transition property value.
 * @zh 执行 `matElevationTransitionPropertyValue`，用于Material层级阴影过渡动画属性值。
 * @param duration - duration parameter (`any`) / 持续时间参数（`any`）
 * @param easing - easing parameter (`any`) / easing参数（`any`）
 */
export function matElevationTransitionPropertyValue(duration? , easing?) {
  if(!duration) duration=matElevationTransitionDuration;
  if(!easing) easing=matElevationTransitionTimingFunction;
  return 'box-shadow '+duration+'} '+easing+'}';
}


/**
 * Executes `matElevationTransition` to handle mat elevation transition.
 * @zh 执行 `matElevationTransition`，用于Material层级阴影过渡动画。
 * @param duration - duration parameter (`any`) / 持续时间参数（`any`）
 * @param easing - easing parameter (`any`) / easing参数（`any`）
 */
export function matElevationTransition( duration?,easing?) {
  if(!duration) duration=matElevationTransitionDuration;
  if(!easing) easing=matElevationTransitionTimingFunction;
  return{
    'transition': matElevationTransitionPropertyValue(duration, easing)
  }
}
