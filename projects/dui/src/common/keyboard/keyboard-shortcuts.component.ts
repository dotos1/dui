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

@Component({
    selector: 'keyboard-shortcuts',
    template: ''
})
export class KeyboardShortcutsComponent implements OnChanges, OnDestroy {

    @Input() shortcuts: ShortcutInput[] | ShortcutInput = [];

    private clearIds: string[] = [];


    private _disabled = false;

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
