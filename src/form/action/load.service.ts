import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormAction } from './action.service';
import { LoadingService } from '@dotos/dui/common/loading';

@Injectable()
export class Load extends FormAction {
  reader: any;
  override failureType: any;
  public override type = 'load';

  constructor(
    protected override http: HttpClient,
    public override loadingService: LoadingService) {
    super(http,loadingService);
  }

  override init(form, options): FormAction {
    this.reader = form.reader;
    return super.init(form, options);
  }

  public override run(): Promise<any>  {
    this.loadingService.register();
    return new Promise((resolve, reject) => { this.http.get(this.getUrl(),
      {
        headers: this.options.headers,
        params: this.getParams(),
        responseType: 'json'
      }).subscribe(
        val => {
          if (val['success']) {
            this.success(val);
            resolve(val);
          }else {
            this.failure(val);
            reject(val);
          }
        },
        error => {
          this.failure(error);
          reject(error);
        }
      );
    });
  }

  public override success(result) {
    this.loadingService.resolve();
    if (result === true || !result.success || !result.data) {
      this.failureType = FormAction.LOAD_FAILURE;
      this.form.afterAction(this, result, false);
      return;
    }
    if(result.field){
      this.form.updateField(result.field);
    }
    this.form.setValues(result.data);
    this.form.clearInvalid();
    this.form.afterAction(this, result, true);
  }
}
