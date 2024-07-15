import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@dotos/dui/i18n';
import { of } from 'rxjs';

declare const FontFace: any;
declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class FontLoaderService {
  public  fontSet:Set<string>=new Set<string>();

  constructor(
    protected translate: TranslateService,
    @Inject('apiBase') private _apiBase: string) {
  }

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
