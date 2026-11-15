/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.component.ts` providing keyboard shortcuts component definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.component.ts`，提供键盘快捷键列表组件相关的定义与实现。
 */

import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';
import {ShortcutInput, ShortcutEventOutput} from './keyboard-shortcuts.interfaces';
import {Observable} from 'rxjs';

/**
 * Declarative wrapper around {@link KeyboardShortcutsService}: bind a list of shortcuts via
 * the `shortcuts` input and they are registered/unregistered automatically with this component's
 * lifecycle.
 * @zh {@link KeyboardShortcutsService} 的声明式封装：通过 `shortcuts` 输入属性绑定一组快捷键，
 * 它们会随本组件的生命周期自动注册/注销。
 */
@Component({
    selector: 'keyboard-shortcuts',
    template: '',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class KeyboardShortcutsComponent implements OnChanges, OnDestroy {

    /**
     * The shortcut(s) to register while this component is alive and not disabled.
     * @zh 本组件存活且未被禁用期间要注册的快捷键。
     */
    @Input() shortcuts: ShortcutInput[] | ShortcutInput = [];

    /**
     * Property `clearIds` (`string[]`) storing clear ids (default: `[]`).
     * @zh 属性 `clearIds`（类型：`string[]`），用于存储或配置清空标识列表（默认值：`[]`）。
     */
    private clearIds: string[] = [];


    /**
     * Property `_disabled` (`boolean`) storing disabled (default: `false`).
     * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
     */
    private _disabled = false;

    /**
     * Disables (and unregisters) all shortcuts when set to true.
     * @zh 设为 true 时禁用（并注销）全部快捷键。
     */
    @Input() set disabled(value) {
        this._disabled = value;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
            this.clearIds = [];
        }
        if (value) {
            return;
        }
        this.clearIds = this.keyboard.add(this.shortcuts);
    }


    /**
     * Creates an instance of `KeyboardShortcutsComponent` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsComponent` 实例，并初始化其依赖项与内部状态。
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     */
    constructor(private keyboard: KeyboardShortcutsService) {
    }

    /**
     * Returns an observable that emits whenever the shortcut with the given key fires.
     * @zh 返回一个 Observable，在给定按键组合的快捷键被触发时发出事件。
     */
    public select(key: string): Observable<ShortcutEventOutput> {
        return this.keyboard.select(key);
    }

    /**
     * Angular lifecycle hook invoked when data-bound input properties change.
     * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
     * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
     */
    ngOnChanges(changes: SimpleChanges): void {
       if (!changes['shortcuts'] || !changes['shortcuts'].currentValue) {
            return;
        }
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (!this._disabled) {
            setTimeout(() => (this.clearIds = this.keyboard.add(changes['shortcuts'].currentValue)));
        }
    }

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    ngOnDestroy(): void {
        this.keyboard.remove(this.clearIds);
    }
}
