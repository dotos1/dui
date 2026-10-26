/**
 * @fileoverview Module `src/core/reflect/Reflect.ts` providing reflect definitions and implementation.
 * @zh 模块文件 `src/core/reflect/Reflect.ts`，提供Reflect相关的定义与实现。
 */

namespace Reflect {
    'use strict';

    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/

    /**
     * Type alias `HashMap` representing hash map (`Record<string, V>`).
     * @zh 类型别名 `HashMap`，表示Hash映射表（`Record<string, V>`）。
     */
    type HashMap<V> = Record<string, V>;

    /**
     * Interface `BufferLike` defining the contract and properties for buffer like.
     * @zh 接口 `BufferLike`，定义缓冲区Like的数据结构契约与属性规范。
     */
    interface BufferLike {
        [offset: number]: number;
        /**
         * Property `length` (`number`) storing length.
         * @zh 属性 `length`（类型：`number`），用于存储或配置长度。
         */
        length: number;
    }

    /**
     * Type alias `IteratorResult` representing iterator result (`{ value: T, done: false } | { value: never, done: true }`).
     * @zh 类型别名 `IteratorResult`，表示Iterator结果（`{ value: T, done: false } | { value: never, done: true }`）。
     */
    type IteratorResult<T> = { value: T, done: false } | { value: never, done: true };

    /**
     * Interface `Iterator` defining the contract and properties for iterator.
     * @zh 接口 `Iterator`，定义Iterator的数据结构契约与属性规范。
     */
    interface Iterator<T> {
        /**
         * Executes `next` to handle next.
         * @zh 执行 `next`，用于下一个。
         * @param value - value parameter (`any`) / 值参数（`any`）
         * @returns Result of type `IteratorResult<T>` / 类型为 `IteratorResult<T>` 的返回值
         */
        next(value?): IteratorResult<T>;
        /**
         * Executes `throw` to handle throw.
         * @zh 执行 `throw`，用于throw。
         * @param value - value parameter (`any`) / 值参数（`any`）
         * @returns Result of type `IteratorResult<T>` / 类型为 `IteratorResult<T>` 的返回值
         */
        throw?(value): IteratorResult<T>;
        /**
         * Executes `return` to handle return.
         * @zh 执行 `return`，用于return。
         * @param value - value parameter (`T`) / 值参数（`T`）
         * @returns Result of type `IteratorResult<T>` / 类型为 `IteratorResult<T>` 的返回值
         */
        return?(value?: T): IteratorResult<T>;
    }

    /**
     * Interface `Iterable` defining the contract and properties for iterable.
     * @zh 接口 `Iterable`，定义Iterable的数据结构契约与属性规范。
     */
    interface Iterable<T> {
        /**
         * Executes `@@iterator` to handle @@iterator.
         * @zh 执行 `@@iterator`，用于@@iterator。
         * @returns Result of type `Iterator<T>` / 类型为 `Iterator<T>` 的返回值
         */
        '@@iterator'(): Iterator<T>;
    }

    /**
     * Interface `IterableIterator` defining the contract and properties for iterable iterator.
     * @zh 接口 `IterableIterator`，定义IterableIterator的数据结构契约与属性规范。
     */
    interface IterableIterator<T> extends Iterator<T> {
        /**
         * Executes `@@iterator` to handle @@iterator.
         * @zh 执行 `@@iterator`，用于@@iterator。
         * @returns Result of type `IterableIterator<T>` / 类型为 `IterableIterator<T>` 的返回值
         */
        '@@iterator'(): IterableIterator<T>;
    }

    /**
     * Interface `Map` defining the contract and properties for map.
     * @zh 接口 `Map`，定义映射表的数据结构契约与属性规范。
     */
    interface Map<K, V> extends Iterable<[K, V]> {
        /**
         * Property `size` (`number`) storing size.
         * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
         */
        size: number;
        /**
         * Executes `has` to handle has.
         * @zh 执行 `has`，用于是否包含。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        has(key: K): boolean;
        /**
         * Executes `get` to handle get.
         * @zh 执行 `get`，用于获取。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `V` / 类型为 `V` 的返回值
         */
        get(key: K): V;
        /**
         * Executes `set` to handle set.
         * @zh 执行 `set`，用于集合。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @param value - value parameter (`V`) / 值参数（`V`）
         * @returns Result of type `this` / 类型为 `this` 的返回值
         */
        set(key: K, value?: V): this;
        /**
         * Executes `delete` to handle delete.
         * @zh 执行 `delete`，用于删除。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        delete(key: K): boolean;
        /**
         * Executes `clear` to handle clear.
         * @zh 执行 `clear`，用于清空。
         */
        clear(): void;
        /**
         * Executes `keys` to handle keys.
         * @zh 执行 `keys`，用于键列表。
         * @returns Result of type `IterableIterator<K>` / 类型为 `IterableIterator<K>` 的返回值
         */
        keys(): IterableIterator<K>;
        /**
         * Executes `values` to handle values.
         * @zh 执行 `values`，用于值列表。
         * @returns Result of type `IterableIterator<V>` / 类型为 `IterableIterator<V>` 的返回值
         */
        values(): IterableIterator<V>;
        /**
         * Executes `entries` to handle entries.
         * @zh 执行 `entries`，用于条目集合。
         * @returns Result of type `IterableIterator<[K, V]>` / 类型为 `IterableIterator<[K, V]>` 的返回值
         */
        entries(): IterableIterator<[K, V]>;
    }

    /**
     * Interface `MapConstructor` defining the contract and properties for map constructor.
     * @zh 接口 `MapConstructor`，定义映射表Constructor的数据结构契约与属性规范。
     */
    interface MapConstructor {
        new(): Map<unknown, unknown>;
        new <K, V>(): Map<K, V>;
        /**
         * Property `prototype` (`Map<any, any>`) storing prototype.
         * @zh 属性 `prototype`（类型：`Map<any, any>`），用于存储或配置prototype。
         */
        prototype;
    }

