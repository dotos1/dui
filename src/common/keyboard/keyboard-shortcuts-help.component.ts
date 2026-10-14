import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { BehaviorSubject, SubscriptionLike } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

import { DomPortalOutlet } from "./dom-portal-outlet";
import { TemplatePortal } from "./portal";
import { KeyboardShortcutsService } from "./keyboard-shortcuts.service";
import { KeyboardShortcutsHelpService } from "./keyboard-shortcuts-help.service";
import { groupBy } from "./utils";
import { Shortcut } from "./keyboard-shortcuts.interfaces";


const scrollAbleKeys = new Map([
    [31, 1],
    [38, 1],
    [39, 1],
    [40, 1]
]);

const preventDefault = (ignore: string) => (e) => {
    const modal = e.target.closest(ignore);
    if (modal) {
        return;
    }
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
};

const preventDefaultForScrollKeys = (e) => {
    if (!scrollAbleKeys.has(e.keyCode)) {
        return true;
    }
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
    return false;
};

let scrollEvents = [
    { name: "wheel", callback: null },
    { name: "touchmove", callback: null },
    { name: "DOMMouseScroll", callback: null }
];


const disableScroll = (ignore: string) => {
    scrollEvents = scrollEvents.map((event) => {
        const callback = preventDefault(ignore);
        window.addEventListener(event.name, callback, { passive: false });
        return {
            ...event,
            callback
        };
    });
    window.addEventListener("keydown", preventDefaultForScrollKeys);
};

const enableScroll = () => {
    scrollEvents = scrollEvents.map((event) => {
        window.removeEventListener(event.name, event.callback);
        return {
            ...event,
            callback: null
        };
    });
    window.removeEventListener("keydown", preventDefaultForScrollKeys);
};


/**
 * A slide-in panel (attached to `document.body` via a portal) that lists all currently
 * registered keyboard shortcuts, grouped by label. Toggle it with the `key` input shortcut.
 * @zh 一个滑入式面板（通过 portal 附加到 `document.body`），按分组标签列出当前已注册的全部快捷键。
 * 通过 `key` 输入属性指定的快捷键来切换显示。
 */
@Component({
    selector: "keyboard-shortcuts-help",
    templateUrl: "./keyboard-shortcuts-help.component.html",
    styleUrls: ["./keyboard-shortcuts-help.component.scss"],
    animations: [
        trigger("enterAnimation", [
            transition(":enter", [
                style({ transform: "translateX(-100%)", opacity: 0 }),
                animate(
                    "0.33s cubic-bezier(0,0,0.3,1)",
                    style({ transform: "translateX(0)", opacity: 1 })
                )
            ]),
            transition(":leave", [
                style({ transform: "translateX(0)", opacity: 1 }),
                animate(
                    "0.23s cubic-bezier(0,0,0.3,1)",
                    style({ transform: "translateX(-100%)", opacity: 0 })
                )
            ])
        ]),
        trigger("overlayAnimation", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("1s cubic-bezier(0,0,0.3,1)", style({ opacity: 1 }))
            ]),
            transition(":leave", [
                style({ opacity: 1 }),
                animate("1s cubic-bezier(0,0,0.3,1)", style({ opacity: 0 }))
            ])
        ])
    ]
})
export class KeyboardShortcutsHelpComponent implements OnInit, OnDestroy, OnChanges {

    /**
     * Disables page scrolling while the help panel is open.
     * @zh 帮助面板打开期间禁用页面滚动。
     */
    @Input() disableScrolling = true;

    private _key: string;

    /** @zh 应用到帮助面板宿主元素上的 CSS 类名。 */
    public className = "help-modal";


    /** @zh 切换本帮助面板的快捷键在帮助列表中显示的描述文字。 */
    @Input() keyDescription: string;


    /** @zh 切换本帮助面板的快捷键在帮助列表中显示的分组标签。 */
    @Input() keyLabel: string;


    /** @zh 关闭快捷键在帮助列表中显示的分组标签。 */
    @Input() closeKeyLabel: string;


    /** @zh 关闭快捷键在帮助列表中显示的描述文字。 */
    @Input() closeKeyDescription: string;


