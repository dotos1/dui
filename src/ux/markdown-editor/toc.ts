/**
 * @fileoverview Module `src/ux/markdown-editor/toc.ts` providing toc definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/toc.ts`，提供toc相关的定义与实现。
 */


import {TextDocument} from "./vscode-monaco";
/**
 * Executes `buildToc` to handle build toc.
 * @zh 执行 `buildToc`，用于构建Toc。
 * @param doc - doc parameter (`TextDocument`) / 文档参数（`TextDocument`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function buildToc(doc: TextDocument) {
    let toc;
    let lines = doc.getText()
        .replace(/^```[\W\w]+?^```/gm, '')      // Remove code blocks
        .replace(/<!-- omit in (toc|TOC) -->/g, '&lt; omit in toc &gt;')  // Escape magic comment
        .replace(/<!--[\W\w]+?-->/, '')         // Remove comments
        .replace(/^---[\W\w]+?(\r?\n)---/, '')  // Remove YAML front matter
        .split(/\r?\n/g);
    // Transform setext headings to ATX headings
    lines.forEach((lineText, i, arr) => {
        if (
            i < arr.length - 1
            && lineText.match(/^ {0,3}\S.*$/)
            && arr[i + 1].match(/^ {0,3}(=+|-{2,}) *$/)
        ) {
            arr[i] = (arr[i + 1].includes('=') ? '# ' : '## ') + lineText;
        }
    });
    toc = lines.filter(lineText => {
        return lineText.startsWith('#')
            && lineText.includes('# ')
            && !lineText.includes('&lt; omit in toc &gt;');
    }).map(lineText => {
        let matches = /^(#+) (.*)/.exec(lineText);
        return {level: matches[1].length, text: matches[2].replace(/#+$/, '').trim()};
    });

    return toc;
}

