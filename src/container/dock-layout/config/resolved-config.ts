/**
 * @fileoverview Module `src/container/dock-layout/config/resolved-config.ts` providing resolved config definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/config/resolved-config.ts`，提供已解析配置相关的定义与实现。
 */

import { AssertError, UnreachableCaseError } from '../errors/internal-error';
import { ConfigMinifier } from '../utils/config-minifier';
import { ItemType, JsonValue, ResponsiveMode, Side, SizeUnitEnum } from '../utils/types';
import { deepExtendValue } from '../utils/utils';

/**
 * Interface `ResolvedItemConfig` defining the contract and properties for resolved item config.
 * @public
 * @zh 接口 `ResolvedItemConfig`，定义已解析条目配置的数据结构契约与属性规范。
 */
export interface ResolvedItemConfig {
    // see ItemConfig for comments
    /**
     * Property `type` (`ItemType`) storing type.
     * @zh 属性 `type`（类型：`ItemType`），用于存储或配置类型。
     */
    readonly type: ItemType;
    /**
     * Property `content` (`readonly ResolvedItemConfig[]`) storing content.
     * @zh 属性 `content`（类型：`readonly ResolvedItemConfig[]`），用于存储或配置内容。
     */
    readonly content: readonly ResolvedItemConfig[];
    /**
     * Property `size` (`number|any`) storing size.
     * @zh 属性 `size`（类型：`number|any`），用于存储或配置尺寸。
     */
    readonly size;
    /**
     * Property `sizeUnit` (`SizeUnitEnum`) storing size unit.
     * @zh 属性 `sizeUnit`（类型：`SizeUnitEnum`），用于存储或配置尺寸Unit。
     */
    readonly sizeUnit: SizeUnitEnum;
    /**
     * Property `minSize` (`number | undefined`) storing min size.
     * @zh 属性 `minSize`（类型：`number | undefined`），用于存储或配置最小值尺寸。
     */
    readonly minSize: number | undefined;
    /**
     * Property `minSizeUnit` (`SizeUnitEnum`) storing min size unit.
     * @zh 属性 `minSizeUnit`（类型：`SizeUnitEnum`），用于存储或配置最小值尺寸Unit。
     */
    readonly minSizeUnit: SizeUnitEnum;
    // id no longer specifies whether an Item is maximised.  This is now done by HeaderItemConfig.maximised
    /**
     * Property `id` (`string`) storing id.
     * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
     */
    readonly id: string;
    /**
     * Property `isClosable` (`boolean`) storing is closable.
     * @zh 属性 `isClosable`（类型：`boolean`），用于存储或配置是否为是否可关闭。
     */
    readonly isClosable: boolean;
}

/** @public */
export namespace ResolvedItemConfig {
    /**
     * Constant/variable `defaults` defining defaults in `src/container/dock-layout/config`.
     * @zh 常量/变量 `defaults`，定义 `src/container/dock-layout/config` 中的默认值集合。
     */
    export const defaults: ResolvedItemConfig = {
        type: ItemType.ground, // not really default but need something
        content: [],
        size: 1,
        sizeUnit: SizeUnitEnum.Fractional,
        minSize: undefined,
        minSizeUnit: SizeUnitEnum.Pixel,
        id: '',
        isClosable: true,
    } as const;

    /**
     * Creates a copy of the original ResolvedItemConfig using an alternative content if specified
     * @zh 执行 `createCopy`，用于创建复制。
     */
    export function createCopy(original: ResolvedItemConfig, content?: ResolvedItemConfig[]): ResolvedItemConfig {
        switch (original.type) {
            case ItemType.ground:
            case ItemType.row:
            case ItemType.column:
                return ResolvedRowOrColumnItemConfig.createCopy(original as ResolvedRowOrColumnItemConfig,
                    content as ResolvedRowOrColumnItemConfig.ChildItemConfig[]);

            case ItemType.stack:
                return ResolvedStackItemConfig.createCopy(original as ResolvedStackItemConfig, content as ResolvedComponentItemConfig[]);

            case ItemType.component:
                return ResolvedComponentItemConfig.createCopy(original as ResolvedComponentItemConfig);

            default:
                throw new UnreachableCaseError('CICC91354', original.type, 'Invalid Config Item type specified');
        }
    }

    /**
     * Executes `createDefault` to handle create default.
     * @zh 执行 `createDefault`，用于创建默认。
     * @param type - type parameter (`ItemType`) / 类型参数（`ItemType`）
     * @returns Result of type `ResolvedItemConfig` / 类型为 `ResolvedItemConfig` 的返回值
     */
    export function createDefault(type: ItemType): ResolvedItemConfig {
        switch (type) {
            case ItemType.ground:
                throw new AssertError('CICCDR91562'); // Get default root from LayoutConfig
            case ItemType.row:
            case ItemType.column:
                return ResolvedRowOrColumnItemConfig.createDefault(type);

            case ItemType.stack:
                return ResolvedStackItemConfig.createDefault();

            case ItemType.component:
                return ResolvedComponentItemConfig.createDefault();

            default:
                throw new UnreachableCaseError('CICCDD91563', type, 'Invalid Config Item type specified');
        }
    }

    /**
     * Executes `isComponentItem` to handle is component item.
     * @zh 执行 `isComponentItem`，用于是否为组件条目。
     * @param itemConfig - item config parameter (`ResolvedItemConfig`) / 条目配置参数（`ResolvedItemConfig`）
     * @returns Result of type `itemConfig is ResolvedComponentItemConfig` / 类型为 `itemConfig is ResolvedComponentItemConfig` 的返回值
     */
    export function isComponentItem(itemConfig: ResolvedItemConfig): itemConfig is ResolvedComponentItemConfig {
        return itemConfig.type === ItemType.component;
    }

    /**
     * Executes `isStackItem` to handle is stack item.
     * @zh 执行 `isStackItem`，用于是否为栈条目。
     * @param itemConfig - item config parameter (`ResolvedItemConfig`) / 条目配置参数（`ResolvedItemConfig`）
     * @returns Result of type `itemConfig is ResolvedStackItemConfig` / 类型为 `itemConfig is ResolvedStackItemConfig` 的返回值
     */
    export function isStackItem(itemConfig: ResolvedItemConfig): itemConfig is ResolvedStackItemConfig {
        return itemConfig.type === ItemType.stack;
    }

