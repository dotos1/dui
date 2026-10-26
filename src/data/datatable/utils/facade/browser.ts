

/**
 * JS version of browser APIs. This library can only run in the browser.

 * @zh 常量/变量 `win`，定义 `src/data/datatable/utils/facade` 中的窗口。
 */
const win = (typeof window !== 'undefined' && window) || ({} as Window & typeof globalThis);

export { win as window };
/**
 * Constant/variable `document` defining document in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `document`，定义 `src/data/datatable/utils/facade` 中的文档对象。
 */
export const document = win.document;
/**
 * Constant/variable `location` defining location in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `location`，定义 `src/data/datatable/utils/facade` 中的location。
 */
export const location = win.location;
/**
 * Constant/variable `gc` defining gc in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `gc`，定义 `src/data/datatable/utils/facade` 中的gc。
 */
export const gc = win['gc'] ? () => win['gc']() : () => null;
/**
 * Constant/variable `performance` defining performance in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `performance`，定义 `src/data/datatable/utils/facade` 中的performance。
 */
export const performance = win['performance'] ? win['performance'] : null;
/**
 * Constant/variable `Event` defining event in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `Event`，定义 `src/data/datatable/utils/facade` 中的事件。
 */
export const Event = win['Event'];
/**
 * Constant/variable `MouseEvent` defining mouse event in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `MouseEvent`，定义 `src/data/datatable/utils/facade` 中的鼠标事件。
 */
export const MouseEvent = win['MouseEvent'];
/**
 * Constant/variable `KeyboardEvent` defining keyboard event in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `KeyboardEvent`，定义 `src/data/datatable/utils/facade` 中的键盘事件。
 */
export const KeyboardEvent = win['KeyboardEvent'];
/**
 * Constant/variable `EventTarget` defining event target in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `EventTarget`，定义 `src/data/datatable/utils/facade` 中的事件目标。
 */
export const EventTarget = win['EventTarget'];
/**
 * Constant/variable `History` defining history in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `History`，定义 `src/data/datatable/utils/facade` 中的历史记录。
 */
export const History = win['History'];
/**
 * Constant/variable `Location` defining location in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `Location`，定义 `src/data/datatable/utils/facade` 中的Location。
 */
export const Location = win['Location'];
/**
 * Constant/variable `EventListener` defining event listener in `src/data/datatable/utils/facade`.
 * @zh 常量/变量 `EventListener`，定义 `src/data/datatable/utils/facade` 中的事件监听器。
 */
export const EventListener = win['EventListener'];
