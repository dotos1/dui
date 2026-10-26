
/**
 * Create a cryptographic hash instance.
 *
 * @struct

 * @zh 接口 `Hash`，定义Hash的数据结构契约与属性规范。
 */
export interface Hash {

  /**
     * The block size for the hasher.

   * @zh 属性 `blockSize`（类型：`any`），用于存储或配置块尺寸。
   */
  blockSize ;

  /**
   * Resets the internal accumulator.

   * @zh 属性 `reset`（类型：`any`），用于存储或配置重置。
   */
   reset ;

  /**
   * Adds a byte array (array with values in [0-255] range) or a string (must
   * only contain 8-bit, i.e., Latin1 characters) to the internal accumulator.
   *
   * Many hash functions operate on blocks of data and implement optimizations
   * when a full chunk of data is readily available. Hence it is often preferable
   * to provide large chunks of data (a kilobyte or more) than to repeatedly
   * call the update method with few tens of bytes. If this is not possible, or
   * not feasible, it might be good to provide data in multiplies of hash block
   * size (often 64 bytes). Please see the implementation and performance tests
   * of your favourite hash.
   *
   * param bytes Data used for the update.
   * param opt_length Number of bytes to use.

   * @zh 属性 `update`（类型：`any`），用于存储或配置更新。
   */
   update ;

  /**
   * returnThe finalized hash computed
   *     from the internal accumulator.

   * @zh 属性 `digest`（类型：`any`），用于存储或配置digest。
   */
   digest;

}
