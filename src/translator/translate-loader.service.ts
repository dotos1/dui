
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
    const translationUrl = fallbackUrl || `${component.path}/${component.name}/${lang}${this.suffix}?v=${Date.now()}`;

    return this.http.get(translationUrl).pipe(
      map((res: any) => {
        component.json[lang] = res;
      }),
      retry(3),
      catchError(() => {
        if (!fallbackUrl && lang.includes('-')) {
          const [langId] = lang.split('-');

          if (langId && langId !== this.defaultLang) {
            const url = `${component.path}/${component.name}/${langId}${this.suffix}?v=${Date.now()}`;

            return this.fetchLanguageFile(lang, component, url);
          }
        }
        return throwError(`Failed to load ${translationUrl}`);
      })
    );
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
