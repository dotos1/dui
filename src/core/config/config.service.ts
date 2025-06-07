
import { Injectable } from '@angular/core';
import { ConfigLoader } from './config.loader';
import { Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DuiBase } from '@dotos/dui/base';
import { getValue } from '@dotos/dui/base';
import { LocalStorageService } from '@dotos/dui/core/storage';

export enum AppConfigValues {
  APP_CONFIG_LANGUAGES_KEY = 'languages',
  PROVIDERS = 'providers',
  OAUTHCONFIG = 'oauth2',
  BASESHAREURL = 'baseShareUrl',
  HOST = 'Host',
  IDENTITY_HOST = 'identityHost',
  AUTHTYPE = 'authType',
  CONTEXTROOTECM = 'contextRootEcm',
  CONTEXTROOTBPM = 'contextRootBpm',
  LOG_LEVEL = 'logLevel',
  LOGIN_ROUTE = 'loginRoute',
  DISABLECSRF = 'disableCSRF',
  AUTH_WITH_CREDENTIALS = 'auth.withCredentials',
  APPLICATION = 'application',
  STORAGE_PREFIX = 'application.storagePrefix',
  NOTIFY_DURATION = 'notificationDefaultDuration'
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public config: any={};

  public onLoadSubject: Subject<any>;
  public onLoad: Observable<any>;

  public onErrorSubject: Subject<any>;
  public onError: Observable<any>;

  constructor(
    protected localStore: LocalStorageService,
    public loader: ConfigLoader) {
    this.onLoadSubject = new Subject();
    this.onLoad = this.onLoadSubject.asObservable();
    this.onErrorSubject = new Subject();
    this.onError = this.onLoadSubject.asObservable();
  }
  setLoader(loader: ConfigLoader){
    this.loader=loader;
  }
  init() {
    this.loader.loadSettings().then((res: any) => {
      if (this.config) {
        DuiBase.apply(this.config, res);
      } else {
        this.config = res
      }
      this.localStore.set("config",this.config);
      this.onLoadSubject.next(this.config);
    }).catch( error => {
      this.onErrorSubject.next(error);
   });;
  }
  loadFromStore(){
    this.config=this.localStore.get("config");
  }
  select(property: string): Observable<any> {
    return this.onLoadSubject
      .pipe(
        map((config) => config[property]),
        distinctUntilChanged()
      );
  }

  get<T>(key: string, defaultValue?: T): T {
    let result: any = getValue(key, this.config);
    if (typeof result === 'string') {
      const keywords = new Map<string, string>();
      keywords.set('hostname', this.getLocationHostname());
      keywords.set(':port', this.getLocationPort(':'));
      keywords.set('port', this.getLocationPort());
      keywords.set('protocol', this.getLocationProtocol());
      result = this.formatString(result, keywords);
    }
    if (result === undefined) {
      return defaultValue;
    }
    return <T>result;
  }

  getLocationProtocol(): string {
    return location.protocol;
  }

  getLocationHostname(): string {
    return location.hostname;
  }

  getLocationPort(prefix: string = ''): string {
    return location.port ? prefix + location.port : '';
  }

  private formatString(str: string, keywords: Map<string, string>): string {
    let result = str;
    keywords.forEach((value, key) => {
      const expr = new RegExp('{' + key + '}', 'gm');
      result = result.replace(expr, value);
    });
    return result;
  }

  getSettings(key?: string | Array<string>, defaultValue?: any): any {

    if (!key || (Array.isArray(key) && !key[0]))
      return this.config;

    if (!Array.isArray(key))
      key = key.split('.');

    let result = key
      .reduce((acc: any, current: string) => acc && acc[current], this.config);

    if (result === undefined) {
      result = defaultValue;
      // if (result === undefined)
      //   throw new Error(`No setting found with the specified key [${key.join('/')}]!`);
    }
    return result;
  }
  setSetting(key: string , value: any): void {
    this.config[key]=value;
  }
}
