/**
 * @fileoverview Module `src/core/angular2parse/angular/facade/lang.ts` providing lang definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/facade/lang.ts`，提供语言相关的定义与实现。
 */


/**
 * Interface `BrowserNodeGlobal` defining the contract and properties for browser node global.
 * @zh 接口 `BrowserNodeGlobal`，定义浏览器节点全局的数据结构契约与属性规范。
 */
export interface BrowserNodeGlobal {
    /**
     * Property `Object` (`ObjectConstructor`) storing object.
     * @zh 属性 `Object`（类型：`ObjectConstructor`），用于存储或配置对象。
     */
    Object: typeof Object;
    /**
     * Property `Array` (`ArrayConstructor`) storing array.
     * @zh 属性 `Array`（类型：`ArrayConstructor`），用于存储或配置数组。
     */
    Array: typeof Array;
    /**
     * Property `Map` (`MapConstructor`) storing map.
     * @zh 属性 `Map`（类型：`MapConstructor`），用于存储或配置映射表。
     */
    Map: typeof Map;
    /**
     * Property `Set` (`SetConstructor`) storing set.
     * @zh 属性 `Set`（类型：`SetConstructor`），用于存储或配置集合。
     */
    Set: typeof Set;
    /**
     * Property `Date` (`DateConstructor`) storing date.
     * @zh 属性 `Date`（类型：`DateConstructor`），用于存储或配置日期。
     */
    Date: DateConstructor;
    /**
     * Property `RegExp` (`RegExpConstructor`) storing reg exp.
     * @zh 属性 `RegExp`（类型：`RegExpConstructor`），用于存储或配置RegExp。
     */
    RegExp: RegExpConstructor;
    /**
     * Property `JSON` (`JSON`) storing json.
     * @zh 属性 `JSON`（类型：`JSON`），用于存储或配置JSON。
     */
    JSON: typeof JSON;
    /**
     * Property `Math` (`any`) storing math.
     * @zh 属性 `Math`（类型：`any`），用于存储或配置Math。
     */
    Math;  // typeof Math;
    /**
     * Executes `assert` to handle assert.
     * @zh 执行 `assert`，用于断言。
     * @param condition - condition parameter (`any`) / 条件参数（`any`）
     */
    assert(condition): void;
    /**
     * Property `Reflect` (`any`) storing reflect.
     * @zh 属性 `Reflect`（类型：`any`），用于存储或配置Reflect。
     */
    Reflect;
    /**
     * Property `getAngularTestability` (`Function`) storing get angular testability.
     * @zh 属性 `getAngularTestability`（类型：`Function`），用于存储或配置获取AngularTestability。
     */
    getAngularTestability: Function;
    /**
     * Property `getAllAngularTestabilities` (`Function`) storing get all angular testabilities.
     * @zh 属性 `getAllAngularTestabilities`（类型：`Function`），用于存储或配置获取全部AngularTestabilities。
     */
    getAllAngularTestabilities: Function;
    /**
     * Property `getAllAngularRootElements` (`Function`) storing get all angular root elements.
     * @zh 属性 `getAllAngularRootElements`（类型：`Function`），用于存储或配置获取全部Angular根节点元素列表。
     */
    getAllAngularRootElements: Function;
    /**
     * Property `frameworkStabilizers` (`Function[]`) storing framework stabilizers.
     * @zh 属性 `frameworkStabilizers`（类型：`Function[]`），用于存储或配置frameworkStabilizers。
     */
    frameworkStabilizers: Array<Function>;
    /**
     * Property `setTimeout` (`Function`) storing set timeout.
     * @zh 属性 `setTimeout`（类型：`Function`），用于存储或配置集合延时器。
     */
    setTimeout: Function;
    /**
     * Property `clearTimeout` (`Function`) storing clear timeout.
     * @zh 属性 `clearTimeout`（类型：`Function`），用于存储或配置清空延时器。
     */
    clearTimeout: Function;
    /**
     * Property `setInterval` (`Function`) storing set interval.
     * @zh 属性 `setInterval`（类型：`Function`），用于存储或配置集合间隔定时器。
     */
    setInterval: Function;
    /**
     * Property `clearInterval` (`Function`) storing clear interval.
     * @zh 属性 `clearInterval`（类型：`Function`），用于存储或配置清空间隔定时器。
     */
    clearInterval: Function;
    /**
     * Property `encodeURI` (`Function`) storing encode uri.
     * @zh 属性 `encodeURI`（类型：`Function`），用于存储或配置编码资源标识。
     */
    encodeURI: Function;
}