    /**
     * Executes `isGroundItem` to handle is ground item.
     * @internal
     * @zh 执行 `isGroundItem`，用于是否为Ground条目。
     */
    export function isGroundItem(itemConfig: ResolvedItemConfig): itemConfig is ResolvedGroundItemConfig {
        return itemConfig.type === ItemType.ground;
    }
}

// Stack or Component
/**
 * Interface `ResolvedHeaderedItemConfig` defining the contract and properties for resolved headered item config.
 * @public
 * @zh 接口 `ResolvedHeaderedItemConfig`，定义已解析已表头条目配置的数据结构契约与属性规范。
 */
export interface ResolvedHeaderedItemConfig extends ResolvedItemConfig {
    /**
     * Property `header` (`ResolvedHeaderedItemConfig.Header | undefined`) storing header.
     * @zh 属性 `header`（类型：`ResolvedHeaderedItemConfig.Header | undefined`），用于存储或配置表头。
     */
    header: ResolvedHeaderedItemConfig.Header | undefined; // undefined means get header settings from LayoutConfig
    /**
     * Property `maximised` (`boolean`) storing maximised.
     * @zh 属性 `maximised`（类型：`boolean`），用于存储或配置最大化。
     */
    readonly maximised: boolean;
}

/** @public */
export namespace ResolvedHeaderedItemConfig {
    /**
     * Constant/variable `defaultMaximised` defining default maximised in `src/container/dock-layout/config`.
     * @zh 常量/变量 `defaultMaximised`，定义 `src/container/dock-layout/config` 中的默认最大化。
     */
    export const defaultMaximised = false;

    /**
     * Interface `Header` defining the contract and properties for header.
     * @zh 接口 `Header`，定义表头的数据结构契约与属性规范。
     */
    export interface Header {
        // undefined means get property value from LayoutConfig
        /**
         * Property `show` (`false | Side | undefined`) storing show.
         * @zh 属性 `show`（类型：`false | Side | undefined`），用于存储或配置显示。
         */
        readonly show: false | Side | undefined;
        /**
         * Property `popout` (`false | string | undefined`) storing popout.
         * @zh 属性 `popout`（类型：`false | string | undefined`），用于存储或配置弹出窗口。
         */
        readonly popout: false | string | undefined;
        /**
         * Property `maximise` (`false | string | undefined`) storing maximise.
         * @zh 属性 `maximise`（类型：`false | string | undefined`），用于存储或配置最大化。
         */
        readonly maximise: false | string | undefined;
        /**
         * Property `close` (`string | undefined`) storing close.
         * @zh 属性 `close`（类型：`string | undefined`），用于存储或配置关闭。
         */
        readonly close: string | undefined;
        /**
         * Property `minimise` (`string | undefined`) storing minimise.
         * @zh 属性 `minimise`（类型：`string | undefined`），用于存储或配置minimise。
         */
        readonly minimise: string | undefined;
        /**
         * Property `tabDropdown` (`false | string | undefined`) storing tab dropdown.
         * @zh 属性 `tabDropdown`（类型：`false | string | undefined`），用于存储或配置选项卡下拉框。
         */
        readonly tabDropdown: false | string | undefined;
    }

    export namespace Header {
        /**
         * Executes `createCopy` to handle create copy.
         * @zh 执行 `createCopy`，用于创建复制。
         * @param original - original parameter (`Header | undefined`) / 原始参数（`Header | undefined`）
         * @param show - show parameter (`false | Side`) / 显示参数（`false | Side`）
         * @returns Result of type `Header | undefined` / 类型为 `Header | undefined` 的返回值
         */
        export function createCopy(original: Header | undefined, show?: false | Side): Header | undefined {
            if (original === undefined) {
                return undefined;
            } else {
                return {
                    show: show ?? original.show,
                    popout: original.popout,
                    close: original.close,
                    maximise: original.maximise,
                    minimise: original.minimise,
                    tabDropdown: original.tabDropdown,
                }
            }
        }
    }
}

/**
 * Interface `ResolvedStackItemConfig` defining the contract and properties for resolved stack item config.
 * @public
 * @zh 接口 `ResolvedStackItemConfig`，定义已解析栈条目配置的数据结构契约与属性规范。
 */
export interface ResolvedStackItemConfig extends ResolvedHeaderedItemConfig {
    /**
     * Property `type` (`'stack'`) storing type.
     * @zh 属性 `type`（类型：`'stack'`），用于存储或配置类型。
     */
    readonly type: 'stack';
    /**
     * Property `content` (`ResolvedComponentItemConfig[]`) storing content.
     * @zh 属性 `content`（类型：`ResolvedComponentItemConfig[]`），用于存储或配置内容。
     */
    readonly content: ResolvedComponentItemConfig[];
    /**
     * The index of the active item in the Stack.  Only undefined if the Stack is empty.
     * @zh 属性 `activeItemIndex`（类型：`number | undefined`），用于存储或配置激活条目索引。
     */
    readonly activeItemIndex: number | undefined;
}

/** @public */
export namespace ResolvedStackItemConfig {
    /**
     * Constant/variable `defaultActiveItemIndex` defining default active item index in `src/container/dock-layout/config`.
     * @zh 常量/变量 `defaultActiveItemIndex`，定义 `src/container/dock-layout/config` 中的默认激活条目索引。
     */
    export const defaultActiveItemIndex = 0;

    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param original - original parameter (`ResolvedStackItemConfig`) / 原始参数（`ResolvedStackItemConfig`）
     * @param content - content parameter (`ResolvedComponentItemConfig[]`) / 内容参数（`ResolvedComponentItemConfig[]`）
     * @returns Result of type `ResolvedStackItemConfig` / 类型为 `ResolvedStackItemConfig` 的返回值
     */
    export function createCopy(original: ResolvedStackItemConfig, content?: ResolvedComponentItemConfig[]): ResolvedStackItemConfig {
        const result: ResolvedStackItemConfig = {
            type: original.type,
            content: content !== undefined ? copyContent(content) : copyContent(original.content),
            size: original.size,
            sizeUnit: original.sizeUnit,
            minSize: original.minSize,
            minSizeUnit: original.minSizeUnit,
            id: original.id,
            maximised: original.maximised,
            isClosable: original.isClosable,
            activeItemIndex: original.activeItemIndex,
            header: ResolvedHeaderedItemConfig.Header.createCopy(original.header),
        }
        return result;
    }

