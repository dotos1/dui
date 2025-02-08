
import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SketchComponent} from './sketch.component'
@Component({
  selector: 'color-sketch-dialog',
  template: `
     <mat-dialog-content>
      <color-sketch></color-sketch>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button #closeBtn (click)="cancel()">{{cancelButton|translate}}</button>
      <button mat-button color="accent" #acceptBtn  (click)="accept()">{{acceptButton|translate}}</button>
    </mat-dialog-actions>
  `,
  styles: [ 
    `
    .shade-slider {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  
})
export class SketchDialogComponent  {
  @ViewChild(SketchComponent) sc: SketchComponent;


  cancelButton: string = 'COMMON.CANCEL';
  acceptButton: string = 'COMMON.OK';

  constructor(public _dialogRef: MatDialogRef<SketchDialogComponent>) { }

  handlePickerChange({ data, $event }) {
  }
  cancel(): void {
    this._dialogRef.close(false);
  }

  accept(): void {
    this._dialogRef.close(this.sc.hex);
  }
}
