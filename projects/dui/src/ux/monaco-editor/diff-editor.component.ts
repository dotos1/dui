import { ChangeDetectionStrategy, Component, Inject, Input, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs';
import { BaseEditor } from './base-editor';
import { DiffEditorModel } from './types';
import { TranslateService } from '@dotos/dui/i18n';
import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';

declare const monaco: any;
   
@Component({
  standalone: true,
  selector: 'monaco-diff-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 98%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiffEditorComponent extends BaseEditor {


  _originalModel: DiffEditorModel;
  _modifiedModel: DiffEditorModel;

  @Input('options')
  set options(options: any) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(options, this.insideNg);
    }
  }

  get options(): any {
    return this._options;
  }

  @Input('originalModel')
  set originalModel(model: DiffEditorModel) {
    this._originalModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }

  @Input('modifiedModel')
  set modifiedModel(model: DiffEditorModel) {
    this._modifiedModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options, this.insideNg);
    }
  }


  constructor(private zone: NgZone, 
    public override translate: TranslateService,
    @Inject(MONACO_EDITOR_CONFIG) private editorConfig: MonacoEditorConfig) {
    super(translate,editorConfig);
  }


  protected initMonaco(options: any, insideNg: boolean): void {

    if (!this._originalModel || !this._modifiedModel) {
      throw new Error('originalModel or modifiedModel not found for ngx-monaco-diff-editor');
    }

    this._originalModel.language = this._originalModel.language || options.language;
    this._modifiedModel.language = this._modifiedModel.language || options.language;

    let originalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
    let modifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);

    this._editorContainer.nativeElement.innerHTML = '';
    const theme = options.theme;

    if (insideNg) {
      this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        this._editor = monaco.editor.createDiffEditor(this._editorContainer.nativeElement, options);
      })
    }

    options.theme = theme;
    this._editor.setModel({
      original: originalModel,
      modified: modifiedModel
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
    this.onInit.emit(this._editor);
  }

}