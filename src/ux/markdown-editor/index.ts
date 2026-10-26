/**
 * @fileoverview Module `src/ux/markdown-editor/index.ts` providing index definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/index.ts`，提供索引相关的定义与实现。
 */

import {editor} from 'monaco-editor';
import {activateFormatting} from "./formatting";
import {setWordDefinitionFor, TextEditor} from "./vscode-monaco";
import {activateListEditing} from "./listEditing";
import {activateCompletion} from "./completion";
import {activateTableFormatter} from "./tableFormatter";

import {activateMarkdownMath} from "./markdown.contribution";

/**
 * Class `MonacoMarkdownExtension` encapsulating monaco markdown extension data structures and logic in `src/ux/markdown-editor`.
 * @zh 类 `MonacoMarkdownExtension`，封装 `src/ux/markdown-editor` 中的Monaco编辑器Markdown文档Extension数据结构与处理逻辑。
 */
export class MonacoMarkdownExtension {
    /**
     * Executes `activate` to handle activate.
     * @zh 执行 `activate`，用于激活。
     * @param editor - editor parameter (`editor.IStandaloneCodeEditor`) / 编辑器参数（`editor.IStandaloneCodeEditor`）
     */
    activate(editor: editor.IStandaloneCodeEditor) {
        let textEditor = new TextEditor(editor)

        activateFormatting(textEditor)
        activateListEditing(textEditor)
        activateCompletion(textEditor)
        activateTableFormatter(textEditor)

        // Allow `*` in word pattern for quick styling
        setWordDefinitionFor(textEditor.languageId,
            /(-?\d*\.\d\w*)|([^\!\@\#\%\^\&\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s\，\。\《\》\？\；\：\‘\“\’\”\（\）\【\】\、]+)/g
        );
    }
}

activateMarkdownMath()
