/**
 * @fileoverview Module `src/container/dock-layout/config/config.ts` providing config definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/config/config.ts`，提供配置相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { ConfigurationError } from '../errors/external-error';
import {
  AssertError,
  UnexpectedUndefinedError,
  UnreachableCaseError,
} from '../errors/internal-error';

import {
  ItemType,
  JsonValue,
  ResponsiveMode,
  Side,
  SizeUnitEnum,
} from '../utils/types';
import {
  deepExtendValue,
  splitStringAtFirstNonNumericChar,
} from '../utils/utils';
import {
  ResolvedComponentItemConfig,
  ResolvedHeaderedItemConfig,
  ResolvedItemConfig,
  ResolvedLayoutConfig,
  ResolvedPopoutLayoutConfig,
  ResolvedRootItemConfig,
  ResolvedRowOrColumnItemConfig,
  ResolvedStackItemConfig,
} from './resolved-config';

/**
 * Interface `ItemConfig` defining the contract and properties for item config.
 * @public
 * @zh 接口 `ItemConfig`，定义条目配置的数据结构契约与属性规范。
 */
export interface ItemConfig {

  /**
   * Property `type` (`ItemType`) storing type.
   * @zh 属性 `type`（类型：`ItemType`），用于存储或配置类型。
   */
  type: ItemType;


  /**
   * Property `content` (`ItemConfig[]`) storing content.
   * @zh 属性 `content`（类型：`ItemConfig[]`），用于存储或配置内容。
   */
  content?: ItemConfig[];


  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width?: number;

  /**
   * The minimum width of this item in pixels
   * CAUTION - Not tested - do not use
   * @deprecated use {@link (ItemConfig:interface).minSize} instead

   * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
   */
  minWidth?: number;

  /**
   * The height of this item, relative to the other children of its parent in percent
   * @deprecated use {@link (ItemConfig:interface).size} instead

   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height?: number;

  /**
   * The minimum height of this item in pixels
   * CAUTION - Not tested - do not use
   * @deprecated use {@link (ItemConfig:interface).minSize} instead

   * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
   */
  minHeight?: number;

  /**
   * The size of this item.
   * For rows, it specifies height. For columns, it specifies width.
   * Has format \<number\>\<{@link SizeUnit}\>. Currently only supports units `fr` and `%`.
   *
   * Space is first proportionally allocated to items with sizeUnit `%`.
   * If there is any space left over (less than 100% allocated), then the
   * remainder is allocated to the items with unit `fr` according to the fractional size.
   * If more than 100% is allocated, then an extra 50% is allocated to items with unit `fr` and
   * is allocated to each item according to its fractional size. All item sizes are then adjusted
   * to bring the total back to 100%

   * @zh 属性 `size`（类型：`string`），用于存储或配置尺寸。
   */
  size?: string;

  /**
   * The size of this item.
   * For rows, it specifies height. For columns, it specifies width.
   * Has format <number><sizeUnit>. Currently only supports units `px`

   * @zh 属性 `minSize`（类型：`string`），用于存储或配置最小值尺寸。
   */
  minSize?: string;

  /**
   * A string that can be used to identify a ContentItem.
   * Do NOT assign an array.  This only exists for legacy purposes.  If an array is assigned, the first element
   * will become the id.

   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id?: string;

  /**
   * Determines if the item is closable. If false, the x on the items tab will be hidden and container.close()
   * will return false
   * Default: true

   * @zh 属性 `isClosable`（类型：`boolean`），用于存储或配置是否为是否可关闭。
   */
  isClosable?: boolean;

  /**
   * The title of the item as displayed on its tab and on popout windows
   * Default: componentType.toString() or ''
   * @deprecated only Component has a title

   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;
}

/** @public */
export namespace ItemConfig {
  /**
   * Enumeration `SizeWidthHeightSpecificationType` defining supported size width height specification type constants.
   * @internal
   * @zh 枚举 `SizeWidthHeightSpecificationType`，定义支持的尺寸宽度高度Specification类型常量集合。
   */
  export const enum SizeWidthHeightSpecificationType {
    /**
     * Enum member `SizeWidthHeightSpecificationType.None` representing none.
     * @zh 枚举项 `SizeWidthHeightSpecificationType.None`，表示无。
     */
    None,
    /**
     * Enum member `SizeWidthHeightSpecificationType.Size` representing size.
     * @zh 枚举项 `SizeWidthHeightSpecificationType.Size`，表示尺寸。
     */
    Size,
    /**
     * Enum member `SizeWidthHeightSpecificationType.WidthOrHeight` representing width or height.
     * @zh 枚举项 `SizeWidthHeightSpecificationType.WidthOrHeight`，表示宽度Or高度。
     */
    WidthOrHeight,
  }

  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    itemConfig: ItemConfig,
    rowAndColumnChildLegacySizeDefault: boolean
  ): ResolvedItemConfig {
    switch (itemConfig.type) {
      case ItemType.ground:
        throw new ConfigurationError(
          'ItemConfig cannot specify type ground',
          JSON.stringify(itemConfig)
        );
      case ItemType.row:
      case ItemType.column:
        return RowOrColumnItemConfig.resolve(
          translator,
          itemConfig as RowOrColumnItemConfig,
          rowAndColumnChildLegacySizeDefault
        );

      case ItemType.stack:
        return StackItemConfig.resolve(
          translator,
          itemConfig as StackItemConfig,
          rowAndColumnChildLegacySizeDefault
        );

      case ItemType.component:
        return ComponentItemConfig.resolve(
          translator,
          itemConfig as ComponentItemConfig,
          rowAndColumnChildLegacySizeDefault
        );

      default:
        throw new UnreachableCaseError('UCUICR55499', itemConfig.type);
    }
  }

  /**
   * Executes `resolveContent` to handle resolve content.
   * @internal
   * @zh 执行 `resolveContent`，用于解析内容。
   */
  export function resolveContent(
    translator:TranslateService,
    content: ItemConfig[] | undefined
  ): ResolvedItemConfig[] {
    if (content === undefined) {
      return [];
    } else {
      const count = content.length;
      const result = new Array<ResolvedItemConfig>(count);
      for (let i = 0; i < count; i++) {
        result[i] = ItemConfig.resolve(translator,content[i], false);
      }
      return result;
    }
  }

  /**
   * Executes `resolveId` to handle resolve id.
   * @internal
   * @zh 执行 `resolveId`，用于解析唯一标识。
   */
  export function resolveId(id: string | string[] | undefined): string {
    if (id === undefined) {
      return ResolvedItemConfig.defaults.id;
    } else {
      if (Array.isArray(id)) {
        if (id.length === 0) {
          return ResolvedItemConfig.defaults.id;
        } else {
          return id[0];
        }
      } else {
        return id;
      }
    }
  }

  /**
   * Executes `resolveSize` to handle resolve size.
   * @internal
   * @zh 执行 `resolveSize`，用于解析尺寸。
   */
  export function resolveSize(
    translator:TranslateService,
    size: string | undefined,
    width: number | undefined,
    height: number | undefined,
    rowAndColumnChildLegacySizeDefault: boolean,
    sizeUnit:string
  ): SizeWithUnit {
    // Remove support for rowAndColumnChildLegacySizeDefault in a major version release

    if (size !== undefined) {
      if(sizeUnit){
        return parseSize(translator,size, [SizeUnitEnum.Percent, SizeUnitEnum.Fractional],sizeUnit);
      }else{
        return parseSize(translator,size, [SizeUnitEnum.Percent, SizeUnitEnum.Fractional]);
      }
    } else {
      if (width !== undefined || height !== undefined) {
        if (width !== undefined) {
          return { size: width, sizeUnit: SizeUnitEnum.Percent };
        } else {
          if (height !== undefined) {
            return { size: height, sizeUnit: SizeUnitEnum.Percent };
          } else {
            throw new UnexpectedUndefinedError('CRS33390');
          }
        }
      } else {
        if (rowAndColumnChildLegacySizeDefault) {
          return { size: 50, sizeUnit: SizeUnitEnum.Percent };
        } else {
          return {
            size: ResolvedItemConfig.defaults.size,
            sizeUnit: ResolvedItemConfig.defaults.sizeUnit,
          };
        }
      }
    }
  }

  /**
   * Executes `resolveMinSize` to handle resolve min size.
   * @internal
   * @zh 执行 `resolveMinSize`，用于解析最小值尺寸。
   */
  export function resolveMinSize(
    translator:TranslateService,
    minSize: string | undefined,
    minWidth: number | undefined,
    minHeight: number | undefined,
    sizeUnit?:string
  ): UndefinableSizeWithUnit {
    if (minSize !== undefined) {
      if(sizeUnit){
        return parseSize(translator,minSize, [SizeUnitEnum.Pixel],sizeUnit);
      }else{
        return parseSize(translator,minSize, [SizeUnitEnum.Pixel]);
      }
    } else {
      const minWidthDefined = minWidth !== undefined;
      const minHeightDefined = minHeight !== undefined;
      if (minWidthDefined || minHeightDefined) {
        if (minWidthDefined) {
          return { size: minWidth, sizeUnit: SizeUnitEnum.Pixel };
        } else {
          return { size: minHeight, sizeUnit: SizeUnitEnum.Pixel };
        }
      } else {
        return {
          size: ResolvedItemConfig.defaults.minSize,
          sizeUnit: ResolvedItemConfig.defaults.minSizeUnit,
        };
      }
    }
  }

