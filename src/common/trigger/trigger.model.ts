/**
 * @fileoverview Module `src/common/trigger/trigger.model.ts` providing trigger model definitions and implementation.
 * @zh 模块文件 `src/common/trigger/trigger.model.ts`，提供触发模型相关的定义与实现。
 */

/**
 * Interface `TriggerPopup` defining the contract and properties for trigger popup.
 * @zh 接口 `TriggerPopup`，定义触发弹窗的数据结构契约与属性规范。
 */
export interface TriggerPopup {
  /**
   * Property `host` (`any`) storing host.
   * @zh 属性 `host`（类型：`any`），用于存储或配置宿主。
   */
  host;
  /**
   * Property `params` (`any`) storing params.
   * @zh 属性 `params`（类型：`any`），用于存储或配置参数集合。
   */
  params;
  /**
   * Property `_handleKeydown` (`Function`) storing handle keydown.
   * @zh 属性 `_handleKeydown`（类型：`Function`），用于存储或配置连接手柄按键按下。
   */
  _handleKeydown: Function;
}
