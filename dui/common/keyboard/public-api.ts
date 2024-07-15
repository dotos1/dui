
import "./polyfills";

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

