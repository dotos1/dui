#!/usr/bin/env node
/**
 * @fileoverview Build-time M2 token template & static stylesheet generator using Angular Material 22's
 * official M2 Sass API (`mat.m2-define-light-theme`, `mat.m2-define-dark-theme`, `mat.m2-theme`,
 * `mat.all-component-bases`, `mat.all-component-colors`, `mat.all-component-densities`,
 * `mat.all-component-typographies`) with 100% injective RGB sentinel palettes (ZERO HCT).
 *
 * Outputs:
 *   1. `src/theme/m2-token-templates.ts` — typed runtime M2 token templates for `ThemeService` & `mat*Theme`
 *   2. `src/theming/_m2-system.scss`     — static default DotOS M2 stylesheet imported by `platform.scss`
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const NODE_MODULES = path.join(REPO_ROOT, 'node_modules');

// 18 injective slots per palette: hues + explicit default/lighter/darker/text slots
const SENTINEL_SLOTS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  'A100',
  'A200',
  'A400',
  'A700',
  '_def',
  '_lgt',
  '_drk',
  '_txt',
];

const SLOT_KEY_MAP = {
  _def: 'default',
  _lgt: 'lighter',
  _drk: 'darker',
  _txt: 'text',
};

const RED_CHANNEL_MAP = new Map([
  [17, { palette: 'primary', contrast: false }],
  [34, { palette: 'primary', contrast: true }],
  [51, { palette: 'accent', contrast: false }],
  [68, { palette: 'accent', contrast: true }],
  [85, { palette: 'warn', contrast: false }],
  [102, { palette: 'warn', contrast: true }],
]);

const BLUE_SENTINEL = 199; // 0xc7

/**
 * Collects all CSS custom properties actually read (`var(--mat-*)` / `var(--cdk-*)`) in
 * `@angular/material`, `@angular/cdk`, and `dui/src` so zero dead `--mdc-*` / `--mat-*`
 * tokens are emitted.
 */
