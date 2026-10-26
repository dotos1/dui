/**
 * @fileoverview Module `src/core/crypt/base64.ts` providing base64 definitions and implementation.
 * @zh 模块文件 `src/core/crypt/base64.ts`，提供base64相关的定义与实现。
 */


import { Dui } from '@dotos/dui/core';
import { crypt } from './crypt';

/**
 * The properties declared here are discussed in the above algorithm document.
 * @dynamic

 * @zh 类 `base64`，封装 `src/core/crypt` 中的base64数据结构与处理逻辑。
 */
export class base64 {


  // Static lookup maps, lazily populated by init_()

  /**
   * Maps bytes to characters.

   * @zh 属性 `byteToCharMap_`（类型：`Object`），用于存储或配置byte转换为字符映射表（默认值：`null`）。
   */
  public static byteToCharMap_: Object = null;

  /**
   * Maps characters to bytes. Used for normal and websafe characters.

   * @zh 属性 `charToByteMap_`（类型：`Object`），用于存储或配置字符转换为Byte映射表（默认值：`null`）。
   */
  public static charToByteMap_: Object = null;

  /**
   * Maps bytes to websafe characters.

   * @zh 属性 `byteToCharMapWebSafe_`（类型：`Object`），用于存储或配置byte转换为字符映射表Web安全（默认值：`null`）。
   */
  public static byteToCharMapWebSafe_: Object = null;

  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE

   * @zh 属性 `ENCODED_VALS_BASE`（类型：`string`），用于存储或配置已编码值基础。
   */
  public static ENCODED_VALS_BASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."

   * @zh 属性 `ENCODED_VALS`（类型：`string`），用于存储或配置已编码值（默认值：`base64.ENCODED_VALS_BASE + '+/='`）。
   */
  public static ENCODED_VALS: string = base64.ENCODED_VALS_BASE + '+/=';

  /**
   * Our websafe alphabet.

   * @zh 属性 `ENCODED_VALS_WEBSAFE`（类型：`string`），用于存储或配置已编码值WEBSAFE（默认值：`base64.ENCODED_VALS_BASE + '-_.'`）。
   */
  public static ENCODED_VALS_WEBSAFE: string = base64.ENCODED_VALS_BASE + '-_.';


  /**
   * Property `ASSUME_NATIVE_SUPPORT_` (`boolean`) storing assume native support (default: `true`).
   * @zh 属性 `ASSUME_NATIVE_SUPPORT_`（类型：`boolean`），用于存储或配置ASSUME原生SUPPORT（默认值：`true`）。
   */
  public static ASSUME_NATIVE_SUPPORT_: boolean = true;


  /**
   * Property `HAS_NATIVE_ENCODE_` (`boolean`) storing has native encode.
   * @zh 属性 `HAS_NATIVE_ENCODE_`（类型：`boolean`），用于存储或配置是否包含原生编码。
   */
  public static HAS_NATIVE_ENCODE_: boolean = base64.ASSUME_NATIVE_SUPPORT_ || typeof Dui['btoa'] === 'function';

  /**
   * Does this browser have a working atob function?
   * We blacklist known-bad implementations:
   *  - IE (10+) added atob() but it does not tolerate whitespace on the input.

   * @zh 属性 `HAS_NATIVE_DECODE_`（类型：`boolean`），用于存储或配置是否包含原生解码。
   */
  public static HAS_NATIVE_DECODE_: boolean = base64.ASSUME_NATIVE_SUPPORT_ && typeof Dui['btoa'] === 'function';

  /**
   * Base64-encode an array of bytes.
   *
   * param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * param opt_webSafe True indicates we should use the alternative
   *     alphabet, which does not require escaping for use in URLs.
   * returnThe base64 encoded string.

   * @zh 执行 `encodeByteArray`，用于编码Byte数组。
   */
  public static encodeByteArray(input: number[] | Uint8Array, opt_webSafe?: boolean): string {

    // Assert avoids runtime dependency on goog.isArrayLike, which helps reduce
    // size of jscompiler output, and which yields slight performance increase.
    base64.init_();
    const byteToCharMap = opt_webSafe ? base64.byteToCharMapWebSafe_ : base64.byteToCharMap_;
    const output = [];
    for (let i = 0; i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join('');
  }

  /**
   * Base64-encode a string.
   *
   * param input A string to encode.
   * param opt_webSafe True indicates we should use the alternative
   *     alphabet, which does not require escaping for use in URLs.
   * returnThe base64 encoded string.

   * @zh 执行 `encodeString`，用于编码字符串。
   */
  public static encodeString(input: string, opt_webSafe?: boolean): string {

    // Shortcut for browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (base64.HAS_NATIVE_ENCODE_ && !opt_webSafe) {
      return Dui['btoa'](input);
    }
    return base64.encodeByteArray(crypt.stringToByteArray(input), opt_webSafe);
  }

