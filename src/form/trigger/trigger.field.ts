import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  DialogService,
  IDraggableRefs,
  ResizableDraggableDialog,
} from '@dotos/dui/common/dialogs';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import { isObjectLike } from 'lodash-es';
import { isObject } from 'lodash-es';
import { AbstractTrigger } from './abstract.trigger';
import { DragRef } from '@angular/cdk/drag-drop';

@Component({
  selector: 'trigger-field',
  templateUrl: 'trigger.field.html',
  styleUrls: ['trigger.scss'],
  host: {
    role: 'trigger',
    '[class.trigger-field-disabled]': 'disabled',
    '[class.trigger-field-opened]': 'opened',
    '[attr.aria-label]': 'label',
    '[attr.aria-required]': 'required?required.toString():false',
    '[attr.aria-disabled]': 'disabled?disabled.toString():false',
    hostID: 'trigger-field' + Math.random().toString(36).substring(2, 15),
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriggerField extends AbstractTrigger implements AfterViewInit {
  @ViewChild(MatInput, { static: true }) _mapInput: MatInput;
  @ViewChild('input') input: ElementRef;

  private content: ComponentType<any>;

  _onChange: (value: any) => void = () => {};

  _onTouched = () => {};

  label: string;

  get openOnFocus(): boolean {
    return this._openOnFocus;
  }
  set openOnFocus(value: boolean) {
    this._openOnFocus = coerceBooleanProperty(value);
  }
  private _openOnFocus: boolean;

  override set isOpen(value: boolean) {
    if (value && !this.opened) {
      this.open();
    }
  }

  public override enableKeyEvents = true;

  protected maskRe;

  constructor(
    protected override _elementRef: ElementRef,
    protected override _dialogService: DialogService,
    protected override _overlay: Overlay,
    protected override _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    public detectRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected override translate: TranslateService,
    public renderer2: Renderer2,

    @Optional() protected override _dir: Directionality,
    @Optional() @Inject(DOCUMENT) protected override _document: any,
  ) {
    super(
      _elementRef,
      _dialogService,
      _overlay,
      _ngZone,
      translate,
      _dir,
      _document,
    );
  }

  override init(): void {
    super.init();
    if (this.field.icon && this.field.icon.indexOf('svg') != -1) {
      let icon: string = this.field.icon;
      const slashIdx = Math.max(icon.lastIndexOf('/'), icon.lastIndexOf('\\'));
      let iconName = icon.substring(
        slashIdx + 1,
        icon.lastIndexOf('.'),
      );
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon),
      );
      this.field.icon = iconName;
    }
    Dui.applyIf(this, this.field);
    this.field['classFormField'] = 'trigger-form-field';
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    let val = this.field.formControl.value;
    if (isObjectLike(val) && val.text) {
      this._elementRef.nativeElement.children[0].value = val.text;
    }
  }

  private coerceStringProperty(value: any): string {
    const d: string = value ? value + '' : null;
    return d;
  }

  override _selectAndClose(val: string): void {
    const oldValue = this._selected;
    if (isObject(val)) {
      this.field.inputValue = val['text'];
      this._selected = this.coerceStringProperty(val['value']);
    } else {
      this.field.inputValue = this.coerceStringProperty(val);
      this._selected = this.coerceStringProperty(val);
    }
    this.value = val;
    if (oldValue != this._selected) {
      this._emitChangeEvent();
      if (this.field.change && typeof this.field.change == 'function') {
        this.field.change(this, val);
      }
    }
    this._mapInput.focus();
    this._mapInput.ngDoCheck();
    this.close();
  }

  override open(): void {
    if (this.opened || this.disabled || this.field.disabled) {
      return;
    }
    super.beforeOpen();
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }
    if (this.touchUi) {
      const { matDialogRef, dragRefSubject }: IDraggableRefs<any> =
        this._dialogService.openDraggable({
          component: this.content,
          dragHandleSelectors: ['.mat-title', '.card-title-content'],
          config: {
            direction: this._dir ? this._dir.value : 'ltr',
            viewContainerRef: this._viewContainerRef,
            hasBackdrop: false,
            panelClass: 'mat-datetimepicker-dialog',
          },
        });
      this._dialogRef = matDialogRef;

      let resizableDraggableDialog: ResizableDraggableDialog;
      if(this.field.resizable==true) {
        dragRefSubject.subscribe((dragRf: DragRef) => {
          resizableDraggableDialog = new ResizableDraggableDialog(
            this._document,
            this.renderer2,
            matDialogRef,
            dragRf,
          );
        });
      }
      matDialogRef.afterClosed().subscribe(async () => {
        dragRefSubject.complete();
        dragRefSubject.unsubscribe();
        if(this.field.resizable==true) {  
            resizableDraggableDialog.detach();
        }
      });
    } else {
      if (!this._portal && this.content) {
        this._portal = new ComponentPortal(
          this.content,
          this._viewContainerRef,
        );
      }
    }
    super.postOpen(this.field.params);
  }
}
