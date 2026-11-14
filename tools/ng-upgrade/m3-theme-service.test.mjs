#!/usr/bin/env node
/**
 * M1-2 单元测试：验证零 JSS 原生 M3 ThemeService、Signal<ResolvedTheme>、adoptedStyleSheets 与嵌套规则序列化
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const require = createRequire(path.join(repoRoot, 'package.json'));
const esbuild = require('esbuild');

// Bundle src/theme/theme.service.ts in-memory with tsconfig paths for fast, deterministic Node unit testing
const buildRes = esbuild.buildSync({
  entryPoints: [path.join(repoRoot, 'src/theme/theme.service.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  tsconfig: path.join(repoRoot, 'tsconfig.json'),
});

const cjsSource = buildRes.outputFiles[0].text;
const mod = { exports: {} };
const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', cjsSource);
fn(mod.exports, require, mod, path.join(repoRoot, 'src/theme/theme.service.ts'), path.join(repoRoot, 'src/theme'));

const {
  ThemeService,
  computeM3SystemVariables,
  resolveThemeHexColor,
  serializeThemeRulesToCss,
} = mod.exports;

function createMockDom(withAdoptedSheets = true) {
  const styleProps = new Map();
  const attrs = new Map();
  const bodyClasses = new Set();
  const headChildren = [];

  class MockCSSStyleSheet {
    constructor() {
      this.cssText = '';
    }
    replaceSync(text) {
      this.cssText = text;
    }
  }

  const doc = {
    adoptedStyleSheets: withAdoptedSheets ? [] : undefined,
    documentElement: {
      style: {
        colorScheme: '',
        setProperty(k, v) {
          styleProps.set(k, v);
        },
        getPropertyValue(k) {
          return styleProps.get(k) || '';
        },
      },
      setAttribute(k, v) {
        attrs.set(k, v);
      },
      getAttribute(k) {
        return attrs.get(k) || null;
      },
    },
    body: {
      classList: {
        add(...cls) {
          cls.forEach((c) => bodyClasses.add(c));
        },
        remove(...cls) {
          cls.forEach((c) => bodyClasses.delete(c));
        },
        contains(c) {
          return bodyClasses.has(c);
        },
      },
    },
    head: {
      appendChild(el) {
        el.parentNode = doc.head;
        el.isConnected = true;
        headChildren.push(el);
      },
      removeChild(el) {
        const idx = headChildren.indexOf(el);
        if (idx >= 0) headChildren.splice(idx, 1);
        el.parentNode = null;
        el.isConnected = false;
      },
    },
    createElement(tag) {
      const elAttrs = new Map();
      return {
        tagName: tag.toUpperCase(),
        textContent: '',
        parentNode: null,
        isConnected: false,
        setAttribute(k, v) {
          elAttrs.set(k, v);
        },
        getAttribute(k) {
          return elAttrs.get(k) || null;
        },
      };
    },
  };

  return { doc, MockCSSStyleSheet, styleProps, attrs, bodyClasses, headChildren };
}

test('resolveThemeHexColor 同时支持历史色名 (teal-600) 与任意 #HEX', () => {
  assert.equal(resolveThemeHexColor('teal-600', '#000000'), '#00897b');
  assert.equal(resolveThemeHexColor('orange-800', '#000000'), '#ef6c00');
  assert.equal(resolveThemeHexColor('#1E88E5', '#000000'), '#1e88e5');
  assert.equal(resolveThemeHexColor('#abc', '#000000'), '#aabbcc');
  assert.equal(resolveThemeHexColor('unknown-color', '#123456'), '#123456');
});

test('computeM3SystemVariables 正确生成 light / dark / darkblue 的 --mat-sys-* 与 --dui-* 令牌', () => {
  const lightVars = computeM3SystemVariables('#00897b', '#ef6c00', '#c62828', 'light');
  assert.ok(lightVars['--mat-sys-primary'].startsWith('#'));
  assert.equal(lightVars['--dui-primary'], lightVars['--mat-sys-primary']);

  const darkBlueVars = computeM3SystemVariables('#00897b', '#ef6c00', '#c62828', 'darkblue');
  assert.equal(darkBlueVars['--mat-sys-background'], '#0b1628');
  assert.equal(darkBlueVars['--mat-sys-surface'], '#0b1628');
  assert.equal(darkBlueVars['--mat-sys-surface-container'], '#11223d');
  assert.equal(darkBlueVars['--mat-sys-on-surface'], '#e2e8f6');
});

test('serializeThemeRulesToCss 支持多层 & 嵌套、前缀 &、@media、数值单位与属性名去空白', () => {
  const css = serializeThemeRulesToCss({
    '@global': {
      '.dui-chip': {
        ' background-color': '#fff',
        height: 32,
        opacity: 0.85,
        zIndex: 1000,
        '&:hover, &.active': {
          color: '#00897b',
          '[dir="rtl"] &': {
            paddingLeft: 8,
          },
        },
      },
      '@media (min-width: 480px)': {
        '.dui-chip': {
          width: 120,
        },
      },
    },
  });
  assert.match(css, /\.dui-chip \{\s*background-color: #fff;\s*height: 32px;\s*opacity: 0\.85;\s*z-index: 1000;\s*\}/);
  assert.match(css, /\.dui-chip:hover, \.dui-chip\.active \{\s*color: #00897b;\s*\}/);
  assert.match(css, /\[dir="rtl"\] \.dui-chip:hover, \[dir="rtl"\] \.dui-chip\.active \{\s*padding-left: 8px;\s*\}/);
  assert.match(css, /@media \(min-width: 480px\)/);
});

test('ThemeService 零 JSS 挂载 adoptedStyleSheets、响应式更新 tokens() Signal 且零 data-jss 节点', () => {
  const { doc, MockCSSStyleSheet, styleProps, attrs, bodyClasses, headChildren } = createMockDom(true);
  globalThis.document = doc;
  globalThis.CSSStyleSheet = MockCSSStyleSheet;

  try {
    const mockStore = { get: () => null };
    const svc = new ThemeService(mockStore);
    svc.refreshTheme();

    assert.equal(attrs.get('data-theme'), 'light');
    assert.equal(svc.tokens().type, 'light');
    assert.equal(svc.tokens().density, -2);
    assert.ok(bodyClasses.has('dui-density-compact'));
    assert.ok(doc.adoptedStyleSheets.length >= 2, '应挂载 core + materialTheme 两张原生样式表');
    assert.equal(headChildren.filter((el) => el.getAttribute('data-jss') !== null).length, 0);

    // 动态加载组件级 themeFn
    const customThemeFn = (theme) => ({
      '.custom-widget': {
        borderColor: theme.primary.default,
        '&:hover': { opacity: 0.9 },
      },
    });
    svc.loadTheme(customThemeFn);
    const countAfterLoad = doc.adoptedStyleSheets.length;
    assert.equal(countAfterLoad, 3);

    // 切换至 darkblue + loose + #HEX 主色
    svc.changeTheme('#1e88e5', '#fb8c00', '#e53935', 'darkblue', 'loose', 'outline');
    assert.equal(attrs.get('data-theme'), 'darkblue');
    assert.equal(styleProps.get('--mat-sys-background'), '#0b1628');
    assert.equal(svc.tokens().type, 'darkblue');
    assert.equal(svc.tokens().density, 0);
    assert.equal(svc.tokens().primaryHex, '#1e88e5');
    assert.equal(svc.getFormType(), 'outline');
    assert.ok(bodyClasses.has('dui-density-loose'));
    assert.ok(!bodyClasses.has('dui-density-compact'));
    assert.equal(doc.adoptedStyleSheets.length, 3, '重复切换主题不应泄漏多余 adoptedStyleSheets');
  } finally {
    delete globalThis.document;
    delete globalThis.CSSStyleSheet;
  }
});

test('ThemeService 在不支持 adoptedStyleSheets 的环境下自动回退至 <style data-dui-sheet>', () => {
  const { doc, headChildren } = createMockDom(false);
  globalThis.document = doc;
  delete globalThis.CSSStyleSheet;

  try {
    const svc = new ThemeService({ get: () => null });
    svc.refreshTheme();
    assert.equal(headChildren.length, 2);
    assert.ok(headChildren[0].getAttribute('data-dui-sheet')?.startsWith('dui-sheet-'));
    assert.equal(headChildren.filter((el) => el.getAttribute('data-jss') !== null).length, 0);
  } finally {
    delete globalThis.document;
  }
});