    /**
     * Executes `copyContent` to handle copy content.
     * @zh 执行 `copyContent`，用于复制内容。
     * @param original - original parameter (`ResolvedComponentItemConfig[]`) / 原始参数（`ResolvedComponentItemConfig[]`）
     * @returns Result of type `ResolvedComponentItemConfig[]` / 类型为 `ResolvedComponentItemConfig[]` 的返回值
     */
    export function copyContent(original: ResolvedComponentItemConfig[]): ResolvedComponentItemConfig[] {
        const count = original.length;
        const result = new Array<ResolvedComponentItemConfig>(count);
        for (let i = 0; i < count; i++) {
            result[i] = ResolvedItemConfig.createCopy(original[i]) as ResolvedComponentItemConfig;
        }
        return result;
    }

    /**
     * Executes `createDefault` to handle create default.
     * @zh 执行 `createDefault`，用于创建默认。
     * @returns Result of type `ResolvedStackItemConfig` / 类型为 `ResolvedStackItemConfig` 的返回值
     */
    export function createDefault(): ResolvedStackItemConfig {
        const result: ResolvedStackItemConfig = {
            type: ItemType.stack,
            content: [],
            size: ResolvedItemConfig.defaults.size,
            sizeUnit: ResolvedItemConfig.defaults.sizeUnit,
            minSize: ResolvedItemConfig.defaults.minSize,
            minSizeUnit: ResolvedItemConfig.defaults.minSizeUnit,
            id: ResolvedItemConfig.defaults.id,
            maximised: ResolvedHeaderedItemConfig.defaultMaximised,
            isClosable: ResolvedItemConfig.defaults.isClosable,
            activeItemIndex: defaultActiveItemIndex,
            header: undefined,
        }
        return result;
    }
}

/**
 * Interface `ResolvedComponentItemConfig` defining the contract and properties for resolved component item config.
 * @public
 * @zh 接口 `ResolvedComponentItemConfig`，定义已解析组件条目配置的数据结构契约与属性规范。
 */
export interface ResolvedComponentItemConfig extends ResolvedHeaderedItemConfig {
    // see ComponentItemConfig for comments
    /**
     * Property `type` (`'component'`) storing type.
     * @zh 属性 `type`（类型：`'component'`），用于存储或配置类型。
     */
    readonly type: 'component';
    /**
     * Property `content` (`[]`) storing content.
     * @zh 属性 `content`（类型：`[]`），用于存储或配置内容。
     */
    readonly content: [];
    /**
     * Property `title` (`string`) storing title.
     * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
     */
    readonly title: string;
    /**
     * Property `reorderEnabled` (`boolean`) storing reorder enabled.
     * @zh 属性 `reorderEnabled`（类型：`boolean`），用于存储或配置重排已启用。
     */
    readonly reorderEnabled: boolean; // Takes precedence over LayoutConfig.reorderEnabled.
    /**
     * Property `componentType` (`any`) storing component type.
     * @zh 属性 `componentType`（类型：`any`），用于存储或配置组件类型。
     */
    readonly componentType;
    /**
     * Property `componentState` (`JsonValue`) storing component state.
     * @zh 属性 `componentState`（类型：`JsonValue`），用于存储或配置组件状态。
     */
    readonly componentState?: JsonValue;
}

/** @public */
export namespace ResolvedComponentItemConfig {
    /**
     * Constant/variable `defaultReorderEnabled` defining default reorder enabled in `src/container/dock-layout/config`.
     * @zh 常量/变量 `defaultReorderEnabled`，定义 `src/container/dock-layout/config` 中的默认重排已启用。
     */
    export const defaultReorderEnabled = true;

    /**
     * Executes `resolveComponentTypeName` to handle resolve component type name.
     * @zh 执行 `resolveComponentTypeName`，用于解析组件类型名称。
     * @param itemConfig - item config parameter (`ResolvedComponentItemConfig`) / 条目配置参数（`ResolvedComponentItemConfig`）
     * @returns Result of type `string | undefined` / 类型为 `string | undefined` 的返回值
     */
    export function resolveComponentTypeName(itemConfig: ResolvedComponentItemConfig): string | undefined {
        const componentType = itemConfig.componentType;
        if (typeof componentType === 'string') {
            return componentType;
        } else {
            return undefined;
        }
    }

    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param original - original parameter (`ResolvedComponentItemConfig`) / 原始参数（`ResolvedComponentItemConfig`）
     * @returns Result of type `ResolvedComponentItemConfig` / 类型为 `ResolvedComponentItemConfig` 的返回值
     */
    export function createCopy(original: ResolvedComponentItemConfig): ResolvedComponentItemConfig {
        const result: ResolvedComponentItemConfig = {
            type: original.type,
            content: [],
            size: original.size,
            sizeUnit: original.sizeUnit,
            minSize: original.minSize,
            minSizeUnit: original.minSizeUnit,
            id: original.id,
            maximised: original.maximised,
            isClosable: original.isClosable,
            reorderEnabled: original.reorderEnabled,
            title: original.title,
            header: ResolvedHeaderedItemConfig.Header.createCopy(original.header),
            componentType: original.componentType,
            componentState: deepExtendValue(undefined, original.componentState) as JsonValue,
        }
        return result;
    }

    /**
     * Executes `createDefault` to handle create default.
     * @zh 执行 `createDefault`，用于创建默认。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @param componentState - component state parameter (`JsonValue`) / 组件状态参数（`JsonValue`）
     * @param title - title parameter (`any`) / 标题参数（`any`）
     * @returns Result of type `ResolvedComponentItemConfig` / 类型为 `ResolvedComponentItemConfig` 的返回值
     */
    export function createDefault(componentType: JsonValue = '', componentState?: JsonValue, title = ''): ResolvedComponentItemConfig {
        const result: ResolvedComponentItemConfig = {
            type: ItemType.component,
            content: [],
            size: ResolvedItemConfig.defaults.size,
            sizeUnit: ResolvedItemConfig.defaults.sizeUnit,
            minSize: ResolvedItemConfig.defaults.minSize,
            minSizeUnit: ResolvedItemConfig.defaults.minSizeUnit,
            id: ResolvedItemConfig.defaults.id,
            maximised: ResolvedHeaderedItemConfig.defaultMaximised,
            isClosable: ResolvedItemConfig.defaults.isClosable,
            reorderEnabled: ResolvedComponentItemConfig.defaultReorderEnabled,
            title,
            header: undefined,
            componentType,
            componentState,
        }
        return result;
    }

