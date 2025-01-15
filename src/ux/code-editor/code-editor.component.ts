import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef, forwardRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

const noop: any = () => {
  // empty method
};

// counter for ids to allow for multiple editors on one page
let uniqueCounter: number = 0;
let loadedMonaco: boolean = false;
let loadPromise: Promise<void>;
declare const monaco: any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const require: any;

@Component({
  selector: 'td-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: [ './code-editor.component.scss' ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExtCodeEditorComponent),
    multi: true,
  }],
  
})
export class ExtCodeEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  private _editorStyle: string = 'width:100%;height:100%;border:1px solid grey;';
  private _value: string = '';
  private _theme: string = 'vs';
  private _language: string = 'javascript';
  private _subject: Subject<string> = new Subject();
  private _editorInnerContainer: string = 'editorInnerContainer' + uniqueCounter++;
  private _editor: any;
  private _componentInitialized: boolean = false;
  private _fromEditor: boolean = false;
  private _automaticLayout: boolean = false;
  private _editorOptions: any = {};

  @ViewChild('editorContainer') _editorContainer: ElementRef;

 /**
  * editorInitialized: function($event)
  * Event emitted when editor is first initialized
  */
  @Output('editorInitialized') onEditorInitialized: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorConfigurationChanged: function($event)
  * Event emitted when editor's configuration changes
  */
  @Output('editorConfigurationChanged') onEditorConfigurationChanged: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorLanguageChanged: function($event)
  * Event emitted when editor's Language changes
  */
  @Output('editorLanguageChanged') onEditorLanguageChanged: EventEmitter<void> = new EventEmitter<void>();

 /**
  * editorValueChange: function($event)
  * Event emitted any time something changes the editor value
  */
  @Output('editorValueChange') onEditorValueChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The change event notifies you about a change happening in an input field.
   * Since the component is not a native Angular component have to specifiy the event emitter ourself
   */
  @Output('change') onChange: EventEmitter<void> = new EventEmitter<void>();
  /* tslint:disable-next-line */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propagateChange = (_: any) => {};
  onTouched = () => noop;

  /**
   * Set if using Electron mode when object is created
   */
  constructor(private zone: NgZone) {
    // since accessing the window object need this check so serverside rendering doesn't fail
  }

  /**
   * value?: string
   * Value in the Editor after async getEditorContent was called
   */
  @Input('value')
  set value(value: string) {
    this._value = value;
    if (this._componentInitialized) {
        if (this._editor) {
            // don't want to keep sending content if event came from the editor, infinite loop
            if (!this._fromEditor) {
                this._editor.setValue(value);
            }
            this.onEditorValueChange.emit(undefined);
            this.propagateChange(this._value);
            this.onChange.emit(undefined);
            this._fromEditor = false;
            this.zone.run(() => this._value = value);
        }
    }
  }

  get value(): string {
      return this._value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * getEditorContent?: function
   * Returns the content within the editor
   */
  getValue(): Observable<string> {
      if (this._componentInitialized) {
            this._value = this._editor.getValue();
            setTimeout(() => {
                this._subject.next(this._value);
                this._subject.complete();
                this._subject = new Subject();
                this.onEditorValueChange.emit(undefined);
            });
            return this._subject.asObservable();
      }else{
        return undefined;
      }
  }

  /**
   * language?: string
   * language used in editor
   */
  @Input('language')
  set language(language: string) {
    this._language = language;
    if (this._componentInitialized) {
            let currentValue: string = this._editor.getValue();
            this._editor.dispose();
            let myDiv: HTMLDivElement = this._editorContainer.nativeElement;
            this._editor = monaco.editor.create(myDiv, Object.assign({
                value: currentValue,
                language: language,
                theme: this._theme,
            }, this.editorOptions));
            this._editor.getModel().onDidChangeContent( () => {
                this._fromEditor = true;
                this.writeValue(this._editor.getValue());
            });
            this.onEditorConfigurationChanged.emit(undefined);
            this.onEditorLanguageChanged.emit(undefined);
    }
  }
  get language(): string {
    return this._language;
  }


  registerLanguage(language: any): void {
    if (this._componentInitialized) {
        // let currentValue: string = this._editor.getValue();
        this._editor.dispose();

        for (let i: number = 0; i < language.completionItemProvider.length; i++) {
            let provider: any = language.completionItemProvider[i];

            provider.kind = (0, eval)(provider.kind);
        }
        for (let i: number = 0; i < language.monarchTokensProvider.length; i++) {
            let monarchTokens: any = language.monarchTokensProvider[i];


            monarchTokens[0] = (0, eval)(monarchTokens[0]);
        }
        monaco.languages.register({ id: language.id });

        monaco.languages.setMonarchTokensProvider(language.id, {
            tokenizer: {
                root: language.monarchTokensProvider,
            },
        });

        // Define a new theme that constains only rules that match this language
        monaco.editor.defineTheme(language.customTheme.id, language.customTheme.theme);
        this._theme = language.customTheme.id;

        monaco.languages.registerCompletionItemProvider(language.id, {
            provideCompletionItems: () => {
                return language.completionItemProvider;
            },
        });

        let css: HTMLStyleElement = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = language.monarchTokensProviderCSS;
        document.body.appendChild(css);
        this.onEditorConfigurationChanged.emit(undefined);
    }
  }

  /**
   * style?: string
   * css style of the editor on the page
   */
  @Input('editorStyle')
  set editorStyle(editorStyle: string) {
    this._editorStyle = editorStyle;
    if (this._componentInitialized) {
        let containerDiv: HTMLDivElement = this._editorContainer.nativeElement;
        containerDiv.setAttribute('style', editorStyle);
        let currentValue: string = this._editor.getValue();
        this._editor.dispose();
        let myDiv: HTMLDivElement = this._editorContainer.nativeElement;
        this._editor = monaco.editor.create(myDiv, Object.assign({
            value: currentValue,
            language: this._language,
            theme: this._theme,
        }, this.editorOptions));
        this._editor.getModel().onDidChangeContent( () => {
            this._fromEditor = true;
            this.writeValue(this._editor.getValue());
        });
    }
  }
  get editorStyle(): string {
    return this._editorStyle;
  }


  @Input('theme')
  set theme(theme: string) {
    this._theme = theme;
    if (this._componentInitialized) {
        this._editor.updateOptions({'theme': theme});
        this.onEditorConfigurationChanged.emit(undefined);
    }
  }
  get theme(): string {
    return this._theme;
  }

  @Input('automaticLayout')
  set automaticLayout(automaticLayout: any) {
    this._automaticLayout = automaticLayout !== '' ? (automaticLayout === 'true' || automaticLayout === true) : true;
  }
  get automaticLayout(): any {
    return this._automaticLayout;
  }

  /**
   * editorOptions?: Object
   * Options used on editor instantiation. Available options listed here:
   * https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
   */
  @Input('editorOptions')
  set editorOptions(editorOptions: any) {
      this._editorOptions = editorOptions;
      if (this._componentInitialized) {
          this._editor.updateOptions(editorOptions);
          this.onEditorConfigurationChanged.emit(undefined);
      }
  }
  get editorOptions(): any {
    return this._editorOptions;
  }

  /**
   * layout method that calls layout method of editor and instructs the editor to remeasure its container
   */
   layout(): void {
    if (this._componentInitialized) {
        this._editor.layout();
    }
  }
  /**
   * ngOnInit only used for Electron version of editor
   * This is where the webview is created to sandbox away the editor
   */
  ngOnInit(): void {
    this._componentInitialized = true;
  }

  /**
   * ngAfterViewInit only used for browser version of editor
   * This is where the AMD Loader scripts are added to the browser and the editor scripts are "required"
   */
  ngAfterViewInit(): void {
    if (loadedMonaco) {
        // Wait until monaco editor is available
        this.waitForMonaco().then(() => {
            this.initMonaco();
        });
    } else {
        loadedMonaco = true;
        loadPromise = new Promise<void>((resolve: any) => {
            if (typeof((<any>window).monaco) === 'object') {
                resolve();
                return;
            }
            let onGotAmdLoader: any = () => {
                // Load monaco
                (<any>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
                (<any>window).require(['vs/editor/editor.main'], () => {
                    this.initMonaco();
                    resolve();
                });
            };

            // Load AMD loader if necessary
            if (!(<any>window).require) {
                let loaderScript: HTMLScriptElement = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = 'assets/monaco/vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }
  }

  /**
   * waitForMonaco method Returns promise that will be fulfilled when monaco is available
   */
  waitForMonaco(): Promise<void> {
    return loadPromise;
  }

  /**
   * initMonaco method creates the monaco editor into the @ViewChild('editorContainer')
   * and emit the onEditorInitialized event.  This is only used in the browser version.
   */
  private initMonaco(): void {
    let containerDiv: HTMLDivElement = this._editorContainer.nativeElement;
    containerDiv.id = this._editorInnerContainer;
    this._editor = monaco.editor.create(containerDiv, Object.assign({
        value: this._value,
        language: this.language,
        theme: this._theme,
        automaticLayout: this._automaticLayout,
    }, this.editorOptions));
    setTimeout(() => {
        this.onEditorInitialized.emit(undefined);
    });
    this._editor.getModel().onDidChangeContent( () => {
        this._fromEditor = true;
        this.writeValue(this._editor.getValue());
    });

    window.addEventListener('resize', () => {
        this._editor.layout();
    });
  }
}
