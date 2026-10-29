/**
 * @fileoverview Module `src/container/dock-layout/utils/config-minifier.ts` providing config minifier definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/config-minifier.ts`，提供配置minifier相关的定义与实现。
 */


export namespace ConfigMinifier {

    /**
     * Type alias `YY` representing yy (`'id' | 'title'`).
     * @zh 类型别名 `YY`，表示YY（`'id' | 'title'`）。
     */
    export type YY = 'id' | 'title';
    /**
     * Enumeration `XX` defining supported xx constants.
     * @zh 枚举 `XX`，定义支持的XX常量集合。
     */
    export const enum XX {
        /**
         * Enum member `XX.id` = 'id' representing id.
         * @zh 枚举项 `XX.id` = 'id'，表示唯一标识。
         */
        id = 'id'
    }
    /**
     * Constant/variable `keys` defining keys in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `keys`，定义 `src/container/dock-layout/utils` 中的键列表。
     */
    const keys: readonly string[] = [
        'settings',
        'hasHeaders',
        'constrainDragToContainer',
        'selectionEnabled',
        'dimensions',
        'borderWidth',
        'minItemHeight',
        'minItemWidth',
        'headerHeight',
        'dragProxyWidth',
        'dragProxyHeight',
        'labels',
        'close',
        'maximise',
        'minimise',
        'popout',
        'content',
        'componentType',
        'componentState',
        'id',
        'width',
        'type',
        'height',
        'isClosable',
        'title',
        'popoutWholeStack',
        'openPopouts',
        'parentId',
        'activeItemIndex',
        'reorderEnabled',
        'borderGrabWidth',




        //Maximum 36 entries, do not cross this line!
    ];

    /**
     * Constant/variable `values` defining values in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `values`，定义 `src/container/dock-layout/utils` 中的值列表。
     */
    const values: readonly (boolean | string)[] = [
        true,
        false,
        'row',
        'column',
        'stack',
        'component',
        'close',
        'maximise',
        'minimise',
        'open in new window'
    ];

    /**
     * Executes `checkInitialise` to handle check initialise.
     * @zh 执行 `checkInitialise`，用于检查Initialise。
     */
    export function checkInitialise(): void {
        if (keys.length > 36) {
            throw new Error('Too many keys in config minifier map');
        }
    }

    /**
     * Executes `translateObject` to handle translate object.
     * @zh 执行 `translateObject`，用于翻译对象。
     * @param from - from parameter (`Record<string, unknown>`) / 从参数（`Record<string, unknown>`）
     * @param minify - minify parameter (`boolean`) / minify参数（`boolean`）
     * @returns Result of type `Record<string, unknown>` / 类型为 `Record<string, unknown>` 的返回值
     */
    export function translateObject(from: Record<string, unknown>, minify: boolean): Record<string, unknown> {
        const to: Record<string, unknown> = {};
        for (const key in from) {
            if (from.hasOwnProperty(key)) { // In case something has extended Object prototypes
                let translatedKey: string;
                if (minify) {
                    translatedKey = minifyKey(key);
                } else {
                    translatedKey = unminifyKey(key);
                }

                const fromValue = from[key];
                to[translatedKey] = translateValue(fromValue, minify);
            }
        }

        return to;
    }

    /**
     * Executes `translateArray` to handle translate array.
     * @zh 执行 `translateArray`，用于翻译数组。
     * @param from - from parameter (`unknown[]`) / 从参数（`unknown[]`）
     * @param minify - minify parameter (`boolean`) / minify参数（`boolean`）
     */
    function translateArray(from: unknown[], minify: boolean) {
        const length = from.length;
        const to = new Array<unknown>(length);
        for (let i = 0; i < length; i++) {
            // In original code, array indices were numbers and not translated
            const fromValue = from[i];
            to[i] = translateValue(fromValue, minify);
        }
        return to;
    }

