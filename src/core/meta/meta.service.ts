/**
 * @fileoverview Module `src/core/meta/meta.service.ts` providing meta service definitions and implementation.
 * @zh 模块文件 `src/core/meta/meta.service.ts`，提供元数据服务相关的定义与实现。
 */

// angular
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

// libs
import { from as observableFrom, Observable, of as observableOf } from 'rxjs';

// module
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetaLoader } from './meta.loader';
import { isObservable, isPromise } from './util';
import { MetaSettings } from './models/meta-settings';

/**
 * Injectable Angular service `MetaService` managing meta service state and operations in `src/core/meta`.
 * @zh 可注入的 Angular 服务 `MetaService`，管理 `src/core/meta` 中的元数据服务状态与业务操作。
 */
@Injectable()
export class MetaService {
  /**
   * Property `settings` (`MetaSettings`) storing settings.
   * @zh 属性 `settings`（类型：`MetaSettings`），用于存储或配置设置项。
   */
  protected readonly settings: MetaSettings;
  /**
   * Property `isMetaTagSet` (`any`) storing is meta tag set.
   * @zh 属性 `isMetaTagSet`（类型：`any`），用于存储或配置是否为元数据标签集合。
   */
  private readonly isMetaTagSet;

  /**
   * Creates an instance of `MetaService` and initializes its dependencies and internal state.
   * @zh 创建 `MetaService` 实例，并初始化其依赖项与内部状态。
   * @param loader - Injected or initial loader (`MetaLoader`) / 注入或传入的加载器（`MetaLoader`）
   * @param title - Injected or initial title (`Title`) / 注入或传入的标题（`Title`）
   * @param meta - Injected or initial meta (`Meta`) / 注入或传入的元数据（`Meta`）
   */
  constructor(readonly loader: MetaLoader,
              private readonly title: Title,
              private readonly meta: Meta) {
    this.settings = loader.settings;
    this.isMetaTagSet = {};
  }

  /**
   * Executes `setTitle` to handle set title.
   * @zh 执行 `setTitle`，用于集合标题。
   * @param title - title parameter (`string`) / 标题参数（`string`）
   * @param override - override parameter (`any`) / override参数（`any`）
   */
  setTitle(title: string, override = false): void {
    const title$ = title
      ? this.callback(title)
      : observableOf('');

    title$
      .subscribe((res: string) => {
        let fullTitle = '';

        if (!res) {
          const defaultTitle$ = (this.settings.defaults && this.settings.defaults['title'])
            ? this.callback(this.settings.defaults['title'])
            : observableOf('');

          defaultTitle$
            .subscribe((defaultTitle: string) => {
              if (!override && this.settings.pageTitleSeparator && this.settings.applicationName)
                this.callback(this.settings.applicationName)
                  .subscribe((applicationName: string) => {
                    fullTitle = applicationName ? this.getTitleWithPositioning(defaultTitle, applicationName) : defaultTitle;
                    this.updateTitle(fullTitle);
                  });
              else
                this.updateTitle(defaultTitle);
            });
        } else if (!override && this.settings.pageTitleSeparator && this.settings.applicationName)
          this.callback(this.settings.applicationName)
            .subscribe((applicationName: string) => {
              fullTitle = applicationName ? this.getTitleWithPositioning(res, applicationName) : res;
              this.updateTitle(fullTitle);
            });
        else
          this.updateTitle(res);
      });
  }

  /**
   * Executes `setTag` to handle set tag.
   * @zh 执行 `setTag`，用于集合标签。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  setTag(key: string, value: string): void {
    if (key === 'title')
      throw new Error(`Attempt to set ${key} through "setTag": "title" is a reserved tag name. `
        + 'Please use `MetaService.setTitle` instead.');

    value = value || ((this.settings.defaults && this.settings.defaults[key])
      ? this.settings.defaults[key]
      : '');

    const value$ = (key !== 'og:locale' && key !== 'og:locale:alternate')
      ? this.callback(value)
      : observableOf(value);

    value$
      .subscribe((res: string) => {
        this.updateTag(key, res);
      });
  }

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param currentUrl - current url parameter (`string`) / 当前链接地址参数（`string`）
   * @param metaSettings - meta settings parameter (`any`) / 元数据设置项参数（`any`）
   */
  update(currentUrl: string, metaSettings?): void {
    if (!metaSettings) {
      const fallbackTitle = this.settings.defaults
        ? (this.settings.defaults['title'] || this.settings['applicationName'])
        : this.settings['applicationName'];

      this.setTitle(fallbackTitle, true);
    } else {
      if (metaSettings.disabled) {
        this.update(currentUrl);

        return;
      }

      this.setTitle(metaSettings.title, metaSettings.override);

      Object.keys(metaSettings)
        .forEach(key => {
          let value = metaSettings[key];

          if (key === 'title' || key === 'override')
            return;
          else if (key === 'og:locale')
            value = value.replace(/-/g, '_');
          else if (key === 'og:locale:alternate') {
            const currentLocale = metaSettings['og:locale'];
            this.updateLocales(currentLocale, metaSettings[key]);

            return;
          }

          this.setTag(key, value);
        });
    }

    if (this.settings.defaults)
      Object.keys(this.settings.defaults)
        .forEach(key => {
          let value = this.settings.defaults[key];

          if ((metaSettings && (key in this.isMetaTagSet || key in metaSettings)) || key === 'title' || key === 'override')
            return;
          else if (key === 'og:locale')
            value = value.replace(/-/g, '_');
          else if (key === 'og:locale:alternate') {
            const currentLocale = metaSettings ? metaSettings['og:locale'] : undefined;
            this.updateLocales(currentLocale, value);

            return;
          }

          this.setTag(key, value);
        });

    const url = ((this.settings.applicationUrl || '/') + currentUrl)
      .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      .replace(/\/$/g, '');

    this.setTag('og:url', url || '/');
  }

