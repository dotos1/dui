/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts-help.service.ts` providing keyboard shortcuts help service definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts-help.service.ts`，提供键盘快捷键列表help服务相关的定义与实现。
 */

import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';
import {Observable} from 'rxjs';
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

    /**
     * Emits the list of registered shortcuts that have both a `label` and `description`.
     * @zh 发出同时具有 `label` 和 `description` 的已注册快捷键列表。
     */
    public shortcuts$: Observable<{ key: string[]; label: string; description: string }[]>;

    /**
     * Creates an instance of `KeyboardShortcutsHelpService` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsHelpService` 实例，并初始化其依赖项与内部状态。
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     */
    constructor(private keyboard: KeyboardShortcutsService) {
        this.shortcuts$ = this.keyboard.shortcuts$.pipe(
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
}
