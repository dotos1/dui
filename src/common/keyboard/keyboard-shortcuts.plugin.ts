/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.plugin.ts` providing keyboard shortcuts plugin definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.plugin.ts`，提供键盘快捷键列表plugin相关的定义与实现。
 */

import {Injectable, NgZone} from "@angular/core";
import { EventManager} from "@angular/platform-browser";
import {KeyboardShortcutsService} from './keyboard-shortcuts.service';
import {ShortcutEventOutput} from './keyboard-shortcuts.interfaces';


/**
 * Angular `EventManager` plugin that lets templates bind shortcuts declaratively via
 * `(shortcut.<key>.<description>.<label>)="handler()"` (optionally `.prevent`), backed by
 * {@link KeyboardShortcutsService}.
 * @zh Angular `EventManager` 插件，允许模板通过
 * `(shortcut.<key>.<description>.<label>)="handler()"`（可加 `.prevent`）声明式绑定快捷键，
 * 底层基于 {@link KeyboardShortcutsService}。
 */
@Injectable()
export class KeyboardShortcutsPlugin {
    /**
     * @zh Angular 注入的事件管理器，用于委托不支持的事件类型。
     * @zh Angular 注入的事件管理器，用于委托不支持的事件类型。
     */
    manager: EventManager;

    /**
     * Creates an instance of `KeyboardShortcutsPlugin` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsPlugin` 实例，并初始化其依赖项与内部状态。
     * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
     * @param keyboard - Injected or initial keyboard (`KeyboardShortcutsService`) / 注入或传入的键盘（`KeyboardShortcutsService`）
     */
    constructor(private ngZone: NgZone, private keyboard: KeyboardShortcutsService) {
    }

    /**
     * Whether this plugin handles the given event name (any event containing `.shortcut.`).
     * @zh 判断该插件是否处理给定事件名称（包含 `.shortcut.` 的任意事件）。
     */
    supports(eventName: string): boolean {
        return eventName.split('.').includes('shortcut')
    }

    /**
     * Parses a `shortcut.<key>.<description>.<label>` event binding and registers the
     * corresponding keyboard shortcut, returning an unregister function.
     * @zh 解析 `shortcut.<key>.<description>.<label>` 事件绑定，注册对应的键盘快捷键，
     * 并返回一个用于注销的函数。
     */
    addEventListener(
        element,
        eventName,
        originalHandler
    ): Function {
        const shortcut = eventName
            .split('.')

        const preventDefault = shortcut.includes("prevent");
        if (shortcut.length === 0)  {
            throw new Error("please provide a shortcut");
        }
        const [,key, description, label] = shortcut;
        const id = this.keyboard.add({
            key,
            command(event: ShortcutEventOutput) {
                originalHandler(event)
            },
            description,
            preventDefault,
            label
        })
        return () => {
            this.keyboard.remove(id);
        };
    }
}
