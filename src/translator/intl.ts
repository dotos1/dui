/**
 * 国际化格式化 —— 原生 `Intl` 版。
 *
 * <p>自研实现,基于原生 `Intl`。
 *
 * <p><b>为什么能只写这么点。</b>旧实现带着一整套 CLDR 装载机制,而
 * `cldrData` 在本仓库里<u>始终是空对象</u> —— 没有一处调过 `loadCldr`。
 * 也就是说那 2,942 行一直跑在 en-US 的内置兜底路径上,等价于原生
 * `Intl` 的 `'en-US'`。真正需要自己实现的只有一件事:
 * <b>把旧格式串方言翻成 `Intl` 的选项</b>。
 *
 * <p><b>方言范围是枚举出来的,不是猜的</b>(`tools/intl/matrix.mjs` 记着出处):
 *
 * <ul>
 *   <li>后端下发六种日期串:`yyyy/MM/dd`、`yyyy/MM/dd HH:mm:ss`、
 *       `yyyy/MM/dd HH:mm`、`yyyy/MM`、`yyyy`、`yMd`;</li>
 *   <li>应用里写死的:`y/M/d`、`y/M/d H:m:s`、`MMM dd, y`、`mediumDate`;</li>
 *   <li>数值:`C2` 一种,外加透视表传的 `{ minimumFractionDigits }` 对象形态。</li>
 * </ul>
 *
 * <p>门在 `tools/intl/gate.mjs`:期望值由**旧实现**算出(158 条),不是我写的。

 * @zh 国际化格式化 —— 原生 `Intl` 版。
 */

/* ── 类型 ────────────────────────────────────────────────────────────────── */

export interface DateFormatOptions {
  /**
   * Property `type` (`string`) storing type.
   * `'date'` / `'time'` / `'datetime'`。
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?: string;
  /**
   * Property `format` (`string`) storing format.
   * 具体模式串,如 `'yyyy/MM/dd'`。给了它就以它为准。
   * @zh 具体模式串,如 `'yyyy/MM/dd'`。给了它就以它为准。
   */
  format?: string;
  /**
   * Property `skeleton` (`string`) storing skeleton.
   * 骨架名,如 `'yMd'` / `'short'` / `'medium'`。`format` 缺席时才看它。
   * @zh 骨架名,如 `'yMd'` / `'short'` / `'medium'`。`format` 缺席时才看它。
   */
  skeleton?: string;
  /**
   * Property `calendar` (`string`) storing calendar.
   * @zh 属性 `calendar`（类型：`string`），用于存储或配置日历。
   */
  calendar?: string;
}

/**
 * Interface `NumberFormatOptions` defining the contract and properties for number format options.
 * @zh 接口 `NumberFormatOptions`，定义数字格式化配置选项的数据结构契约与属性规范。
 */
export interface NumberFormatOptions {
  /**
   * Property `format` (`string`) storing format.
   * 格式串:`'C2'` / `'N'` / `'P2'` / `'#,##0.00'` ……
   * @zh 格式串:`'C2'` / `'N'` / `'P2'` / `'#,##0.00'` ……
   */
  format?: string;
  /**
   * Property `minimumFractionDigits` (`number`) storing minimum fraction digits.
   * @zh 属性 `minimumFractionDigits`（类型：`number`），用于存储或配置minimumFraction数字位。
   */
  minimumFractionDigits?: number;
  /**
   * Property `maximumFractionDigits` (`number`) storing maximum fraction digits.
   * @zh 属性 `maximumFractionDigits`（类型：`number`），用于存储或配置maximumFraction数字位。
   */
  maximumFractionDigits?: number;
  /**
   * Property `minimumIntegerDigits` (`number`) storing minimum integer digits.
   * @zh 属性 `minimumIntegerDigits`（类型：`number`），用于存储或配置minimumInteger数字位。
   */
  minimumIntegerDigits?: number;
  /**
   * Property `minimumSignificantDigits` (`number`) storing minimum significant digits.
   * @zh 属性 `minimumSignificantDigits`（类型：`number`），用于存储或配置minimumSignificant数字位。
   */
  minimumSignificantDigits?: number;
  /**
   * Property `maximumSignificantDigits` (`number`) storing maximum significant digits.
   * @zh 属性 `maximumSignificantDigits`（类型：`number`），用于存储或配置maximumSignificant数字位。
   */
  maximumSignificantDigits?: number;
  /**
   * Property `useGrouping` (`boolean`) storing use grouping.
   * @zh 属性 `useGrouping`（类型：`boolean`），用于存储或配置使用分组。
   */
  useGrouping?: boolean;
  /**
   * Property `currency` (`string`) storing currency.
   * @zh 属性 `currency`（类型：`string`），用于存储或配置currency。
   */
  currency?: string;
}