    /**
     * Interface `Set` defining the contract and properties for set.
     * @zh 接口 `Set`，定义集合的数据结构契约与属性规范。
     */
    interface Set<T> extends Iterable<T> {
        /**
         * Property `size` (`number`) storing size.
         * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
         */
        size: number;
        /**
         * Executes `has` to handle has.
         * @zh 执行 `has`，用于是否包含。
         * @param value - value parameter (`T`) / 值参数（`T`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        has(value: T): boolean;
        /**
         * Executes `add` to handle add.
         * @zh 执行 `add`，用于添加。
         * @param value - value parameter (`T`) / 值参数（`T`）
         * @returns Result of type `this` / 类型为 `this` 的返回值
         */
        add(value: T): this;
        /**
         * Executes `delete` to handle delete.
         * @zh 执行 `delete`，用于删除。
         * @param value - value parameter (`T`) / 值参数（`T`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        delete(value: T): boolean;
        /**
         * Executes `clear` to handle clear.
         * @zh 执行 `clear`，用于清空。
         */
        clear(): void;
        /**
         * Executes `keys` to handle keys.
         * @zh 执行 `keys`，用于键列表。
         * @returns Result of type `IterableIterator<T>` / 类型为 `IterableIterator<T>` 的返回值
         */
        keys(): IterableIterator<T>;
        /**
         * Executes `values` to handle values.
         * @zh 执行 `values`，用于值列表。
         * @returns Result of type `IterableIterator<T>` / 类型为 `IterableIterator<T>` 的返回值
         */
        values(): IterableIterator<T>;
        /**
         * Executes `entries` to handle entries.
         * @zh 执行 `entries`，用于条目集合。
         * @returns Result of type `IterableIterator<[T, T]>` / 类型为 `IterableIterator<[T, T]>` 的返回值
         */
        entries(): IterableIterator<[T, T]>;
    }

    /**
     * Interface `SetConstructor` defining the contract and properties for set constructor.
     * @zh 接口 `SetConstructor`，定义集合Constructor的数据结构契约与属性规范。
     */
    interface SetConstructor {
        new(): Set<unknown>;
        new <T>(): Set<T>;
        /**
         * Property `prototype` (`Set<any>`) storing prototype.
         * @zh 属性 `prototype`（类型：`Set<any>`），用于存储或配置prototype。
         */
        prototype;
    }

    /**
     * Interface `WeakMap` defining the contract and properties for weak map.
     * @zh 接口 `WeakMap`，定义Weak映射表的数据结构契约与属性规范。
     */
    interface WeakMap<K, V> {
        /**
         * Executes `clear` to handle clear.
         * @zh 执行 `clear`，用于清空。
         */
        clear(): void;
        /**
         * Executes `delete` to handle delete.
         * @zh 执行 `delete`，用于删除。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        delete(key: K): boolean;
        /**
         * Executes `get` to handle get.
         * @zh 执行 `get`，用于获取。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `V` / 类型为 `V` 的返回值
         */
        get(key: K): V;
        /**
         * Executes `has` to handle has.
         * @zh 执行 `has`，用于是否包含。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
         */
        has(key: K): boolean;
        /**
         * Executes `set` to handle set.
         * @zh 执行 `set`，用于集合。
         * @param key - key parameter (`K`) / 键参数（`K`）
         * @param value - value parameter (`V`) / 值参数（`V`）
         * @returns Result of type `WeakMap<K, V>` / 类型为 `WeakMap<K, V>` 的返回值
         */
        set(key: K, value?: V): WeakMap<K, V>;
    }

    /**
     * Interface `WeakMapConstructor` defining the contract and properties for weak map constructor.
     * @zh 接口 `WeakMapConstructor`，定义Weak映射表Constructor的数据结构契约与属性规范。
     */
    interface WeakMapConstructor {
        new(): WeakMap<unknown, unknown>;
        new <K, V>(): WeakMap<K, V>;
        /**
         * Property `prototype` (`WeakMap<any, any>`) storing prototype.
         * @zh 属性 `prototype`（类型：`WeakMap<any, any>`），用于存储或配置prototype。
         */
        prototype;
    }

    /**
     * Type alias `MemberDecorator` representing member decorator (`<T>(target: Object, propertyKey: string | symbol, descriptor?: TypedPr...`).
     * @zh 类型别名 `MemberDecorator`，表示成员Decorator（`<T>(target: Object, propertyKey: string | symbol, descriptor?: TypedPr...`）。
     */
    type MemberDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

    /**
     * Constant/variable `Symbol` defining symbol in `src/core/reflect`.
     * @zh 常量/变量 `Symbol`，定义 `src/core/reflect` 中的Symbol。
     */
    declare const Symbol;
    /**
     * Constant/variable `Set` defining set in `src/core/reflect`.
     * @zh 常量/变量 `Set`，定义 `src/core/reflect` 中的集合。
     */
    declare const Set: SetConstructor;
    /**
     * Constant/variable `WeakMap` defining weak map in `src/core/reflect`.
     * @zh 常量/变量 `WeakMap`，定义 `src/core/reflect` 中的Weak映射表。
     */
    declare const WeakMap: WeakMapConstructor;
    /**
     * Constant/variable `Map` defining map in `src/core/reflect`.
     * @zh 常量/变量 `Map`，定义 `src/core/reflect` 中的映射表。
     */
    declare const Map: MapConstructor;
    /**
     * Constant/variable `global` defining global in `src/core/reflect`.
     * @zh 常量/变量 `global`，定义 `src/core/reflect` 中的全局。
     */
    declare const global;
    /**
     * Constant/variable `crypto` defining crypto in `src/core/reflect`.
     * @zh 常量/变量 `crypto`，定义 `src/core/reflect` 中的crypto。
     */
    declare const crypto: Crypto;
    /**
     * Constant/variable `msCrypto` defining ms crypto in `src/core/reflect`.
     * @zh 常量/变量 `msCrypto`，定义 `src/core/reflect` 中的毫秒Crypto。
     */
    declare const msCrypto: Crypto;
    /**
     * Constant/variable `process` defining process in `src/core/reflect`.
     * @zh 常量/变量 `process`，定义 `src/core/reflect` 中的处理。
     */
    declare const process;

    /**
     * Constant/variable `hasOwn` defining has own in `src/core/reflect`.
     * @zh 常量/变量 `hasOwn`，定义 `src/core/reflect` 中的是否包含Own。
     */
    const hasOwn = Object.prototype.hasOwnProperty;

    // feature test for Symbol support
    /**
     * Constant/variable `supportsSymbol` defining supports symbol in `src/core/reflect`.
     * @zh 常量/变量 `supportsSymbol`，定义 `src/core/reflect` 中的supportsSymbol。
     */
    const supportsSymbol = typeof Symbol === 'function';
    /**
     * Constant/variable `toPrimitiveSymbol` defining to primitive symbol in `src/core/reflect`.
     * @zh 常量/变量 `toPrimitiveSymbol`，定义 `src/core/reflect` 中的转换为PrimitiveSymbol。
     */
    const toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== 'undefined' ? Symbol.toPrimitive : '@@toPrimitive';
    /**
     * Constant/variable `iteratorSymbol` defining iterator symbol in `src/core/reflect`.
     * @zh 常量/变量 `iteratorSymbol`，定义 `src/core/reflect` 中的iteratorSymbol。
     */
    const iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== 'undefined' ? Symbol.iterator : '@@iterator';