function collectLiveReadVars() {
  const live = new Set();
  const walk = (dir, exts, out = []) => {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, exts, out);
      } else if (exts.some((ext) => entry.name.endsWith(ext))) {
        out.push(full);
      }
    }
    return out;
  };

  for (const pkgDir of [
    path.join(NODE_MODULES, '@angular/material/fesm2022'),
    path.join(NODE_MODULES, '@angular/cdk/fesm2022'),
  ]) {
    for (const file of walk(pkgDir, ['.mjs', '.js', '.css'])) {
      const txt = fs.readFileSync(file, 'utf8');
      for (const m of txt.matchAll(/var\(\s*(--(?:mat|cdk)-[a-z0-9-]+)/g)) {
        live.add(m[1]);
      }
    }
  }

  for (const file of walk(path.join(NODE_MODULES, '@angular/material/core'), ['.scss'])) {
    const txt = fs.readFileSync(file, 'utf8');
    for (const m of txt.matchAll(/var\(\s*(--(?:mat|cdk)-[a-z0-9-]+)/g)) {
      live.add(m[1]);
    }
    for (const m of txt.matchAll(/token-utils\.slot\(\s*([a-z0-9-]+)/g)) {
      live.add(`--mat-${m[1]}`);
    }
  }

  for (let z = 0; z <= 24; z++) {
    live.add(`--mat-app-elevation-shadow-level-${z}`);
  }

  for (const file of walk(path.join(REPO_ROOT, 'src'), ['.ts', '.scss', '.css'])) {
    if (file.endsWith('.spec.ts') || file.endsWith('m2-token-templates.ts') || file.endsWith('_m2-system.scss') || file.endsWith('_m3-system.scss')) {
      continue;
    }
    const txt = fs.readFileSync(file, 'utf8');
    for (const m of txt.matchAll(/var\(\s*(--(?:mat|cdk)-[a-z0-9-]+)/g)) {
      live.add(m[1]);
    }
  }

  return live;
}

function buildSentinelPaletteSass(varName, valRed, contrastRed) {
  const valEntries = SENTINEL_SLOTS.map((slot, idx) => `  ${slot}: rgb(${valRed}, ${idx + 1}, ${BLUE_SENTINEL}),`).join('\n');
  const contrastEntries = SENTINEL_SLOTS.map(
    (slot, idx) => `    ${slot}: rgba(${contrastRed}, ${idx + 1}, ${BLUE_SENTINEL}, 0.87),`
  ).join('\n');
  return `$${varName}-map: (\n${valEntries}\n  contrast: (\n${contrastEntries}\n  ),\n);\n$${varName}: mat.m2-define-palette($${varName}-map, _def, _lgt, _drk, _txt);`;
}

/**
 * Exact 7.4.52 typography configs (`src/theme/typography-theme.ts`) compiled via Material 22's
 * `mat.m2-define-legacy-typography-config` so all font sizes are `px` (immune to `html { font-size: 62.5% }`).
 */
const TYPOGRAPHY_CONFIGS = {
  loose: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    levels: {
      'display-4': ['112px', '112px', 300, 'normal'],
      'display-3': ['56px', '56px', 400, 'normal'],
      'display-2': ['45px', '48px', 400, 'normal'],
      'display-1': ['34px', '40px', 400, 'normal'],
      headline: ['24px', '32px', 400, 'normal'],
      title: ['20px', '20px', 400, 'normal'],
      'subheading-2': ['16px', '28px', 400, 'normal'],
      'subheading-1': ['15px', '24px', 400, 'normal'],
      'body-2': ['14px', '24px', 500, 'normal'],
      'body-1': ['14px', '20px', 400, 'normal'],
      caption: ['12px', '20px', 400, 'normal'],
      button: ['14px', '14px', 500, 'normal'],
      input: ['inherit', 1.125, 400, 'normal'],
    },
  },
  normal: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    levels: {
      'display-4': ['100px', '100px', 300, 'normal'],
      'display-3': ['50px', '50px', 400, 'normal'],
      'display-2': ['40px', '44px', 400, 'normal'],
      'display-1': ['30px', '36px', 400, 'normal'],
      headline: ['22px', '28px', 400, 'normal'],
      title: ['18px', '28px', 400, 'normal'],
      'subheading-2': ['15px', '21px', 400, 'normal'],
      'subheading-1': ['14px', '21px', 400, 'normal'],
      'body-2': ['14px', '22px', 500, 'normal'],
      'body-1': ['14px', '18px', 400, 'normal'],
      caption: ['12px', '18px', 400, 'normal'],
      button: ['13px', '13px', 500, 'normal'],
      input: ['inherit', 0.9844, 400, 'normal'],
    },
  },
  compact: {
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    levels: {
      'display-4': ['90px', '90px', 300, 'normal'],
      'display-3': ['44px', '44px', 400, 'normal'],
      'display-2': ['36px', '38px', 400, 'normal'],
      'display-1': ['28px', '28px', 400, 'normal'],
      headline: ['20px', '20px', 400, 'normal'],
      title: ['18px', '18px', 400, 'normal'],
      'subheading-2': ['14px', '20px', 400, 'normal'],
      'subheading-1': ['13px', '20px', 400, 'normal'],
      'body-2': ['14px', '20px', 500, 'normal'],
      'body-1': ['14px', '16px', 400, 'normal'],
      caption: ['12px', '18px', 400, 'normal'],
      button: ['13px', '13px', 500, 'normal'],
      input: ['inherit', 0.9844, 400, 'normal'],
    },
  },
};

function buildTypographySass(varName, cfg) {
  const args = Object.entries(cfg.levels)
    .map(
      ([lvl, [fsz, lh, fw, ls]]) =>
        `  $${lvl}: mat.m2-define-typography-level(${fsz}, ${lh}, ${fw}, $letter-spacing: ${ls}),`
    )
    .join('\n');
  return `$${varName}: mat.m2-define-legacy-typography-config(\n  $font-family: '${cfg.fontFamily}',\n${args}\n);`;
}

/**
 * Patches Material 22's M2 theme internal background/foreground maps & `_mat-system`
 * to match 7.4.52's exact `matLightTheme`, `matDarkTheme`, and `matDarkBlueTheme` surfaces!
 */
const SASS_THEME_PATCH_HELPERS = `
@function patch-dui-m2-mode($theme, $mode) {
  $internals: map.get($theme, _mat-theming-internals-do-not-access);
  $m2-cfg: map.get($internals, m2-config);
  $color-cfg: map.get($m2-cfg, color);
  $bg: map.get($color-cfg, background);
  $fg: map.get($color-cfg, foreground);
  $sys: map.get($theme, _mat-system);

  @if $mode == 'light' {
    // 7.4.52 matLightThemeForeground uses darkSecondaryText = rgba(0, 0, 0, 0.7)
    $fg: map.merge($fg, (
      secondary-text: rgba(0, 0, 0, 0.7),
    ));
    $sys: map.merge($sys, (
      on-surface-variant: rgba(0, 0, 0, 0.7),
    ));
  } @else if $mode == 'dark' {
    // 7.4.52 matDarkTheme: background #212121 (grey-900), card/dialog #424242 (grey-800), text rgba(white, 0.87)
    $bg: map.merge($bg, (
      status-bar: black,
      app-bar: #212121,
      background: #212121,
      hover: rgba(255, 255, 255, 0.04),
      card: #424242,
      dialog: #424242,
      disabled-button: #616161,
      raised-button: #424242,
      focused-button: rgba(255, 255, 255, 0.12),
      selected-button: #212121,
      selected-disabled-button: #424242,
      disabled-button-toggle: #616161,
      unselected-chip: #616161,
      disabled-list-option: #616161,
      tooltip: #616161,
    ));
    $fg: map.merge($fg, (
      base: white,
      divider: rgba(255, 255, 255, 0.12),
      dividers: rgba(255, 255, 255, 0.12),
      disabled: rgba(255, 255, 255, 0.5),
      disabled-button: rgba(255, 255, 255, 0.3),
      disabled-text: rgba(255, 255, 255, 0.5),
      elevation: black,
      hint-text: rgba(255, 255, 255, 0.5),
      secondary-text: rgba(255, 255, 255, 0.7),
      icon: rgba(255, 255, 255, 0.7),
      icons: rgba(255, 255, 255, 0.7),
      text: rgba(255, 255, 255, 0.87),
      slider-min: white,
      slider-off: rgba(255, 255, 255, 0.3),
      slider-off-active: rgba(255, 255, 255, 0.3),
    ));
    $sys: map.merge($sys, (
      background: #212121,
      on-background: rgba(255, 255, 255, 0.87),
      surface: #424242,
      surface-dim: #212121,
      surface-bright: #616161,
      surface-container-lowest: #1b1b1b,
      surface-container-low: #303030,
      surface-container: #424242,
      surface-container-high: #424242,
      surface-container-highest: #616161,
      on-surface: rgba(255, 255, 255, 0.87),
      surface-variant: #616161,
      on-surface-variant: rgba(255, 255, 255, 0.7),
    ));
  } @else if $mode == 'darkblue' {
    // 7.4.52 matDarkBlueTheme: background/app-bar #263238 (blue-grey-900), card/dialog/raised #37474f (blue-grey-800), chip/tooltip #455a64 (blue-grey-700)
    $bg: map.merge($bg, (
      status-bar: black,
      app-bar: #263238,
      background: #263238,
      hover: rgba(255, 255, 255, 0.04),
      card: #37474f,
      dialog: #37474f,
      disabled-button: #78909c,
      raised-button: #37474f,
      focused-button: rgba(255, 255, 255, 0.12),
      selected-button: #263238,
      selected-disabled-button: #37474f,
      disabled-button-toggle: #455a64,
      unselected-chip: #455a64,
      disabled-list-option: #455a64,
      tooltip: #455a64,
    ));
    $fg: map.merge($fg, (
      base: white,
      divider: rgba(255, 255, 255, 0.12),
      dividers: rgba(255, 255, 255, 0.12),
      disabled: rgba(255, 255, 255, 0.5),
      disabled-button: rgba(255, 255, 255, 0.3),
      disabled-text: rgba(255, 255, 255, 0.5),
      elevation: black,
      hint-text: rgba(255, 255, 255, 0.5),
      secondary-text: rgba(255, 255, 255, 0.7),
      icon: rgba(255, 255, 255, 0.54),
      icons: rgba(255, 255, 255, 0.7),
      text: rgba(255, 255, 255, 0.87),
      slider-min: white,
      slider-off: rgba(255, 255, 255, 0.3),
      slider-off-active: rgba(255, 255, 255, 0.3),
    ));
    $sys: map.merge($sys, (
      background: #263238,
      on-background: rgba(255, 255, 255, 0.87),
      surface: #37474f,
      surface-dim: #263238,
      surface-bright: #455a64,
      surface-container-lowest: #1c262b,
      surface-container-low: #263238,
      surface-container: #37474f,
      surface-container-high: #37474f,
      surface-container-highest: #455a64,
      on-surface: rgba(255, 255, 255, 0.87),
      surface-variant: #455a64,
      on-surface-variant: rgba(255, 255, 255, 0.7),
    ));
  }

  $color-cfg: map.merge($color-cfg, (background: $bg, foreground: $fg));
  $m2-cfg: map.merge($m2-cfg, (color: $color-cfg));
  $internals: map.merge($internals, (m2-config: $m2-cfg));
  @return map.merge($theme, (
    color: $color-cfg,
    background: $bg,
    foreground: $fg,
    _mat-system: $sys,
    _mat-theming-internals-do-not-access: $internals,
  ));
}
`;

function decodeSentinelValue(cssValue) {
  let out = cssValue.replace(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})c7\b/gi, (full, rHex, gHex) => {
    const r = Number.parseInt(rHex, 16);
    const g = Number.parseInt(gHex, 16);
    const info = RED_CHANNEL_MAP.get(r);
    if (!info || g < 1 || g > SENTINEL_SLOTS.length) {
      return full;
    }
    const rawSlot = SENTINEL_SLOTS[g - 1];
    const baseKey = SLOT_KEY_MAP[rawSlot] ?? rawSlot;
    if (info.contrast) {
      return `{{${info.palette}.${baseKey}-contrast@1}}`;
    }
    return `{{${info.palette}.${baseKey}}}`;
  });

  out = out.replace(
    /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*199\s*\)/gi,
    (full, rStr, gStr) => {
      const r = Number.parseInt(rStr, 10);
      const g = Number.parseInt(gStr, 10);
      const info = RED_CHANNEL_MAP.get(r);
      if (!info || g < 1 || g > SENTINEL_SLOTS.length) {
        return full;
      }
      const rawSlot = SENTINEL_SLOTS[g - 1];
      const baseKey = SLOT_KEY_MAP[rawSlot] ?? rawSlot;
      if (info.contrast) {
        return `{{${info.palette}.${baseKey}-contrast@1}}`;
      }
      return `{{${info.palette}.${baseKey}}}`;
    }
  );

  out = out.replace(
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*199\s*,\s*([0-9.]+)\s*\)/gi,
    (full, rStr, gStr, alphaStr) => {
      const r = Number.parseInt(rStr, 10);
      const g = Number.parseInt(gStr, 10);
      const info = RED_CHANNEL_MAP.get(r);
      if (!info || g < 1 || g > SENTINEL_SLOTS.length) {
        return full;
      }
      const rawSlot = SENTINEL_SLOTS[g - 1];
      const baseKey = SLOT_KEY_MAP[rawSlot] ?? rawSlot;
      if (info.contrast && Number.parseFloat(alphaStr) === 0.87) {
        return `{{${info.palette}.${baseKey}-contrast}}`;
      }
      const key = info.contrast ? `${baseKey}-contrast` : baseKey;
      return `{{${info.palette}.${key}@${alphaStr}}}`;
    }
  );

  return out;
}

