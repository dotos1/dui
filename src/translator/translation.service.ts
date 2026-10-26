/**
 * @fileoverview Module `src/translator/translation.service.ts` providing translation service definitions and implementation.
 * @zh 模块文件 `src/translator/translation.service.ts`，提供翻译文本服务相关的定义与实现。
 */


import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieStorage } from '@dotos/dui/core/cookie';
import { TranslateService } from './translate.service';
import { TranslateLoaderService } from './translate-loader.service';
/**
 * Angular dependency-injection token `TRANSLATION_PROVIDER` for providing translation provider.
 * @zh Angular 依赖注入令牌 `TRANSLATION_PROVIDER`，用于提供与注入翻译文本提供者。
 */
export const TRANSLATION_PROVIDER = new InjectionToken('Injection token for translation providers.');

/**
 * Interface `TranslationProvider` defining the contract and properties for translation provider.
 * @zh 接口 `TranslationProvider`，定义翻译文本提供者的数据结构契约与属性规范。
 */
export interface TranslationProvider {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `source` (`string`) storing source.
   * @zh 属性 `source`（类型：`string`），用于存储或配置源。
   */
  source: string;
}

/**
 * Injectable Angular service `TranslationService` managing translation service state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslationService`，管理 `src/translator` 中的翻译文本服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  /**
   * Property `defaultLang` (`string`) storing default lang.
   * @zh 属性 `defaultLang`（类型：`string`），用于存储或配置默认语言。
   */
  defaultLang: string;
  /**
   * Property `userLang` (`string`) storing user lang.
   * @zh 属性 `userLang`（类型：`string`），用于存储或配置用户语言。
   */
  userLang: string;

  /**
   * Creates an instance of `TranslationService` and initializes its dependencies and internal state.
   * @zh 创建 `TranslationService` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param customLoader - Injected or initial custom loader (`TranslateLoaderService`) / 注入或传入的自定义加载器（`TranslateLoaderService`）
   * @param providers - Injected or initial providers (`TranslationProvider[]`) / 注入或传入的提供者列表（`TranslationProvider[]`）
   */
  constructor(public translate: TranslateService,
    public customLoader: TranslateLoaderService,
    @Optional() @Inject(TRANSLATION_PROVIDER) providers: TranslationProvider[]) {

    this.translate.currentLoader = customLoader;
    this.defaultLang = 'zh_CN';
    translate.setDefaultLang(this.defaultLang);
    this.customLoader.setDefaultLang(this.defaultLang);

    if (providers && providers.length > 0) {
      for (const provider of providers) {
        this.addTranslationFolder(provider.name, provider.source);
      }
    }
    let localCookie = CookieStorage.getCookie('localex');


    if (localCookie && localCookie.value) {
      this.userLang = localCookie.value;
      this.use(this.userLang);
    } else {
      const browserCultureLang = this.translate.getBrowserCultureLang();
      if(browserCultureLang=='zh'){
         this.userLang = 'zh_CN';
         this.use(this.userLang);
      }else if(browserCultureLang=='en'){
         this.userLang = 'en_US';
         this.use(this.userLang);
      }else{
        this.userLang = browserCultureLang ? browserCultureLang.replace('-', '_') : this.defaultLang;
        this.use(this.userLang);
      }
    }
  }


  /**
   * Executes `addI10Folder` to handle add i10 folder.
   * @zh 执行 `addI10Folder`，用于添加I10文件夹。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param path - path parameter (`string`) / 路径参数（`string`）
   */
  addI10Folder(name: string = '', path: string = '') {
    if (!this.customLoader.providerRegistered(name)) {
      this.customLoader.registerProvider(name, path);
      if (this.userLang) {
        this.loadI10(this.userLang, this.defaultLang);
      } else {
        this.loadI10(this.defaultLang);
      }
    }
  }

  /**
   * Executes `loadI10` to handle load i10.
   * @zh 执行 `loadI10`，用于加载I10。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param fallback - fallback parameter (`string`) / fallback参数（`string`）
   */
  loadI10(lang: string, fallback?: string) {
    this.translate.getTranslation(lang).subscribe(
      () => {
        /*
         * 原来这里是 `L10n.load(res)` —— 把词典塞进 LEGACY 的静态本地化注册表,
         * 供 LEGACY 组件读自己的内置文案。那批组件已随 LEGACY 清场删除,
         * 注册表没有了读者(`L10n` 全库零外部引用),连同 `l10n.ts` 一起删。
         *
         * 订阅本身留着:它的另一个作用是**触发词典加载**,失败时走下面的
         * fallback 分支换语言重试。去掉订阅会把这条重试路一起去掉。
         */
      },
      () => {
        if (fallback && fallback !== lang) {
          this.loadI10(fallback);
        }
      }
    );
  }

   /**
    * Executes `addTranslationFolder` to handle add translation folder.
    * @zh 执行 `addTranslationFolder`，用于添加翻译文本文件夹。
    * @param name - name parameter (`string`) / 名称参数（`string`）
    * @param path - path parameter (`string`) / 路径参数（`string`）
    */
   addTranslationFolder(name: string = '', path: string = '') {
    if (!this.customLoader.providerRegistered(name)) {
      this.customLoader.registerProvider(name, path);
    }
    if (this.userLang) {
      this.loadTranslation(this.userLang, this.defaultLang);
   } else {
       this.loadTranslation(this.defaultLang);
   }
  }
  /**
   * Executes `changeLang` to handle change lang.
   * @zh 执行 `changeLang`，用于变更语言。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  changeLang(lang: string) {
    this.userLang = lang;
    this.applyDocumentDirection(lang);
    //load file
    this.loadTranslation(lang);
  }

  /**
   * Publishes the active locale to CSS/`:lang()` selectors.
   *
   * 文档方向一律 ltr。RTL 翻转(postcss-rtlcss)已整体撤掉:它把方向属性拆成
   * `[dir=ltr] .x { right: … }`,而 Angular 样式封装又把 `[dir=ltr]` 改写成要求
   * 带组件作用域属性,匹配不到 <html>,结果 LTR 下方向属性全部失效。
   * 真要支持阿语等 RTL 语种时再重新设计。

   * @zh Publishes the active locale to CSS/`:lang()` selectors.
   */
  applyDocumentDirection(lang: string) {
    if (typeof document === 'undefined' || !document.documentElement) {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('dir', 'ltr');
    root.setAttribute('lang', (lang || '').replace('_', '-'));
  }

  /**
   * Executes `loadTranslation` to handle load translation.
   * @zh 执行 `loadTranslation`，用于加载翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param fallback - fallback parameter (`string`) / fallback参数（`string`）
   */
  async  loadTranslation(lang: string, fallback?: string) {
    await this.translate.getTranslation(lang).subscribe(
      () => {
        this.translate.use(lang);
        this.onTranslationChanged(lang);
      },
      () => {
        if (fallback && fallback !== lang) {
          this.loadTranslation(fallback);
        }
      }
    );
  }


  /**
   * Executes `onTranslationChanged` to handle on translation changed.
   * @zh 执行 `onTranslationChanged`，用于当翻译文本已变更。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  onTranslationChanged(lang: string): void {
    this.translate.onTranslationChange.next({
      lang: lang,
      translations: this.customLoader.getFullTranslationJSON(lang)
    });
  }

  /**
   * Sets the target language for translations.
   * @param lang Code name for the language
   * @returns Translations available for the language

   * @zh 执行 `use`，用于使用。
   */
  use(lang: string) {
    this.customLoader.init(lang);
    this.applyDocumentDirection(lang);
    return this.translate.use(lang);
  }

  /**
   * Gets the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text

   * @zh 执行 `get`，用于获取。
   */
  get(key: string | Array<string>, interpolateParams?: Object) {
    return this.translate.get(key, interpolateParams);
  }

  /**
   * Directly returns the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text

   * @zh 执行 `instant`，用于即时。
   */
  instant(key: string | Array<string>, interpolateParams?: Object) {
    return key ? this.translate.instant(key, interpolateParams) : '';
  }
}
