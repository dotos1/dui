
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    AfterContentInit, ChangeDetectorRef, ContentChildren, Directive,
    EventEmitter, Input, Output, QueryList,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslateService } from '@dotos/dui/translator';
import * as _ from 'lodash-es';
import { MatField } from '../base/mat.field';



let nextUniqueId = 0;


export const MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatCheckGroup),
  multi: true
};

/** Change event object emitted by MatRadio and MatRadioGroup. */
export class MatCheckChange {
  /** The MatRadioButton that emits the change event. */
  source: Array<MatCheckbox> | null;
  /** The value of the MatRadioButton. */
  value: any;
}

// Boilerplate for applying mixins to MatRadioGroup.
/** @docs-private */
export class MatCheckGroupBase { }
export const _MatCheckGroupMixinBase = mixinDisabled(MatCheckGroupBase);

/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
@Directive({
  selector: 'mat-check-group',
  providers: [MAT_CHECK_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'checkgroup',
    'class': 'mat-check-group',
  },
  inputs: ['disabled'],
})
export class MatCheckGroup extends MatField implements AfterContentInit, ControlValueAccessor, CanDisable {
  /**
   * Selected value for group. Should equal the value of the selected radio button if there *is*
   * a corresponding radio button with a matching value. If there is *not* such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.
   */
  private _value: Array<string> = null;

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name: string = `mat-check-group-${nextUniqueId++}`;

  /** The currently selected radio button. Should match value. */
  private _selected: Array<MatCheckbox> | null = null;

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized: boolean = false;

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  private _labelPosition: 'before' | 'after' = 'after';

  /** Whether the radio group is disabled. */
  private _disabled: boolean = false;

  /** Whether the radio group is required. */
  private _required: boolean = false;

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => { };

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  onTouched: () => any = () => { };

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  @Output() change: EventEmitter<MatCheckChange> = new EventEmitter<MatCheckChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => MatCheckbox)) _checks: QueryList<MatCheckbox>;

  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  override get name(): string { return this._name; }
  override set name(value: string) {
    this._name = value;
    this._updateCheckNames();
  }

  /**
   * Alignment of the radio-buttons relative to their labels. Can be 'before' or 'after'.
   * @deprecated
   */
  @Input()
  get align(): 'start' | 'end' {
    return this.labelPosition === 'after' ? 'start' : 'end';
  }
  set align(v) {
    this.labelPosition = (v === 'start') ? 'after' : 'before';
  }


  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  @Input()
  get labelPosition() {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = (v === 'before') ? 'before' : 'after';
    this._markChecksForCheck();
  }

  /** Value of the radio button. */
  @Input()
  override get value(): Array<string> { return this._value; }
  override set value(newValue: Array<string>) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateSelectedCheckFromValue();
      this._checkSelectedCheck();
    }
  }

  /** Whether the radio group is disabled */
  @Input()
  override get disabled(): boolean { return this._disabled; }
  override set disabled(value) {
    this._disabled =  coerceBooleanProperty (value);
    this._markChecksForCheck();
  }

  /** Whether the radio group is required */
  @Input()
  override get required(): boolean { return this._required; }
  override set required(value: boolean) {
    this._required =  coerceBooleanProperty (value);
    this._markChecksForCheck();
  }

  /** Whether the radio button is selected. */
  @Input()
  get selected() { return this._selected; }
  set selected(selected: Array<MatCheckbox> | null) {
    this._selected = selected;
    if (selected) {
      this.value = [];
      this.selected.forEach(check => {
        this.value.push(check.value);
      });
    } else {
      this.value = null;
    }
    this._checkSelectedCheck();
  }

  constructor(protected override translate: TranslateService,
    private _changeDetector: ChangeDetectorRef) {
    super(translate);
  }
  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.
   */
  ngAfterContentInit() {
    this._isInitialized = true;
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedCheckFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected = this._selected != null && null == this._value;
    if (this._checks != null && !isAlreadySelected) {
      this._selected = [];
      this._checks.forEach(check => {
        check.checked = _.indexOf(this.value, check.value) > 0;
        if (check.checked) {
          this._selected.push(check);
        }
      });
    }
  }

  _checkSelectedCheck() {
    if (this._selected) {
      this.selected.forEach(check => {
        if (!check.checked) {
          check.checked = true;
        }
      });
    }
  }

  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      const event = new MatCheckChange();
      event.source = this._selected;
      event.value = this._value;
      this.change.emit(event);
    }
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _updateCheckNames(): void {
    if (this._checks) {
      this._checks.forEach(check => {
        check.name = this.name;
      });
    }
  }

  _markChecksForCheck() {
    if (this._checks) {
      this._checks.forEach(check => check._onLabelTextChange());
    }
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * param value
   */
  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}

export type Constructor<T> = new (...args: any[]) => T;

/** @docs-private */
export interface CanDisable {
  disabled: boolean;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled: boolean = false;

    get disabled() { return this._disabled; }
    set disabled(value: any) { this._disabled =  coerceBooleanProperty (value); }

    constructor(...args: any[]) { super(...args); }
  };
}
