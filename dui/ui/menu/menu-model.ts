
export interface MenuModel {
  id?: string;
  title?: string;
  type?: string;   // 'menu' | 'custom' | 'divider'|'checkbox'|'radio';
  value?: boolean|string;
  order?: number;
  disabled?: boolean;
  data?: any;
  toolTip?:any;
  style?:any;
  showIcon?:boolean;
  showWhen?:any;
  translate?: string;
  disable?: boolean;
  iconType?: string;
  icon?: string;
  iconStyle?:any;
  svgIcon?: string;
  extraText?: string;
  xtype?: string;
  parent?: string;
  isIframe?: boolean;
  object_id?: string;
  url?: string;
  x?: number;
  y?: number;
  text?:string;
  width?: number;
  height?: number;
  hidden?: boolean;
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  shortcut?: string ;
  hideExpression?: boolean | string | ((model: any, formState: any) => boolean);
  disableExpression?: boolean | string | ((model: any, formState: any) => boolean);
  expressionProperties?: { [property: string]: string | ((model: any, formState: any) => boolean) } | any;
  badge?: {
    title?: string;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children?: Array<MenuModel>;
  handler?: (item?: any) => void;
  onClick?: (item: MenuModel, ev: Event) => void;
  onValueChange?: (newValue: any, oldValue: any) => void;
  doCheck?: (item?: any) => void;
}
export interface MenuBarItem {
  title: string;
  children: MenuModel[];
  disabled?: boolean;
  hidden?:boolean;
  doCheck?: (item?: any) => void;
}
