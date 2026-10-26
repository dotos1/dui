/**
 * @fileoverview Module `src/theme/theme/dui-datatable-theme.ts` providing dui datatable theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-datatable-theme.ts`，提供DUI数据表格主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';


/**
 * Executes `duiDataTableTheme` to handle dui data table theme.
 * @zh 执行 `duiDataTableTheme`，用于DUI数据表格主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiDataTableTheme(theme: Theme): Object {
  const background = theme.background;
  const foreground = theme.foreground;
  const foregroundText: string = matColor(theme.foreground, 'text');
  const secondaryForegroundColor = matColor(foreground, 'secondary-text');


  const primaryColor: string = matColor(theme.primary);
  const primaryBackground: string = matColor(theme.primary, 50);

  const hoverColor = matColor(background, 'hover');
  const backgroundColor = matColor(background, 'card');
  const selectedColor = matColor(theme.primary, 50);
  const borderColor = matColor(foreground, 'divider');
  const primaryDefaultContrast: string = matColor(theme.primary, 'default-contrast', 0.2);
  const panelBackgroundColor = matColor(background, 'card', 0.87);

  return {
    '.dui-datatable': {
      'background': backgroundColor,
    },
    '.dui-datatable .striped .datatable-row-odd': {
      'background': hoverColor
    },
    '.dui-datatable .single-selection .datatable-body-row .active,.dui-datatable .single-selection .datatable-body-row .active .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .multi-selection .datatable-body-row .active,.dui-datatable .multi-selection .datatable-body-row .active  .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .multi-click-selection .datatable-body-row .active,.dui-datatable .multi-click-selection .datatable-body-row .active .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    
    '.dui-datatable .single-selection .datatable-body-row .active:hover,.dui-datatable .single-selection .datatable-body-row .active:hover .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast,
    },
    '.dui-datatable .multi-selection .datatable-body-row .active:hover,.dui-datatable .multi-selection .datatable-body-row .active:hover  .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .multi-click-selection .datatable-body-row .active:hover,.dui-datatable .multi-click-selection .datatable-body-row .active:hover .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },

    '.dui-datatable .single-selection .datatable-body-row .active:focus,.dui-datatable .single-selection .datatable-body-row .active:focus .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .multi-selection .datatable-body-row .active:focus,.dui-datatable .multi-selection .datatable-body-row .active:focus  .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .multi-click-selection .datatable-body-row .active:focus,.dui-datatable .multi-click-selection .datatable-body-row .active:focus .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },

    '.dui-datatable:not(.cell-selection) .datatable-body-row:hover,.dui-datatable:not(.cell-selection) .datatable-body-row:hover .datatable-row-group': {
      'background-color': hoverColor,
      'color': primaryDefaultContrast
    },

    '.dui-datatable:not(.cell-selection) .datatable-body-row:focus,.dui-datatable:not(.cell-selection) .datatable-body-row:focus .datatable-row-group': {
      'background-color': hoverColor,
      'color': primaryDefaultContrast
    },

    '.dui-datatable .cell-selection .datatable-body-cell:hover,.dui-datatable .cell-selection .datatable-body-cell:hover .datatable-row-group': {
      'background-color': hoverColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .cell-selection .datatable-body-cell:focus,.dui-datatable .cell-selection .datatable-body-cell:focus .datatable-row-group': {
      'background-color': hoverColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .cell-selection .datatable-body-cell .active,.dui-datatable .cell-selection .datatable-body-cell .active .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .cell-selection .datatable-body-cell .active:hover,.dui-datatable .cell-selection .datatable-body-cell .active:hover .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    '.dui-datatable .cell-selection .datatable-body-cell .active:focus,.dui-datatable .cell-selection .datatable-body-cell .active:focus .datatable-row-group': {
      'background-color': selectedColor,
      'color': primaryDefaultContrast
    },
    
    '.dui-datatable .datatable-header,.datatable-body .datatable-row-left': {
      ' background-color': backgroundColor
    },
    '.dui-datatable .datatable-header,.datatable-body .datatable-row-right': {
      'background-color': backgroundColor
    },
    '.dui-datatable .datatable-header': {
      'border-bottom': '1px solid ' + borderColor
    },
    '.dui-datatable .datatable-header .datatable-header-cell': {
      'color': secondaryForegroundColor
    },
    '.dui-datatable .datatable-header .datatable-header-cell .draggable::after': {
      'background': borderColor
    },
    '.dui-datatable .datatable-header .resize-handle': {
      'border-right': 'solid 1px' + borderColor
    },
    '.dui-datatable .datatable-body .datatable-row-detail': {
      'background': panelBackgroundColor
    },
    '.dui-datatable .datatable-body .datatable-group-header': {
      'background': panelBackgroundColor,
      'border-bottom': "solid 1px " + borderColor,
      'border-top': "solid 1px " + borderColor,
    },
    '.dui-datatable .datatable-body .datatable-body-row': {
      'border-bottom': '1px solid ' + borderColor
    },
    '.dui-datatable .datatable-body .datatable-body-row .datatable-body-cell': {
      'color': foregroundText
    },
    '.dui-datatable .datatable-body .datatable-body-row  .datatable-body-group-cell': {
      'color': foregroundText
    },
    '.dui-datatable .progress-linear .container': {
      'background-color': primaryBackground
    },
    '.dui-datatable .progress-linear .container .bar': {
      'background-color': primaryColor
    },
    '.dui-datatable .datatable-footer': {
      "border-top": "1px solid "+borderColor,
     " color": secondaryForegroundColor
    },
    '.dui-datatable .datatable-summary-row  .datatable-body-row': {
      "background-color": panelBackgroundColor
    },
    '.dui-datatable .datatable-summary-row  .datatable-body-row:hover': {
      "background-color":panelBackgroundColor
    }
  };
}
