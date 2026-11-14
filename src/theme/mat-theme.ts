/**
 * @fileoverview Module `src/theme/mat-theme.ts` providing mat theme definitions and implementation.
 * @zh 模块文件 `src/theme/mat-theme.ts`，提供Material主题相关的定义与实现。
 */

import { duiDragselectTheme } from './theme/drag-to-select-theme';
import { duiIconPickerTheme } from './theme/icon-picker.theme';
import { duiQueryBuilderTheme } from './theme/query-builder.theme';
import { matEvaluation } from './core/mat-elevation';
import { Theme } from './interfaces';
import { duiCardViewTheme } from './theme/card-view.theme';
import { duiColorPickerTheme } from './theme/dui-color-picker-theme';
import { duiFormWrapperTheme } from './theme/dui-form-wrapper-theme';
import { duiGridsterTheme } from './theme/dui-gridster-theme';
import { duiHttpLoaderTheme } from './theme/dui-httploader-theme';
import { duiIconTheme } from './theme/dui-icon-theme';
import { duiKeyBoardTheme } from './theme/dui-keyboard-theme';
import { duiLayoutTheme } from './theme/dui-layout';
import { duiLineStyleTheme } from './theme/dui-linestyle-theme';
import { duiLinkPreviewTheme } from './theme/dui-link-preview.theme';
import { duiLoadingTheme } from './theme/dui-loading-theme';
import { duiMenubarTheme } from './theme/dui-menubar-theme';
import { duiPanelTheme } from './theme/dui-panel';
import { duiPopupTheme } from './theme/dui-popup-theme';
import { duiToolbarTheme } from './theme/dui-toolbar-theme';
import { duiTopbarTheme } from './theme/dui-topbar-theme';
import { duiTriggerTheme } from './theme/dui-trigger-theme';
import { duiEditorTheme } from './theme/dui-editor.theme';
import {
  CommandPaletteTheme,
  duiExpansionPanelTheme,
  duiDateFieldTheme,
  matSpeedDialTheme,
  duiWindowsTheme,
  duiTreeTheme,
  duiPagingTheme,
  duiNotificationTheme,
  duiMessageTheme,
  duiChipsTheme,
  duiMenuTheme,
  matBottomSheetTheme,
  duiDataTableTheme,
  duiClipboardTheme,
  dockLayoutTheme,
  duiMarkdownTheme,
  duiCardTheme,
  duiDialogTheme,
  duiFileFieldTheme,
  duiImageFieldTheme,
  duiSelectTheme,
} from './theme/index';
import { duiInfoDrawerTheme } from './theme/info-drawer.theme';
import { xTermTheme } from './theme/xterm-theme';
import { monacoEditorTheme } from './theme/monaco-editor-theme';
import { duiDynamicComponentTheme } from './theme/dynamic.theme';
import { duiToggleSelectTheme } from './theme/toggle-select-theme';
import { duiScrollbarTheme } from './theme/dui-scrollbar-theme';

/**
 * Executes `materialTheme` to handle DUI custom component theme styles.
 * Official Angular Material component styles are provided by M3 `--mat-sys-*` CSS variables.
 * @zh 执行 `materialTheme`，生成 DUI 自研组件主题样式集合（官方 Material 组件样式已由 M3 `--mat-sys-*` 系统变量驱动）。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Record<string, unknown>` / 类型为 `Record<string, unknown>` 的返回值
 */
export function materialTheme(theme: Theme): Record<string, unknown> {
  return {
    ...(matEvaluation(theme) as Record<string, unknown>),
    ...(CommandPaletteTheme(theme) as Record<string, unknown>),
    ...(matSpeedDialTheme(theme) as Record<string, unknown>),
    ...(duiCardTheme(theme) as Record<string, unknown>),
    ...(duiExpansionPanelTheme(theme) as Record<string, unknown>),
    ...(duiDateFieldTheme(theme) as Record<string, unknown>),
    ...(duiToolbarTheme(theme) as Record<string, unknown>),
    ...(duiIconTheme(theme) as Record<string, unknown>),
    ...(duiMenubarTheme(theme) as Record<string, unknown>),
    ...(duiWindowsTheme(theme) as Record<string, unknown>),
    ...(duiTreeTheme(theme) as Record<string, unknown>),
    ...(duiPopupTheme(theme) as Record<string, unknown>),
    ...(duiSelectTheme(theme) as Record<string, unknown>),
    ...(duiScrollbarTheme(theme) as Record<string, unknown>),
    ...(duiPagingTheme(theme) as Record<string, unknown>),
    ...(xTermTheme(theme) as Record<string, unknown>),
    ...(duiFileFieldTheme(theme) as Record<string, unknown>),
    ...(duiImageFieldTheme(theme) as Record<string, unknown>),
    ...(duiDialogTheme(theme) as Record<string, unknown>),
    ...(duiMarkdownTheme(theme) as Record<string, unknown>),
    ...(monacoEditorTheme(theme) as Record<string, unknown>),
    ...(duiFormWrapperTheme(theme) as Record<string, unknown>),
    ...(duiNotificationTheme(theme) as Record<string, unknown>),
    ...(duiMessageTheme(theme) as Record<string, unknown>),
    ...(duiGridsterTheme(theme) as Record<string, unknown>),
    ...(duiChipsTheme(theme) as Record<string, unknown>),
    ...(duiTopbarTheme(theme) as Record<string, unknown>),
    ...(matBottomSheetTheme(theme) as Record<string, unknown>),
    ...(duiDataTableTheme(theme) as Record<string, unknown>),
    ...(duiIconPickerTheme(theme) as Record<string, unknown>),
    ...(dockLayoutTheme(theme) as Record<string, unknown>),
    ...(duiColorPickerTheme(theme) as Record<string, unknown>),
    ...(duiClipboardTheme(theme) as Record<string, unknown>),
    ...(duiTriggerTheme(theme) as Record<string, unknown>),
    ...(duiLineStyleTheme(theme) as Record<string, unknown>),
    ...(duiLinkPreviewTheme(theme) as Record<string, unknown>),
    ...(duiKeyBoardTheme(theme) as Record<string, unknown>),
    ...(duiLoadingTheme(theme) as Record<string, unknown>),
    ...(duiHttpLoaderTheme(theme) as Record<string, unknown>),
    ...(duiMenuTheme(theme) as Record<string, unknown>),
    ...(duiPanelTheme(theme) as Record<string, unknown>),
    ...(duiDynamicComponentTheme(theme) as Record<string, unknown>),
    ...(duiLayoutTheme(theme) as Record<string, unknown>),
    ...(duiCardViewTheme(theme) as Record<string, unknown>),
    ...(duiInfoDrawerTheme(theme) as Record<string, unknown>),
    ...(duiDragselectTheme(theme) as Record<string, unknown>),
    ...(duiQueryBuilderTheme(theme) as Record<string, unknown>),
    ...(duiToggleSelectTheme(theme) as Record<string, unknown>),
    ...(duiEditorTheme(theme) as Record<string, unknown>),
  };
}
