/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.service.ts` providing keyboard shortcuts service definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.service.ts`，提供键盘快捷键列表服务相关的定义与实现。
 */

import { Inject, Injectable, OnDestroy } from "@angular/core";
import {
    _INVERTED_SHIFT_MAP,
    _KEYCODE_MAP,
    _MAP,
    _SHIFT_MAP,
    _SPECIAL_CASES,
    modifiers
} from "./keys";
import {
    BehaviorSubject,
    fromEvent,
    Observable,
    of,
    Subject,
    Subscription,
    timer
} from "rxjs";
import {
    AllowIn,
    ParsedShortcut,
    ShortcutEventOutput,
    ShortcutInput
} from "./keyboard-shortcuts.interfaces";
import {
    filter,
    first,
    map,
    repeat,
    scan,
    switchMap,
    takeUntil,
    tap,
    throttle
} from "rxjs/operators";
import { allPass, any, difference, identity, isFunction, isNill, maxArrayProp, runShortcutCommand } from "./utils";
import { DOCUMENT } from "@angular/common";


/**
 * Constant/variable `guid` defining guid in `src/common/keyboard`.
 * @zh 常量/变量 `guid`，定义 `src/common/keyboard` 中的全局唯一标识。
 */
let guid = 0;

/**
 * Registers global keyboard shortcuts (single combos and multi-key sequences) and dispatches
 * matching commands, respecting focus context (e.g. ignoring shortcuts while typing in inputs).
 * @zh 注册全局键盘快捷键（单个组合键和多键序列），并在匹配时派发对应命令，同时会根据焦点上下文
 * 做出忽略处理（例如在输入框内输入时忽略快捷键）。
 */
@Injectable({
    providedIn: "root"
})
export class KeyboardShortcutsService implements OnDestroy {

    /**
     * Property `_shortcuts` (`ParsedShortcut[]`) storing shortcuts (default: `[]`).
     * @zh 属性 `_shortcuts`（类型：`ParsedShortcut[]`），用于存储或配置快捷键列表（默认值：`[]`）。
     */
    private _shortcuts: ParsedShortcut[] = [];

    /**
     * Property `_sequences` (`ParsedShortcut[]`) storing sequences (default: `[]`).
     * @zh 属性 `_sequences`（类型：`ParsedShortcut[]`），用于存储或配置sequences（默认值：`[]`）。
     */
    private _sequences: ParsedShortcut[] = [];

    /**
     * Property `throttleTime` (`number`) storing throttle time (default: `0`).
     * @zh 属性 `throttleTime`（类型：`number`），用于存储或配置节流时间（默认值：`0`）。
     */
    private throttleTime = 0;

    /**
     * Property `_pressed` (`Subject<ShortcutEventOutput>`) storing pressed (default: `new Subject<ShortcutEventOutput>()`).
     * @zh 属性 `_pressed`（类型：`Subject<ShortcutEventOutput>`），用于存储或配置按下（默认值：`new Subject<ShortcutEventOutput>()`）。
     */
    private _pressed = new Subject<ShortcutEventOutput>();

    /**
     * Property `pressed$` (`Observable<ShortcutEventOutput>`) storing pressed (default: `this._pressed.asObservable()`).
     * @zh 每当任意已注册快捷键被触发时发出事件（含触发的按键与原生事件）。
     * @zh 每当任意已注册快捷键被触发时发出事件（含触发的按键与原生事件）。
     */
    public pressed$ = this._pressed.asObservable();

    /**
     * Property `disabled` (`boolean`) storing disabled (default: `false`).
     * @zh 属性 `disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
     */
    private disabled = false;

    /**
     * Property `TIMEOUT_SEQUENCE` (`1000`) storing timeout sequence (default: `1000`).
     * @zh 属性 `TIMEOUT_SEQUENCE`（类型：`1000`），用于存储或配置延时器SEQUENCE（默认值：`1000`）。
     */
    private static readonly TIMEOUT_SEQUENCE = 1000;

    /**
     * Property `_shortcutsSub` (`BehaviorSubject<ParsedShortcut[]>`) storing shortcuts sub.
     * @zh 属性 `_shortcutsSub`（类型：`BehaviorSubject<ParsedShortcut[]>`），用于存储或配置快捷键列表子。
     */
    private _shortcutsSub = new BehaviorSubject<ParsedShortcut[]>([]);
    /**
     * Property `shortcuts$` (`Observable<ParsedShortcut[]>`) storing shortcuts.
     * @zh 发出当前已注册的（非空）快捷键列表，随注册/注销更新。
     * @zh 发出当前已注册的（非空）快捷键列表，随注册/注销更新。
     */
    public shortcuts$ = this._shortcutsSub
        .pipe(filter((shortcuts) =>{
     
            return shortcuts.length!=0;
    } ));

