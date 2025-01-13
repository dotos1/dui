import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class KeyboardShortcutsHelpService {

    constructor(private keyboard: KeyboardShortcutsService) {
    }

    public shortcuts$ = this.keyboard.shortcuts$.pipe(
        map(shortcuts =>
            shortcuts
                .filter(shortcut => Boolean(shortcut.label) && Boolean(shortcut.description))
                .map(({key, label, description}) => ({
                    key,
                    label,
                    description
                }))
        )
    );
}