  /**
   * Executes `calculateSizeWidthHeightSpecificationType` to handle calculate size width height specification type.
   * @internal
   * @zh 执行 `calculateSizeWidthHeightSpecificationType`，用于计算尺寸宽度高度Specification类型。
   */
  export function calculateSizeWidthHeightSpecificationType(
    config: ItemConfig
  ): SizeWidthHeightSpecificationType {
    if (config.size !== undefined) {
      return SizeWidthHeightSpecificationType.Size;
    } else {
      if (config.width !== undefined || config.height !== undefined) {
        return SizeWidthHeightSpecificationType.WidthOrHeight;
      } else {
        return SizeWidthHeightSpecificationType.None;
      }
    }
  }

  /**
   * Executes `isGround` to handle is ground.
   * @zh 执行 `isGround`，用于是否为Ground。
   * @param config - config parameter (`ItemConfig`) / 配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isGround(config: ItemConfig): config is ItemConfig {
    return config.type === ItemType.ground;
  }
  /**
   * Executes `isRow` to handle is row.
   * @zh 执行 `isRow`，用于是否为行。
   * @param config - config parameter (`ItemConfig`) / 配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isRow(config: ItemConfig): config is ItemConfig {
    return config.type === ItemType.row;
  }
  /**
   * Executes `isColumn` to handle is column.
   * @zh 执行 `isColumn`，用于是否为列。
   * @param config - config parameter (`ItemConfig`) / 配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isColumn(config: ItemConfig): config is ItemConfig {
    return config.type === ItemType.column;
  }
  /**
   * Executes `isStack` to handle is stack.
   * @zh 执行 `isStack`，用于是否为栈。
   * @param config - config parameter (`ItemConfig`) / 配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isStack(config: ItemConfig): config is ItemConfig {
    return config.type === ItemType.stack;
  }
  /**
   * Executes `isComponent` to handle is component.
   * @zh 执行 `isComponent`，用于是否为组件。
   * @param config - config parameter (`ItemConfig`) / 配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isComponent(
    config: ItemConfig
  ): config is ComponentItemConfig {
    return config.type === ItemType.component;
  }
}

// Stack or Component
/**
 * Interface `HeaderedItemConfig` defining the contract and properties for headered item config.
 * @public
 * @zh 接口 `HeaderedItemConfig`，定义已表头条目配置的数据结构契约与属性规范。
 */
export interface HeaderedItemConfig extends ItemConfig {
  /**
   * @deprecated use {@link (HeaderedItemConfig:namespace).(Header:interface).show} instead
   * @zh 属性 `hasHeaders`（类型：`boolean`），用于存储或配置是否包含请求头。
   */
  hasHeaders?: boolean;
  /**
   * Property `header` (`HeaderedItemConfig.Header`) storing header.
   * @zh 属性 `header`（类型：`HeaderedItemConfig.Header`），用于存储或配置表头。
   */
  header?: HeaderedItemConfig.Header;
  /**
   * Property `maximised` (`boolean`) storing maximised.
   * @zh 属性 `maximised`（类型：`boolean`），用于存储或配置最大化。
   */
  maximised?: boolean;
}

/** @public */
export namespace HeaderedItemConfig {
  /**
   * Constant/variable `legacyMaximisedId` defining legacy maximised id in `src/container/dock-layout/config`.
   * @zh 常量/变量 `legacyMaximisedId`，定义 `src/container/dock-layout/config` 中的legacy最大化唯一标识。
   */
  const legacyMaximisedId = '__glMaximised';

  /**
   * Interface `Header` defining the contract and properties for header.
   * @zh 接口 `Header`，定义表头的数据结构契约与属性规范。
   */
  export interface Header {
    /**
     * Property `show` (`false | Side`) storing show.
     * @zh 属性 `show`（类型：`false | Side`），用于存储或配置显示。
     */
    show?: false | Side;
    /**
     * Property `popout` (`string | false`) storing popout.
     * @zh 属性 `popout`（类型：`string | false`），用于存储或配置弹出窗口。
     */
    popout?: false | string;
    /**
     * Property `dock` (`string | false`) storing dock.
     * @zh 属性 `dock`（类型：`string | false`），用于存储或配置停靠面板。
     */
    dock?: false | string;
    /**
     * Property `maximise` (`string | false`) storing maximise.
     * @zh 属性 `maximise`（类型：`string | false`），用于存储或配置最大化。
     */
    maximise?: false | string;
    /**
     * Property `close` (`string`) storing close.
     * @zh 属性 `close`（类型：`string`），用于存储或配置关闭。
     */
    close?: string;
    /**
     * Property `minimise` (`string`) storing minimise.
     * @zh 属性 `minimise`（类型：`string`），用于存储或配置minimise。
     */
    minimise?: string;
    /**
     * Property `tabDropdown` (`string | false`) storing tab dropdown.
     * @zh 属性 `tabDropdown`（类型：`string | false`），用于存储或配置选项卡下拉框。
     */
    tabDropdown?: false | string;
  }

  export namespace Header {
    /**
     * Executes `resolve` to handle resolve.
     * @zh 执行 `resolve`，用于解析。
     * @param header - header parameter (`Header`) / 表头参数（`Header`）
     * @param hasHeaders - has headers parameter (`boolean`) / 是否包含请求头参数（`boolean`）
     * @returns Result of type `ResolvedHeaderedItemConfig.Header` / 类型为 `ResolvedHeaderedItemConfig.Header` 的返回值
     */
    export function resolve(
      header: Header | undefined,
      hasHeaders: boolean | undefined
    ): ResolvedHeaderedItemConfig.Header | undefined {
      if (header === undefined && hasHeaders === undefined) {
        return undefined;
      } else {
        const result: ResolvedHeaderedItemConfig.Header = {
          show:
            header?.show ??
            (hasHeaders === undefined
              ? undefined
              : hasHeaders
              ? ResolvedLayoutConfig.Header.defaults.show
              : false),
          popout: header?.popout,
          maximise: header?.maximise,
          close: header?.close,
          minimise: header?.minimise,
          tabDropdown: header?.tabDropdown,
        };
        return result;
      }
    }
  }

  /**
   * Executes `resolveIdAndMaximised` to handle resolve id and maximised.
   * @internal
   * @zh 执行 `resolveIdAndMaximised`，用于解析唯一标识And最大化。
   */
  export function resolveIdAndMaximised(config: HeaderedItemConfig): {
    id: string;
    maximised: boolean;
  } {
    let id: string;
    // To support legacy configs with Id saved as an array of string, assign config.id to a type which includes string array
    let legacyId: string | string[] | undefined = config.id;
    let legacyMaximised = false;
    if (legacyId === undefined) {
      id = ResolvedItemConfig.defaults.id;
    } else {
      if (Array.isArray(legacyId)) {
        const idx = legacyId.findIndex((id) => id === legacyMaximisedId);
        if (idx > 0) {
          legacyMaximised = true;
          legacyId = legacyId.splice(idx, 1);
        }
        if (legacyId.length > 0) {
          id = legacyId[0];
        } else {
          id = ResolvedItemConfig.defaults.id;
        }
      } else {
        id = legacyId;
      }
    }

    let maximised: boolean;
    if (config.maximised !== undefined) {
      maximised = config.maximised;
    } else {
      maximised = legacyMaximised;
    }

    return { id, maximised };
  }
}

/**
 * Interface `StackItemConfig` defining the contract and properties for stack item config.
 * @public
 * @zh 接口 `StackItemConfig`，定义栈条目配置的数据结构契约与属性规范。
 */
export interface StackItemConfig extends HeaderedItemConfig {
  /**
   * Property `type` (`"stack"`) storing type.
   * @zh 属性 `type`（类型：`"stack"`），用于存储或配置类型。
   */
  type: 'stack';
  /**
   * Property `content` (`ComponentItemConfig[]`) storing content.
   * @zh 属性 `content`（类型：`ComponentItemConfig[]`），用于存储或配置内容。
   */
  content: ComponentItemConfig[];
  /**
   * The index of the item in content which is to be active
   * @zh 属性 `activeItemIndex`（类型：`number`），用于存储或配置激活条目索引。
   */
  activeItemIndex?: number;
}

/** @public */
export namespace StackItemConfig {
  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    itemConfig: StackItemConfig,
    rowAndColumnChildLegacySizeDefault: boolean
  ): ResolvedStackItemConfig {
    const { id, maximised } =
      HeaderedItemConfig.resolveIdAndMaximised(itemConfig);

    const { size, sizeUnit } = ItemConfig.resolveSize(
      translator,
      itemConfig.size,
      itemConfig.width,
      itemConfig.height,
      rowAndColumnChildLegacySizeDefault,
      itemConfig['sizeUnit']?  itemConfig['sizeUnit']:undefined
    );
    const { size: minSize, sizeUnit: minSizeUnit } = ItemConfig.resolveMinSize(
      translator,
      itemConfig.minSize,
      itemConfig.minWidth,
      itemConfig.minHeight
    );

    const result: ResolvedStackItemConfig = {
      type: ItemType.stack,
      content: resolveContent(translator,itemConfig.content),
      size,
      sizeUnit,
      minSize,
      minSizeUnit,
      id,
      maximised,
      isClosable:
        itemConfig.isClosable ?? ResolvedItemConfig.defaults.isClosable,
      activeItemIndex:
        itemConfig.activeItemIndex ??
        ResolvedStackItemConfig.defaultActiveItemIndex,
      header: HeaderedItemConfig.Header.resolve(
        itemConfig.header,
        itemConfig.hasHeaders
      ),
    };
    return result;
  }