    /**
     * Property `_ignored` (`AllowIn[]`) storing ignored.
     * @zh 属性 `_ignored`（类型：`AllowIn[]`），用于存储或配置已忽略。
     */
    private _ignored = [AllowIn.Input, AllowIn.Textarea, AllowIn.Select, AllowIn.ContentEditable];


    /**
     * Property `isAllowed` (`(shortcut: ParsedShortcut) => boolean`) storing is allowed.
     * @zh 属性 `isAllowed`（类型：`(shortcut: ParsedShortcut) => boolean`），用于存储或配置是否为允许的。
     */
    private isAllowed = (shortcut: ParsedShortcut) => {
        const target = shortcut.event.target as HTMLElement;
        const isContentEditable = !!target.getAttribute("contenteditable");
        const nodeName = isContentEditable ? AllowIn.ContentEditable : target.nodeName;
        if (target === shortcut.target) {
            return true;
        }
        // if (shortcut.allowIn.includes(AllowIn.ContentEditable)) {
        //     return !!target.getAttribute("contenteditable");
        // }
        if (shortcut.allowIn.length) {
            return !difference(this._ignored, shortcut.allowIn).includes(nodeName);
        }
        if (isContentEditable) {
            return false;
        }
        return !this._ignored.includes(target.nodeName as AllowIn);
    };


    /**
     * Property `mapEvent` (`(event: any) => ParsedShortcut`) storing map event.
     * @zh 属性 `mapEvent`（类型：`(event: any) => ParsedShortcut`），用于存储或配置映射表事件。
     */
    private mapEvent = (event) => {
        return this._shortcuts
            .filter((shortcut) => !shortcut.isSequence)
            .map((shortcut) =>
                Object.assign({}, shortcut, {
                    predicates: any(
                        identity,
                        shortcut.predicates.map((predicates) => allPass(predicates)(event))
                    ),
                    event: event
                })
            )
            .filter((shortcut) => shortcut.predicates)
            .reduce((acc, shortcut) => (acc.priority > shortcut.priority ? acc : shortcut), {
                priority: 0
            } as ParsedShortcut);
    };


    /**
     * Property `subscriptions` (`Subscription[]`) storing subscriptions (default: `[]`).
     * @zh 属性 `subscriptions`（类型：`Subscription[]`），用于存储或配置订阅集合（默认值：`[]`）。
     */
    private readonly subscriptions: Subscription[] = [];

    /**
     * Property `keydown$` (`Observable<KeyboardEvent>`) storing keydown (default: `fromEvent(this.document, "keydown")`).
     * @zh 属性 `keydown$`（类型：`Observable<KeyboardEvent>`），用于存储或配置按键按下（默认值：`fromEvent(this.document, "keydown")`）。
     */
    private keydown$: Observable<KeyboardEvent>;

    /**
     * Property `ignore$` (`Observable<Event>`) storing ignore.
     * @zh 属性 `ignore$`（类型：`Observable<Event>`），用于存储或配置忽略。
     */
    private ignore$: Observable<Event>;

    /**
     * Property `clicks$` (`Observable<Event>`) storing clicks.
     * @zh 属性 `clicks$`（类型：`Observable<Event>`），用于存储或配置点击。
     */
    private clicks$: Observable<Event>;

    /**
     * Property `keyup$` (`Observable<Event>`) storing keyup (default: `fromEvent(this.document, "keyup")`).
     * @zh 属性 `keyup$`（类型：`Observable<Event>`），用于存储或配置按键抬起（默认值：`fromEvent(this.document, "keyup")`）。
     */
    private keyup$: Observable<Event>;


    /**
     * Property `keydownCombo$` (`Observable<ParsedShortcut>`) storing keydown combo.
     * @zh 属性 `keydownCombo$`（类型：`Observable<ParsedShortcut>`），用于存储或配置按键按下Combo。
     */
    private keydownCombo$: Observable<unknown>;


    /**
     * Property `timer$` (`Subject<unknown>`) storing timer (default: `new Subject()`).
     * @zh 属性 `timer$`（类型：`Subject<unknown>`），用于存储或配置定时器（默认值：`new Subject()`）。
     */
    private timer$ = new Subject();
   
