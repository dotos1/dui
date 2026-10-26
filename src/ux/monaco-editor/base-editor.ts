/**
 * @fileoverview Module `src/ux/monaco-editor/base-editor.ts` providing base editor definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/base-editor.ts`，提供基础编辑器相关的定义与实现。
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';
import { TranslateService } from '@dotos/dui/translator';
/**
 * Constant/variable `loadedMonaco` defining loaded monaco in `src/ux/monaco-editor`.
 * @zh 常量/变量 `loadedMonaco`，定义 `src/ux/monaco-editor` 中的已加载Monaco编辑器。
 */
let loadedMonaco = false;
/**
 * Constant/variable `loadPromise` defining load promise in `src/ux/monaco-editor`.
 * @zh 常量/变量 `loadPromise`，定义 `src/ux/monaco-editor` 中的加载Promise。
 */
let loadPromise: Promise<void>;
/**
 * Constant/variable `defaultLanguage` defining default language in `src/ux/monaco-editor`.
 * @zh 常量/变量 `defaultLanguage`，定义 `src/ux/monaco-editor` 中的默认语言。
 */
export const defaultLanguage = 'en-us';
/**
 * Constant/variable `cultureDists` defining culture dists in `src/ux/monaco-editor`.
 * @zh 常量/变量 `cultureDists`，定义 `src/ux/monaco-editor` 中的cultureDists。
 */
export const cultureDists = {
  'zh-cn': 'zh-cn',
  'zh-tw': 'zh-tw',
  'zh-hk': 'zh-tw',
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'de-de': 'de',
  'fr-fr': 'fr',
  'it-it': 'it',
  'es-es': 'es',
  'ru-ru': 'ru',
};
/**
 * Angular component `BaseEditor` providing base editor presentation and interaction in `src/ux/monaco-editor`.
 * @zh Angular 组件 `BaseEditor`，提供基础编辑器的视图渲染与交互逻辑（位于 `src/ux/monaco-editor`）。
 */
@Component({
  template: ''
})
export abstract class BaseEditor implements OnInit,AfterViewInit, OnDestroy {