/**
 * Parses flat (non-@media) compiled Sass CSS into ordered `{ selector, declarations }` blocks,
 * merging duplicate selectors while preserving cascade order and stripping dead custom properties.
 */
function parseCssBlocks(css, liveVars) {
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const blockMap = new Map();
  const blockRe = /([^{}]+)\{([^{}]*)\}/g;
  for (const m of cleaned.matchAll(blockRe)) {
    const selector = m[1].replace(/\s+/g, ' ').trim();
    const body = m[2].trim();
    if (!selector || !body) continue;

    let declMap = blockMap.get(selector);
    if (!declMap) {
      declMap = new Map();
      blockMap.set(selector, declMap);
    }

    // Split declarations outside parentheses
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < body.length; i++) {
      const ch = body[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth = Math.max(0, depth - 1);
      else if (ch === ';' && depth === 0) {
        parts.push(body.slice(start, i));
        start = i + 1;
      }
    }
    if (start < body.length) {
      parts.push(body.slice(start));
    }

    for (const part of parts) {
      const colonIdx = part.indexOf(':');
      if (colonIdx === -1) continue;
      const prop = part.slice(0, colonIdx).trim();
      const val = part.slice(colonIdx + 1).trim();
      if (!prop || !val) continue;

      if (prop.startsWith('--mdc-')) {
        continue;
      }
      if ((prop.startsWith('--mat-') || prop.startsWith('--cdk-')) && !prop.startsWith('--mat-sys-') && !liveVars.has(prop)) {
        continue;
      }
      declMap.set(prop, decodeSentinelValue(val));
    }
  }

  const blocks = [];
  for (const [selector, declMap] of blockMap.entries()) {
    if (declMap.size === 0) continue;
    blocks.push({
      selector,
      declarations: Object.fromEntries(declMap.entries()),
    });
  }
  return blocks;
}