    /**
     * Property `resetCounter$` (`Observable<0>`) storing reset counter.
     * @zh 属性 `resetCounter$`（类型：`Observable<0>`），用于存储或配置重置计数器。
     */
    private resetCounter$ = this.timer$
        .asObservable()
        .pipe(switchMap(() => timer(KeyboardShortcutsService.TIMEOUT_SEQUENCE)));

    /**
     * Property `keydownSequence$` (`Observable<ParsedShortcut>`) storing keydown sequence.
     * @zh 属性 `keydownSequence$`（类型：`Observable<ParsedShortcut>`），用于存储或配置按键按下Sequence。
     */
    private keydownSequence$: Observable<unknown>;


    /**
     * Executes `isFullMatch` to handle is full match.
     * @zh 执行 `isFullMatch`，用于是否为完整匹配。
     * @param options - { command, events } parameter (`any`) / {command,事件集合}参数（`any`）
     */
    private isFullMatch({ command, events }) {
        if (!command) {
            return false;
        }
        return command.sequence.some((sequence) => {
            return sequence.length === events.length + 1;
        });
    }

    /**
     * The currently registered non-sequence shortcuts.
     * @zh 当前已注册的非序列型快捷键。
     */
    public get shortcuts() {
        return this._shortcuts;
    }


    /**
     * Creates an instance of `KeyboardShortcutsService` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsService` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
     */
    constructor(@Inject(DOCUMENT) private document) {
        this.keydown$ = fromEvent<KeyboardEvent>(this.document, "keydown");
        this.clicks$ = fromEvent<Event>(this.document, "click", { capture: true });
        this.keyup$ = fromEvent<Event>(this.document, "keyup");
        this.ignore$ = this.pressed$.pipe(
            filter((e) => e.event.defaultPrevented),
            switchMap(() => this.clicks$.pipe(first())),
            tap((e: Event) => {
                e.preventDefault();
                e.stopPropagation();
            }),
            repeat()
        );
        this.keydownCombo$ = this.keydown$.pipe(
            filter(() => !this.disabled),
            map(this.mapEvent),
            filter(
                (shortcut: ParsedShortcut) =>
                    !shortcut.target || shortcut.event.target === shortcut.target
            ),
            filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
            filter((shortcut) => this.isAllowed(shortcut)),
            tap((shortcut) => {
                if (!shortcut.preventDefault) {
                    return;
                }
                shortcut.event.preventDefault();
                shortcut.event.stopPropagation();
            }),
            throttle((shortcut) => timer(shortcut.throttleTime ?? shortcut.throttle ?? 0)),
            // 命令出错只记日志不往外抛:原来这里抛出(外加 catchError 原样再抛)会让订阅终止,
            // 一个命令出错一次,此后所有组合键都失效,直到刷新页面
            tap((shortcut) => runShortcutCommand(shortcut.command, { event: shortcut.event, key: shortcut.key })),
            tap((shortcut) => this._pressed.next({ event: shortcut.event, key: shortcut.key })),
            takeUntil(this.keyup$),
            repeat()
        );
        this.keydownSequence$ = this.keydown$.pipe(
            map((event) => ({
                event,
                sequences: this._sequences
            })),
            scan(
                (acc: { events; command?; sequences }, arg: { event?; sequences? }) => {
                    const { event } = arg;
                    const currentLength = acc.events.length;
                    const sequences = currentLength ? acc.sequences : arg.sequences;
                    const [characters] = this.characterFromEvent(event);
                    const allChars = Array.isArray(characters)
                        ? [...characters, event.key]
                        : [characters, event.key];
                    const result = sequences
                        .map((sequence) => {
                            const sequences = sequence.sequence.filter((seque) =>
                                allChars.some(
                                    (key) =>
                                        (_SPECIAL_CASES[seque[currentLength]] ||
                                            seque[currentLength]) === key
                                )
                            );
                            const partialMatch = sequences.length > 0;
                            if (sequence.fullMatch) {
                                return sequence;
                            }
                            return {
                                ...sequence,
                                sequence: sequences,
                                partialMatch,
                                event: event,
                                fullMatch:
                                    partialMatch &&
                                    this.isFullMatch({ command: sequence, events: acc.events })
                            };
                        })
                        .filter((sequences) => sequences.partialMatch || sequences.fullMatch);

                    const [match] = result;
                    if (!match || this.modifiersOn(event)) {
                        return { events: [], sequences: this._sequences };
                    }

                    const guess = maxArrayProp("priority", result);
                    if (result.length > 1 && guess.fullMatch) {
                        return { events: [], command: guess, sequences: this._sequences };
                    }
                    if (result.length > 1) {
                        return {
                            events: [...acc.events, event],
                            command: result,
                            sequences: result
                        };
                    }
                    if (match.fullMatch) {
                        return { events: [], command: match, sequences: this._sequences };
                    }
                    return {
                        events: [...acc.events, event],
                        command: result,
                        sequences: result
                    };
                },
                { events: [], sequences: [] }
            ),
            switchMap(({ command }) => {
                if (Array.isArray(command)) {

                    return timer(500).pipe(
                        map(() => ({
                            command: command.filter((command) => command.fullMatch)[0]
                        }))
                    );
                }
                return of({ command });
            }),
            takeUntil(this.pressed$),
            filter(({ command }) => command && command.fullMatch),
            map(({ command }) => command),
            filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
            filter(
                (shortcut: ParsedShortcut) =>
                    !shortcut.target || shortcut.event.target === shortcut.target
            ),
            filter(this.isAllowed),
            tap((shortcut) => !shortcut.preventDefault || shortcut.event.preventDefault()),
            throttle((shortcut) => timer(shortcut.throttleTime ?? shortcut.throttle ?? 0)),
            // 同上:序列快捷键的命令出错也不能让整条序列流终止
            tap((shortcut) => runShortcutCommand(shortcut.command, { event: shortcut.event, key: shortcut.key })),
            tap((shortcut) => this._pressed.next({ event: shortcut.event, key: shortcut.key })),
            takeUntil(this.resetCounter$),
            repeat()
        );
        this.subscriptions.push(
            this.keydownSequence$.subscribe(),
            this.keydownCombo$.subscribe()
            // this.ignore$.subscribe()
        );
    }


