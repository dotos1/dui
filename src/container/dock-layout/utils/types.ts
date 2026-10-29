/**
 * @fileoverview Module `src/container/dock-layout/utils/types.ts` providing types definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/types.ts`，提供类型列表相关的定义与实现。
 */

import { UnreachableCaseError } from '../errors/internal-error';
import { StyleConstants } from './style-constants';

/**
 * Type alias `WidthOrHeightPropertyName` representing width or height property name (`'width' | 'height'`).
 * @internal
 * @zh 类型别名 `WidthOrHeightPropertyName`，表示宽度Or高度属性名称（`'width' | 'height'`）。
 */
export type WidthOrHeightPropertyName = 'width' | 'height';

/** @internal */
export namespace WidthOrHeightPropertyName {
    /**
     * Constant/variable `width` defining width in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `width`，定义 `src/container/dock-layout/utils` 中的宽度。
     */
    export const width = 'width';
    /**
     * Constant/variable `height` defining height in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `height`，定义 `src/container/dock-layout/utils` 中的高度。
     */
    export const height = 'height';
}

/**
 * Interface `WidthAndHeight` defining the contract and properties for width and height.
 * @internal
 * @zh 接口 `WidthAndHeight`，定义宽度And高度的数据结构契约与属性规范。
 */
export interface WidthAndHeight {
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width: number;
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height: number;
}

/**
 * Interface `LeftAndTop` defining the contract and properties for left and top.
 * @internal
 * @zh 接口 `LeftAndTop`，定义左侧位置And顶部位置的数据结构契约与属性规范。
 */
export interface LeftAndTop {
    /**
     * Property `left` (`number`) storing left.
     * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
     */
    left: number;
    /**
     * Property `top` (`number`) storing top.
     * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
     */
    top: number;
}

/**
 * Type alias `Side` representing side (`'top' | 'left' | 'right' | 'bottom'`).
 * @public
 * @zh 类型别名 `Side`，表示Side（`'top' | 'left' | 'right' | 'bottom'`）。
 */
export type Side = 'top' | 'left' | 'right' | 'bottom';
/** @public */
export namespace Side {
    /**
     * Constant/variable `top` defining top in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `top`，定义 `src/container/dock-layout/utils` 中的顶部位置。
     */
    export const top = 'top';
    /**
     * Constant/variable `left` defining left in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `left`，定义 `src/container/dock-layout/utils` 中的左侧位置。
     */
    export const left = 'left';
    /**
     * Constant/variable `right` defining right in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `right`，定义 `src/container/dock-layout/utils` 中的右侧位置。
     */
    export const right = 'right';
    /**
     * Constant/variable `bottom` defining bottom in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `bottom`，定义 `src/container/dock-layout/utils` 中的底部位置。
     */
    export const bottom = 'bottom';
}

/**
 * Type alias `LogicalZIndex` representing logical z index (`'base' | 'drag' | 'stackMaximised'`).
 * @public
 * @zh 类型别名 `LogicalZIndex`，表示LogicalZ坐标索引（`'base' | 'drag' | 'stackMaximised'`）。
 */
export type LogicalZIndex = 'base' | 'drag' | 'stackMaximised';
/** @public */
export namespace LogicalZIndex {
    /**
     * Constant/variable `base` defining base in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `base`，定义 `src/container/dock-layout/utils` 中的基础。
     */
    export const base = 'base';
    /**
     * Constant/variable `drag` defining drag in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `drag`，定义 `src/container/dock-layout/utils` 中的拖拽。
     */
    export const drag = 'drag';
    /**
     * Constant/variable `stackMaximised` defining stack maximised in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `stackMaximised`，定义 `src/container/dock-layout/utils` 中的栈最大化。
     */
    export const stackMaximised = 'stackMaximised';
}

/**
 * Constant/variable `LogicalZIndexToDefaultMap` defining logical z index to default map in `src/container/dock-layout/utils`.
 * @public
 * @zh 常量/变量 `LogicalZIndexToDefaultMap`，定义 `src/container/dock-layout/utils` 中的LogicalZ坐标索引转换为默认映射表。
 */
