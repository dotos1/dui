import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';

/**
 * Thin wrapper exposing {@link KeyboardShortcutsService.select} for programmatically
 * triggering a registered shortcut by key.
 * @zh 轻量封装，暴露 {@link KeyboardShortcutsService.select}，用于按键值以编程方式触发已注册的快捷键。
 */
@Injectable({
    providedIn: 'root'
})

export class KeyboardShortcutsSelectService {
    constructor(private keyboardService: KeyboardShortcutsService) {
    }

    /**
     * Returns an observable that emits whenever the shortcut registered under `key` fires.
     * @zh 返回一个 Observable，当以 `key` 注册的快捷键被触发时发出。
     */
    public select(key: string) {
        return this.keyboardService.select(key);
    }
}
