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
    manager: EventManager;

    constructor(private ngZone: NgZone, private keyboard: KeyboardShortcutsService) {
    }

    supports(eventName: string): boolean {
        return eventName.split('.').includes('shortcut')
    }

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
            command(event: ShortcutEventOutput): any {
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
