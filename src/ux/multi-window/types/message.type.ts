/**
 * @fileoverview Module `src/ux/multi-window/types/message.type.ts` providing message type definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/types/message.type.ts`，提供消息类型相关的定义与实现。
 */

/**
 * Enumeration `MessageType` defining supported message type constants.
 * @zh 枚举 `MessageType`，定义支持的消息类型常量集合。
 */
export enum MessageType {
  /**
   * Enum member `MessageType.MESSAGE` representing message.
   * @zh 枚举项 `MessageType.MESSAGE`，表示消息。
   */
  MESSAGE,
  /**
   * Enum member `MessageType.MESSAGE_RECEIVED` representing message received.
   * @zh 枚举项 `MessageType.MESSAGE_RECEIVED`，表示消息已接收。
   */
  MESSAGE_RECEIVED,
  /**
   * Enum member `MessageType.PING` representing ping.
   * @zh 枚举项 `MessageType.PING`，表示PING。
   */
  PING,
}

/**
 * Interface `MessageTemplate` defining the contract and properties for message template.
 * @zh 接口 `MessageTemplate`，定义消息模板的数据结构契约与属性规范。
 */
export interface MessageTemplate {
  /**
   * Property `recipientId` (`string`) storing recipient id.
   * @zh 属性 `recipientId`（类型：`string`），用于存储或配置recipient唯一标识。
   */
  recipientId: string;
  /**
   * Property `type` (`MessageType`) storing type.
   * @zh 属性 `type`（类型：`MessageType`），用于存储或配置类型。
   */
  type: MessageType;
  /**
   * Property `event` (`string`) storing event.
   * @zh 属性 `event`（类型：`string`），用于存储或配置事件。
   */
  event: string;
  /**
   * Property `data` (`any`) storing data.
   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data?;
  /**
   * Property `payload` (`any`) storing payload.
   * @zh 属性 `payload`（类型：`any`），用于存储或配置payload。
   */
  payload?;
}

/**
 * Interface `Message` defining the contract and properties for message.
 * @zh 接口 `Message`，定义消息的数据结构契约与属性规范。
 */
export interface Message extends MessageTemplate {
  /**
   * Property `send` (`boolean`) storing send.
   * @zh 属性 `send`（类型：`boolean`），用于存储或配置发送。
   */
  send?: boolean;
  /**
   * Property `messageId` (`string`) storing message id.
   * @zh 属性 `messageId`（类型：`string`），用于存储或配置消息唯一标识。
   */
  messageId: string;
  /**
   * Property `sendTime` (`number`) storing send time.
   * @zh 属性 `sendTime`（类型：`number`），用于存储或配置发送时间。
   */
  sendTime: number;
  /**
   * Property `senderId` (`string`) storing sender id.
   * @zh 属性 `senderId`（类型：`string`），用于存储或配置发送器唯一标识。
   */
  senderId: string;
}