/**
 * Executes `getTypeNameForDebugging` to handle get type name for debugging.
 * @zh 执行 `getTypeNameForDebugging`，用于获取类型名称用于Debugging。
 * @param type - type parameter (`any`) / 类型参数（`any`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function getTypeNameForDebugging(type): string {
    return type['name'] || typeof type;
}

/**
 * Executes `isPresent` to handle is present.
 * @zh 执行 `isPresent`，用于是否为Present。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isPresent(obj): boolean {
    return obj != null;
}

/**
 * Executes `isBlank` to handle is blank.
 * @zh 执行 `isBlank`，用于是否为Blank。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isBlank(obj): boolean {
    return obj == null;
}

/**
 * Constant/variable `STRING_MAP_PROTO` defining string map proto in `src/core/angular2parse/angular/facade`.
 * @zh 常量/变量 `STRING_MAP_PROTO`，定义 `src/core/angular2parse/angular/facade` 中的字符串映射表PROTO。
 */
const STRING_MAP_PROTO = Object.getPrototypeOf({});
/**
 * Executes `isStrictStringMap` to handle is strict string map.
 * @zh 执行 `isStrictStringMap`，用于是否为Strict字符串映射表。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isStrictStringMap(obj): boolean {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}

/**
 * Executes `stringify` to handle stringify.
 * @zh 执行 `stringify`，用于序列化为字符串。
 * @param token - token parameter (`any`) / 令牌参数（`any`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function stringify(token): string {
    if (typeof token === 'string') {
        return token;
    }

    if (token == null) {
        return '' + token;
    }

    if (token.overriddenName) {
        return `${token.overriddenName}`;
    }

    if (token.name) {
        return `${token.name}`;
    }

    const res = token.toString();
    const newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}

/**
 * Class `NumberWrapper` encapsulating number wrapper data structures and logic in `src/core/angular2parse/angular/facade`.
 * @zh 类 `NumberWrapper`，封装 `src/core/angular2parse/angular/facade` 中的数字包装器数据结构与处理逻辑。
 */
export class NumberWrapper {
    /**
     * Executes `parseIntAutoRadix` to handle parse int auto radix.
     * @zh 执行 `parseIntAutoRadix`，用于解析Int自动Radix。
     * @param text - text parameter (`string`) / 文本参数（`string`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    static parseIntAutoRadix(text: string): number {
        const result: number = parseInt(text);
        if (isNaN(result)) {
            throw new Error('Invalid integer literal when parsing ' + text);
        }
        return result;
    }

    /**
     * Executes `isNumeric` to handle is numeric.
     * @zh 执行 `isNumeric`，用于是否为Numeric。
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    static isNumeric(value): boolean { return !isNaN(value - parseFloat(value)); }
}

// JS has NaN !== NaN
/**
 * Executes `looseIdentical` to handle loose identical.
 * @zh 执行 `looseIdentical`，用于looseIdentical。
 * @param a - a parameter (`any`) / a参数（`any`）
 * @param b - b parameter (`any`) / b参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function looseIdentical(a, b): boolean {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}

/**
 * Executes `isJsObject` to handle is js object.
 * @zh 执行 `isJsObject`，用于是否为Js对象。
 * @param o - o parameter (`any`) / o参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isJsObject(o): boolean {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}

/**
 * Executes `print` to handle print.
 * @zh 执行 `print`，用于打印。
 * @param obj - obj parameter (`Object | Error`) / 对象参数（`Object | Error`）
 */
export function print(obj: Error | Object) {
    // tslint:disable-next-line:no-console

}

/**
 * Executes `warn` to handle warn.
 * @zh 执行 `warn`，用于警告色。
 * @param obj - obj parameter (`Object | Error`) / 对象参数（`Object | Error`）
 */
export function warn(obj: Error | Object) {
    console.warn(obj);
}

/**
 * Executes `setValueOnPath` to handle set value on path.
 * @zh 执行 `setValueOnPath`，用于集合值当路径。
 * @param global - global parameter (`any`) / 全局参数（`any`）
 * @param path - path parameter (`string`) / 路径参数（`string`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function setValueOnPath(global, path: string, value) {
    const parts = path.split('.');
    let obj = global;
    while (parts.length > 1) {
        const name = parts.shift();
        if (obj.hasOwnProperty(name) && obj[name] != null) {
            obj = obj[name];
        } else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[parts.shift()] = value;
}

/**
 * Executes `isPrimitive` to handle is primitive.
 * @zh 执行 `isPrimitive`，用于是否为Primitive。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isPrimitive(obj): boolean {
    return !isJsObject(obj);
}

/**
 * Executes `escapeRegExp` to handle escape reg exp.
 * @zh 执行 `escapeRegExp`，用于escapeRegExp。
 * @param s - s parameter (`string`) / s参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function escapeRegExp(s: string): string {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}