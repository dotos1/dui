
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
            let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern.split(' ').filter((t) => {
                return t.length > 0;
            }).join('|');

            const regex = new RegExp(pattern, 'gi');
            result = text.replace(/<[^>]+>/g, '').replace(regex, (match) => {
                isMatching = true;
                return `<span class="${wrapperClass}">${match}</span>`;
            });

            return { text: result, changed: isMatching };
        } else {
            return { text: result, changed: isMatching };
        }
    }
}