  /**
   * Input setter `insideNg` updating inside ng.
   * @zh 输入属性 `insideNg` 的设置器，用于更新内部Angular。
   * @param insideNg - New inside ng value (`boolean`) / 新的内部Angular值（`boolean`）
   */
  @Input('insideNg')
  set insideNg(insideNg: boolean) {
    this._insideNg = insideNg;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  /**
   * Gets the current inside ng (`insideNg: boolean`).
   * @zh 获取当前内部Angular（`insideNg: boolean`）。
   */
  get insideNg(): boolean {
    return this._insideNg;
  }

  /**
   * Template/content query reference `_editorContainer` (`@ViewChild`) targeting editor container.
   * @zh 模板/内容视图查询引用 `_editorContainer`（`@ViewChild`），指向编辑器容器。
   */
  @ViewChild('editorContainer', { static: true }) _editorContainer: ElementRef;
  /**
   * Output event emitter `onInit` (`EventEmitter`) firing when on init occurs.
   * @zh 输出事件 `onInit`（类型：`EventEmitter`），当触发当初始化时向外发出事件。
   */
  @Output() onInit = new EventEmitter();
  /**
   * Property `_editor` (`any`) storing editor.
   * @zh 属性 `_editor`（类型：`any`），用于存储或配置编辑器。
   */
  protected _editor;
  /**
   * Property `_options` (`any`) storing options.
   * @zh 属性 `_options`（类型：`any`），用于存储或配置配置选项。
   */
  protected _options;
  /**
   * Property `_windowResizeSubscription` (`Subscription`) storing window resize subscription.
   * @zh 属性 `_windowResizeSubscription`（类型：`Subscription`），用于存储或配置窗口调整尺寸订阅对象。
   */
  protected _windowResizeSubscription: Subscription;
  /**
   * Property `_destroyed` (`boolean`) storing destroyed (default: `false`).
   * @zh 属性 `_destroyed`（类型：`boolean`），用于存储或配置已销毁（默认值：`false`）。
   */
  protected _destroyed: boolean = false;
  /**
   * Property `_insideNg` (`boolean`) storing inside ng (default: `false`).
   * @zh 属性 `_insideNg`（类型：`boolean`），用于存储或配置内部Angular（默认值：`false`）。
   */
  private _insideNg: boolean = false;

  /**
   * Creates an instance of `BaseEditor` and initializes its dependencies and internal state.
   * @zh 创建 `BaseEditor` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param config - Injected or initial config (`MonacoEditorConfig`) / 注入或传入的配置（`MonacoEditorConfig`）
   */
  constructor(
    public translate: TranslateService,
    @Inject(MONACO_EDITOR_CONFIG) protected config: MonacoEditorConfig) {}


  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    let lang = this.translate.currentLang.replace('_', '-').toLowerCase();
    let uiLanguage = cultureDists[lang] || defaultLanguage;
  }
  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadPromise.then(() => {
        if (!this._destroyed) {
          this.initMonaco(this._options, this.insideNg);
        }
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve) => {
        const baseUrl = this.config.baseUrl || "./assets";
        if (typeof ((<{ monaco? }><unknown>window).monaco) === 'object') {
          if (!this._destroyed) {
            this.initMonaco(this._options, this.insideNg);
          }
          resolve();
          return;
        }
        const onGotAmdLoader = (require?) => {
          let usedRequire = require || (<{ require? }><unknown>window).require;
          let requireConfig = { paths: { vs: `${baseUrl}/monaco/min/vs` } };
          Object.assign(requireConfig, this.config.requireConfig || {});

          // Load monaco
          usedRequire.config(requireConfig);
          usedRequire([`vs/editor/editor.main`], () => {
            if (typeof this.config.onMonacoLoad === 'function') {
              this.config.onMonacoLoad();
            }
            if (!this._destroyed) {
              this.initMonaco(this._options, this.insideNg);
            }
            resolve();
          });
        };

        if (this.config.monacoRequire) {
          onGotAmdLoader(this.config.monacoRequire);
        // Load AMD loader if necessary
        } else if (!(<{ require? }><unknown>window).require) {
          const loaderScript: HTMLScriptElement = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = `${baseUrl}/monaco/min/vs/loader.js`;
          loaderScript.addEventListener('load', () => { onGotAmdLoader(); });
          document.body.appendChild(loaderScript);
        // Load AMD loader without over-riding node's require
        } else if (!(<{ require? }><unknown>window).require.config) {
            const src = `${baseUrl}/monaco/min/vs/loader.js`;

            const loaderRequest = new XMLHttpRequest();
            loaderRequest.addEventListener("load", () => {
                let scriptElem = document.createElement('script');
                scriptElem.type = 'text/javascript';
                scriptElem.text = [
                    // Monaco uses a custom amd loader that over-rides node's require.
                    // Keep a reference to node's require so we can restore it after executing the amd loader file.
                    'var nodeRequire = require;',
                    loaderRequest.responseText.replace('"use strict";', ''),
                    // Save Monaco's amd require and restore Node's require
                    'var monacoAmdRequire = require;',
                    'require = nodeRequire;',
                    'require.nodeRequire = require;'
                ].join('\n');
                document.body.appendChild(scriptElem);
                onGotAmdLoader((<{ monacoAmdRequire? }><unknown>window).monacoAmdRequire);
            });
            loaderRequest.open("GET", src);
            loaderRequest.send();
        } else {
          onGotAmdLoader();
        }
      });
    }
  }

  /**
   * Executes `initMonaco` to handle init monaco.
   * @zh 执行 `initMonaco`，用于初始化Monaco编辑器。
   * @param options - options parameter (`any`) / 配置选项参数（`any`）
   * @param insideNg - inside ng parameter (`boolean`) / 内部Angular参数（`boolean`）
   */
  protected abstract initMonaco(options, insideNg: boolean): void;

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._destroyed = true;
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }
}