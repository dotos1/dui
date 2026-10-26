/**
 * @fileoverview Module `src/translator/translate.directive.ts` providing translate directive definitions and implementation.
 * @zh 模块文件 `src/translator/translate.directive.ts`，提供翻译指令相关的定义与实现。
 */

import {AfterViewChecked, ChangeDetectorRef, Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {Subscription, isObservable} from 'rxjs';
import {DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent} from './translate.service';
import {equals, isDefined} from './util';

/**
 * Angular directive `TranslateDirective` (selector: '[translate],[ngx-translate]') attaching translate directive behavior to host DOM elements.
 * @zh Angular 指令 `TranslateDirective`（selector: '[translate],[ngx-translate]'），为宿主 DOM 元素附加翻译指令行为。
 */
@Directive({
  selector: '[translate],[ngx-translate]'
})
export class TranslateDirective implements AfterViewChecked, OnDestroy {
  /**
   * Property `key` (`string`) storing key.
   * @zh 属性 `key`（类型：`string`），用于存储或配置键。
   */
  key: string;
  /**
   * Property `lastParams` (`any`) storing last params.
   * @zh 属性 `lastParams`（类型：`any`），用于存储或配置末尾参数集合。
   */
  lastParams;
  /**
   * Property `currentParams` (`any`) storing current params.
   * @zh 属性 `currentParams`（类型：`any`），用于存储或配置当前参数集合。
   */
  currentParams;
  /**
   * Property `onLangChangeSub` (`Subscription`) storing on lang change sub.
   * @zh 属性 `onLangChangeSub`（类型：`Subscription`），用于存储或配置当语言变更子。
   */
  onLangChangeSub: Subscription;
  /**
   * Property `onDefaultLangChangeSub` (`Subscription`) storing on default lang change sub.
   * @zh 属性 `onDefaultLangChangeSub`（类型：`Subscription`），用于存储或配置当默认语言变更子。
   */
  onDefaultLangChangeSub: Subscription;
  /**
   * Property `onTranslationChangeSub` (`Subscription`) storing on translation change sub.
   * @zh 属性 `onTranslationChangeSub`（类型：`Subscription`），用于存储或配置当翻译文本变更子。
   */
  onTranslationChangeSub: Subscription;

  /**
   * Input setter `translate` updating translate.
   * @zh 输入属性 `translate` 的设置器，用于更新翻译。
   * @param key - New translate value (`string`) / 新的翻译值（`string`）
   */
  @Input() set translate(key: string) {
    if (key) {
      this.key = key;
      this.checkNodes();
    }
  }

  /**
   * Input setter `translateParams` updating translate params.
   * @zh 输入属性 `translateParams` 的设置器，用于更新翻译参数集合。
   * @param params - New translate params value (`any`) / 新的翻译参数集合值（`any`）
   */
  @Input() set translateParams(params) {
    if (!equals(this.currentParams, params)) {
      this.currentParams = params;
      this.checkNodes(true);
    }
  }

  /**
   * Creates an instance of `TranslateDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TranslateDirective` 实例，并初始化其依赖项与内部状态。
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   * @param element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param _ref - Injected or initial ref (`ChangeDetectorRef`) / 注入或传入的引用（`ChangeDetectorRef`）
   */
  constructor(private translateService: TranslateService, private element: ElementRef, private _ref: ChangeDetectorRef) {
    // subscribe to onTranslationChange event, in case the translations of the current lang change
    if (!this.onTranslationChangeSub) {
      this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
        if (event.lang === this.translateService.currentLang) {
          this.checkNodes(true, event.translations);
        }
      });
    }

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChangeSub) {
      this.onLangChangeSub = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.checkNodes(true, event.translations);
      });
    }


    if (!this.onDefaultLangChangeSub) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.onDefaultLangChangeSub = this.translateService.onDefaultLangChange.subscribe((event: DefaultLangChangeEvent) => {
        this.checkNodes(true);
      });
    }
  }

  /**
   * Angular lifecycle hook invoked after every check of the component's view and child views.
   * @zh Angular 生命周期钩子：在每次检查完组件视图及其子视图后调用。
   */
  ngAfterViewChecked() {
    this.checkNodes();
  }

  /**
   * Executes `checkNodes` to handle check nodes.
   * @zh 执行 `checkNodes`，用于检查节点列表。
   * @param forceUpdate - force update parameter (`any`) / force更新参数（`any`）
   * @param translations - translations parameter (`any`) / 翻译文本参数（`any`）
   */
  checkNodes(forceUpdate = false, translations?) {
    let nodes: NodeList = this.element.nativeElement.childNodes;
    // if the element is empty
    if (!nodes.length) {
      if (!this.key) {
        return;
      }
      // we add the key as content
      this.setContent(this.element.nativeElement, this.key);
      nodes = this.element.nativeElement.childNodes;
    }
    for (let i = 0; i < nodes.length; ++i) {
      let node: Node & { lastKey?: string; lookupKey?: string; currentValue?: string; originalContent?: string } = nodes[i];
      if (node.nodeType === 3) { // node type 3 is a text node
        let key: string;
        if (forceUpdate) {
          node.lastKey = null;
        }
        if (!forceUpdate && isDefined(node.lastKey) && this.lastParams === this.currentParams) {
          if (this.key) {
            if (node.lastKey === this.key) {
              continue;
            }
          } else if (this.getContent(node) === node.currentValue) {
            continue;
          }
        }
        if(isDefined(node.lookupKey)) {
          key = node.lookupKey;
        } else if (this.key) {
          key = this.key;
        } else {
          let content = this.getContent(node);
          let trimmedContent = content.trim();
          if (trimmedContent.length) {
            node.lookupKey = trimmedContent;
            // we want to use the content as a key, not the translation value
            if (content !== node.currentValue) {
              key = trimmedContent;
              // the content was changed from the user, we'll use it as a reference if needed
              node.originalContent = content || node.originalContent;
            } else if (node.originalContent) { // the content seems ok, but the lang has changed
              // the current content is the translation, not the key, use the last real content as key
              key = node.originalContent.trim();
            }
          }
        }
        this.updateValue(key, node, translations);
      }
    }
  }

  /**
   * Executes `updateValue` to handle update value.
   * @zh 执行 `updateValue`，用于更新值。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param translations - translations parameter (`any`) / 翻译文本参数（`any`）
   */
  updateValue(key: string, node, translations) {
    if (key) {
      if (node.lastKey === key && this.lastParams === this.currentParams) {
        return;
      }

      this.lastParams = this.currentParams;

      let onTranslation = (res: string) => {
        if (res !== key || !this.translateService['pending']) {
          node.lastKey = key;
        }
        if (!node.originalContent) {
          node.originalContent = this.getContent(node);
        }
        node.currentValue = isDefined(res) ? res : (node.originalContent || key);
        // we replace in the original content to preserve spaces that we might have trimmed
        const newContent = this.key ? node.currentValue : node.originalContent.replace(key, node.currentValue);
        if (this.getContent(node) !== newContent) {
          this.setContent(node, newContent);
          this._ref.markForCheck();
        }
      };

      if (isDefined(translations)) {
        let res = this.translateService.getParsedResult(translations, key, this.currentParams);
        if (isObservable(res)) {
          res.subscribe((res: string)=>onTranslation(res));
        } else {
          onTranslation(res);
        }
      } else {
        this.translateService.get(key, this.currentParams).subscribe(onTranslation);
      }
    }
  }

  /**
   * Executes `getContent` to handle get content.
   * @zh 执行 `getContent`，用于获取内容。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getContent(node): string {
    return isDefined(node.textContent) ? node.textContent : node.data;
  }

  /**
   * Executes `setContent` to handle set content.
   * @zh 执行 `setContent`，用于集合内容。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param content - content parameter (`string`) / 内容参数（`string`）
   */
  setContent(node, content: string): void {
    if (isDefined(node.textContent)) {
      node.textContent = content;
    } else {
      node.data = content;
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.onLangChangeSub) {
      this.onLangChangeSub.unsubscribe();
    }

    if (this.onDefaultLangChangeSub) {
      this.onDefaultLangChangeSub.unsubscribe();
    }

    if (this.onTranslationChangeSub) {
      this.onTranslationChangeSub.unsubscribe();
    }
  }
}
