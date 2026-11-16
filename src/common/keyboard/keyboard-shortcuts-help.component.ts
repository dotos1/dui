/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts-help.component.ts` providing keyboard shortcuts help component definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts-help.component.ts`，提供键盘快捷键列表help组件相关的定义与实现。
 */

import {
    ApplicationRef,
    Component,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef, ChangeDetectionStrategy
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


/**
 * Constant/variable `scrollAbleKeys` defining scroll able keys in `src/common/keyboard`.
 * @zh 常量/变量 `scrollAbleKeys`，定义 `src/common/keyboard` 中的滚动Able键列表。
 */
const scrollAbleKeys = new Map([
    [31, 1],
    [38, 1],
    [39, 1],
    [40, 1]
]);

/**
 * Constant/variable `preventDefault` defining prevent default in `src/common/keyboard`.
 * @zh 常量/变量 `preventDefault`，定义 `src/common/keyboard` 中的阻止默认默认。
 */
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

/**
 * Constant/variable `preventDefaultForScrollKeys` defining prevent default for scroll keys in `src/common/keyboard`.
 * @zh 常量/变量 `preventDefaultForScrollKeys`，定义 `src/common/keyboard` 中的阻止默认默认用于滚动键列表。
 */
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

/**
 * Constant/variable `scrollEvents` defining scroll events in `src/common/keyboard`.
 * @zh 常量/变量 `scrollEvents`，定义 `src/common/keyboard` 中的滚动事件集合。
 */
let scrollEvents = [
    { name: "wheel", callback: null },
    { name: "touchmove", callback: null },
    { name: "DOMMouseScroll", callback: null }
];


/**
 * Constant/variable `disableScroll` defining disable scroll in `src/common/keyboard`.
 * @zh 常量/变量 `disableScroll`，定义 `src/common/keyboard` 中的禁用滚动。
 */
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

/**
 * Constant/variable `enableScroll` defining enable scroll in `src/common/keyboard`.
 * @zh 常量/变量 `enableScroll`，定义 `src/common/keyboard` 中的启用滚动。
 */
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
    ],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class KeyboardShortcutsHelpComponent implements OnInit, OnDestroy, OnChanges {

    /**
     * Disables page scrolling while the help panel is open.
     * @zh 帮助面板打开期间禁用页面滚动。
     */
    @Input() disableScrolling = true;

    /**
     * Property `_key` (`string`) storing key.
     * @zh 属性 `_key`（类型：`string`），用于存储或配置键。
     */
    private _key: string;

    /**
     * @zh 应用到帮助面板宿主元素上的 CSS 类名。
     * @zh 应用到帮助面板宿主元素上的 CSS 类名。
     */
    public className = "help-modal";


    /**
     * Input property `keyDescription` (`string`) configuring key description.
     * @zh 切换本帮助面板的快捷键在帮助列表中显示的描述文字。
     * @zh 切换本帮助面板的快捷键在帮助列表中显示的描述文字。
     */
    @Input() keyDescription: string;


    /**
     * Input property `keyLabel` (`string`) configuring key label.
     * @zh 切换本帮助面板的快捷键在帮助列表中显示的分组标签。
     * @zh 切换本帮助面板的快捷键在帮助列表中显示的分组标签。
     */
    @Input() keyLabel: string;


    /**
     * Input property `closeKeyLabel` (`string`) configuring close key label.
     * @zh 关闭快捷键在帮助列表中显示的分组标签。
     * @zh 关闭快捷键在帮助列表中显示的分组标签。
     */
    @Input() closeKeyLabel: string;


    /**
     * Input property `closeKeyDescription` (`string`) configuring close key description.
     * @zh 关闭快捷键在帮助列表中显示的描述文字。
     * @zh 关闭快捷键在帮助列表中显示的描述文字。
     */
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

    /**
     * Executes `addShortcut` to handle add shortcut.
     * @zh 执行 `addShortcut`，用于添加快捷键。
     * @param shortcut - shortcut parameter (`Shortcut`) / 快捷键参数（`Shortcut`）
     */
    private addShortcut(shortcut: Shortcut) {
        return this.keyboard.add(shortcut);
    }

    /**
     * Property `_closeKey` (`any`) storing close key.
     * @zh 属性 `_closeKey`（类型：`any`），用于存储或配置关闭键。
     */
    private _closeKey;
    /**
     * The shortcut key that closes this help panel (registered/re-registered on change).
     * @zh 用于关闭本帮助面板的快捷键（变化时会重新注册）。
     */
    @Input() closeKey;


    /**
     * Input property `title` (`string`) configuring title (default: `"COMMON.KEYBOARD_TITLE"`).
     * @zh 帮助面板的标题（翻译键）。
     * @zh 帮助面板的标题（翻译键）。
     */
    @Input() title = "COMMON.KEYBOARD_TITLE";

    /**
     * Input property `emptyMessage` (`string`) configuring empty message (default: `"COMMON.KEYBOARD_EMPTYMESSAGE"`).
     * @zh 没有已注册快捷键时显示的提示信息（翻译键）。
     * @zh 没有已注册快捷键时显示的提示信息（翻译键）。
     */
    @Input() emptyMessage = "COMMON.KEYBOARD_EMPTYMESSAGE";

    /**
     * @zh 面板内容的模板引用，通过 portal 挂载到 `document.body`。
     * @zh 面板内容的模板引用，通过 portal 挂载到 `document.body`。
     */
    @ViewChild(TemplateRef) template: TemplateRef<unknown>;

    /**
     * Property `shortcuts` (`Record<"label", { key: string[]; label: string; description: string; }[]>`) storing shortcuts.
     * @zh 按标签分组后的已注册快捷键。
     * @zh 按标签分组后的已注册快捷键。
     */
    shortcuts: Record<"label", { key: string[]; label: string; description: string }[]>;

    /**
     * Property `showing$` (`BehaviorSubject<boolean>`) storing showing (default: `new BehaviorSubject(false)`).
     * @zh 帮助面板当前是否正在显示。
     * @zh 帮助面板当前是否正在显示。
     */
    showing$ = new BehaviorSubject(false);

    /**
     * Property `labels` (`string[]`) storing labels.
     * @zh 已注册快捷键的分组标签列表。
     * @zh 已注册快捷键的分组标签列表。
     */
    labels: string[];

    /**
     * Property `bodyPortalHost` (`DomPortalOutlet`) storing body portal host.
     * @zh 属性 `bodyPortalHost`（类型：`DomPortalOutlet`），用于存储或配置主体传送门容器宿主。
     */
    private bodyPortalHost: DomPortalOutlet;

    /**
     * Creates an instance of `KeyboardShortcutsHelpComponent` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsHelpComponent` 实例，并初始化其依赖项与内部状态。
     * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
     * @param appRef - Injected or initial app ref (`ApplicationRef`) / 注入或传入的app引用（`ApplicationRef`）
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
     * @param keyboardHelp - Injected or initial keyboard help (`KeyboardShortcutsHelpService`) / 注入或传入的键盘Help（`KeyboardShortcutsHelpService`）
     * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        private appRef: ApplicationRef,
        private keyboard: KeyboardShortcutsService,
        private element: ElementRef,
        private keyboardHelp: KeyboardShortcutsHelpService,
        private viewContainer: ViewContainerRef,
        private injector: Injector
    ) {
        this.bodyPortalHost = new DomPortalOutlet(
            document.body,
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


    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
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


    /**
     * Property `subscription` (`SubscriptionLike`) storing subscription.
     * @zh 属性 `subscription`（类型：`SubscriptionLike`），用于存储或配置订阅对象。
     */
    private subscription: SubscriptionLike;

    /**
     * Property `clearIds` (`any`) storing clear ids.
     * @zh 属性 `clearIds`（类型：`any`），用于存储或配置清空标识列表。
     */
    private clearIds;


    /**
     * Property `closeKeyIds` (`any`) storing close key ids.
     * @zh 属性 `closeKeyIds`（类型：`any`），用于存储或配置关闭键标识列表。
     */
    private closeKeyIds;

    /**
     * Property `timeoutId` (`any`) storing timeout id.
     * @zh 属性 `timeoutId`（类型：`any`），用于存储或配置延时器唯一标识。
     */
    private timeoutId;


    /**
     * Angular lifecycle hook invoked once after component or directive inputs are initialized.
     * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
     */
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

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
     */
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
