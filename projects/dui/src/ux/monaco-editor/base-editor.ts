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
import { TranslateService } from '@dotos/dui/i18n';
let loadedMonaco = false;
let loadPromise: Promise<void>;
export const defaultLanguage = 'en-us';
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
@Component({
  template: ''
})
export abstract class BaseEditor implements OnInit,AfterViewInit, OnDestroy {

  @Input('insideNg')
  set insideNg(insideNg: boolean) {
    this._insideNg = insideNg;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this._options, this.insideNg);
    }
  }

  get insideNg(): boolean {
    return this._insideNg;
  }

  @ViewChild('editorContainer', { static: true }) _editorContainer: ElementRef;
  @Output() onInit = new EventEmitter<any>();
  protected _editor: any;
  protected _options: any;
  protected _windowResizeSubscription: Subscription;
  private _insideNg: boolean = false;

  constructor(
    public translate: TranslateService,
    @Inject(MONACO_EDITOR_CONFIG) protected config: MonacoEditorConfig) {}


  ngOnInit() {
    let lang = this.translate.currentLang.replace('_', '-').toLowerCase();
    let uiLanguage = cultureDists[lang] || defaultLanguage;
  }
  ngAfterViewInit(): void {
    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadPromise.then(() => {
        this.initMonaco(this._options, this.insideNg);
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve: any) => {
        const baseUrl = this.config.baseUrl || "./assets";
        if (typeof ((<any>window).monaco) === 'object') {
          this.initMonaco(this._options, this.insideNg);
          resolve();
          return;
        }
        const onGotAmdLoader: any = (require?: any) => {
          let usedRequire = require || (<any>window).require;
          let requireConfig = { paths: { vs: `${baseUrl}/monaco/min/vs` } };
          Object.assign(requireConfig, this.config.requireConfig || {});

          // Load monaco
          usedRequire.config(requireConfig);
          usedRequire([`vs/editor/editor.main`], () => {
            if (typeof this.config.onMonacoLoad === 'function') {
              this.config.onMonacoLoad();
            }
            this.initMonaco(this._options, this.insideNg);
            resolve();
          });
        };

        if (this.config.monacoRequire) {
          onGotAmdLoader(this.config.monacoRequire);
        // Load AMD loader if necessary
        } else if (!(<any>window).require) {
          const loaderScript: HTMLScriptElement = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = `${baseUrl}/monaco/min/vs/loader.js`;
          loaderScript.addEventListener('load', () => { onGotAmdLoader(); });
          document.body.appendChild(loaderScript);
        // Load AMD loader without over-riding node's require
        } else if (!(<any>window).require.config) {
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
                onGotAmdLoader((<any>window).monacoAmdRequire);
            });
            loaderRequest.open("GET", src);
            loaderRequest.send();
        } else {
          onGotAmdLoader();
        }
      });
    }
  }

  protected abstract initMonaco(options: any, insideNg: boolean): void;

  ngOnDestroy() {
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }
}