/**
 * Constant/variable `默认区域` defining 默认区域 in `src/translator`.
 * 默认区域。旧实现的 `defaultCulture`,`setCulture()` 可改。
 * @zh 默认区域。旧实现的 `defaultCulture`,`setCulture()` 可改。
 */
let 默认区域 = 'en-US';
/**
 * Constant/variable `默认币种` defining 默认币种 in `src/translator`.
 * @zh 常量/变量 `默认币种`，定义 `src/translator` 中的默认币种。
 */
let 默认币种 = 'USD';

/**
 * Executes `setCulture` to handle set culture.
 * @zh 执行 `setCulture`，用于集合Culture。
 * @param cultureName - culture name parameter (`string`) / culture名称参数（`string`）
 */
export function setCulture(cultureName: string): void { 默认区域 = cultureName; }
/**
 * Executes `setCurrencyCode` to handle set currency code.
 * @zh 执行 `setCurrencyCode`，用于集合Currency编码。
 * @param currencyCode - currency code parameter (`string`) / currency编码参数（`string`）
 */
export function setCurrencyCode(currencyCode: string): void { 默认币种 = currencyCode; }

/* ── 日期 ────────────────────────────────────────────────────────────────── */

/**
 * 骨架 → 模式串。
 *
 * <p>这几条**不是从 CLDR 推的,是从旧实现的实际输出反推的**(空 CLDR 下
 * 走内置兜底),门里逐条比过。

 * @zh 骨架 → 模式串。
 */
const 骨架表: Record<string, string> = {
  'short': 'M/d/yy',
  'medium': 'MMM d, y',
  'long': 'MMMM d, y',
  'full': 'EEEE, MMMM d, y',
  'yMd': 'M/d/y',
  'yMEd': 'EEE, M/d/y',
  'yMMMd': 'MMM d, y',
  'yMMMMd': 'MMMM d, y',
  'yMMM': 'MMM y',
  'yMM': 'M/y',
  'yM': 'M/y',
  'Md': 'M/d',
  'MMMd': 'MMM d',
  'y': 'y',
  'hm': 'h:mm a',
  'hms': 'h:mm:ss a',
  'Hm': 'HH:mm',
  'Hms': 'HH:mm:ss',
};

/**
 * `type: 'datetime'` 时骨架的另一套解释。
 *
 * <p><b>这不是笔误,是旧行为。</b>`{ type:'datetime', skeleton:'short' }`
 * 旧实现给出的是 `8/22/2026` —— 不带时间,而且年份是四位,
 * 与 `{ type:'date', skeleton:'short' }` 的 `8/22/26` 都不一样。
 * 原因是空 CLDR 下 `dateTimeFormat` 的兜底串把日期部分退回了 `yMd`。
 *
 * <p>看着不合直觉,所以第一版按"骨架表查一次就完"写,门当场红了四条。
 * 记在这里免得下一个人再"顺手改回去"。

 * @zh `type: 'datetime'` 时骨架的另一套解释。
 */
const 骨架表_datetime: Record<string, string> = {
  'short': 'M/d/y',
};

/**
 * Constant/variable `月简` defining 月简 in `src/translator`.
 * @zh 常量/变量 `月简`，定义 `src/translator` 中的月简。
 */
const 月简 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * Constant/variable `月全` defining 月全 in `src/translator`.
 * @zh 常量/变量 `月全`，定义 `src/translator` 中的月全。
 */
const 月全 = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
/**
 * Constant/variable `周简` defining 周简 in `src/translator`.
 * @zh 常量/变量 `周简`，定义 `src/translator` 中的周简。
 */
const 周简 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/**
 * Constant/variable `周全` defining 周全 in `src/translator`.
 * @zh 常量/变量 `周全`，定义 `src/translator` 中的周全。
 */
const 周全 = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Constant/variable `补` defining 补 in `src/translator`.
 * @zh 常量/变量 `补`，定义 `src/translator` 中的补。
 */