    /**
     * Executes `copyComponentType` to handle copy component type.
     * @zh 执行 `copyComponentType`，用于复制组件类型。
     * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
     * @returns Result of type `JsonValue` / 类型为 `JsonValue` 的返回值
     */
    export function copyComponentType(componentType: JsonValue): JsonValue {
        return deepExtendValue({}, componentType) as JsonValue
    }
}

/** Base for Root or RowOrColumn ItemConfigs
 * @public

 * @zh 接口 `ResolvedRowOrColumnItemConfig`，定义已解析行Or列条目配置的数据结构契约与属性规范。
 */
export interface ResolvedRowOrColumnItemConfig extends ResolvedItemConfig {
    /**
     * Property `type` (`'row' | 'column'`) storing type.
     * @zh 属性 `type`（类型：`'row' | 'column'`），用于存储或配置类型。
     */
    readonly type: 'row' | 'column';
    /** Note that RowOrColumn ResolvedItemConfig contents, can contain ComponentItem itemConfigs.  However
     * when ContentItems are created, these ComponentItem itemConfigs will create a Stack with a child ComponentItem.

     * @zh 属性 `content`（类型：`readonly (ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | Re...`），用于存储或配置内容。
     */
    readonly content: readonly (ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComponentItemConfig)[];
}

/** @public */
export namespace ResolvedRowOrColumnItemConfig {
    /**
     * Type alias `ChildItemConfig` representing child item config (`ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComp...`).
     * @zh 类型别名 `ChildItemConfig`，表示子级条目配置（`ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComp...`）。
     */
    export type ChildItemConfig = ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComponentItemConfig;

    /**
     * Executes `isChildItemConfig` to handle is child item config.
     * @zh 执行 `isChildItemConfig`，用于是否为子级条目配置。
     * @param itemConfig - item config parameter (`ResolvedItemConfig`) / 条目配置参数（`ResolvedItemConfig`）
     * @returns Result of type `itemConfig is ChildItemConfig` / 类型为 `itemConfig is ChildItemConfig` 的返回值
     */
    export function isChildItemConfig(itemConfig: ResolvedItemConfig): itemConfig is ChildItemConfig {
        switch (itemConfig.type) {
            case ItemType.row:
            case ItemType.column:
            case ItemType.stack:
            case ItemType.component:
                return true;
            case ItemType.ground:
                return false;
            default:
                throw new UnreachableCaseError('CROCOSPCICIC13687', itemConfig.type);
        }
    }

    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param original - original parameter (`ResolvedRowOrColumnItemConfig`) / 原始参数（`ResolvedRowOrColumnItemConfig`）
     * @param content - content parameter (`ChildItemConfig[]`) / 内容参数（`ChildItemConfig[]`）
     * @returns Result of type `ResolvedRowOrColumnItemConfig` / 类型为 `ResolvedRowOrColumnItemConfig` 的返回值
     */
    export function createCopy(original: ResolvedRowOrColumnItemConfig, content?: ChildItemConfig[]): ResolvedRowOrColumnItemConfig {
        const result: ResolvedRowOrColumnItemConfig = {
            type: original.type,
            content: content !== undefined ? copyContent(content) : copyContent(original.content),
            size: original.size,
            sizeUnit: original.sizeUnit,
            minSize: original.minSize,
            minSizeUnit: original.minSizeUnit,
            id: original.id,
            isClosable: original.isClosable,
        }
        return result;
    }

    /**
     * Executes `copyContent` to handle copy content.
     * @zh 执行 `copyContent`，用于复制内容。
     * @param original - original parameter (`readonly ChildItemConfig[]`) / 原始参数（`readonly ChildItemConfig[]`）
     * @returns Result of type `ChildItemConfig[]` / 类型为 `ChildItemConfig[]` 的返回值
     */
    export function copyContent(original: readonly ChildItemConfig[]): ChildItemConfig[] {
        const count = original.length;
        const result = new Array<ChildItemConfig>(count);
        for (let i = 0; i < count; i++) {
            result[i] = ResolvedItemConfig.createCopy(original[i]) as ChildItemConfig;
        }
        return result;
    }

    /**
     * Executes `createDefault` to handle create default.
     * @zh 执行 `createDefault`，用于创建默认。
     * @param type - type parameter (`'row' | 'column'`) / 类型参数（`'row' | 'column'`）
     * @returns Result of type `ResolvedRowOrColumnItemConfig` / 类型为 `ResolvedRowOrColumnItemConfig` 的返回值
     */
    export function createDefault(type: 'row' | 'column'): ResolvedRowOrColumnItemConfig {
        const result: ResolvedRowOrColumnItemConfig = {
            type,
            content: [],
            size: ResolvedItemConfig.defaults.size,
            sizeUnit: ResolvedItemConfig.defaults.sizeUnit,
            minSize: ResolvedItemConfig.defaults.minSize,
            minSizeUnit: ResolvedItemConfig.defaults.minSizeUnit,
            id: ResolvedItemConfig.defaults.id,
            isClosable: ResolvedItemConfig.defaults.isClosable,
        }
        return result;
    }
}

/**
 * RootItemConfig is the topmost ResolvedItemConfig specified by the user.
 * Note that it does not have a corresponding contentItem.  It specifies the one and only child of the Ground ContentItem
 * Note that RootItemConfig can be an ComponentItem itemConfig.  However when the Ground ContentItem's child is created
 * a ComponentItem itemConfig will create a Stack with a child ComponentItem.
 * @public

 * @zh 类型别名 `ResolvedRootItemConfig`，表示已解析根节点条目配置（`ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComp...`）。
 */
export type ResolvedRootItemConfig = ResolvedRowOrColumnItemConfig | ResolvedStackItemConfig | ResolvedComponentItemConfig;

/** @public */
export namespace ResolvedRootItemConfig {
    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param config - config parameter (`ResolvedRootItemConfig`) / 配置参数（`ResolvedRootItemConfig`）
     * @returns Result of type `ResolvedRootItemConfig` / 类型为 `ResolvedRootItemConfig` 的返回值
     */
    export function createCopy(config: ResolvedRootItemConfig): ResolvedRootItemConfig {
        return ResolvedItemConfig.createCopy(config) as ResolvedRootItemConfig;
    }

