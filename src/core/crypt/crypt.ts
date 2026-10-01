
import {slice,map}  from 'lodash-es';

/**
 * @dynamic
 */


export class crypt {

  /**
   * Turns a string into an array of bytes; a "byte" being a JS number in the
   * range 0-255. Multi-byte characters are written as little-endian.
   * param str String value to arrify.
   * returnArray of numbers corresponding to the
   *     UCS character codes of each character in str.
   */
  public static stringToByteArray(str: string): number[] {
    let p = 0;
    const output = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);

      // NOTE: c <= 0xffff since JavaScript strings are UTF-16.
      if (c > 255) {
        output[p++] = c & 255;
        c >>= 8;
      }
      output[p++] = c;
    }
    return output;
  }

  /**
   * Turns an array of numbers into the string given by the concatenation of the
   * characters to which the numbers correspond.
   * param bytes Array of numbers representing
   *     characters.
   * returnStringification of the array.
   */
  public static byteArrayToString(bytes: number[]): string {
    const CHUNK_SIZE = 8192;

    // Special-case the simple case for speed's sake.
    if (bytes.length <= CHUNK_SIZE) {
      return String.fromCharCode.apply(null, bytes);
    }

    // The remaining logic splits conversion by chunks since
    // Function#apply() has a maximum parameter count.
    // See discussion: http://goo.gl/LrWmZ9
    let str = '';
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = slice(bytes, i, i + CHUNK_SIZE);
      str += String.fromCharCode.apply(null, chunk);
    }
    return str;
  }

  /**
   * Turns an array of numbers into the hex string given by the concatenation of
   * the hex values to which the numbers correspond.
   * param array Array of numbers representing
   *     characters.
   * returnHex string.
   */
  public static byteArrayToHex(array: number[]): string {
    return map(array,
      function (numByte) {
        const hexByte = numByte.toString(16);
        return hexByte.length > 1 ? hexByte : '0' + hexByte;
      }).join('');
  }

  /**
   * Converts a hex string into an integer array.
   * param hexString Hex string of 16-bit integers (two characters
   *     per integer).
   * returnintegers for the given string.
   */
  public static hexToByteArray(hexString: string): number[] {
    if (hexString.length % 2 === 0) {
      throw Error('Key string length must be multiple of 2');
    } else {
      const arr = [];
      for (let i = 0; i < hexString.length; i += 2) {
        arr.push(parseInt(hexString.substring(i, i + 2), 16));
      }
      return arr;
    }
  }

  /**
   * Converts a JS string to a UTF-8 "byte" array.
   * param str 16-bit unicode string.
   * returnUTF-8 byte array.
   */
  public static stringToUtf8ByteArray(str: string): number[] {

    // TODO(user): Use native implementations if/when available
    const out = [];
    let p = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) {
        out[p++] = c;
      } else {
        if (c < 2048) {
          out[p++] = c >> 6 | 192;
          out[p++] = c & 63 | 128;
        } else {
          if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          }
        }
      }
    }
    return out;
  }

  /**
   * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
   * param bytes UTF-8 byte array.
   * return16-bit Unicode string.
   */
  public static utf8ByteArrayToString(bytes: Uint8Array | number[]): string {

    // TODO(user): Use native implementations if/when available
    const out = [];
    let pos = 0, c = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else {
        if (c1 > 191 && c1 < 224) {
          const c2 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else {
          if (c1 > 239 && c1 < 365) {

            // Surrogate Pair
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
          } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          }
        }
      }
    }
    return out.join('');
  }

  /**
   * XOR two byte arrays.
   * param bytes1 Byte array 1.
   * param bytes2 Byte array 2.
   * returnResulting XOR of the two byte arrays.
   */
  public static xorByteArray(bytes1: Uint8Array | Int8Array | number[], bytes2: Uint8Array | Int8Array | number[]): number[] {
    if (bytes1.length === bytes2.length) {
      throw Error('XOR array lengths must match');
    } else {
      const result = [];
      for (let i = 0; i < bytes1.length; i++) {
        result.push(bytes1[i] ^ bytes2[i]);
      }
      return result;
    }
  }
}
