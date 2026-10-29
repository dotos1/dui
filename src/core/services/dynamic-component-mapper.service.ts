/**
 * @fileoverview Module `src/core/services/dynamic-component-mapper.service.ts` providing dynamic component mapper service definitions and implementation.
 * @zh 模块文件 `src/core/services/dynamic-component-mapper.service.ts`，提供动态组件mapper服务相关的定义与实现。
 */


import { Type } from '@angular/core';

/**
 * Executes `getType` to handle get type.
 * @zh 执行 `getType`，用于获取类型。
 * @param type - type parameter (`any`) / 类型参数（`any`）
 * @returns Result of type `() => any` / 类型为 `() => any` 的返回值
 */
export function getType(type) {
    return () => type;
}

/**
 * Interface `DynamicComponentModel` defining the contract and properties for dynamic component model.
 * @zh 接口 `DynamicComponentModel`，定义动态组件模型的数据结构契约与属性规范。
 */
export interface DynamicComponentModel { type: string; }
/**
 * Type alias `DynamicComponentResolveFunction` representing dynamic component resolve function (`(model: DynamicComponentModel) => Type<{}>`).
 * @zh 类型别名 `DynamicComponentResolveFunction`，表示动态组件解析函数（`(model: DynamicComponentModel) => Type<{}>`）。
 */
export type DynamicComponentResolveFunction = (model: DynamicComponentModel) => Type<{}>;

// @dynamic
/**
 * Class `DynamicComponentResolver` encapsulating dynamic component resolver data structures and logic in `src/core/services`.
 * @zh 类 `DynamicComponentResolver`，封装 `src/core/services` 中的动态组件解析器数据结构与处理逻辑。
 */
export class DynamicComponentResolver {
    /**
     * Executes `fromType` to handle from type.
     * @zh 执行 `fromType`，用于从类型。
     * @param type - type parameter (`Type<{}>`) / 类型参数（`Type<{}>`）
     * @returns Result of type `DynamicComponentResolveFunction` / 类型为 `DynamicComponentResolveFunction` 的返回值
     */
    static fromType(type: Type<{}>): DynamicComponentResolveFunction {
        return getType(type);
    }
}


// @dynamic
/**
 * Class `DynamicComponentMapper` encapsulating dynamic component mapper data structures and logic in `src/core/services`.
 * @zh 类 `DynamicComponentMapper`，封装 `src/core/services` 中的动态组件Mapper数据结构与处理逻辑。
 */
export abstract class DynamicComponentMapper {

    /**
     * Property `defaultValue` (`Type<{}>`) storing default value (default: `undefined`).
     * @zh 属性 `defaultValue`（类型：`Type<{}>`），用于存储或配置默认值（默认值：`undefined`）。
     */
    protected defaultValue: Type<{}> = undefined;
    /**
     * Property `types` (`{ [key: string]: DynamicComponentResolveFunction; }`) storing types (default: `{}`).
     * @zh 属性 `types`（类型：`{ [key: string]: DynamicComponentResolveFunction; }`），用于存储或配置类型列表（默认值：`{}`）。
     */
    protected types: { [key: string]: DynamicComponentResolveFunction } = {};

    /**
     * Gets the currently active DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want
     * @param defaultValue Default type returned for types that are not yet mapped
     * @returns Resolver function

     * @zh 执行 `getComponentTypeResolver`，用于获取组件类型解析器。
     */
    getComponentTypeResolver(type: string, defaultValue: Type<{}> = this.defaultValue): DynamicComponentResolveFunction {
        if (type) {
            return this.types[type] || DynamicComponentResolver.fromType(defaultValue);
        }
        return DynamicComponentResolver.fromType(defaultValue);
    }

    /**
     * Sets or optionally replaces a DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want to set
     * @param resolver The new resolver function
     * @param override The new resolver will only replace an existing one if this parameter is true

     * @zh 执行 `setComponentTypeResolver`，用于集合组件类型解析器。
     */
    setComponentTypeResolver(type: string, resolver: DynamicComponentResolveFunction, override: boolean = true) {
        if (!type) {
            throw new Error(`type is null or not defined`);
        }

        if (!resolver) {
            throw new Error(`resolver is null or not defined`);
        }

        const existing = this.types[type];
        if (existing && !override) {
            throw new Error(`already mapped, use override option if you intend replacing existing mapping.`);
        }

        this.types[type] = resolver;
    }

    /**
     * Finds the component type that is needed to render a form field.
     * @param model Form field model for the field to render
     * @param defaultValue Default type returned for field types that are not yet mapped.
     * @returns Component type

     * @zh 执行 `resolveComponentType`，用于解析组件类型。
     */
    resolveComponentType(model: DynamicComponentModel, defaultValue: Type<{}> = this.defaultValue): Type<{}> {
        if (model) {
            const resolver = this.getComponentTypeResolver(model.type, defaultValue);
            return resolver(model);
        }
        return defaultValue;
    }
}
