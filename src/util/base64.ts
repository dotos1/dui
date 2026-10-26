/**
 * @fileoverview Module `src/util/base64.ts` providing base64 definitions and implementation.
 * @zh 模块文件 `src/util/base64.ts`，提供base64相关的定义与实现。
 */

/* tslint:disable */

/**
 * Constant/variable `ALPHA` defining alpha in `src/util`.
 * @zh 常量/变量 `ALPHA`，定义 `src/util` 中的透明度。
 */
const ALPHA =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Class `Base64` encapsulating base64 data structures and logic in `src/util`.
 * @zh 类 `Base64`，封装 `src/util` 中的Base64数据结构与处理逻辑。
 */
export class Base64 {
  /**
   * Property `PADCHAR` (`string`) storing padchar (default: `'='`).
   * @zh 属性 `PADCHAR`（类型：`string`），用于存储或配置PADCHAR（默认值：`'='`）。
   */
  private static PADCHAR: string = '=';
  /**
   * Property `ALPHA` (`string`) storing alpha (default: `ALPHA`).
   * @zh 属性 `ALPHA`（类型：`string`），用于存储或配置透明度（默认值：`ALPHA`）。
   */
  private static ALPHA: string = ALPHA;

  /**
   * Executes `getByte` to handle get byte.
   * @zh 执行 `getByte`，用于获取Byte。
   * @param s - s parameter (`string`) / s参数（`string`）
   * @param i - i parameter (`number`) / i参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private static getByte(s: string, i: number): number {
    const x = s.charCodeAt(i);
    return x;
  }

  /**
   * Executes `getByte64` to handle get byte64.
   * @zh 执行 `getByte64`，用于获取Byte64。
   * @param s - s parameter (`string`) / s参数（`string`）
   * @param i - i parameter (`number`) / i参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private static getByte64(s: string, i: number): number {
    const idx = this.ALPHA.indexOf(s.charAt(i));
    return idx;
  }

  /**
   * Executes `decode` to handle decode.
   * @zh 执行 `decode`，用于解码。
   * @param s - s parameter (`string`) / s参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static decode(s: string): string {
    let pads = 0,
      i,
      b10,
      imax = s.length,
      x = [];

    s = String(s);

    if (imax === 0) {
      return s;
    }

    if (s.charAt(imax - 1) === this.PADCHAR) {
      pads = 1;
      if (s.charAt(imax - 2) === this.PADCHAR) {
        pads = 2;
      }
      imax -= 4;
    }

    for (i = 0; i < imax; i += 4) {
      b10 =
        (this.getByte64(s, i) << 18) |
        (this.getByte64(s, i + 1) << 12) |
        (this.getByte64(s, i + 2) << 6) |
        this.getByte64(s, i + 3);
      x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
    }

    switch (pads) {
      case 1:
        b10 =
          (this.getByte64(s, i) << 18) |
          (this.getByte64(s, i + 1) << 12) |
          (this.getByte64(s, i + 2) << 6);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
        break;
      case 2:
        b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
        x.push(String.fromCharCode(b10 >> 16));
        break;
    }

    return x.join('');
  }

  /**
   * Executes `encode` to handle encode.
   * @zh 执行 `encode`，用于编码。
   * @param s - s parameter (`string`) / s参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static encode(s: string): string {
    s = String(s);

    let i,
      b10,
      x = [],
      imax = s.length - s.length % 3;

    if (s.length === 0) {
      return s;
    }

    for (i = 0; i < imax; i += 3) {
      b10 =
        (this.getByte(s, i) << 16) |
        (this.getByte(s, i + 1) << 8) |
        this.getByte(s, i + 2);
      x.push(this.ALPHA.charAt(b10 >> 18));
      x.push(this.ALPHA.charAt((b10 >> 12) & 63));
      x.push(this.ALPHA.charAt((b10 >> 6) & 63));
      x.push(this.ALPHA.charAt(b10 & 63));
    }

    switch (s.length - imax) {
      case 1:
        b10 = this.getByte(s, i) << 16;
        x.push(
          this.ALPHA.charAt(b10 >> 18) +
            this.ALPHA.charAt((b10 >> 12) & 63) +
            this.PADCHAR +
            this.PADCHAR
        );
        break;
      case 2:
        b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
        x.push(
          this.ALPHA.charAt(b10 >> 18) +
            this.ALPHA.charAt((b10 >> 12) & 63) +
            this.ALPHA.charAt((b10 >> 6) & 63) +
            this.PADCHAR
        );
        break;
    }

    return x.join('');
  }
}