  /**
   * Executes `fromResolved` to handle from resolved.
   * @internal
   * @zh 执行 `fromResolved`，用于从已解析。
   */
  export function fromResolved(
    resolvedConfig: ResolvedStackItemConfig
  ): StackItemConfig {
    const result: StackItemConfig = {
      type: ItemType.stack,
      content: fromResolvedContent(resolvedConfig.content),
      size: formatSize(resolvedConfig.size, resolvedConfig.sizeUnit),
      minSize: formatUndefinableSize(
        resolvedConfig.minSize,
        resolvedConfig.minSizeUnit
      ),
      id: resolvedConfig.id,
      maximised: resolvedConfig.maximised,
      isClosable: resolvedConfig.isClosable,
      activeItemIndex: resolvedConfig.activeItemIndex,
      header: ResolvedHeaderedItemConfig.Header.createCopy(
        resolvedConfig.header
      ),
    };

    return result;
  }

  /**
   * Executes `resolveContent` to handle resolve content.
   * @internal
   * @zh 执行 `resolveContent`，用于解析内容。
   */
  function resolveContent(
    translator:TranslateService,
    content: ComponentItemConfig[] | undefined
  ): ResolvedComponentItemConfig[] {
    if (content === undefined) {
      return [];
    } else {
      const count = content.length;
      const result = new Array<ResolvedComponentItemConfig>(count);
      for (let i = 0; i < count; i++) {
        const childItemConfig = content[i];
        const itemConfig = ItemConfig.resolve(translator,childItemConfig, false);
        if (!ResolvedItemConfig.isComponentItem(itemConfig)) {
          throw new AssertError('UCUSICRC91114', JSON.stringify(itemConfig));
        } else {
          result[i] = itemConfig;
        }
      }
      return result;
    }
  }

  /**
   * Executes `fromResolvedContent` to handle from resolved content.
   * @internal
   * @zh 执行 `fromResolvedContent`，用于从已解析内容。
   */
  function fromResolvedContent(
    resolvedContent: ResolvedComponentItemConfig[]
  ): ComponentItemConfig[] {
    const count = resolvedContent.length;
    const result = new Array<ComponentItemConfig>(count);
    for (let i = 0; i < count; i++) {
      const resolvedContentConfig = resolvedContent[i];
      result[i] = ComponentItemConfig.fromResolved(resolvedContentConfig);
    }
    return result;
  }
}

/**
 * Interface `ComponentItemConfig` defining the contract and properties for component item config.
 * @public
 * @zh 接口 `ComponentItemConfig`，定义组件条目配置的数据结构契约与属性规范。
 */
export interface ComponentItemConfig extends HeaderedItemConfig {
  /**
   * Property `type` (`"component"`) storing type.
   * @zh 属性 `type`（类型：`"component"`），用于存储或配置类型。
   */
  type: 'component';
  /**
   * Property `content` (`[]`) storing content.
   * @zh 属性 `content`（类型：`[]`），用于存储或配置内容。
   */
  readonly content?: [];

  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;

  /**
   * Property `componentName` (`string`) storing component name.
   * @zh 属性 `componentName`（类型：`string`），用于存储或配置组件名称。
   */
  componentName?: string;

  /**
   * Property `componentType` (`JsonValue`) storing component type.
   * @zh 属性 `componentType`（类型：`JsonValue`），用于存储或配置组件类型。
   */
  componentType: JsonValue;

  /**
   * Property `componentState` (`JsonValue`) storing component state.
   * @zh 属性 `componentState`（类型：`JsonValue`），用于存储或配置组件状态。
   */
  componentState?: JsonValue;

  /**
   * Default: true

   * @zh 属性 `reorderEnabled`（类型：`boolean`），用于存储或配置重排已启用。
   */
  reorderEnabled?: boolean; // Takes precedence over LayoutConfig.reorderEnabled.
}

/** @public */
export namespace ComponentItemConfig {
  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    itemConfig: ComponentItemConfig,
    rowAndColumnChildLegacySizeDefault: boolean
  ): ResolvedComponentItemConfig {
    let componentType: JsonValue | undefined = itemConfig.componentType;
    if (componentType === undefined) {
      componentType = itemConfig.componentName;
    }
    if (componentType === undefined) {
      throw new Error('ComponentItemConfig.componentType is undefined');
    } else {
      const { id, maximised } =
        HeaderedItemConfig.resolveIdAndMaximised(itemConfig);
      let title: string;
      if (itemConfig.title === undefined || itemConfig.title === '') {
        title = ComponentItemConfig.componentTypeToTitle(componentType);
      } else {
        title = itemConfig.title;
      }
      const { size, sizeUnit } = ItemConfig.resolveSize(
        translator,
        itemConfig.size,
        itemConfig.width,
        itemConfig.height,
        rowAndColumnChildLegacySizeDefault,
        itemConfig['sizeUnit']?  itemConfig['sizeUnit']:undefined
      );
      const { size: minSize, sizeUnit: minSizeUnit } =
        ItemConfig.resolveMinSize(
          translator,
          itemConfig.minSize,
          itemConfig.minWidth,
          itemConfig.minHeight
        );
      const result: ResolvedComponentItemConfig = {
        type: itemConfig.type,
        content: [],
        size,
        sizeUnit,
        minSize,
        minSizeUnit,
        id,
        maximised,
        isClosable:
          itemConfig.isClosable ?? ResolvedItemConfig.defaults.isClosable,
        reorderEnabled:
          itemConfig.reorderEnabled ??
          ResolvedComponentItemConfig.defaultReorderEnabled,
        title,
        header: HeaderedItemConfig.Header.resolve(
          itemConfig.header,
          itemConfig.hasHeaders
        ),
        componentType,
        componentState: itemConfig.componentState ?? {},
      };
      return result;
    }
  }

  /**
   * Executes `fromResolved` to handle from resolved.
   * @internal
   * @zh 执行 `fromResolved`，用于从已解析。
   */
  export function fromResolved(
    resolvedConfig: ResolvedComponentItemConfig
  ): ComponentItemConfig {
    const result: ComponentItemConfig = {
      type: ItemType.component,
      size: formatSize(resolvedConfig.size, resolvedConfig.sizeUnit),
      minSize: formatUndefinableSize(
        resolvedConfig.minSize,
        resolvedConfig.minSizeUnit
      ),
      id: resolvedConfig.id,
      maximised: resolvedConfig.maximised,
      isClosable: resolvedConfig.isClosable,
      reorderEnabled: resolvedConfig.reorderEnabled,
      title: resolvedConfig.title,
      header: ResolvedHeaderedItemConfig.Header.createCopy(
        resolvedConfig.header
      ),
      componentType: resolvedConfig.componentType,
      componentState: deepExtendValue(
        undefined,
        resolvedConfig.componentState
      ) as JsonValue,
    };

    return result;
  }

  /**
   * Executes `componentTypeToTitle` to handle component type to title.
   * @zh 执行 `componentTypeToTitle`，用于组件类型转换为标题。
   * @param componentType - component type parameter (`JsonValue`) / 组件类型参数（`JsonValue`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  export function componentTypeToTitle(componentType: JsonValue): string {
    const componentTypeType = typeof componentType;
    switch (componentTypeType) {
      case 'string':
        return componentType as string;
      case 'number':
        return (componentType as number).toString();
      case 'boolean':
        return (componentType as boolean).toString();
      default:
        return '';
    }
  }
}

// RowOrColumn
/**
 * Interface `RowOrColumnItemConfig` defining the contract and properties for row or column item config.
 * @public
 * @zh 接口 `RowOrColumnItemConfig`，定义行Or列条目配置的数据结构契约与属性规范。
 */
