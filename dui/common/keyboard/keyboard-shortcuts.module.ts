import { ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";

import { TranslateModule, TranslationService } from "@dotos/dui/i18n";
import {KeyboardShortcutsComponent} from "./keyboard-shortcuts.component";
import {KeyboardShortcutsService} from "./keyboard-shortcuts.service";
import {KeyboardShortcutsHelpService} from "./keyboard-shortcuts-help.service";
import {KeyboardShortcutsSelectService} from "./keyboard-shortcuts-select.service";
import {KeyboardShortcutsDirective} from "./keyboard-shortcuts.directive";
import {KeyboardShortcutsHelpComponent} from "./keyboard-shortcuts-help.component";
import {KeyboardShortcutsHelpItemComponent} from "./keyboard-shortcuts-help-item.component";
import {KeyboardShortcutsPlugin} from "./keyboard-shortcuts.plugin";
import {KeyboardShortcutComponent} from "./keyboard-shortcut.component";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent,
        KeyboardShortcutsHelpItemComponent,
        KeyboardShortcutComponent
    ],
    exports: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent,
        KeyboardShortcutComponent
    ]
})
export class KeyboardShortcutsModule {
    constructor( translateService: TranslationService) {
        translateService.addTranslationFolder('dui', 'i18n');
    }
    public static forRoot(): ModuleWithProviders<KeyboardShortcutsModule> {
        return {
            ngModule: KeyboardShortcutsModule,
            providers: [
                KeyboardShortcutsService,
                KeyboardShortcutsHelpService,
                KeyboardShortcutsSelectService,
                {
                    multi: true,
                    provide: EVENT_MANAGER_PLUGINS,
                    useClass: KeyboardShortcutsPlugin
                }
            ]
        };
    }
}
