import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';
import { SelectOption } from './select.field';

export class SelectOptionsResult {
  options: SelectOption[];
  params: {};
  error: string;
}

@Injectable()
export class SelectOptionsService {
  private optionsSubject: BehaviorSubject<SelectOptionsResult> = new BehaviorSubject(null);
  options: Observable<SelectOptionsResult> = this.optionsSubject.asObservable();

  constructor(protected http: HttpClient) { }

  getOptions(url:string,method:string,params: any) {
    let ops: SelectOption[] = [];
    if((method || 'POST').toUpperCase()=='GET'){
      this.http.get(url,{
        params: params
      }).subscribe((val:any) => {
          if (val && val.success){
            ops=val.data;
            this.optionsSubject.next({options: ops, params: params, error: null });
          }else{
            this.optionsSubject.next({options: [], params: params, error: val ? val.message : 'Error'});
          }
        },
        error => {
          this.optionsSubject.next({options: [], params: params, error: error});
        }
      );
    }else{
      this.http.post(url, params, {
        params: params,
        responseType: 'json'
      }).subscribe( (val: any) => {
        if (val && val.success){
             ops=val.data;
             this.optionsSubject.next({options: ops, params: params, error: null });
        }else{
             this.optionsSubject.next({options: [], params: params, error: val ? val.message : 'Error'});
        };
      },
      error => {
        this.optionsSubject.next({options: [], params: params, error: error});
      });
    }
  }
  setOptions(opts){
    this.optionsSubject.next({options: opts, params: {}, error: null });
  }
}
