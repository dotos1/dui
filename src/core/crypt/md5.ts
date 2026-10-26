/**
 * @fileoverview Module `src/core/crypt/md5.ts` providing md5 definitions and implementation.
 * @zh 模块文件 `src/core/crypt/md5.ts`，提供md5相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Injectable Angular service `encrypt` managing encrypt state and operations in `src/core/crypt`.
 * @dynamic

 * @zh 可注入的 Angular 服务 `encrypt`，管理 `src/core/crypt` 中的encrypt状态与业务操作。
 */
@Injectable()
export class encrypt {
  /**
   * Creates an instance of `encrypt` and initializes its dependencies and internal state.
   * @zh 创建 `encrypt` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {

  }
  /**
   * Executes `md5cycle` to handle md5cycle.
   * @zh 执行 `md5cycle`，用于md5cycle。
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param k - k parameter (`any`) / k参数（`any`）
   */
  static md5cycle(x, k) {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = encrypt.ff(a, b, c, d, k[0], 7, -680876936);
    d = encrypt.ff(d, a, b, c, k[1], 12, -389564586);
    c = encrypt.ff(c, d, a, b, k[2], 17, 606105819);
    b = encrypt.ff(b, c, d, a, k[3], 22, -1044525330);
    a = encrypt.ff(a, b, c, d, k[4], 7, -176418897);
    d = encrypt.ff(d, a, b, c, k[5], 12, 1200080426);
    c = encrypt.ff(c, d, a, b, k[6], 17, -1473231341);
    b = encrypt.ff(b, c, d, a, k[7], 22, -45705983);
    a = encrypt.ff(a, b, c, d, k[8], 7, 1770035416);
    d = encrypt.ff(d, a, b, c, k[9], 12, -1958414417);
    c = encrypt.ff(c, d, a, b, k[10], 17, -42063);
    b = encrypt.ff(b, c, d, a, k[11], 22, -1990404162);
    a = encrypt.ff(a, b, c, d, k[12], 7, 1804603682);
    d = encrypt.ff(d, a, b, c, k[13], 12, -40341101);
    c = encrypt.ff(c, d, a, b, k[14], 17, -1502002290);
    b = encrypt.ff(b, c, d, a, k[15], 22, 1236535329);

    a = encrypt.gg(a, b, c, d, k[1], 5, -165796510);
    d = encrypt.gg(d, a, b, c, k[6], 9, -1069501632);
    c = encrypt.gg(c, d, a, b, k[11], 14, 643717713);
    b = encrypt.gg(b, c, d, a, k[0], 20, -373897302);
    a = encrypt.gg(a, b, c, d, k[5], 5, -701558691);
    d = encrypt.gg(d, a, b, c, k[10], 9, 38016083);
    c = encrypt.gg(c, d, a, b, k[15], 14, -660478335);
    b = encrypt.gg(b, c, d, a, k[4], 20, -405537848);
    a = encrypt.gg(a, b, c, d, k[9], 5, 568446438);
    d = encrypt.gg(d, a, b, c, k[14], 9, -1019803690);
    c = encrypt.gg(c, d, a, b, k[3], 14, -187363961);
    b = encrypt.gg(b, c, d, a, k[8], 20, 1163531501);
    a = encrypt.gg(a, b, c, d, k[13], 5, -1444681467);
    d = encrypt.gg(d, a, b, c, k[2], 9, -51403784);
    c = encrypt.gg(c, d, a, b, k[7], 14, 1735328473);
    b = encrypt.gg(b, c, d, a, k[12], 20, -1926607734);

    a = encrypt.hh(a, b, c, d, k[5], 4, -378558);
    d = encrypt.hh(d, a, b, c, k[8], 11, -2022574463);
    c = encrypt.hh(c, d, a, b, k[11], 16, 1839030562);
    b = encrypt.hh(b, c, d, a, k[14], 23, -35309556);
    a = encrypt.hh(a, b, c, d, k[1], 4, -1530992060);
    d = encrypt.hh(d, a, b, c, k[4], 11, 1272893353);
    c = encrypt.hh(c, d, a, b, k[7], 16, -155497632);
    b = encrypt.hh(b, c, d, a, k[10], 23, -1094730640);
    a = encrypt.hh(a, b, c, d, k[13], 4, 681279174);
    d = encrypt.hh(d, a, b, c, k[0], 11, -358537222);
    c = encrypt.hh(c, d, a, b, k[3], 16, -722521979);
    b = encrypt.hh(b, c, d, a, k[6], 23, 76029189);
    a = encrypt.hh(a, b, c, d, k[9], 4, -640364487);
    d = encrypt.hh(d, a, b, c, k[12], 11, -421815835);
    c = encrypt.hh(c, d, a, b, k[15], 16, 530742520);
    b = encrypt.hh(b, c, d, a, k[2], 23, -995338651);

    a = encrypt.ii(a, b, c, d, k[0], 6, -198630844);
    d = encrypt.ii(d, a, b, c, k[7], 10, 1126891415);
    c = encrypt.ii(c, d, a, b, k[14], 15, -1416354905);
    b = encrypt.ii(b, c, d, a, k[5], 21, -57434055);
    a = encrypt.ii(a, b, c, d, k[12], 6, 1700485571);
    d = encrypt.ii(d, a, b, c, k[3], 10, -1894986606);
    c = encrypt.ii(c, d, a, b, k[10], 15, -1051523);
    b = encrypt.ii(b, c, d, a, k[1], 21, -2054922799);
    a = encrypt.ii(a, b, c, d, k[8], 6, 1873313359);
    d = encrypt.ii(d, a, b, c, k[15], 10, -30611744);
    c = encrypt.ii(c, d, a, b, k[6], 15, -1560198380);
    b = encrypt.ii(b, c, d, a, k[13], 21, 1309151649);
    a = encrypt.ii(a, b, c, d, k[4], 6, -145523070);
    d = encrypt.ii(d, a, b, c, k[11], 10, -1120210379);
    c = encrypt.ii(c, d, a, b, k[2], 15, 718787259);
    b = encrypt.ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = encrypt.add32(a, x[0]);
    x[1] = encrypt.add32(b, x[1]);
    x[2] = encrypt.add32(c, x[2]);
    x[3] = encrypt.add32(d, x[3]);

  }

