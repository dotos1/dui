/**
 * @fileoverview Module `src/theme/theme/dui-dialog-theme.ts` providing dui dialog theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-dialog-theme.ts`，提供DUI对话框主题相关的定义与实现。
 */


import { Theme } from '../interfaces';

/**
 * Executes `duiDialogTheme` to handle dui dialog theme.
 * @zh 执行 `duiDialogTheme`，用于DUI对话框主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiDialogTheme(theme: Theme): Object {
  const type: string = theme.typography['type'];

  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px20: string = type === 'loose' ? '20px' : type === 'normal' ? '18px' : '15px';
  let px64: string = type === 'loose' ? '64px' : type === 'normal' ? '56px' : '48px';

  return {
    '.dui-dialog-title': {
      'margin-bottom': px20 + " !important",
    },
    '.dui-dialog-content': {
      'margin-bottom': px16 + " !important"
    },
    /*
     * 动作条的留白必须用**外边距**，不能用 top/left。
     *
     * Material 给 `.mat-mdc-dialog-actions` 设了 `position: relative`，
     * 于是这里的 top/left 生效为相对定位偏移 —— 它**不占布局空间**：
     * 对话框容器按未偏移的位置算高度，元素却实际下移 12px 渲染。
     * 容器因此永远比内容矮 12px，surface 上就冒出纵向滚动条；
     * 纵条占 15px 宽又导致横向溢出、再冒出横条，两条互相维持。
     *
     * 症状就是"所有 openConfirm/openAlert 一打开就带两条滚动条、不自适应"。
     * 换成 margin 之后偏移量会被计入容器高度，滚动条自然消失。
     */
    '.dui-dialog-actions': {
      'margin-top': px16 + " !important",
      'margin-left': px16 + " !important",
      " [dir='rtl'] &": {
        'margin-right': px16 + " !important",
        'margin-left': '0 !important'
      },
      ' button': {
        'margin-left': px8 + " !important",
        "[dir='rtl'] &": {
          'margin-right': px8 + " !important",
        },
        'padding-left': px8 + " !important",
        'padding-right': px8 + " !important",
        'min-width': px64 + " !important"
      }
    },
  };
}





