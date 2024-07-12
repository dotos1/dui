import {HttpClient} from "@angular/common/http";
import {  Injectable } from "@angular/core";
import {Observable} from 'rxjs';
import { TranslateLoader } from "./translate.loader";

@Injectable()
export class TranslateHttpLoader implements TranslateLoader {
  private prefix: string = "/assets/i18n/";
  private suffix:string=".json";
  constructor(private http: HttpClient) {}

  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}
