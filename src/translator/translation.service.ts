
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieStorage } from '@dotos/dui/core/cookie';
import { TranslateService } from './translate.service';
import { TranslateLoaderService } from './translate-loader.service';
import { L10n } from './l10n';
export const TRANSLATION_PROVIDER = new InjectionToken('Injection token for translation providers.');

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
      (res) => {
        L10n.load(res);
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
    //load file
    this.loadTranslation(lang);
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
