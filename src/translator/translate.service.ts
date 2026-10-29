/**
 * @fileoverview Module `src/translator/translate.service.ts` providing translate service definitions and implementation.
 * @zh 模块文件 `src/translator/translate.service.ts`，提供翻译服务相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter, Inject, Injectable, InjectionToken } from "@angular/core";
import { concat, forkJoin, isObservable, Observable, of, defer } from "rxjs";
import { concatMap, map, shareReplay, switchMap, take } from "rxjs/operators";
import { MissingTranslationHandler, MissingTranslationHandlerParams } from "./missing-translation-handler";
import { TranslateCompiler } from "./translate.compiler";
import { TranslateLoader } from "./translate.loader";
import { TranslateParser } from "./translate.parser";
import { TranslateStore } from "./translate.store";
import { isDefined, mergeDeep } from "./util";
import { Internationalization } from './intl';
import type { DateFormatOptions, NumberFormatOptions } from './intl';

/**
 * Angular dependency-injection token `USE_STORE` for providing use store.
 * @zh Angular 依赖注入令牌 `USE_STORE`，用于提供与注入使用状态仓库。
 */
export const USE_STORE = new InjectionToken<string>('USE_STORE');
/**
 * Angular dependency-injection token `USE_DEFAULT_LANG` for providing use default lang.
 * @zh Angular 依赖注入令牌 `USE_DEFAULT_LANG`，用于提供与注入使用默认语言。
 */
export const USE_DEFAULT_LANG = new InjectionToken<string>('USE_DEFAULT_LANG');
/**
 * Angular dependency-injection token `DEFAULT_LANGUAGE` for providing default language.
 * @zh Angular 依赖注入令牌 `DEFAULT_LANGUAGE`，用于提供与注入默认语言。
 */
export const DEFAULT_LANGUAGE = new InjectionToken<string>('DEFAULT_LANGUAGE');
/**
 * Angular dependency-injection token `USE_EXTEND` for providing use extend.
 * @zh Angular 依赖注入令牌 `USE_EXTEND`，用于提供与注入使用EXTEND。
 */
export const USE_EXTEND = new InjectionToken<string>('USE_EXTEND');

/**
 * Interface `TranslationChangeEvent` defining the contract and properties for translation change event.
 * @zh 接口 `TranslationChangeEvent`，定义翻译文本变更事件的数据结构契约与属性规范。
 */
export interface TranslationChangeEvent {
  /**
   * Property `translations` (`any`) storing translations.
   * @zh 属性 `translations`（类型：`any`），用于存储或配置翻译文本。
   */
  translations;
  /**
   * Property `lang` (`string`) storing lang.
   * @zh 属性 `lang`（类型：`string`），用于存储或配置语言。
   */
  lang: string;
}

/**
 * Interface `LangChangeEvent` defining the contract and properties for lang change event.
 * @zh 接口 `LangChangeEvent`，定义语言变更事件的数据结构契约与属性规范。
 */
export interface LangChangeEvent {
  /**
   * Property `lang` (`string`) storing lang.
   * @zh 属性 `lang`（类型：`string`），用于存储或配置语言。
   */
  lang: string;
  /**
   * Property `translations` (`any`) storing translations.
   * @zh 属性 `translations`（类型：`any`），用于存储或配置翻译文本。
   */
  translations;
}

/**
 * Interface `DefaultLangChangeEvent` defining the contract and properties for default lang change event.
 * @zh 接口 `DefaultLangChangeEvent`，定义默认语言变更事件的数据结构契约与属性规范。
 */
export interface DefaultLangChangeEvent {
  /**
   * Property `lang` (`string`) storing lang.
   * @zh 属性 `lang`（类型：`string`），用于存储或配置语言。
   */
  lang: string;
  /**
   * Property `translations` (`any`) storing translations.
   * @zh 属性 `translations`（类型：`any`），用于存储或配置翻译文本。
   */
  translations;
}