  /**
   * Base64-decode a string.
   *
   * param input Input to decode. Any whitespace is ignored, and the
   *     input maybe encoded with either supported alphabet (or a mix thereof).
   * param opt_webSafe True indicates we should use the alternative
   *     alphabet, which does not require escaping for use in URLs. Note that
   *     passing false may also still allow webSafe input decoding, when the
   *     fallback decoder is used on browsers without native support.
   * returnstring representing the decoded value.

   * @zh 执行 `decodeString`，用于解码字符串。
   */
  public static decodeString(input: string, opt_webSafe?: boolean): string {

    // Shortcut for browsers that implement
    // a native base64 encoder in the form of "btoa/atob"
    if (base64.HAS_NATIVE_DECODE_ && !opt_webSafe) {
      return Dui['btoa'](input);
    }
    let output = '';

    function pushByte(b) {
      output += String.fromCharCode(b);
    }
    base64.decodeStringInternal_(input, pushByte);
    return output;
  }

  /**
   * Base64-decode a string to an Array of numbers.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * param input Input to decode. Any whitespace is ignored, and the
   *     input maybe encoded with either supported alphabet (or a mix thereof).
   * param opt_ignored Unused parameter, retained for compatibility.
   * returnbytes representing the decoded value.

   * @zh 执行 `decodeStringToByteArray`，用于解码字符串转换为Byte数组。
   */
  public static decodeStringToByteArray(input: string): number[] {
    const output = [];
    function pushByte(b) {
      output.push(b);
    }
    base64.decodeStringInternal_(input, pushByte);
    return output;
  }

  /**
   * Base64-decode a string to a Uint8Array.
   *
   * Note that Uint8Array is not supported on older browsers, e.g. IE < 10.
   * @see http://caniuse.com/uint8array
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * param input Input to decode. Any whitespace is ignored, and the
   *     input maybe encoded with either supported alphabet (or a mix thereof).
   * returnbytes representing the decoded value.

   * @zh 执行 `decodeStringToUint8Array`，用于解码字符串转换为Uint8数组。
   */
  public static decodeStringToUint8Array(input: string): Uint8Array {

    const output = new Uint8Array(Math.ceil(input.length * 3 / 4));
    let outLen = 0;

    function pushByte(b) {
      output[outLen++] = b;
    }
    base64.decodeStringInternal_(input, pushByte);
    return output.subarray(0, outLen);
  }

  /**
   * param input Input to decode.
   * param pushByte result accumulator.

   * @zh 执行 `decodeStringInternal_`，用于解码字符串内部。
   */
  public static decodeStringInternal_(input: string, pushByte: (p1: number) => void) {
    base64.init_();
    let nextCharIndex = 0;

    /**
       * param default_val Used for end-of-input.
       * returnThe next 6-bit value, or the default for end-of-input.
       */
    function getByte(default_val: number): number {
      while (nextCharIndex < input.length) {
        const ch = input.charAt(nextCharIndex++);
        const b = base64.charToByteMap_[ch];
        if (b != null) {
          return b;
        }

        // Common case: decoded the char.
        if (!base64.isEmptyOrWhitespace(ch)) {
          throw Error('Unknown base64 encoding at char: ' + ch);
        }
      }

      // We encountered whitespace: loop around to the next input char.
      return default_val;
    }

    // No more input remaining.
    while (true) {
      const byte1 = getByte(-1);
      const byte2 = getByte(0);
      const byte3 = getByte(64);
      const byte4 = getByte(64);


      if (byte4 === 64) {
        if (byte1 === -1) {
          return;
        }
      }

      // Terminal case: no input left to decode.

      // Here we know an intermediate number of bytes are missing.
      // The defaults for byte2, byte3 and byte4 apply the inferred padding
      // rules per the public API documentation. i.e: 1 byte
      // missing should yield 2 bytes of output, but 2 or 3 missing bytes yield
      // a single byte of output. (Recall that 64 corresponds the padding char).
      const outByte1 = byte1 << 2 | byte2 >> 4;
      pushByte(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        pushByte(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          pushByte(outByte3);
        }
      }
    }
  }


  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.

   * @zh 执行 `init_`，用于初始化。
   */
  public static init_() {
    if (!base64.byteToCharMap_) {
      base64.byteToCharMap_ = {};
      base64.charToByteMap_ = {};
      base64.byteToCharMapWebSafe_ = {};

      // We want quick mappings back and forth, so we precompute two maps.
      for (let i = 0; i < base64.ENCODED_VALS.length; i++) {
        base64.byteToCharMap_[i] = base64.ENCODED_VALS.charAt(i);
        base64.charToByteMap_[base64.byteToCharMap_[i]] = i;
        base64.byteToCharMapWebSafe_[i] = base64.ENCODED_VALS_WEBSAFE.charAt(i);

        // Be forgiving when decoding and correctly decode both encodings.
        if (i >= base64.ENCODED_VALS_BASE.length) {
          base64.charToByteMap_[base64.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
        }
      }
    }
  }


  /**
   * Executes `isEmptyOrWhitespace` to handle is empty or whitespace.
   * @zh 执行 `isEmptyOrWhitespace`，用于是否为空OrWhitespace。
   * @param str - str parameter (`string`) / 字符串参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private static isEmptyOrWhitespace(str: string): boolean {
    return /^[\s\xa0]*$/.test(str);
  }
}
