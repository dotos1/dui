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

    /** @zh 快捷键的描述文字（显示在帮助面板中）。 */
    @Input() description: string;
    /** @zh 快捷键的分组/标签文字（显示在帮助面板中）。 */
    @Input() label: string;
    /** @zh 触发时是否阻止按键的默认行为。 */
    @Input() preventDefault: boolean;
    /** @zh 允许该快捷键在哪些元素类型（如 input、textarea、select）内触发。 */
    @Input() allowIn: AllowIn[];
    /** @zh 触发该快捷键的按键组合，可以是单个或多个。 */
    @Input() key: string | string[];
    /** @zh 监听按键事件的目标元素，默认为整个文档。 */
    @Input() target: HTMLElement;
    /** @zh 触发节流时间（毫秒）。 */
    @Input() throttleTime: number;

    /** @zh 快捷键被触发时发出。 */
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