export interface RowOrColumnItemConfig extends ItemConfig {
  /**
   * Property `type` (`"column" | "row"`) storing type.
   * @zh 属性 `type`（类型：`"column" | "row"`），用于存储或配置类型。
   */
  type: 'row' | 'column';
  /**
   * Property `content` (`(ComponentItemConfig | StackItemConfig | RowOrColumnItemConfig)[]`) storing content.
   * @zh 属性 `content`（类型：`(ComponentItemConfig | StackItemConfig | RowOrColumnItemConfig)[]`），用于存储或配置内容。
   */
  content: (RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig)[];
}

/** @public */
export namespace RowOrColumnItemConfig {
  /**
   * Type alias `ChildItemConfig` representing child item config (`| RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig`).
   * @zh 类型别名 `ChildItemConfig`，表示子级条目配置（`| RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig`）。
   */
  export type ChildItemConfig =
    | RowOrColumnItemConfig
    | StackItemConfig
    | ComponentItemConfig;

  /**
   * Executes `isChildItemConfig` to handle is child item config.
   * @zh 执行 `isChildItemConfig`，用于是否为子级条目配置。
   * @param itemConfig - item config parameter (`ItemConfig`) / 条目配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isChildItemConfig(
    itemConfig: ItemConfig
  ): itemConfig is ChildItemConfig {
    switch (itemConfig.type) {
      case ItemType.row:
      case ItemType.column:
      case ItemType.stack:
      case ItemType.component:
        return true;
      case ItemType.ground:
        return false;
      default:
        throw new UnreachableCaseError('UROCOSPCICIC13687', itemConfig.type);
    }
  }

  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    itemConfig: RowOrColumnItemConfig,
    rowAndColumnChildLegacySizeDefault: boolean
  ): ResolvedRowOrColumnItemConfig {
      const { size, sizeUnit } = ItemConfig.resolveSize(
        translator,
        itemConfig.size,
        itemConfig.width,
        itemConfig.height,
        rowAndColumnChildLegacySizeDefault,
        itemConfig['sizeUnit']?  itemConfig['sizeUnit']:undefined
      );
      const { size: minSize, sizeUnit: minSizeUnit } = ItemConfig.resolveMinSize(
        translator,
        itemConfig.minSize,
        itemConfig.minWidth,
        itemConfig.minHeight
      );
      const result: ResolvedRowOrColumnItemConfig = {
        type: itemConfig.type,
        content: RowOrColumnItemConfig.resolveContent(translator,itemConfig.content),
        size,
        sizeUnit,
        minSize,
        minSizeUnit,
        id: ItemConfig.resolveId(itemConfig.id),
        isClosable:
          itemConfig.isClosable ?? ResolvedItemConfig.defaults.isClosable,
      };
      return result;
  }

  /**
   * Executes `fromResolved` to handle from resolved.
   * @internal
   * @zh 执行 `fromResolved`，用于从已解析。
   */
  export function fromResolved(
    resolvedConfig: ResolvedRowOrColumnItemConfig
  ): RowOrColumnItemConfig {
    const result: RowOrColumnItemConfig = {
      type: resolvedConfig.type,
      content: fromResolvedContent(resolvedConfig.content),
      size: formatSize(resolvedConfig.size, resolvedConfig.sizeUnit),
      minSize: formatUndefinableSize(
        resolvedConfig.minSize,
        resolvedConfig.minSizeUnit
      ),
      id: resolvedConfig.id,
      isClosable: resolvedConfig.isClosable,
    };

    return result;
  }

  /**
   * Executes `resolveContent` to handle resolve content.
   * @internal
   * @zh 执行 `resolveContent`，用于解析内容。
   */
  export function resolveContent(
    translator:TranslateService,
    content: ChildItemConfig[] | undefined
  ): ResolvedRowOrColumnItemConfig.ChildItemConfig[] {
    if (content === undefined) {
      return [];
    } else {
      const count = content.length;
      const childItemConfigs = new Array<RowOrColumnItemConfig.ChildItemConfig>(
        count
      );
      let widthOrHeightSpecifiedAtLeastOnce = false;
      let sizeSpecifiedAtLeastOnce = false;
      for (let i = 0; i < count; i++) {
        const childItemConfig = content[i];
        if (!RowOrColumnItemConfig.isChildItemConfig(childItemConfig)) {
          throw new ConfigurationError(
            'ItemConfig is not Row, Column or Stack',
            childItemConfig
          );
        } else {
          if (!sizeSpecifiedAtLeastOnce) {
            const sizeWidthHeightSpecificationType =
              ItemConfig.calculateSizeWidthHeightSpecificationType(
                childItemConfig
              );
            switch (sizeWidthHeightSpecificationType) {
              case ItemConfig.SizeWidthHeightSpecificationType.None:
                break;
              case ItemConfig.SizeWidthHeightSpecificationType.WidthOrHeight:
                widthOrHeightSpecifiedAtLeastOnce = true;
                break;
              case ItemConfig.SizeWidthHeightSpecificationType.Size:
                sizeSpecifiedAtLeastOnce = true;
                break;
              default:
                throw new UnreachableCaseError(
                  'ROCICRC87556',
                  sizeWidthHeightSpecificationType
                );
            }
          }
          childItemConfigs[i] = childItemConfig;
        }
      }

      let legacySizeDefault: boolean;
      if (sizeSpecifiedAtLeastOnce) {
        legacySizeDefault = false;
      } else {
        if (widthOrHeightSpecifiedAtLeastOnce) {
          legacySizeDefault = true;
        } else {
          legacySizeDefault = false;
        }
      }

      const result = new Array<ResolvedRowOrColumnItemConfig.ChildItemConfig>(
        count
      );
      for (let i = 0; i < count; i++) {
        const childItemConfig = childItemConfigs[i];
        const resolvedChildItemConfig = ItemConfig.resolve(
          translator,
          childItemConfig,
          legacySizeDefault
        );
        if (
          !ResolvedRowOrColumnItemConfig.isChildItemConfig(
            resolvedChildItemConfig
          )
        ) {
          throw new AssertError(
            'UROCOSPIC99512',
            JSON.stringify(resolvedChildItemConfig)
          );
        } else {
          result[i] = resolvedChildItemConfig;
        }
      }
      return result;
    }
  }

  /**
   * Executes `fromResolvedContent` to handle from resolved content.
   * @internal
   * @zh 执行 `fromResolvedContent`，用于从已解析内容。
   */
  function fromResolvedContent(
    resolvedContent: readonly ResolvedRowOrColumnItemConfig.ChildItemConfig[]
  ): RowOrColumnItemConfig.ChildItemConfig[] {
    const count = resolvedContent.length;
    const result = new Array<RowOrColumnItemConfig.ChildItemConfig>(count);
    for (let i = 0; i < count; i++) {
      const resolvedContentConfig = resolvedContent[i];
      const type = resolvedContentConfig.type;
      let contentConfig: RowOrColumnItemConfig.ChildItemConfig;
      switch (type) {
        case ItemType.row:
        case ItemType.column:
          contentConfig = RowOrColumnItemConfig.fromResolved(
            resolvedContentConfig
          );
          break;
        case ItemType.stack:
          contentConfig = StackItemConfig.fromResolved(resolvedContentConfig);
          break;
        case ItemType.component:
          contentConfig = ComponentItemConfig.fromResolved(
            resolvedContentConfig
          );
          break;
        default:
          throw new UnreachableCaseError('ROCICFRC44797', type);
      }
      result[i] = contentConfig;
    }
    return result;
  }
}

/**
 * Type alias `RootItemConfig` representing root item config (`| RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig`).
 * @public
 * @zh 类型别名 `RootItemConfig`，表示根节点条目配置（`| RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig`）。
 */
export type RootItemConfig =
  | RowOrColumnItemConfig
  | StackItemConfig
  | ComponentItemConfig;

