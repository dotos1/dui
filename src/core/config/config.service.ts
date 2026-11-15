/**
 * @fileoverview Module `src/core/config/config.service.ts` providing config service definitions and implementation.
 * @zh 模块文件 `src/core/config/config.service.ts`，提供配置服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';
import { ConfigLoader } from './config.loader';
import { Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DuiBase } from '@dotos1/dui/base';
import { getValue } from '@dotos1/dui/base';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import { DuiSettings } from './settings';

/**
 * Enumeration `AppConfigValues` defining supported app config values constants.
 * @zh 枚举 `AppConfigValues`，定义支持的App配置值列表常量集合。
 */
export enum AppConfigValues {
  /**
   * Enum member `AppConfigValues.APP_CONFIG_LANGUAGES_KEY` = 'languages' representing app config languages key.
   * @zh 枚举项 `AppConfigValues.APP_CONFIG_LANGUAGES_KEY` = 'languages'，表示APP配置语言键。
   */
  APP_CONFIG_LANGUAGES_KEY = 'languages',
  /**
   * Enum member `AppConfigValues.PROVIDERS` = 'providers' representing providers.
   * @zh 枚举项 `AppConfigValues.PROVIDERS` = 'providers'，表示提供者列表。
   */
  PROVIDERS = 'providers',
  /**
   * Enum member `AppConfigValues.OAUTHCONFIG` = 'oauth2' representing oauthconfig.
   * @zh 枚举项 `AppConfigValues.OAUTHCONFIG` = 'oauth2'，表示OAUTHCONFIG。
   */
  OAUTHCONFIG = 'oauth2',
  /**
   * Enum member `AppConfigValues.BASESHAREURL` = 'baseShareUrl' representing baseshareurl.
   * @zh 枚举项 `AppConfigValues.BASESHAREURL` = 'baseShareUrl'，表示BASESHAREURL。
   */
  BASESHAREURL = 'baseShareUrl',
  /**
   * Enum member `AppConfigValues.HOST` = 'Host' representing host.
   * @zh 枚举项 `AppConfigValues.HOST` = 'Host'，表示宿主。
   */
  HOST = 'Host',
  /**
   * Enum member `AppConfigValues.IDENTITY_HOST` = 'identityHost' representing identity host.
   * @zh 枚举项 `AppConfigValues.IDENTITY_HOST` = 'identityHost'，表示IDENTITY宿主。
   */
  IDENTITY_HOST = 'identityHost',
  /**
   * Enum member `AppConfigValues.AUTHTYPE` = 'authType' representing authtype.
   * @zh 枚举项 `AppConfigValues.AUTHTYPE` = 'authType'，表示AUTHTYPE。
   */
  AUTHTYPE = 'authType',
  /**
   * Enum member `AppConfigValues.CONTEXTROOTECM` = 'contextRootEcm' representing contextrootecm.
   * @zh 枚举项 `AppConfigValues.CONTEXTROOTECM` = 'contextRootEcm'，表示CONTEXTROOTECM。
   */
  CONTEXTROOTECM = 'contextRootEcm',
  /**
   * Enum member `AppConfigValues.CONTEXTROOTBPM` = 'contextRootBpm' representing contextrootbpm.
   * @zh 枚举项 `AppConfigValues.CONTEXTROOTBPM` = 'contextRootBpm'，表示CONTEXTROOTBPM。
   */
  CONTEXTROOTBPM = 'contextRootBpm',
  /**
   * Enum member `AppConfigValues.LOG_LEVEL` = 'logLevel' representing log level.
   * @zh 枚举项 `AppConfigValues.LOG_LEVEL` = 'logLevel'，表示日志层级。
   */
  LOG_LEVEL = 'logLevel',
  /**
   * Enum member `AppConfigValues.LOGIN_ROUTE` = 'loginRoute' representing login route.
   * @zh 枚举项 `AppConfigValues.LOGIN_ROUTE` = 'loginRoute'，表示LOGINROUTE。
   */
  LOGIN_ROUTE = 'loginRoute',
  /**
   * Enum member `AppConfigValues.DISABLECSRF` = 'disableCSRF' representing disablecsrf.
   * @zh 枚举项 `AppConfigValues.DISABLECSRF` = 'disableCSRF'，表示DISABLECSRF。
   */
  DISABLECSRF = 'disableCSRF',
  /**
   * Enum member `AppConfigValues.AUTH_WITH_CREDENTIALS` = 'auth.withCredentials' representing auth with credentials.
   * @zh 枚举项 `AppConfigValues.AUTH_WITH_CREDENTIALS` = 'auth.withCredentials'，表示认证带有CREDENTIALS。
   */
  AUTH_WITH_CREDENTIALS = 'auth.withCredentials',
  /**
   * Enum member `AppConfigValues.APPLICATION` = 'application' representing application.
   * @zh 枚举项 `AppConfigValues.APPLICATION` = 'application'，表示APPLICATION。
   */
  APPLICATION = 'application',
  /**
   * Enum member `AppConfigValues.STORAGE_PREFIX` = 'application.storagePrefix' representing storage prefix.
   * @zh 枚举项 `AppConfigValues.STORAGE_PREFIX` = 'application.storagePrefix'，表示存储前缀。
   */
  STORAGE_PREFIX = 'application.storagePrefix',
  /**
   * Enum member `AppConfigValues.NOTIFY_DURATION` = 'notificationDefaultDuration' representing notify duration.
   * @zh 枚举项 `AppConfigValues.NOTIFY_DURATION` = 'notificationDefaultDuration'，表示通知持续时间。
   */
  NOTIFY_DURATION = 'notificationDefaultDuration'
}

