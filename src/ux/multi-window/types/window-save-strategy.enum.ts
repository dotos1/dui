/**
 * A representation of a strategy on how to save the window id in the native window.name property.

 * @zh 枚举 `WindowSaveStrategy`，定义支持的窗口保存策略常量集合。
 */
export enum WindowSaveStrategy {
  /**
   * Default behaviour. Window data will not be saved.

   * @zh 枚举项 `WindowSaveStrategy.NONE`，表示无。
   */
  NONE,
  /**
   * Only save the window data when the storage (native window.name property) is empty/undefined, meaning nothing else is
   * probably utilizing it

   * @zh 枚举项 `WindowSaveStrategy.SAVE_WHEN_EMPTY`，表示保存WHEN空。
   */
  SAVE_WHEN_EMPTY,
  /**
   * Save the window data without checking whether the storage might be used by another script

   * @zh 枚举项 `WindowSaveStrategy.SAVE_FORCE`，表示保存FORCE。
   */
  SAVE_FORCE,
  /**
   * Save window data, but backup probable existing data in the storage and restore the original data after reading the window data.
   * Restoring the original data might not happen "on time" for the script using it, which would require delaying it's execution.

   * @zh 枚举项 `WindowSaveStrategy.SAVE_BACKUP`，表示保存BACKUP。
   */
  SAVE_BACKUP,
}
