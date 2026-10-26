/**
 * @fileoverview Module `src/core/crypt/sha1.ts` providing sha1 definitions and implementation.
 * @zh 模块文件 `src/core/crypt/sha1.ts`，提供sha1相关的定义与实现。
 */


import {isString,isUndefined}  from 'lodash-es';
import { Hash } from './hash';
/**
 * Class `Sha1` encapsulating sha1 data structures and logic in `src/core/crypt`.
 * @zh 类 `Sha1`，封装 `src/core/crypt` 中的Sha1数据结构与处理逻辑。
 */
export class Sha1 implements Hash {
  /**
   * Property `blockSize` (`any`) storing block size.
   * @zh 属性 `blockSize`（类型：`any`），用于存储或配置块尺寸。
   */
  blockSize;

  /**
     * Holds the previous values of accumulated variables a-e in the compress_
     * function.

   * @zh 属性 `chain_`（类型：`number[]`），用于存储或配置chain（默认值：`[]`）。
   */
  private chain_: number[] = [];

  /**
     * A buffer holding the partially computed hash result.

   * @zh 属性 `buf_`（类型：`number[]`），用于存储或配置buf（默认值：`[]`）。
   */
  private buf_: number[] = [];

  /**
     * An array of 80 bytes, each a part of the message to be hashed.  Referred to
     * as the message schedule in the docs.

   * @zh 属性 `W_`（类型：`number[]`），用于存储或配置W（默认值：`[]`）。
   */
  private W_: number[] = [];

  /**
     * Contains data needed to pad messages less than 64 bytes.

   * @zh 属性 `pad_`（类型：`number[]`），用于存储或配置pad（默认值：`[]`）。
   */
  private pad_: number[] = [];
  /**
   * Property `inbuf_` (`number`) storing inbuf (default: `0`).
   * @zh 属性 `inbuf_`（类型：`number`），用于存储或配置inbuf（默认值：`0`）。
   */
  private inbuf_: number = 0;
  /**
   * Property `total_` (`number`) storing total (default: `0`).
   * @zh 属性 `total_`（类型：`number`），用于存储或配置总计（默认值：`0`）。
   */
  private total_: number = 0;

  /**
   * Creates an instance of `Sha1` and initializes its dependencies and internal state.
   * @zh 创建 `Sha1` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.blockSize = 512 / 8;
    this.pad_[0] = 128;
    for (let i = 1; i < this.blockSize; ++i) {
      this.pad_[i] = 0;
    }
    this.reset();
  }

  /**
   * Executes `reset` to handle reset.
   * @override
   * @zh 执行 `reset`，用于重置。
   */
  reset() {
    this.chain_[0] = 1732584193;
    this.chain_[1] = 4023233417;
    this.chain_[2] = 2562383102;
    this.chain_[3] = 271733878;
    this.chain_[4] = 3285377520;
    this.inbuf_ = 0;
    this.total_ = 0;
  }