    /**
     * Executes `isRootItemConfig` to handle is root item config.
     * @zh 执行 `isRootItemConfig`，用于是否为根节点条目配置。
     * @param itemConfig - item config parameter (`ResolvedItemConfig`) / 条目配置参数（`ResolvedItemConfig`）
     * @returns Result of type `itemConfig is ResolvedRootItemConfig` / 类型为 `itemConfig is ResolvedRootItemConfig` 的返回值
     */
    export function isRootItemConfig(itemConfig: ResolvedItemConfig): itemConfig is ResolvedRootItemConfig {
        switch (itemConfig.type) {
            case ItemType.row:
            case ItemType.column:
            case ItemType.stack:
            case ItemType.component:
                return true;
            case ItemType.ground:
                return false;
            default:
                throw new UnreachableCaseError('CROCOSPCICIC13687', itemConfig.type);
        }
    }
}

/**
 * Interface `ResolvedGroundItemConfig` defining the contract and properties for resolved ground item config.
 * @internal
 * @zh 接口 `ResolvedGroundItemConfig`，定义已解析Ground条目配置的数据结构契约与属性规范。
 */
export interface ResolvedGroundItemConfig extends ResolvedItemConfig {
    /**
     * Property `type` (`'ground'`) storing type.
     * @zh 属性 `type`（类型：`'ground'`），用于存储或配置类型。
     */
    readonly type: 'ground';
    /**
     * Property `size` (`100`) storing size.
     * @zh 属性 `size`（类型：`100`），用于存储或配置尺寸。
     */
    readonly size: 100,
    /**
     * Property `sizeUnit` (`SizeUnitEnum.Percent`) storing size unit.
     * @zh 属性 `sizeUnit`（类型：`SizeUnitEnum.Percent`），用于存储或配置尺寸Unit。
     */
    readonly sizeUnit: SizeUnitEnum.Percent,
    /**
     * Property `minSize` (`0`) storing min size.
     * @zh 属性 `minSize`（类型：`0`），用于存储或配置最小值尺寸。
     */
    readonly minSize: 0,
    /**
     * Property `minSizeUnit` (`SizeUnitEnum.Pixel`) storing min size unit.
     * @zh 属性 `minSizeUnit`（类型：`SizeUnitEnum.Pixel`），用于存储或配置最小值尺寸Unit。
     */
    readonly minSizeUnit: SizeUnitEnum.Pixel,
    /**
     * Property `id` (`''`) storing id.
     * @zh 属性 `id`（类型：`''`），用于存储或配置唯一标识。
     */
    readonly id: '',
    /**
     * Property `isClosable` (`false`) storing is closable.
     * @zh 属性 `isClosable`（类型：`false`），用于存储或配置是否为是否可关闭。
     */
    readonly isClosable: false,
    /**
     * Property `title` (`''`) storing title.
     * @zh 属性 `title`（类型：`''`），用于存储或配置标题。
     */
    readonly title: '',
    /**
     * Property `reorderEnabled` (`false`) storing reorder enabled.
     * @zh 属性 `reorderEnabled`（类型：`false`），用于存储或配置重排已启用。
     */
    readonly reorderEnabled: false,
}

/** @internal */
export namespace ResolvedGroundItemConfig {
    /**
     * Executes `create` to handle create.
     * @zh 执行 `create`，用于创建。
     * @param rootItemConfig - root item config parameter (`ResolvedRootItemConfig | undefined`) / 根节点条目配置参数（`ResolvedRootItemConfig | undefined`）
     * @returns Result of type `ResolvedGroundItemConfig` / 类型为 `ResolvedGroundItemConfig` 的返回值
     */
    export function create(rootItemConfig: ResolvedRootItemConfig | undefined):ResolvedGroundItemConfig {
        const content = rootItemConfig === undefined ? [] : [rootItemConfig];
        return {
            type: ItemType.ground,
            content,
            size: 100,
            sizeUnit: SizeUnitEnum.Percent,
            minSize: 0,
            minSizeUnit: SizeUnitEnum.Pixel,
            id: '',
            isClosable: false,
            title: '',
            reorderEnabled: false,
        }
    }
}

/**
 * Interface `ResolvedLayoutConfig` defining the contract and properties for resolved layout config.
 * @public
 * @zh 接口 `ResolvedLayoutConfig`，定义已解析布局配置的数据结构契约与属性规范。
 */
export interface ResolvedLayoutConfig {
    /**
     * Property `root` (`ResolvedRootItemConfig | undefined`) storing root.
     * @zh 属性 `root`（类型：`ResolvedRootItemConfig | undefined`），用于存储或配置根节点。
     */
    readonly root: ResolvedRootItemConfig | undefined;
    /**
     * Property `openPopouts` (`ResolvedPopoutLayoutConfig[]`) storing open popouts.
     * @zh 属性 `openPopouts`（类型：`ResolvedPopoutLayoutConfig[]`），用于存储或配置打开弹出窗口。
     */
    readonly openPopouts: ResolvedPopoutLayoutConfig[];
    /**
     * Property `dimensions` (`ResolvedLayoutConfig.Dimensions`) storing dimensions.
     * @zh 属性 `dimensions`（类型：`ResolvedLayoutConfig.Dimensions`），用于存储或配置维度列表。
     */
    readonly dimensions: ResolvedLayoutConfig.Dimensions;
    /**
     * Property `settings` (`ResolvedLayoutConfig.Settings`) storing settings.
     * @zh 属性 `settings`（类型：`ResolvedLayoutConfig.Settings`），用于存储或配置设置项。
     */
    readonly settings: ResolvedLayoutConfig.Settings;
    /**
     * Property `header` (`ResolvedLayoutConfig.Header`) storing header.
     * @zh 属性 `header`（类型：`ResolvedLayoutConfig.Header`），用于存储或配置表头。
     */
    readonly header: ResolvedLayoutConfig.Header;
    /**
     * Property `resolved` (`true`) storing resolved.
     * @zh 属性 `resolved`（类型：`true`），用于存储或配置已解析。
     */
    readonly resolved: true,
}

