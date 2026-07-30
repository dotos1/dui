import { Directionality } from "@angular/cdk/bidi";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from "@angular/common";
import {
    ComponentRef,
    DoCheck,
    ElementRef,
    EventEmitter, Inject,
    Injectable,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional, Output,

} from '@angular/core';
import {  MatDialogRef } from "@angular/material/dialog";
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { TranslateService } from '@dotos/dui/translator';
import {isObjectLike}  from 'lodash-es';
import { Subject } from "rxjs";
import { first, takeUntil } from "rxjs/operators";
import { MatField } from '../base/mat.field';
import { DialogService} from '@dotos/dui/common/dialogs';

/** Change event object emitted by Md2Select. */
export class ValueChange {
  constructor(public source: any, public value: any) { }
}

@Injectable()
export class AbstractTrigger extends MatField implements OnInit,OnDestroy,DoCheck  {


  get editable(): boolean { return this._editable; }
  set editable(value: boolean) { this._editable =  coerceBooleanProperty (value); }
  private _editable: boolean;

  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }

  set touchUi(value: boolean) {
    this._touchUi =  coerceBooleanProperty (value);
  }

  private _touchUi = false;

  public tabindex: number = 0;


  _validatorOnChange = () => { };

  protected _inputFocused: boolean = false;

  public enableKeyEvents = false;

  override get required(): boolean { return this._required; }
  override set required(value) { this._required =  coerceBooleanProperty (value); }
  private _required: boolean = false;


  @Output() selectedChanged = new EventEmitter<any>();

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  @Output("opened") openedStream: EventEmitter<AbstractTrigger> = new EventEmitter<AbstractTrigger>();

  // tslint:disable-next-line:no-output-rename
  @Output("closed") closedStream: EventEmitter<AbstractTrigger> = new EventEmitter<AbstractTrigger>();

  /** Whether the calendar is open. */
  opened = false;


  /** The currently selected date. */
  get _selected(): any | null {
    return this._validSelected;
  }

  set _selected(value: any | null) {
    this._validSelected = value;
  }
  private _validSelected: any | null = null;


  protected _value: any;

  set isOpen(value: boolean) {
    if (value && !this.opened) { this.open(); }
  }

  // @Output() change: EventEmitter<ValueChange> = new EventEmitter<ValueChange>();

  /** A reference to the overlay when the calendar is opened as a popup. */
  protected _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  protected _dialogRef: MatDialogRef<TriggerPopup> | null;

  protected _portal: ComponentPortal<TriggerPopup>;

  /** The element that was focused before the datepicker was opened. */
  protected _focusedElementBeforeOpen: HTMLElement | null = null;

  private readonly _onDestroy = new Subject<void>();

  constructor(
    protected _elementRef: ElementRef,
    protected  _dialogService: DialogService,
    protected _overlay: Overlay,
    protected _ngZone: NgZone,
    protected override translate: TranslateService,
    @Optional() protected _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected _document: any) {
    super(translate);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.field.formControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((val) => {
      if (isObjectLike(val) ) {
        if(val.text){
          this._elementRef.nativeElement.children[0].value = val.text;
        }else{
          this._elementRef.nativeElement.children[0].value ='';
        }
      }
      if(this.field.inputValue){
        this._elementRef.nativeElement.children[0].value = this.field.inputValue;
      }
    });
  }

  ngDoCheck() {
    if (this.field.doCheck) {
      this.field.doCheck(this);
    }
  }

  override init(config?): void {
    super.init(config);
    if(this.field.touchUi!=undefined){
      this.touchUi=this.field.touchUi;
    }
    if(this.field.panelClass!=undefined){
      // Was `==` (a no-op comparison) instead of `=` -- consumer-set panelClass never
      // reached the @Input at all, and was never read anywhere either (see
      // _createPopup() below), making it end-to-end dead configuration.
      this.panelClass=this.field.panelClass;
    }
    if (this.field.opened) {
      this.openedStream.pipe(takeUntil(this._onDestroy)).subscribe(this.field.opened);
    }
    if (this.field.closed) {
      this.closedStream.pipe(takeUntil(this._onDestroy)).subscribe(this.field.closed);
    }
  }

  public open() { }

  override ngOnDestroy() {
    this.close();
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this._popupRef) {
      this._popupRef.dispose();
    }
  }

  _select(val: any): void {
    const oldValue = this._selected;
    this._selected = val;
    if (oldValue != this._selected) {
      this.selectedChanged.emit(val);
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }


  _handleFocus() {
    this._inputFocused = true;
    if (!this.opened && !this.editable) {
      this.open();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _handleBlur(event: Event) {
    this._inputFocused = false;
    // if (!this.opened) {
    //   this._onTouched();
    // }
    // const el: any = event.target;
    //  this.value = el.value;
    this._emitChangeEvent();
  }

  close(): void {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._portal && this._portal.isAttached) {
      this._portal.detach();
    }
    const completeClose = () => {
      if (this.opened) {
        this.opened = false;
        this.closedStream.emit(this);
        this._focusedElementBeforeOpen = null;
      }
    };
    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === "function") {
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _selectAndClose(value: any): void {
    const oldValue = this._selected;
    if (oldValue !== this._selected) {
      this._emitChangeEvent();
    }
    this.close();
  }

  _emitChangeEvent(): void {
    this.selectedChanged.emit(new ValueChange(this, this.value));
    if (this.field.change) {
      this.field.change(this.field,this.value);
    }
  }

  protected beforeOpen(): void {
    if (this.opened) { return; }
    if (this.disabled) { return; }
  }

  protected postOpen(params?: any): void {
    if( this.field.touchUi){
      this._openAsDialog(params)
    }else{
      this._openAsPopup(params);
    }
    this.opened = true;
    this.openedStream.emit(this);
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(params?: any): void {
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.host = this;
    if (params) this._dialogRef.componentInstance.params = params;
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(params?: any): void {
    if (!this._popupRef) {
      this._createPopup();
    }
    if (!this._popupRef.hasAttached()) {
      const componentRef: ComponentRef<TriggerPopup> = this._popupRef.attach(this._portal);
      componentRef.instance.host = this;
      if (params) componentRef.instance.params = params;
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  private _createPopup(): void {
    const panelClass = ["mat-picker-popup"];
    if (this.panelClass) {
      Array.isArray(this.panelClass) ? panelClass.push(...this.panelClass) : panelClass.push(this.panelClass);
    }
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: "mat-overlay-transparent-backdrop",
      direction: this._dir ? this._dir.value : "ltr",
      panelClass
    });
    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.backdropClick()
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.close());
  }

  public _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this.getConnectedOverlayOrigin())
      .withTransformOriginOn(".mat-content-popup")
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom"
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top"
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom"
        }
      ]);
  }
  getConnectedOverlayOrigin(): ElementRef {
    return this._elementRef;
  }
}
