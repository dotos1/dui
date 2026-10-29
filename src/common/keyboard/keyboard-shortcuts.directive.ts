/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.directive.ts` providing keyboard shortcuts directive definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.directive.ts`，提供键盘快捷键列表指令相关的定义与实现。
 */

import {Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {AllowIn, Shortcut} from './keyboard-shortcuts.interfaces';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';


/**
 * Registers a list of {@link KeyboardShortcutsService} shortcuts (`ngKeyboardShortcuts`) scoped
 * to the host element, re-registering whenever the input changes and toggleable via `disabled`.
 * @zh 注册一组作用域限定于宿主元素的 {@link KeyboardShortcutsService} 快捷键
 * （`ngKeyboardShortcuts`），输入变化时会重新注册，并可通过 `disabled` 开关。
 */
@Directive({
    selector: '[KeyboardShortcuts]'
})
export class KeyboardShortcutsDirective implements OnDestroy, OnChanges {

    /**
     * Property `clearIds` (`any`) storing clear ids.
     * @zh 属性 `clearIds`（类型：`any`），用于存储或配置清空标识列表。
     */
    private clearIds;

    /**
     * The shortcut(s) to register, scoped to the host element (auto-allowed inside
     * select/input/textarea elements).
     * @zh 要注册的快捷键，作用域限定于宿主元素（自动允许在 select/input/textarea 元素内触发）。
     */
    @Input() ngKeyboardShortcuts: Shortcut[];

    /**
     * Property `_disabled` (`boolean`) storing disabled (default: `false`).
     * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
     */
    private _disabled = false;


    /**
     * Disables (and unregisters) all shortcuts when set to `true`.
     * @zh 设为 `true` 时禁用（并注销）全部快捷键。
     */
    @Input() set disabled(value) {
        this._disabled = value;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        setTimeout(() => {
            if (value === false && this.ngKeyboardShortcuts) {
                this.clearIds = this.keyboard.add(this.transformInput(this.ngKeyboardShortcuts));
            }
        });

    }


    /**
     * Creates an instance of `KeyboardShortcutsDirective` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsDirective` 实例，并初始化其依赖项与内部状态。
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
     */
    constructor(private keyboard: KeyboardShortcutsService, private el: ElementRef) {
    }

    /**
     * Executes `transformInput` to handle transform input.
     * @zh 执行 `transformInput`，用于转换输入属性。
     * @param shortcuts - shortcuts parameter (`Shortcut[]`) / 快捷键列表参数（`Shortcut[]`）
     */
    private transformInput(shortcuts: Shortcut[]) {
        return shortcuts.map(shortcut => ({
            ...shortcut,
            target: this.el.nativeElement,
            allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea]
        }));
    }


    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy() {
        if (!this.clearIds) {
            return;
        }
        this.keyboard.remove(this.clearIds);
    }


    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
     */
    ngOnChanges(changes: SimpleChanges) {
        const {ngKeyboardShortcuts} = changes;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (!ngKeyboardShortcuts || !ngKeyboardShortcuts.currentValue) {
            return;
        }
        this.clearIds = this.keyboard.add(this.transformInput(ngKeyboardShortcuts.currentValue));
    }
}
