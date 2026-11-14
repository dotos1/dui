/**
 * @fileoverview Module `src/ux/editor/modules/menu/menu.component.ts` providing menu component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/menu.component.ts`，提供菜单组件相关的定义与实现。
 */

import {
  Component, Input,
  OnInit, TemplateRef,
} from '@angular/core';


import { Toolbar, ToolbarItem, ToolbarDropdown } from '../../types';
import { MenuService } from './menu.service';
import { Editor } from '../../Editor';
import EditorError from '../../utils/error';

/**
 * Constant/variable `DEFAULT_TOOLBAR` defining default toolbar in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `DEFAULT_TOOLBAR`，定义 `src/ux/editor/modules/menu` 中的默认工具栏。
 */
export const DEFAULT_TOOLBAR: Toolbar = [
  ['bold', 'italic'],
  ['code', 'blockquote'],
  ['underline', 'strike'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
  ['format_clear'],
];

/**
 * Constant/variable `TOOLBAR_MINIMAL` defining toolbar minimal in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `TOOLBAR_MINIMAL`，定义 `src/ux/editor/modules/menu` 中的工具栏MINIMAL。
 */
export const TOOLBAR_MINIMAL: Toolbar = [
  ['bold', 'italic'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
];

/**
 * Constant/variable `TOOLBAR_FULL` defining toolbar full in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `TOOLBAR_FULL`，定义 `src/ux/editor/modules/menu` 中的工具栏完整。
 */
export const TOOLBAR_FULL: Toolbar = [
  ['bold', 'italic'],
  ['code', 'blockquote'],
  ['underline', 'strike'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
  ['horizontal_rule'],
];

/**
 * Constant/variable `DEFAULT_COLOR_PRESETS` defining default color presets in `src/ux/editor/modules/menu`.
 * @zh 常量/变量 `DEFAULT_COLOR_PRESETS`，定义 `src/ux/editor/modules/menu` 中的默认颜色PRESETS。
 */
const DEFAULT_COLOR_PRESETS = [
 '#000000',
  '#434343',
  '#666666',
  '#999999',
'#b7b7b7',
'#cccccc',
'#d9d9d9',
'#efefef',
'#f3f3f3',
'#FFFFFF',

'#980000',
'#FF0000',
'#FF9900',
'#FFFF00',
'#00FF00',
'#00FFFF',
'#4A86E8',
'#0000FF',
'#9900FF',
'#FF00FF',

'#E6B8AF',
'#F4CCCC',
'#FCE5CD',
'#FFF2CC',
'#D9EAD3',
'#D0E0E3',
'#C9DAF8',
'#CFE2F3',
'#D9D2F9',
'#EAD1DC',

'#DD7E68',
'#EA9999',
'#F9CB9C',
'#FFE599',
'#B6D7A8',
'#A2C4C9',
'#A4C2F4',
'#9FC5E8',
'#B4A7D6',
'#D5A6BD',

'#CC4125',
'#E06666',
'#F6B26B',
'#FFD966',
'#93C47D',
'#76A5AF',
'#6D9EEB',
'#6FA8DC',
'#8E7CC3',
'#C27BA0',

'#A61C00',
'#CC0000',
'#E69138',
'#F1C232',
'#6AA84F',
'#45818E',
'#3C78D8',
'#3D85C6',
'#674EA7',
'#A64D79',

'#85200C',
'#990000',
'#B45F06',
'#BF9000',
'#38761D',
'#134F5C',
'#1155CC',
'#0B5394',
'#351C75',
'#741B47',

'#5B0F00',
'#660000',
'#783F04',
'#7F6000',
'#274E13',
'#0C343D',
'#1C4587',
'#073763',
'#20124D',
'#4C1130',
];


/**
 * Angular component `MenuComponent` (selector: 'ux-editor-menu') providing menu component presentation and interaction in `src/ux/editor/modules/menu`.
 * @zh Angular 组件 `MenuComponent`（selector: 'ux-editor-menu'），提供菜单组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu`）。
 */
@Component({
  selector: 'ux-editor-menu',
  templateUrl: './menu.component.html',
  providers: [MenuService],
  standalone: false,
  
})

export class MenuComponent implements OnInit {
  /**
   * Input property `toolbar` (`Toolbar`) configuring toolbar (default: `TOOLBAR_MINIMAL`).
   * @zh 输入属性 `toolbar`（类型：`Toolbar`），用于配置工具栏（默认值：`TOOLBAR_MINIMAL`）。
   */
  @Input() toolbar: Toolbar = TOOLBAR_MINIMAL;
  /**
   * Input property `colorPresets` (`string[]`) configuring color presets (default: `DEFAULT_COLOR_PRESETS`).
   * @zh 输入属性 `colorPresets`（类型：`string[]`），用于配置颜色Presets（默认值：`DEFAULT_COLOR_PRESETS`）。
   */
  @Input() colorPresets: string[] = DEFAULT_COLOR_PRESETS;
  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
   */
  @Input() disabled = false;
  /**
   * Input property `editor` (`Editor`) configuring editor.
   * @zh 输入属性 `editor`（类型：`Editor`），用于配置编辑器。
   */
  @Input() editor: Editor;
  /**
   * Input property `customMenuRef` (`any`) configuring custom menu ref (default: `null`).
   * @zh 输入属性 `customMenuRef`（类型：`any`），用于配置自定义菜单引用（默认值：`null`）。
   */
  @Input() customMenuRef = null;
  /**
   * Input property `dropdownPlacement` (`"top" | "bottom"`) configuring dropdown placement (default: `'bottom'`).
   * @zh 输入属性 `dropdownPlacement`（类型：`"top" | "bottom"`），用于配置下拉框Placement（默认值：`'bottom'`）。
   */
  @Input() dropdownPlacement: 'top' | 'bottom' = 'bottom';

  /**
   * Property `toggleCommands` (`ToolbarItem[]`) storing toggle commands.
   * @zh 属性 `toggleCommands`（类型：`ToolbarItem[]`），用于存储或配置开关命令。
   */
  toggleCommands: ToolbarItem[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    'code',
    'blockquote',
    'ordered_list',
    'bullet_list',
    'align_left',
    'align_center',
    'align_right',
    'align_justify',
  ];

  /**
   * Property `insertCommands` (`ToolbarItem[]`) storing insert commands (default: `[ 'horizontal_rule', 'format_clear', ]`).
   * @zh 属性 `insertCommands`（类型：`ToolbarItem[]`），用于存储或配置插入命令（默认值：`[ 'horizontal_rule', 'format_clear', ]`）。
   */
  insertCommands: ToolbarItem[] = [
    'horizontal_rule',
    'format_clear',
  ];

  /**
   * Property `iconContainerClass` (`string[]`) storing icon container class.
   * @zh 属性 `iconContainerClass`（类型：`string[]`），用于存储或配置图标容器类名。
   */
  iconContainerClass = ['Editor__MenuItem', 'Editor__MenuItem--Icon'];
  /**
   * Property `dropdownContainerClass` (`string[]`) storing dropdown container class (default: `['Editor__Dropdown']`).
   * @zh 属性 `dropdownContainerClass`（类型：`string[]`），用于存储或配置下拉框容器类名（默认值：`['Editor__Dropdown']`）。
   */
  dropdownContainerClass = ['Editor__Dropdown'];
  /**
   * Property `seperatorClass` (`string[]`) storing seperator class (default: `['Editor__Seperator']`).
   * @zh 属性 `seperatorClass`（类型：`string[]`），用于存储或配置seperator类名（默认值：`['Editor__Seperator']`）。
   */
  seperatorClass = ['Editor__Seperator'];

  /**
   * Creates an instance of `MenuComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MenuComponent` 实例，并初始化其依赖项与内部状态。
   * @param menuService - Injected or initial menu service (`MenuService`) / 注入或传入的菜单服务（`MenuService`）
   */
  constructor(private menuService: MenuService) { }

  /**
   * Gets the current presets (`presets: string[][]`).
   * @zh 获取当前presets（`presets: string[][]`）。
   */
  get presets(): string[][] {
    const col = 8;
    const colors: string[][] = [];

    this.colorPresets.forEach((color, index) => {
      const row = Math.floor(index / col);

      if (!colors[row]) {
        colors.push([]);
      }

      colors[row].push(color);
    });

    return colors;
  }

  /**
   * Executes `trackByIndex` to handle track by index.
   * @zh 执行 `trackByIndex`，用于跟踪按索引。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Executes `isDropDown` to handle is drop down.
   * @zh 执行 `isDropDown`，用于是否为放置向下。
   * @param item - item parameter (`ToolbarItem`) / 条目参数（`ToolbarItem`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isDropDown(item: ToolbarItem): boolean {
    if ((item as ToolbarDropdown)?.heading) {
      return true;
    }

    return false;
  }

  /**
   * Executes `getDropdownItems` to handle get dropdown items.
   * @zh 执行 `getDropdownItems`，用于获取下拉框条目列表。
   * @param item - item parameter (`ToolbarItem`) / 条目参数（`ToolbarItem`）
   * @returns Result of type `ToolbarDropdown` / 类型为 `ToolbarDropdown` 的返回值
   */
  getDropdownItems(item: ToolbarItem): ToolbarDropdown {
    return item as ToolbarDropdown;
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (!this.editor) {
      throw new EditorError('Required editor instance to initialize menu component');
    }

    this.menuService.editor = this.editor;
  }
}
