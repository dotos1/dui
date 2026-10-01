
(function () {
    if (typeof Element === 'undefined') {
        return;
    }
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this;

            do {
                if (el.matches(s)) {
                    return el;
                }
                //@ts-ignore
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
})();

if (!(Array.prototype as any).flat) {
    (Array.prototype as any).flat = function (depth) {
        let flattend = [];
        (function flat(array, depth) {
            for (let el of array) {
                if (Array.isArray(el) && depth > 0) {
                    flat(el, depth - 1);
                } else {
                    flattend.push(el);
                }
            }
        })(this, Math.floor(depth) || 1);
        return flattend;
    };
}
if (!(Array.prototype as any).flatMap) {
    (Array.prototype as any).flatMap = function () {
       //@ts-ignore
        return Array.prototype.map.apply(this, arguments).flat(1);
    };
}



export * from "./dom-portal-outlet";
export * from "./keyboard-shortcut.component";
export * from "./keyboard-shortcuts-help-item.component";

export { KeyboardShortcutsHelpComponent } from "./keyboard-shortcuts-help.component";
export { KeyboardShortcutsHelpService } from "./keyboard-shortcuts-help.service";
export { KeyboardShortcutsSelectService } from "./keyboard-shortcuts-select.service";
export { KeyboardShortcutsComponent } from "./keyboard-shortcuts.component";
export { KeyboardShortcutsDirective } from "./keyboard-shortcuts.directive";

export {
    ShortcutInput,
    ShortcutEventOutput,
    AllowIn,
    Shortcut as ShortcutDirectiveInput
} from "./keyboard-shortcuts.interfaces";

export { KeyboardShortcutsModule } from "./keyboard-shortcuts.module";
export * from "./keyboard-shortcuts.plugin";
export { KeyboardShortcutsService } from "./keyboard-shortcuts.service";


export * from "./portal";
export * from "./utils";

