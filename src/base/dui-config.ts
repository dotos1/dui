/**
 * @fileoverview dui 组件配置对象的公共类型。
 * @zh dui 组件按 ExtJS 风格用配置对象创建（`Dui.create(config)`、`@Input() config`）。
 * 常用字段在这里写出具体类型；各组件特有的字段由组件自己的配置接口扩展；
 * 应用自定义的字段走索引签名，取出来是 `unknown`，使用方需自行收窄——
 * 不再像 `config: any` 那样关掉检查，也不再像 `config = {}`（推断成 `{}`）那样任何字段都访问不了。
 */

/** 内联样式：CSS 属性名 → 值（与 `[ngStyle]` 的入参一致） */
export interface DuiStyle {
  [cssProperty: string]: string | number | null | undefined;
}

/** 事件监听项：函数，或 `{ fn, scope }` */
export type DuiListener = Function | { fn: Function; scope?: object };

/** `listeners` 配置：事件名 → 监听项 */
export interface DuiListeners {
  [eventName: string]: DuiListener;
}

/** 表达式：布尔常量、运行期编译的字符串表达式，或函数 */
export type DuiExpression = boolean | string | Function;

/** `expressionProperties` 里编译后的单项 */
export interface DuiCompiledExpression {
  expression: Function;
  expressionValueSetter: (...args: unknown[]) => void;
  expressionValue?: unknown;
}

/** `expressionProperties` 配置：属性路径 → 表达式（初始化后被编译成 DuiCompiledExpression） */
export interface DuiExpressionProperties {
  [propertyPath: string]: string | Function | DuiCompiledExpression;
}

/** 插件配置：插件类型名，或带 `ptype` 的配置对象，或已实例化的插件 */
export type DuiPluginConfig = string | { ptype?: string; init?: Function; [key: string]: unknown };

/**
 * dui 组件配置对象。所有组件配置接口都从这里扩展。
 */
export interface DuiConfig {
  /** 组件类型（工厂里登记的选择器），`Dui.create` 按它查组件工厂 */
  xtype?: string;
  /** 插件类型 */
  ptype?: string;
  id?: string;
  itemId?: string;
  ref?: string;
  name?: string;
  title?: string;
  text?: string;
  icon?: string;
  iconCls?: string;
  tooltip?: string;
  cls?: string;
  hidden?: boolean;
  disabled?: boolean;
  width?: number | string;
  height?: number | string;
  flex?: number | string;
  layout?: string | DuiConfig;
  style?: DuiStyle;
  /** 子项配置（或已创建的组件实例） */
  items?: Array<DuiConfig | object | string>;
  /** 子菜单 / 下拉项 */
  children?: Array<DuiConfig | string>;
  listeners?: DuiListeners;
  plugins?: DuiPluginConfig | DuiPluginConfig[];
  hideExpression?: DuiExpression;
  disableExpression?: DuiExpression;
  expressionProperties?: DuiExpressionProperties;
  handler?: Function;
  /** 已渲染的组件实例标志：容器 add 时直接使用，不再创建 */
  render?: boolean;
  /** 表单字段标志 */
  isField?: boolean;
  value?: unknown;
  /** 应用自定义的其它配置项 */
  [key: string]: unknown;
}