/** @public */
export namespace RootItemConfig {
  /**
   * Executes `isRootItemConfig` to handle is root item config.
   * @zh 执行 `isRootItemConfig`，用于是否为根节点条目配置。
   * @param itemConfig - item config parameter (`ItemConfig`) / 条目配置参数（`ItemConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isRootItemConfig(
    itemConfig: ItemConfig
  ): itemConfig is RootItemConfig {
    switch (itemConfig.type) {
      case ItemType.row:
      case ItemType.column:
      case ItemType.stack:
      case ItemType.component:
        return true;
      case ItemType.ground:
        return false;
      default:
        throw new UnreachableCaseError('URICIR23687', itemConfig.type);
    }
  }

  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    itemConfig: RootItemConfig | undefined
  ): ResolvedRootItemConfig | undefined {
    if (itemConfig === undefined) {
      return undefined;
    } else {
      const result = ItemConfig.resolve(translator,itemConfig, false);
      if (!ResolvedRootItemConfig.isRootItemConfig(result)) {
        throw new ConfigurationError(
          'ItemConfig is not Row, Column or Stack',
          JSON.stringify(itemConfig)
        );
      } else {
        return result;
      }
    }
  }

  /**
   * Executes `fromResolvedOrUndefined` to handle from resolved or undefined.
   * @internal
   * @zh 执行 `fromResolvedOrUndefined`，用于从已解析Or未定义。
   */
  export function fromResolvedOrUndefined(
    resolvedItemConfig: ResolvedRootItemConfig | undefined
  ): RootItemConfig | undefined {
    if (resolvedItemConfig === undefined) {
      return undefined;
    } else {
      const type = resolvedItemConfig.type;
      switch (type) {
        case ItemType.row:
        case ItemType.column:
          return RowOrColumnItemConfig.fromResolved(resolvedItemConfig);
        case ItemType.stack:
          return StackItemConfig.fromResolved(resolvedItemConfig);
        case ItemType.component:
          return ComponentItemConfig.fromResolved(resolvedItemConfig);
        default:
          throw new UnreachableCaseError('RICFROU89921', type);
      }
    }
  }
}

/**
 * Interface `LayoutConfig` defining the contract and properties for layout config.
 * @public
 * @zh 接口 `LayoutConfig`，定义布局配置的数据结构契约与属性规范。
 */
export interface LayoutConfig {
  /**
   * Property `root` (`RootItemConfig`) storing root.
   * @zh 属性 `root`（类型：`RootItemConfig`），用于存储或配置根节点。
   */
  root: RootItemConfig | undefined;
  /**
   * @deprecated Use {@link (LayoutConfig:interface).root}
   * @zh 属性 `content`（类型：`(ComponentItemConfig | StackItemConfig | RowOrColumnItemConfig)[]`），用于存储或配置内容。
   */
  content?: (RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig)[];
  /**
   * Property `openPopouts` (`PopoutLayoutConfig[]`) storing open popouts.
   * @zh 属性 `openPopouts`（类型：`PopoutLayoutConfig[]`），用于存储或配置打开弹出窗口。
   */
  openPopouts?: PopoutLayoutConfig[];
  /**
   * Property `dimensions` (`LayoutConfig.Dimensions`) storing dimensions.
   * @zh 属性 `dimensions`（类型：`LayoutConfig.Dimensions`），用于存储或配置维度列表。
   */
  dimensions?: LayoutConfig.Dimensions;
  /**
   * Property `settings` (`LayoutConfig.Settings`) storing settings.
   * @zh 属性 `settings`（类型：`LayoutConfig.Settings`），用于存储或配置设置项。
   */
  settings?: LayoutConfig.Settings;
  /**
   * @deprecated use {@link (LayoutConfig:interface).header} instead
   * @zh 属性 `labels`（类型：`LayoutConfig.Labels`），用于存储或配置标签。
   */
  labels?: LayoutConfig.Labels;
  /**
   * Property `header` (`LayoutConfig.Header`) storing header.
   * @zh 属性 `header`（类型：`LayoutConfig.Header`），用于存储或配置表头。
   */
  header?: LayoutConfig.Header;
}

/** Use to specify LayoutConfig with defaults or deserialise a LayoutConfig.
 * Deserialisation will handle backwards compatibility.
 * Note that LayoutConfig should be used for serialisation (not LayoutConfig)
 * @public
 */
export namespace LayoutConfig {
  /**
   * Interface `Settings` defining the contract and properties for settings.
   * @zh 接口 `Settings`，定义设置项的数据结构契约与属性规范。
   */
  export interface Settings {
    /**
     * @deprecated use ${@link (LayoutConfig:namespace).(Header:interface).show} instead

     * @zh 属性 `hasHeaders`（类型：`boolean`），用于存储或配置是否包含请求头。
     */
    hasHeaders?: boolean;

    /**
     * Constrains the area in which items can be dragged to the layout's container. Will be set to false
     * automatically when layout.createDragSource() is called.
     * Default: true

     * @zh 属性 `constrainDragToContainer`（类型：`boolean`），用于存储或配置constrain拖拽转换为容器。
     */
    constrainDragToContainer?: boolean;

    /**
     * If true, the user can re-arrange the layout by dragging items by their tabs to the desired location.
     * Can be overridden by ItemConfig.reorderEnabled for specific ItemConfigs
     * Default: true

     * @zh 属性 `reorderEnabled`（类型：`boolean`），用于存储或配置重排已启用。
     */
    reorderEnabled?: boolean;

    /**
     * Decides what will be opened in a new window if the user clicks the popout icon. If true the entire stack will
     * be transferred to the new window, if false only the active component will be opened.
     * Default: false

     * @zh 属性 `popoutWholeStack`（类型：`boolean`），用于存储或配置弹出窗口Whole栈。
     */
    popoutWholeStack?: boolean;

    /**
     * Specifies if an error is thrown when a popout is blocked by the browser (e.g. by opening it programmatically).
     * If false, the popout call will fail silently.
     * Default: true

     * @zh 属性 `blockedPopoutsThrowError`（类型：`boolean`），用于存储或配置已块弹出窗口Throw错误。
     */
    blockedPopoutsThrowError?: boolean;

    /**
     * Specifies if all popouts should be closed when the page that created them is closed. Popouts don't have a
     * strong dependency on their parent and can exist on their own, but can be quite annoying to close by hand. In
     * addition, any changes made to popouts won't be stored after the parent is closed.
     * Default: true
     * @deprecated Will be removed in version 3.

     * @zh 属性 `closePopoutsOnUnload`（类型：`boolean`），用于存储或配置关闭弹出窗口当Unload。
     */
    closePopoutsOnUnload?: boolean;

    /**
     * Specifies if the popout icon should be displayed in the header-bar.
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popout} instead

     * @zh 属性 `showPopoutIcon`（类型：`boolean`），用于存储或配置显示弹出窗口图标。
     */
    showPopoutIcon?: boolean;

  
    /**
     * Property `showMaximiseIcon` (`boolean`) storing show maximise icon.
     * @zh 属性 `showMaximiseIcon`（类型：`boolean`），用于存储或配置显示最大化图标。
     */
    showMaximiseIcon?: boolean;

    /**
     * Specifies if the close icon should be displayed in the header-bar.
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).close} instead

     * @zh 属性 `showCloseIcon`（类型：`boolean`），用于存储或配置显示关闭图标。
     */
    showCloseIcon?: boolean;

    /**
     * Specifies Responsive Mode (more info needed).
     * Default: none

     * @zh 属性 `responsiveMode`（类型：`ResponsiveMode`），用于存储或配置responsive模式。
     */
    responsiveMode?: ResponsiveMode;

    /**
     * Specifies Maximum pixel overlap per tab.
     * Default: 0

     * @zh 属性 `tabOverlapAllowance`（类型：`number`），用于存储或配置选项卡OverlapAllowance。
     */
    tabOverlapAllowance?: number;

    /**
     *
     * Default: true

     * @zh 属性 `reorderOnTabMenuClick`（类型：`boolean`），用于存储或配置重排当选项卡菜单点击。
     */
    reorderOnTabMenuClick?: boolean;

    /**
     * Default: 10

     * @zh 属性 `tabControlOffset`（类型：`number`），用于存储或配置选项卡表单控件偏移量。
     */
    tabControlOffset?: number;

    /**
     * Specifies whether to pop in elements when closing a popout window.
     * Default: false

     * @zh 属性 `popInOnClose`（类型：`boolean`），用于存储或配置弹出在当关闭。
     */
    popInOnClose?: boolean;
  }

  export namespace Settings {
    /**
     * Executes `resolve` to handle resolve.
     * @zh 执行 `resolve`，用于解析。
     * @param settings - settings parameter (`Settings`) / 设置项参数（`Settings`）
     * @returns Result of type `ResolvedLayoutConfig.Settings` / 类型为 `ResolvedLayoutConfig.Settings` 的返回值
     */
    export function resolve(
      settings: Settings | undefined
    ): ResolvedLayoutConfig.Settings {
      const result: ResolvedLayoutConfig.Settings = {
        constrainDragToContainer:
          settings?.constrainDragToContainer ??
          ResolvedLayoutConfig.Settings.defaults.constrainDragToContainer,
        reorderEnabled:
          settings?.reorderEnabled ??
          ResolvedLayoutConfig.Settings.defaults.reorderEnabled,
        popoutWholeStack:
          settings?.popoutWholeStack ??
          ResolvedLayoutConfig.Settings.defaults.popoutWholeStack,
        blockedPopoutsThrowError:
          settings?.blockedPopoutsThrowError ??
          ResolvedLayoutConfig.Settings.defaults.blockedPopoutsThrowError,
        closePopoutsOnUnload:
          settings?.closePopoutsOnUnload ??
          ResolvedLayoutConfig.Settings.defaults.closePopoutsOnUnload,
        responsiveMode:
          settings?.responsiveMode ??
          ResolvedLayoutConfig.Settings.defaults.responsiveMode,
        tabOverlapAllowance:
          settings?.tabOverlapAllowance ??
          ResolvedLayoutConfig.Settings.defaults.tabOverlapAllowance,
        reorderOnTabMenuClick:
          settings?.reorderOnTabMenuClick ??
          ResolvedLayoutConfig.Settings.defaults.reorderOnTabMenuClick,
        tabControlOffset:
          settings?.tabControlOffset ??
          ResolvedLayoutConfig.Settings.defaults.tabControlOffset,
        popInOnClose:
          settings?.popInOnClose ??
          ResolvedLayoutConfig.Settings.defaults.popInOnClose,
      };
      return result;
    }
  }

