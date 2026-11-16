/**
 * @fileoverview Module `src/form/components/flex-style.util.ts` providing native CSS Flexbox calculation utilities for form items.
 * @zh 模块文件 `src/form/components/flex-style.util.ts`，提供表单子项在 `row wrap` 容器下的原生 CSS Flex 样式计算工具。
 */

function padCalcOperators(calc: string): string {
  return calc.replace(/\s/g, '').replace(/[/*+-]/g, ' $& ');
}

function splitFlexParts(raw: string): [string, string, string] {
  const j = raw.indexOf('calc');
  if (j > 0) {
    const basis = padCalcOperators(raw.substring(j).trim());
    const prefix = raw.substring(0, j).trim().split(/\s+/);
    if (prefix.length === 2) {
      return [prefix[0], prefix[1], basis];
    }
    return ['1', '1', basis];
  }
  if (j === 0) {
    return ['1', '1', padCalcOperators(raw.trim())];
  }
  const matches = raw.trim().split(/\s+/);
  if (matches.length === 3) {
    return [matches[0], matches[1], matches[2]];
  }
  return ['1', '1', raw.trim()];
}

/**
 * Computes native CSS flex styles equivalent to `[fxFlex]` inside a `row wrap` flex container.
 * @zh 计算在 `row wrap` 弹性容器内与原 `[fxFlex]` 完全等价的原生 CSS Flex 样式。
 * @param input - input parameter (`string | number`) / 弹性宽度配置参数（`string | number`）
 * @returns Result of type `Record<string, string>` / 类型为 `Record<string, string>` 的返回值
 */
export function buildRowWrapFlexStyle(input: string | number | undefined): Record<string, string> {
  const cleaned = input == null ? '' : String(input).replace(/;/g, '').trim();
  const [rawGrow, rawShrink, rawBasis] = splitFlexParts(cleaned);
  let grow = rawGrow;
  let shrink = rawShrink;
  let basis = rawBasis;

  const hasCalc = basis.includes('calc');
  const usingCalc = hasCalc || basis === 'auto';
  const isPercent = basis.includes('%') && !hasCalc;
  const hasUnits =
    basis.includes('px') ||
    basis.includes('rem') ||
    basis.includes('em') ||
    basis.includes('vw') ||
    basis.includes('vh');
  let isValue = hasCalc || hasUnits;

  const isFixed = grow === '0' && shrink === '0';

  switch (basis) {
    case '':
      basis = '0%';
      break;
    case 'initial':
    case 'nogrow':
      grow = '0';
      basis = 'auto';
      break;
    case 'grow':
      basis = '100%';
      break;
    case 'noshrink':
      shrink = '0';
      basis = 'auto';
      break;
    case 'auto':
      break;
    case 'none':
      grow = '0';
      shrink = '0';
      basis = 'auto';
      break;
    default:
      if (!isValue && !isPercent && basis !== '' && !Number.isNaN(Number(basis))) {
        basis = `${basis}%`;
      }
      if (basis === '0%') {
        isValue = true;
      }
      if (basis === '0px') {
        basis = '0%';
        isValue = true;
      }
      break;
  }

  let minWidth: string | null = null;
  let maxWidth: string | null = null;
  if (basis !== '0%' && basis !== '0px' && basis !== 'auto') {
    if (isFixed || (isValue && grow !== '0')) {
      minWidth = basis;
    }
    if (isFixed || (!usingCalc && shrink !== '0')) {
      maxWidth = basis;
    }
  }

  const effectiveBasis = maxWidth ?? minWidth ?? basis;
  const css: Record<string, string> = {
    'box-sizing': 'border-box',
  };
  if (hasCalc) {
    css['flex-grow'] = grow;
    css['flex-shrink'] = shrink;
    css['flex-basis'] = effectiveBasis;
  } else {
    css['flex'] = `${grow} ${shrink} ${effectiveBasis}`;
  }
  if (minWidth) {
    css['min-width'] = minWidth;
  }
  if (maxWidth) {
    css['max-width'] = maxWidth;
  }
  return css;
}
