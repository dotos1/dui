
import { Injectable } from '@angular/core';

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
        let isMatching = false,
            result = text;

        if (search && text) {
            const escapedText = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            let pattern = search
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern.split(' ').filter((t) => {
                return t.length > 0;
            }).join('|');

            if (pattern.length > 0) {
                const safeWrapperClass = wrapperClass.replace(/["'<>]/g, '');
                const regex = new RegExp(pattern, 'gi');
                result = escapedText.replace(regex, (match) => {
                    isMatching = true;
                    return `<span class="${safeWrapperClass}">${match}</span>`;
                });
            } else {
                result = escapedText;
            }

            return { text: result, changed: isMatching };
        } else {
            return { text: result, changed: isMatching };
        }
    }
}
