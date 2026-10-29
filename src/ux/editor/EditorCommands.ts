/**
 * @fileoverview Module `src/ux/editor/EditorCommands.ts` providing editor commands definitions and implementation.
 * @zh 模块文件 `src/ux/editor/EditorCommands.ts`，提供编辑器命令相关的定义与实现。
 */

import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  chainCommands, createParagraphNear, liftEmptyBlock,
  newlineInCode, splitBlock,
} from 'prosemirror-commands';
import { DOMParser } from 'prosemirror-model';


import MarkCommand from './commands/Mark';
import ListCommand from './commands/ListItem';
import LinkCommand, { LinkAttrs } from './commands/Link';
import HeadingCommand, { HeadingLevels } from './commands/Heading';
import ImageCommand, { ImageAttrs } from './commands/Image';
import TextColorCommand from './commands/TextColor';
import TextAlignCommand, { Align } from './commands/TextAlign';
import EditorError from './utils/error';

/**
 * Constant/variable `execMark` defining exec mark in `src/ux/editor`.
 * @zh 常量/变量 `execMark`，定义 `src/ux/editor` 中的执行标记。
 */
const execMark = (name: string, toggle = false) => {
  return (state: EditorState, dispatch: (tr: Transaction) => void) => {
    const command = new MarkCommand(name);

    if (!toggle) {
      return command.apply()(state, dispatch);
    }

    return command.toggle()(state, dispatch);
  };
};
/**
 * Class `EditorCommands` encapsulating editor commands data structures and logic in `src/ux/editor`.
 * @zh 类 `EditorCommands`，封装 `src/ux/editor` 中的编辑器命令数据结构与处理逻辑。
 */
export default class EditorCommands {
  /**
   * Property `view` (`EditorView`) storing view.
   * @zh 属性 `view`（类型：`EditorView`），用于存储或配置视图。
   */
  private view: EditorView;
  /**
   * Property `state` (`EditorState`) storing state.
   * @zh 属性 `state`（类型：`EditorState`），用于存储或配置状态。
   */
  private state: EditorState;
  /**
   * Property `tr` (`Transaction`) storing tr.
   * @zh 属性 `tr`（类型：`Transaction`），用于存储或配置tr。
   */
  private tr: Transaction;

  /**
   * Creates an instance of `EditorCommands` and initializes its dependencies and internal state.
   * @zh 创建 `EditorCommands` 实例，并初始化其依赖项与内部状态。
   * @param view - Injected or initial view (`EditorView`) / 注入或传入的视图（`EditorView`）
   */
  constructor(view: EditorView) {
    if (!view) {
      throw new EditorError('Required view to initialize commands.');
    }

    this.view = view;
    this.state = view.state;
    this.tr = this.view.state.tr;
  }

  /**
   * Property `applyTrx` (`(tr?: Transaction) => void`) storing apply trx.
   * @zh 属性 `applyTrx`（类型：`(tr?: Transaction) => void`），用于存储或配置应用Trx。
   */
  private applyTrx = (tr?: Transaction) => {
    this.state = this.state.apply(tr ?? this.tr);
    this.tr = this.state.tr;
    this.tr.setMeta('APPLIED_TRX', true);
  };

  /**
   * Property `dispatch` (`(tr: Transaction) => void`) storing dispatch.
   * @zh 属性 `dispatch`（类型：`(tr: Transaction) => void`），用于存储或配置派发。
   */
  private dispatch = (tr: Transaction): void => {
    this.applyTrx(tr);
  };

