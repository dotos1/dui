/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcut.component.ts` providing keyboard shortcut component definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcut.component.ts`，提供键盘快捷键组件相关的定义与实现。
 */

import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnDestroy,
    AfterViewInit,
    Output,
    EventEmitter
} from '@angular/core';
import {AllowIn, ShortcutEventOutput} from './keyboard-shortcuts.interfaces';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';

/**
 * Declarative wrapper around {@link KeyboardShortcutsService.add}: registers a shortcut for
 * the projected content's lifetime and emits `fire` when it's triggered.
 * @zh {@link KeyboardShortcutsService.add} 的声明式封装：在投影内容存续期间注册快捷键，
 * 触发时发出 `fire` 事件。
 */
@Component({
    selector: "keyboard-shortcut",
    template: "<ng-content ></ng-content>",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class KeyboardShortcutComponent implements AfterViewInit, OnDestroy {
    /**
     * Creates an instance of `KeyboardShortcutComponent` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutComponent` 实例，并初始化其依赖项与内部状态。
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     */
    constructor(public keyboard: KeyboardShortcutsService) {}
    /**
     * Property `clearId` (`any`) storing clear id.
     * @zh 属性 `clearId`（类型：`any`），用于存储或配置清空唯一标识。
     */
    private clearId;

    /**
     * Input property `description` (`string`) configuring description.
     * @zh 快捷键的描述文字（显示在帮助面板中）。
     * @zh 快捷键的描述文字（显示在帮助面板中）。
     */
    @Input() description: string;
    /**
     * Input property `label` (`string`) configuring label.
     * @zh 快捷键的分组/标签文字（显示在帮助面板中）。
     * @zh 快捷键的分组/标签文字（显示在帮助面板中）。
     */
    @Input() label: string;
    /**
     * Input property `preventDefault` (`boolean`) configuring prevent default.
     * @zh 触发时是否阻止按键的默认行为。
     * @zh 触发时是否阻止按键的默认行为。
     */
    @Input() preventDefault: boolean;
    /**
     * @zh 允许该快捷键在哪些元素类型（如 input、textarea、select）内触发。
     * @zh 允许该快捷键在哪些元素类型（如 input、textarea、select）内触发。
     */
    @Input() allowIn: AllowIn[];
    /**
     * Input property `key` (`string | string[]`) configuring key.
     * @zh 触发该快捷键的按键组合，可以是单个或多个。
     * @zh 触发该快捷键的按键组合，可以是单个或多个。
     */
    @Input() key: string | string[];
    /**
     * Input property `target` (`HTMLElement`) configuring target.
     * @zh 监听按键事件的目标元素，默认为整个文档。
     * @zh 监听按键事件的目标元素，默认为整个文档。
     */
    @Input() target: HTMLElement;
    /**
     * Input property `throttleTime` (`number`) configuring throttle time.
     * @zh 触发节流时间（毫秒）。
     * @zh 触发节流时间（毫秒）。
     */
    @Input() throttleTime: number;

    /**
     * Output event emitter `fire` (`EventEmitter<any>`) firing when fire occurs.
     * @zh 快捷键被触发时发出。
     * @zh 快捷键被触发时发出。
     */
    @Output() fire = new EventEmitter();


    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        this.keyboard.remove(this.clearId);
    }

    /**
     * Angular lifecycle hook invoked once after the component's view and child views are initialized.
     * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
     */
    ngAfterViewInit(): void {
        this.clearId = this.keyboard.add({
            description: this.description,
            label: this.label,
            preventDefault: this.preventDefault,
            allowIn: this.allowIn,
            target: this.target,
            key: this.key,
            throttleTime: this.throttleTime,
            command: (event: ShortcutEventOutput) => {
                this.fire.emit(event);
            }
        })
    }
}
