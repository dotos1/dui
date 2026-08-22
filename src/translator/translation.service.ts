
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieStorage } from '@dotos/dui/core/cookie';
import { TranslateService } from './translate.service';
import { TranslateLoaderService } from './translate-loader.service';
export const TRANSLATION_PROVIDER = new InjectionToken('Injection token for translation providers.');

/**
 * Languages written right to left. Matched on the primary subtag, so ar_SA,
 * ar-EG and plain ar all resolve the same way.
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function isRtlLanguage(lang: string): boolean {
  const primary = (lang || '').split(/[-_]/)[0].toLowerCase();
  return RTL_LANGUAGES.indexOf(primary) >= 0;
}

export interface TranslationProvider {
  name: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLang: string;
  userLang: string;

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
      if(this.translate.getBrowserCultureLang()=='zh'){
         this.userLang = 'zh_CN';
         this.use(this.userLang);
      }else if(this.translate.getBrowserCultureLang()=='en'){
         this.userLang = 'en_US';
         this.use(this.userLang);
      }else{
        this.userLang = this.translate.getBrowserCultureLang().replace('-', '_');
        this.use(this.userLang);
      }
    }
  }


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

  loadI10(lang: string, fallback?: string) {
    this.translate.getTranslation(lang).subscribe(
      () => {
        /*
         * 原来这里是 `L10n.load(res)` —— 把词典塞进 EJ2 的静态本地化注册表,
         * 供 EJ2 组件读自己的内置文案。那批组件已随 EJ2 清场删除,
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
  changeLang(lang: string) {
    this.userLang = lang;
    this.applyDocumentDirection(lang);
    //load file
    this.loadTranslation(lang);
  }

  /**
   * Mirrors the document for right-to-left languages and publishes the active
   * locale to CSS/`:lang()` selectors.
   *
   * Only the UI chrome flips. Depth-ordered technical canvases -- well
   * schematics, log tracks, seismic sections, cross sections -- carry
   * directional meaning and must stay left to right; mark those containers
   * `dir="ltr"` so they opt out of the mirroring.
   */
  applyDocumentDirection(lang: string) {
    if (typeof document === 'undefined' || !document.documentElement) {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('dir', isRtlLanguage(lang) ? 'rtl' : 'ltr');
    root.setAttribute('lang', (lang || '').replace('_', '-'));
  }

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
   */
  use(lang: string): Observable<any> {
    this.customLoader.init(lang);
    this.applyDocumentDirection(lang);
    return this.translate.use(lang);
  }

  /**
   * Gets the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text
   */
  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }

  /**
   * Directly returns the translation for the supplied key.
   * @param key Key to translate
   * @param interpolateParams String(s) to be interpolated into the main message
   * @returns Translated text
   */
  instant(key: string | Array<string>, interpolateParams?: Object): string | any {
    return key ? this.translate.instant(key, interpolateParams) : '';
  }
}
