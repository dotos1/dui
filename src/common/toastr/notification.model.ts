/**
 * @fileoverview Module `src/common/toastr/notification.model.ts` providing notification model definitions and implementation.
 * @zh 模块文件 `src/common/toastr/notification.model.ts`，提供通知模型相关的定义与实现。
 */



/**
 * Interface `NotificationModel` defining the contract and properties for notification model.
 * @zh 接口 `NotificationModel`，定义通知模型的数据结构契约与属性规范。
 */
export interface NotificationModel {
    /**
     * Property `dateTime` (`Date`) storing date time.
     * @zh 属性 `dateTime`（类型：`Date`），用于存储或配置日期时间。
     */
    dateTime: Date;
    /**
     * Property `message` (`string`) storing message.
     * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
     */
    message: string;
}