const 补 = (n: number, w: number): string => String(n).padStart(w, '0');

/**
 * 按模式串格式化。
 *
 * <p>`'…'` 之间是字面量(CLDR 的转义写法),其余连续同字母算一个字段。
 * 未识别的字母**原样输出**而不是抛 —— 与旧实现一致:一个没见过的模式串
 * 应该让人在界面上看见怪字符去查,而不是让整张表崩掉。

 * @zh 按模式串格式化。
 */
function 按模式(d: Date, pattern: string): string {
  let out = '';
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i];

    if (c === "'") {                       // 字面量
      let j = i + 1;
      while (j < pattern.length && pattern[j] !== "'") { j++; }
      out += pattern.slice(i + 1, j);
      i = j + 1;
      continue;
    }

    let n = 1;
    while (i + n < pattern.length && pattern[i + n] === c) { n++; }
    const 段 = pattern.substr(i, n);
    i += n;

    switch (c) {
      case 'y': out += n === 2 ? 补(d.getFullYear() % 100, 2) : 补(d.getFullYear(), n); break;
      case 'M':
        out += n >= 4 ? 月全[d.getMonth()] : n === 3 ? 月简[d.getMonth()] : 补(d.getMonth() + 1, n);
        break;
      case 'd': out += 补(d.getDate(), n); break;
      case 'E': out += n >= 4 ? 周全[d.getDay()] : 周简[d.getDay()]; break;
      case 'H': out += 补(d.getHours(), n); break;
      case 'h': out += 补(d.getHours() % 12 === 0 ? 12 : d.getHours() % 12, n); break;
      case 'm': out += 补(d.getMinutes(), n); break;
      case 's': out += 补(d.getSeconds(), n); break;
      case 'S': out += 补(d.getMilliseconds(), n).slice(0, n); break;
      case 'a': out += d.getHours() < 12 ? 'AM' : 'PM'; break;
      default: out += 段; break;
    }
  }
  return out;
}

/* ── 数值 ────────────────────────────────────────────────────────────────── */

/**
 * Executes `数值选项` to handle 数值选项.
 * 数值格式串 → `Intl.NumberFormatOptions`。
 *
 * <p>两类:
 * <ol>
 *   <li><b>标准串</b> `C` / `N` / `P` + 可选位数。`C` 是货币,`P` 是百分比,
 *       `N` 是十进制。不给位数时:`C` 两位、`P` 零位、`N` 最多三位 ——
 *       这三个默认值是旧实现的,门里逐条比过。</li>
 *   <li><b>自定义串</b> 形如 `#,##0.00` / `0.00`。只看两件事:
 *       有没有 `,`(决定分组)、小数点后有几个 `0`(决定位数)。
 *       旧实现支持更多(前后缀、分段、科学计数),但本仓库一处都没用过。</li>
 * </ol>

 * @zh 数值格式串 → `Intl.NumberFormatOptions`。
 */
