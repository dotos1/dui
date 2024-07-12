import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';

@Injectable({
    providedIn: 'root'
})

export class KeyboardShortcutsSelectService {
    constructor(private keyboardService: KeyboardShortcutsService) {
    }

    public select(key: string) {
        return this.keyboardService.select(key);
    }
}