    /**
     * Executes `_characterFromEvent` to handle character from event.
     * @zh 执行 `_characterFromEvent`，用于字符从事件。
     * @param event - event parameter (`any`) / 事件参数（`any`）
     * @returns Result of type `[string, boolean]` / 类型为 `[string, boolean]` 的返回值
     */
    private _characterFromEvent(event): [string, boolean] {
        if (typeof event.which !== "number") {
            event.which = event.keyCode;
        }
        if (_SPECIAL_CASES[event.which]) {
            return [_SPECIAL_CASES[event.which], event.shiftKey];
        }
        if (_MAP[event.which]) {
            // for non keypress events the special maps are needed
            return [_MAP[event.which], event.shiftKey];
        }

        if (_KEYCODE_MAP[event.which]) {
            return [_KEYCODE_MAP[event.which], event.shiftKey];
        }
        // in case event key is lower case but registered key is upper case
        // return it in the lower case
        if (String.fromCharCode(event.which).toLowerCase() !== event.key) {
            return [String.fromCharCode(event.which).toLowerCase(), event.shiftKey];
        }
        return [event.key, event.shiftKey];
    }

    /**
     * Executes `characterFromEvent` to handle character from event.
     * @zh 执行 `characterFromEvent`，用于字符从事件。
     * @param event - event parameter (`any`) / 事件参数（`any`）
     */
    private characterFromEvent(event) {
        const [key, shiftKey] = this._characterFromEvent(event);
        if (shiftKey && _SHIFT_MAP[key]) {
            return [_SHIFT_MAP[key], shiftKey];
        }
        return [key, shiftKey];
    }


    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }


    /**
     * Executes `isSequence` to handle is sequence.
     * @zh 执行 `isSequence`，用于是否为Sequence。
     * @param shortcuts - shortcuts parameter (`string[]`) / 快捷键列表参数（`string[]`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private isSequence(shortcuts: string[]): boolean {
        return !shortcuts.some((shortcut) => shortcut.includes("+") || shortcut.length === 1);
    }


    /**
     * Registers one or more shortcuts and returns their generated ids (for later removal).
     * @zh 注册一个或多个快捷键，返回其生成的 id（用于后续移除）。
     */
    public add(shortcuts: ShortcutInput[] | ShortcutInput): string[] {
        shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
        const commands = this.parseCommand(shortcuts);
        commands.forEach((command) => {
            if (command.isSequence) {
                this._sequences.push(command);
                return;
            }
            this._shortcuts.push(command);
        });
        setTimeout(() => {     
            if(this._shortcuts){
                this._shortcutsSub.next([...this._shortcuts, ...this._sequences]);
            }
        });
        return commands.map((command) => command.id);
    }


    /**
     * Unregisters shortcuts by the ids returned from {@link add}.
     * @zh 按 {@link add} 返回的 id 注销快捷键。
     */
    public remove(ids: string | string[]): KeyboardShortcutsService {
        ids = Array.isArray(ids) ? ids : [ids];
        this._shortcuts = this._shortcuts.filter((shortcut) => !ids.includes(shortcut.id));
        this._sequences = this._sequences.filter((shortcut) => !ids.includes(shortcut.id));
        setTimeout(() => {
            this._shortcutsSub.next([...this._shortcuts, ...this._sequences]);
        });
        return this;
    }


    /**
     * Returns an observable that emits whenever the shortcut registered under `key` fires.
     * @zh 返回一个 observable，当以 `key` 注册的快捷键被触发时发出通知。
     */
    public select(key: string): Observable<ShortcutEventOutput> {
        return this.pressed$.pipe(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            filter(({ event, key: eventKeys }) => {
                eventKeys = Array.isArray(eventKeys) ? eventKeys : [eventKeys];
                return !!eventKeys.find((eventKey) => eventKey === key);
            })
        );
    }

    /**
     * Property `getKeys` (`(keys: string[]) => ((event: any) => boolean)[]`) storing get keys.
     * @zh 属性 `getKeys`（类型：`(keys: string[]) => ((event: any) => boolean)[]`），用于存储或配置获取键列表。
     */
    private getKeys = (keys: string[]) => {
        return keys
            .map((key) => key.trim())
            .filter((key) => key !== "+")
            .map((key) => {
                key = _SPECIAL_CASES[key] || key;
                // eslint-disable-next-line no-prototype-builtins
                if (modifiers.hasOwnProperty(key)) {
                    return (event) => {
                        return !!event[modifiers[key]];
                    };
                }

                return (event: KeyboardEvent) => {
                    const isUpper = key === key.toUpperCase();
                    const isNonAlpha = /[^a-zA-Z\d\s:]/.test(key);
                    const inShiftMap = _INVERTED_SHIFT_MAP[key];
                    const [characters] = this.characterFromEvent(event);
                    const allModifiers = Object.keys(modifiers).map((key) => {
                        return modifiers[key];
                    });
                    const hasModifiers = allModifiers.some((modifier) => event[modifier]);

                    const result = Array.isArray(characters)
                        ? [...characters, event.key]
                        : [characters, event.key];

                    if (
                        hasModifiers &&
                        (!isUpper || isNonAlpha) &&
                        !inShiftMap &&
                        keys.length === 1
                    ) {
                        return false;
                    }
                    return result.some((char) => {
                        if (char === key && isUpper) {
                            return true;
                        }
                        return key === char;
                    });
                };
            });
    };


    /**
     * Executes `modifiersOn` to handle modifiers on.
     * @zh 执行 `modifiersOn`，用于modifiers当。
     * @param event - event parameter (`any`) / 事件参数（`any`）
     */
    private modifiersOn(event) {
        return ["metaKey", "altKey", "ctrlKey"].some((mod) => event[mod]);
    }


    /**
     * Executes `parseCommand` to handle parse command.
     * @zh 执行 `parseCommand`，用于解析命令。
     * @param command - command parameter (`ShortcutInput | ShortcutInput[]`) / 命令参数（`ShortcutInput | ShortcutInput[]`）
     * @returns Result of type `ParsedShortcut[]` / 类型为 `ParsedShortcut[]` 的返回值
     */
    private parseCommand(command: ShortcutInput | ShortcutInput[]): ParsedShortcut[] {
        const commands = Array.isArray(command) ? command : [command];
        return commands.map((command) => {
            const keys = Array.isArray(command.key) ? command.key : [command.key];
            const priority = Math.max(...keys.map((key) => key.split(" ").filter(identity).length));
            const predicates = keys.map((key) => this.getKeys(key.split(" ").filter(identity)));
            
            const isSequence = this.isSequence(keys);
            const sequence = isSequence
                ? keys.map((key) =>
                      key
                          .split(" ")
                          .filter(identity)
                          .map((key) => key.trim())
                  )
                : [];
            const resolvedThrottle = !isNill(command.throttleTime)
                ? command.throttleTime
                : !isNill(command.throttle)
                ? command.throttle
                : this.throttleTime;
            return {
                ...command,
                isSequence,
                sequence: isSequence ? sequence : [],
                allowIn: command.allowIn || [],
                key: keys,
                id: `${guid++}`,
                throttle: resolvedThrottle,
                throttleTime: resolvedThrottle,
                priority: priority,
                predicates: predicates
            } as ParsedShortcut;
        });
    }
}
