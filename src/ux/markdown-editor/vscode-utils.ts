export function regExpLeadsToEndlessLoop(regexp: RegExp): boolean {
    if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
        return false;
    }
    const match = regexp.exec('');
    return !!(match && regexp.lastIndex === 0);
}