/** @public */
export namespace ResolvedLayoutConfig {
    /**
     * Interface `Settings` defining the contract and properties for settings.
     * @zh 接口 `Settings`，定义设置项的数据结构契约与属性规范。
     */
    export interface Settings {
        // see Config.Settings for comments
        /**
         * Property `constrainDragToContainer` (`boolean`) storing constrain drag to container.
         * @zh 属性 `constrainDragToContainer`（类型：`boolean`），用于存储或配置constrain拖拽转换为容器。
         */
        readonly constrainDragToContainer: boolean;
        /**
         * Property `reorderEnabled` (`boolean`) storing reorder enabled.
         * @zh 属性 `reorderEnabled`（类型：`boolean`），用于存储或配置重排已启用。
         */
        readonly reorderEnabled: boolean; // also in ResolvedItemConfig which takes precedence
        /**
         * Property `popoutWholeStack` (`boolean`) storing popout whole stack.
         * @zh 属性 `popoutWholeStack`（类型：`boolean`），用于存储或配置弹出窗口Whole栈。
         */
        readonly popoutWholeStack: boolean;
        /**
         * Property `blockedPopoutsThrowError` (`boolean`) storing blocked popouts throw error.
         * @zh 属性 `blockedPopoutsThrowError`（类型：`boolean`），用于存储或配置已块弹出窗口Throw错误。
         */
        readonly blockedPopoutsThrowError: boolean;
        /**
         * @deprecated Will be removed in version 3.
         * @zh 属性 `closePopoutsOnUnload`（类型：`boolean`），用于存储或配置关闭弹出窗口当Unload。
         */
        readonly closePopoutsOnUnload: boolean;
        /**
         * Property `responsiveMode` (`ResponsiveMode`) storing responsive mode.
         * @zh 属性 `responsiveMode`（类型：`ResponsiveMode`），用于存储或配置responsive模式。
         */
        readonly responsiveMode: ResponsiveMode;
        /**
         * Property `tabOverlapAllowance` (`number`) storing tab overlap allowance.
         * @zh 属性 `tabOverlapAllowance`（类型：`number`），用于存储或配置选项卡OverlapAllowance。
         */
        readonly tabOverlapAllowance: number;
        /**
         * Property `reorderOnTabMenuClick` (`boolean`) storing reorder on tab menu click.
         * @zh 属性 `reorderOnTabMenuClick`（类型：`boolean`），用于存储或配置重排当选项卡菜单点击。
         */
        readonly reorderOnTabMenuClick: boolean;
        /**
         * Property `tabControlOffset` (`number`) storing tab control offset.
         * @zh 属性 `tabControlOffset`（类型：`number`），用于存储或配置选项卡表单控件偏移量。
         */
        readonly tabControlOffset: number;
        /**
         * Property `popInOnClose` (`boolean`) storing pop in on close.
         * @zh 属性 `popInOnClose`（类型：`boolean`），用于存储或配置弹出在当关闭。
         */
        readonly popInOnClose: boolean;
    }

    export namespace Settings {
        /**
         * Constant/variable `defaults` defining defaults in `src/container/dock-layout/config`.
         * @zh 常量/变量 `defaults`，定义 `src/container/dock-layout/config` 中的默认值集合。
         */
        export const defaults: ResolvedLayoutConfig.Settings = {
            constrainDragToContainer: true,
            reorderEnabled: true,
            popoutWholeStack: false,
            blockedPopoutsThrowError: true,
            closePopoutsOnUnload: true,
            responsiveMode: ResponsiveMode.none, // was onload
            tabOverlapAllowance: 0,
            reorderOnTabMenuClick: true,
            tabControlOffset: 10,
            popInOnClose: false,
        } as const;

        /**
         * Executes `createCopy` to handle create copy.
         * @zh 执行 `createCopy`，用于创建复制。
         * @param original - original parameter (`Settings`) / 原始参数（`Settings`）
         * @returns Result of type `Settings` / 类型为 `Settings` 的返回值
         */
        export function createCopy(original: Settings): Settings {
            return {
                constrainDragToContainer: original.constrainDragToContainer,
                reorderEnabled: original.reorderEnabled,
                popoutWholeStack: original.popoutWholeStack,
                blockedPopoutsThrowError: original.blockedPopoutsThrowError,
                closePopoutsOnUnload: original.closePopoutsOnUnload,
                responsiveMode: original.responsiveMode,
                tabOverlapAllowance: original.tabOverlapAllowance,
                reorderOnTabMenuClick: original.reorderOnTabMenuClick,
                tabControlOffset: original.tabControlOffset,
                popInOnClose: original.popInOnClose,
            }
        }
    }

    /**
     * Interface `Dimensions` defining the contract and properties for dimensions.
     * @zh 接口 `Dimensions`，定义维度列表的数据结构契约与属性规范。
     */
    export interface Dimensions {
        // see LayoutConfig.Dimensions for comments
        /**
         * Property `borderWidth` (`number`) storing border width.
         * @zh 属性 `borderWidth`（类型：`number`），用于存储或配置边框宽度。
         */
        readonly borderWidth: number;
        /**
         * Property `borderGrabWidth` (`number`) storing border grab width.
         * @zh 属性 `borderGrabWidth`（类型：`number`），用于存储或配置边框Grab宽度。
         */
        readonly borderGrabWidth: number,
        /**
         * Property `defaultMinItemHeight` (`number`) storing default min item height.
         * @zh 属性 `defaultMinItemHeight`（类型：`number`），用于存储或配置默认最小值条目高度。
         */
        readonly defaultMinItemHeight: number;
        /**
         * Property `defaultMinItemHeightUnit` (`SizeUnitEnum`) storing default min item height unit.
         * @zh 属性 `defaultMinItemHeightUnit`（类型：`SizeUnitEnum`），用于存储或配置默认最小值条目高度Unit。
         */
        readonly defaultMinItemHeightUnit: SizeUnitEnum;
        /**
         * Property `defaultMinItemWidth` (`number`) storing default min item width.
         * @zh 属性 `defaultMinItemWidth`（类型：`number`），用于存储或配置默认最小值条目宽度。
         */
        readonly defaultMinItemWidth: number;
        /**
         * Property `defaultMinItemWidthUnit` (`SizeUnitEnum`) storing default min item width unit.
         * @zh 属性 `defaultMinItemWidthUnit`（类型：`SizeUnitEnum`），用于存储或配置默认最小值条目宽度Unit。
         */
        readonly defaultMinItemWidthUnit: SizeUnitEnum;
        /**
         * Property `headerHeight` (`number`) storing header height.
         * @zh 属性 `headerHeight`（类型：`number`），用于存储或配置表头高度。
         */
        readonly headerHeight: number;
        /**
         * Property `dragProxyWidth` (`number`) storing drag proxy width.
         * @zh 属性 `dragProxyWidth`（类型：`number`），用于存储或配置拖拽Proxy宽度。
         */
        readonly dragProxyWidth: number;
        /**
         * Property `dragProxyHeight` (`number`) storing drag proxy height.
         * @zh 属性 `dragProxyHeight`（类型：`number`），用于存储或配置拖拽Proxy高度。
         */
        readonly dragProxyHeight: number;
    }