  /**
   * Executes `removeTag` to handle remove tag.
   * @zh 执行 `removeTag`，用于移除标签。
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  removeTag(key: string): void {
    this.meta.removeTag(key);
  }

  /**
   * Executes `callback` to handle callback.
   * @zh 执行 `callback`，用于回调函数。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `Observable<string>` / 类型为 `Observable<string>` 的返回值
   */
  private callback(value: string): Observable<string> {
    if (this.settings.callback) {
      const value$ = this.settings.callback(value);

      if (!isObservable(value$))
        return isPromise(value$)
          ? observableFrom(value$)
          : observableOf(value$);

      return value$;
    }

    return observableOf(value);
  }

  /**
   * Executes `getTitleWithPositioning` to handle get title with positioning.
   * @zh 执行 `getTitleWithPositioning`，用于获取标题带有位置。
   * @param title - title parameter (`string`) / 标题参数（`string`）
   * @param applicationName - application name parameter (`string`) / application名称参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getTitleWithPositioning(title: string, applicationName: string): string {
    switch (this.settings.pageTitlePositioning) {
      case PageTitlePositioning.AppendPageTitle:
        return applicationName + this.settings.pageTitleSeparator + title;
      case PageTitlePositioning.PrependPageTitle:
        return title + this.settings.pageTitleSeparator + applicationName;
      default:
        throw new Error(`Invalid pageTitlePositioning specified [${this.settings.pageTitlePositioning}]!`);
    }
  }

  /**
   * Executes `updateTitle` to handle update title.
   * @zh 执行 `updateTitle`，用于更新标题。
   * @param title - title parameter (`string`) / 标题参数（`string`）
   */
  private updateTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({
      property: 'og:title',
      content: title
    });
  }

  /**
   * Executes `updateLocales` to handle update locales.
   * @zh 执行 `updateLocales`，用于更新本地。
   * @param currentLocale - current locale parameter (`string`) / 当前语言区域参数（`string`）
   * @param availableLocales - available locales parameter (`string`) / available本地参数（`string`）
   */
  private updateLocales(currentLocale: string, availableLocales: string): void {
    currentLocale = currentLocale || (this.settings.defaults
      ? this.settings.defaults['og:locale']
      : '');

    if (currentLocale && this.settings.defaults)
      this.settings.defaults['og:locale'] = currentLocale.replace(/_/g, '-');


    const elements = this.meta.getTags('property="og:locale:alternate"');

    elements.forEach((element) => {
      this.meta.removeTagElement(element);
    });

    if (currentLocale && availableLocales)
      availableLocales.split(',')
        .forEach((locale: string) => {
          if (currentLocale.replace(/-/g, '_') !== locale.replace(/-/g, '_'))
            this.meta.addTag({
              property: 'og:locale:alternate',
              content: locale.replace(/-/g, '_')
            });
        });
  }

  /**
   * Executes `updateTag` to handle update tag.
   * @zh 执行 `updateTag`，用于更新标签。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  private updateTag(key: string, value: string): void {
    if (key.lastIndexOf('og:', 0) === 0)
      this.meta.updateTag({
        property: key,
        content: key === 'og:locale' ? value.replace(/-/g, '_') : value
      });
    else
      this.meta.updateTag({
        name: key,
        content: value
      });

    this.isMetaTagSet[key] = true;

    if (key === 'description')
      this.meta.updateTag({
        property: 'og:description',
        content: value
      });
    else if (key === 'author')
      this.meta.updateTag({
        property: 'og:author',
        content: value
      });
    else if (key === 'publisher')
      this.meta.updateTag({
        property: 'og:publisher',
        content: value
      });
    else if (key === 'og:locale') {
      const availableLocales = this.settings.defaults
        ? this.settings.defaults['og:locale:alternate']
        : '';

      this.updateLocales(value, availableLocales);
      this.isMetaTagSet['og:locale:alternate'] = true;
    } else if (key === 'og:locale:alternate') {
      const currentLocale = this.meta.getTag('property="og:locale"').content;

      this.updateLocales(currentLocale, value);
      this.isMetaTagSet['og:locale'] = true;
    }
  }
}
