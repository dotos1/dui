import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs';

export class OptionsResult {
  options: string[];
  params: {};
  error: string;
}

@Injectable()
export class OptionsService {
  private optionsSubject: BehaviorSubject<OptionsResult> = new BehaviorSubject(null);
  options: Observable<OptionsResult> = this.optionsSubject.asObservable();

  constructor(protected http: HttpClient) { }

  getOptions(url:string,method:string,params: any) {
    let ops: string[] = [];
    if(method.toUpperCase()=='GET'){
      this.http.get(url,{
        params: params,
        responseType: 'json'
      }).subscribe((val:any) => {
          if (val.success){
            ops=val.result;
            this.optionsSubject.next({options: ops, params: params, error: null });
          }else{
            this.optionsSubject.next({options: [], params: params, error: val.message});
          }
        },
        error =>{
          this.optionsSubject.next({options: [], params: params, error: error});
        }
      );
    }else{
      this.http.post(url, params, {
        params: params,
        responseType: 'json'
      }).subscribe( (val: any) => {
        if (val.success){
             ops=val.result;
             this.optionsSubject.next({options: ops, params: params, error: null });
        }else{
             this.optionsSubject.next({options: [], params: params, error: val.message});
        };
      },
      error => {
           this.optionsSubject.next({options: [], params: params, error: error});
      });
    }
  }
}