    export namespace Dimensions {
        /**
         * Executes `createCopy` to handle create copy.
         * @zh 执行 `createCopy`，用于创建复制。
         * @param original - original parameter (`Dimensions`) / 原始参数（`Dimensions`）
         * @returns Result of type `Dimensions` / 类型为 `Dimensions` 的返回值
         */
        export function createCopy(original: Dimensions): Dimensions {
            return {
                borderWidth: original.borderWidth,
                borderGrabWidth: original.borderGrabWidth,
                defaultMinItemHeight: original.defaultMinItemHeight,
                defaultMinItemHeightUnit: original.defaultMinItemHeightUnit,
                defaultMinItemWidth: original.defaultMinItemWidth,
                defaultMinItemWidthUnit: original.defaultMinItemWidthUnit,
                headerHeight: original.headerHeight,
                dragProxyWidth: original.dragProxyWidth,
                dragProxyHeight: original.dragProxyHeight,
            }
        }

        /**
         * Constant/variable `defaults` defining defaults in `src/container/dock-layout/config`.
         * @zh 常量/变量 `defaults`，定义 `src/container/dock-layout/config` 中的默认值集合。
         */
        export const defaults: ResolvedLayoutConfig.Dimensions = {
            borderWidth: 5,
            borderGrabWidth: 5,
            defaultMinItemHeight: 0,
            defaultMinItemHeightUnit: SizeUnitEnum.Pixel,
            defaultMinItemWidth: 10,
            defaultMinItemWidthUnit: SizeUnitEnum.Pixel,
            headerHeight: 20,
            dragProxyWidth: 300,
            dragProxyHeight: 200
        } as const;
    }

    /**
     * Interface `Header` defining the contract and properties for header.
     * @zh 接口 `Header`，定义表头的数据结构契约与属性规范。
     */
    export interface Header {
        /**
         * Property `show` (`false | Side`) storing show.
         * @zh 属性 `show`（类型：`false | Side`），用于存储或配置显示。
         */
        readonly show: false | Side;
        /**
         * Property `popout` (`false | string`) storing popout.
         * @zh 属性 `popout`（类型：`false | string`），用于存储或配置弹出窗口。
         */
        readonly popout: false | string;
        /**
         * Property `dock` (`string`) storing dock.
         * @zh 属性 `dock`（类型：`string`），用于存储或配置停靠面板。
         */
        readonly dock: string;
        /**
         * Property `maximise` (`false | string`) storing maximise.
         * @zh 属性 `maximise`（类型：`false | string`），用于存储或配置最大化。
         */
        readonly maximise: false | string;
        /**
         * Property `minimise` (`string`) storing minimise.
         * @zh 属性 `minimise`（类型：`string`），用于存储或配置minimise。
         */
        readonly minimise: string;
        /**
         * Property `close` (`false | string`) storing close.
         * @zh 属性 `close`（类型：`false | string`），用于存储或配置关闭。
         */
        readonly close: false | string;
        /**
         * Property `tabDropdown` (`false | string`) storing tab dropdown.
         * @zh 属性 `tabDropdown`（类型：`false | string`），用于存储或配置选项卡下拉框。
         */
        readonly tabDropdown: false | string;
    }

    export namespace Header {
        /**
         * Executes `createCopy` to handle create copy.
         * @zh 执行 `createCopy`，用于创建复制。
         * @param original - original parameter (`Header`) / 原始参数（`Header`）
         * @returns Result of type `Header` / 类型为 `Header` 的返回值
         */
        export function createCopy(original: Header): Header {
            return {
                show: original.show,
                popout: original.popout,
                dock: original.dock,
                close: original.close,
                maximise: original.maximise,
                minimise: original.minimise,
                tabDropdown: original.tabDropdown,
            }
        }

        /**
         * Constant/variable `defaults` defining defaults in `src/container/dock-layout/config`.
         * @zh 常量/变量 `defaults`，定义 `src/container/dock-layout/config` 中的默认值集合。
         */
        export const defaults: ResolvedLayoutConfig.Header = {
            show: Side.top,
            popout: 'DockLayout.popout',
            dock: 'DockLayout.dock',
            maximise: 'DockLayout.maximise',
            minimise: 'DockLayout.minimise',
            close: 'DockLayout.close',
            tabDropdown: 'DockLayout.tabDropdown'
        } as const;
    }

    /**
     * Executes `isPopout` to handle is popout.
     * @zh 执行 `isPopout`，用于是否为弹出窗口。
     * @param config - config parameter (`ResolvedLayoutConfig`) / 配置参数（`ResolvedLayoutConfig`）
     * @returns Result of type `config is ResolvedPopoutLayoutConfig` / 类型为 `config is ResolvedPopoutLayoutConfig` 的返回值
     */
    export function isPopout(config: ResolvedLayoutConfig): config is ResolvedPopoutLayoutConfig {
        return 'parentId' in config;
    }

