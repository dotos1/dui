/**
 * @fileoverview Module `src/ux/command-palette/content/command-palette-scroll-calculator.ts` providing command palette scroll calculator definitions and implementation.
 * @zh 模块文件 `src/ux/command-palette/content/command-palette-scroll-calculator.ts`，提供命令调色板滚动calculator相关的定义与实现。
 */

/**
 * Type alias `CommandPaletteScrollParams` representing command palette scroll params (`{ selectedElementTopPosition: number; containerTopPosition: number; co...`).
 * @zh 类型别名 `CommandPaletteScrollParams`，表示命令调色板滚动参数集合（`{ selectedElementTopPosition: number; containerTopPosition: number; co...`）。
 */
export type CommandPaletteScrollParams = {
  /**
   * Property `selectedElementTopPosition` (`number`) storing selected element top position.
   * @zh 属性 `selectedElementTopPosition`（类型：`number`），用于存储或配置已选中元素顶部位置位置。
   */
  selectedElementTopPosition: number;
  /**
   * Property `containerTopPosition` (`number`) storing container top position.
   * @zh 属性 `containerTopPosition`（类型：`number`），用于存储或配置容器顶部位置位置。
   */
  containerTopPosition: number;
  /**
   * Property `containerScrollTop` (`number`) storing container scroll top.
   * @zh 属性 `containerScrollTop`（类型：`number`），用于存储或配置容器滚动顶部位置。
   */
  containerScrollTop: number;
  /**
   * Property `containerHeight` (`number`) storing container height.
   * @zh 属性 `containerHeight`（类型：`number`），用于存储或配置容器高度。
   */
  containerHeight: number;
  /**
   * Property `rowHeight` (`number`) storing row height.
   * @zh 属性 `rowHeight`（类型：`number`），用于存储或配置行高度。
   */
  rowHeight: number;
};

/**
 * Class `CommandPaletteScrollCalculator` encapsulating command palette scroll calculator data structures and logic in `src/ux/command-palette/content`.
 * @zh 类 `CommandPaletteScrollCalculator`，封装 `src/ux/command-palette/content` 中的命令调色板滚动Calculator数据结构与处理逻辑。
 */
export class CommandPaletteScrollCalculator {

  /**
   * Executes `calculate` to handle calculate.
   * @zh 执行 `calculate`，用于计算。
   * @param params - params parameter (`CommandPaletteScrollParams`) / 参数集合参数（`CommandPaletteScrollParams`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  calculate(params: CommandPaletteScrollParams): number {
    const { selectedElementTopPosition, containerTopPosition, containerScrollTop, containerHeight, rowHeight } = params;
    const rowTopPosition: number = selectedElementTopPosition - containerTopPosition;
    const containerScrollBottom: number = containerScrollTop + containerHeight - rowHeight;

    if (this.isRowInContainer(rowTopPosition, containerScrollTop, containerScrollBottom)) {
      return containerScrollTop;
    }

    if (this.isRowAboveContainer(rowTopPosition, containerScrollTop)) {
      return rowTopPosition;
    }

    if (this.isRowBelowContainer(rowTopPosition, containerScrollBottom)) {
      return (rowTopPosition + rowHeight) - containerHeight;
    }

    return 0;
  }

  /**
   * Executes `isRowInContainer` to handle is row in container.
   * @zh 执行 `isRowInContainer`，用于是否为行在容器。
   * @param rowTopPosition - row top position parameter (`number`) / 行顶部位置位置参数（`number`）
   * @param containerScrollTop - container scroll top parameter (`number`) / 容器滚动顶部位置参数（`number`）
   * @param containerScrollBottom - container scroll bottom parameter (`number`) / 容器滚动底部位置参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isRowInContainer(rowTopPosition: number, containerScrollTop: number, containerScrollBottom: number): boolean {
    return !this.isRowAboveContainer(rowTopPosition, containerScrollTop) &&
      !this.isRowBelowContainer(rowTopPosition, containerScrollBottom);
  }

  /**
   * Executes `isRowAboveContainer` to handle is row above container.
   * @zh 执行 `isRowAboveContainer`，用于是否为行Above容器。
   * @param rowTopPosition - row top position parameter (`number`) / 行顶部位置位置参数（`number`）
   * @param containerScrollTop - container scroll top parameter (`number`) / 容器滚动顶部位置参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isRowAboveContainer(rowTopPosition: number, containerScrollTop: number): boolean {
    return rowTopPosition < containerScrollTop;
  }

  /**
   * Executes `isRowBelowContainer` to handle is row below container.
   * @zh 执行 `isRowBelowContainer`，用于是否为行Below容器。
   * @param rowTopPosition - row top position parameter (`number`) / 行顶部位置位置参数（`number`）
   * @param containerScrollBottom - container scroll bottom parameter (`number`) / 容器滚动底部位置参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private isRowBelowContainer(rowTopPosition: number, containerScrollBottom: number): boolean {
    return rowTopPosition > containerScrollBottom;
  }
}