    namespace HashMap {
        /**
         * Constant/variable `supportsCreate` defining supports create in `src/core/reflect`.
         * @zh 常量/变量 `supportsCreate`，定义 `src/core/reflect` 中的supports创建。
         */
        const supportsCreate = typeof Object.create === 'function'; // feature test for Object.create support
        /**
         * Constant/variable `supportsProto` defining supports proto in `src/core/reflect`.
         * @zh 常量/变量 `supportsProto`，定义 `src/core/reflect` 中的supportsProto。
         */
        const supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        /**
         * Constant/variable `downLevel` defining down level in `src/core/reflect`.
         * @zh 常量/变量 `downLevel`，定义 `src/core/reflect` 中的向下层级。
         */
        const downLevel = !supportsCreate && !supportsProto;

        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        /**
         * Constant/variable `create` defining create in `src/core/reflect`.
         * @zh 常量/变量 `create`，定义 `src/core/reflect` 中的创建。
         */
        export const create = supportsCreate
            ? <V>() => MakeDictionary(Object.create(null) as HashMap<V>)
            : supportsProto
                ? <V>() => MakeDictionary({ __proto__: null as unknown } as HashMap<V>)
                : <V>() => MakeDictionary({} as HashMap<V>);

        /**
         * Constant/variable `has` defining has in `src/core/reflect`.
         * @zh 常量/变量 `has`，定义 `src/core/reflect` 中的是否包含。
         */
        export const has = downLevel
            ? <V>(map: HashMap<V>, key: string | number ) => hasOwn.call(map, key)
            : <V>(map: HashMap<V>, key: string | number ) => key in map;

        /**
         * Constant/variable `get` defining get in `src/core/reflect`.
         * @zh 常量/变量 `get`，定义 `src/core/reflect` 中的获取。
         */
        export const get = downLevel
            ? <V>(map: HashMap<V>, key: string | number ): V | undefined => hasOwn.call(map, key) ? map[key] : undefined
            : <V>(map: HashMap<V>, key: string | number ): V | undefined => map[key];
    }

    // Load global or shim versions of Map, Set, and WeakMap
    /**
     * Constant/variable `functionPrototype` defining function prototype in `src/core/reflect`.
     * @zh 常量/变量 `functionPrototype`，定义 `src/core/reflect` 中的函数Prototype。
     */
    const functionPrototype = Object.getPrototypeOf(Function);
    /**
     * Constant/variable `usePolyfill` defining use polyfill in `src/core/reflect`.
     * @zh 常量/变量 `usePolyfill`，定义 `src/core/reflect` 中的使用Polyfill。
     */
    const usePolyfill = typeof process === 'object' && process.env && process.env['REFLECT_METADATA_USE_MAP_POLYFILL'] === 'true';
    /**
     * Constant/variable `_Map` defining map in `src/core/reflect`.
     * @zh 常量/变量 `_Map`，定义 `src/core/reflect` 中的映射表。
     */
    const _Map: typeof Map = !usePolyfill && typeof Map === 'function' && typeof Map.prototype.entries === 'function' ? Map : CreateMapPolyfill();
    /**
     * Constant/variable `_Set` defining set in `src/core/reflect`.
     * @zh 常量/变量 `_Set`，定义 `src/core/reflect` 中的集合。
     */
    const _Set: typeof Set = !usePolyfill && typeof Set === 'function' && typeof Set.prototype.entries === 'function' ? Set : CreateSetPolyfill();
    /**
     * Constant/variable `_WeakMap` defining weak map in `src/core/reflect`.
     * @zh 常量/变量 `_WeakMap`，定义 `src/core/reflect` 中的Weak映射表。
     */
    const _WeakMap: typeof WeakMap = !usePolyfill && typeof WeakMap === 'function' ? WeakMap : CreateWeakMapPolyfill();

    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    /**
     * Constant/variable `Metadata` defining metadata in `src/core/reflect`.
     * @zh 常量/变量 `Metadata`，定义 `src/core/reflect` 中的元数据。
     */
    const Metadata = new _WeakMap<unknown, Map<string | symbol | undefined, Map<unknown, unknown>>>();

    /**
      * Applies a set of decorators to a target object.
      * param decorators An array of decorators.
      * param target The target object.
      *  The result of applying the provided decorators.
      * @remarks Decorators are applied in reverse order of their positions in the array.
      * @example
      *
      *     class Example { }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *

     * @zh 执行 `decorate`，用于decorate。
     */
    export function decorate(decorators: ClassDecorator[], target: Function): Function;

