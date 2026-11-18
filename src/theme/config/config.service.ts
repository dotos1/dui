/**
 * @fileoverview Module `src/theme/config/config.service.ts` providing config service definitions and implementation.
 * @zh 模块文件 `src/theme/config/config.service.ts`，提供配置服务相关的定义与实现。
 */

import { Platform } from '@angular/cdk/platform';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { LocalStorageService } from '@dotos1/dui/core/storage';
import {merge,cloneDeep,isEqual}  from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DotosConfig } from '../types';

/**
 * Angular dependency-injection token `DOTOS_CONFIG` for providing dotos config.
 * @zh Angular 依赖注入令牌 `DOTOS_CONFIG`，用于提供与注入DotOS配置。
 */
export const DOTOS_CONFIG = new InjectionToken('dotosConfig');

/**
 * Injectable Angular service `DotosConfigService` managing dotos config service state and operations in `src/theme/config`.
 * @zh 可注入的 Angular 服务 `DotosConfigService`，管理 `src/theme/config` 中的DotOS配置服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class DotosConfigService {
  /**
   * Property `_configSubject` (`BehaviorSubject<DotosConfig>`) storing config subject.
   * @zh 属性 `_configSubject`（类型：`BehaviorSubject<DotosConfig>`），用于存储或配置配置主题流。
   */
  private _configSubject: BehaviorSubject<DotosConfig>;
  /**
   * Property `_defaultConfig` (`DotosConfig`) storing default config.
   * @zh 属性 `_defaultConfig`（类型：`DotosConfig`），用于存储或配置默认配置。
   */
  private readonly _defaultConfig: DotosConfig;

  /**
   * Creates an instance of `DotosConfigService` and initializes its dependencies and internal state.
   * @zh 创建 `DotosConfigService` 实例，并初始化其依赖项与内部状态。
   * @param _platform - Injected or initial platform (`Platform`) / 注入或传入的platform（`Platform`）
   * @param _router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param _config - Injected or initial config (`any`) / 注入或传入的配置（`any`）
   */
  constructor(
    private _platform: Platform,
    private _router: Router,
    public localStore: LocalStorageService,
    @Inject(DOTOS_CONFIG) private _config
  ) {
    this._defaultConfig = _config;
    this._init();
  }

  /**
   * Sets the config (`config`).
   * @zh 设置配置（`config`）。
   * @param value - New config value (`Partial<DotosConfig>`) / 新的配置值（`Partial<DotosConfig>`）
   */
  set config(value: Partial<DotosConfig>) {

    let config = this._configSubject.getValue();
    config = merge({}, config, value);
    // this.localStore.set('dotosConfig', config);
    this._configSubject.next(config);
  }

  /**
   * Gets the current config (`config: Observable<DotosConfig>`).
   * @zh 获取当前配置（`config: Observable<DotosConfig>`）。
   */
  get config():  Observable<DotosConfig> {
    return this._configSubject.asObservable();
  }

  /**
   * Gets the current default config (`defaultConfig: DotosConfig`).
   * @zh 获取当前默认配置（`defaultConfig: DotosConfig`）。
   */
  get defaultConfig(): DotosConfig {
    return this._defaultConfig;
  }

  /**
   * Executes `_init` to handle init.
   * @zh 执行 `_init`，用于初始化。
   */
  private _init(): void {
    if (this._platform.ANDROID || this._platform.IOS) {
      this._defaultConfig.customScrollbars = false;
    }
    this._configSubject = new BehaviorSubject(cloneDeep(this._defaultConfig));
    this._router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe(() => {
         if (!isEqual(this._configSubject.getValue().layout, this._defaultConfig.layout)) {
          const config = cloneDeep(this._configSubject.getValue());
          // this.localStore.set('dotosConfig', config);
          this._configSubject.next(config);
        }
      });
  }


  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @param key - key parameter (`any`) / 键参数（`any`）
   */
  getValue(key) {
    let config = this._configSubject.getValue();
    return config[key];
  }

  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param opts - opts parameter (`{ emitEvent: boolean; }`) / 选项列表参数（`{ emitEvent: boolean; }`）
   */
  setValue(key, value, opts = { emitEvent: true }) {
    let config = this._configSubject.getValue();
    config[key] = value;
    if (opts.emitEvent === true) {


      this._configSubject.next(config);
    }
  }

  /**
   * Executes `resetToDefaults` to handle reset to defaults.
   * @zh 执行 `resetToDefaults`，用于重置转换为默认值集合。
   */
  resetToDefaults(): void {
    console.log(cloneDeep(this._defaultConfig));
    this._configSubject.next(cloneDeep(this._defaultConfig));
  }
}