/**
 * Custom DotOS 7.4.52 density overrides mapped onto Material 22 live tokens.
 */
const DOTOS_DENSITY_OVERRIDES = {
  0: {
    '--mat-button-filled-container-height': '38px',
    '--mat-button-outlined-container-height': '36px',
    '--mat-button-protected-container-height': '36px',
    '--mat-button-text-container-height': '36px',
    '--mat-icon-button-state-layer-size': '48px',
    '--mat-chip-container-height': '32px',
    '--mat-form-field-container-height': '56px',
    '--mat-form-field-filled-label-display': 'block',
    '--mat-form-field-container-vertical-padding': '24px',
    '--mat-form-field-filled-with-label-container-padding-top': '32px',
    '--mat-form-field-filled-with-label-container-padding-bottom': '16px',
    '--mat-select-arrow-transform': 'translateY(-8px)',
  },
  '-1': {
    '--mat-button-filled-container-height': '36px',
    '--mat-button-outlined-container-height': '34px',
    '--mat-button-protected-container-height': '34px',
    '--mat-button-text-container-height': '34px',
    '--mat-icon-button-state-layer-size': '44px',
    '--mat-chip-container-height': '30px',
    '--mat-form-field-container-height': '48px',
    '--mat-form-field-filled-label-display': 'block',
    '--mat-form-field-container-vertical-padding': '20px',
    '--mat-form-field-filled-with-label-container-padding-top': '28px',
    '--mat-form-field-filled-with-label-container-padding-bottom': '12px',
    '--mat-select-arrow-transform': 'translateY(-8px)',
  },
  '-2': {
    '--mat-button-filled-container-height': '34px',
    '--mat-button-outlined-container-height': '32px',
    '--mat-button-protected-container-height': '32px',
    '--mat-button-text-container-height': '32px',
    '--mat-icon-button-state-layer-size': '40px',
    '--mat-chip-container-height': '28px',
    '--mat-form-field-container-height': '40px',
    '--mat-form-field-filled-label-display': 'block',
    '--mat-form-field-container-vertical-padding': '16px',
    '--mat-form-field-filled-with-label-container-padding-top': '24px',
    '--mat-form-field-filled-with-label-container-padding-bottom': '8px',
    '--mat-select-arrow-transform': 'none',
  },
};

function applyDensityOverrides(blocks, scaleKey) {
  const overrides = DOTOS_DENSITY_OVERRIDES[scaleKey];
  if (!overrides) return blocks;
  let htmlBlock = blocks.find((b) => b.selector === 'html');
  if (!htmlBlock) {
    htmlBlock = { selector: 'html', declarations: {} };
    blocks.unshift(htmlBlock);
  }
  Object.assign(htmlBlock.declarations, overrides);
  for (const block of blocks) {
    if (block === htmlBlock) continue;
    for (const [k, v] of Object.entries(overrides)) {
      if (Object.prototype.hasOwnProperty.call(block.declarations, k)) {
        block.declarations[k] = v;
      }
    }
  }
  return blocks;
}

function compileSass(scss) {
  return sass.compileString(scss, { loadPaths: [NODE_MODULES] }).css;
}