    /**
      * Applies a set of decorators to a property of a target object.
      * param decorators An array of decorators.
      * param target The target object.
      * param propertyKey The property key to decorate.
      * param attributes A property descriptor.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod() { }
      *         method() { }
      *     }
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *

     * @zh 执行 `decorate`，用于decorate。
     */
    export function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target, propertyKey: string | symbol, attributes?: PropertyDescriptor | null): PropertyDescriptor | undefined;

    /**
      * Applies a set of decorators to a property of a target object.
      * param decorators An array of decorators.
      * param target The target object.
      * param propertyKey The property key to decorate.
      * param attributes A property descriptor.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod() { }
      *         method() { }
      *     }
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *

     * @zh 执行 `decorate`，用于decorate。
     */
    export function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target, propertyKey: string | symbol, attributes: PropertyDescriptor): PropertyDescriptor;

    /**
      * Applies a set of decorators to a property of a target object.
      * param decorators An array of decorators.
      * param target The target object.
      * param propertyKey (Optional) The property key to decorate.
      * param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *

     * @zh 执行 `decorate`，用于decorate。
     */
    export function decorate(decorators: (ClassDecorator | MemberDecorator)[], target, propertyKey?: string | symbol, attributes?: PropertyDescriptor | null): PropertyDescriptor | Function | undefined {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators)) { throw new TypeError(); }
            if (!IsObject(target)) { throw new TypeError(); }
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) { throw new TypeError(); }
            if (IsNull(attributes)) { attributes = undefined; }
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(<MemberDecorator[]>decorators, target, propertyKey, attributes);
        } else {
            if (!IsArray(decorators)) { throw new TypeError(); }
            if (!IsConstructor(target)) { throw new TypeError(); }
            return DecorateConstructor(<ClassDecorator[]>decorators, <Function>target);
        }
    }

    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata

    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * param metadataKey The key for the metadata entry.
      * param metadataValue The value for the metadata entry.
      *  A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *

     * @zh 执行 `metadata`，用于元数据。
     */
    export function metadata(metadataKey, metadataValue) {
        function decorator(target: Function): void;
        // eslint-disable-next-line no-redeclare
        function decorator(target, propertyKey: string | symbol): void;
        // eslint-disable-next-line no-redeclare
        function decorator(target, propertyKey?: string | symbol): void {
            if (!IsObject(target)) { throw new TypeError(); }
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) { throw new TypeError(); }
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }

    // 4.1.3 Reflect.defineMetadata(metadataKey, metadataValue, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect.definemetadata

    /**
      * Define a unique metadata entry on the target.
      * param metadataKey A key used to store and retrieve metadata.
      * param metadataValue A value that contains attached metadata.
      * param target The target object on which to define metadata.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): ClassDecorator {
      *         return target => Reflect.defineMetadata("custom:annotation", options, target);
      *     }
      *

     * @zh 执行 `defineMetadata`，用于define元数据。
     */
    export function defineMetadata(metadataKey, metadataValue, target): void;

    /**
      * Define a unique metadata entry on the target.
      * param metadataKey A key used to store and retrieve metadata.
      * param metadataValue A value that contains attached metadata.
      * param target The target object on which to define metadata.
      * param propertyKey The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", Number, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): PropertyDecorator {
      *         return (target, key) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *

     * @zh 执行 `defineMetadata`，用于define元数据。
     */
    export function defineMetadata(metadataKey, metadataValue, target, propertyKey: string | symbol): void;

    /**
      * Define a unique metadata entry on the target.
      * param metadataKey A key used to store and retrieve metadata.
      * param metadataValue A value that contains attached metadata.
      * param target The target object on which to define metadata.
      * param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *

     * @zh 执行 `defineMetadata`，用于define元数据。
     */
    export function defineMetadata(metadataKey, metadataValue, target, propertyKey?: string | symbol): void {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }

    // 4.1.4 Reflect.hasMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect.hasmetadata

    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      *  `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *

     * @zh 执行 `hasMetadata`，用于是否包含元数据。
     */
    export function hasMetadata(metadataKey, target): boolean;

    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `hasMetadata`，用于是否包含元数据。
     */
    export function hasMetadata(metadataKey, target, propertyKey: string | symbol): boolean;

    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `hasMetadata`，用于是否包含元数据。
     */
    export function hasMetadata(metadataKey, target, propertyKey?: string | symbol): boolean {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }

    // 4.1.5 Reflect.hasOwnMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-hasownmetadata

    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      *  `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *

     * @zh 执行 `hasOwnMetadata`，用于是否包含Own元数据。
     */
    export function hasOwnMetadata(metadataKey, target): boolean;

    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `hasOwnMetadata`，用于是否包含Own元数据。
     */
    export function hasOwnMetadata(metadataKey, target, propertyKey: string | symbol): boolean;

    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `hasOwnMetadata`，用于是否包含Own元数据。
     */
    export function hasOwnMetadata(metadataKey, target, propertyKey?: string | symbol): boolean {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }

    // 4.1.6 Reflect.getMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getmetadata

    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *

     * @zh 执行 `getMetadata`，用于获取元数据。
     */
    export function getMetadata(metadataKey, target);

    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `getMetadata`，用于获取元数据。
     */
    export function getMetadata(metadataKey, target, propertyKey: string | symbol);

    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `getMetadata`，用于获取元数据。
     */
    export function getMetadata(metadataKey, target, propertyKey?: string | symbol) {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }

    // 4.1.7 Reflect.getOwnMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getownmetadata

    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *

     * @zh 执行 `getOwnMetadata`，用于获取Own元数据。
     */
    export function getOwnMetadata(metadataKey, target);

    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `getOwnMetadata`，用于获取Own元数据。
     */
    export function getOwnMetadata(metadataKey, target, propertyKey: string | symbol);

    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `getOwnMetadata`，用于获取Own元数据。
     */
    export function getOwnMetadata(metadataKey, target, propertyKey?: string | symbol) {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }

    // 4.1.8 Reflect.getMetadataKeys(target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getmetadatakeys

    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * param target The target object on which the metadata is defined.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *

     * @zh 执行 `getMetadataKeys`，用于获取元数据键列表。
     */
    export function getMetadataKeys(target);

    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *

     * @zh 执行 `getMetadataKeys`，用于获取元数据键列表。
     */
    export function getMetadataKeys(target, propertyKey: string | symbol);

    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *

     * @zh 执行 `getMetadataKeys`，用于获取元数据键列表。
     */
    export function getMetadataKeys(target, propertyKey?: string | symbol) {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryMetadataKeys(target, propertyKey);
    }

    // 4.1.9 Reflect.getOwnMetadataKeys(target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-getownmetadata

    /**
      * Gets the unique metadata keys defined on the target object.
      * param target The target object on which the metadata is defined.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *

     * @zh 执行 `getOwnMetadataKeys`，用于获取Own元数据键列表。
     */
    export function getOwnMetadataKeys(target);

    /**
      * Gets the unique metadata keys defined on the target object.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *

     * @zh 执行 `getOwnMetadataKeys`，用于获取Own元数据键列表。
     */
    export function getOwnMetadataKeys(target, propertyKey: string | symbol);

    /**
      * Gets the unique metadata keys defined on the target object.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *

     * @zh 执行 `getOwnMetadataKeys`，用于获取Own元数据键列表。
     */
    export function getOwnMetadataKeys(target, propertyKey?: string | symbol) {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }

    // 4.1.10 Reflect.deleteMetadata(metadataKey, target [, propertyKey])
    // https://rbuckton.github.io/reflect-metadata/#reflect-deletemetadata

    /**
      * Deletes the metadata entry from the target object with the provided key.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      *  `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *

     * @zh 执行 `deleteMetadata`，用于删除元数据。
     */
    export function deleteMetadata(metadataKey, target): boolean;

    /**
      * Deletes the metadata entry from the target object with the provided key.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey The property key for the target.
      *  `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `deleteMetadata`，用于删除元数据。
     */
    export function deleteMetadata(metadataKey, target, propertyKey: string | symbol): boolean;

    /**
      * Deletes the metadata entry from the target object with the provided key.
      * param metadataKey A key used to store and retrieve metadata.
      * param target The target object on which the metadata is defined.
      * param propertyKey (Optional) The property key for the target.
      *  `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *

     * @zh 执行 `deleteMetadata`，用于删除元数据。
     */
    export function deleteMetadata(metadataKey, target, propertyKey?: string | symbol): boolean {
        if (!IsObject(target)) { throw new TypeError(); }
        if (!IsUndefined(propertyKey)) { propertyKey = ToPropertyKey(propertyKey); }
        const metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap)) { return false; }
        if (!metadataMap.delete(metadataKey)) { return false; }
        if (metadataMap.size > 0) { return true; }
        const targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0) { return true; }
        Metadata.delete(target);
        return true;
    }

    /**
     * Executes `DecorateConstructor` to handle decorate constructor.
     * @zh 执行 `DecorateConstructor`，用于DecorateConstructor。
     * @param decorators - decorators parameter (`ClassDecorator[]`) / decorators参数（`ClassDecorator[]`）
     * @param target - target parameter (`Function`) / 目标参数（`Function`）
     * @returns Result of type `Function` / 类型为 `Function` 的返回值
     */
    function DecorateConstructor(decorators: ClassDecorator[], target: Function): Function {
        for (let i = decorators.length - 1; i >= 0; --i) {
            const decorator = decorators[i];
            const decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated)) { throw new TypeError(); }
                target = <Function>decorated;
            }
        }
        return target;
    }

    /**
     * Executes `DecorateProperty` to handle decorate property.
     * @zh 执行 `DecorateProperty`，用于Decorate属性。
     * @param decorators - decorators parameter (`MemberDecorator[]`) / decorators参数（`MemberDecorator[]`）
     * @param target - target parameter (`any`) / 目标参数（`any`）
     * @param propertyKey - property key parameter (`string | symbol`) / 属性键参数（`string | symbol`）
     * @param descriptor - descriptor parameter (`PropertyDescriptor | undefined`) / descriptor参数（`PropertyDescriptor | undefined`）
     * @returns Result of type `PropertyDescriptor | undefined` / 类型为 `PropertyDescriptor | undefined` 的返回值
     */
    function DecorateProperty(decorators: MemberDecorator[], target, propertyKey: string | symbol, descriptor: PropertyDescriptor | undefined): PropertyDescriptor | undefined {
        for (let i = decorators.length - 1; i >= 0; --i) {
            const decorator = decorators[i];
            const decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated)) { throw new TypeError(); }
                descriptor = <PropertyDescriptor>decorated;
            }
        }
        return descriptor;
    }

    // 2.1.1 GetOrCreateMetadataMap(O, P, Create)
    // https://rbuckton.github.io/reflect-metadata/#getorcreatemetadatamap
    /**
     * Executes `GetOrCreateMetadataMap` to handle get or create metadata map.
     * @zh 执行 `GetOrCreateMetadataMap`，用于获取Or创建元数据映射表。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @param Create - create parameter (`true`) / 创建参数（`true`）
     * @returns Result of type `Map<any, any>` / 类型为 `Map<any, any>` 的返回值
     */
    function GetOrCreateMetadataMap(O, P: string | symbol | undefined, Create: true);
    /**
     * Executes `GetOrCreateMetadataMap` to handle get or create metadata map.
     * @zh 执行 `GetOrCreateMetadataMap`，用于获取Or创建元数据映射表。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @param Create - create parameter (`false`) / 创建参数（`false`）
     * @returns Result of type `Map<any, any> | undefined` / 类型为 `Map<any, any> | undefined` 的返回值
     */
    function GetOrCreateMetadataMap(O, P: string | symbol | undefined, Create: false);
    /**
     * Executes `GetOrCreateMetadataMap` to handle get or create metadata map.
     * @zh 执行 `GetOrCreateMetadataMap`，用于获取Or创建元数据映射表。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @param Create - create parameter (`boolean`) / 创建参数（`boolean`）
     * @returns Result of type `Map<any, any> | undefined` / 类型为 `Map<any, any> | undefined` 的返回值
     */
    function GetOrCreateMetadataMap(O, P: string | symbol | undefined, Create: boolean) {
        let targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create) { return undefined; }
            targetMetadata = new _Map<string | symbol | undefined, Map<unknown, unknown>>();
            Metadata.set(O, targetMetadata);
        }
        let metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create) { return undefined; }
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }

    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    /**
     * Executes `OrdinaryHasMetadata` to handle ordinary has metadata.
     * @zh 执行 `OrdinaryHasMetadata`，用于Ordinary是否包含元数据。
     * @param MetadataKey - metadata key parameter (`any`) / 元数据键参数（`any`）
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    function OrdinaryHasMetadata(MetadataKey, O, P: string | symbol | undefined): boolean {
        const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) { return true; }
        const parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent)) { return OrdinaryHasMetadata(MetadataKey, parent, P); }
        return false;
    }

    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    /**
     * Executes `OrdinaryHasOwnMetadata` to handle ordinary has own metadata.
     * @zh 执行 `OrdinaryHasOwnMetadata`，用于Ordinary是否包含Own元数据。
     * @param MetadataKey - metadata key parameter (`any`) / 元数据键参数（`any`）
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    function OrdinaryHasOwnMetadata(MetadataKey, O, P: string | symbol | undefined): boolean {
        const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap)) { return false; }
        return Toboolean(metadataMap.has(MetadataKey));
    }

    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    /**
     * Executes `OrdinaryGetMetadata` to handle ordinary get metadata.
     * @zh 执行 `OrdinaryGetMetadata`，用于Ordinary获取元数据。
     * @param MetadataKey - metadata key parameter (`any`) / 元数据键参数（`any`）
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    function OrdinaryGetMetadata(MetadataKey, O, P: string | symbol | undefined) {
        const hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn) { return OrdinaryGetOwnMetadata(MetadataKey, O, P); }
        const parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent)) { return OrdinaryGetMetadata(MetadataKey, parent, P); }
        return undefined;
    }

    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    /**
     * Executes `OrdinaryGetOwnMetadata` to handle ordinary get own metadata.
     * @zh 执行 `OrdinaryGetOwnMetadata`，用于Ordinary获取Own元数据。
     * @param MetadataKey - metadata key parameter (`any`) / 元数据键参数（`any`）
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    function OrdinaryGetOwnMetadata(MetadataKey, O, P: string | symbol | undefined) {
        const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap)) { return undefined; }
        return metadataMap.get(MetadataKey);
    }

    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    /**
     * Executes `OrdinaryDefineOwnMetadata` to handle ordinary define own metadata.
     * @zh 执行 `OrdinaryDefineOwnMetadata`，用于OrdinaryDefineOwn元数据。
     * @param MetadataKey - metadata key parameter (`any`) / 元数据键参数（`any`）
     * @param MetadataValue - metadata value parameter (`any`) / 元数据值参数（`any`）
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     */
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P: string | symbol | undefined): void {
        const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }

    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    /**
     * Executes `OrdinaryMetadataKeys` to handle ordinary metadata keys.
     * @zh 执行 `OrdinaryMetadataKeys`，用于Ordinary元数据键列表。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    function OrdinaryMetadataKeys(O, P: string | symbol | undefined) {
        const ownKeys = OrdinaryOwnMetadataKeys(O, P);
        const parent = OrdinaryGetPrototypeOf(O);
        if (parent === null) { return ownKeys; }
        const parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0) { return ownKeys; }
        if (ownKeys.length <= 0) { return parentKeys; }
        const set = new _Set();
        const keys = [];
        for (const key of ownKeys) {
            const hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (const key of parentKeys) {
            const hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }

    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    /**
     * Executes `OrdinaryOwnMetadataKeys` to handle ordinary own metadata keys.
     * @zh 执行 `OrdinaryOwnMetadataKeys`，用于OrdinaryOwn元数据键列表。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param P - p parameter (`string | symbol | undefined`) / P参数（`string | symbol | undefined`）
     * @returns Result of type `any[]` / 类型为 `any[]` 的返回值
     */
    function OrdinaryOwnMetadataKeys(O, P: string | symbol | undefined) {
        const keys = [];
        const metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap)) { return keys; }
        const keysObj = metadataMap.keys();
        const iterator = GetIterator(keysObj);
        let k = 0;
        while (true) {
            const next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            const nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            } catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    // eslint-disable-next-line no-unsafe-finally
                    throw e;
                }
            }
            k++;
        }
    }

    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    /**
     * Executes `Type` to handle type.
     * @zh 执行 `Type`，用于类型。
     * @param x - x parameter (`any`) / X坐标参数（`any`）
     * @returns Result of type `Tag` / 类型为 `Tag` 的返回值
     */
    function Type(x): Tag {
        if (x === null) { return Tag.Null; }
        switch (typeof x) {
            case 'undefined': return Tag.Undefined;
            case 'boolean': return Tag.boolean;
            case 'string': return Tag.String;
            case 'symbol': return Tag.Symbol;
            case 'number': return Tag.Number;
            case 'object': return x === null ? Tag.Null : Tag.Object;
            default: return Tag.Object;
        }
    }

    // 6.1 ECMAScript Language Types
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types
    /**
     * Enumeration `Tag` defining supported tag constants.
     * @zh 枚举 `Tag`，定义支持的标签常量集合。
     */
    const enum Tag {
        /**
         * Enum member `Tag.Undefined` representing undefined.
         * @zh 枚举项 `Tag.Undefined`，表示未定义。
         */
        Undefined,
        /**
         * Enum member `Tag.Null` representing null.
         * @zh 枚举项 `Tag.Null`，表示空值。
         */
        Null,
        /**
         * Enum member `Tag.boolean` representing boolean.
         * @zh 枚举项 `Tag.boolean`，表示布尔值。
         */
        boolean,
        /**
         * Enum member `Tag.String` representing string.
         * @zh 枚举项 `Tag.String`，表示字符串。
         */
        String,
        /**
         * Enum member `Tag.Symbol` representing symbol.
         * @zh 枚举项 `Tag.Symbol`，表示Symbol。
         */
        Symbol,
        /**
         * Enum member `Tag.Number` representing number.
         * @zh 枚举项 `Tag.Number`，表示数字。
         */
        Number,
        /**
         * Enum member `Tag.Object` representing object.
         * @zh 枚举项 `Tag.Object`，表示对象。
         */
        Object
    }

    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    /**
     * Executes `IsUndefined` to handle is undefined.
     * @zh 执行 `IsUndefined`，用于是否为未定义。
     * @param x - x parameter (`any`) / X坐标参数（`any`）
     * @returns Result of type `x is undefined` / 类型为 `x is undefined` 的返回值
     */
    function IsUndefined(x): x is undefined {
        return x === undefined;
    }

    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    /**
     * Executes `IsNull` to handle is null.
     * @zh 执行 `IsNull`，用于是否为空值。
     * @param x - x parameter (`any`) / X坐标参数（`any`）
     * @returns Result of type `x is null` / 类型为 `x is null` 的返回值
     */
    function IsNull(x): x is null {
        return x === null;
    }

    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    /**
     * Executes `IsSymbol` to handle is symbol.
     * @zh 执行 `IsSymbol`，用于是否为Symbol。
     * @param x - x parameter (`any`) / X坐标参数（`any`）
     * @returns Result of type `x is symbol` / 类型为 `x is symbol` 的返回值
     */
    function IsSymbol(x): x is symbol {
        return typeof x === 'symbol';
    }

    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    /**
     * Executes `IsObject` to handle is object.
     * @zh 执行 `IsObject`，用于是否为对象。
     * @param x - x parameter (`T | undefined | null | boolean | string | symbol | number`) / X坐标参数（`T | undefined | null | boolean | string | symbol | number`）
     * @returns Result of type `x is T` / 类型为 `x is T` 的返回值
     */
    function IsObject<T>(x: T | undefined | null | boolean | string | symbol | number): x is T {
        return typeof x === 'object' ? x !== null : typeof x === 'function';
    }

    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion

    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    /**
     * Executes `ToPrimitive` to handle to primitive.
     * @zh 执行 `ToPrimitive`，用于转换为Primitive。
     * @param input - input parameter (`any`) / 输入属性参数（`any`）
     * @param PreferredType - preferred type parameter (`Tag`) / Preferred类型参数（`Tag`）
     * @returns Result of type `undefined | null | boolean | string | symbol | number` / 类型为 `undefined | null | boolean | string | symbol | number` 的返回值
     */
    function ToPrimitive(input, PreferredType?: Tag): undefined | null | boolean | string | symbol | number {
        switch (Type(input)) {
            case Tag.Undefined: return input;
            case Tag.Null: return input;
            case Tag.boolean: return input;
            case Tag.String: return input;
            case Tag.Symbol: return input;
            case Tag.Number: return input;
        }
        const hint: 'string' | 'number' | 'default' = PreferredType === Tag.String ? 'string' : PreferredType === Tag.Number ? 'number' : 'default';
        const exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            const result = exoticToPrim.call(input, hint);
            if (IsObject(result)) { throw new TypeError(); }
            return result;
        }
        return OrdinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
    }

    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    /**
     * Executes `OrdinaryToPrimitive` to handle ordinary to primitive.
     * @zh 执行 `OrdinaryToPrimitive`，用于Ordinary转换为Primitive。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @param hint - hint parameter (`'string' | 'number'`) / 提示信息参数（`'string' | 'number'`）
     * @returns Result of type `undefined | null | boolean | string | symbol | number` / 类型为 `undefined | null | boolean | string | symbol | number` 的返回值
     */
    function OrdinaryToPrimitive(O, hint: 'string' | 'number'): undefined | null | boolean | string | symbol | number {
        if (hint === 'string') {
            const toString = O.toString;
            if (IsCallable(toString)) {
                const result = toString.call(O);
                if (!IsObject(result)) { return result; }
            }
            const valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                const result = valueOf.call(O);
                if (!IsObject(result)) { return result; }
            }
        } else {
            const valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                const result = valueOf.call(O);
                if (!IsObject(result)) { return result; }
            }
            const toString = O.toString;
            if (IsCallable(toString)) {
                const result = toString.call(O);
                if (!IsObject(result)) { return result; }
            }
        }
        throw new TypeError();
    }

    // 7.1.2 Toboolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    /**
     * Executes `Toboolean` to handle toboolean.
     * @zh 执行 `Toboolean`，用于Toboolean。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    function Toboolean(argument): boolean {
        return !!argument;
    }

    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    /**
     * Executes `ToString` to handle to string.
     * @zh 执行 `ToString`，用于转换为字符串。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    function ToString(argument): string {
        return '' + argument;
    }

    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    /**
     * Executes `ToPropertyKey` to handle to property key.
     * @zh 执行 `ToPropertyKey`，用于转换为属性键。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `string | symbol` / 类型为 `string | symbol` 的返回值
     */
    function ToPropertyKey(argument): string | symbol {
        const key = ToPrimitive(argument, Tag.String);
        if (IsSymbol(key)) { return key; }
        return ToString(key);
    }

    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations

    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    /**
     * Executes `IsArray` to handle is array.
     * @zh 执行 `IsArray`，用于是否为数组。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `argument is any[]` / 类型为 `argument is any[]` 的返回值
     */
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === '[object Array]';
    }

    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    /**
     * Executes `IsCallable` to handle is callable.
     * @zh 执行 `IsCallable`，用于是否为Callable。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `argument is Function` / 类型为 `argument is Function` 的返回值
     */
    function IsCallable(argument): argument is Function {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === 'function';
    }

    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    /**
     * Executes `IsConstructor` to handle is constructor.
     * @zh 执行 `IsConstructor`，用于是否为Constructor。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `argument is Function` / 类型为 `argument is Function` 的返回值
     */
    function IsConstructor(argument): argument is Function {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === 'function';
    }

    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    /**
     * Executes `IsPropertyKey` to handle is property key.
     * @zh 执行 `IsPropertyKey`，用于是否为属性键。
     * @param argument - argument parameter (`any`) / argument参数（`any`）
     * @returns Result of type `argument is string | symbol` / 类型为 `argument is string | symbol` 的返回值
     */
    function IsPropertyKey(argument): argument is string | symbol {
        switch (Type(argument)) {
            case Tag.String: return true;
            case Tag.Symbol: return true;
            default: return false;
        }
    }

    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects

    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    /**
     * Executes `GetMethod` to handle get method.
     * @zh 执行 `GetMethod`，用于获取方法。
     * @param V - v parameter (`any`) / V参数（`any`）
     * @param P - p parameter (`any`) / P参数（`any`）
     * @returns Result of type `Function | undefined` / 类型为 `Function | undefined` 的返回值
     */
    function GetMethod(V, P): Function | undefined {
        const func = V[P];
        if (func === undefined || func === null) { return undefined; }
        if (!IsCallable(func)) { throw new TypeError(); }
        return func;
    }

    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects

    /**
     * Executes `GetIterator` to handle get iterator.
     * @zh 执行 `GetIterator`，用于获取Iterator。
     * @param obj - obj parameter (`Iterable<T>`) / 对象参数（`Iterable<T>`）
     * @returns Result of type `Iterator<T>` / 类型为 `Iterator<T>` 的返回值
     */
    function GetIterator<T>(obj: Iterable<T>): Iterator<T> {
        const method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method)) { throw new TypeError(); } // from Call
        const iterator = method.call(obj);
        if (!IsObject(iterator)) { throw new TypeError(); }
        return iterator;
    }

    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    /**
     * Executes `IteratorValue` to handle iterator value.
     * @zh 执行 `IteratorValue`，用于Iterator值。
     * @param iterResult - iter result parameter (`IteratorResult<T>`) / iter结果参数（`IteratorResult<T>`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    function IteratorValue<T>(iterResult: IteratorResult<T>): T {
        return iterResult.value;
    }

    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    /**
     * Executes `IteratorStep` to handle iterator step.
     * @zh 执行 `IteratorStep`，用于Iterator步骤。
     * @param iterator - iterator parameter (`Iterator<T>`) / iterator参数（`Iterator<T>`）
     * @returns Result of type `IteratorResult<T> | false` / 类型为 `IteratorResult<T> | false` 的返回值
     */
    function IteratorStep<T>(iterator: Iterator<T>): IteratorResult<T> | false {
        const result = iterator.next();
        return result.done ? false : result;
    }

    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    /**
     * Executes `IteratorClose` to handle iterator close.
     * @zh 执行 `IteratorClose`，用于Iterator关闭。
     * @param iterator - iterator parameter (`Iterator<T>`) / iterator参数（`Iterator<T>`）
     */
    function IteratorClose<T>(iterator: Iterator<T>) {
        const f = iterator['return'];
        if (f) { f.call(iterator); }
    }

    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots

    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    /**
     * Executes `OrdinaryGetPrototypeOf` to handle ordinary get prototype of.
     * @zh 执行 `OrdinaryGetPrototypeOf`，用于Ordinary获取Prototype的。
     * @param O - o parameter (`any`) / O参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    function OrdinaryGetPrototypeOf(O) {
        const proto = Object.getPrototypeOf(O);
        if (typeof O !== 'function' || O === functionPrototype) { return proto; }

        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.

        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype) { return proto; }

        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        const prototype = O.prototype;
        const prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype) { return proto; }

        // If the constructor was not a function, then we cannot determine the heritage.
        const constructor = prototypeProto.constructor;
        if (typeof constructor !== 'function') { return proto; }

        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O) { return proto; }

        // we have a pretty good guess at the heritage.
        return constructor;
    }

    // naive Map shim
    /**
     * Executes `CreateMapPolyfill` to handle create map polyfill.
     * @zh 执行 `CreateMapPolyfill`，用于创建映射表Polyfill。
     * @returns Result of type `MapConstructor` / 类型为 `MapConstructor` 的返回值
     */
    function CreateMapPolyfill(): MapConstructor {
        const cacheSentinel = {};
        const arraySentinel = [];

        class MapIterator<K, V, R extends (K | V | [K, V])> implements IterableIterator<R> {
            /**
             * Property `_keys` (`K[]`) storing keys.
             * @zh 属性 `_keys`（类型：`K[]`），用于存储或配置键列表。
             */
            private _keys: K[];
            /**
             * Property `_values` (`V[]`) storing values.
             * @zh 属性 `_values`（类型：`V[]`），用于存储或配置值列表。
             */
            private _values: V[];
            /**
             * Property `_index` (`number`) storing index (default: `0`).
             * @zh 属性 `_index`（类型：`number`），用于存储或配置索引（默认值：`0`）。
             */
            private _index = 0;
            /**
             * Property `_selector` (`(key: K, value: V) => R`) storing selector.
             * @zh 属性 `_selector`（类型：`(key: K, value: V) => R`），用于存储或配置选择器。
             */
            private _selector: (key: K, value: V) => R;
            /**
             * Creates an instance of `MapIterator` and initializes its dependencies and internal state.
             * @zh 创建 `MapIterator` 实例，并初始化其依赖项与内部状态。
             * @param keys - Injected or initial keys (`K[]`) / 注入或传入的键列表（`K[]`）
             * @param values - Injected or initial values (`V[]`) / 注入或传入的值列表（`V[]`）
             * @param selector - Injected or initial selector (`(key: K, value: V) => R`) / 注入或传入的选择器（`(key: K, value: V) => R`）
             */
            constructor(keys: K[], values: V[], selector: (key: K, value: V) => R) {
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            /**
             * Executes `@@iterator` to handle @@iterator.
             * @zh 执行 `@@iterator`，用于@@iterator。
             */
            '@@iterator'() { return this; }
            /**
             * Executes `[iteratorSymbol]` to handle [iterator symbol].
             * @zh 执行 `[iteratorSymbol]`，用于[iteratorSymbol]。
             */
            [iteratorSymbol]() { return this; }
            /**
             * Executes `next` to handle next.
             * @zh 执行 `next`，用于下一个。
             * @returns Result of type `IteratorResult<R>` / 类型为 `IteratorResult<R>` 的返回值
             */
            next(): IteratorResult<R> {
                const index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    const result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    } else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: <never>undefined, done: true };
            }
            /**
             * Executes `throw` to handle throw.
             * @zh 执行 `throw`，用于throw。
             * @param error - error parameter (`any`) / 错误参数（`any`）
             * @returns Result of type `IteratorResult<R>` / 类型为 `IteratorResult<R>` 的返回值
             */
            throw(error): IteratorResult<R> {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            }
            /**
             * Executes `return` to handle return.
             * @zh 执行 `return`，用于return。
             * @param value - value parameter (`R`) / 值参数（`R`）
             * @returns Result of type `IteratorResult<R>` / 类型为 `IteratorResult<R>` 的返回值
             */
            return(value?: R): IteratorResult<R> {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: <never>value, done: true };
            }
        }

        return class Map<K, V> {
            private _keys: K[] = [];
            private _values: (V | undefined)[] = [];
            private _cacheKey = cacheSentinel;
            private _cacheIndex = -2;
            get size() { return this._keys.length; }
            has(key: K): boolean { return this._find(key, /*insert*/ false) >= 0; }
            get(key: K): V | undefined {
                const index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            }
            set(key: K, value: V): this {
                const index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            }
            delete(key: K): boolean {
                const index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    const size = this._keys.length;
                    for (let i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            }
            clear(): void {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            keys() { return new MapIterator(this._keys, this._values, getKey); }
            values() { return new MapIterator(this._keys, this._values, getValue); }
            entries() { return new MapIterator(this._keys, this._values, getEntry); }
            '@@iterator'() { return this.entries(); }
            [iteratorSymbol]() { return this.entries(); }
            private _find(key: K, insert?: boolean): number {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            }
        };

        function getKey<K, V>(key: K, _: V) {
            return key;
        }

        function getValue<K, V>(_: K, value: V) {
            return value;
        }

        function getEntry<K, V>(key: K, value: V) {
            return [key, value] as [K, V];
        }
    }

    // naive Set shim
    /**
     * Executes `CreateSetPolyfill` to handle create set polyfill.
     * @zh 执行 `CreateSetPolyfill`，用于创建集合Polyfill。
     * @returns Result of type `SetConstructor` / 类型为 `SetConstructor` 的返回值
     */
    function CreateSetPolyfill(): SetConstructor {
        return class Set<T> {
            private _map = new _Map();
            get size() { return this._map.size; }
            has(value: T): boolean { return this._map.has(value); }
            add(value: T): Set<T> { return this._map.set(value, value), this; }
            delete(value: T): boolean { return this._map.delete(value); }
            clear(): void { this._map.clear(); }
            keys() { return this._map.keys(); }
            values() { return this._map.values(); }
            entries() { return this._map.entries(); }
            '@@iterator'() { return this.keys(); }
            [iteratorSymbol]() { return this.keys(); }
        };
    }

    // naive WeakMap shim
    /**
     * Executes `CreateWeakMapPolyfill` to handle create weak map polyfill.
     * @zh 执行 `CreateWeakMapPolyfill`，用于创建Weak映射表Polyfill。
     * @returns Result of type `WeakMapConstructor` / 类型为 `WeakMapConstructor` 的返回值
     */
    function CreateWeakMapPolyfill(): WeakMapConstructor {
        const UUID_SIZE = 16;
        const keys = HashMap.create<boolean>();
        const rootKey = CreateUniqueKey();
        return class WeakMap<K, V> {
            private _key = CreateUniqueKey();
            has(target: K): boolean {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            }
            get(target: K): V {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            }
            set(target: K, value: V): WeakMap<K, V> {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ true);
                table[this._key] = value;
                return this;
            }
            delete(target: K): boolean {
                const table = GetOrCreateWeakMapTable<K>(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            }
            clear(): void {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            }
        };

        function CreateUniqueKey(): string {
            let key: string;
            do { key = '@@WeakMap@@' + CreateUUID(); }
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }

        function GetOrCreateWeakMapTable<K>(target: K, create: true);
        function GetOrCreateWeakMapTable<K>(target: K, create: false);
        function GetOrCreateWeakMapTable<K>(target: K, create: boolean) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create) { return undefined; }
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return (<unknown>target)[rootKey];
        }

        function FillRandomBytes(buffer: BufferLike, size: number): BufferLike {
            for (let i = 0; i < size; ++i) { buffer[i] = Math.random() * 0xff | 0; }
            return buffer;
        }

        function GenRandomBytes(size: number): BufferLike {
            if (typeof Uint8Array === 'function') {
                if (typeof crypto !== 'undefined') { return crypto.getRandomValues(new Uint8Array(size)) as Uint8Array; }
                if (typeof msCrypto !== 'undefined') { return msCrypto.getRandomValues(new Uint8Array(size)) as Uint8Array; }
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }

        function CreateUUID() {
            const data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            let result = '';
            for (let offset = 0; offset < UUID_SIZE; ++offset) {
                const byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8) { result += '-'; }
                if (byte < 16) { result += '0'; }
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }

    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    /**
     * Executes `MakeDictionary` to handle make dictionary.
     * @zh 执行 `MakeDictionary`，用于生成字典。
     * @param obj - obj parameter (`T`) / 对象参数（`T`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    function MakeDictionary<T>(obj: T): T {
        (<{ __? }><unknown>obj).__ = undefined;
        delete (<{ __? }><unknown>obj).__;
        return obj;
    }

    // patch global Reflect
    (function (__global: { Reflect? }) {
        if (typeof __global.Reflect !== 'undefined') {
            if (__global.Reflect !== Reflect) {
                for (const p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = (<unknown>Reflect)[p];
                    }
                }
            }
        } else {
            __global.Reflect = Reflect;
        }
    })(
        typeof global !== 'undefined' ? global :
            typeof self !== 'undefined' ? self :
                Function('return this;')());
}