    /**
     * Executes `translateValue` to handle translate value.
     * @zh 执行 `translateValue`，用于翻译值。
     * @param from - from parameter (`unknown`) / 从参数（`unknown`）
     * @param minify - minify parameter (`boolean`) / minify参数（`boolean`）
     */
    function translateValue(from: unknown, minify: boolean) {
        if (typeof from === 'object') {
            if (from === null) {
                return null;
            } else {
                if (Array.isArray(from)) {
                    return translateArray(from, minify);
                } else {
                    return translateObject(from as Record<string, unknown>, minify);
                }
            }
        } else {
            if (minify) {
                return minifyValue(from);
            } else {
                return unminifyValue(from);
            }
        }
    }

    /**
     * Executes `minifyKey` to handle minify key.
     * @zh 执行 `minifyKey`，用于压缩键。
     * @param value - value parameter (`string`) / 值参数（`string`）
     */
    function minifyKey(value: string) {
        /**
         * If a value actually is a single character, prefix it
         * with ___ to avoid mistaking it for a minification code
         */
        if (typeof value === 'string' && value.length === 1) {
            return '___' + value;
        }
    
        const index = indexOfKey(value);
    
        /**
         * value not found in the dictionary, return it unmodified
         */
        if (index === -1) {
            return value;
    
            /**
             * value found in dictionary, return its base36 counterpart
             */
        } else {
            return index.toString(36);
        }
    }

    /**
     * Executes `unminifyKey` to handle unminify key.
     * @zh 执行 `unminifyKey`，用于展开压缩的键。
     * @param key - key parameter (`string`) / 键参数（`string`）
     */
    function unminifyKey(key: string) {
        /**
         * value is a single character. Assume that it's a translation
         * and return the original value from the dictionary
         */
        if (key.length === 1) {
            return keys[parseInt(key, 36)];
        }
    
        /**
         * value originally was a single character and was prefixed with ___
         * to avoid mistaking it for a translation. Remove the prefix
         * and return the original character
         */
        if (key.substr(0, 3) === '___') {
            return key[3];
        }
        /**
         * value was not minified
         */
        return key;
    }

    /**
     * Executes `minifyValue` to handle minify value.
     * @zh 执行 `minifyValue`，用于压缩值。
     * @param value - value parameter (`unknown`) / 值参数（`unknown`）
     */
    function minifyValue(value: unknown) {
        /**
         * If a value actually is a single character, prefix it
         * with ___ to avoid mistaking it for a minification code
         */
        if (typeof value === 'string' && value.length === 1) {
            return '___' + value;
        }
    
        const index = indexOfValue(value);
    
        /**
         * value not found in the dictionary, return it unmodified
         */
        if (index === -1) {
            return value;
    
            /**
             * value found in dictionary, return its base36 counterpart
             */
        } else {
            return index.toString(36);
        }
    }

    /**
     * Executes `unminifyValue` to handle unminify value.
     * @zh 执行 `unminifyValue`，用于展开压缩的值。
     * @param value - value parameter (`unknown`) / 值参数（`unknown`）
     */
    function unminifyValue(value: unknown) {
        /**
         * value is a single character. Assume that it's a translation
         * and return the original value from the dictionary
         */
        if (typeof value === 'string' && value.length === 1) {
            return values[parseInt(value, 36)];
        }

        /**
         * value originally was a single character and was prefixed with ___
         * to avoid mistaking it for a translation. Remove the prefix
         * and return the original character
         */
        if (typeof value === 'string' && value.substr(0, 3) === '___') {
            return value[3];
        }
        /**
         * value was not minified
         */
        return value;
    }

    /**
     * Executes `indexOfKey` to handle index of key.
     * @zh 执行 `indexOfKey`，用于索引的键。
     * @param key - key parameter (`string`) / 键参数（`string`）
     */
    function indexOfKey(key: string) {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === key) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Executes `indexOfValue` to handle index of value.
     * @zh 执行 `indexOfValue`，用于索引的值。
     * @param value - value parameter (`unknown`) / 值参数（`unknown`）
     */
    function indexOfValue(value: unknown) {
        for (let i = 0; i < values.length; i++) {
            if (values[i] === value) {
                return i;
            }
        }
        return -1;
    }
}
