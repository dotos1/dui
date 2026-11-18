/**
 * @fileoverview Module `src/ui/toolbar/toolbar.component.ts` providing toolbar component definitions and implementation.
 * @zh 模块文件 `src/ui/toolbar/toolbar.component.ts`，提供工具栏组件相关的定义与实现。
 */

import { DuiConfig, DuiStyle } from '@dotos1/dui/base';
import { Platform } from '@angular/cdk/platform';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Injector, Input, OnChanges, Renderer2, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Container, ContainerItem } from '@dotos1/dui/container';
import { ComponentBase, Dui } from '@dotos1/dui/core';
import { isArray, isObjectLike, isString } from 'lodash-es';

/**
 * Angular component `DuiToolbarComponent` (selector: 'dui-toolbar') providing dui toolbar component presentation and interaction in `src/ui/toolbar`.
 * @zh Angular 组件 `DuiToolbarComponent`（selector: 'dui-toolbar'），提供DUI工具栏组件的视图渲染与交互逻辑（位于 `src/ui/toolbar`）。
 */
@Component({
  selector: 'dui-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})

export class DuiToolbarComponent extends Container implements OnChanges, AfterContentInit {

  /**
   * Input property `config` (`DuiConfig | (string | object | DuiConfig)[]`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig | (string | object | DuiConfig)[]`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig | Array<DuiConfig | object | string> = {};

  /**
   * Input property `height` (`number`) configuring height (default: `40`).
   * @zh 输入属性 `height`（类型：`number`），用于配置高度（默认值：`40`）。
   */
  @Input() height: number = 40;

  /**
   * Gets the current height style (`heightStyle: any`).
   * @zh 获取当前高度样式（`heightStyle: any`）。
   */
  get heightStyle() {
    if (this.vertical) {
      return {}
    } else {
      return {
        height: this.height + 'px'
      }
    }

  }

  /**
   * Property `activeMenuBtn` (`any`) storing active menu btn.
   * @zh 属性 `activeMenuBtn`（类型：`any`），用于存储或配置激活菜单按钮。
   */
  private activeMenuBtn;

  /**
   * Property `color` (`string`) storing color (default: `'primary'`).
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色（默认值：`'primary'`）。
   */
  public color = 'primary';

  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  declare public style;

  /**
   * Property `vertical` (`boolean`) storing vertical (default: `false`).
   * @zh 属性 `vertical`（类型：`boolean`），用于存储或配置垂直（默认值：`false`）。
   */
  public vertical: boolean = false;

  /**
   * Template/content query reference `viewContainer` (`ViewContainerRef`) targeting view container.
   * @zh 模板/内容视图查询引用 `viewContainer`（`@ViewChild`），指向视图容器。
   */
  @ViewChild('toolbar', { read: ViewContainerRef, static: true }) public override viewContainer: ViewContainerRef = undefined;

  /**
   * Host event listener `onRightClick` handling `contextmenu` events for on right click.
   * @zh 宿主事件监听方法 `onRightClick`，响应 `contextmenu` 事件以处理当右侧位置点击。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  /**
   * Creates an instance of `DuiToolbarComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DuiToolbarComponent` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(public _element: ElementRef,
    protected renderer: Renderer2,
    public _platform: Platform,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,) {
    super(injector, detectRef);
  }

  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh() {
    this.detectRef.markForCheck();
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
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    if (Array.isArray(config)) {
      config = { items: config };
    } else {
      config = Dui.apply({}, config);
      if (config.buttons) {
        config.items = config.buttons;
      }
    }
    super.init(config);
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    this.addConfiguredItems();
  }

  /**
   * Executes `getClassNames` to handle get class names.
   * @zh 执行 `getClassNames`，用于获取类名名称列表。
   */
  getClassNames() {
    return this.vertical ? 'toolbar-vertical' : 'toolbar-horizontal';
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  override ngAfterContentInit() {
    super.ngAfterContentChecked();
  }

  /**
   * Executes `lookupComponent` to handle lookup component.
   * @zh 执行 `lookupComponent`，用于查找表组件。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  override lookupComponent(c) {
    if (isString(c)) {
      if (c == '-') {
        c = this.createComponent({
          xtype: 'divider',
          vertical: true
        });
      } else {
        if (c == ' ') {
          c = this.createComponent({
            xtype: 'tbspacer',
            width: 2
          });
        } else {
          if (c == '->') {
            c = this.createComponent({
              xtype: 'tbfill'
            });
          } else {
            c = this.createComponent({
              xtype: 'tbtext',
              text: c
            });
          }
        }
      }
      this.applyDefaults(c);
    } else {
      if (c.isField || c.render) {
        c = this.createComponent(c);
      } else {
        if (c.tag) {
          c = new MenuItem(this.detectRef);
          c.init({ autoEl: c });
        } else {
          if (c.tagName) {
            c = new MenuItem(this.detectRef);
            c.init({ el: c });
          } else {
            if (isObjectLike(c)) {
              c = c.xtype ? this.createComponent(c) : this.constructButton(c);
            }
          }
        }
      }
    }
    return c;
  }

  /**
   * Executes `addSeparator` to handle add separator.
   * @zh 执行 `addSeparator`，用于添加Separator。
   * @returns Result of type `MenuItem` / 类型为 `MenuItem` 的返回值
   */
  addSeparator(): MenuItem {
    let comp = this.createComponent({
      xtype: 'separator',
      vertical: true
    });
    return this.add(comp) as MenuItem;
  }

  /**
   * Executes `addSpacer` to handle add spacer.
   * @zh 执行 `addSpacer`，用于添加Spacer。
   * @returns Result of type `Spacer` / 类型为 `Spacer` 的返回值
   */
  addSpacer(): Spacer {
    let comp = this.createComponent({
      xtype: 'spacer',
      width: 2
    });
    return this.add(comp) as Spacer;
  }

  /**
   * Executes `addFill` to handle add fill.
   * @zh 执行 `addFill`，用于添加填充。
   */
  addFill() {
    let comp = this.createComponent({
      xtype: 'tbfill'
    });
    this.add(comp);
  }

  /**
   * Executes `addText` to handle add text.
   * @zh 执行 `addText`，用于添加文本。
   * @param text - text parameter (`string`) / 文本参数（`string`）
   * @returns Result of type `MenuItem` / 类型为 `MenuItem` 的返回值
   */
  addText(text: string): MenuItem {
    let comp = this.createComponent({
      xtype: 'tbtext',
      text: text
    });
    return this.add(comp) as MenuItem;
  }

  /**
   * Executes `addButton` to handle add button.
   * @zh 执行 `addButton`，用于添加按钮。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   * @returns Result of type `any[] | ComponentBase` / 类型为 `any[] | ComponentBase` 的返回值
   */
  addButton(config) {
    if (isArray(config)) {
      let buttons = [];
      for (let i = 0, len = config.length; i < len; i++) {
        buttons.push(this.addButton(config[i]));
      }
      return buttons;
    }
    return this.add(this.constructButton(config));
  }


  /**
   * Executes `addItem` to handle add item.
   * @zh 执行 `addItem`，用于添加条目。
   * @param item - item parameter (`MenuItem`) / 条目参数（`MenuItem`）
   * @returns Result of type `MenuItem` / 类型为 `MenuItem` 的返回值
   */
  addItem(item: MenuItem): MenuItem {
    return this.add(item) as MenuItem;
  }

  /**
   * Executes `addField` to handle add field.
   * @zh 执行 `addField`，用于添加字段。
   * @param field - field parameter (`ContainerItem`) / 字段参数（`ContainerItem`）
   * @returns Result of type `MenuItem` / 类型为 `MenuItem` 的返回值
   */
  addField(field: ContainerItem): MenuItem {
    return this.add(field) as MenuItem;
  }

  /**
   * Executes `insertButton` to handle insert button.
   * @zh 执行 `insertButton`，用于插入按钮。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @returns Result of type `any[] | ComponentBase` / 类型为 `any[] | ComponentBase` 的返回值
   */
  insertButton(index: number, item) {
    if (isArray(item)) {
      let buttons = [];
      for (let i = 0, len = item.length; i < len; i++) {
        buttons.push(this.insertButton(index + i, item[i]));
      }
      return buttons;
    }
    return super.insert(index, item);
  }

  // private
  /**
   * Executes `constructButton` to handle construct button.
   * @zh 执行 `constructButton`，用于构造按钮。
   * @param item - item parameter (`any`) / 条目参数（`any`）
   */
  constructButton(item) {
    if (item && !item.events && !item.xtype) {
      item = Dui.apply({ xtype: 'dui-button' }, item);
    }
    let b = item.events ? item : this.createComponent(item);
    return b;
  }

  // private
  /**
   * Executes `onAdd` to handle on add.
   * @zh 执行 `onAdd`，用于当添加。
   * @param c - c parameter (`ComponentBase`) / c参数（`ComponentBase`）
   */
  override onAdd(c: ComponentBase): void {
    super.onAdd(c);
    if (this.disabled) {
      c.disable = true;
    }
  }

  // private
  /**
   * Executes `onRemove` to handle on remove.
   * @zh 执行 `onRemove`，用于当移除。
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  override onRemove(c) {
    super.onRemove();
    if (c == this.activeMenuBtn) {
      delete this.activeMenuBtn;
    }
  }

  // private
  /**
   * Executes `onDisable` to handle on disable.
   * @zh 执行 `onDisable`，用于当禁用。
   */
  onDisable(): void {
    this.items.each(
      function (item: ComponentBase) {
        item.disable = true;
      });
  }

  // private
  /**
   * Executes `onEnable` to handle on enable.
   * @zh 执行 `onEnable`，用于当启用。
   */
  onEnable(): void {
    this.items.each(
      function (item: ComponentBase) {
        item.disable = false;
      });
  }

  // private
  /**
   * Executes `onButtonTriggerOver` to handle on button trigger over.
   * @zh 执行 `onButtonTriggerOver`，用于当按钮触发越过。
   * @param btn - btn parameter (`any`) / 按钮参数（`any`）
   */
  onButtonTriggerOver(btn) {
    if (this.activeMenuBtn && this.activeMenuBtn != btn) {
      this.activeMenuBtn.hideMenu();
      btn.showMenu();
      this.activeMenuBtn = btn;
    }
  }

  // private
  /**
   * Executes `onButtonMenuShow` to handle on button menu show.
   * @zh 执行 `onButtonMenuShow`，用于当按钮菜单显示。
   * @param btn - btn parameter (`any`) / 按钮参数（`any`）
   */
  onButtonMenuShow(btn) {
    this.activeMenuBtn = btn;
  }

  // private
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onButtonMenuHide` to handle on button menu hide.
   * @zh 执行 `onButtonMenuHide`，用于当按钮菜单隐藏。
   * @param btn - btn parameter (`any`) / 按钮参数（`any`）
   */
  onButtonMenuHide(btn) {
    delete this.activeMenuBtn;
  }
}


/**
 * Class `MenuItem` encapsulating menu item data structures and logic in `src/ui/toolbar`.
 * @zh 类 `MenuItem`，封装 `src/ui/toolbar` 中的菜单条目数据结构与处理逻辑。
 */
export class MenuItem extends ComponentBase {
  /**
   * Property `hideParent` (`boolean`) storing hide parent (default: `true`).
   * @zh 属性 `hideParent`（类型：`boolean`），用于存储或配置隐藏父级（默认值：`true`）。
   */
  public hideParent = true;
  /**
   * Creates an instance of `MenuItem` and initializes its dependencies and internal state.
   * @zh 创建 `MenuItem` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    //    this.el = _element.nativeElement;
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config)
  };

  /**
   * Executes `focus` to handle focus.
   * @zh 执行 `focus`，用于聚焦。
   */
  public focus() { return this };
}


/**
 * Angular component `Separator` (selector: 'divider') providing separator presentation and interaction in `src/ui/toolbar`.
 * @zh Angular 组件 `Separator`（selector: 'divider'），提供Separator的视图渲染与交互逻辑（位于 `src/ui/toolbar`）。
 */
@Component({
  selector: 'divider',
  template: "<mat-divider [vertical]='vertical' [ngStyle]='style'></mat-divider>",
  styleUrls: ['./separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class Separator extends MenuItem {
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `vertical` (`boolean`) storing vertical (default: `true`).
   * @zh 属性 `vertical`（类型：`boolean`），用于存储或配置垂直（默认值：`true`）。
   */
  vertical: boolean = true;
  /**
   * Property `style` (`DuiStyle`) storing style (default: `{}`).
   * @zh 属性 `style`（类型：`DuiStyle`），用于存储或配置样式（默认值：`{}`）。
   */
  public override style: DuiStyle = {};
  /**
   * Creates an instance of `Separator` and initializes its dependencies and internal state.
   * @zh 创建 `Separator` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
  }
}

/**
 * Angular component `Spacer` (selector: 'tbspacer') providing spacer presentation and interaction in `src/ui/toolbar`.
 * @zh Angular 组件 `Spacer`（selector: 'tbspacer'），提供Spacer的视图渲染与交互逻辑（位于 `src/ui/toolbar`）。
 */
@Component({
  selector: 'tbspacer',
  template: `
        <div  [style.width]="config.width + 'px'" ></div>
     `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class Spacer extends MenuItem {
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Property `config` (`any`) storing config.
   * @zh 属性 `config`（类型：`any`），用于存储或配置配置。
   */
  config;
  /**
   * Creates an instance of `Spacer` and initializes its dependencies and internal state.
   * @zh 创建 `Spacer` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    this.config = config;
    super.init(config);
  }
}

/**
 * Angular component `Fill` (selector: 'tbfill') providing fill presentation and interaction in `src/ui/toolbar`.
 * @zh Angular 组件 `Fill`（selector: 'tbfill'），提供填充的视图渲染与交互逻辑（位于 `src/ui/toolbar`）。
 */
@Component({
  selector: 'tbfill',
  template: '<span></span>',
  styles: [`
       :host {
          flex: 1 1 auto;
          padding-left:20px;
          padding-right:20px;
        }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class Fill extends Spacer {
  /**
   * Creates an instance of `Fill` and initializes its dependencies and internal state.
   * @zh 创建 `Fill` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
  }
  /**
   * Property `isFill` (`boolean`) storing is fill (default: `true`).
   * @zh 属性 `isFill`（类型：`boolean`），用于存储或配置是否为填充（默认值：`true`）。
   */
  public isFill = true;
}

/**
 * Angular component `TextItem` (selector: 'tbtext') providing text item presentation and interaction in `src/ui/toolbar`.
 * @zh Angular 组件 `TextItem`（selector: 'tbtext'），提供文本条目的视图渲染与交互逻辑（位于 `src/ui/toolbar`）。
 */
@Component({
  selector: 'tbtext',
  template: "<span>{{text}}</span>",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TextItem extends MenuItem {
  /**
   * Property `text` (`any`) storing text.
   * @zh 属性 `text`（类型：`any`），用于存储或配置文本。
   */
  text;
  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;
  /**
   * Creates an instance of `TextItem` and initializes its dependencies and internal state.
   * @zh 创建 `TextItem` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(private _element: ElementRef, public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    this.el = _element.nativeElement;
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(isString(config) ? { text: config } : config);
  }
  /**
   * Executes `setText` to handle set text.
   * @zh 执行 `setText`，用于集合文本。
   * @param t - t parameter (`string`) / t参数（`string`）
   */
  setText(t: string) {
    this.text = t;
  }
}