export const LogicalZIndexToDefaultMap = {
    base: StyleConstants.defaultComponentBaseZIndex,
    drag: StyleConstants.defaultComponentDragZIndex,
    stackMaximised: StyleConstants.defaultComponentStackMaximisedZIndex,
}

/**
 * Interface `Rect` defining the contract and properties for rect.
 * @internal
 * @zh 接口 `Rect`，定义矩形的数据结构契约与属性规范。
 */
export interface Rect {
    /**
     * Property `left` (`number`) storing left.
     * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
     */
    left: number,
    /**
     * Property `top` (`number`) storing top.
     * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
     */
    top: number,
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width: number,
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height: number,
}

/**
 * Interface `AreaLinkedRect` defining the contract and properties for area linked rect.
 * @internal
 * @zh 接口 `AreaLinkedRect`，定义区域已链接矩形的数据结构契约与属性规范。
 */
export interface AreaLinkedRect {
    /**
     * Property `x1` (`number`) storing x1.
     * @zh 属性 `x1`（类型：`number`），用于存储或配置x1。
     */
    x1: number, // left
    /**
     * Property `x2` (`number`) storing x2.
     * @zh 属性 `x2`（类型：`number`），用于存储或配置x2。
     */
    x2: number, // nextLeft
    /**
     * Property `y1` (`number`) storing y1.
     * @zh 属性 `y1`（类型：`number`），用于存储或配置y1。
     */
    y1: number, // top
    /**
     * Property `y2` (`number`) storing y2.
     * @zh 属性 `y2`（类型：`number`），用于存储或配置y2。
     */
    y2: number, // nextTop
}

/**
 * Type alias `JsonValue` representing json value (`string | number | boolean | null | Json | object | JsonValueArray`).
 * @public
 * @zh 类型别名 `JsonValue`，表示JSON值（`string | number | boolean | null | Json | object | JsonValueArray`）。
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type JsonValue = string | number | boolean | null | Json | object | JsonValueArray;
/**
 * Interface `Json` defining the contract and properties for json.
 * @public
 * @zh 接口 `Json`，定义JSON的数据结构契约与属性规范。
 */
export interface Json {
    [name: string]: JsonValue;
}
/**
 * Type alias `JsonValueArray` representing json value array (`Array<JsonValue>`).
 * @public
 * @zh 类型别名 `JsonValueArray`，表示JSON值数组（`Array<JsonValue>`）。
 */
