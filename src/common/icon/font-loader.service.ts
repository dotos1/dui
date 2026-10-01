import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';
import { of } from 'rxjs';

declare const FontFace: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class FontLoaderService {
  /** @zh 已加载过的字体名称集合，避免重复加载。 */
  public  fontSet:Set<string>=new Set<string>();

  constructor(
    protected translate: TranslateService,
    @Inject('apiBase') private _apiBase: string) {
  }

  /**
   * Loads a custom web font (via the `FontFace` API) by name/URL/weight, skipping if already loaded.
   * @zh 通过 `FontFace` API 按名称/URL/字重加载自定义 Web 字体，若已加载过则跳过。
   */
  loadFonts(name:string,url: string, weight: number):Promise<any>{
    if(this.fontSet.has(name)){
      return of(name).toPromise();
    }else{
      let ff = new FontFace(name, "url(" + url + ")", { style: 'normal', weight: weight });
      document.fonts.add(ff);
      return ff.load();
    }
  }
}
