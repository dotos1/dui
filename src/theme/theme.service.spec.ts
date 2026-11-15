/**
 * @fileoverview Unit tests for W3 M2 dynamic `ThemeService`, sentinel M2 token resolution,
 * `<style>` tag DOM cascade order, JSS nesting serializer, and `mat*Theme` public exports.
 * @zh W3 M2 动态 `ThemeService`、哨兵 M2 令牌解析、`<style>` 标签 DOM 层叠顺序、JSS 嵌套序列化与 `mat*Theme` 导出单测。
 */

import { LocalStorageService } from '@dotos1/dui/core/storage';
import {
  createMaterialCoreStyles,
  createMaterialThemeStyles,
  matAutocompleteTheme,
  matBadgeTheme,
  matBottomSheetTheme,
  matButtonTheme,
  matButtonToggleTheme,
  matCardTheme,
  matCheckboxTheme,
  matChipsTheme,
  matControlPlaceholderColor,
  matCoreTheme,
  matDatepickerTheme,
  matDialogTheme,
  matDividerTheme,
  matExpansionPanelTheme,
  matFabTheme,
  matFormFieldTheme,
  matGridListTheme,
  matIconButtonTheme,
  matIconTheme,
  matInputTheme,
  matListTheme,
  matMenuTheme,
  matOptgroupTheme,
  matOptionTheme,
  matPaginatorTheme,
  matProgressBarTheme,
  matProgressSpinnerTheme,
  matPseudoCheckboxTheme,
  matRadioTheme,
  matRippleTheme,
  matSelectTheme,
  matSidenavTheme,
  matSlideToggleTheme,
  matSliderTheme,
  matSnackBarTheme,
  matSortTheme,
  matStepperTheme,
  matTableTheme,
  matTabsTheme,
  matToolbarTheme,
  matTooltipTheme,
  matTreeTheme,
  serializeThemeRulesToCss,
  Theme,
  ThemeService,
} from './public-api';