  /**
   * Interface `Dimensions` defining the contract and properties for dimensions.
   * @zh 接口 `Dimensions`，定义维度列表的数据结构契约与属性规范。
   */
  export interface Dimensions {
    /**
     * The width of the borders between the layout items in pixel. Please note: The actual draggable area is wider
     * than the visible one, making it safe to set this to small values without affecting usability.
     * Default: 5

     * @zh 属性 `borderWidth`（类型：`number`），用于存储或配置边框宽度。
     */
    borderWidth?: number;

    /**
     * Default: 15

     * @zh 属性 `borderGrabWidth`（类型：`number`），用于存储或配置边框Grab宽度。
     */
    borderGrabWidth?: number;

    /**
     * The minimum height an item can be resized to (in pixel).
     * @deprecated use {@link (LayoutConfig:namespace).(Dimensions:interface).defaultMinItemHeight} instead

     * @zh 属性 `minItemHeight`（类型：`number`），用于存储或配置最小值条目高度。
     */
    minItemHeight?: number;

    /**
     * The minimum height an item can be resized to.
     * Default: 0

     * @zh 属性 `defaultMinItemHeight`（类型：`string`），用于存储或配置默认最小值条目高度。
     */
    defaultMinItemHeight?: string;

    /**
     * The minimum width an item can be resized to (in pixel).
     * @deprecated use {@link (LayoutConfig:namespace).(Dimensions:interface).defaultMinItemWidth} instead

     * @zh 属性 `minItemWidth`（类型：`number`），用于存储或配置最小值条目宽度。
     */
    minItemWidth?: number;

    /**
     * The minimum width an item can be resized to.
     * Default: 10px

     * @zh 属性 `defaultMinItemWidth`（类型：`string`），用于存储或配置默认最小值条目宽度。
     */
    defaultMinItemWidth?: string;

    /**
     * The height of the header elements in pixel. This can be changed, but your theme's header css needs to be
     * adjusted accordingly.
     * Default: 20

     * @zh 属性 `headerHeight`（类型：`number`），用于存储或配置表头高度。
     */
    headerHeight?: number;

    /**
     * The width of the element that appears when an item is dragged (in pixel).
     * Default: 300

     * @zh 属性 `dragProxyWidth`（类型：`number`），用于存储或配置拖拽Proxy宽度。
     */
    dragProxyWidth?: number;

    /**
     * The height of the element that appears when an item is dragged (in pixel).
     * Default: 200

     * @zh 属性 `dragProxyHeight`（类型：`number`），用于存储或配置拖拽Proxy高度。
     */
    dragProxyHeight?: number;
  }

  export namespace Dimensions {
    /**
     * Executes `resolve` to handle resolve.
     * @internal
     * @zh 执行 `resolve`，用于解析。
     */
    export function resolve(
      translator:TranslateService,
      dimensions: Dimensions | undefined
    ): ResolvedLayoutConfig.Dimensions {
      const { size: defaultMinItemHeight, sizeUnit: defaultMinItemHeightUnit } =
        Dimensions.resolveDefaultMinItemHeight(translator,dimensions);
      const { size: defaultMinItemWidth, sizeUnit: defaultMinItemWidthUnit } =
        Dimensions.resolveDefaultMinItemWidth(translator,dimensions);
      const result: ResolvedLayoutConfig.Dimensions = {
        borderWidth:
          dimensions?.borderWidth ??
          ResolvedLayoutConfig.Dimensions.defaults.borderWidth,
        borderGrabWidth:
          dimensions?.borderGrabWidth ??
          ResolvedLayoutConfig.Dimensions.defaults.borderGrabWidth,
        defaultMinItemHeight,
        defaultMinItemHeightUnit,
        defaultMinItemWidth,
        defaultMinItemWidthUnit,
        headerHeight:
          dimensions?.headerHeight ??
          ResolvedLayoutConfig.Dimensions.defaults.headerHeight,
        dragProxyWidth:
          dimensions?.dragProxyWidth ??
          ResolvedLayoutConfig.Dimensions.defaults.dragProxyWidth,
        dragProxyHeight:
          dimensions?.dragProxyHeight ??
          ResolvedLayoutConfig.Dimensions.defaults.dragProxyHeight,
      };
      return result;
    }

    /**
     * Executes `fromResolved` to handle from resolved.
     * @internal
     * @zh 执行 `fromResolved`，用于从已解析。
     */
    export function fromResolved(
      resolvedDimensions: ResolvedLayoutConfig.Dimensions
    ): Dimensions {
      const result: Dimensions = {
        borderWidth: resolvedDimensions.borderWidth,
        borderGrabWidth: resolvedDimensions.borderGrabWidth,
        defaultMinItemHeight: formatSize(
          resolvedDimensions.defaultMinItemHeight,
          resolvedDimensions.defaultMinItemHeightUnit
        ),
        defaultMinItemWidth: formatSize(
          resolvedDimensions.defaultMinItemWidth,
          resolvedDimensions.defaultMinItemWidthUnit
        ),
        headerHeight: resolvedDimensions.headerHeight,
        dragProxyWidth: resolvedDimensions.dragProxyWidth,
        dragProxyHeight: resolvedDimensions.dragProxyHeight,
      };

      return result;
    }

    /**
     * Executes `resolveDefaultMinItemHeight` to handle resolve default min item height.
     * @internal
     * @zh 执行 `resolveDefaultMinItemHeight`，用于解析默认最小值条目高度。
     */
    export function resolveDefaultMinItemHeight(
      translator:TranslateService,
      dimensions: Dimensions | undefined
    ): SizeWithUnit {
      const height = dimensions?.defaultMinItemHeight;
      if (height === undefined) {
        return {
          size: ResolvedLayoutConfig.Dimensions.defaults.defaultMinItemHeight,
          sizeUnit:
            ResolvedLayoutConfig.Dimensions.defaults.defaultMinItemHeightUnit,
        };
      } else {
        return parseSize(translator,height, [SizeUnitEnum.Pixel],SizeUnitEnum.Pixel);
      }
    }

    /**
     * Executes `resolveDefaultMinItemWidth` to handle resolve default min item width.
     * @internal
     * @zh 执行 `resolveDefaultMinItemWidth`，用于解析默认最小值条目宽度。
     */
    export function resolveDefaultMinItemWidth(
      translator:TranslateService,
      dimensions: Dimensions | undefined
    ): SizeWithUnit {
      const width = dimensions?.defaultMinItemWidth;
      if (width === undefined) {
        return {
          size: ResolvedLayoutConfig.Dimensions.defaults.defaultMinItemWidth,
          sizeUnit:
            ResolvedLayoutConfig.Dimensions.defaults.defaultMinItemWidthUnit,
        };
      } else {
        return parseSize(translator,width, [SizeUnitEnum.Pixel],SizeUnitEnum.Pixel);
      }
    }
  }

  /**
   * Interface `Labels` defining the contract and properties for labels.
   * @zh 接口 `Labels`，定义标签的数据结构契约与属性规范。
   */
  export interface Labels {
    /**
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).close} instead

     * @zh 属性 `close`（类型：`string`），用于存储或配置关闭。
     */
    close?: string;


    /**
     * Property `maximise` (`string`) storing maximise.
     * @zh 属性 `maximise`（类型：`string`），用于存储或配置最大化。
     */
    maximise?: string;

    /**
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).minimise} instead

     * @zh 属性 `minimise`（类型：`string`），用于存储或配置minimise。
     */
    minimise?: string;

    /**
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popin} instead

     * @zh 属性 `popin`（类型：`string`），用于存储或配置popin。
     */
    popin?: string;

    /**
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).popout} instead

     * @zh 属性 `popout`（类型：`string`），用于存储或配置弹出窗口。
     */
    popout?: string;

    /**
     * @deprecated use {@link (LayoutConfig:namespace).(Header:interface).tabDropdown} instead

     * @zh 属性 `tabDropdown`（类型：`string`），用于存储或配置选项卡下拉框。
     */
    tabDropdown?: string;
  }