  /**
   * Internal compress helper function.
   * param buf Block to compress.
   * param opt_offset Offset of the block in the buffer.

   * @zh 执行 `compress_`，用于compress。
   */
  private compress_(buf, opt_offset?: number) {
    if (!opt_offset) {
      opt_offset = 0;
    }
    const W = this.W_;

    // get 16 big endian words
    if (isString(buf)) {
      for (let i = 0; i < 16; i++) {

        // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
        // have a bug that turns the post-increment ++ operator into pre-increment
        // during JIT compilation.  We have code that depends heavily on SHA-1 for
        // correctness and which is affected by this bug, so I've removed all uses
        // of post-increment ++ in which the result value is used.  We can revert
        // this change once the Safari bug
        // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
        // most clients have been updated.
        W[i] = buf.charCodeAt(opt_offset) << 24 | buf.charCodeAt(opt_offset + 1) << 16 | buf.charCodeAt(opt_offset + 2) << 8 | buf.charCodeAt(opt_offset + 3);
        opt_offset += 4;
      }
    } else {
      for (let i = 0; i < 16; i++) {
        W[i] = buf[opt_offset] << 24 | buf[opt_offset + 1] << 16 | buf[opt_offset + 2] << 8 | buf[opt_offset + 3];
        opt_offset += 4;
      }
    }

    // expand to 80 words
    for (let i = 16; i < 80; i++) {
      const t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
      W[i] = (t << 1 | t >>> 31) & 4294967295;
    }
    let a = this.chain_[0];
    let b = this.chain_[1];
    let c = this.chain_[2];
    let d = this.chain_[3];
    let e = this.chain_[4];
    let f, k;

    // TODO(user): Try to unroll this loop to speed up the computation.
    for (let i = 0; i < 80; i++) {
      if (i < 40) {
        if (i < 20) {
          f = d ^ b & (c ^ d);
          k = 1518500249;
        } else {
          f = b ^ c ^ d;
          k = 1859775393;
        }
      } else {
        if (i < 60) {
          f = b & c | d & (b | c);
          k = 2400959708;
        } else {
          f = b ^ c ^ d;
          k = 3395469782;
        }
      }
      const t = (a << 5 | a >>> 27) + f + e + k + W[i] & 4294967295;
      e = d;
      d = c;
      c = (b << 30 | b >>> 2) & 4294967295;
      b = a;
      a = t;
    }
    this.chain_[0] = this.chain_[0] + a & 4294967295;
    this.chain_[1] = this.chain_[1] + b & 4294967295;
    this.chain_[2] = this.chain_[2] + c & 4294967295;
    this.chain_[3] = this.chain_[3] + d & 4294967295;
    this.chain_[4] = this.chain_[4] + e & 4294967295;
  }

  /**
   * Executes `update` to handle update.
   * @override
   * @zh 执行 `update`，用于更新。
   */
  public update(bytes, opt_length?) {

    // TODO(johnlenz): tighten the function signature and remove this check
    if (bytes == null) {
      return;
    }
    if (isUndefined(opt_length)) {
      opt_length = bytes.length;
    }
    const lengthMinusBlock = opt_length - this.blockSize;
    let n = 0;

    // Using local instead of member variables gives ~5% speedup on Firefox 16.
    const buf = this.buf_;
    let inbuf = this.inbuf_;

    // The outer while loop should execute at most twice.
    while (n < opt_length) {

      // When we have no data in the block to top up, we can directly process the
      // input buffer (assuming it contains sufficient data). This gives ~25%
      // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
      // the data is provided in large chunks (or in multiples of 64 bytes).
      if (inbuf === 0) {
        while (n <= lengthMinusBlock) {
          this.compress_(bytes, n);
          n += this.blockSize;
        }
      }
      if (isString(bytes)) {
        while (n < opt_length) {
          buf[inbuf] = bytes.charCodeAt(n);
          ++inbuf;
          ++n;
          if (inbuf === this.blockSize) {
            this.compress_(buf);
            inbuf = 0;

            // Jump to the outer loop so we use the full-block optimization.
            break;
          }
        }
      } else {
        while (n < opt_length) {
          buf[inbuf] = bytes[n];
          ++inbuf;
          ++n;
          if (inbuf === this.blockSize) {
            this.compress_(buf);
            inbuf = 0;

            // Jump to the outer loop so we use the full-block optimization.
            break;
          }
        }
      }
    }
    this.inbuf_ = inbuf;
    this.total_ += opt_length;
  }

  /**
   * Executes `digest` to handle digest.
   * @override
   * @zh 执行 `digest`，用于digest。
   */
  digest() {
    const digest = [];
    let totalBits = this.total_ * 8;

    // Add pad 0x80 0x00*.
    if (this.inbuf_ < 56) {
      this.update(this.pad_, 56 - this.inbuf_);
    } else {
      this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
    }

    // Add # bits.
    for (let i = this.blockSize - 1; i >= 56; i--) {
      this.buf_[i] = totalBits & 255;
      totalBits /= 256;
    }

    // Don't use bit-shifting here!
    this.compress_(this.buf_);
    let n = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 24; j >= 0; j -= 8) {
        digest[n] = this.chain_[i] >> j & 255;
        ++n;
      }
    }
    return digest;
  }
}
