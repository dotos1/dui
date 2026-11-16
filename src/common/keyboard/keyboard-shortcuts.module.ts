/**
 * @fileoverview Module `src/common/keyboard/keyboard-shortcuts.module.ts` providing keyboard shortcuts module definitions and implementation.
 * @zh 模块文件 `src/common/keyboard/keyboard-shortcuts.module.ts`，提供键盘快捷键列表模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";

import { TranslateModule, TranslationService } from "@dotos1/dui/translator";
import {KeyboardShortcutsComponent} from "./keyboard-shortcuts.component";
import {KeyboardShortcutsService} from "./keyboard-shortcuts.service";
import {KeyboardShortcutsHelpService} from "./keyboard-shortcuts-help.service";
import {KeyboardShortcutsSelectService} from "./keyboard-shortcuts-select.service";
import {KeyboardShortcutsDirective} from "./keyboard-shortcuts.directive";
import {KeyboardShortcutsHelpComponent} from "./keyboard-shortcuts-help.component";
import {KeyboardShortcutsHelpItemComponent} from "./keyboard-shortcuts-help-item.component";
import {KeyboardShortcutsPlugin} from "./keyboard-shortcuts.plugin";
import {KeyboardShortcutComponent} from "./keyboard-shortcut.component";

/**
 * Angular module `KeyboardShortcutsModule` declaring and exporting keyboard shortcuts module components, directives, pipes, and providers.
 * @zh Angular 模块 `KeyboardShortcutsModule`，声明并导出键盘快捷键列表模块相关的组件、指令、管道与服务提供者。
 */
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
    /**
     * Creates an instance of `KeyboardShortcutsModule` and initializes its dependencies and internal state.
     * @zh 创建 `KeyboardShortcutsModule` 实例，并初始化其依赖项与内部状态。
     * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
     */
    constructor( translateService: TranslationService) {
        translateService.addTranslationFolder('dui', 'i18n');
    }
    /**
     * Executes `forRoot` to handle for root.
     * @zh 执行 `forRoot`，用于用于根节点。
     * @returns Result of type `ModuleWithProviders<KeyboardShortcutsModule>` / 类型为 `ModuleWithProviders<KeyboardShortcutsModule>` 的返回值
     */
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
