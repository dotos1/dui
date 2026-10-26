/**
 * @fileoverview Module `src/common/keyboard/keys.ts` providing keys definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keys.ts`，提供键列表相关的定义与实现。
 */

import {invert} from './utils';

/**
 * Constant/variable `isMac` defining is mac in `src/common/keyboard`.
 * @zh 常量/变量 `isMac`，定义 `src/common/keyboard` 中的是否为Mac。
 */
const isMac = typeof navigator !== 'undefined' ? navigator.userAgent.includes('Mac OS') : false;

/**
 * Constant/variable `modifiers` defining modifiers in `src/common/keyboard`.
 * @zh 常量/变量 `modifiers`，定义 `src/common/keyboard` 中的modifiers。
 */
export const modifiers = {
    shift: 'shiftKey',
    ctrl: 'ctrlKey',
    alt: 'altKey',
    cmd: isMac ? 'metaKey' : 'ctrlKey',
    command: isMac ? 'metaKey' : 'ctrlKey',
    meta: isMac ? 'metaKey' : 'ctrlKey',
    'left command': 'metaKey',
    'right command': 'MetaRight',
    '⌘': isMac ? 'metaKey' : 'ctrlKey',
    option: 'altKey',
    ctl: 'ctrlKey',
    control: 'ctrlKey'
};
/**
 * Constant/variable `_SPECIAL_CASES` defining special cases in `src/common/keyboard`.
 * @zh 常量/变量 `_SPECIAL_CASES`，定义 `src/common/keyboard` 中的SPECIALCASES。
 */
export const _SPECIAL_CASES = {
    plus: '+'
};

/**
 * Constant/variable `symbols` defining symbols in `src/common/keyboard`.
 * @zh 常量/变量 `symbols`，定义 `src/common/keyboard` 中的symbols。
 */
export const symbols = {
    cmd: isMac ? '⌘' : 'Ctrl',
    command: isMac ? '⌘' : 'Ctrl',
    'left command': isMac ? '⌘' : 'Ctrl',
    'right command': isMac ? '⌘' : 'Ctrl',
    option: isMac ? '⌥' : 'Alt',
    plus: '+',
    left: '←',
    right: '→',
    up: '↑',
    down: '↓',
    alt: isMac ? '⌥' : 'Alt',
    ctrl: 'Ctrl',
    control: 'Ctrl',
    shift: '⇧'
};

/**
 * Constant/variable `_MAP` defining map in `src/common/keyboard`.
 * @zh 常量/变量 `_MAP`，定义 `src/common/keyboard` 中的映射表。
 */
export const _MAP = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: ['ctrl', 'control'],
    18: 'alt',
    20: 'capslock',
    27: ['esc', 'escape'],
    32: ['space', 'spc'],
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: ['meta', 'cmd', 'command'],
    93: ['meta', 'cmd', 'command'],
    224: ['meta', 'cmd', 'command']
};


/**
 * Constant/variable `_KEYCODE_MAP` defining keycode map in `src/common/keyboard`.
 * @zh 常量/变量 `_KEYCODE_MAP`，定义 `src/common/keyboard` 中的KEYCODE映射表。
 */
export const _KEYCODE_MAP = {
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\''
};


/**
 * Constant/variable `_SHIFT_MAP` defining shift map in `src/common/keyboard`.
 * @zh 常量/变量 `_SHIFT_MAP`，定义 `src/common/keyboard` 中的移出首项映射表。
 */
export const _SHIFT_MAP: Record<string, string> = {
    '`': '~',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    ';': ':',
    '\'': '"',
    ',': '<',
    '.': '>',
    '/': '?',
    '\\': '|'
};
/**
 * Constant/variable `_INVERTED_SHIFT_MAP` defining inverted shift map in `src/common/keyboard`.
 * @zh 常量/变量 `_INVERTED_SHIFT_MAP`，定义 `src/common/keyboard` 中的INVERTED移出首项映射表。
 */
export const _INVERTED_SHIFT_MAP = invert(_SHIFT_MAP);

/**
 * loop through the f keys, f1 to f19 and add them to the map
 * programatically
 */
for (let i = 1; i < 20; ++i) {
    _MAP[111 + i] = 'f' + i;
}

/**
 * loop through to map numbers on the numeric keypad
 */
for (let i = 0; i <= 9; ++i) {
    // This needs to use a string cause otherwise since 0 is falsey
    // event will never fire for numpad 0 pressed as part of a keydown
    // event.
    _MAP[i + 96] = i.toString();
}