describe('W3 M2 Dynamic ThemeService & Sentinel Token Resolution', () => {
  let service: ThemeService;

  beforeEach(() => {
    document.head.querySelectorAll('style[data-dui-sheet]').forEach((el) => el.remove());
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-density');
    document.body.className = '';
    localStorage.clear();
    const storage = new LocalStorageService({ prefix: 'dui-test', storageType: 'localStorage' });
    service = new ThemeService(storage);
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-dui-sheet]').forEach((el) => el.remove());
  });

  it('resolves exact M2 palette hex colors (zero HCT shift) across light, dark, and darkblue modes', () => {
    service.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'normal', 'fill');
    const lightSheet = document.head.querySelector('style[data-dui-role="material-theme"]');
    expect(lightSheet).not.toBeNull();
    const lightCss = lightSheet?.textContent ?? '';

    expect(lightCss).toContain('--mat-button-filled-container-color: #00897b;');
    expect(lightCss).toContain('--mat-app-background-color: #fafafa;');
    expect(lightCss).toContain('html .mat-accent');
    expect(lightCss).toContain('#ef6c00');
    expect(lightCss).toContain('html .mat-warn');
    expect(lightCss).toContain('#c62828');

    // Switch to blue-500 + dark
    service.changeTheme('blue-500', 'pink-500', 'red-700', 'dark', 'normal', 'outline');
    const darkCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(darkCss).toContain('--mat-button-filled-container-color: #2196f3;');
    expect(darkCss).toContain('--mat-app-background-color: #212121;');
    expect(darkCss).toContain('--mat-card-elevated-container-color: #424242;');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(service.getFormType()).toBe('outline');

    // Switch to indigo-500 + darkblue
    service.changeTheme('indigo-500', 'amber-700', 'red-800', 'darkblue', 'compact', 'fill');
    const darkblueCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(darkblueCss).toContain('--mat-button-filled-container-color: #3f51b5;');
    expect(darkblueCss).toContain('--mat-app-background-color: #263238;');
    expect(darkblueCss).toContain('--mat-card-elevated-container-color: #37474f;');
    expect(darkblueCss).toContain('--mat-chip-elevated-container-color: #455a64;');
    expect(document.documentElement.getAttribute('data-theme')).toBe('darkblue');
  });

  it('applies exact 7.4.52 3-scale M2 densities and px-based typography (zero rem shrinkage)', () => {
    service.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'loose', 'fill');
    const looseCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(service.getTheme().density).toBe(0);
    expect(looseCss).toContain('--mat-button-filled-container-height: 38px;');
    expect(looseCss).toContain('--mat-button-outlined-container-height: 36px;');
    expect(looseCss).toContain('--mat-form-field-container-height: 56px;');
    expect(looseCss).toContain('--mat-chip-container-height: 32px;');
    expect(looseCss).not.toMatch(/font-size:\s*[0-9.]+rem/);

    service.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'normal', 'fill');
    const normalCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(service.getTheme().density).toBe(-1);
    expect(normalCss).toContain('--mat-button-filled-container-height: 36px;');
    expect(normalCss).toContain('--mat-button-outlined-container-height: 34px;');
    expect(normalCss).toContain('--mat-form-field-container-height: 48px;');
    expect(normalCss).toContain('--mat-chip-container-height: 30px;');

    service.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'compact', 'fill');
    const compactCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(service.getTheme().density).toBe(-2);
    expect(compactCss).toContain('--mat-button-filled-container-height: 34px;');
    expect(compactCss).toContain('--mat-button-outlined-container-height: 32px;');
    expect(compactCss).toContain('--mat-form-field-container-height: 40px;');
    expect(compactCss).toContain('--mat-chip-container-height: 28px;');
  });

  it('mounts real <style> tags (never adoptedStyleSheets) and preserves strict core -> material-theme -> loadTheme order', () => {
    const compA = (theme: Theme): Record<string, unknown> => ({
      '.probe-a': {
        color: theme.primary['default'],
      },
    });
    const compB = (theme: Theme): Record<string, unknown> => ({
      '.probe-b': {
        borderColor: theme.accent['default'],
      },
    });

    // Even when loadTheme is called before explicit changeTheme, core and material-theme must precede component sheets!
    service.loadTheme(compA);
    service.loadTheme(compB);

    const initialRoles = Array.from(document.head.querySelectorAll('style[data-dui-sheet]')).map((el) =>
      el.getAttribute('data-dui-role')
    );
    expect(initialRoles).toEqual(['core', 'material-theme', 'component', 'component']);

    // Re-calling changeTheme and re-loading compA must preserve exact DOM order and update colors!
    service.changeTheme('purple-600', 'green-700', 'red-800', 'dark', 'loose', 'fill');
    service.loadTheme(compA);

    const updatedEls = Array.from(document.head.querySelectorAll('style[data-dui-sheet]'));
    const updatedRoles = updatedEls.map((el) => el.getAttribute('data-dui-role'));
    expect(updatedRoles).toEqual(['core', 'material-theme', 'component', 'component']);
    expect(updatedEls[2].textContent).toContain('#8e24aa');
    expect(updatedEls[3].textContent).toContain('#388e3c');
  });

  it('serializes JSS @global, & parent nesting, comma selectors, @media, @keyframes, and empty content', () => {
    const css = serializeThemeRulesToCss({
      '@global': {
        '.dui-box, .dui-card': {
          paddingTop: 12,
          opacity: 0.85,
          '&.is-active, &:hover': {
            backgroundColor: '#00897b',
          },
          '&::before': {
            content: '',
          },
          '.child': {
            zIndex: 10,
          },
        },
        '@media (max-width: 600px)': {
          '.dui-box': {
            paddingTop: 6,
          },
        },
        '@keyframes pulse': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    });

    expect(css).toContain('padding-top: 12px;');
    expect(css).toContain('opacity: 0.85;');
    expect(css).toContain('.dui-box.is-active, .dui-box:hover, .dui-card.is-active, .dui-card:hover');
    expect(css).toContain('content: "";');
    expect(css).toContain('z-index: 10;');
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('@keyframes pulse');
  });

  it('exports all 7.4.52 mat*Theme functions and createMaterialCoreStyles/createMaterialThemeStyles helpers', () => {
    service.refreshTheme();
    const theme = service.getTheme();

    const fns = [
      matCoreTheme,
      matAutocompleteTheme,
      matBadgeTheme,
      matBottomSheetTheme,
      matButtonTheme,
      matButtonToggleTheme,
      matCardTheme,
      matCheckboxTheme,
      matChipsTheme,
      matDatepickerTheme,
      matDialogTheme,
      matDividerTheme,
      matExpansionPanelTheme,
      matFabTheme,
      matFormFieldTheme,
      matGridListTheme,
      matIconButtonTheme,
      matIconTheme,
      matInputTheme,
      matListTheme,
      matMenuTheme,
      matOptgroupTheme,
      matOptionTheme,
      matPaginatorTheme,
      matProgressBarTheme,
      matProgressSpinnerTheme,
      matPseudoCheckboxTheme,
      matRadioTheme,
      matRippleTheme,
      matSelectTheme,
      matSidenavTheme,
      matSlideToggleTheme,
      matSliderTheme,
      matSnackBarTheme,
      matSortTheme,
      matStepperTheme,
      matTableTheme,
      matTabsTheme,
      matToolbarTheme,
      matTooltipTheme,
      matTreeTheme,
    ];

    for (const fn of fns) {
      const rules = fn(theme);
      expect(typeof rules).toBe('object');
      expect(rules).not.toBeNull();
    }

    expect(typeof matControlPlaceholderColor(theme)).toBe('string');
    const coreSheet = createMaterialCoreStyles(theme.typography);
    const matSheet = createMaterialThemeStyles(theme);
    expect(coreSheet.cssText.length).toBeGreaterThan(50);
    expect(matSheet.cssText.length).toBeGreaterThan(1000);
  });

  it('emits complete S-5 structural overrides including FAB sizing/disabled shadow and disabled icon-button color', () => {
    service.changeTheme('teal-600', 'orange-800', 'red-800', 'light', 'loose', 'fill');
    const looseCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(looseCss).toContain('.mat-mdc-fab');
    expect(looseCss).toContain('width: var(--mat-fab-extended-container-height) !important;');
    expect(looseCss).toContain('height: var(--mat-fab-extended-container-height) !important;');
    expect(looseCss).toContain('.mat-mdc-fab.mat-mdc-button-disabled, .mat-mdc-mini-fab.mat-mdc-button-disabled');
    expect(looseCss).toContain('box-shadow: var(--mat-fab-container-elevation-shadow) !important;');
    expect(looseCss).toContain('.mat-mdc-icon-button.mat-mdc-button-disabled .mat-icon');
    expect(looseCss).toContain('color: var(--mat-icon-button-disabled-icon-color) !important;');
    expect(looseCss).toContain('padding: 12px;');
    expect(looseCss).toContain('margin-top: -.0625em !important;');

    service.changeTheme('teal-600', 'orange-800', 'red-800', 'dark', 'compact', 'fill');
    const compactCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';
    expect(compactCss).toContain('padding: 8px;');
    expect(compactCss).toContain('margin-top: .0078em !important;');
  });

  it('restores 7.4.52 visual parity tokens, createThemeStyles public API, and dynamic M2 --dui-theme-* root vars with zero --mat-sys-*', () => {
    service.changeTheme('blue-500', 'pink-500', 'red-700', 'light', 'loose', 'fill');
    const coreCss = document.head.querySelector('style[data-dui-role="core"]')?.textContent ?? '';
    const matCss = document.head.querySelector('style[data-dui-role="material-theme"]')?.textContent ?? '';

    // T4-1: Dynamic M2 root variables follow ThemeService palette changes, with zero --mat-sys-* M3 tokens
    expect(matCss).toContain('--dui-theme-primary: #2196f3;');
    expect(matCss).toContain('--dui-theme-accent: #e91e63;');
    expect(matCss).toContain('--dui-theme-warn: #d32f2f;');
    expect(matCss).toContain('--dui-theme-primary-container: rgba(33,150,243,0.12);');
    expect(matCss).not.toContain('--mat-sys-');
    expect(coreCss).not.toContain('--mat-sys-');

    // T1: 7.4.52 appearance restoration (card & slider shadow none, badge transparent, menu-item 14px, icon foreground)
    expect(matCss).toContain('--mat-card-elevated-container-elevation: none;');
    expect(matCss).toContain('--mat-slider-handle-elevation: none;');
    expect(matCss).toContain('--mat-badge-background-color: transparent;');
    expect(matCss).toContain('--mat-menu-item-label-text-size: 14px;');
    expect(matCss).toContain('--mat-icon-color: rgba(0, 0, 0, 0.54);');

    // G3: createThemeStyles public method compatibility
    const customSheet = service.createThemeStyles(
      service.getTheme(),
      (t: Theme) => ({ '.custom-r3-probe': { color: t.primary['default'] } }),
      true
    );
    expect(customSheet.cssText).toContain('.custom-r3-probe');
    expect(customSheet.cssText).toContain('#2196f3');
  });
});
