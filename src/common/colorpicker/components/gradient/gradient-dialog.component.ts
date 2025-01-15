
import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {GradientComponent} from './gradient.component'

@Component({
  selector: 'color-gradient-dialog',
  template: `
    <color-gradient></color-gradient>
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
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class GradientDialogComponent  {
  @ViewChild(GradientComponent) sc:GradientComponent;
  @Input() width: string | number = 316;
  @Input() height: string | number = 16;
  cancelButton: string = 'CANCEL';
  acceptButton: string = 'ACCEPT';

  constructor(public _dialogRef: MatDialogRef<GradientDialogComponent>) { }

  handlePickerChange({ data, $event }) {
  }
  cancel(): void {
    this._dialogRef.close(false);
  }

  accept(): void {
    this._dialogRef.close(this.sc['hex']);
  }
}
