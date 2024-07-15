import { Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Inject, Injector, ComponentFactoryResolver } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'flex:1;display:flex;flex-direction:column;height: 100%;'
  },
  styles: [`
  .monaco-editor {
    width:100%;
  }
  .codeContainer .mat-mdc-card-content{
    padding: 2px;
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
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
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
