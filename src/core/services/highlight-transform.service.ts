
import { Injectable } from '@angular/core';
import { sanitizeDomTree } from '@dotos/dui/base';

export interface HighlightTransformResult {
    text: string;
    changed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HighlightTransformService {

    /**
     * Searches for `search` string(s) within `text` and highlights all occurrences.
     * @param text Text to search within
     * @param search Text pattern to search for
     * @param wrapperClass CSS class used to provide highlighting style
     * @returns New text along with boolean value to indicate whether anything was highlighted
     */
    public highlight(text: string, search: string, wrapperClass: string = 'dui-highlight'): HighlightTransformResult {
        if (!search || !text) {
            return { text: text, changed: false };
        }
        const terms = search.split(' ').filter((t) => t.length > 0)
            .map((t) => t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
        if (terms.length === 0 || typeof DOMParser === 'undefined') {
            return { text: text, changed: false };
        }

        // 在 DOM 上做,不在字符串上做(b8c5e5c 复核)。b8c5e5c 先把整段 text 转义
        // 再在转义结果上跑正则:输入里已有的实体被二次转义(&amp; 显示成 "&amp;"),
        // 搜 "amp"/"lt" 会把 span 插进 &amp; 中间把实体切坏;对上一次的输出再
        // highlight 一遍,上一轮的 <span> 也被转义成字面文字。
        // 现在:惰性文档里解析 → 先把已有的高亮 span 展开还原(重复执行幂等)→
        // 只在 Text 节点里用 DOM API 插 span → 序列化。转义只发生一次,由序列化完成。
        const doc = new DOMParser().parseFromString('<body>' + text, 'text/html');
        const body = doc.body;
        const safeWrapperClass = wrapperClass.replace(/["'<>\s]/g, '');
        if (safeWrapperClass) {
            body.querySelectorAll('span.' + safeWrapperClass).forEach((span) => {
                span.replaceWith(...Array.from(span.childNodes));
            });
            body.normalize();
        }
        // 这里的输出会走 [innerHTML],顺手按 dui 的规则净化一遍。
        sanitizeDomTree(body);

        const regex = new RegExp(terms.join('|'), 'gi');
        const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const parent = (n.parentNode as Element)?.localName;
            if (parent !== 'script' && parent !== 'style' && parent !== 'textarea' && parent !== 'title') {
                textNodes.push(n as Text);
            }
        }

        let isMatching = false;
        for (const node of textNodes) {
            const value = node.data;
            regex.lastIndex = 0;
            let m: RegExpExecArray | null;
            let last = 0;
            const frag = doc.createDocumentFragment();
            while ((m = regex.exec(value)) !== null) {
                if (m[0].length === 0) {
                    regex.lastIndex++;
                    continue;
                }
                isMatching = true;
                if (m.index > last) {
                    frag.appendChild(doc.createTextNode(value.slice(last, m.index)));
                }
                const span = doc.createElement('span');
                if (safeWrapperClass) {
                    span.className = safeWrapperClass;
                }
                span.textContent = m[0];
                frag.appendChild(span);
                last = m.index + m[0].length;
            }
            if (last > 0) {
                if (last < value.length) {
                    frag.appendChild(doc.createTextNode(value.slice(last)));
                }
                node.replaceWith(frag);
            }
        }

        return { text: body.innerHTML, changed: isMatching };
    }
}
