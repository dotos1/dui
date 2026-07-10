import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';
import {map} from 'rxjs/operators';


/**
 * Exposes an observable list of registered {@link KeyboardShortcutsService} shortcuts that
 * have both a `label` and `description`, suitable for rendering in a help/cheat-sheet panel.
 * @zh 暴露一个可观察的快捷键列表（来自 {@link KeyboardShortcutsService}），
 * 仅包含同时具有 `label` 和 `description` 的项，适合在帮助/速查面板中展示。
 */
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
