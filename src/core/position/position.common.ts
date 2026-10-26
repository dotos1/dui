/**
 * @fileoverview Module `src/core/position/position.common.ts` providing position common definitions and implementation.
 * @zh 模块文件 `src/core/position/position.common.ts`，提供位置通用相关的定义与实现。
 */

/**
 * Interface `IPoint` defining the contract and properties for i point.
 * @zh 接口 `IPoint`，定义I坐标点的数据结构契约与属性规范。
 */
export interface IPoint {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number;
}

/**
 * Interface `ISize` defining the contract and properties for i size.
 * @zh 接口 `ISize`，定义I尺寸的数据结构契约与属性规范。
 */
export interface ISize {
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
 * Interface `IRectangle` defining the contract and properties for i rectangle.
 * @zh 接口 `IRectangle`，定义I矩形的数据结构契约与属性规范。
 */
export interface IRectangle {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number;
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
 * Interface `IPositionEvent` defining the contract and properties for i position event.
 * @zh 接口 `IPositionEvent`，定义I位置事件的数据结构契约与属性规范。
 */
export interface IPositionEvent {
  /**
   * Property `size` (`ISize`) storing size.
   * @zh 属性 `size`（类型：`ISize`），用于存储或配置尺寸。
   */
  size: ISize;
  /**
   * Property `position` (`IPoint`) storing position.
   * @zh 属性 `position`（类型：`IPoint`），用于存储或配置位置。
   */
  position: IPoint;
  /**
   * Property `direction` (`string`) storing direction.
   * @zh 属性 `direction`（类型：`string`），用于存储或配置方向。
   */
  direction: string;
}

/**
 * Interface `IPositionState` defining the contract and properties for i position state.
 * @zh 接口 `IPositionState`，定义I位置状态的数据结构契约与属性规范。
 */
export interface IPositionState {
  /**
   * Property `currentSize` (`ISize`) storing current size.
   * @zh 属性 `currentSize`（类型：`ISize`），用于存储或配置当前尺寸。
   */
  currentSize: ISize;
  /**
   * Property `startSize` (`ISize`) storing start size.
   * @zh 属性 `startSize`（类型：`ISize`），用于存储或配置开始尺寸。
   */
  startSize: ISize;
  /**
   * Property `currentPosition` (`IPoint`) storing current position.
   * @zh 属性 `currentPosition`（类型：`IPoint`），用于存储或配置当前位置。
   */
  currentPosition: IPoint;
  /**
   * Property `startPosition` (`IPoint`) storing start position.
   * @zh 属性 `startPosition`（类型：`IPoint`），用于存储或配置开始位置。
   */
  startPosition: IPoint;
  /**
   * Property `direction` (`string`) storing direction.
   * @zh 属性 `direction`（类型：`string`），用于存储或配置方向。
   */
  direction: string;
  /**
   * Property `isResizing` (`boolean`) storing is resizing.
   * @zh 属性 `isResizing`（类型：`boolean`），用于存储或配置是否为调整尺寸中。
   */
  isResizing: boolean;
  /**
   * Property `isMoving` (`boolean`) storing is moving.
   * @zh 属性 `isMoving`（类型：`boolean`），用于存储或配置是否为移动。
   */
  isMoving: boolean;
}

/**
 * Interface `IPosionOptions` defining the contract and properties for i posion options.
 * @zh 接口 `IPosionOptions`，定义IPosion配置选项的数据结构契约与属性规范。
 */
export interface IPosionOptions {
  /**
   * Property `minSize` (`ISize`) storing min size.
   * @zh 属性 `minSize`（类型：`ISize`），用于存储或配置最小值尺寸。
   */
  minSize: ISize;
  /**
   * Property `maxSize` (`ISize`) storing max size.
   * @zh 属性 `maxSize`（类型：`ISize`），用于存储或配置最大值尺寸。
   */
  maxSize: ISize;
  /**
   * Property `grid` (`ISize`) storing grid.
   * @zh 属性 `grid`（类型：`ISize`），用于存储或配置网格表格。
   */
  grid: ISize;
  /**
   * Property `directions` (`string[]`) storing directions.
   * @zh 属性 `directions`（类型：`string[]`），用于存储或配置方向。
   */
  directions: string[];
  /**
   * Property `resizable` (`boolean`) storing resizable.
   * @zh 属性 `resizable`（类型：`boolean`），用于存储或配置是否可调尺寸。
   */
  resizable: boolean;
  /**
   * Property `bound` (`IRectangle`) storing bound.
   * @zh 属性 `bound`（类型：`IRectangle`），用于存储或配置已绑定。
   */
  bound: IRectangle;
  /**
   * Property `ratio` (`number`) storing ratio.
   * @zh 属性 `ratio`（类型：`number`），用于存储或配置比例。
   */
  ratio: number;
}

/**
 * Interface `IResizable` defining the contract and properties for i resizable.
 * @zh 接口 `IResizable`，定义I是否可调尺寸的数据结构契约与属性规范。
 */
export interface IResizable {
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
   /**
    * Property `x` (`number`) storing x.
    * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
    */
   x: number;
   /**
    * Property `y` (`number`) storing y.
    * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
    */
   y: number;
   /**
    * Property `maxWidth` (`number`) storing max width.
    * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
    */
   maxWidth: number;
   /**
    * Property `minWidth` (`number`) storing min width.
    * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
    */
   minWidth: number;
   /**
    * Property `maxHeight` (`number`) storing max height.
    * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
    */
   maxHeight: number;
   /**
    * Property `minHeight` (`number`) storing min height.
    * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
    */
   minHeight: number;
   /**
    * Property `resizable` (`boolean`) storing resizable.
    * @zh 属性 `resizable`（类型：`boolean`），用于存储或配置是否可调尺寸。
    */
   resizable: boolean;
   /**
    * Property `directions` (`string[]`) storing directions.
    * @zh 属性 `directions`（类型：`string[]`），用于存储或配置方向。
    */
   directions: string[];
   /**
    * Property `grid` (`ISize`) storing grid.
    * @zh 属性 `grid`（类型：`ISize`），用于存储或配置网格表格。
    */
   grid?: ISize ;
   /**
    * Property `bound` (`IRectangle`) storing bound.
    * @zh 属性 `bound`（类型：`IRectangle`），用于存储或配置已绑定。
    */
   bound?: IRectangle;
   /**
    * Property `ratio` (`number`) storing ratio.
    * @zh 属性 `ratio`（类型：`number`），用于存储或配置比例。
    */
   ratio?: number;
}
