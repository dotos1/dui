/**
 * @fileoverview Module `src/ui/menu/menu-model.ts` providing menu model definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu-model.ts`，提供菜单模型相关的定义与实现。
 */


/**
 * Interface `MenuModel` defining the contract and properties for menu model.
 * @zh 接口 `MenuModel`，定义菜单模型的数据结构契约与属性规范。
 */
export interface MenuModel {
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id?: string;
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title?: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?: string;   // 'menu' | 'custom' | 'divider'|'checkbox'|'radio';
  /**
   * Property `value` (`string | boolean`) storing value.
   * @zh 属性 `value`（类型：`string | boolean`），用于存储或配置值。
   */
  value?: boolean|string;
  /**
   * Property `order` (`number`) storing order.
   * @zh 属性 `order`（类型：`number`），用于存储或配置顺序。
   */
  order?: number;
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled?: boolean;
  /**
   * Property `data` (`any`) storing data.
   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data?;
  /**
   * Property `toolTip` (`any`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`any`），用于存储或配置tool提示。
   */
  toolTip?;
  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  style?;
  /**
   * Property `showIcon` (`boolean`) storing show icon.
   * @zh 属性 `showIcon`（类型：`boolean`），用于存储或配置显示图标。
   */
  showIcon?:boolean;
  /**
   * Property `showWhen` (`any`) storing show when.
   * @zh 属性 `showWhen`（类型：`any`），用于存储或配置显示When。
   */
  showWhen?;
  /**
   * Property `translate` (`string`) storing translate.
   * @zh 属性 `translate`（类型：`string`），用于存储或配置翻译。
   */
  translate?: string;
  /**
   * Property `disable` (`boolean`) storing disable.
   * @zh 属性 `disable`（类型：`boolean`），用于存储或配置禁用。
   */
  disable?: boolean;
  /**
   * Property `iconType` (`string`) storing icon type.
   * @zh 属性 `iconType`（类型：`string`），用于存储或配置图标类型。
   */
  iconType?: string;
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon?: string;
  /**
   * Property `iconStyle` (`any`) storing icon style.
   * @zh 属性 `iconStyle`（类型：`any`），用于存储或配置图标样式。
   */
  iconStyle?;
  /**
   * Property `svgIcon` (`string`) storing svg icon.
   * @zh 属性 `svgIcon`（类型：`string`），用于存储或配置SVG矢量图图标。
   */
  svgIcon?: string;
  /**
   * Property `extraText` (`string`) storing extra text.
   * @zh 属性 `extraText`（类型：`string`），用于存储或配置extra文本。
   */
  extraText?: string;
  /**
   * Property `xtype` (`string`) storing xtype.
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型。
   */
  xtype?: string;
  /**
   * Property `parent` (`string`) storing parent.
   * @zh 属性 `parent`（类型：`string`），用于存储或配置父级。
   */
  parent?: string;
  /**
   * Property `isIframe` (`boolean`) storing is iframe.
   * @zh 属性 `isIframe`（类型：`boolean`），用于存储或配置是否为Iframe。
   */
  isIframe?: boolean;
  /**
   * Property `object_id` (`string`) storing object id.
   * @zh 属性 `object_id`（类型：`string`），用于存储或配置对象唯一标识。
   */
  object_id?: string;
  /**
   * Property `url` (`string`) storing url.
   * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
   */
  url?: string;
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x?: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y?: number;
  /**
   * Property `text` (`string`) storing text.
   * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
   */
  text?:string;
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
   * Property `hidden` (`boolean`) storing hidden.
   * @zh 属性 `hidden`（类型：`boolean`），用于存储或配置隐藏。
   */
  hidden?: boolean;
  /**
   * Property `classes` (`string`) storing classes.
   * @zh 属性 `classes`（类型：`string`），用于存储或配置类名集合。
   */
  classes?: string;
  /**
   * Property `exactMatch` (`boolean`) storing exact match.
   * @zh 属性 `exactMatch`（类型：`boolean`），用于存储或配置exact匹配。
   */
  exactMatch?: boolean;
  /**
   * Property `externalUrl` (`boolean`) storing external url.
   * @zh 属性 `externalUrl`（类型：`boolean`），用于存储或配置外部链接地址。
   */
  externalUrl?: boolean;
  /**
   * Property `openInNewTab` (`boolean`) storing open in new tab.
   * @zh 属性 `openInNewTab`（类型：`boolean`），用于存储或配置打开在新选项卡。
   */
  openInNewTab?: boolean;
  /**
   * Property `shortcut` (`string`) storing shortcut.
   * @zh 属性 `shortcut`（类型：`string`），用于存储或配置快捷键。
   */
  shortcut?: string ;
  /**
   * Property `hideExpression` (`any`) storing hide expression.
   * @zh 属性 `hideExpression`（类型：`any`），用于存储或配置隐藏表达式。
   */
  hideExpression?;
  /**
   * Property `disableExpression` (`any`) storing disable expression.
   * @zh 属性 `disableExpression`（类型：`any`），用于存储或配置禁用表达式。
   */
  disableExpression?;
  /**
   * Property `expressionProperties` (`any`) storing expression properties.
   * @zh 属性 `expressionProperties`（类型：`any`），用于存储或配置表达式属性列表。
   */
  expressionProperties?;
  /**
   * Property `badge` (`{ title?: string; translate?: string; bg?: string; fg?: string; }`) storing badge.
   * @zh 属性 `badge`（类型：`{ title?: string; translate?: string; bg?: string; fg?: string; }`），用于存储或配置徽标。
   */
  badge?: {
    title?: string;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  /**
   * Property `children` (`MenuModel[]`) storing children.
   * @zh 属性 `children`（类型：`MenuModel[]`），用于存储或配置子级列表。
   */
  children?: Array<MenuModel>;
  /**
   * Property `handler` (`(item?: any) => void`) storing handler.
   * @zh 属性 `handler`（类型：`(item?: any) => void`），用于存储或配置处理器。
   */
  handler?: (item?) => void;
  /**
   * Property `onClick` (`(item: MenuModel, ev: Event) => void`) storing on click.
   * @zh 属性 `onClick`（类型：`(item: MenuModel, ev: Event) => void`），用于存储或配置当点击。
   */
  onClick?: (item: MenuModel, ev: Event) => void;
  /**
   * Property `onValueChange` (`(newValue: any, oldValue: any) => void`) storing on value change.
   * @zh 属性 `onValueChange`（类型：`(newValue: any, oldValue: any) => void`），用于存储或配置当值变更。
   */
  onValueChange?: (newValue, oldValue) => void;
  /**
   * Property `doCheck` (`(item?: any) => void`) storing do check.
   * @zh 属性 `doCheck`（类型：`(item?: any) => void`），用于存储或配置do检查。
   */
  doCheck?: (item?) => void;
}
/**
 * Interface `MenuBarItem` defining the contract and properties for menu bar item.
 * @zh 接口 `MenuBarItem`，定义菜单条条目的数据结构契约与属性规范。
 */
export interface MenuBarItem {
  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  title: string;
  /**
   * Property `children` (`MenuModel[]`) storing children.
   * @zh 属性 `children`（类型：`MenuModel[]`），用于存储或配置子级列表。
   */
  children: MenuModel[];
  /**
   * Property `disabled` (`boolean`) storing disabled.
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  disabled?: boolean;
  /**
   * Property `hidden` (`boolean`) storing hidden.
   * @zh 属性 `hidden`（类型：`boolean`），用于存储或配置隐藏。
   */
  hidden?:boolean;
  /**
   * Property `doCheck` (`(item?: any) => void`) storing do check.
   * @zh 属性 `doCheck`（类型：`(item?: any) => void`），用于存储或配置do检查。
   */
  doCheck?: (item?) => void;
}
