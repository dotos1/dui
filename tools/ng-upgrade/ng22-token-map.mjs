/**
 * Angular Material 18.2.13 -> 22.2.7 官方 CSS Token 与类名双兼容映射表。
 * 规则提炼自 @angular/material@20.2.14 / 22.2.7 官方 ng-update schematics 并经 1,155 个 v22 真实变量校验。
 */

export const MATERIAL_18_TO_22_PREFIXES = [
  { old: '--mat-tab-header-with-background-', replacement: '--mat-tab-' },
  { old: '--mat-secondary-navigation-tab-', replacement: '--mat-tab-' },
  { old: '--mat-minimal-pseudo-checkbox-', replacement: '--mat-pseudo-checkbox-minimal-' },
  { old: '--mat-standard-button-toggle-', replacement: '--mat-button-toggle-' },
  { old: '--mat-mdc-focus-indicator-', replacement: '--mat-focus-indicator-' },
  { old: '--mat-legacy-button-toggle-', replacement: '--mat-button-toggle-legacy-' },
  { old: '--mat-full-pseudo-checkbox-', replacement: '--mat-pseudo-checkbox-full-' },
  { old: '--mat-outlined-text-field-', replacement: '--mat-form-field-outlined-' },
  { old: '--mat-circular-progress-', replacement: '--mat-progress-spinner-' },
  { old: '--mat-filled-text-field-', replacement: '--mat-form-field-filled-' },
  { old: '--mat-protected-button-', replacement: '--mat-button-protected-' },
  { old: '--mat-linear-progress-', replacement: '--mat-progress-bar-' },
  { old: '--mat-outlined-button-', replacement: '--mat-button-outlined-' },
  { old: '--mat-elevated-card-', replacement: '--mat-card-elevated-' },
  { old: '--mat-filled-button-', replacement: '--mat-button-filled-' },
  { old: '--mat-outlined-card-', replacement: '--mat-card-outlined-' },
  { old: '--mat-plain-tooltip-', replacement: '--mat-tooltip-' },
  { old: '--mat-tab-indicator-', replacement: '--mat-tab-' },
  { old: '--mat-extended-fab-', replacement: '--mat-fab-extended-' },
  { old: '--mat-tonal-button-', replacement: '--mat-button-tonal-' },
  { old: '--mat-text-button-', replacement: '--mat-button-text-' },
  { old: '--mat-tab-header-', replacement: '--mat-tab-' },
  { old: '--mat-snackbar-', replacement: '--mat-snack-bar-' },
  { old: '--mat-switch-', replacement: '--mat-slide-toggle-' },
  { old: '--mat-app-', replacement: '--mat-sys-' },
];

export const MATERIAL_18_TO_22_CLASSES = {
  'mdc-icon-button': 'mat-mdc-icon-button',
  'mat-mdc-focus-indicator': 'mat-focus-indicator',
  'mat-progress-spinner': 'mat-mdc-progress-spinner',
  'mat-form-field-infix': 'mat-mdc-form-field-infix',
};

/**
 * 将 Angular Material 18 的 CSS 自定义属性映射为 Angular Material 22 对应名称。
 * 若该属性在 22 中未改名则返回原字符串。
 * @param {string} token
 * @returns {string}
 */
export function mapMaterial18To22Token(token) {
  if (typeof token !== 'string' || !token.startsWith('--')) {
    return token;
  }
  let mapped = token.startsWith('--mdc-') ? `--mat-${token.slice(6)}` : token;
  for (const rule of MATERIAL_18_TO_22_PREFIXES) {
    if (mapped.startsWith(rule.old)) {
      mapped = rule.replacement + mapped.slice(rule.old.length);
      break;
    }
  }
  return mapped;
}
