
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { TranslateLoader } from './translate.loader';
import { ObjectUtils } from '@dotos/dui/base'
import { ComponentTranslationModel } from './component.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateLoaderService implements TranslateLoader {

  private suffix: string = '.json';
  private providers: ComponentTranslationModel[] = [];
  private queue: string[][] = [];
  private defaultLang: string = 'en_US';
  private retriedOnce = new Set<string>();

  constructor(public http: HttpClient) {
  }

  setDefaultLang(value: string) {
    this.defaultLang = value || 'zh_CN';
  }

  registerProvider(name: string, path: string) {
    const registered = this.providers.find((provider) => provider.name === name);
    if (registered) {
      registered.path = path;
    } else {
      this.providers.push(new ComponentTranslationModel({ name: name, path: path }));
    }
  }

  providerRegistered(name: string): boolean {
    return this.providers.find((x) => x.name === name) ? true : false;
  }

  fetchLanguageFile(lang: string, component: ComponentTranslationModel, fallbackUrl?: string): Observable<void> {
    const basePath = component.name ? `${component.path}/${component.name}` : `${component.path}`;
    const translationUrl = fallbackUrl || `${basePath}/${lang}${this.suffix}?v=${Date.now()}`;

    return this.http.get(translationUrl).pipe(
      map((res: any) => {
        component.json[lang] = res;
      }),
      retry(3),
      catchError((error) => {
        // 只认 `-`(b8c5e5c 复核)。本系统的语言码是 zh_CN / en_US 这种下划线
        // 写法,并没有 zh.json、en.json 这类短码文件;连 `_` 一起认,每个组件
        // 加载失败都会再多发一个必然 404 的短码请求。
        if (!fallbackUrl && lang.includes('-')) {
          const [langId] = lang.split('-');

          if (langId && langId !== this.defaultLang) {
            const url = `${basePath}/${langId}${this.suffix}?v=${Date.now()}`;

            return this.fetchLanguageFile(lang, component, url);
          }
        }
        this.releaseForRetry(lang, component.name, error);
        return throwError(`Failed to load ${translationUrl}`);
      })
    );
  }

  /**
   * 加载失败的组件默认**留在** queue 里,同一语言不再重新请求(b8c5e5c 复核)。
   * 那次提交在失败时把它从 queue 删掉,结果之后每次 getTranslation(每次切语言、
   * 每个懒加载模块注册 provider)都重试一遍,每次都弹一遍 404 的错误提示。
   * 只有网络断开(status 0)或服务端 5xx 这类可能自愈的失败,才放行**一次**重试。
   */
  private releaseForRetry(lang: string, name: string, error: any) {
    const status = error?.status;
    const transient = status === 0 || (typeof status === 'number' && status >= 500);
    const key = `${lang}|${name}`;
    if (!transient || this.retriedOnce.has(key)) {
      return;
    }
    this.retriedOnce.add(key);
    const idx = (this.queue[lang] || []).indexOf(name);
    if (idx > -1) {
      this.queue[lang].splice(idx, 1);
    }
  }

  getComponentToFetch(lang: string): Array<Observable<any>> {
    const observableBatch = [];
    if (!this.queue[lang]) {
      this.queue[lang] = [];
    }
    this.providers.forEach((component) => {
      if (!this.isComponentInQueue(lang, component.name)) {
        this.queue[lang].push(component.name);

        observableBatch.push(
          this.fetchLanguageFile(lang, component)
        );
      }
    });

    return observableBatch;
  }

  init(lang: string) {
    if (this.queue[lang] === undefined) {
      this.queue[lang] = [];
    }
  }

  isComponentInQueue(lang: string, name: string) {
    //return (this.queue[lang] || []).find((x) => x === name) ? true : false;

    return (this.queue[lang] || []).find((x) => x === name) != undefined;
  }

  getFullTranslationJSON(lang: string): any {
    let result = {};
    this.providers
      .slice(0)
      .sort((a, b) => {
        if (a.name === 'app') {
          return 1;
        }
        if (b.name === 'app') {
          return -1;
        }
        return a.name.localeCompare(b.name);
      })
      .forEach((model) => {
        if (model.json && model.json[lang]) {
          result = ObjectUtils.merge(result, model.json[lang]);
        }
      });

    return result;
  }

  getTranslation(lang: string): Observable<any> {
    let hasFailures = false;
    const batch = [
      ...this.getComponentToFetch(lang).map((observable) => {
        return observable.pipe(
          catchError((error) => {
            // console.warn(error);
            hasFailures = true;
            return of(error);
          })
        );
      })
    ];

    return new Observable((observer) => {
      if (batch.length > 0) {
        forkJoin(batch).subscribe(
          () => {
            const fullTranslation = this.getFullTranslationJSON(lang);
            if (fullTranslation) {
              observer.next(fullTranslation);
            }
            if (hasFailures) {
              observer.error('Failed to load some resources');
            } else {
              observer.complete();
            }
          },
          () => {
            observer.error('Failed to load some resources');
          });
      } else {
        const fullTranslation = this.getFullTranslationJSON(lang);
          if (fullTranslation) {
          observer.next(fullTranslation);
          observer.complete();
        }
      }
    });
  }
}