function 数值选项(fmt: string, currency?: string): Intl.NumberFormatOptions {
  const 标准 = /^([CNPcnp])([0-9]*)$/.exec(fmt.trim());
  if (标准) {
    const 类 = 标准[1].toUpperCase();
    const 位 = 标准[2] === '' ? undefined : Number(标准[2]);
    if (类 === 'C') {
      return {
        style: 'currency', currency: currency || 默认币种,
        minimumFractionDigits: 位 ?? 2, maximumFractionDigits: 位 ?? 2,
      };
    }
    if (类 === 'P') {
      return { style: 'percent', minimumFractionDigits: 位 ?? 0, maximumFractionDigits: 位 ?? 0 };
    }
    return { minimumFractionDigits: 位 ?? 0, maximumFractionDigits: 位 ?? 3 };
  }

  // 自定义串
  const 百分 = fmt.indexOf('%') !== -1;
  const 点 = fmt.indexOf('.');
  const 小数位 = 点 === -1 ? 0 : (fmt.slice(点 + 1).match(/[0#]/g) ?? []).length;
  const 整数部 = 点 === -1 ? fmt : fmt.slice(0, 点);
  return {
    style: 百分 ? 'percent' : 'decimal',
    useGrouping: 整数部.indexOf(',') !== -1,
    minimumFractionDigits: 小数位,
    maximumFractionDigits: 小数位,
  };
}

/* ── 门面 ────────────────────────────────────────────────────────────────── */

/**
 * Class `Internationalization` encapsulating internationalization data structures and logic in `src/translator`.
 * 与旧 `Internationalization` 同名同签名的门面。
 *
 * <p>只实现 `getDateFormat` / `getNumberFormat` —— 全仓库唯一的使用者是
 * `@dotos/duix/grid` 的 `core/format.ts`,它只调这两个。
 * 旧类还有 `getDateParser` / `getNumberParser` / `formatDate` / `parseDate` …,
 * <b>全部零使用者</b>,不重建(`PEEL-GUIDE.md` §门 4h 的反面:
 * 「没人用」不是不迁的理由,但也不是"照搬一份"的理由 —— 迁的是有人用的)。

 * @zh 与旧 `Internationalization` 同名同签名的门面。
 */
export class Internationalization {
  /**
   * Property `culture` (`string`) storing culture.
   * @zh 属性 `culture`（类型：`string`），用于存储或配置culture。
   */
  culture?: string;

  /**
   * Creates an instance of `Internationalization` and initializes its dependencies and internal state.
   * @zh 创建 `Internationalization` 实例，并初始化其依赖项与内部状态。
   * @param cultureName - Injected or initial culture name (`string`) / 注入或传入的culture名称（`string`）
   */
  constructor(cultureName?: string) { if (cultureName) { this.culture = cultureName; } }

  /**
   * Executes `getCulture` to handle get culture.
   * @zh 执行 `getCulture`，用于获取Culture。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getCulture(): string { return this.culture || 默认区域; }

  /**
   * Executes `getDateFormat` to handle get date format.
   * 造日期格式化函数。`format` 优先,其次 `skeleton`,都没有就退回 `yMd`。
   * @zh 造日期格式化函数。`format` 优先,其次 `skeleton`,都没有就退回 `yMd`。
   */
  getDateFormat(options?: DateFormatOptions): (value: Date) => string {
    const o = options ?? {};
    const sk = o.skeleton ?? '';
    const pattern = o.format
      ? o.format
      : (o.type === 'datetime' ? 骨架表_datetime[sk] : undefined)
        ?? 骨架表[sk]
        ?? 骨架表[o.type === 'datetime' ? 'yMd' : 'short'];
    return (value: Date): string => {
      const d = value instanceof Date ? value : new Date(value as never);
      return isNaN(d.getTime()) ? '' : 按模式(d, pattern);
    };
  }

  /**
   * Executes `getNumberFormat` to handle get number format.
   * 造数值格式化函数。
   * @zh 造数值格式化函数。
   */
  getNumberFormat(options?: NumberFormatOptions): (value: number) => string {
    const o = options ?? {};
    const intlOpts: Intl.NumberFormatOptions = o.format
      ? 数值选项(o.format, o.currency)
      : {
        minimumFractionDigits: o.minimumFractionDigits,
        maximumFractionDigits: o.maximumFractionDigits,
        minimumIntegerDigits: o.minimumIntegerDigits,
        minimumSignificantDigits: o.minimumSignificantDigits,
        maximumSignificantDigits: o.maximumSignificantDigits,
        useGrouping: o.useGrouping,
      };
    for (const k of Object.keys(intlOpts)) {
      if ((intlOpts as Record<string, unknown>)[k] === undefined) {
        delete (intlOpts as Record<string, unknown>)[k];
      }
    }
    const nf = new Intl.NumberFormat(this.getCulture(), intlOpts);
    return (value: number): string => {
      const n = typeof value === 'number' ? value : Number(value);
      return isNaN(n) ? '' : nf.format(n);
    };
  }

  /**
   * Executes `formatDate` to handle format date.
   * @zh 执行 `formatDate`，用于格式化日期。
   * @param value - value parameter (`Date`) / 值参数（`Date`）
   * @param options - options parameter (`DateFormatOptions`) / 配置选项参数（`DateFormatOptions`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  formatDate(value: Date, options?: DateFormatOptions): string { return this.getDateFormat(options)(value); }
  /**
   * Executes `formatNumber` to handle format number.
   * @zh 执行 `formatNumber`，用于格式化数字。
   * @param value - value parameter (`number`) / 值参数（`number`）
   * @param options - options parameter (`NumberFormatOptions`) / 配置选项参数（`NumberFormatOptions`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  formatNumber(value: number, options?: NumberFormatOptions): string { return this.getNumberFormat(options)(value); }
}
