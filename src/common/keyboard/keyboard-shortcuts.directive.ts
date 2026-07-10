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

    private clearIds;

    @Input() ngKeyboardShortcuts: Shortcut[];

    private _disabled = false;


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


    constructor(private keyboard: KeyboardShortcutsService, private el: ElementRef) {
    }

    private transformInput(shortcuts: Shortcut[]) {
        return shortcuts.map(shortcut => ({
            ...shortcut,
            target: this.el.nativeElement,
            allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea]
        }));
    }


    ngOnDestroy() {
        if (!this.clearIds) {
            return;
        }
        this.keyboard.remove(this.clearIds);
    }


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
