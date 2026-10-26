/**
 * @fileoverview Module `src/ux/editor/types.ts` providing types definitions and implementation.
 * @zh 模块文件 `src/ux/editor/types.ts`，提供类型列表相关的定义与实现。
 */

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { LocalsKeys } from './Locals';

/**
 * Type alias `TCR` representing tcr (`{ dom: HTMLElement; update: (state: EditorState) => void; }`).
 * @zh 类型别名 `TCR`，表示TCR（`{ dom: HTMLElement; update: (state: EditorState) => void; }`）。
 */
type TCR = {
  /**
   * Property `dom` (`HTMLElement`) storing dom.
   * @zh 属性 `dom`（类型：`HTMLElement`），用于存储或配置DOM节点。
   */
  dom: HTMLElement;
  /**
   * Property `update` (`(state: EditorState) => void`) storing update.
   * @zh 属性 `update`（类型：`(state: EditorState) => void`），用于存储或配置更新。
   */
  update: (state: EditorState) => void;
};

/**
 * Type alias `TBHeadingItems` representing tb heading items (`'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`).
 * @zh 类型别名 `TBHeadingItems`，表示TBHeading条目列表（`'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`）。
 */
export type TBHeadingItems = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
/**
 * Type alias `TBItems` representing tb items (`'bold' | 'italic' | 'code' | 'blockquote' | 'underline' | 'strike' | '...`).
 * @zh 类型别名 `TBItems`，表示TB条目列表（`'bold' | 'italic' | 'code' | 'blockquote' | 'underline' | 'strike' | '...`）。
 */
export type TBItems = 'bold'
| 'italic'
| 'code'
| 'blockquote'
| 'underline'
| 'strike'
| 'ordered_list'
| 'bullet_list'
| 'link'
| 'image'
| 'text_color'
| 'background_color'
| 'align_left'
| 'align_center'
| 'align_right'
| 'align_justify'
| 'horizontal_rule'
| 'format_clear';

/**
 * Type alias `ToolbarDropdown` representing toolbar dropdown (`{ heading?: TBHeadingItems[] }`).
 * @zh 类型别名 `ToolbarDropdown`，表示工具栏下拉框（`{ heading?: TBHeadingItems[] }`）。
 */
export type ToolbarDropdown = { heading?: TBHeadingItems[] };
/**
 * Type alias `ToolbarCustomMenuItem` representing toolbar custom menu item (`(editorView: EditorView) => TCR`).
 * @zh 类型别名 `ToolbarCustomMenuItem`，表示工具栏自定义菜单条目（`(editorView: EditorView) => TCR`）。
 */
export type ToolbarCustomMenuItem = (editorView: EditorView) => TCR;
/**
 * Type alias `ToolbarDropdownGroupKeys` representing toolbar dropdown group keys (`keyof ToolbarDropdown`).
 * @zh 类型别名 `ToolbarDropdownGroupKeys`，表示工具栏下拉框分组键列表（`keyof ToolbarDropdown`）。
 */
export type ToolbarDropdownGroupKeys = keyof ToolbarDropdown;
/**
 * Type alias `ToolbarDropdownGroupValues` representing toolbar dropdown group values (`ToolbarDropdown[ToolbarDropdownGroupKeys]`).
 * @zh 类型别名 `ToolbarDropdownGroupValues`，表示工具栏下拉框分组值列表（`ToolbarDropdown[ToolbarDropdownGroupKeys]`）。
 */
export type ToolbarDropdownGroupValues = ToolbarDropdown[ToolbarDropdownGroupKeys];
/**
 * Type alias `ToolbarItem` representing toolbar item (`TBItems | ToolbarDropdown | ToolbarCustomMenuItem`).
 * @zh 类型别名 `ToolbarItem`，表示工具栏条目（`TBItems | ToolbarDropdown | ToolbarCustomMenuItem`）。
 */
export type ToolbarItem = TBItems | ToolbarDropdown | ToolbarCustomMenuItem;
/**
 * Type alias `Toolbar` representing toolbar (`Array<ToolbarItem[]>`).
 * @zh 类型别名 `Toolbar`，表示工具栏（`Array<ToolbarItem[]>`）。
 */
export type Toolbar = Array<ToolbarItem[]>;

/**
 * Interface `EditorConfig` defining the contract and properties for editor config.
 * @zh 接口 `EditorConfig`，定义编辑器配置的数据结构契约与属性规范。
 */
export interface EditorConfig {
  /**
   * Property `locals` (`Partial<Record<LocalsKeys, string>>`) storing locals.
   * @zh 属性 `locals`（类型：`Partial<Record<LocalsKeys, string>>`），用于存储或配置本地。
   */
  locals?: Partial<Record<LocalsKeys, string>>;
}