    /**
     * The shortcut key that toggles this help panel (e.g. `'shift+?'`).
     * @zh 用于切换本帮助面板的快捷键（例如 `'shift+?'`）。
     */
    @Input()
    set key(value: string) {
        this._key = value;
        if (!value) {
            return;
        }
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        this.clearIds = this.addShortcut({
            key: value,
            preventDefault: true,
            command: () => this.toggle(),
            description: this.keyDescription,
            label: this.keyLabel
        });
    }

    private addShortcut(shortcut: Shortcut) {
        return this.keyboard.add(shortcut);
    }

    private _closeKey;
    /**
     * The shortcut key that closes this help panel (registered/re-registered on change).
     * @zh 用于关闭本帮助面板的快捷键（变化时会重新注册）。
     */
    @Input() closeKey;


    /** @zh 帮助面板的标题（翻译键）。 */
    @Input() title = "COMMON.KEYBOARD_TITLE";

    /** @zh 没有已注册快捷键时显示的提示信息（翻译键）。 */
    @Input() emptyMessage = "COMMON.KEYBOARD_EMPTYMESSAGE";

    /** @zh 面板内容的模板引用，通过 portal 挂载到 `document.body`。 */
    @ViewChild(TemplateRef) template: TemplateRef<any>;

    /** @zh 按标签分组后的已注册快捷键。 */
    shortcuts: Record<"label", { key: string[]; label: string; description: string }[]>;

    /** @zh 帮助面板当前是否正在显示。 */
    showing$ = new BehaviorSubject(false);

    /** @zh 已注册快捷键的分组标签列表。 */
    labels: string[];

    private bodyPortalHost: DomPortalOutlet;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private keyboard: KeyboardShortcutsService,
        private element: ElementRef,
        private keyboardHelp: KeyboardShortcutsHelpService,
        private viewContainer: ViewContainerRef,
        private injector: Injector
    ) {
        this.bodyPortalHost = new DomPortalOutlet(
            document.body,
            this.componentFactoryResolver,
            this.appRef,
            this.injector
        );
    }


    /**
     * Shows the help panel (attaching it to `document.body` via a portal).
     * @zh 显示帮助面板（通过 portal 将其附加到 `document.body`）。
     */
    reveal(): KeyboardShortcutsHelpComponent {
        this.hide();
        if (this.disableScrolling) {
            disableScroll(`.${this.className}`);
        }
        const portal = new TemplatePortal(this.template, this.viewContainer);
        this.bodyPortalHost.attach(portal);
        this.showing$.next(true);
        return this;
    }


    /**
     * Whether the help panel is currently attached/visible.
     * @zh 帮助面板当前是否已附加/可见。
     */
    visible(): boolean {
        return this.bodyPortalHost.hasAttached();
    }

    /**
     * Hides the help panel (detaching it from the DOM).
     * @zh 隐藏帮助面板（将其从 DOM 中分离）。
     */
    hide(): KeyboardShortcutsHelpComponent {
        if (this.disableScrolling) {
            enableScroll();
        }
        if (!this.bodyPortalHost.hasAttached()) {
            return this;
        }
        this.bodyPortalHost.detach();
        this.showing$.next(false);
        return this;
    }


    ngOnDestroy(): void {
        this.hide();
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (this.closeKeyIds) {
            this.keyboard.remove(this.closeKeyIds);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.showing$.complete();
    }


    /**
     * Toggles the help panel between shown and hidden.
     * @zh 在显示与隐藏之间切换帮助面板。
     */
    toggle(): KeyboardShortcutsHelpComponent {
        this.visible() ? this.hide() : this.reveal();
        return this;
    }


    private subscription: SubscriptionLike;

    private clearIds;


    private closeKeyIds;

    private timeoutId;


    ngOnInit() {
        this.subscription = this.keyboardHelp.shortcuts$
            .pipe(
                distinctUntilChanged(),
                map((shortcuts) => groupBy(shortcuts, "label"))
            )
            .subscribe((shortcuts) => {
                this.shortcuts = shortcuts;
                this.labels = Object.keys(shortcuts);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes["closeKey"] || !changes["closeKey"].currentValue) {
            return;
        }
        if (this.closeKeyIds) {
            this.keyboard.remove(this.closeKeyIds);
        }
        this.closeKeyIds = this.addShortcut({
            key: changes["closeKey"].currentValue,
            preventDefault: true,
            command: () => this.hide(),
            description: this.closeKeyDescription,
            label: this.closeKeyDescription
        });
    }
}