    /**
     * Executes `createDefault` to handle create default.
     * @zh 执行 `createDefault`，用于创建默认。
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    export function createDefault(): ResolvedLayoutConfig {
        const result: ResolvedLayoutConfig = {
            root: undefined,
            openPopouts: [],
            dimensions: ResolvedLayoutConfig.Dimensions.defaults,
            settings: ResolvedLayoutConfig.Settings.defaults,
            header: ResolvedLayoutConfig.Header.defaults,
            resolved: true,
        }
        return result;
    }

    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param config - config parameter (`ResolvedLayoutConfig`) / 配置参数（`ResolvedLayoutConfig`）
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    export function createCopy(config: ResolvedLayoutConfig): ResolvedLayoutConfig {
        if (isPopout(config)) {
            return ResolvedPopoutLayoutConfig.createCopy(config);
        } else {
            const result: ResolvedLayoutConfig = {
                root: config.root === undefined ? undefined : ResolvedRootItemConfig.createCopy(config.root),
                openPopouts: ResolvedLayoutConfig.copyOpenPopouts(config.openPopouts),
                settings: ResolvedLayoutConfig.Settings.createCopy(config.settings),
                dimensions: ResolvedLayoutConfig.Dimensions.createCopy(config.dimensions),
                header: ResolvedLayoutConfig.Header.createCopy(config.header),
                resolved: config.resolved,
            }
            return result;
        }
    }

    /**
     * Executes `copyOpenPopouts` to handle copy open popouts.
     * @zh 执行 `copyOpenPopouts`，用于复制打开弹出窗口。
     * @param original - original parameter (`ResolvedPopoutLayoutConfig[]`) / 原始参数（`ResolvedPopoutLayoutConfig[]`）
     * @returns Result of type `ResolvedPopoutLayoutConfig[]` / 类型为 `ResolvedPopoutLayoutConfig[]` 的返回值
     */
    export function copyOpenPopouts(original: ResolvedPopoutLayoutConfig[]): ResolvedPopoutLayoutConfig[] {
        const count = original.length;
        const result = new Array<ResolvedPopoutLayoutConfig>(count);
        for (let i = 0; i < count; i++) {
            result[i] = ResolvedPopoutLayoutConfig.createCopy(original[i]);
        }
        return result;
    }

    /**
     * Takes a DockLayout configuration object and
     * replaces its keys and values recursively with
     * one letter counterparts

     * @zh 执行 `minifyConfig`，用于minify配置。
     */
    export function minifyConfig(layoutConfig: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ConfigMinifier.translateObject(layoutConfig, true) as ResolvedLayoutConfig;
    }


    /**
     * Executes `unminifyConfig` to handle unminify config.
     * @zh 执行 `unminifyConfig`，用于unminify配置。
     * @param minifiedConfig - minified config parameter (`ResolvedLayoutConfig`) / minified配置参数（`ResolvedLayoutConfig`）
     * @returns Result of type `ResolvedLayoutConfig` / 类型为 `ResolvedLayoutConfig` 的返回值
     */
    export function unminifyConfig(minifiedConfig: ResolvedLayoutConfig): ResolvedLayoutConfig {
        return ConfigMinifier.translateObject(minifiedConfig, false) as ResolvedLayoutConfig;
    }
}

/**
 * Interface `ResolvedPopoutLayoutConfig` defining the contract and properties for resolved popout layout config.
 * @public
 * @zh 接口 `ResolvedPopoutLayoutConfig`，定义已解析弹出窗口布局配置的数据结构契约与属性规范。
 */
export interface ResolvedPopoutLayoutConfig extends ResolvedLayoutConfig {
    /**
     * Property `parentId` (`string | null`) storing parent id.
     * @zh 属性 `parentId`（类型：`string | null`），用于存储或配置父级唯一标识。
     */
    readonly parentId: string | null;
    /**
     * Property `indexInParent` (`number | null`) storing index in parent.
     * @zh 属性 `indexInParent`（类型：`number | null`），用于存储或配置索引在父级。
     */
    readonly indexInParent: number | null;
    /**
     * Property `window` (`ResolvedPopoutLayoutConfig.Window`) storing window.
     * @zh 属性 `window`（类型：`ResolvedPopoutLayoutConfig.Window`），用于存储或配置窗口。
     */
    readonly window: ResolvedPopoutLayoutConfig.Window;
}

/** @public */
export namespace ResolvedPopoutLayoutConfig {
    /**
     * Interface `Window` defining the contract and properties for window.
     * @zh 接口 `Window`，定义窗口的数据结构契约与属性规范。
     */
    export interface Window {
        /**
         * Property `width` (`number | null`) storing width.
         * @zh 属性 `width`（类型：`number | null`），用于存储或配置宽度。
         */
        readonly width: number | null,
        /**
         * Property `height` (`number | null`) storing height.
         * @zh 属性 `height`（类型：`number | null`），用于存储或配置高度。
         */
        readonly height: number | null,
        /**
         * Property `left` (`number | null`) storing left.
         * @zh 属性 `left`（类型：`number | null`），用于存储或配置左侧位置。
         */
        readonly left: number | null,
        /**
         * Property `top` (`number | null`) storing top.
         * @zh 属性 `top`（类型：`number | null`），用于存储或配置顶部位置。
         */
        readonly top: number | null,
    }

    export namespace Window {
        /**
         * Executes `createCopy` to handle create copy.
         * @zh 执行 `createCopy`，用于创建复制。
         * @param original - original parameter (`Window`) / 原始参数（`Window`）
         * @returns Result of type `Window` / 类型为 `Window` 的返回值
         */
        export function createCopy(original: Window): Window {
            return {
                width: original.width,
                height: original.height,
                left: original.left,
                top: original.top,
            }
        }

        /**
         * Constant/variable `defaults` defining defaults in `src/container/dock-layout/config`.
         * @zh 常量/变量 `defaults`，定义 `src/container/dock-layout/config` 中的默认值集合。
         */
        export const defaults: ResolvedPopoutLayoutConfig.Window = {
            width: null,
            height: null,
            left: null,
            top: null,
        } as const;
    }

    /**
     * Executes `createCopy` to handle create copy.
     * @zh 执行 `createCopy`，用于创建复制。
     * @param original - original parameter (`ResolvedPopoutLayoutConfig`) / 原始参数（`ResolvedPopoutLayoutConfig`）
     * @returns Result of type `ResolvedPopoutLayoutConfig` / 类型为 `ResolvedPopoutLayoutConfig` 的返回值
     */
    export function createCopy(original: ResolvedPopoutLayoutConfig): ResolvedPopoutLayoutConfig {
        const result: ResolvedPopoutLayoutConfig = {
            root: original.root === undefined ? undefined : ResolvedRootItemConfig.createCopy(original.root),
            openPopouts: ResolvedLayoutConfig.copyOpenPopouts(original.openPopouts),
            settings: ResolvedLayoutConfig.Settings.createCopy(original.settings),
            dimensions: ResolvedLayoutConfig.Dimensions.createCopy(original.dimensions),
            header: ResolvedLayoutConfig.Header.createCopy(original.header),
            parentId: original.parentId,
            indexInParent: original.indexInParent,
            window: ResolvedPopoutLayoutConfig.Window.createCopy(original.window),
            resolved: original.resolved,
        }
        return result;
    }
}