function generate() {
  const liveVars = collectLiveReadVars();

  const sentinelPreamble = [
    "@use 'sass:map';",
    "@use '@angular/material' as mat;",
    buildSentinelPaletteSass('p-pal', 17, 34),
    buildSentinelPaletteSass('a-pal', 51, 68),
    buildSentinelPaletteSass('w-pal', 85, 102),
    buildTypographySass('typo-loose', TYPOGRAPHY_CONFIGS.loose),
    buildTypographySass('typo-normal', TYPOGRAPHY_CONFIGS.normal),
    buildTypographySass('typo-compact', TYPOGRAPHY_CONFIGS.compact),
    SASS_THEME_PATCH_HELPERS,
  ].join('\n');

  // 1. Base unthemable tokens (M2 shapes: 4px buttons/cards/dialogs/form-fields, etc.) + app-background + elevation classes
  const baseCss = compileSass(`
${sentinelPreamble}
$t: mat.m2-define-light-theme((
  color: (primary: $p-pal, accent: $a-pal, warn: $w-pal),
  typography: $typo-normal,
  density: -1,
));
html {
  @include mat.all-component-bases($t);
}
@include mat.app-background();
@include mat.elevation-classes();
`);
  const baseBlocks = parseCssBlocks(baseCss, liveVars);

  // 2. Color templates for light, dark, darkblue (including M2 system map + all component colors + .mat-accent/.mat-warn variants!)
  const colorTemplates = {};
  for (const mode of ['light', 'dark', 'darkblue']) {
    const defineFn = mode === 'light' ? 'mat.m2-define-light-theme' : 'mat.m2-define-dark-theme';
    const css = compileSass(`
${sentinelPreamble}
$raw: ${defineFn}((
  color: (primary: $p-pal, accent: $a-pal, warn: $w-pal),
));
$t: patch-dui-m2-mode($raw, '${mode}');
html {
  @include mat.m2-theme($t);
  @include mat.all-component-colors($t);
}
`);
    const blocks = parseCssBlocks(css, liveVars);
    // 7.4.52 DotOS unselected chip & tooltip surface parity (light: #e0e0e0/#616161, dark: #616161/#616161, darkblue: #455a64/#455a64)
    const unselectedChipBg = mode === 'darkblue' ? '#455a64' : mode === 'dark' ? '#616161' : '#e0e0e0';
    const tooltipBg = mode === 'darkblue' ? '#455a64' : '#616161';
    const htmlColorBlock = blocks.find((b) => b.selector === 'html');
    if (htmlColorBlock) {
      htmlColorBlock.declarations['--mat-tooltip-container-color'] = tooltipBg;
      htmlColorBlock.declarations['--mat-tooltip-supporting-text-color'] = 'white';
      // 7.4.52 _filled-text-field.ts:50 `container-color: safe_color_change($surface, 0)` (transparent fill container)
      htmlColorBlock.declarations['--mat-form-field-filled-container-color'] = 'transparent';
      // 7.4.52 tokens/mdc/_icon-button.ts:38 exact 0.38 disabled icon alpha & exact disabled button/input/select-arrow alphas
      htmlColorBlock.declarations['--mat-icon-button-disabled-icon-color'] =
        mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.38)';
      const disabledBtnFg = mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.5)';
      const disabledInputFg = mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.38)';
      const disabledFabBg =
        mode === 'darkblue'
          ? 'rgba(120, 144, 156, 0.12)'
          : mode === 'dark'
            ? 'rgba(97, 97, 97, 0.12)'
            : 'rgba(0, 0, 0, 0.12)';
      htmlColorBlock.declarations['--mat-button-filled-disabled-label-text-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-button-outlined-disabled-label-text-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-button-protected-disabled-label-text-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-button-text-disabled-label-text-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-fab-disabled-state-foreground-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-fab-small-disabled-state-foreground-color'] = disabledBtnFg;
      htmlColorBlock.declarations['--mat-fab-disabled-state-container-color'] = disabledFabBg;
      htmlColorBlock.declarations['--mat-fab-small-disabled-state-container-color'] = disabledFabBg;
      htmlColorBlock.declarations['--mat-form-field-filled-disabled-input-text-color'] = disabledInputFg;
      htmlColorBlock.declarations['--mat-form-field-outlined-disabled-input-text-color'] = disabledInputFg;
      htmlColorBlock.declarations['--mat-select-enabled-arrow-color'] =
        mode === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.54)';
    }
    const chipBlock = blocks.find((b) => b.selector === 'html .mat-mdc-standard-chip');
    if (chipBlock) {
      chipBlock.declarations['--mat-chip-elevated-container-color'] = unselectedChipBg;
      chipBlock.declarations['--mat-chip-elevated-disabled-container-color'] = unselectedChipBg;
    }
    // Ensure .mat-icon.mat-primary/.mat-accent/.mat-warn sets --mat-icon-color to {{palette.text}} as in 7.4.52!
    for (const pal of ['primary', 'accent', 'warn']) {
      const sel = `html .mat-icon.mat-${pal}`;
      const existing = blocks.find((b) => b.selector === sel);
      if (existing) {
        existing.declarations['--mat-icon-color'] = `{{${pal}.text}}`;
      } else {
        blocks.push({ selector: sel, declarations: { '--mat-icon-color': `{{${pal}.text}}` } });
      }
    }
    // 7.4.52 _filled-button.ts / _protected-button.ts / _fab.ts pass opacity=1 on `default-contrast`
    // so colored button & FAB labels render opaque (`@1`) even when palette contrast uses `rgba(white/black, 0.87)`.
    const OPAQUE_CONTRAST_PROPS = new Set([
      '--mat-button-filled-label-text-color',
      '--mat-button-protected-label-text-color',
      '--mat-fab-foreground-color',
      '--mat-fab-small-foreground-color',
    ]);
    for (const b of blocks) {
      for (const prop of OPAQUE_CONTRAST_PROPS) {
        const cur = b.declarations[prop];
        if (typeof cur === 'string' && cur.includes('-contrast}}')) {
          b.declarations[prop] = cur.replace(/-contrast\}\}/g, '-contrast@1}}');
        }
      }
    }
    colorTemplates[mode] = blocks;
  }

  // 3. Density templates for 0 (loose), -1 (normal), -2 (compact)
  const densityTemplates = {};
  for (const scale of [0, -1, -2]) {
    const css = compileSass(`
${sentinelPreamble}
$t: mat.m2-define-light-theme((
  density: ${scale},
));
html {
  @include mat.all-component-densities($t);
}
`);
    densityTemplates[String(scale)] = applyDensityOverrides(parseCssBlocks(css, liveVars), String(scale));
  }

  // 4. Typography templates for loose, normal, compact
  const typographyTemplates = {};
  for (const typoKey of ['loose', 'normal', 'compact']) {
    const css = compileSass(`
${sentinelPreamble}
$t: mat.m2-define-light-theme((
  typography: $typo-${typoKey},
));
html {
  @include mat.m2-theme($t);
  @include mat.all-component-typographies($t);
}
`);
    typographyTemplates[typoKey] = parseCssBlocks(css, liveVars);
  }

  // Count color tokens & density tokens for verification summary
  const lightColorTokenCount = colorTemplates.light.reduce(
    (acc, b) => acc + Object.keys(b.declarations).filter((k) => k.startsWith('--mat-') && !k.startsWith('--mat-sys-')).length,
    0
  );
  const densityTokenCount = Object.keys(densityTemplates['-1'].find((b) => b.selector === 'html')?.declarations ?? {}).length;

  // Write `src/theme/m2-token-templates.ts`
  const tsContent = `/**
 * @fileoverview Auto-generated M2 token templates extracted at build time from Angular Material 22's
 * official M2 Sass API (\`mat.m2-define-light-theme\`, \`mat.m2-define-dark-theme\`, \`mat.m2-theme\`,
 * \`mat.all-component-bases\`, \`mat.all-component-colors\`, \`mat.all-component-densities\`,
 * \`mat.all-component-typographies\`) via 18-slot injective RGB sentinel palettes (ZERO HCT).
 * Regenerate via: \`node tools/m2-parity/generate-m2-tokens.mjs\`.
 * @zh 由 \`tools/m2-parity/generate-m2-tokens.mjs\` 基于 Angular Material 22 官方 M2 Sass API 与单射哨兵调色板自动生成的 M2 令牌模板。
 */

/**
 * Interface \`M2CssBlock\` representing a CSS selector and its property-value map.
 * @zh 接口 \`M2CssBlock\`，表示单个 CSS 选择器及其属性声明映射表。
 */
export interface M2CssBlock {
  /**
   * Property \`selector\` (\`string\`) storing CSS selector text.
   * @zh 属性 \`selector\`（类型：\`string\`），存储 CSS 选择器文本。
   */
  readonly selector: string;
  /**
   * Property \`declarations\` (\`Readonly<Record<string, string>>\`) storing CSS declarations.
   * @zh 属性 \`declarations\`（类型：\`Readonly<Record<string, string>>\`），存储 CSS 声明键值表。
   */
  readonly declarations: Readonly<Record<string, string>>;
}

/**
 * Type \`M2ThemeMode\` enumerating supported DotOS theme modes.
 * @zh 类型 \`M2ThemeMode\`，枚举支持的三种底色模式。
 */
export type M2ThemeMode = 'light' | 'dark' | 'darkblue';

/**
 * Type \`M2DensityKey\` enumerating supported DotOS density scales.
 * @zh 类型 \`M2DensityKey\`，枚举支持的三档密度键。
 */
export type M2DensityKey = '0' | '-1' | '-2';

/**
 * Type \`M2TypographyKey\` enumerating supported DotOS typography scales.
 * @zh 类型 \`M2TypographyKey\`，枚举支持的三档字阶配置名。
 */
export type M2TypographyKey = 'loose' | 'normal' | 'compact';

/**
 * Constant \`M2_BASE_BLOCKS\` storing unthemable M2 base tokens (4px shapes, app-background, elevation).
 * @zh 常量 \`M2_BASE_BLOCKS\`，存储不可主题化的 M2 基础组件令牌与海拔规则。
 */
export const M2_BASE_BLOCKS: readonly M2CssBlock[] = ${JSON.stringify(baseBlocks, null, 2)};

/**
 * Constant \`M2_COLOR_TEMPLATES\` storing sentinel-parameterized M2 color blocks for \`light\`, \`dark\`, and \`darkblue\`.
 * @zh 常量 \`M2_COLOR_TEMPLATES\`，存储三套底色（含 \`.mat-accent\`/\`.mat-warn\` 变体）的哨兵参数化 M2 色彩令牌模板。
 */
export const M2_COLOR_TEMPLATES: Readonly<Record<M2ThemeMode, readonly M2CssBlock[]>> = ${JSON.stringify(colorTemplates, null, 2)};

/**
 * Constant \`M2_DENSITY_TEMPLATES\` storing M2 density blocks for scales \`0\`, \`-1\`, and \`-2\`.
 * @zh 常量 \`M2_DENSITY_TEMPLATES\`，存储三档密度（\`0\` / \`-1\` / \`-2\`）的 M2 密度令牌表。
 */
export const M2_DENSITY_TEMPLATES: Readonly<Record<M2DensityKey, readonly M2CssBlock[]>> = ${JSON.stringify(densityTemplates, null, 2)};

/**
 * Constant \`M2_TYPOGRAPHY_TEMPLATES\` storing \`px\`-based M2 typography blocks for \`loose\`, \`normal\`, and \`compact\`.
 * @zh 常量 \`M2_TYPOGRAPHY_TEMPLATES\`，存储基于 \`px\` 的三档 M2 排版令牌表。
 */
export const M2_TYPOGRAPHY_TEMPLATES: Readonly<Record<M2TypographyKey, readonly M2CssBlock[]>> = ${JSON.stringify(typographyTemplates, null, 2)};
`;

  const tsOutPath = path.join(REPO_ROOT, 'src/theme/m2-token-templates.ts');
  fs.writeFileSync(tsOutPath, tsContent, 'utf8');

  // 5. Generate static `src/theming/_m2-system.scss` for apps importing `platform.scss` / `_all-theme.scss`
  // Default DotOS palette: primary = teal-600 (lighter 100, darker 900), accent = orange-800 (lighter 100, darker 900), warn = red-800 (lighter 100, darker 900)
  const staticDefaultScss = `
${sentinelPreamble}
$def-p: mat.m2-define-palette(mat.$m2-teal-palette, 600, 100, 900);
$def-a: mat.m2-define-palette(mat.$m2-orange-palette, 800, 100, 900);
$def-w: mat.m2-define-palette(mat.$m2-red-palette, 800, 100, 900);

$light-t: patch-dui-m2-mode(mat.m2-define-light-theme((
  color: (primary: $def-p, accent: $def-a, warn: $def-w),
  typography: $typo-compact,
  density: -2,
)), 'light');

$dark-t: patch-dui-m2-mode(mat.m2-define-dark-theme((
  color: (primary: $def-p, accent: $def-a, warn: $def-w),
)), 'dark');

$darkblue-t: patch-dui-m2-mode(mat.m2-define-dark-theme((
  color: (primary: $def-p, accent: $def-a, warn: $def-w),
)), 'darkblue');

html {
  @include mat.m2-theme($light-t);
  @include mat.all-component-bases($light-t);
  @include mat.all-component-colors($light-t);
  @include mat.all-component-typographies($light-t);
  @include mat.all-component-densities($light-t);
}
@include mat.app-background();
@include mat.elevation-classes();

html:where([data-theme='dark']) {
  @include mat.m2-theme($dark-t);
  @include mat.all-component-colors($dark-t);
}

html:where([data-theme='darkblue']) {
  @include mat.m2-theme($darkblue-t);
  @include mat.all-component-colors($darkblue-t);
}
`;
  const rawStaticBlocks = parseCssBlocks(compileSass(staticDefaultScss), liveVars);
  applyDensityOverrides(rawStaticBlocks, '-2');

  const densityNormalDecls = Object.entries(densityTemplates['-1'].find((b) => b.selector === 'html')?.declarations ?? {})
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  const densityLooseDecls = Object.entries(densityTemplates['0'].find((b) => b.selector === 'html')?.declarations ?? {})
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  const densityCompactDecls = Object.entries(densityTemplates['-2'].find((b) => b.selector === 'html')?.declarations ?? {})
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const serializedStaticBlocks = rawStaticBlocks
    .map(
      (b) =>
        `${b.selector} {\n${Object.entries(b.declarations)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')}\n}`
    )
    .join('\n\n');

  const staticScssOut = `// Auto-generated by tools/m2-parity/generate-m2-tokens.mjs from Angular Material 22 official M2 Sass API.
// Provides static M2 baseline tokens, light/dark/darkblue modes, 3 density scales, px M2 typography classes,
// and 7.4.52 structural S-5 rules (guarded to avoid duplicate emission when platform.scss & _all-theme.scss coexist).
$_dui_m2_system_emitted: false !default;

@if not $_dui_m2_system_emitted {
  $_dui_m2_system_emitted: true;

${serializedStaticBlocks}

html:where([data-density='compact']) {
${densityCompactDecls}
  input.mat-mdc-input-element { margin-top: .0078em !important; }
}
body:where(.dui-density-compact) {
${densityCompactDecls}
  .mat-mdc-card-header { padding-top: 6px !important; padding-bottom: 6px !important; padding-left: 6px !important; }
  .mat-mdc-menu-item { min-height: 36px !important; }
  .mat-mdc-option { min-height: 40px !important; }
  .mat-pseudo-checkbox { width: 16px !important; height: 16px !important; }
  input.mat-mdc-input-element { margin-top: .0078em !important; }
}

html:where([data-density='normal']) {
${densityNormalDecls}
  input.mat-mdc-input-element { margin-top: .0078em !important; }
}
body:where(.dui-density-normal) {
${densityNormalDecls}
  .mat-mdc-card-header { padding-top: 7px !important; padding-bottom: 7px !important; padding-left: 7px !important; }
  .mat-mdc-menu-item { min-height: 40px !important; }
  .mat-mdc-option { min-height: 44px !important; }
  .mat-pseudo-checkbox { width: 18px !important; height: 18px !important; }
  input.mat-mdc-input-element { margin-top: .0078em !important; }
}

html:where([data-density='loose']) {
${densityLooseDecls}
  input.mat-mdc-input-element { margin-top: -.0625em !important; }
}
body:where(.dui-density-loose) {
${densityLooseDecls}
  .mat-mdc-card-header { padding-top: 8px !important; padding-bottom: 8px !important; padding-left: 8px !important; }
  .mat-mdc-menu-item { min-height: 44px !important; }
  .mat-mdc-option { min-height: 48px !important; }
  .mat-pseudo-checkbox { width: 20px !important; height: 20px !important; }
  input.mat-mdc-input-element { margin-top: -.0625em !important; }
}

// 7.4.52 S-5 structural rules & px-based M2 typography classes (immune to html { font-size: 62.5% })
.mat-mdc-button { min-height: var(--mat-button-text-container-height); }
.mat-mdc-unelevated-button { min-height: var(--mat-button-filled-container-height); }
.mat-mdc-raised-button { min-height: var(--mat-button-protected-container-height, 32px); }
.mat-mdc-outlined-button { min-height: var(--mat-button-outlined-container-height); }
.mat-mdc-fab { width: var(--mat-fab-extended-container-height) !important; height: var(--mat-fab-extended-container-height) !important; }
.mat-mdc-fab.mat-mdc-button-disabled,
.mat-mdc-mini-fab.mat-mdc-button-disabled { box-shadow: var(--mat-fab-container-elevation-shadow) !important; }
.mat-mdc-icon-button.mat-mdc-button-base {
  width: var(--mat-icon-button-state-layer-size);
  height: var(--mat-icon-button-state-layer-size);
  padding: calc((var(--mat-icon-button-state-layer-size) - 24px) / 2);
}
.mat-mdc-icon-button.mat-mdc-button-disabled .mat-icon { color: var(--mat-icon-button-disabled-icon-color) !important; }
.mdc-card { color: var(--mat-card-subtitle-text-color); }
.mat-mdc-card-header { padding-top: 6px !important; padding-bottom: 6px !important; padding-left: 6px !important; }
.mat-mdc-card-header-text { width: 100%; }
.mat-mdc-text-field-wrapper { --mat-mdc-form-field-label-offset-x: -8px; }
.mat-mdc-text-field-wrapper .mdc-text-field__input { padding-left: 5px; }
.mat-mdc-input-element:disabled { color: var(--mat-form-field-filled-disabled-input-text-color); }
input.mat-mdc-input-element { color: var(--mat-form-field-filled-input-text-color); margin-top: .0078em !important; }
.mat-mdc-input-element { caret-color: var(--mat-form-field-filled-caret-color); }
.mat-mdc-input-element::placeholder { color: var(--mat-form-field-filled-input-text-placeholder-color); }
.mat-mdc-input-element::-webkit-input-placeholder { color: var(--mat-form-field-filled-input-text-placeholder-color); }
.mat-mdc-form-field-invalid .mat-mdc-input-element { caret-color: var(--mat-form-field-filled-error-caret-color); }
.mat-icon { color: var(--mat-icon-color); }
.mat-icon svg { stroke: var(--mat-icon-color) !important; }
.mat-mdc-menu-item { min-height: 36px !important; }
.mat-mdc-menu-item .mat-icon-no-color { color: var(--mat-icon-color) !important; }
.mat-mdc-option { min-height: 40px !important; }
.mat-mdc-dialog-container { box-shadow: var(--mat-dialog-container-elevation-shadow); }
.mat-list .mat-mdc-list-base .mdc-list-item--disabled .mdc-list-item__start,
.mat-list .mat-mdc-list-base .mdc-list-item--disabled .mdc-list-item__content,
.mat-list .mat-mdc-list-base .mdc-list-item--disabled .mdc-list-item__end { opacity: 1; }

.mat-h1, .mat-headline, .mat-typography .mat-h1, .mat-typography .mat-headline, .mat-typography h1 { font: 400 20px / 20px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0 0 9px; }
.mat-h2, .mat-typography .mat-h2, .mat-typography h2 { font: 400 18px / 18px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0 0 9px; }
.mat-title, .mat-h3, .mat-subheading-2, .mat-typography .mat-title, .mat-typography .mat-h3, .mat-typography .mat-subheading-2, .mat-typography h3 { font: 400 14px / 20px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0 0 9px; }
.mat-h4, .mat-subheading-1, .mat-typography .mat-h4, .mat-typography .mat-subheading-1, .mat-typography h4 { font: 400 13px / 20px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0 0 9px; }
.mat-h5, .mat-typography .mat-h5, .mat-typography h5 { font: 400 11.62px / 16px Roboto, "Helvetica Neue", sans-serif; margin: 0 0 9px; }
.mat-h6, .mat-typography .mat-h6, .mat-typography h6 { font: 400 9.38px / 16px Roboto, "Helvetica Neue", sans-serif; margin: 0 0 9px; }
.mat-body-strong, .mat-body-2, .mat-typography .mat-body-strong, .mat-typography .mat-body-2 { font: 500 14px / 20px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0; }
.mat-body, .mat-body-1, .mat-typography, .mat-typography .mat-body, .mat-typography .mat-body-1 { font: 400 14px / 16px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0; }
.mat-body p, .mat-body-1 p, .mat-typography p { margin: 0 0 9px; }
.mat-small, .mat-caption, .mat-typography .mat-small, .mat-typography .mat-caption { font: 400 12px / 18px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; }
.mat-display-4, .mat-typography .mat-display-4 { font: 300 90px / 90px Roboto, "Helvetica Neue", sans-serif; letter-spacing: -0.05em; margin: 0 0 42px; }
.mat-display-3, .mat-typography .mat-display-3 { font: 400 44px / 44px Roboto, "Helvetica Neue", sans-serif; letter-spacing: -0.02em; margin: 0 0 48px; }
.mat-display-2, .mat-typography .mat-display-2 { font: 400 36px / 38px Roboto, "Helvetica Neue", sans-serif; letter-spacing: -0.005em; margin: 0 0 48px; }
.mat-display-1, .mat-typography .mat-display-1 { font: 400 28px / 28px Roboto, "Helvetica Neue", sans-serif; letter-spacing: normal; margin: 0 0 48px; }
}
`;

  const scssOutPath = path.join(REPO_ROOT, 'src/theming/_m2-system.scss');
  fs.writeFileSync(scssOutPath, staticScssOut, 'utf8');

  console.log(
    JSON.stringify(
      {
        status: 'OK',
        liveVarsCount: liveVars.size,
        baseBlocksCount: baseBlocks.length,
        lightColorBlocks: colorTemplates.light.length,
        darkColorBlocks: colorTemplates.dark.length,
        darkblueColorBlocks: colorTemplates.darkblue.length,
        lightComponentColorDeclarations: lightColorTokenCount,
        densityTokenCountPerScale: densityTokenCount,
        tsOutPath: path.relative(REPO_ROOT, tsOutPath),
        scssOutPath: path.relative(REPO_ROOT, scssOutPath),
      },
      null,
      2
    )
  );
}

generate();