  /**
   * Executes `cmn` to handle cmn.
   * @zh 执行 `cmn`，用于cmn。
   * @param q - q parameter (`any`) / q参数（`any`）
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param s - s parameter (`any`) / s参数（`any`）
   * @param t - t parameter (`any`) / t参数（`any`）
   */
  static cmn(q, a, b, x, s, t) {
    a = encrypt.add32(encrypt.add32(a, q), encrypt.add32(x, t));
    return encrypt.add32((a << s) | (a >>> (32 - s)), b);
  }

  /**
   * Executes `ff` to handle ff.
   * @zh 执行 `ff`，用于ff。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param d - d parameter (`any`) / d参数（`any`）
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param s - s parameter (`any`) / s参数（`any`）
   * @param t - t parameter (`any`) / t参数（`any`）
   */
  static ff(a, b, c, d, x, s, t) {
    return encrypt.cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  /**
   * Executes `gg` to handle gg.
   * @zh 执行 `gg`，用于gg。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param d - d parameter (`any`) / d参数（`any`）
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param s - s parameter (`any`) / s参数（`any`）
   * @param t - t parameter (`any`) / t参数（`any`）
   */
  static gg(a, b, c, d, x, s, t) {
    return encrypt.cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  /**
   * Executes `hh` to handle hh.
   * @zh 执行 `hh`，用于hh。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param d - d parameter (`any`) / d参数（`any`）
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param s - s parameter (`any`) / s参数（`any`）
   * @param t - t parameter (`any`) / t参数（`any`）
   */
  static hh(a, b, c, d, x, s, t) {
    return encrypt.cmn(b ^ c ^ d, a, b, x, s, t);
  }

  /**
   * Executes `ii` to handle ii.
   * @zh 执行 `ii`，用于ii。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param d - d parameter (`any`) / d参数（`any`）
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   * @param s - s parameter (`any`) / s参数（`any`）
   * @param t - t parameter (`any`) / t参数（`any`）
   */
  static ii(a, b, c, d, x, s, t) {
    return encrypt.cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /**
   * Executes `md51` to handle md51.
   * @zh 执行 `md51`，用于md51。
   * @param s - s parameter (`any`) / s参数（`any`）
   */
  static md51(s) {
    const txt = '';
    const n = s.length, state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= s.length; i += 64) {
      encrypt.md5cycle(state, encrypt.md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      encrypt.md5cycle(state, tail);
      for (i = 0; i < 16; i++) { tail[i] = 0; }
    }
    tail[14] = n * 8;
    encrypt.md5cycle(state, tail);
    return state;
  }

  /**
   * Executes `md5blk` to handle md5blk.
   * @zh 执行 `md5blk`，用于md5blk。
   * @param s - s parameter (`any`) / s参数（`any`）
   */
  static md5blk(s) { /* I figured global was faster.   */
    const md5blks = [];
    let i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }


  /**
   * Executes `rhex` to handle rhex.
   * @zh 执行 `rhex`，用于rhex。
   * @param n - n parameter (`any`) / n参数（`any`）
   */
  static rhex(n) {
    let s = '', j = 0;
    const hex_chr = '0123456789abcdef'.split('');

    for (; j < 4; j++) {
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    }
    return s;
  }

  /**
   * Executes `hex` to handle hex.
   * @zh 执行 `hex`，用于十六进制颜色。
   * @param x - x parameter (`any`) / X坐标参数（`any`）
   */
  static hex(x) {
    const hex_chr = '0123456789abcdef'.split('');
    for (let i = 0; i < x.length; i++) {
      x[i] = encrypt.rhex(x[i]);
    }
    return x.join('');
  }

  /**
   * Executes `md5` to handle md5.
   * @zh 执行 `md5`，用于md5。
   * @param s - s parameter (`any`) / s参数（`any`）
   */
  md5(s) {
    return encrypt.hex(encrypt.md51(s));
  }

  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */

  /**
   * Property `add32` (`any`) storing add32.
   * @zh 属性 `add32`（类型：`any`），用于存储或配置add32。
   */
  static add32 = function (a, b) {
    return (a + b) & 0xFFFFFFFF;
  };
  /*
     if (md5("hello")== '5d41402abc4b2a76b9719d911017c592') {
         add32 = function (x, y) {
             let lsw = (x & 0xFFFF) + (y & 0xFFFF),
                 msw = (x >> 16) + (y >> 16) + (lsw >> 16);
             return (msw << 16) | (lsw & 0xFFFF);
         }
     }*/
}
