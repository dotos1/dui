/**
 * @fileoverview Module `src/theme/theme/dui-tree-theme.ts` providing dui tree theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-tree-theme.ts`，提供DUI树形控件主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor} from '../mat-color';
import { matFontSize,  matFontFamily} from '../utils/index';

/**
 * Executes `duiTreeTheme` to handle dui tree theme.
 * @zh 执行 `duiTreeTheme`，用于DUI树形控件主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiTreeTheme(theme: Theme): Object {
  const foregroundText: string = matColor(theme.foreground, 'secondary-text');
  const themeType=theme.type;

  let config= theme.typography;
  const type: string = config['type'];
  let px5: string = type === 'loose' ? '5px' : type === 'normal' ? '4px' : '4px';
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px20: string = type === 'loose' ? '20px' : type === 'normal' ? '18px' : '15px';
  let px24: string = type === 'loose' ? '24px' : type === 'normal' ? '21px' : '18px';
  let px40: string = type === 'loose' ? '40px' : type === 'normal' ? '35px' : '30px';
  let px100: string = type === 'loose' ? '100px' : type === 'normal' ? '88px' : '75px';


  return {
    ".node-wrapper": {
      "-webkit-tap-highlight-color": foregroundText,
      "color": foregroundText,
      "height": px40 + " !important",
    },
    ".tree-node": {
      "-webkit-tap-highlight-color": foregroundText,
      "color": foregroundText,
      "border": px10 + " !important",
      "line-height": px16 + " !important"
    },
    '.node-wrapper-active,.node-wrapper.node-wrapper-active:hover,.node-wrapper-node-wrapper-focused': {
      "color": themeType=='light'?matColor(theme.primary):matColor(theme.accent) + " !important",
      'background':matColor(theme.background, 'selected-button'),
    },
    '.node-wrapper-focused': {
      "color":themeType=='light'?matColor(theme.primary):matColor(theme.accent),
      'background': matColor(theme.background, 'selected-button'),
    },
    '.node-wrapper-focused .mat-icon-no-color': {
      "color": themeType=='light'?matColor(theme.primary):matColor(theme.accent)
    },
    '.node-drop-slot.is-dragging-over': {
      "color":themeType=='light'?matColor(theme.primary):matColor(theme.accent),
      'background': matColor(theme.background, 'selected-button'),
      "height": px40 + " !important",
    },
    ".node-content-drag-wrapper":{
      "color":themeType=='light'?matColor(theme.primary):matColor(theme.accent),
      'background': matColor(theme.background, 'selected-button'),
      
    },
    "tree-viewport": {
      "font-family": matFontFamily(config),
      "font-size": matFontSize(config, 'body-2')
    },
    "tree-root .angular-tree-component-rtl .tree-children": {
      "padding-right": px20 + " !important",
    },


    ".toggle-children-wrapper": {
      "height": px40 + " !important",
      "width": px24 + " !important"
    },
    ".toggle-children": {
      "height": px40 + " !important",
      "width": px24 + " !important"
    },
    ".toggle-children-placeholder": {
      "height": px40 + " !important",
      "width": px24 + " !important"
    },
    ".node-content-title": {
      "padding-left": px10 + " !important"
    },
    ".empty-tree-drop-slot .node-drop-slot": {
      "height": px40 + " !important",
      "min-width": px100 + " !important"
    },
    "tree-node-checkbox": {
      "padding": "1px  !important"
    }
  };
}

