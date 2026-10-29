/**
 * @fileoverview Module `src/translator/translate.pipe.ts` providing translate pipe definitions and implementation.
 * @zh 模块文件 `src/translator/translate.pipe.ts`，提供翻译管道相关的定义与实现。
 */

import {ChangeDetectorRef,  Injectable, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {isObservable} from 'rxjs';
import { LangChangeEvent, TranslateService, TranslationChangeEvent} from './translate.service';
import {equals, isDefined} from './util';
import { Subscription } from 'rxjs';

// 注意：不要给本类加 `providedIn: 'root'`。它是 `pure: false` 的有状态管道，
// 每个绑定点持有自己的 value/lastKey/lastParams 与三个订阅；若变成全局单例被注入，
// 各调用点会互相覆盖状态并返回上一次的翻译结果。
/**
 * Angular pipe `TranslatePipe` (name: 'translate') transforming values for translate pipe display in templates.
 * @zh Angular 管道 `TranslatePipe`（name: 'translate'），在模板中转换数据以用于翻译管道展示。
 */
@Injectable()
@Pipe({
  name: 'translate',
  pure: false // required to update the value when the promise is resolved
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  /**
   * Property `value` (`string`) storing value (default: `''`).
   * @zh 属性 `value`（类型：`string`），用于存储或配置值（默认值：`''`）。
   */
  value: string = '';
  /**
   * Property `lastKey` (`string`) storing last key.
   * @zh 属性 `lastKey`（类型：`string`），用于存储或配置末尾键。
   */
  lastKey: string;
  /**
   * Property `lastParams` (`any`) storing last params.
   * @zh 属性 `lastParams`（类型：`any`），用于存储或配置末尾参数集合。
   */
  lastParams;
  /**
   * Property `onTranslationChange` (`Subscription`) storing on translation change.
   * @zh 属性 `onTranslationChange`（类型：`Subscription`），用于存储或配置当翻译文本变更。
   */
  onTranslationChange: Subscription;
  /**
   * Property `onLangChange` (`Subscription`) storing on lang change.
   * @zh 属性 `onLangChange`（类型：`Subscription`），用于存储或配置当语言变更。
   */
  onLangChange: Subscription;
  /**
   * Property `onDefaultLangChange` (`Subscription`) storing on default lang change.
   * @zh 属性 `onDefaultLangChange`（类型：`Subscription`），用于存储或配置当默认语言变更。
   */
  onDefaultLangChange: Subscription;

  /**
   * Creates an instance of `TranslatePipe` and initializes its dependencies and internal state.
   * @zh 创建 `TranslatePipe` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _ref - Injected or initial ref (`ChangeDetectorRef`) / 注入或传入的引用（`ChangeDetectorRef`）
   */
  constructor(private translate: TranslateService, private _ref: ChangeDetectorRef) {
  }

  /**
   * Executes `updateValue` to handle update value.
   * @zh 执行 `updateValue`，用于更新值。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param interpolateParams - interpolate params parameter (`Object`) / interpolate参数集合参数（`Object`）
   * @param translations - translations parameter (`any`) / 翻译文本参数（`any`）
   */
  updateValue(key: string, interpolateParams?: Object, translations?): void {
    let onTranslation = (res: string) => {
      this.value = res !== undefined ? res : key;
      this.lastKey = key;
      this._ref.markForCheck();
    };
    if (translations) {
      let res = this.translate.getParsedResult(translations, key, interpolateParams);
      // 判断 res 本身是不是 Observable。此前写的是 `isObservable(res.subscribe)`，
      // 传入的是 subscribe 方法（函数永远不是 Observable），该分支恒不成立，
      // 导致 Observable 对象被直接赋给 value，模板会闪出 [object Object]。
      if (isObservable(res)) {
        res.subscribe(onTranslation);
      } else {
        onTranslation(res);
      }
    } else {
      this.translate.get(key, interpolateParams).subscribe(onTranslation);
    }
  }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param query - query parameter (`string`) / 查询参数（`string`）
   * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(query: string, ...args) {
    if (!query || !query.length) {
      return query;
    }

    // if we ask another time for the same key, return the last value
    if (equals(query, this.lastKey) && equals(args, this.lastParams)) {
      return this.value;
    }

    let interpolateParams: Object;
    if (isDefined(args[0]) && args.length) {
      if (typeof args[0] === 'string' && args[0].length) {
        // we accept objects written in the template such as {n:1}, {'n':1}, {n:'v'}
        // which is why we might need to change it to real JSON objects such as {"n":1} or {"n":"v"}
        let validArgs: string = args[0]
          .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
          .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
    }

    // store the query, in case it changes
    this.lastKey = query;

    // store the params, in case they change
    this.lastParams = args;

    // set the value
    this.updateValue(query, interpolateParams);

    // if there is a subscription to onLangChange, clean it
    this._dispose();

    // subscribe to onTranslationChange event, in case the translations change
    if (!this.onTranslationChange) {
      this.onTranslationChange = this.translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
        if (this.lastKey && event.lang === this.translate.currentLang) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        if (this.lastKey) {
          this.lastKey = null; // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }

    // subscribe to onDefaultLangChange event, in case the default language changes
    if (!this.onDefaultLangChange) {
      this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null; // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(query, interpolateParams);
        }
      });
    }

    return this.value;
  }

  /**
   * Clean any existing subscription to change events

   * @zh 执行 `_dispose`，用于释放。
   */
  private _dispose(): void {
    if (typeof this.onTranslationChange !== 'undefined') {
      this.onTranslationChange.unsubscribe();
      this.onTranslationChange = undefined;
    }
    if (typeof this.onLangChange !== 'undefined') {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
    if (typeof this.onDefaultLangChange !== 'undefined') {
      this.onDefaultLangChange.unsubscribe();
      this.onDefaultLangChange = undefined;
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._dispose();
  }
}
