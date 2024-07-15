import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from '@dotos/dui/core/storage';
import * as _ from 'lodash';
import { DotosConfig } from '../types';

export const DOTOS_CONFIG = new InjectionToken('dotosConfig');

@Injectable({
  providedIn: 'root'
})
export class DotosConfigService {
  private _configSubject: BehaviorSubject<any>;
  private readonly _defaultConfig: any;

  constructor(
    private _platform: Platform,
    private _router: Router,
    public localStore: LocalStorageService,
    @Inject(DOTOS_CONFIG) private _config
  ) {
    this._defaultConfig = _config;
    this._init();
  }

  set config(value) {

    let config = this._configSubject.getValue();
    config = _.merge({}, config, value);
    // this.localStore.set('dotosConfig', config);
    this._configSubject.next(config);
  }

  get config():  Observable<DotosConfig> {
    return this._configSubject.asObservable();
  }

  get defaultConfig(): DotosConfig {
    return this._defaultConfig;
  }

  private _init(): void {
    if (this._platform.ANDROID || this._platform.IOS) {
      this._defaultConfig.customScrollbars = false;
    }
    this._configSubject = new BehaviorSubject(_.cloneDeep(this._defaultConfig));
    this._router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe(() => {
         if (!_.isEqual(this._configSubject.getValue().layout, this._defaultConfig.layout)) {
          const config = _.cloneDeep(this._configSubject.getValue());
          // this.localStore.set('dotosConfig', config);
          this._configSubject.next(config);
        }
      });
  }


  getValue(key) {
    let config = this._configSubject.getValue();
    return config[key];
  }

  setValue(key, value, opts = { emitEvent: true }) {
    let config = this._configSubject.getValue();
    config[key] = value;
    if (opts.emitEvent === true) {


      this._configSubject.next(config);
    }
  }

  resetToDefaults(): void {
    console.log(_.cloneDeep(this._defaultConfig));
    this._configSubject.next(_.cloneDeep(this._defaultConfig));
  }
}

