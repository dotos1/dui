/**
 * @fileoverview Module `src/container/card/card.component.ts` providing card component definitions and implementation.
 * @zh 模块文件 `src/container/card/card.component.ts`，提供卡片组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ComponentBase, Dui, DuiConfig, DuiStyle } from '@dotos/dui/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@dotos/dui/translator';
import {concat,isUndefined,isString}  from 'lodash-es';
import { Container } from '../container.main';

/** 卡片按钮：配置对象（带 xtype），或 '-' / ' ' / '->' / 文本 这类简写 */
export type DuiCardButton = DuiConfig | string;

/** 卡片底部分页条（由使用方挂到 card.pageBar 上） */
export interface DuiCardPageBar {
  page: number;
  total: number;
  doLoad(event: PageEvent): void;
  [key: string]: unknown;
}

/** 卡片搜索面板配置 */
export interface DuiCardSearchFacet {
  filters?: DuiConfig[];
  [key: string]: unknown;
}

/** 卡片运行期状态（使用方自定义字段走索引签名） */
export interface DuiCardState {
  /** 卡片内是否有选中项 */
  selected?: boolean;
  [key: string]: unknown;
}

/** 卡片配置 */
export interface DuiCardConfig extends DuiConfig {
  subtitle?: string;
  buttons?: DuiCardButton[];
  buttonAlign?: string;
  ltbar?: DuiCardButton[];
  rtbar?: DuiCardButton[];
  fbar?: DuiCardButton | DuiCardButton[];
  bbar?: DuiConfig | DuiCardButton[];
  fabLocation?: 'top' | 'bottom' | string;
  searchFacet?: DuiCardSearchFacet;
  cardStyle?: DuiStyle;
  contenStyle?: DuiStyle;
  autoHeight?: boolean;
  fxLayout?: string;
  /** 单击 / 双击卡片项时打开的目标（应用自定义） */
  clickTarget?: string;
  doubleClickTarget?: string;
}

/**
 * Angular component `DuiCardComponent` (selector: 'card') providing dui card component presentation and interaction in `src/container/card`.
 * @zh Angular 组件 `DuiCardComponent`（selector: 'card'），提供DUI卡片组件的视图渲染与交互逻辑（位于 `src/container/card`）。
 */
