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
