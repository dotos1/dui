import { Component,  ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from '@dotos/dui/common/toastr';
import { EditorComponent } from '@dotos/dui/ux/monaco-editor';

@Component({
  selector: 'json-editor',
  template: `
  <card #codeContainer [config]="cardConfig">
    <monaco-editor class="monaco-editor"
      [options]="editorOptions"
      [(ngModel)]="codeValue"  fxFlexFill  fxFlex style="overflow:hidden" >
    </monaco-editor>
  </card>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'flex:1;display:flex;flex-direction:column;height: 100%;',
    'hostID': crypto.randomUUID().toString()
  },
  styles: [`
          :host ::ng-deep   .monaco-editor {
          width:100%;
        }
        :host ::ng-deep      .codeContainer .mat-mdc-card-content{
          padding: 2px;
        }
        :host ::ng-deep  .monaco-editor{
        outline-width: 0px !important;
      }
      :host ::ng-deep .mat-mdc-card-title{
        padding-bottom: 10px !important;
        padding-top: 10px !important;
      }
      :host ::ng-deep  .mdc-card__actions{
        min-height:56px;
      }
  `]
})
export class JsonEditor {

  @ViewChild(EditorComponent)
  monacoEditor: EditorComponent;

  codeValue: string = '';

  parent: any;

  editorOptions = {
    language: "json",
    autoIndent: 'full',
    smoothScrolling: true,
    minimap: {
      enabled: false
    },
    scrollbar: {
      horizontal: 'visible',
      horizontalHasArrows: true,
      vertical: 'visible',
      verticalHasArrows: true
    }
  };
  private buttons: Array<any> = [
    {
      xtype: "dui-button",
      type: 'mat-button',
      color: 'accent',
      name: 'confirm',
      text: 'UX.OK',
      disable: false,
      handler: () => {
        this.save();
      }
    },
    {
      xtype: "dui-button",
      type: 'mat-button',
      name: 'cancel',
      text: 'UX.CANCEL',
      handler: () => {
        this.dialogRef.close()
      }
    },
  ];

  cardConfig = {
    xtype: 'card',
    title: 'UX.JSONCODE',
    fxLayout: 'row',
    buttons: this.buttons
  }
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<JsonEditor>,
    @Inject('apiBase') private _apiBase: string) {
    this.codeValue = JSON.stringify(data.codeValue, undefined, 4);
    this.parent = data.parent;
  }

  save() {
    let json = JSON.parse(this.codeValue);
    this.parent.save(json);
    this.dialogRef.close();
  }
};