export type JsonValueArray = Array<JsonValue>
/** @public */
export namespace JsonValue {
    /**
     * Executes `isJson` to handle is json.
     * @zh 执行 `isJson`，用于是否为JSON。
     * @param value - value parameter (`JsonValue`) / 值参数（`JsonValue`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    export function isJson(value: JsonValue): value is Json {
        return isJsonObject(value);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    /**
     * Executes `isJsonObject` to handle is json object.
     * @zh 执行 `isJsonObject`，用于是否为JSON对象。
     * @param value - value parameter (`JsonValue`) / 值参数（`JsonValue`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    export function isJsonObject(value: JsonValue): value is Json | object {
        return !Array.isArray(value) && value !== null && typeof value === 'object';
    }
}

/**
 * Type alias `ItemType` representing item type (`'ground' | 'row' | 'column' | 'stack' | 'component'`).
 * @public
 * @zh 类型别名 `ItemType`，表示条目类型（`'ground' | 'row' | 'column' | 'stack' | 'component'`）。
 */
export type ItemType = 'ground' | 'row' | 'column' | 'stack' | 'component';

/** @public */
export namespace ItemType {
    /**
     * Constant/variable `ground` defining ground in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `ground`，定义 `src/container/dock-layout/utils` 中的ground。
     */
    export const ground = 'ground';
    /**
     * Constant/variable `row` defining row in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `row`，定义 `src/container/dock-layout/utils` 中的行。
     */
    export const row = 'row';
    /**
     * Constant/variable `column` defining column in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `column`，定义 `src/container/dock-layout/utils` 中的列。
     */
    export const column = 'column';
    /**
     * Constant/variable `stack` defining stack in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `stack`，定义 `src/container/dock-layout/utils` 中的栈。
     */
    export const stack = 'stack';
    /**
     * Constant/variable `component` defining component in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `component`，定义 `src/container/dock-layout/utils` 中的组件。
     */
    export const component = 'component';
}

/**
 * Type alias `ResponsiveMode` representing responsive mode (`'none' | 'always' | 'onload'`).
 * @public
 * @zh 类型别名 `ResponsiveMode`，表示Responsive模式（`'none' | 'always' | 'onload'`）。
 */
export type ResponsiveMode = 'none' | 'always' | 'onload';
/** @public */
export namespace ResponsiveMode {
    /**
     * Constant/variable `none` defining none in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `none`，定义 `src/container/dock-layout/utils` 中的无。
     */
    export const none = 'none';
    /**
     * Constant/variable `always` defining always in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `always`，定义 `src/container/dock-layout/utils` 中的always。
     */
    export const always = 'always';
    /**
     * Constant/variable `onload` defining onload in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `onload`，定义 `src/container/dock-layout/utils` 中的onload。
     */
    export const onload = 'onload';
}

/**
 * Length units which can specify the size of a Component Item
 * @public

 * @zh 类型别名 `SizeUnit`，表示尺寸Unit（`'px' | '%' | 'fr' | 'em'`）。
 */
export type SizeUnit = 'px' | '%' | 'fr' | 'em';

/**
 * Enumeration `SizeUnitEnum` defining supported size unit enum constants.
 * @public
 * @zh 枚举 `SizeUnitEnum`，定义支持的尺寸UnitEnum常量集合。
 */
export enum SizeUnitEnum {
    /**
     * Enum member `SizeUnitEnum.Pixel` = 'px' representing pixel.
     * @zh 枚举项 `SizeUnitEnum.Pixel` = 'px'，表示像素。
     */
    Pixel = 'px',
    /**
     * Enum member `SizeUnitEnum.Percent` = '%' representing percent.
     * @zh 枚举项 `SizeUnitEnum.Percent` = '%'，表示百分比。
     */
    Percent = '%',
    /**
     * Enum member `SizeUnitEnum.Fractional` = 'fr' representing fractional.
     * @zh 枚举项 `SizeUnitEnum.Fractional` = 'fr'，表示Fractional。
     */
    Fractional = 'fr',
    /**
     * Enum member `SizeUnitEnum.Em` = 'em' representing em.
     * @zh 枚举项 `SizeUnitEnum.Em` = 'em'，表示Em。
     */
    Em = 'em',
}

/** @public */
export namespace SizeUnitEnum {
    /**
     * Executes `tryParse` to handle try parse.
     * @zh 执行 `tryParse`，用于尝试解析。
     * @param value - value parameter (`string`) / 值参数（`string`）
     */
    export function tryParse(value: string) {
        switch (value) {
            case SizeUnitEnum.Pixel: return SizeUnitEnum.Pixel;
            case SizeUnitEnum.Percent: return SizeUnitEnum.Percent;
            case SizeUnitEnum.Fractional: return SizeUnitEnum.Fractional;
            case SizeUnitEnum.Em: return SizeUnitEnum.Em;
            default: return undefined;
        }
    }

    /**
     * Executes `format` to handle format.
     * @zh 执行 `format`，用于格式化。
     * @param value - value parameter (`SizeUnitEnum`) / 值参数（`SizeUnitEnum`）
     */
    export function format(value: SizeUnitEnum) {
        switch (value) {
            case SizeUnitEnum.Pixel: return SizeUnitEnum.Pixel;
            case SizeUnitEnum.Percent: return SizeUnitEnum.Percent;
            case SizeUnitEnum.Fractional: return SizeUnitEnum.Fractional;
            case SizeUnitEnum.Em: return SizeUnitEnum.Em;
            default:
                throw new UnreachableCaseError('SUEF44998', value);
        }
    }
}
