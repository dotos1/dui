/**
 * @fileoverview Module `src/translator/translate.module.ts` providing translate module definitions and implementation.
 * @zh 模块文件 `src/translator/translate.module.ts`，提供翻译模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders, Provider } from "@angular/core";
import { TranslateLoader, TranslateFakeLoader } from "./translate.loader";
import { MissingTranslationHandler, FakeMissingTranslationHandler } from "./missing-translation-handler";
import { TranslateParser, TranslateDefaultParser } from "./translate.parser";
import { TranslateCompiler, TranslateFakeCompiler } from "./translate.compiler";
import { TranslateDirective } from "./translate.directive";
import { TranslatePipe } from "./translate.pipe";
import { TranslateStore } from "./translate.store";
import {
  USE_DEFAULT_LANG, DEFAULT_LANGUAGE, USE_STORE,
  TranslateService, USE_EXTEND
} from "./translate.service";

import { TranslateLoaderService } from './translate-loader.service';
import { TranslateGuard } from "./translate.guard";
import { TranslateHttpLoader } from "./http-loader";


/**
 * Interface `TranslateModuleConfig` defining the contract and properties for translate module config.
 * @zh 接口 `TranslateModuleConfig`，定义翻译模块配置的数据结构契约与属性规范。
 */
export interface TranslateModuleConfig {
  /**
   * Property `loader` (`Provider`) storing loader.
   * @zh 属性 `loader`（类型：`Provider`），用于存储或配置加载器。
   */
  loader?: Provider;
  /**
   * Property `compiler` (`Provider`) storing compiler.
   * @zh 属性 `compiler`（类型：`Provider`），用于存储或配置compiler。
   */
  compiler?: Provider;
  /**
   * Property `parser` (`Provider`) storing parser.
   * @zh 属性 `parser`（类型：`Provider`），用于存储或配置解析器。
   */
  parser?: Provider;
  /**
   * Property `missingTranslationHandler` (`Provider`) storing missing translation handler.
   * @zh 属性 `missingTranslationHandler`（类型：`Provider`），用于存储或配置missing翻译文本处理器。
   */
  missingTranslationHandler?: Provider;
  // isolate the service instance, only works for lazy loaded modules or components with the "providers" property
  /**
   * Property `isolate` (`boolean`) storing isolate.
   * @zh 属性 `isolate`（类型：`boolean`），用于存储或配置isolate。
   */
  isolate?: boolean;
  // extends translations for a given language instead of ignoring them if present
  /**
   * Property `extend` (`boolean`) storing extend.
   * @zh 属性 `extend`（类型：`boolean`），用于存储或配置extend。
   */
  extend?: boolean;
  /**
   * Property `useDefaultLang` (`boolean`) storing use default lang.
   * @zh 属性 `useDefaultLang`（类型：`boolean`），用于存储或配置使用默认语言。
   */
  useDefaultLang?: boolean;
  /**
   * Property `defaultLanguage` (`string`) storing default language.
   * @zh 属性 `defaultLanguage`（类型：`string`），用于存储或配置默认语言。
   */
  defaultLanguage?: string;
}

/**
 * Angular module `TranslateModule` declaring and exporting translate module components, directives, pipes, and providers.
 * @zh Angular 模块 `TranslateModule`，声明并导出翻译模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({

  declarations: [
    TranslatePipe,
    TranslateDirective
  ],
  exports: [
    TranslatePipe,
    TranslateDirective
  ]
})
export class TranslateModule {
  /**
   * Use this method in your root module to provide the TranslateService

   * @zh 执行 `forRoot`，用于用于根节点。
   */
  static forRoot(config: TranslateModuleConfig = {}): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [
        config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
        config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
        config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
        config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
        TranslateStore,
        { provide: USE_STORE, useValue: config.isolate },
        { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
        { provide: USE_EXTEND, useValue: config.extend },
        { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
        TranslateService,
        TranslateGuard,
        TranslateHttpLoader,
        TranslateLoaderService
      ]
    };
  }

  /**
   * Use this method in your other (non root) modules to import the directive/pipe

   * @zh 执行 `forChild`，用于用于子级。
   */
  static forChild(config: TranslateModuleConfig = {}): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [
        config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
        config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
        config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
        config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
        { provide: USE_STORE, useValue: config.isolate },
        { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
        { provide: USE_EXTEND, useValue: config.extend },
        { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
        TranslateService,
        TranslateGuard
      ]
    };
  }
}
