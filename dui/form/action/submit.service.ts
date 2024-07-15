import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormAction } from './action.service';
import { LoadingService } from '@dotos/dui/common/loading';

@Injectable()
export class Submit extends FormAction {

  override failureType: any;

  public override type = 'submit';

  constructor(protected override http: HttpClient,
    public override loadingService: LoadingService) {
    super(http,loadingService);
  }

  public override run(): Promise<any>  {
    const o = this.options;
    this.loadingService.register();
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl(), this.form.getValues(), {
        headers: o.headers,
        params: this.getParams(),
        responseType: 'json'
      }).subscribe( (val: any) => {
        if (val.success) {
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
      });
    });
  }

  public override success(result) {
    this.result = result;
    this.loadingService.resolve();
    if (result === true || result.success) {
      this.form.afterAction(this, result, true);
      return;
    }
    if (result.errors) {
      this.form.markInvalid(result.errors);
    }
    this.failureType = FormAction.SERVER_INVALID;
    this.form.afterAction(this, result, false);
  }
}