/**
 * Injectable Angular service `ConfigService` managing config service state and operations in `src/core/config`.
 * @zh 可注入的 Angular 服务 `ConfigService`，管理 `src/core/config` 中的配置服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /**
   * Property `config` (`DuiSettings`) storing config (default: `{}`).
   * @zh 属性 `config`（类型：`DuiSettings`），用于存储或配置配置（默认值：`{}`）。
   */
  /** 应用配置（settings.json 加载结果）：顶层键 → 值 */
  public config: DuiSettings = {};

  /**
   * Property `onLoadSubject` (`Subject<DuiSettings>`) storing on load subject.
   * @zh 属性 `onLoadSubject`（类型：`Subject<DuiSettings>`），用于存储或配置当加载主题流。
   */
  public onLoadSubject: Subject<DuiSettings>;
  /**
   * Property `onLoad` (`Observable<DuiSettings>`) storing on load.
   * @zh 属性 `onLoad`（类型：`Observable<DuiSettings>`），用于存储或配置当加载。
   */
  public onLoad: Observable<DuiSettings>;

  /**
   * Property `onErrorSubject` (`Subject<{ [key: string]: unknown; status?: number; }>`) storing on error subject.
   * @zh 属性 `onErrorSubject`（类型：`Subject<{ [key: string]: unknown; status?: number; }>`），用于存储或配置当错误主题流。
   */
  /** 配置加载失败：多为 HttpErrorResponse（带 status） */
  public onErrorSubject: Subject<{ status?: number; [key: string]: unknown }>;
  /**
   * Property `onError` (`Observable<{ [key: string]: unknown; status?: number; }>`) storing on error.
   * @zh 属性 `onError`（类型：`Observable<{ [key: string]: unknown; status?: number; }>`），用于存储或配置当错误。
   */
  public onError: Observable<{ status?: number; [key: string]: unknown }>;

  /**
   * Creates an instance of `ConfigService` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigService` 实例，并初始化其依赖项与内部状态。
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param loader - Injected or initial loader (`ConfigLoader`) / 注入或传入的加载器（`ConfigLoader`）
   */
  constructor(
    protected localStore: LocalStorageService,
    public loader: ConfigLoader) {
    this.onLoadSubject = new Subject<DuiSettings>();
    this.onLoad = this.onLoadSubject.asObservable();
    this.onErrorSubject = new Subject<{ status?: number; [key: string]: unknown }>();
    this.onError = this.onErrorSubject.asObservable();
  }
  /**
   * Executes `setLoader` to handle set loader.
   * @zh 执行 `setLoader`，用于集合加载器。
   * @param loader - loader parameter (`ConfigLoader`) / 加载器参数（`ConfigLoader`）
   */
  setLoader(loader: ConfigLoader){
    this.loader=loader;
  }
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  init() {
    this.loader.loadSettings().then((res) => {
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
  /**
   * Executes `loadFromStore` to handle load from store.
   * @zh 执行 `loadFromStore`，用于加载从状态仓库。
   */
  loadFromStore(){
    this.config=this.localStore.get("config");
  }
  /**
   * Executes `select` to handle select.
   * @zh 执行 `select`，用于下拉选择。
   * @param property - property parameter (`string`) / 属性参数（`string`）
   * @returns Result of type `Observable<unknown>` / 类型为 `Observable<unknown>` 的返回值
   */
  select(property: string) {
    return this.onLoadSubject
      .pipe(
        map((config) => config[property]),
        distinctUntilChanged()
      );
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param defaultValue - default value parameter (`T`) / 默认值参数（`T`）
   * @returns Result of type `T` / 类型为 `T` 的返回值
   */
  get<T>(key: string, defaultValue?: T): T {
    let result = getValue(key, this.config);
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

  /**
   * Executes `getLocationProtocol` to handle get location protocol.
   * @zh 执行 `getLocationProtocol`，用于获取LocationProtocol。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getLocationProtocol(): string {
    return location.protocol;
  }

  /**
   * Executes `getLocationHostname` to handle get location hostname.
   * @zh 执行 `getLocationHostname`，用于获取LocationHostname。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getLocationHostname(): string {
    return location.hostname;
  }

  /**
   * Executes `getLocationPort` to handle get location port.
   * @zh 执行 `getLocationPort`，用于获取LocationPort。
   * @param prefix - prefix parameter (`string`) / 前缀参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getLocationPort(prefix: string = ''): string {
    return location.port ? prefix + location.port : '';
  }

  /**
   * Executes `formatString` to handle format string.
   * @zh 执行 `formatString`，用于格式化字符串。
   * @param str - str parameter (`string`) / 字符串参数（`string`）
   * @param keywords - keywords parameter (`Map<string, string>`) / keywords参数（`Map<string, string>`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private formatString(str: string, keywords: Map<string, string>): string {
    let result = str;
    keywords.forEach((value, key) => {
      const expr = new RegExp('{' + key + '}', 'gm');
      result = result.replace(expr, value);
    });
    return result;
  }

  /**
   * Executes `getSettings` to handle get settings.
   * @zh 执行 `getSettings`，用于获取设置项。
   * @param key - key parameter (`string | Array<string>`) / 键参数（`string | Array<string>`）
   * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
   * @returns Result of type `DuiSettings` / 类型为 `DuiSettings` 的返回值
   */
  /**
   * 读配置：顶层键直接给出 DuiSettings 里的类型；点分路径（'seo.defaultPageTitle'）或数组路径
   * 返回调用方声明的类型 T（默认 unknown，由调用方收窄）。不传 key 返回整个配置。
   */
  getSettings(): DuiSettings;
  getSettings<K extends keyof DuiSettings & string>(key: K, defaultValue?: DuiSettings[K]): DuiSettings[K];
  getSettings<T = unknown>(key: string | Array<string>, defaultValue?: T): T;
  getSettings(key?: string | Array<string>, defaultValue?: unknown): unknown {

    if (!key || (Array.isArray(key) && !key[0]))
      return this.config;

    const path = Array.isArray(key) ? key : key.split('.');

    let result = path
      .reduce((acc: unknown, current: string) => (acc ? (acc as Record<string, unknown>)[current] : acc), this.config as unknown);

    if (result === undefined) {
      result = defaultValue;
      // if (result === undefined)
      //   throw new Error(`No setting found with the specified key [${key.join('/')}]!`);
    }
    return result;
  }
  /**
   * Executes `setSetting` to handle set setting.
   * @zh 执行 `setSetting`，用于集合设置。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param value - value parameter (`unknown`) / 值参数（`unknown`）
   */
  setSetting(key: string, value: unknown): void {
    this.config[key]=value;
  }
}
