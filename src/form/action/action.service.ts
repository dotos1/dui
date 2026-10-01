import { HttpClient } from '@angular/common/http';
import { Load } from './load.service';
import { Submit } from './submit.service';
import { Dui } from '@dotos/dui/core';
import { LoadingService } from '@dotos/dui/common/loading';

export type ACTION_TYPES = {
  'load': Load;
  'submit': Submit
};

export class FormAction {

  public static CLIENT_INVALID: string = 'client';

  public static SERVER_INVALID: string = 'server';

  public static CONNECT_FAILURE: string = 'connect';

  public static LOAD_FAILURE: string = 'load';

  public form: any;

  public options: any;

  public url: string;


  public method: string;

  public params: any;

  public timeout: number;

  public scope: any;

  public type: string = 'default';

  public failureType: string;

  public result: any;

  constructor(protected http: HttpClient,
    public loadingService: LoadingService) {

  }

  init(form, options): FormAction {
    this.form = form;
    this.options = options || {};
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public run(options) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public success(result) {
  }
  public failure(result) {
    this.loadingService.resolve();
    this.result = result;
    this.failureType = FormAction.CONNECT_FAILURE;
    this.form.afterAction(this, result, false);
  }

  public getUrl() {
    let url = this.options.url || this.form.url;
    return url;
  }
  public getMethod() {
    return (this.options.method || this.form.method || 'POST').toUpperCase();
  }
  // private
  public getParams() {
    const bp = this.form.baseParams;
    let p = this.options.params;
    if (p) {
      p = Dui.applyIf(p, bp);
    } else {
      if (bp) {
        p = bp;
      }
    }
    return p;
  }
  public createCallback(opt?) {
    const opts = opt || {};
    let that = this;
    return {
      success: that.success,
      failure: that.failure,
      timeout: opts.timeout * 1000 || that.form.timeout * 1000, upload: that.form.fileUpload ? that.success : undefined
    };
  }
}
