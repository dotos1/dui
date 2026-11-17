/**
 * @fileoverview Module `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.types.ts` providing shared types for the live code sandbox.
 * @zh 模块文件 `projects/testdui/src/app/docs/components/live-template-stage/live-sandbox.types.ts`，提供在线代码实时沙箱的共享类型定义。
 */

/**
 * Type alias `JsonValue` representing any JSON-serializable value.
 * @zh 类型别名 `JsonValue`，表示任意可 JSON 序列化的值。
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

/**
 * Interface `JsonObject` representing a JSON object.
 * @zh 接口 `JsonObject`，表示 JSON 对象。
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Interface `LiveStageEvent` describing a `log(label, payload?)` call from the sandbox template.
 * @zh 接口 `LiveStageEvent`，描述沙箱模板内调用 `log(label, payload?)` 回流的事件。
 */
export interface LiveStageEvent {
  /**
   * Event label.
   * @zh 事件标题。
   */
  label: string;
  /**
   * Serialized payload text.
   * @zh 序列化后的负载文本。
   */
  payload: string;
}

/**
 * Type alias `LiveCompilePhase` naming the sandbox pipeline phase.
 * @zh 类型别名 `LiveCompilePhase`，表示沙箱流水线阶段：解析状态 JSON / 编译模板 / 渲染。
 */
export type LiveCompilePhase = 'state' | 'compile' | 'render';

/**
 * Interface `LiveCompileStatus` reporting result of a sandbox update.
 * @zh 接口 `LiveCompileStatus`，报告一次沙箱更新（编译或状态替换）的结果。
 */
export interface LiveCompileStatus {
  /**
   * Whether the update succeeded.
   * @zh 是否成功。
   */
  ok: boolean;
  /**
   * Whether the template was recompiled (false = state-only patch).
   * @zh 是否重新编译了模板（false 表示仅替换 state）。
   */
  recompiled: boolean;
  /**
   * Failing (or last) phase.
   * @zh 失败（或最后执行）的阶段。
   */
  phase: LiveCompilePhase;
  /**
   * Human-readable diagnostic message (empty on success).
   * @zh 诊断信息（成功时为空）。
   */
  message: string;
  /**
   * Duration in milliseconds.
   * @zh 耗时（毫秒）。
   */
  durationMs: number;
}

/**
 * Type guard checking a parsed JSON value is a plain object.
 * @zh 类型守卫：判断解析后的 JSON 值是否为普通对象。
 * @param value - Parsed value / 解析结果
 * @returns Whether value is `JsonObject` / 是否为 `JsonObject`
 */
export function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parses JSON text into a `JsonObject`, throwing on syntax error or non-object root.
 * @zh 将 JSON 文本解析为 `JsonObject`；语法错误或根节点非对象时抛出异常。
 * @param text - JSON source / JSON 源文本
 * @returns Parsed object / 解析后的对象
 */
export function parseJsonObject(text: string): JsonObject {
  const parsed: JsonValue = JSON.parse(text.trim() === '' ? '{}' : text);
  if (!isJsonObject(parsed)) {
    throw new Error('状态数据的根节点必须是 JSON 对象，例如 { "title": "..." }');
  }
  return parsed;
}
