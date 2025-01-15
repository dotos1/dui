import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { ThemeService } from '@dotos/dui/theme';

@Component({
  selector: 'dui-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class PromptDialogComponent implements AfterViewInit, OnDestroy {
  title?: string;
  message?: string;
  name: string;

  cancelButton = 'CANCEL';
  acceptButton = 'ACCEPT';

  /** The native `<input matInput />` element. */
  @ViewChild('input', { static: true }) _input!: ElementRef<HTMLInputElement>;

  @ViewChild('closeBtn', { static: true, read: ElementRef })
  _closeBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('acceptBtn', { static: true, read: ElementRef })
  _acceptBtn!: ElementRef<HTMLButtonElement>;

  private _destroy$ = new Subject<void>();

  @ViewChild(MatInput) formFieldControl: MatInput;


  minLengthText: string = 'The minimum length for this field is {0}';

  maxLengthText: string = 'The maximum length for this field is {0}';

  pattern: string | RegExp = null;

  regexText: string = ' format is not correct';

  blankText: string = ' This field is can not be blank!';

  minlength: number = 0;

  maxlength: number = 255;

  min: number = -Infinity;

  max: number = Infinity;

  required: boolean = true;

  dataType: string = 'text';

  formControl = new FormControl();

  constructor(
    private _ngZone: NgZone,
    public themeService: ThemeService,
    private _dialogRef: MatDialogRef<PromptDialogComponent>
  ) {}

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this._input.nativeElement.focus());
      fromEvent(this._input.nativeElement, 'focus')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._input.nativeElement.select();
        });

      fromEvent<KeyboardEvent>(this._closeBtn.nativeElement, 'keydown')
        .pipe(takeUntil(this._destroy$))
        .subscribe((event) => {
          if (event.keyCode === RIGHT_ARROW) {
            this._acceptBtn.nativeElement.focus();
          }
        });

      fromEvent<KeyboardEvent>(this._acceptBtn.nativeElement, 'keydown')
        .pipe(takeUntil(this._destroy$))
        .subscribe((event) => {
          if (event.keyCode === LEFT_ARROW) {
            this._closeBtn.nativeElement.focus();
          }
        });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

  cancel(): void {
    this._dialogRef.close();
  }

  accept(): void {
    this._dialogRef.close(this.formControl.value);
  }
}