/**
 * Interface `Window` defining the contract and properties for window.
 * @zh 接口 `Window`，定义窗口的数据结构契约与属性规范。
 */
declare interface Window {
  /**
   * Property `navigator` (`any`) storing navigator.
   * @zh 属性 `navigator`（类型：`any`），用于存储或配置navigator。
   */
  navigator;
}

/**
 * Constant/variable `window` defining window in `src/translator`.
 * @zh 常量/变量 `window`，定义 `src/translator` 中的窗口。
 */
declare const window: Window;

/**
 * Injectable Angular service `TranslateService` managing translate service state and operations in `src/translator`.
 * @zh 可注入的 Angular 服务 `TranslateService`，管理 `src/translator` 中的翻译服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  /**
   * Property `loadingTranslations` (`any`) storing loading translations.
   * @zh 属性 `loadingTranslations`（类型：`any`），用于存储或配置加载中翻译文本。
   */
  public loadingTranslations;
  /**
   * Property `pending` (`boolean`) storing pending (default: `false`).
   * @zh 属性 `pending`（类型：`boolean`），用于存储或配置等待中（默认值：`false`）。
   */
  private pending: boolean = false;
  /**
   * Property `_onTranslationChange` (`EventEmitter<TranslationChangeEvent>`) storing on translation change.
   * @zh 属性 `_onTranslationChange`（类型：`EventEmitter<TranslationChangeEvent>`），用于存储或配置当翻译文本变更。
   */
  private _onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter<TranslationChangeEvent>();
  /**
   * Property `_onLangChange` (`EventEmitter<LangChangeEvent>`) storing on lang change (default: `new EventEmitter<LangChangeEvent>()`).
   * @zh 属性 `_onLangChange`（类型：`EventEmitter<LangChangeEvent>`），用于存储或配置当语言变更（默认值：`new EventEmitter<LangChangeEvent>()`）。
   */
  private _onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();
  /**
   * Property `_onDefaultLangChange` (`EventEmitter<DefaultLangChangeEvent>`) storing on default lang change.
   * @zh 属性 `_onDefaultLangChange`（类型：`EventEmitter<DefaultLangChangeEvent>`），用于存储或配置当默认语言变更。
   */
  private _onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter<DefaultLangChangeEvent>();
  /**
   * Property `_defaultLang` (`string`) storing default lang.
   * @zh 属性 `_defaultLang`（类型：`string`），用于存储或配置默认语言。
   */
  private _defaultLang: string;
  /**
   * Property `_currentLang` (`string`) storing current lang.
   * @zh 属性 `_currentLang`（类型：`string`），用于存储或配置当前语言。
   */
  private _currentLang: string;
  /**
   * Property `_langs` (`string[]`) storing langs (default: `[]`).
   * @zh 属性 `_langs`（类型：`string[]`），用于存储或配置语言（默认值：`[]`）。
   */
  private _langs: Array<string> = [];
  /**
   * Property `_translations` (`Record<string, Object>`) storing translations (default: `{}`).
   * @zh 属性 `_translations`（类型：`Record<string, Object>`），用于存储或配置翻译文本（默认值：`{}`）。
   */
  /** 语种 → 翻译表 */
  private _translations: Record<string, Object> = {};
  /**
   * Property `_translationRequests` (`Record<string, Observable<Object>>`) storing translation requests (default: `{}`).
   * @zh 属性 `_translationRequests`（类型：`Record<string, Observable<Object>>`），用于存储或配置翻译文本请求（默认值：`{}`）。
   */
  /** 语种 → 进行中的加载请求 */
  private _translationRequests: Record<string, Observable<Object>> = {};

  /**
   * Gets the current on translation change (`onTranslationChange: EventEmitter<TranslationChangeEvent>`).
   * @zh 获取当前当翻译文本变更（`onTranslationChange: EventEmitter<TranslationChangeEvent>`）。
   */
  get onTranslationChange(): EventEmitter<TranslationChangeEvent> {
    return this.isolate ? this._onTranslationChange : this.store.onTranslationChange;
  }

  /**
   * Gets the current on lang change (`onLangChange: EventEmitter<LangChangeEvent>`).
   * @zh 获取当前当语言变更（`onLangChange: EventEmitter<LangChangeEvent>`）。
   */
  get onLangChange(): EventEmitter<LangChangeEvent> {
    return this.isolate ? this._onLangChange : this.store.onLangChange;
  }


  /**
   * Gets the current on default lang change (`onDefaultLangChange: any`).
   * @zh 获取当前当默认语言变更（`onDefaultLangChange: any`）。
   */
  get onDefaultLangChange() {
    return this.isolate ? this._onDefaultLangChange : this.store.onDefaultLangChange;
  }


  /**
   * Gets the current default lang (`defaultLang: string`).
   * @zh 获取当前默认语言（`defaultLang: string`）。
   */
  get defaultLang(): string {
    return this.isolate ? this._defaultLang : this.store.defaultLang;
  }

  /**
   * Sets the default lang (`defaultLang`).
   * @zh 设置默认语言（`defaultLang`）。
   * @param defaultLang - New default lang value (`string`) / 新的默认语言值（`string`）
   */
  set defaultLang(defaultLang: string) {
    if (this.isolate) {
      this._defaultLang = defaultLang;
    } else {
      this.store.defaultLang = defaultLang;
    }
  }

  /**
   * The lang currently used

   * @zh 获取当前当前语言（`currentLang: string`）。
   */
  get currentLang(): string {
    return this.isolate ? this._currentLang : this.store.currentLang;
  }

  /**
   * Sets the current lang (`currentLang`).
   * @zh 设置当前语言（`currentLang`）。
   * @param currentLang - New current lang value (`string`) / 新的当前语言值（`string`）
   */
  set currentLang(currentLang: string) {
    if (this.isolate) {
      this._currentLang = currentLang;
    } else {
      this.store.currentLang = currentLang;
    }
  }

  /**
   * an array of langs

   * @zh 获取当前语言（`langs: string[]`）。
   */
  get langs(): string[] {
    return this.isolate ? this._langs : this.store.langs;
  }

  /**
   * Sets the langs (`langs`).
   * @zh 设置语言（`langs`）。
   * @param langs - New langs value (`string[]`) / 新的语言值（`string[]`）
   */
  set langs(langs: string[]) {
    if (this.isolate) {
      this._langs = langs;
    } else {
      this.store.langs = langs;
    }
  }

  /**
   * a list of translations per lang

   * @zh 获取当前翻译文本（`translations: any`）。
   */
  get translations() {
    return this.isolate ? this._translations : this.store.translations;
  }

  /**
   * Sets the translations (`translations`).
   * @zh 设置翻译文本（`translations`）。
   * @param translations - New translations value (`Record<string, Object>`) / 新的翻译文本值（`Record<string, Object>`）
   */
  set translations(translations) {
    if (this.isolate) {
      this._translations = translations;
    } else {
      this.store.translations = translations;
    }
  }

  /**
   *
   * @param store an instance of the store (that is supposed to be unique)
   * @param currentLoader An instance of the loader currently used
   * @param compiler An instance of the compiler currently used
   * @param parser An instance of the parser currently used
   * @param missingTranslationHandler A handler for missing translations.
   * @param useDefaultLang whether we should use default language translation when current language translation is missing.
   * @param isolate whether this service should use the store or not
   * @param extend To make a child module extend (and use) translations from parent modules.
   * @param defaultLanguage Set the default language using configuration

   * @zh 创建 `TranslateService` 实例，并初始化其依赖项与内部状态。
   */
  constructor(public store: TranslateStore,
    public currentLoader: TranslateLoader,
    public compiler: TranslateCompiler,
    public parser: TranslateParser,
    public missingTranslationHandler: MissingTranslationHandler,
    @Inject(USE_DEFAULT_LANG) private useDefaultLang: boolean = true,
    @Inject(USE_STORE) private isolate: boolean = false,
    @Inject(USE_EXTEND) private extend: boolean = false,
    @Inject(DEFAULT_LANGUAGE) defaultLanguage: string) {

    if (defaultLanguage) {
      this.setDefaultLang(defaultLanguage);
    }
  }

  /**
   * Sets the default language to use as a fallback

   * @zh 执行 `setDefaultLang`，用于集合默认语言。
   */
  public setDefaultLang(lang: string): void {
    if (lang === this.defaultLang) {
      return;
    }

    let pending = this.retrieveTranslations(lang);

    if (typeof pending !== "undefined") {
      // on init set the defaultLang immediately
      if (this.defaultLang == null) {
        this.defaultLang = lang;
      }

      pending.pipe(take(1))
        .subscribe((res) => {
          this.changeDefaultLang(lang);
        });
    } else { // we already have this language
      this.changeDefaultLang(lang);
    }
  }

  /**
   * Gets the default language used

   * @zh 执行 `getDefaultLang`，用于获取默认语言。
   */
  public getDefaultLang(): string {
    return this.defaultLang;
  }

  /**
   * Changes the lang currently used

   * @zh 执行 `use`，用于使用。
   */
  public use(lang: string) {
    // don't change the language if the language given is already selected
    if (lang === this.currentLang) {
      return of(this.translations[lang]);
    }

    let pending = this.retrieveTranslations(lang);

    if (typeof pending !== "undefined") {
      // on init set the currentLang immediately
      if (!this.currentLang) {
        this.currentLang = lang;
      }

      pending.pipe(take(1))
        .subscribe((res) => {
          this.changeLang(lang);
        });

      return pending;
    } else { // we have this language, return an Observable
      this.changeLang(lang);

      return of(this.translations[lang]);
    }
  }

  /**
   * Retrieves the given translations

   * @zh 执行 `retrieveTranslations`，用于retrieve翻译文本。
   */
  private retrieveTranslations(lang: string) {
    let pending;

    // if this language is unavailable or extend is true, ask for it
    if (typeof this.translations[lang] === "undefined" || this.extend) {
      this._translationRequests[lang] = this._translationRequests[lang] || this.getTranslation(lang);
      pending = this._translationRequests[lang];
    }

    return pending;
  }

  /**
   * Gets an object of translations for a given language with the current loader
   * and passes it through the compiler

   * @zh 执行 `getTranslation`，用于获取翻译文本。
   */
  public getTranslation(lang: string) {
    this.pending = true;
    const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(
      shareReplay(1),
      take(1),
    );

    this.loadingTranslations = loadingTranslations.pipe(
      map((res: Object) => this.compiler.compileTranslations(res, lang)),
      shareReplay(1),
      take(1),
    );

    this.loadingTranslations
      .subscribe({
        next: (res: Object) => {
          this.translations[lang] = this.extend && this.translations[lang] ? { ...res, ...this.translations[lang] } : res;
          this.updateLangs();
          this.pending = false;
        },
        error: (err) => {
          this.pending = false;
        }
      });

    return loadingTranslations;
  }

  /**
   * Executes `setTranslation` to handle set translation.
   * @zh 执行 `setTranslation`，用于集合翻译文本。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @param translations - translations parameter (`Object`) / 翻译文本参数（`Object`）
   * @param shouldMerge - should merge parameter (`boolean`) / 是否应当合并参数（`boolean`）
   */
  public setTranslation(lang: string, translations: Object, shouldMerge: boolean = false): void {
    translations = this.compiler.compileTranslations(translations, lang);
    if ((shouldMerge || this.extend) && this.translations[lang]) {
      this.translations[lang] = mergeDeep(this.translations[lang], translations);
    } else {
      this.translations[lang] = translations;
    }
    this.updateLangs();
    this.onTranslationChange.emit({ lang: lang, translations: this.translations[lang] });
  }


  /**
   * Executes `getLangs` to handle get langs.
   * @zh 执行 `getLangs`，用于获取语言。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  public getLangs(): Array<string> {
    return this.langs;
  }


  /**
   * Executes `addLangs` to handle add langs.
   * @zh 执行 `addLangs`，用于添加语言。
   * @param langs - langs parameter (`string[]`) / 语言参数（`string[]`）
   */
  public addLangs(langs: Array<string>): void {
    langs.forEach((lang: string) => {
      if (this.langs.indexOf(lang) === -1) {
        this.langs.push(lang);
      }
    });
  }

  /**
   * Update the list of available langs

   * @zh 执行 `updateLangs`，用于更新语言。
   */
  private updateLangs(): void {
    this.addLangs(Object.keys(this.translations));
  }

  /**
   * Returns the parsed result of the translations

   * @zh 执行 `getParsedResult`，用于获取已解析结果。
   */
  public getParsedResult(translations, key, interpolateParams?: Object) {
    let res: string | Observable<string>;

    if (key instanceof Array) {
      let result: Record<string, unknown> = {},
        observables: boolean = false;
      for (let k of key) {
        result[k] = this.getParsedResult(translations, k, interpolateParams);
        if (isObservable(result[k])) {
          observables = true;
        }
      }
      if (observables) {
        const sources = key.map(k => isObservable(result[k]) ? result[k] : of(result[k] as string));
        return forkJoin(sources).pipe(
          map((arr: Array<string>) => {
            let obj: Record<string, unknown> = {};
            arr.forEach((value: string, index: number) => {
              obj[key[index]] = value;
            });
            return obj;
          })
        );
      }
      return result;
    }

    if (translations) {
      res = this.parser.interpolate(this.parser.getValue(translations, key), interpolateParams);
    }

    if (typeof res === "undefined" && this.defaultLang != null && this.defaultLang !== this.currentLang && this.useDefaultLang) {
      res = this.parser.interpolate(this.parser.getValue(this.translations[this.defaultLang], key), interpolateParams);
    }

    if (typeof res === "undefined") {
      let params: MissingTranslationHandlerParams = { key, translateService: this };
      if (typeof interpolateParams !== 'undefined') {
        params.interpolateParams = interpolateParams;
      }
      res = this.missingTranslationHandler.handle(params);
    }

    return typeof res !== "undefined" ? res : key;
  }

  /**
   * Gets the translated value of a key (or an array of keys)
   * @returns the translated key, or an object of translated keys

   * @zh 执行 `get`，用于获取。
   */
  public get(key: string | Array<string>, interpolateParams?: Object) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    // check if we are loading a new translation to use
    if (this.pending) {
      return this.loadingTranslations.pipe(
        concatMap((res) => {
          res = this.getParsedResult(res, key, interpolateParams);
          return isObservable(res) ? res : of(res);
        }),
      );
    } else {
      let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
      return isObservable(res) ? res : of(res);
    }
  }


  /**
   * Executes `getStreamOnTranslationChange` to handle get stream on translation change.
   * @zh 执行 `getStreamOnTranslationChange`，用于获取流当翻译文本变更。
   * @param key - key parameter (`string | string[]`) / 键参数（`string | string[]`）
   * @param interpolateParams - interpolate params parameter (`Object`) / interpolate参数集合参数（`Object`）
   * @returns Result of type `Observable<unknown>` / 类型为 `Observable<unknown>` 的返回值
   */
  public getStreamOnTranslationChange(key: string | Array<string>, interpolateParams?: Object) {
    if (!isDefined(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    return concat(
      defer(() => this.get(key, interpolateParams)),
      this.onTranslationChange.pipe(
        switchMap((event: TranslationChangeEvent) => {
          const res = this.getParsedResult(event.translations, key, interpolateParams);
          if (typeof res.subscribe === 'function') {
            return res;
          } else {
            return of(res);
          }
        })
      )
    );
  }

  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the language changes.
   * @returns A stream of the translated key, or an object of translated keys

   * @zh 执行 `stream`，用于流。
   */
  public stream(key: string | Array<string>, interpolateParams?: Object) {
    if (!isDefined(key) || !key.length) {
      console.warn(`Parameter "key" required`);
    }
    return concat(
      defer(() => this.get(key, interpolateParams)),
      this.onLangChange.pipe(
        switchMap((event: LangChangeEvent) => {
          const res = this.getParsedResult(event.translations, key, interpolateParams);
          return isObservable(res) ? res : of(res);
        })
      ));
  }


  /**
   * Executes `instant` to handle instant.
   * @zh 执行 `instant`，用于即时。
   * @param key - key parameter (`string | string[]`) / 键参数（`string | string[]`）
   * @param interpolateParams - interpolate params parameter (`Object`) / interpolate参数集合参数（`Object`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public instant(key: string | Array<string>, interpolateParams?: Object) {
    if (!isDefined(key) || !key.length) {
      // console.warn(`Parameter "key" required`);
      return {};
      // throw new Error(`Parameter "key" required`);
    }
    let res = this.getParsedResult(this.translations[this.currentLang], key, interpolateParams);
    if (isObservable(res)) {
      if (key instanceof Array) {
        let obj: Record<string, unknown> = {};
        key.forEach((value: string, index: number) => {
          obj[key[index]] = key[index];
        });
        return obj;
      }
      return key;
    } else {
      return res;
    }
  }

  /**
   * Sets the translated value of a key, after compiling it

   * @zh 执行 `set`，用于集合。
   */
  public set(key: string, value: string, lang: string = this.currentLang): void {
    this.translations[lang][key] = this.compiler.compile(value, lang);
    this.updateLangs();
    this.onTranslationChange.emit({ lang: lang, translations: this.translations[lang] });
  }

  /**
   * Changes the current lang

   * @zh 执行 `changeLang`，用于变更语言。
   */
  private changeLang(lang: string): void {
    this.currentLang = lang;
    this.onLangChange.emit({ lang: lang, translations: this.translations[lang] });

    // if there is no default lang, use the one that we just set
    if (this.defaultLang == null) {
      this.changeDefaultLang(lang);
    }
  }


  /**
   * Executes `changeDefaultLang` to handle change default lang.
   * @zh 执行 `changeDefaultLang`，用于变更默认语言。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  private changeDefaultLang(lang: string): void {
    this.defaultLang = lang;
    this.onDefaultLangChange.emit({ lang: lang, translations: this.translations[lang] });
  }

  /**
   * Executes `reloadLang` to handle reload lang.
   * @zh 执行 `reloadLang`，用于重新加载语言。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public reloadLang(lang: string) {
    this.resetLang(lang);
    return this.getTranslation(lang);
  }


  /**
   * Executes `resetLang` to handle reset lang.
   * @zh 执行 `resetLang`，用于重置语言。
   * @param lang - lang parameter (`string`) / 语言参数（`string`）
   */
  public resetLang(lang: string): void {
    this._translationRequests[lang] = undefined;
    this.translations[lang] = undefined;
  }


  /**
   * Executes `getBrowserLang` to handle get browser lang.
   * @zh 执行 `getBrowserLang`，用于获取浏览器语言。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getBrowserLang(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }

    let browserLang = window.navigator.languages ? window.navigator.languages[0] : null;
    browserLang = browserLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

    if (typeof browserLang === 'undefined') {
      return undefined
    }

    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0];
    }

    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0];
    }

    return browserLang;
  }

  /**
   * Returns the culture language code name from the browser, e.g. "de-DE"

   * @zh 执行 `getBrowserCultureLang`，用于获取浏览器Culture语言。
   */
  public getBrowserCultureLang(): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined;
    }
    let browserCultureLang = window.navigator.languages ? window.navigator.languages[0] : null;
    browserCultureLang = browserCultureLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if(browserCultureLang=='zh'){
        browserCultureLang = 'zh_CN';
    }else if(browserCultureLang=='en'){
        browserCultureLang = 'en_US';
    }else{
      browserCultureLang = browserCultureLang ? browserCultureLang.replace('-', '_') : undefined;
    }
    return browserCultureLang;
  }

  /*
   * 下面这一组格式化/解析方法原先直接调 LEGACY 衍生的 `DateFormat` / `NumberFormat` /
   * `DateParser` / `NumberParser`,并且把 `this.translations[currentLang]`
   * 当 CLDR 数据传进去。那批文件已随 LEGACY 清场删除
   * (见 duix 的 `lib/PEEL-CLEANUP-PLAN.md` §P5)。
   *
   * <p><b>传进去的"CLDR"其实一直不是 CLDR。</b>`translations[lang]` 是本项目的
   * 翻译词典,不含 `main.<culture>.dates.*` 那套结构 —— 旧实现每次都走空数据的
   * 内置兜底路径,等价于 en-US。所以这里换成原生 `Intl` 不改变任何既有输出。
   *
   * <p>这一组**在库外零调用**(逐个方法名 grep 过:命中的都是别的类的同名方法,
   * 比如 `DuiDate.parseDate`、甘特自己的 `getDateFormat`)。保留是为了不改
   * `TranslateService` 的对外形状 —— 它有 334 处 import。
   */
  /**
   * Property `intl` (`Internationalization`) storing intl (default: `new Internationalization()`).
   * @zh 属性 `intl`（类型：`Internationalization`），用于存储或配置intl（默认值：`new Internationalization()`）。
   */
  private readonly intl = new Internationalization();

  /**
   * Executes `getDateFormat` to handle get date format.
   * @zh 执行 `getDateFormat`，用于获取日期格式化。
   * @param options - options parameter (`DateFormatOptions`) / 配置选项参数（`DateFormatOptions`）
   * @returns Result of type `Function` / 类型为 `Function` 的返回值
   */
  public getDateFormat(options?: DateFormatOptions): Function {
    return this.intl.getDateFormat(options || { type: 'date', skeleton: 'short' });
  }

  /**
   * Executes `getNumberFormat` to handle get number format.
   * @zh 执行 `getNumberFormat`，用于获取数字格式化。
   * @param options - options parameter (`NumberFormatOptions`) / 配置选项参数（`NumberFormatOptions`）
   * @returns Result of type `Function` / 类型为 `Function` 的返回值
   */
  public getNumberFormat(options?: NumberFormatOptions): Function {
    return this.intl.getNumberFormat(options || {});
  }

  /**
   * Executes `formatNumber` to handle format number.
   * @zh 执行 `formatNumber`，用于格式化数字。
   * @param value - value parameter (`Number`) / 值参数（`Number`）
   * @param option - option parameter (`NumberFormatOptions`) / 选项参数（`NumberFormatOptions`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public formatNumber(value: Number, option?: NumberFormatOptions): string {
    return this.getNumberFormat(option)(value);
  }

  /**
   * Executes `formatDate` to handle format date.
   * @zh 执行 `formatDate`，用于格式化日期。
   * @param value - value parameter (`Date`) / 值参数（`Date`）
   * @param option - option parameter (`DateFormatOptions`) / 选项参数（`DateFormatOptions`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public formatDate(value: Date, option?: DateFormatOptions): string {
    return this.getDateFormat(option)(value);
  }

  /**
   * Executes `getFirstDayOfWeek` to handle get first day of week.
   * 一周的第一天。
   *
   * <p>旧实现是 `IntlBase.getWeekData(cldr)` —— 而那个函数<u>把查出来的
   * `mapper` 算完就丢了</u>,永远返回 `firstDayMapper[defaultFirstDay]`,
   * 也就是常量 0(周日)。这里保持同样的返回值,不"顺手修好它":
   * 改成真按区域取会让日历控件的首列在没人预期的时候变。

   * @zh 一周的第一天。
   */
  public getFirstDayOfWeek(): number { return 0; }

  /**
   * Executes `getCulture` to handle get culture.
   * @zh 执行 `getCulture`，用于获取Culture。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getCulture(): string {
    return this.currentLang || this.intl.getCulture();
  }
}
