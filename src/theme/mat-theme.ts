/**
 * @fileoverview Module `src/theme/mat-theme.ts` providing full M2 Material + DUI component theme aggregation.
 * @zh 模块文件 `src/theme/mat-theme.ts`，聚合并生成完整的 Material 22 M2 主题令牌、S-5 结构样式及 DUI 自研组件主题样式集合。
 */

import { matEvaluation } from './core/mat-elevation';
import { Theme } from './interfaces';
import { duiCardViewTheme } from './theme/card-view.theme';
import { duiDragselectTheme } from './theme/drag-to-select-theme';
import { duiColorPickerTheme } from './theme/dui-color-picker-theme';
import { duiEditorTheme } from './theme/dui-editor.theme';
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
import { duiScrollbarTheme } from './theme/dui-scrollbar-theme';
import { duiToolbarTheme } from './theme/dui-toolbar-theme';
import { duiTopbarTheme } from './theme/dui-topbar-theme';
import { duiTriggerTheme } from './theme/dui-trigger-theme';
import { duiDynamicComponentTheme } from './theme/dynamic.theme';
import { duiIconPickerTheme } from './theme/icon-picker.theme';
import {
  CommandPaletteTheme,
  dockLayoutTheme,
  duiCardTheme,
  duiChipsTheme,
  duiClipboardTheme,
  duiDataTableTheme,
  duiDateFieldTheme,
  duiDialogTheme,
  duiExpansionPanelTheme,
  duiFileFieldTheme,
  duiImageFieldTheme,
  duiMarkdownTheme,
  duiMenuTheme,
  duiMessageTheme,
  duiNotificationTheme,
  duiPagingTheme,
  duiSelectTheme,
  duiTreeTheme,
  duiWindowsTheme,
  matBottomSheetTheme,
  matButtonTheme,
  matCardTheme,
  matCoreTheme,
  matDialogTheme,
  matExpansionPanelTheme,
  matFabTheme,
  matFormFieldTheme,
  matIconButtonTheme,
  matIconTheme,
  matInputTheme,
  matListTheme,
  matMenuTheme,
  matSpeedDialTheme,
  mergeThemeStyleMaps,
  resolveM2BlocksForTheme,
} from './theme/index';
import { duiInfoDrawerTheme } from './theme/info-drawer.theme';
import { monacoEditorTheme } from './theme/monaco-editor-theme';
import { duiQueryBuilderTheme } from './theme/query-builder.theme';
import { duiToggleSelectTheme } from './theme/toggle-select-theme';
import { xTermTheme } from './theme/xterm-theme';

/**
 * Executes `materialTheme` to produce the complete M2 Material & DUI theme style map.
 * @zh 执行 `materialTheme`，生成完整的 Material 22 M2 主题令牌、S-5 覆盖与 DUI 自研组件主题样式集合。
 * @param theme - Runtime theme (`Theme`) / 主题参数（`Theme`）
 * @returns Merged style map (`Record<string, unknown>`) / 类型为 `Record<string, unknown>` 的主题样式规则表
 */
export function materialTheme(theme: Theme): Record<string, unknown> {
  return mergeThemeStyleMaps(
    resolveM2BlocksForTheme(theme),
    matEvaluation(theme),
    matCoreTheme(theme),
    matButtonTheme(theme),
    matFabTheme(theme),
    matIconButtonTheme(theme),
    matCardTheme(theme),
    matDialogTheme(theme),
    matExpansionPanelTheme(theme),
    matFormFieldTheme(theme),
    matIconTheme(theme),
    matInputTheme(theme),
    matListTheme(theme),
    matMenuTheme(theme),
    CommandPaletteTheme(theme),
    matSpeedDialTheme(theme),
    duiCardTheme(theme),
    duiExpansionPanelTheme(theme),
    duiDateFieldTheme(theme),
    duiToolbarTheme(theme),
    duiIconTheme(theme),
    duiMenubarTheme(theme),
    duiWindowsTheme(theme),
    duiTreeTheme(theme),
    duiPopupTheme(theme),
    duiSelectTheme(theme),
    duiScrollbarTheme(theme),
    duiPagingTheme(theme),
    xTermTheme(theme),
    duiFileFieldTheme(theme),
    duiImageFieldTheme(theme),
    duiDialogTheme(theme),
    duiMarkdownTheme(theme),
    monacoEditorTheme(theme),
    duiFormWrapperTheme(theme),
    duiNotificationTheme(theme),
    duiMessageTheme(theme),
    duiGridsterTheme(theme),
    duiChipsTheme(theme),
    duiTopbarTheme(theme),
    matBottomSheetTheme(theme),
    duiDataTableTheme(theme),
    duiIconPickerTheme(theme),
    dockLayoutTheme(theme),
    duiColorPickerTheme(theme),
    duiClipboardTheme(theme),
    duiTriggerTheme(theme),
    duiLineStyleTheme(theme),
    duiLinkPreviewTheme(theme),
    duiKeyBoardTheme(theme),
    duiLoadingTheme(theme),
    duiHttpLoaderTheme(theme),
    duiMenuTheme(theme),
    duiPanelTheme(theme),
    duiDynamicComponentTheme(theme),
    duiLayoutTheme(theme),
    duiCardViewTheme(theme),
    duiInfoDrawerTheme(theme),
    duiDragselectTheme(theme),
    duiQueryBuilderTheme(theme),
    duiToggleSelectTheme(theme),
    duiEditorTheme(theme)
  );
}