@Component({
  selector: 'card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',

  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    style: 'flex:1;',
    hostID: 'dui-card' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class DuiCardComponent extends Container implements OnChanges{

  /**
   * Template/content query reference `pagebar` (`MatPaginator`) targeting pagebar.
   * @zh 模板/内容视图查询引用 `pagebar`（`@ViewChild`），指向pagebar。
   */
  @ViewChild(MatPaginator)
  pagebar: MatPaginator;


  /**
   * Input property `config` (`DuiCardConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiCardConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiCardConfig = {};


  /**
   * Property `xtype` (`string`) storing xtype (default: `'card'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'card'`）。
   */
  public override xtype: string = 'card';

  /**
   * Property `direction` (`string`) storing direction (default: `'top'`).
   * @zh 属性 `direction`（类型：`string`），用于存储或配置方向（默认值：`'top'`）。
   */
  public direction: string = 'top';

  /**
   * Property `open` (`boolean`) storing open (default: `false`).
   * @zh 属性 `open`（类型：`boolean`），用于存储或配置打开（默认值：`false`）。
   */
  public open: boolean = false;

  /**
   * Property `alwaysVisible` (`boolean`) storing always visible (default: `false`).
   * @zh 属性 `alwaysVisible`（类型：`boolean`），用于存储或配置always可见（默认值：`false`）。
   */
  public alwaysVisible: boolean = false;


  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  public title: string;


  /**
   * Property `subtitle` (`string`) storing subtitle.
   * @zh 属性 `subtitle`（类型：`string`），用于存储或配置副标题。
   */
  public subtitle: string;


  /**
   * Property `width` (`number`) storing width (default: `100`).
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度（默认值：`100`）。
   */
  public width: number = 100;


  /**
   * Property `color` (`string`) storing color (default: `'primary'`).
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色（默认值：`'primary'`）。
   */
  public color: string = 'primary';


  /**
   * Property `closable` (`boolean`) storing closable (default: `false`).
   * @zh 属性 `closable`（类型：`boolean`），用于存储或配置是否可关闭（默认值：`false`）。
   */
  public closable: boolean = false;


  /**
   * Property `disabled` (`boolean`) storing disabled (default: `false`).
   * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
   */
  public override disabled: boolean = false;


  /**
   * Property `buttons` (`DuiCardButton[]`) storing buttons (default: `[]`).
   * @zh 属性 `buttons`（类型：`DuiCardButton[]`），用于存储或配置按钮（默认值：`[]`）。
   */
  public buttons: DuiCardButton[] = [];


  /**
   * Property `actionButtons` (`ComponentBase[]`) storing action buttons (default: `[]`).
   * @zh 属性 `actionButtons`（类型：`ComponentBase[]`），用于存储或配置动作按钮（默认值：`[]`）。
   */
  private actionButtons: ComponentBase[] = [];


  /**
   * Property `buttonAlign` (`string`) storing button align (default: `'right'`).
   * @zh 属性 `buttonAlign`（类型：`string`），用于存储或配置按钮对齐（默认值：`'right'`）。
   */
  public buttonAlign = 'right';


  /**
   * Property `fabLocation` (`string`) storing fab location (default: `'bottom'`).
   * @zh 属性 `fabLocation`（类型：`string`），用于存储或配置fabLocation（默认值：`'bottom'`）。
   */
  public fabLocation: string = 'bottom';


  /**
   * Property `ltbar` (`DuiCardButton[]`) storing ltbar.
   * @zh 属性 `ltbar`（类型：`DuiCardButton[]`），用于存储或配置ltbar。
   */
  public ltbar: DuiCardButton[];

  /**
   * Property `ltButtons` (`ComponentBase[]`) storing lt buttons (default: `[]`).
   * @zh 属性 `ltButtons`（类型：`ComponentBase[]`），用于存储或配置lt按钮（默认值：`[]`）。
   */
  private ltButtons: ComponentBase[] = [];


  /**
   * Property `rtbar` (`DuiCardButton[]`) storing rtbar.
   * @zh 属性 `rtbar`（类型：`DuiCardButton[]`），用于存储或配置rtbar。
   */
  public rtbar: DuiCardButton[];

  /**
   * Property `rtButtons` (`ComponentBase[]`) storing rt buttons (default: `[]`).
   * @zh 属性 `rtButtons`（类型：`ComponentBase[]`），用于存储或配置rt按钮（默认值：`[]`）。
   */
  private rtButtons: ComponentBase[] = [];


  /**
   * Property `bbar` (`DuiConfig | DuiCardButton[]`) storing bbar.
   * @zh 属性 `bbar`（类型：`DuiConfig | DuiCardButton[]`），用于存储或配置bbar。
   */
  public bbar: DuiConfig | DuiCardButton[];

  /**
   * Property `fbar` (`DuiCardButton | DuiCardButton[]`) storing fbar.
   * @zh 属性 `fbar`（类型：`DuiCardButton | DuiCardButton[]`），用于存储或配置fbar。
   */
  public fbar: DuiCardButton | DuiCardButton[];

  /**
   * Property `fButtons` (`ComponentBase[]`) storing f buttons (default: `[]`).
   * @zh 属性 `fButtons`（类型：`ComponentBase[]`），用于存储或配置f按钮（默认值：`[]`）。
   */
  private fButtons: ComponentBase[] = [];


  /**
   * Property `autoHeight` (`boolean`) storing auto height (default: `false`).
   * @zh 属性 `autoHeight`（类型：`boolean`），用于存储或配置自动高度（默认值：`false`）。
   */
  public autoHeight: boolean = false;


  /**
   * Property `bottomToolbar` (`ComponentBase`) storing bottom toolbar.
   * @zh 属性 `bottomToolbar`（类型：`ComponentBase`），用于存储或配置底部位置工具栏。
   */
  public bottomToolbar: ComponentBase;

  /**
   * Property `fxLayout` (`string`) storing fx layout (default: `'row'`).
   * @zh 属性 `fxLayout`（类型：`string`），用于存储或配置fx布局（默认值：`'row'`）。
   */
  public fxLayout: string = 'row';

  /**
   * Property `style` (`DuiStyle`) storing style.
   * @zh 属性 `style`（类型：`DuiStyle`），用于存储或配置样式。
   */
  public override style: DuiStyle = { overflow: 'auto', width: '100%', height: '100%' };

  /**
   * Property `contenStyle` (`DuiStyle`) storing conten style (default: `{"padding":"8px"}`).
   * @zh 属性 `contenStyle`（类型：`DuiStyle`），用于存储或配置conten样式（默认值：`{"padding":"8px"}`）。
   */
  public contenStyle: DuiStyle = { padding: '8px' };

  /**
   * Property `cardStyle` (`DuiStyle`) storing card style (default: `{}`).
   * @zh 属性 `cardStyle`（类型：`DuiStyle`），用于存储或配置卡片样式（默认值：`{}`）。
   */
  public cardStyle: DuiStyle = {};

  /**
   * Template/content query reference `viewContainer` (`ViewContainerRef`) targeting view container.
   * @zh 模板/内容视图查询引用 `viewContainer`（`@ViewChild`），指向视图容器。
   */
  @ViewChild('panel', { read: ViewContainerRef, static: false }) public override viewContainer: ViewContainerRef = undefined;

  /**
   * Template/content query reference `actionbar` (`ViewContainerRef`) targeting actionbar.
   * @zh 模板/内容视图查询引用 `actionbar`（`@ViewChild`），指向actionbar。
   */
  @ViewChild('actionbar', { read: ViewContainerRef, static: false }) public actionbar: ViewContainerRef;

  /**
   * Template/content query reference `lefttopbar` (`ViewContainerRef`) targeting lefttopbar.
   * @zh 模板/内容视图查询引用 `lefttopbar`（`@ViewChild`），指向lefttopbar。
   */
  @ViewChild('lefttopbar', { read: ViewContainerRef, static: false }) public lefttopbar: ViewContainerRef;

  /**
   * Template/content query reference `righttopbar` (`ViewContainerRef`) targeting righttopbar.
   * @zh 模板/内容视图查询引用 `righttopbar`（`@ViewChild`），指向righttopbar。
   */
  @ViewChild('righttopbar', { read: ViewContainerRef, static: false }) public righttopbar: ViewContainerRef;

  /**
   * Template/content query reference `rightopfab` (`ViewContainerRef`) targeting rightopfab.
   * @zh 模板/内容视图查询引用 `rightopfab`（`@ViewChild`），指向rightopfab。
   */
  @ViewChild('rightopfab', { read: ViewContainerRef, static: false }) public rightopfab: ViewContainerRef;

  /**
   * Template/content query reference `righbottomfab` (`ViewContainerRef`) targeting righbottomfab.
   * @zh 模板/内容视图查询引用 `righbottomfab`（`@ViewChild`），指向righbottomfab。
   */
  @ViewChild('righbottomfab', { read: ViewContainerRef, static: false }) public righbottomfab: ViewContainerRef;

  /**
   * Property `searchBoxTerm` (`string`) storing search box term.
   * @zh 属性 `searchBoxTerm`（类型：`string`），用于存储或配置搜索盒子容器Term。
   */
  public searchBoxTerm: string;

  /**
   * Property `searchFacet` (`DuiCardSearchFacet`) storing search facet.
   * @zh 属性 `searchFacet`（类型：`DuiCardSearchFacet`），用于存储或配置搜索分面。
   */
  public searchFacet: DuiCardSearchFacet;

  /**
   * Property `_state` (`any`) storing state (default: `{}`).
   * @zh 属性 `_state`（类型：`any`），用于存储或配置状态（默认值：`{}`）。
   */
  // 卡片状态：列表类卡片当对象用（state.selected），表单卡片当模式字符串用（'edit' / 'create'），
  // 也有子类直接放组件实例。形状由子类决定，库里给不出统一类型，显式保留 any（G-ANY 计数在内）。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _state: any = {};

  /**
   * Sets the state (`state`).
   * @zh 设置状态（`state`）。
   * @param state - New state value (`any`) / 新的状态值（`any`）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set state(state: any) {
    this._state = state;
    if (this.detectRef) {
      this.detectRef.detectChanges();
    }
  };

  /**
   * Gets the current state (`state: any`).
   * @zh 获取当前状态（`state: any`）。
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get state(): any {
    return this._state;
  }

  /**
   * Property `pageBar` (`DuiCardPageBar`) storing page bar.
   * @zh 属性 `pageBar`（类型：`DuiCardPageBar`），用于存储或配置页面条。
   */
  public pageBar: DuiCardPageBar;

  /**
   * Creates an instance of `DuiCardComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DuiCardComponent` 实例，并初始化其依赖项与内部状态。
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,
    public translateService: TranslateService) {
    super(injector, detectRef);
  }


  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }


  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`DuiCardConfig`) / 配置参数（`DuiCardConfig`）
   */
  override init(config?: DuiCardConfig): void {
    this.buttons=[];
    this.ltButtons=[];
    this.rtButtons=[];
    this.fButtons=[];
    this.actionButtons=[];
    super.init(config);
    if (config) {
      this.searchFacet = config.searchFacet;
    }
    this.detectRef.detectChanges();

    if (this.buttons) {
      this._addButtons(this.buttons);
    }
    if (this.ltbar) {
      this._createTopLeftToolbar(this.ltbar);
    }
    if (this.rtbar) {
      this._createTopRightToolbar(this.rtbar);
    }
    if (this.fbar) {
      this._createFbar(this.fbar);
    }
    if (this.items && this.xtype === 'card') {
      this.addConfiguredItems();
    }
  }



  /**
   * Executes `initEvents` to handle init events.
   * @zh 执行 `initEvents`，用于初始化事件集合。
   */
  initEvents() {
  }

  /**
   * Executes `getPagebar` to handle get pagebar.
   * @zh 执行 `getPagebar`，用于获取Pagebar。
   */
  getPagebar(): MatPaginator {
    return this.pagebar;
  }

  /**
   * Executes `setTitle` to handle set title.
   * @zh 执行 `setTitle`，用于集合标题。
   * @param title - title parameter (`string`) / 标题参数（`string`）
   */
  setTitle(title: string) {
    this.title = title;
  }
  /**
   * Executes `setSubTitle` to handle set sub title.
   * @zh 执行 `setSubTitle`，用于集合子标题。
   * @param subtitle - subtitle parameter (`string`) / 副标题参数（`string`）
   */
  setSubTitle(subtitle: string) {
    this.subtitle = subtitle;
  }

  /**
   * Executes `lookupButton` to handle lookup button.
   * @zh 执行 `lookupButton`，用于查找表按钮。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  lookupButton(button: DuiCardButton): ComponentBase {
    let c: ComponentBase;
    if (isString(button)) {
      if (button === '-') {
        c = this.createComponent({
          xtype: 'divider',
          vertical: true
        });
      } else {
        if (button === ' ') {
          c = this.createComponent({
            xtype: 'tbspacer',
            width: 2
          });
        } else {
          if (button === '->') {
            c = this.createComponent({
              xtype: 'tbfill'
            });
          } else {
            c = this.createComponent({
              xtype: 'tbtext',
              text: button
            });
          }
        }
      }
      this.applyDefaults(c);
    } else {
      c = this.createComponent(button);
    }
    return c;
  }


  /**
   * Executes `_addButtons` to handle add buttons.
   * @zh 执行 `_addButtons`，用于添加按钮。
   * @param buttons - buttons parameter (`DuiCardButton[]`) / 按钮参数（`DuiCardButton[]`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  protected _addButtons(buttons: DuiCardButton[], options?: DuiConfig): void {
    if(this.actionbar){
      this.actionbar.clear()
    } ;
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (typeof b !== 'string' && b.xtype) {
        this.addButton(b, options);
      }
    }
  }

  /**
   * Executes `addButton` to handle add button.
   * @zh 执行 `addButton`，用于添加按钮。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  addButton(config: DuiConfig, options?: DuiConfig): void {
    Dui.apply(config, options);
    this._addButton(this.actionbar, this.actionButtons, config);
  }

  /**
   * Executes `_addButton` to handle add button.
   * @zh 执行 `_addButton`，用于添加按钮。
   * @param container - container parameter (`ViewContainerRef`) / 容器参数（`ViewContainerRef`）
   * @param buttons - buttons parameter (`ComponentBase[]`) / 按钮参数（`ComponentBase[]`）
   * @param config - config parameter (`DuiCardButton`) / 配置参数（`DuiCardButton`）
   */
  private _addButton(container: ViewContainerRef, buttons: ComponentBase[], config: DuiCardButton): void {
    const component: ComponentBase = this.lookupButton(config);
    component.ownerCt = this;
    const index = buttons.length;
    buttons.push(component);
    if (container != undefined) {
      container.insert(component.reference.hostView, index);
    }
  }

  /**
   * Executes `_createTopLeftToolbar` to handle create top left toolbar.
   * @zh 执行 `_createTopLeftToolbar`，用于创建顶部位置左侧位置工具栏。
   * @param buttons - buttons parameter (`DuiCardButton[]`) / 按钮参数（`DuiCardButton[]`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  protected _createTopLeftToolbar(buttons: DuiCardButton[], options?: DuiConfig): void {
    if(this.lefttopbar) this.lefttopbar.clear();
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (typeof b !== 'string' && b.xtype) {
      this.addLeftTopButton(b, options);
      }
    }
  }

  /**
   * Executes `addLeftTopButton` to handle add left top button.
   * @zh 执行 `addLeftTopButton`，用于添加左侧位置顶部位置按钮。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  public addLeftTopButton(config: DuiConfig, options?: DuiConfig): void {
    Dui.apply(config, options);
    this._addButton(this.lefttopbar, this.ltButtons, config);
  }

  /**
   * Executes `_createTopRightToolbar` to handle create top right toolbar.
   * @zh 执行 `_createTopRightToolbar`，用于创建顶部位置右侧位置工具栏。
   * @param buttons - buttons parameter (`DuiCardButton[]`) / 按钮参数（`DuiCardButton[]`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  protected _createTopRightToolbar(buttons: DuiCardButton[], options?: DuiConfig): void {
    if(this.righttopbar) this.righttopbar.clear();
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (typeof b !== 'string' && b.xtype) {
      this.addRightTopButton(b, options);
      }
    }
  }

  /**
   * Executes `addRightTopButton` to handle add right top button.
   * @zh 执行 `addRightTopButton`，用于添加右侧位置顶部位置按钮。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  public addRightTopButton(config: DuiConfig, options?: DuiConfig): void {
    Dui.apply(config, options);

    this._addButton(this.righttopbar, this.rtButtons, config);
  }

  /**
   * Executes `_createFbar` to handle create fbar.
   * @zh 执行 `_createFbar`，用于创建Fbar。
   * @param config - config parameter (`DuiCardButton | DuiCardButton[]`) / 配置参数（`DuiCardButton | DuiCardButton[]`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  _createFbar(config: DuiCardButton | DuiCardButton[], options?: DuiConfig): void {
    if(this.righbottomfab) this.righbottomfab.clear();
    if(this.rightopfab) this.rightopfab.clear();
    if (Array.isArray(config)) {
      for (let i = 0; i < config.length; i++) {
        const b = config[i];
        if (typeof b !== 'string' && b.xtype) {
        this.addFabButton(b, options);
        }
      }
      // if (config.length == 1) {
      //   this.addFabButton(config[0], options);
      // } else {
      //   let conf: any = {
      //     xtype: "speeddial",
      //     icon: 'menu',
      //     open: false,
      //     direction: 'left',
      //     items: config
      //   };
      //   this.addFabButton(conf, options);
      // }
    } else if (typeof config !== 'string') {
      this.addFabButton(config, options);
    }
  }

  /**
   * Executes `addFabButton` to handle add fab button.
   * @zh 执行 `addFabButton`，用于添加Fab按钮。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   * @param options - options parameter (`DuiConfig`) / 配置选项参数（`DuiConfig`）
   */
  public addFabButton(config: DuiConfig, options?: DuiConfig): void {
    Dui.apply(config, options);
    let location = this.righbottomfab;
    if (this.fabLocation === 'top') {
      location = this.rightopfab;
    }
    this._addButton(location, this.fButtons, config);
  }

  /**
   * Returns the {@link Dui.ui.Toolbar toolbar} from the footer (<code>{@link #fbar}</code>) section of the panel.
   *  The toolbar

   * @zh 执行 `getButtons`，用于获取按钮。
   */
  getButtons(): ComponentBase[] {
    return this.actionButtons;
  }


  /**
   * Executes `getLtButtons` to handle get lt buttons.
   * @zh 执行 `getLtButtons`，用于获取Lt按钮。
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  getLtButtons(): ComponentBase[] {
    return this.ltButtons;
  }


  /**
   * Executes `getRtButtons` to handle get rt buttons.
   * @zh 执行 `getRtButtons`，用于获取Rt按钮。
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  getRtButtons(): ComponentBase[] {
    return this.rtButtons;
  }


  /**
   * Executes `getFabButtons` to handle get fab buttons.
   * @zh 执行 `getFabButtons`，用于获取Fab按钮。
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  getFabButtons(): ComponentBase[] {
    return this.fButtons;
  }


  /**
   * Executes `getAllButtons` to handle get all buttons.
   * @zh 执行 `getAllButtons`，用于获取全部按钮。
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  getAllButtons(): Array<ComponentBase> {
    const allButtons = concat(this.ltButtons, this.rtButtons, this.actionButtons, this.fButtons);
    return allButtons;
  }


  /**
   * Executes `getButtonMenus` to handle get button menus.
   * @zh 执行 `getButtonMenus`，用于获取按钮菜单。
   * @param buttons - buttons parameter (`ComponentBase[]`) / 按钮参数（`ComponentBase[]`）
   * @returns Result of type `ComponentBase[]` / 类型为 `ComponentBase[]` 的返回值
   */
  getButtonMenus(buttons?: ComponentBase[]): Array<ComponentBase> {
    if (isUndefined(buttons)) {
      buttons = concat(this.ltButtons, this.rtButtons, this.actionButtons, this.fButtons);
    }
    return buttons;
  }
}
