
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Host,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { merge } from 'rxjs';
import { Subscription } from 'rxjs';
import { EXPANSION_PANEL_ANIMATION_TIMING, ExpansionPanel } from './expansion-panel';

@Component({
  selector: 'expansion-panel-header',
  styleUrls: ['./expansion-panel-header.scss'],
  templateUrl: './expansion-panel-header.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    
    'class': 'expansion-panel-header',
    'role': 'button',
    '[attr.tabindex]': 'panel.disabled ? -1 : 0',
    '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'panel.disabled',
    '[class.dui-expanded]': '_isExpanded()',
    '(click)': '_toggle()',
    '(keyup)': '_keyup($event)',
    '[@expansionHeight]': `{
        value: _getExpandedState(),
        params: {
          collapsedHeight: collapsedHeight,
          expandedHeight: expandedHeight
        }
    }`,
    
  },
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    trigger('expansionHeight', [
      state('collapsed', style({
        height: '{{collapsedHeight}}',
      }), {
        params: { collapsedHeight: '48px' },
      }),
      state('expanded', style({
        height: '{{expandedHeight}}'
      }), {
        params: { expandedHeight: '48px' }
      }),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
  ],
})
export class ExpansionPanelHeader implements OnDestroy {
  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(
    @Host() public panel: ExpansionPanel,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef) {

    // Since the toggle state depends on an @Input on the panel, we
    // need to  subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      panel._inputChanges.pipe(filter((changes:any) => !!(changes.hideToggle || changes.disabled)))
    )
      .subscribe(() => this._changeDetectorRef.markForCheck());

    _focusMonitor.monitor(_element.nativeElement, false);
  }

  /** Height of the header while the panel is expanded. */
  @Input() expandedHeight: string;

  /** Height of the header while the panel is collapsed. */
  @Input() collapsedHeight: string;

  /** Toggles the expanded state of the panel. */
  _toggle(): void {
    if (!this.panel.disabled) {
      this.panel.toggle();
    }
  }

  /** Gets whether the panel is expanded. */
  _isExpanded(): boolean {
    return this.panel.expanded;
  }

  /** Gets the expanded state string of the panel. */
  _getExpandedState(): string {
    return this.panel._getExpandedState();
  }

  /** Gets the panel id. */
  _getPanelId(): string {
    return this.panel.id;
  }

  /** Gets whether the expand indicator should be shown. */
  _showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /** Handle keyup event calling to toggle() if appropriate. */
  _keyup(event: KeyboardEvent) {
    switch (event.keyCode) {
      case SPACE:
      case ENTER:
        event.preventDefault();
        this._toggle();
        break;
      default:
        return;
    }
  }

  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element.nativeElement);
  }
}

/**
 * <panel-description> directive.
 *
 * This direction is to be used inside of the ExpansionPanelHeader component.
 */
@Directive({
  selector: 'panel-description',
  host: {
    class: 'expansion-panel-header-description'
  }
})
export class ExpansionPanelDescription { }

/**
 * <panel-title> directive.
 *
 * This direction is to be used inside of the ExpansionPanelHeader component.
 */
@Directive({
  selector: 'panel-title',
  host: {
    class: 'expansion-panel-header-title'
  }
})
export class ExpansionPanelTitle { }
