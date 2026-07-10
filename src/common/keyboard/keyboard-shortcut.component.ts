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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardShortcutComponent implements AfterViewInit, OnDestroy {
    constructor(public keyboard: KeyboardShortcutsService) {}
    private clearId;

    @Input() description: string;
    @Input() label: string;
    @Input() preventDefault: boolean;
    @Input() allowIn: AllowIn[];
    @Input() key: string | string[];
    @Input() target: HTMLElement;
    @Input() throttleTime: number;

    @Output() fire = new EventEmitter();


    ngOnDestroy(): void {
        this.keyboard.remove(this.clearId);
    }

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