  /**
   * Interface `Header` defining the contract and properties for header.
   * @zh 接口 `Header`，定义表头的数据结构契约与属性规范。
   */
  export interface Header {
    /**
     * Specifies whether header should be displayed, and if so, on which side.
     * If false, the layout will be displayed with splitters only.
     * Default: 'top'

     * @zh 属性 `show`（类型：`false | Side`），用于存储或配置显示。
     */
    show?: false | Side;
    /**
     * The tooltip text that appears when hovering over the popout icon or false if popout button not displayed.
     * Default: 'open in new window'

     * @zh 属性 `popout`（类型：`string | false`），用于存储或配置弹出窗口。
     */
    popout?: false | string;
    /**
     * The tooltip text that appears when hovering over the popin icon.
     * Default: 'pop in'

     * @zh 属性 `popin`（类型：`string`），用于存储或配置popin。
     */
    popin?: string;

    /**
     * Property `maximise` (`string | false`) storing maximise.
     * @zh 属性 `maximise`（类型：`string | false`），用于存储或配置最大化。
     */
    maximise?: false | string;
    /**
     * The tooltip text that appears when hovering over the close icon.
     * Default: 'close'

     * @zh 属性 `close`（类型：`string | false`），用于存储或配置关闭。
     */
    close?: false | string;
    /**
     * The tooltip text that appears when hovering over the minimise icon.
     * Default: 'minimise'

     * @zh 属性 `minimise`（类型：`string`），用于存储或配置minimise。
     */
    minimise?: string;
    /**
     *
     * Default: 'additional tabs'

     * @zh 属性 `tabDropdown`（类型：`string | false`），用于存储或配置选项卡下拉框。
     */
    tabDropdown?: false | string;
  }

  export namespace Header {
    /**
     * Executes `resolve` to handle resolve.
     * @internal
     * @zh 执行 `resolve`，用于解析。
     */
    export function resolve(
      header: Header | undefined,
      settings: LayoutConfig.Settings | undefined,
      labels: LayoutConfig.Labels | undefined
    ): ResolvedLayoutConfig.Header {
      let show: false | Side;
      if (header?.show !== undefined) {
        show = header.show;
      } else {
        if (settings !== undefined && settings.hasHeaders !== undefined) {
          show = settings.hasHeaders
            ? ResolvedLayoutConfig.Header.defaults.show
            : false;
        } else {
          show = ResolvedLayoutConfig.Header.defaults.show;
        }
      }
      const result: ResolvedLayoutConfig.Header = {
        show,
        popout:
          header?.popout ??
          labels?.popout ??
          (settings?.showPopoutIcon === false
            ? false
            : ResolvedLayoutConfig.Header.defaults.popout),
        dock:
          header?.popin ??
          labels?.popin ??
          ResolvedLayoutConfig.Header.defaults.dock,
        maximise:
          header?.maximise ??
          labels?.maximise ??
          (settings?.showMaximiseIcon === false
            ? false
            : ResolvedLayoutConfig.Header.defaults.maximise),
        close:
          header?.close ??
          labels?.close ??
          (settings?.showCloseIcon === false
            ? false
            : ResolvedLayoutConfig.Header.defaults.close),
        minimise:
          header?.minimise ??
          labels?.minimise ??
          ResolvedLayoutConfig.Header.defaults.minimise,
        tabDropdown:
          header?.tabDropdown ??
          labels?.tabDropdown ??
          ResolvedLayoutConfig.Header.defaults.tabDropdown,
      };
      return result;
    }
  }

  /**
   * Executes `isPopout` to handle is popout.
   * @zh 执行 `isPopout`，用于是否为弹出窗口。
   * @param config - config parameter (`LayoutConfig`) / 配置参数（`LayoutConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isPopout(config: LayoutConfig): config is PopoutLayoutConfig {
    return (
      'parentId' in config || 'indexInParent' in config || 'window' in config
    );
  }

  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve( translator:TranslateService,layoutConfig: LayoutConfig): ResolvedLayoutConfig {
    if (isPopout(layoutConfig)) {
      return PopoutLayoutConfig.resolve(translator,layoutConfig);
    } else {
      let root: RootItemConfig | undefined;
      if (layoutConfig.root !== undefined) {
        root = layoutConfig.root;
      } else {
        if (
          layoutConfig.content !== undefined &&
          layoutConfig.content.length > 0
        ) {
          root = layoutConfig.content[0];
        } else {
          root = undefined;
        }
      }
      const config: ResolvedLayoutConfig = {
        resolved: true,
        root: RootItemConfig.resolve(translator,root),
        openPopouts: LayoutConfig.resolveOpenPopouts(translator,layoutConfig.openPopouts),
        dimensions: LayoutConfig.Dimensions.resolve(translator,layoutConfig.dimensions),
        settings: LayoutConfig.Settings.resolve(layoutConfig.settings),
        header: LayoutConfig.Header.resolve(
          layoutConfig.header,
          layoutConfig.settings,
          layoutConfig.labels
        ),
      };
      return config;
    }
  }

  /**
   * Executes `fromResolved` to handle from resolved.
   * @zh 执行 `fromResolved`，用于从已解析。
   * @param config - config parameter (`ResolvedLayoutConfig`) / 配置参数（`ResolvedLayoutConfig`）
   * @returns Result of type `LayoutConfig` / 类型为 `LayoutConfig` 的返回值
   */
  export function fromResolved(config: ResolvedLayoutConfig): LayoutConfig {
    const result: LayoutConfig = {
      root: RootItemConfig.fromResolvedOrUndefined(config.root),
      openPopouts: PopoutLayoutConfig.fromResolvedArray(config.openPopouts),
      settings: ResolvedLayoutConfig.Settings.createCopy(config.settings),
      dimensions: LayoutConfig.Dimensions.fromResolved(config.dimensions),
      header: ResolvedLayoutConfig.Header.createCopy(config.header),
    };
    return result;
  }

  /**
   * Executes `isResolved` to handle is resolved.
   * @zh 执行 `isResolved`，用于是否为已解析。
   * @param configOrResolvedConfig - config or resolved config parameter (`ResolvedLayoutConfig | LayoutConfig`) / 配置Or已解析配置参数（`ResolvedLayoutConfig | LayoutConfig`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  export function isResolved(
    configOrResolvedConfig: ResolvedLayoutConfig | LayoutConfig
  ): configOrResolvedConfig is ResolvedLayoutConfig {
    const config = configOrResolvedConfig as ResolvedLayoutConfig;
    return config.resolved !== undefined && config.resolved === true;
  }

  /**
   * Executes `resolveOpenPopouts` to handle resolve open popouts.
   * @internal
   * @zh 执行 `resolveOpenPopouts`，用于解析打开弹出窗口。
   */
  export function resolveOpenPopouts(
    translator:TranslateService,
    popoutConfigs: PopoutLayoutConfig[] | undefined
  ): ResolvedPopoutLayoutConfig[] {
    if (popoutConfigs === undefined) {
      return [];
    } else {
      const count = popoutConfigs.length;
      const result = new Array<ResolvedPopoutLayoutConfig>(count);
      for (let i = 0; i < count; i++) {
        result[i] = PopoutLayoutConfig.resolve(translator,popoutConfigs[i]);
      }
      return result;
    }
  }
}

/**
 * Interface `PopoutLayoutConfig` defining the contract and properties for popout layout config.
 * @public
 * @zh 接口 `PopoutLayoutConfig`，定义弹出窗口布局配置的数据结构契约与属性规范。
 */
export interface PopoutLayoutConfig extends LayoutConfig {
  /** The id of the element the item will be appended to on popIn
   * If null, append to topmost layout element

   * @zh 属性 `parentId`（类型：`string`），用于存储或配置父级唯一标识。
   */
  parentId: string | null | undefined;
  /** The position of this element within its parent
   * If null, position is last

   * @zh 属性 `indexInParent`（类型：`number`），用于存储或配置索引在父级。
   */
  indexInParent: number | null | undefined;
  /**
   * @deprecated use {@link (PopoutLayoutConfig:interface).window}
   * @zh 属性 `dimensions`（类型：`PopoutLayoutConfig.Dimensions`），用于存储或配置维度列表。
   */
  dimensions: PopoutLayoutConfig.Dimensions | undefined; // for backwards compatibility
  /**
   * Property `window` (`PopoutLayoutConfig.Window`) storing window.
   * @zh 属性 `window`（类型：`PopoutLayoutConfig.Window`），用于存储或配置窗口。
   */
  window: PopoutLayoutConfig.Window | undefined;
}

/** @public */
export namespace PopoutLayoutConfig {
  // Previous versions kept window information in Dimensions key.  Only use for backwards compatibility
  /**
   * @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface)}
   * @zh 接口 `Dimensions`，定义维度列表的数据结构契约与属性规范。
   */
  export interface Dimensions extends LayoutConfig.Dimensions {
    /**
     * @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).width}
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width?: number | null;
    /**
     * @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).height}
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height?: number | null;
    /**
     * @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).left}
     * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
     */
    left?: number | null;
    /**
     * @deprecated use {@link (PopoutLayoutConfig:namespace).(Window:interface).top}
     * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
     */
    top?: number | null;
  }

