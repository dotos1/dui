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

    private _shortcuts: ParsedShortcut[] = [];

    private _sequences: ParsedShortcut[] = [];

    private throttleTime = 0;

    private _pressed = new Subject<ShortcutEventOutput>();

    /** @zh 每当任意已注册快捷键被触发时发出事件（含触发的按键与原生事件）。 */
    public pressed$ = this._pressed.asObservable();

    private disabled = false;

    private static readonly TIMEOUT_SEQUENCE = 1000;

    private _shortcutsSub = new BehaviorSubject<ParsedShortcut[]>([]);
    /** @zh 发出当前已注册的（非空）快捷键列表，随注册/注销更新。 */
    public shortcuts$ = this._shortcutsSub
        .pipe(filter((shortcuts) =>{
     
            return shortcuts.length!=0;
    } ));

    private _ignored = [AllowIn.Input, AllowIn.Textarea, AllowIn.Select, AllowIn.ContentEditable];


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


    private mapEvent = (event) => {
        return this._shortcuts
            .filter((shortcut) => !shortcut.isSequence)
            .map((shortcut) =>
                Object.assign({}, shortcut, {
                    predicates: any(
                        identity,
                        shortcut.predicates.map((predicates: any) => allPass(predicates)(event))
                    ),
                    event: event
                })
            )
            .filter((shortcut) => shortcut.predicates)
            .reduce((acc, shortcut) => (acc.priority > shortcut.priority ? acc : shortcut), {
                priority: 0
            } as ParsedShortcut);
    };


    private readonly subscriptions: Subscription[] = [];

    private keydown$: Observable<KeyboardEvent> = fromEvent(this.document, "keydown");

    private ignore$ = this.pressed$.pipe(
        filter((e) => e.event.defaultPrevented),
        switchMap(() => this.clicks$.pipe(first())),
        tap((e: any) => {
            e.preventDefault();
            e.stopPropagation();
        }),
        repeat()
    );

    private clicks$ = fromEvent(this.document, "click", { capture: true });

    private keyup$ = fromEvent(this.document, "keyup");


    private keydownCombo$ = this.keydown$.pipe(
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


    private timer$ = new Subject();
   
    private resetCounter$ = this.timer$
        .asObservable()
        .pipe(switchMap(() => timer(KeyboardShortcutsService.TIMEOUT_SEQUENCE)));

    private keydownSequence$ = this.keydown$.pipe(
        map((event) => ({
            event,
            sequences: this._sequences
        })),
        scan(
            (acc: { events: any[]; command?: any; sequences: any[] }, arg: any) => {
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


    constructor(@Inject(DOCUMENT) private document: any) {
        this.subscriptions.push(
            this.keydownSequence$.subscribe(),
            this.keydownCombo$.subscribe()
            // this.ignore$.subscribe()
        );
    }


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

    private characterFromEvent(event) {
        const [key, shiftKey] = this._characterFromEvent(event);
        if (shiftKey && _SHIFT_MAP[key]) {
            return [_SHIFT_MAP[key], shiftKey];
        }
        return [key, shiftKey];
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }


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


    private modifiersOn(event) {
        return ["metaKey", "altKey", "ctrlKey"].some((mod) => event[mod]);
    }


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
