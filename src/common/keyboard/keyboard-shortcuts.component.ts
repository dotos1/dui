import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
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
    template: ''
})
export class KeyboardShortcutsComponent implements OnChanges, OnDestroy {

    /**
     * The shortcut(s) to register while this component is alive and not disabled.
     * @zh 本组件存活且未被禁用期间要注册的快捷键。
     */
    @Input() shortcuts: ShortcutInput[] | ShortcutInput = [];

    private clearIds: string[] = [];


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


    constructor(private keyboard: KeyboardShortcutsService) {
    }

    /**
     * Returns an observable that emits whenever the shortcut with the given key fires.
     * @zh 返回一个 Observable，在给定按键组合的快捷键被触发时发出事件。
     */
    public select(key: string): Observable<ShortcutEventOutput> {
        return this.keyboard.select(key);
    }

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

    ngOnDestroy(): void {
        this.keyboard.remove(this.clearIds);
    }
}