  /**
   * Interface `Window` defining the contract and properties for window.
   * @zh 接口 `Window`，定义窗口的数据结构契约与属性规范。
   */
  export interface Window {
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width?: number;
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height?: number;
    /**
     * Property `left` (`number`) storing left.
     * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
     */
    left?: number;
    /**
     * Property `top` (`number`) storing top.
     * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
     */
    top?: number;
  }

  export namespace Window {
    /**
     * Executes `resolve` to handle resolve.
     * @internal
     * @zh 执行 `resolve`，用于解析。
     */
    export function resolve(
      window: Window | undefined,
      dimensions: Dimensions | undefined
    ): ResolvedPopoutLayoutConfig.Window {
      let result: ResolvedPopoutLayoutConfig.Window;
      const defaults = ResolvedPopoutLayoutConfig.Window.defaults;
      if (window !== undefined) {
        result = {
          width: window.width ?? defaults.width,
          height: window.height ?? defaults.height,
          left: window.left ?? defaults.left,
          top: window.top ?? defaults.top,
        };
      } else {
        result = {
          width: dimensions?.width ?? defaults.width,
          height: dimensions?.height ?? defaults.height,
          left: dimensions?.left ?? defaults.left,
          top: dimensions?.top ?? defaults.top,
        };
      }
      return result;
    }

    /**
     * Executes `fromResolved` to handle from resolved.
     * @internal
     * @zh 执行 `fromResolved`，用于从已解析。
     */
    export function fromResolved(
      resolvedWindow: ResolvedPopoutLayoutConfig.Window
    ): Window {
      const result: Window = {
        width: resolvedWindow.width === null ? undefined : resolvedWindow.width,
        height:
          resolvedWindow.height === null ? undefined : resolvedWindow.height,
        left: resolvedWindow.left === null ? undefined : resolvedWindow.left,
        top: resolvedWindow.top === null ? undefined : resolvedWindow.top,
      };

      return result;
    }
  }

  /**
   * Executes `resolve` to handle resolve.
   * @internal
   * @zh 执行 `resolve`，用于解析。
   */
  export function resolve(
    translator:TranslateService,
    popoutConfig: PopoutLayoutConfig
  ): ResolvedPopoutLayoutConfig {
    let root: RootItemConfig | undefined;
    if (popoutConfig.root !== undefined) {
      root = popoutConfig.root;
    } else {
      if (
        popoutConfig.content !== undefined &&
        popoutConfig.content.length > 0
      ) {
        root = popoutConfig.content[0];
      } else {
        root = undefined;
      }
    }

    const config: ResolvedPopoutLayoutConfig = {
      root: RootItemConfig.resolve(translator,root),
      openPopouts: LayoutConfig.resolveOpenPopouts(translator,popoutConfig.openPopouts),
      dimensions: LayoutConfig.Dimensions.resolve(translator,popoutConfig.dimensions),
      settings: LayoutConfig.Settings.resolve(popoutConfig.settings),
      header: LayoutConfig.Header.resolve(
        popoutConfig.header,
        popoutConfig.settings,
        popoutConfig.labels
      ),
      parentId: popoutConfig.parentId ?? null,
      indexInParent: popoutConfig.indexInParent ?? null,
      window: PopoutLayoutConfig.Window.resolve(
        popoutConfig.window,
        popoutConfig.dimensions
      ),
      resolved: true,
    };
    return config;
  }

  /**
   * Executes `fromResolved` to handle from resolved.
   * @internal
   * @zh 执行 `fromResolved`，用于从已解析。
   */
  export function fromResolved(
    resolvedConfig: ResolvedPopoutLayoutConfig
  ): PopoutLayoutConfig {
    const result: PopoutLayoutConfig = {
      root: RootItemConfig.fromResolvedOrUndefined(resolvedConfig.root),
      openPopouts: fromResolvedArray(resolvedConfig.openPopouts),
      dimensions: LayoutConfig.Dimensions.fromResolved(
        resolvedConfig.dimensions
      ),
      settings: ResolvedLayoutConfig.Settings.createCopy(
        resolvedConfig.settings
      ),
      header: ResolvedLayoutConfig.Header.createCopy(resolvedConfig.header),
      parentId: resolvedConfig.parentId,
      indexInParent: resolvedConfig.indexInParent,
      window: PopoutLayoutConfig.Window.fromResolved(resolvedConfig.window),
    };

    return result;
  }

  /**
   * Executes `fromResolvedArray` to handle from resolved array.
   * @internal
   * @zh 执行 `fromResolvedArray`，用于从已解析数组。
   */
  export function fromResolvedArray(
    resolvedArray: ResolvedPopoutLayoutConfig[]
  ): PopoutLayoutConfig[] {
    const resolvedOpenPopoutCount = resolvedArray.length;
    const result = new Array<PopoutLayoutConfig>(resolvedOpenPopoutCount);
    for (let i = 0; i < resolvedOpenPopoutCount; i++) {
      const resolvedOpenPopout = resolvedArray[i];
      result[i] = PopoutLayoutConfig.fromResolved(resolvedOpenPopout);
    }

    return result;
  }
}

/**
 * Interface `SizeWithUnit` defining the contract and properties for size with unit.
 * @internal
 * @zh 接口 `SizeWithUnit`，定义尺寸带有Unit的数据结构契约与属性规范。
 */
export interface SizeWithUnit {
  /**
   * Property `size` (`number`) storing size.
   * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
   */
  size: number;
  /**
   * Property `sizeUnit` (`SizeUnitEnum`) storing size unit.
   * @zh 属性 `sizeUnit`（类型：`SizeUnitEnum`），用于存储或配置尺寸Unit。
   */
  sizeUnit: SizeUnitEnum;
}

/**
 * Interface `UndefinableSizeWithUnit` defining the contract and properties for undefinable size with unit.
 * @internal
 * @zh 接口 `UndefinableSizeWithUnit`，定义Undefinable尺寸带有Unit的数据结构契约与属性规范。
 */
export interface UndefinableSizeWithUnit {
  /**
   * Property `size` (`number`) storing size.
   * @zh 属性 `size`（类型：`number`），用于存储或配置尺寸。
   */
  size: number | undefined;
  /**
   * Property `sizeUnit` (`SizeUnitEnum`) storing size unit.
   * @zh 属性 `sizeUnit`（类型：`SizeUnitEnum`），用于存储或配置尺寸Unit。
   */
  sizeUnit: SizeUnitEnum;
}

/**
 * Executes `parseSize` to handle parse size.
 * @internal
 * @zh 执行 `parseSize`，用于解析尺寸。
 */
export function parseSize(
  translator:TranslateService,
  sizeString,
  allowableSizeUnits: readonly SizeUnitEnum[],
  sizeUnit?:string
): SizeWithUnit {
  let firstNonDigitPart:string
  let size:number=0;
  if(sizeUnit==undefined){
    let result= splitStringAtFirstNonNumericChar(sizeString);
    let digitsPart=result.numericPart;
    firstNonDigitPart=result.firstNonNumericCharPart;
    size = Number.parseInt(digitsPart, 10);
  }else{
    size=sizeString;
    firstNonDigitPart=sizeUnit;
  }

  if (isNaN(size)) {
    throw new ConfigurationError(
      translator.instant('docklayout.InvalidNumberPartInSizeString')+`: ${sizeString}`
    );
  } else {
    const sizeUnit = SizeUnitEnum.tryParse(firstNonDigitPart);
    if (sizeUnit === undefined) {
      throw new ConfigurationError(
        translator.instant('docklayout.UnknownUnitInSizeString')+`: ${sizeString}`
      );
    } else {
      if (!allowableSizeUnits.includes(sizeUnit)) {
        throw new ConfigurationError(
          translator.instant('docklayout.UnsupportedUnitInSizeString')+`: ${sizeString}`
        );
      } else {
        return { size, sizeUnit };
      }
    }
  }
}

/**
 * Executes `formatSize` to handle format size.
 * @internal
 * @zh 执行 `formatSize`，用于格式化尺寸。
 */
export function formatSize(size: number, sizeUnit: SizeUnitEnum) {
  return size.toString(10) + SizeUnitEnum.format(sizeUnit);
}

/**
 * Executes `formatUndefinableSize` to handle format undefinable size.
 * @internal
 * @zh 执行 `formatUndefinableSize`，用于格式化Undefinable尺寸。
 */
export function formatUndefinableSize(
  size: number | undefined,
  sizeUnit: SizeUnitEnum
) {
  if (size === undefined) {
    return undefined;
  } else {
    return size.toString(10) + SizeUnitEnum.format(sizeUnit);
  }
}

/**
 * @public @deprecated - use {@link (LayoutConfig:interface)}
 * @zh 类型别名 `Config`，表示配置（`LayoutConfig`）。
 */
export type Config = LayoutConfig;
