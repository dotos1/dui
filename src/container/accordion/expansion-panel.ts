
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CanDisable, mixinDisabled } from '@angular/material/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  EventEmitter,
  Output,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder } from '@dotos/dui/core/form';

import { Accordion } from './accordion';
import { Container } from '../container.main';
/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/** Used to generate unique ID for each accordion item. */
let nextId = 0;

@Component({
  template: '',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class ExpansionPanelBase extends Container implements OnChanges,OnDestroy{
  @Input() config: any = {};

  public override xtype: string = 'expansion-panel';

  //@ts-ignore
  @ViewChild('panel', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  /**
   * label?: string
   * Sets label of [ExpansionPanelComponent] header.
   * Defaults to 'Click to expand'
   */
  @Input() label: string;

  /**
   * sublabel?: string
   * Sets sublabel of [ExpansionPanelComponent] header.
   */
  @Input() description: string;

  public buttons: Array<any>;

  constructor(
    public override detectRef: ChangeDetectorRef,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    protected _expansionDispatcher: UniqueSelectionDispatcher,
  ) {
    super(resolver, injector, detectRef);
    //  this.el = this._element.nativeElement;
  }

  public _accordion: Accordion;

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }
  override init(config: any) {

    super.init(config);
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    let items = this.items;
    if (items) {
      delete this.items;
      this.add(items);
    }
    this._accordion = this.ownerCt;
    this._removeUniqueSelectionListener =
      this._expansionDispatcher.listen((id: string, accordionId: string) => {
        if (this._accordion && !this._accordion.multi &&
          this._accordion.id === accordionId && this.id !== id) {
          this.expanded = false;
        }
      });
  }
  private _expand: boolean = false;

  public flex: number = 0;

  /** Event emitted every time the AccordionItem is closed. */
  @Output() closed = new EventEmitter<void>();
  /** Event emitted every time the AccordionItem is opened. */
  @Output() opened = new EventEmitter<void>();
  /** Event emitted when the AccordionItem is destroyed. */
  @Output() destroyed = new EventEmitter<void>();
  /** The unique AccordionItem id. */
  override readonly id = `cdk-accordion-child-${nextId++}`;

  /** Whether the AccordionItem is expanded. */
  @Input()
  get expanded(): any { return this._expanded; }
  set expanded(expanded: any) {
    expanded = coerceBooleanProperty(expanded);

    // Only emit events and update the internal value if the value changes.
    if (this._expanded !== expanded) {
      this._expanded = expanded;
      if (expanded) {
        this.opened.emit();
        if (this.ownerCt && this.ownerCt.items) {
          this.ownerCt.items.each( (item)=> {
            if (item.xtype == 'expansion-panel' && item != this) {
              item.expanded = false;
            }
          })
        }
        this.flex = 1;
        this.trigger('expand', this);
        /**
         * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
         * the name value is the id of the accordion.
         */
        const accordionId = this._accordion ? this._accordion.id : this.id;
        this._expansionDispatcher.notify(this.id, accordionId);
      } else {
        this.flex = 0;
        this.trigger('collapse', this);
        this.closed.emit();
      }

      // Ensures that the animation will run when the value is set outside of an `@Input`.
      // This includes cases like the open, close and toggle methods.
      this.detectRef.markForCheck();
    }
  }
  private _expanded: boolean;

  /** Unregister function for _expansionDispatcher. */
  private _removeUniqueSelectionListener: () => void = () => { };

  /** Emits an event for the accordion item being destroyed. */
  override ngOnDestroy() {
    this.destroyed.emit();
    this._removeUniqueSelectionListener();
  }

  /** Toggles the expanded state of the accordion item. */
  toggle(): void {
    this.expanded = !this.expanded;
  }

  /** Sets the expanded state of the accordion item to false. */
  close(): void {
    this.expanded = false;
  }

  /** Sets the expanded state of the accordion item to true. */
  open(): void {
    this.expanded = true;
  }
}
export const _ExpansionPanelMixinBase = mixinDisabled(ExpansionPanelBase);

/** ExpansionPanel's states. */
export type ExpansionPanelState = 'expanded' | 'collapsed';

/**
 * <expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MdAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
@Component({
  styleUrls: ['./expansion-panel.scss'],
  selector: 'expansion-panel',
  exportAs: 'matExpansionPanel',
  templateUrl: './expansion-panel.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled', 'expanded'],
  outputs: ['opened', 'closed'],
  host: {
    'class': 'expansion-panel',
    '[class.dui-expanded]': 'expanded',
    '[style.flex]': "flex",
    '[class.expansion-panel-spacing]': '_hasSpacing()',
    'hostID': crypto.randomUUID().toString()
  },
  providers: [
    { provide: _ExpansionPanelMixinBase, useExisting: forwardRef(() => ExpansionPanel) }
  ],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
  ]
})
export class ExpansionPanel extends _ExpansionPanelMixinBase
  implements CanDisable, OnChanges, OnDestroy {

  /** Whether the toggle indicator should be hidden. */
  @Input()
  get hideToggle(): boolean {
    return this._hideToggle;
  }
  set hideToggle(value: boolean) {
    this._hideToggle = coerceBooleanProperty(value);
  }
  private _hideToggle = false;

  /** Stream that emits for changes in `@Input` properties. */
  _inputChanges = new Subject<SimpleChanges>();

  constructor(
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    _changeDetectorRef: ChangeDetectorRef,
    _uniqueSelectionDispatcher: UniqueSelectionDispatcher,
    public formBuilder?: FormBuilder, ) {
    super(_changeDetectorRef, resolver, injector, _uniqueSelectionDispatcher);
  }

  /** Whether the expansion indicator should be hidden. */
  _getHideToggle(): boolean {
    if (this._accordion) {
      return this._accordion.hideToggle;
    }
    return this.hideToggle;
  }

  /** Determines whether the expansion panel should have spacing between it and its siblings. */
  _hasSpacing(): boolean {
    if (this._accordion) {
      return (this.expanded ? this._accordion.displayMode : this._getExpandedState()) === 'default';
    }
    return false;
  }

  /** Gets the expanded state string. */
  _getExpandedState(): ExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  override ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._inputChanges.complete();
  }
}

@Directive({
  selector: 'dui-action-row',
  host: {
    class: 'dui-action-row'
  }
})
export class ExpansionPanelActionRow { }