  /**
   * Executes `exec` to handle exec.
   * @zh 执行 `exec`，用于执行。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  exec(): boolean {
    // No changes applied
    if (!this.tr.getMeta('APPLIED_TRX')) {
      return false;
    }

    const forceEmit = !this.view.state.doc.eq(this.state.doc);
    this.view.updateState(this.state);

    const tr = this.tr
      .setMeta('FORCE_EMIT', forceEmit);

    this.view.dispatch(tr);
    return true;
  }

  /**
   * Executes `focus` to handle focus.
   * @zh 执行 `focus`，用于聚焦。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  focus(): this {
    this.view.focus();
    return this;
  }

  /**
   * Executes `scrollIntoView` to handle scroll into view.
   * @zh 执行 `scrollIntoView`，用于滚动进入视图。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  scrollIntoView(): this {
    this.tr.scrollIntoView();
    this.applyTrx();
    return this;
  }

  /**
   * Executes `insertText` to handle insert text.
   * @zh 执行 `insertText`，用于插入文本。
   * @param text - text parameter (`string`) / 文本参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  insertText(text: string): this {
    this.tr.insertText(text);
    this.applyTrx();
    return this;
  }

  /**
   * Executes `insertNewLine` to handle insert new line.
   * @zh 执行 `insertNewLine`，用于插入新线段。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  insertNewLine(): this {
    const newLineCommands = [newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock];
    chainCommands(...newLineCommands)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `applyMark` to handle apply mark.
   * @zh 执行 `applyMark`，用于应用标记。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  applyMark(name: string): this {
    execMark(name, false)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleMark` to handle toggle mark.
   * @zh 执行 `toggleMark`，用于开关标记。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleMark(name: string): this {
    execMark(name, true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `bold` to handle bold.
   * @zh 执行 `bold`，用于bold。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  bold(): this {
    execMark('strong')(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleBold` to handle toggle bold.
   * @zh 执行 `toggleBold`，用于开关Bold。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleBold(): this {
    execMark('strong', true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `italics` to handle italics.
   * @zh 执行 `italics`，用于italics。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  italics(): this {
    execMark('em')(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleItalics` to handle toggle italics.
   * @zh 执行 `toggleItalics`，用于开关Italics。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleItalics(): this {
    execMark('em', true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `underline` to handle underline.
   * @zh 执行 `underline`，用于underline。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  underline(): this {
    execMark('u')(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleUnderline` to handle toggle underline.
   * @zh 执行 `toggleUnderline`，用于开关Underline。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleUnderline(): this {
    execMark('u', true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `strike` to handle strike.
   * @zh 执行 `strike`，用于strike。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  strike(): this {
    execMark('s')(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleStrike` to handle toggle strike.
   * @zh 执行 `toggleStrike`，用于开关Strike。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleStrike(): this {
    execMark('s', true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `code` to handle code.
   * @zh 执行 `code`，用于编码。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  code(): this {
    execMark('code')(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleCode` to handle toggle code.
   * @zh 执行 `toggleCode`，用于开关编码。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleCode(): this {
    execMark('code', true)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleOrderedList` to handle toggle ordered list.
   * @zh 执行 `toggleOrderedList`，用于开关已顺序列表。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleOrderedList(): this {
    const command = new ListCommand(false);
    command.toggle()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleBulletList` to handle toggle bullet list.
   * @zh 执行 `toggleBulletList`，用于开关Bullet列表。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleBulletList(): this {
    const command = new ListCommand(true);
    command.toggle()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `toggleHeading` to handle toggle heading.
   * @zh 执行 `toggleHeading`，用于开关Heading。
   * @param level - level parameter (`HeadingLevels`) / 层级参数（`HeadingLevels`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleHeading(level: HeadingLevels): this {
    const command = new HeadingCommand(level);
    command.toggle()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `insertLink` to handle insert link.
   * @zh 执行 `insertLink`，用于插入链接。
   * @param text - text parameter (`string`) / 文本参数（`string`）
   * @param attrs - attrs parameter (`LinkAttrs`) / 属性集合参数（`LinkAttrs`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  insertLink(text: string, attrs: LinkAttrs): this {
    const command = new LinkCommand();
    command.insert(text, attrs)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `updateLink` to handle update link.
   * @zh 执行 `updateLink`，用于更新链接。
   * @param attrs - attrs parameter (`LinkAttrs`) / 属性集合参数（`LinkAttrs`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  updateLink(attrs: LinkAttrs): this {
    const command = new LinkCommand();
    command.update(attrs)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `insertImage` to handle insert image.
   * @zh 执行 `insertImage`，用于插入图像。
   * @param src - src parameter (`string`) / 源路径参数（`string`）
   * @param attrs - attrs parameter (`ImageAttrs`) / 属性集合参数（`ImageAttrs`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  insertImage(src: string, attrs: ImageAttrs = {}): this {
    const command = new ImageCommand();
    command.insert(src, attrs)(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `textColor` to handle text color.
   * @zh 执行 `textColor`，用于文本颜色。
   * @param color - color parameter (`string`) / 颜色参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  textColor(color: string): this {
    const command = new TextColorCommand('text_color');
    command.apply({ color })(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `backgroundColor` to handle background color.
   * @zh 执行 `backgroundColor`，用于背景颜色。
   * @param color - color parameter (`string`) / 颜色参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  backgroundColor(color: string): this {
    const command = new TextColorCommand('text_background_color');
    command.apply({ backgroundColor: color })(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `removeTextColor` to handle remove text color.
   * @zh 执行 `removeTextColor`，用于移除文本颜色。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  removeTextColor(): this {
    const command = new TextColorCommand('text_color');
    command.remove()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `removeBackgroundColor` to handle remove background color.
   * @zh 执行 `removeBackgroundColor`，用于移除背景颜色。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  removeBackgroundColor(): this {
    const command = new TextColorCommand('text_background_color');
    command.remove()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `align` to handle align.
   * @zh 执行 `align`，用于对齐。
   * @param p - p parameter (`Align`) / p参数（`Align`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  align(p: Align): this {
    const command = new TextAlignCommand(p);
    command.toggle()(this.state, this.dispatch);
    return this;
  }

  /**
   * Executes `insertHTML` to handle insert html.
   * @zh 执行 `insertHTML`，用于插入HTML内容。
   * @param html - html parameter (`string`) / HTML内容参数（`string`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  insertHTML(html: string): this {
    const { selection, schema, tr } = this.state;
    const { from, to } = selection;

    const doc = new window.DOMParser().parseFromString((html ?? '').trim(), 'text/html');
    const slice = DOMParser.fromSchema(schema).parseSlice(doc.body);

    const transaction = tr.replaceRange(from, to, slice);
    this.applyTrx(transaction);

    return this;
  }
}

