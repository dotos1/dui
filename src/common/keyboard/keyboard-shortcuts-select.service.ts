/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts-select.service.ts` providing keyboard shortcuts select service definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts-select.service.ts`，提供键盘快捷键列表下拉选择服务相关的定义与实现。
 */

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
    /**
     * Creates an instance of `KeyboardShortcutsSelectService` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsSelectService` 实例，并初始化其依赖项与内部状态。
     * @param keyboardService - Injected or initial keyboard service (`KeyboardShortcutsService`) / 注入或传入的键盘服务（`KeyboardShortcutsService`）
     */
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
