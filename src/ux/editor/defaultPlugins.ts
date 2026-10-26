/**
 * @fileoverview Module `src/ux/editor/defaultPlugins.ts` providing default plugins definitions and implementation.
 * @zh 模块文件 `src/ux/editor/defaultPlugins.ts`，提供默认Plugins相关的定义与实现。
 */

import { MarkType, NodeType, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { keymap } from 'prosemirror-keymap';
import { toggleMark, baseKeymap, chainCommands, exitCode } from 'prosemirror-commands';
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { history, undo, redo } from 'prosemirror-history';
import {
  inputRules, wrappingInputRule, textblockTypeInputRule,
  smartQuotes, emDash, ellipsis, InputRule,
} from 'prosemirror-inputrules';
import { markInputRule } from './helpers/markInputRule';

/**
 * Interface `Options` defining the contract and properties for options.
 * @zh 接口 `Options`，定义配置选项的数据结构契约与属性规范。
 */
interface Options {
  /**
   * Property `history` (`boolean`) storing history.
   * @zh 属性 `history`（类型：`boolean`），用于存储或配置历史记录。
   */
  history: boolean;
  /**
   * Property `keyboardShortcuts` (`boolean`) storing keyboard shortcuts.
   * @zh 属性 `keyboardShortcuts`（类型：`boolean`），用于存储或配置键盘快捷键列表。
   */
  keyboardShortcuts: boolean;
  /**
   * Property `inputRules` (`boolean`) storing input rules.
   * @zh 属性 `inputRules`（类型：`boolean`），用于存储或配置输入属性规则列表。
   */
  inputRules: boolean;
}

/**
 * Interface `ShortcutOptions` defining the contract and properties for shortcut options.
 * @zh 接口 `ShortcutOptions`，定义快捷键配置选项的数据结构契约与属性规范。
 */
interface ShortcutOptions {
  /**
   * Property `history` (`boolean`) storing history.
   * @zh 属性 `history`（类型：`boolean`），用于存储或配置历史记录。
   */
  history: boolean;
}

/**
 * Constant/variable `isMacOs` defining is mac os in `src/ux/editor`.
 * @zh 常量/变量 `isMacOs`，定义 `src/ux/editor` 中的是否为MacOs。
 */
const isMacOs = typeof navigator !== 'undefined'
  ? (/Mac/).test(navigator.platform)
  : false;

// Input rules ref: https://github.com/ProseMirror/prosemirror-example-setup/

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
/**
 * Constant/variable `blockQuoteRule` defining block quote rule in `src/ux/editor`.
 * @zh 常量/变量 `blockQuoteRule`，定义 `src/ux/editor` 中的块Quote规则。
 */
const blockQuoteRule = (nodeType: NodeType): InputRule => {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
};

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a number
// followed by a dot at the start of a textblock into an ordered list.
/**
 * Constant/variable `orderedListRule` defining ordered list rule in `src/ux/editor`.
 * @zh 常量/变量 `orderedListRule`，定义 `src/ux/editor` 中的已顺序列表规则。
 */
const orderedListRule = (nodeType: NodeType): InputRule => {
  return wrappingInputRule(
    /^(?:\d+)\.\s$/,
    nodeType,
    (match) => ({ order: Number(match[1]) }),
    (match, node) => node.childCount + node.attrs['order'] === Number(match[1]),
  );
};

// : (NodeType) → InputRule
// Given a list node type, returns an input rule that turns a bullet
// (dash, plush, or asterisk) at the start of a textblock into a
// bullet list.
/**
 * Constant/variable `bulletListRule` defining bullet list rule in `src/ux/editor`.
 * @zh 常量/变量 `bulletListRule`，定义 `src/ux/editor` 中的bullet列表规则。
 */
const bulletListRule = (nodeType: NodeType): InputRule => {
  return wrappingInputRule(/^\s*(?:[-+*])\s$/, nodeType);
};

// : (NodeType) → InputRule
// Given a code block node type, returns an input rule that turns a
// textblock starting with three backticks into a code block.
/**
 * Constant/variable `codeBlockRule` defining code block rule in `src/ux/editor`.
 * @zh 常量/变量 `codeBlockRule`，定义 `src/ux/editor` 中的编码块规则。
 */
const codeBlockRule = (nodeType: NodeType): InputRule => {
  return textblockTypeInputRule(/^```$/, nodeType);
};

// : (NodeType, number) → InputRule
// Given a node type and a maximum level, creates an input rule that
// turns up to that number of `#` characters followed by a space at
// the start of a textblock into a heading whose level corresponds to
// the number of `#` signs.
/**
 * Constant/variable `headingRule` defining heading rule in `src/ux/editor`.
 * @zh 常量/变量 `headingRule`，定义 `src/ux/editor` 中的heading规则。
 */
const headingRule = (nodeType: NodeType, maxLevel: number): InputRule => {
  return textblockTypeInputRule(
    new RegExp(`^(#{1,${maxLevel}})\\s$`),
    nodeType,
    (match) => ({ level: match[1].length }),
  );
};

// : (MarkType) → InputRule
// Wraps matching text with bold mark
/**
 * Constant/variable `boldRule` defining bold rule in `src/ux/editor`.
 * @zh 常量/变量 `boldRule`，定义 `src/ux/editor` 中的bold规则。
 */
const boldRule = (markType: MarkType): InputRule => {
  return markInputRule(/(?:^|\s)(?:(?:\*\*|__)(?:(?:[^*_]+))(?:\*\*|__))$/, markType);
};

// : (MarkType) → InputRule
// Wraps matching text with em mark
/**
 * Constant/variable `emRule` defining em rule in `src/ux/editor`.
 * @zh 常量/变量 `emRule`，定义 `src/ux/editor` 中的em规则。
 */
const emRule = (markType: MarkType): InputRule => {
  return markInputRule(/(?:^|\s)(?:(?:\*|_)(?:(?:[^*_]+))(?:\*|_))$/, markType);
};

// : (Schema) → Plugin
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
/**
 * Constant/variable `buildInputRules` defining build input rules in `src/ux/editor`.
 * @zh 常量/变量 `buildInputRules`，定义 `src/ux/editor` 中的构建输入属性规则列表。
 */
const buildInputRules = (schema: Schema): Plugin => {
  const rules = smartQuotes.concat(ellipsis, emDash);

  rules.push(boldRule(schema.marks['strong']));
  rules.push(emRule(schema.marks['em']));
  rules.push(blockQuoteRule(schema.nodes['blockquote']));
  rules.push(orderedListRule(schema.nodes['ordered_list']));
  rules.push(bulletListRule(schema.nodes['bullet_list']));
  rules.push(codeBlockRule(schema.nodes['code_block']));
  rules.push(headingRule(schema.nodes['heading'], 6));

  return inputRules({ rules });
};

/**
 * Constant/variable `getKeyboardShortcuts` defining get keyboard shortcuts in `src/ux/editor`.
 * @zh 常量/变量 `getKeyboardShortcuts`，定义 `src/ux/editor` 中的获取键盘快捷键列表。
 */
export const getKeyboardShortcuts = (schema: Schema, options: ShortcutOptions) => {
  const historyKeyMap = {};

  historyKeyMap['Mod-z'] = undo;
  if (isMacOs) {
    historyKeyMap['Shift-Mod-z'] = redo;
  } else {
    historyKeyMap['Mod-y'] = redo;
  }

  const plugins = [
    keymap({
      'Mod-b': toggleMark(schema.marks['strong']),
      'Mod-i': toggleMark(schema.marks['em']),
      'Mod-u': toggleMark(schema.marks['u']),
      'Mod-`': toggleMark(schema.marks['code']),
    }),
    keymap({
      'Enter': splitListItem(schema.nodes['list_item']),
      'Shift-Enter': chainCommands(exitCode, (state, dispatch) => {
        const { tr } = state;
        const br = schema.nodes['hard_break'];
        dispatch(tr.replaceSelectionWith(br.create()).scrollIntoView());
        return true;
      }),
      'Mod-[': liftListItem(schema.nodes['list_item']),
      'Mod-]': sinkListItem(schema.nodes['list_item']),
      'Tab': sinkListItem(schema.nodes['list_item']),
    }),
    keymap(baseKeymap),
  ];

  if (options.history) {
    plugins.push(keymap(historyKeyMap));
  }

  return plugins;
};

/**
 * Constant/variable `getDefaultPlugins` defining get default plugins in `src/ux/editor`.
 * @zh 常量/变量 `getDefaultPlugins`，定义 `src/ux/editor` 中的获取默认Plugins。
 */
const getDefaultPlugins = (schema: Schema, options: Options): Plugin[] => {
  const plugins: Plugin[] = [];

  if (options.keyboardShortcuts) {
    plugins.push(...getKeyboardShortcuts(schema, { history: options.history }));
  }

  if (options.history) {
    plugins.push(history());
  }

  if (options.inputRules) {
    plugins.push(buildInputRules(schema));
  }

  return plugins;
};

export default getDefaultPlugins;
