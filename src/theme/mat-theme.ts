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
import {duiEditorTheme} from './theme/dui-editor.theme';

import {
  matCoreTheme,
  matAutocompleteTheme,
  matButtonTheme,
  matFabTheme,
  matIconButtonTheme,
  matButtonToggleTheme,
  matCardTheme,
  matCheckboxTheme,
  matChipsTheme,
  matTableTheme,
  matDatepickerTheme,
  matDialogTheme,
  matDividerTheme,
  CommandPaletteTheme,
  matExpansionPanelTheme,
  matFormFieldTheme,
  matGridListTheme,
  matIconTheme,
  matInputTheme,
  matListTheme,
  matMenuTheme,
  matPaginatorTheme,
  matProgressBarTheme,
  matProgressSpinnerTheme,
  matRadioTheme,
  matSelectTheme,
  matSidenavTheme,
  matSlideToggleTheme,
  matSliderTheme,
  matStepperTheme,
  matTabsTheme,
  matToolbarTheme,
  matTooltipTheme,
  matSnackBarTheme,
  matTreeTheme,
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
  duiSelectTheme
} from './theme/index';
import { duiInfoDrawerTheme } from './theme/info-drawer.theme';
import { matBadgeTheme } from './theme/mat-badge-theme';
import { xTermTheme } from './theme/xterm-theme';
import { monacoEditorTheme } from './theme/monaco-editor-theme';
import { duiDynamicComponentTheme } from './theme/dynamic.theme';
import { duiToggleSelectTheme } from './theme/toggle-select-theme';
import { duiScrollbarTheme } from './theme/dui-scrollbar-theme';


// Create a theme.
export function materialTheme(theme: Theme): Object {
  return {
    ...matEvaluation(theme),
    ...matCoreTheme(theme),
    ...matAutocompleteTheme(theme),
    ...matButtonTheme(theme),
    ...matFabTheme(theme),
    ...matIconButtonTheme(theme),
    ...matButtonToggleTheme(theme),
    ...matCardTheme(theme),
    ...matCheckboxTheme(theme),
    ...matChipsTheme(theme),
    ...matTableTheme(theme),
    ...matDatepickerTheme(theme),
    ...matDialogTheme(theme),
    ...matDividerTheme(theme),
    ...matExpansionPanelTheme(theme),
    ...matFormFieldTheme(theme),
    ...matGridListTheme(theme),
    ...matIconTheme(theme),
    ...matInputTheme(theme),
    ...matListTheme(theme),
    ...matMenuTheme(theme),
    ...CommandPaletteTheme(theme),
    ...matPaginatorTheme(theme),
    ...matProgressBarTheme(theme),
    ...matProgressSpinnerTheme(theme),
    ...matRadioTheme(theme),
    ...matSelectTheme(theme),
    ...matSidenavTheme(theme),
    ...matSlideToggleTheme(theme),
    ...matSliderTheme(theme),
    ...matStepperTheme(theme),
    ...matTabsTheme(theme),
    ...matBadgeTheme(theme),
    ...matToolbarTheme(theme),
    ...matTooltipTheme(theme),
    ...matSnackBarTheme(theme),
    ...matSpeedDialTheme(theme),
    ...matTreeTheme(theme),
    ...duiCardTheme(theme),
    ...duiExpansionPanelTheme(theme),
    ...duiDateFieldTheme(theme),
    ...duiToolbarTheme(theme),
    ...duiIconTheme(theme),
    ...duiMenubarTheme(theme),
    ...duiWindowsTheme(theme),
    ...duiTreeTheme(theme),
    ...duiPopupTheme(theme),
    ...duiSelectTheme(theme),
    ...duiScrollbarTheme(theme),
    ...duiPagingTheme(theme),
    ...xTermTheme(theme),
    ...duiFileFieldTheme(theme),
    ...duiImageFieldTheme(theme),
    ...duiDialogTheme(theme),
    ...duiMarkdownTheme(theme),
    ...monacoEditorTheme(theme),
    ...duiFormWrapperTheme(theme),
    ...duiNotificationTheme(theme),
    ...duiMessageTheme(theme),
    ...duiGridsterTheme(theme),
    ...duiChipsTheme(theme),
    ...duiTopbarTheme(theme),
    ...matBottomSheetTheme(theme),
    ...duiDataTableTheme(theme),
    ...duiIconPickerTheme(theme),
    ...dockLayoutTheme(theme),
    ...duiColorPickerTheme(theme),
    ...duiClipboardTheme(theme),
    ...duiTriggerTheme(theme),
    ...duiLineStyleTheme(theme),
    ...duiLinkPreviewTheme(theme),
    ...duiKeyBoardTheme(theme),
    ...duiLoadingTheme(theme),
    ...duiHttpLoaderTheme(theme),
    ...duiMenuTheme(theme),
    ...duiPanelTheme(theme),
    ...duiDynamicComponentTheme(theme),
    ...duiLayoutTheme(theme),
    ...matBottomSheetTheme(theme),
    ...duiCardViewTheme(theme),
    ...duiInfoDrawerTheme(theme),
    ...duiDragselectTheme(theme),
    ...duiQueryBuilderTheme(theme),
    ...duiToggleSelectTheme(theme),
    ...duiEditorTheme(theme)
  };
}
