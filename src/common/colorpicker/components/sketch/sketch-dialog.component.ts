
import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SketchComponent} from './sketch.component'
@Component({
  selector: 'color-sketch-dialog',
  template: `
    <color-sketch></color-sketch>
    <button mat-button #closeBtn (click)="cancel()">{{cancelButton}}</button>
    <button mat-button color="accent" #acceptBtn  (click)="accept()">{{acceptButton}}</button>
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
  /** Pixel value for picker width */
  @Input() width: string | number = 316;
  /** Pixel value for picker height */
  @Input() height: string | number = 16;
  cancelButton: string = 'CANCEL';
  acceptButton: string = 'ACCEPT';

  constructor(public _dialogRef: MatDialogRef<SketchDialogComponent>) { }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePickerChange({ data, $event }) {
  }
  cancel(): void {
    this._dialogRef.close(false);
  }

  accept(): void {
    this._dialogRef.close(this.sc.hex);
  }
}
