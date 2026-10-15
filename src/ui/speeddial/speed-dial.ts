import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { Subscription, forkJoin, fromEvent, race, timer } from 'rxjs';
import { take } from 'rxjs/operators';

const Z_INDEX_ITEM = 23;

import { DOCUMENT } from '@angular/common';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type AnimationMode = 'fling' | 'scale';


@Component({
  selector: 'speed-dial-actions',
  template: `
        <ng-content select="[mat-mini-fab]" *ngIf="miniFabVisible"></ng-content>`,
        host: {hostID: 'speed-dial-actions' + Math.random().toString(36).substring(2, 15)},
})
export class SpeedDialActionsComponent implements AfterContentInit {

  private _parent: SpeedDialComponent;

  @ContentChildren(MatMiniFabButton) _buttons: QueryList<MatMiniFabButton>;


  /**
   * Whether the min-fab button exist in DOM
   */
  public miniFabVisible = false;

  /**
   * The timeout ID for the callback to show the mini-fab buttons
   */
  private showMiniFabAnimation: ReturnType<typeof setTimeout>;


  private hideMiniFab: Subscription | null;

  constructor(injector: Injector, private renderer: Renderer2) {
    this._parent = injector.get(SpeedDialComponent);
  }

  ngAfterContentInit(): void {
    this._buttons.changes.subscribe(() => {
      this.initButtonStates();
      this._parent.setActionsVisibility();
    });
    this.initButtonStates();
  }

  private initButtonStates(): void {
    this._buttons.forEach((button, i) => {
      this.renderer.addClass(button. _elementRef.nativeElement, 'action-item');
      this.changeElementStyle(button. _elementRef.nativeElement, 'z-index', '' + (Z_INDEX_ITEM - i));
    });
  }

  show(): void {
    if (!this._buttons) {
      return;
    }
    this.resetAnimationState();
    this.miniFabVisible = true;
    this.showMiniFabAnimation = setTimeout(() => {
      this._buttons.forEach((button, i) => {
        let transitionDelay = 0;
        let transform;
        if (this._parent.animationMode === 'scale') {
          transitionDelay = 3 + (65 * i);
          transform = 'scale(1)';
        } else {
          transform = this.getTranslateFunction('0');
        }
        const hostElement = button. _elementRef.nativeElement;
        this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
        this.changeElementStyle(hostElement, 'opacity', '1');
        this.changeElementStyle(hostElement, 'transform', transform);
       this.changeElementStyle(hostElement, 'display', "block");
      });
    }, 50);
  }

  private resetAnimationState(): void {
    clearTimeout(this.showMiniFabAnimation);
    if (this.hideMiniFab) {
      this.hideMiniFab.unsubscribe();
      this.hideMiniFab = null;
    }
  }

  hide(): void {
    if (!this._buttons) {
      return;
    }
    this.resetAnimationState();
    const total = this._buttons.length;
    let maxDelay = 0;
    const obs = this._buttons.map((button, i) => {
      let opacity = '1';
      let transitionDelay = 0;
      let transform;
      if (this._parent.animationMode === 'scale') {
        transitionDelay = 3 + (65 * (total - 1 - i));
        transform = 'scale(0)';
        opacity = '0';
      } else {
        transform = this.getTranslateFunction((55 * (i + 1) - (i * 5)) + 'px');
      }
      maxDelay = Math.max(maxDelay, transitionDelay);
      const hostElement = button. _elementRef.nativeElement;
      this.changeElementStyle(hostElement, 'transition-delay', transitionDelay + 'ms');
      this.changeElementStyle(hostElement, 'opacity', opacity);
      this.changeElementStyle(hostElement, 'transform', transform);
      return fromEvent(hostElement, 'transitionend').pipe(take(1));
    });
    // transitionend 不一定会来:样式值没变(已经是收起状态)、元素不可见、系统开了
    // 「减少动态效果」都不触发。forkJoin 少一个就永远不完成,小按钮停在透明但仍可点击
    // 的状态(b8c5e5c 复核)。最长延迟之后再等 500ms 兜底。
    this.hideMiniFab = race(forkJoin(obs), timer(maxDelay + 500)).subscribe(() => {
      this._buttons.forEach(button => {
        this.changeElementStyle(button._elementRef.nativeElement, 'display', 'none');
      });
      this.miniFabVisible = false;
    });
  }

  private getTranslateFunction(value: string): string {
    const dir = this._parent.direction;
    const translateFn = (dir === 'up' || dir === 'down') ? 'translateY' : 'translateX';
    const sign = (dir === 'down' || dir === 'right') ? '-' : '';
    return translateFn + '(' + sign + value + ')';
  }

  private changeElementStyle(elem: any, style: string, value: string) {
    // FIXME - Find a way to create a "wrapper" around the action button(s) provided by the user, so we don't change it's style tag
    this.renderer.setStyle(elem, style, value);
  }
}


@Component({
    selector: 'speed-dial',
    template: `
        <div class="speed-dial-container">
            <ng-content select="speed-dial-trigger"></ng-content>
            <ng-content select="speed-dial-actions"></ng-content>
        </div>
    `,
    styleUrls: ['./speed-dial.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        hostID: 'speed-dial' + Math.random().toString(36).substring(2, 15)}
})

export class SpeedDialComponent implements OnDestroy, AfterContentInit {
    private isInitialized = false;
    private _direction: Direction = 'up';
    private _open = false;
    private _animationMode: AnimationMode = 'fling';
    private _fixed = false;
    private _documentClickUnlistener: (() => void) | null = null;

    @Input() type = "mat-fab";
    /**
     * Whether this speed dial is fixed on screen (user cannot change it by clicking)
     */
    @Input() get fixed(): boolean {
        return this._fixed;
    }

    set fixed(fixed: boolean) {
        this._fixed = fixed;
        this._processOutsideClickState();
    }

    /**
     * Whether this speed dial is opened
     */
    @HostBinding('class.eco-opened')
    @Input() get open(): boolean {
        return this._open;
    }

    set open(open: boolean) {
        const previousOpen = this._open;
        this._open = open;
        if (previousOpen !== this._open) {
            this.openChange.emit(this._open);
            if (this.isInitialized) {
                this.setActionsVisibility();
            }
        }
    }

    /**
     * The direction of the speed dial. Can be 'up', 'down', 'left' or 'right'
     */
    @Input() get direction(): Direction {
        return this._direction;
    }

    set direction(direction: Direction) {
        const previousDirection = this._direction;
        this._direction = direction;
        if (previousDirection !== this.direction) {
            this._setElementClass(previousDirection, false);
            this._setElementClass(this.direction, true);

            if (this.isInitialized) {
                this.setActionsVisibility();
            }
        }
    }

    /**
     * The animation mode to open the speed dial. Can be 'fling' or 'scale'
     */
    @Input() get animationMode(): AnimationMode {
        return this._animationMode;
    }

    set animationMode(animationMode: AnimationMode) {
        const previousAnimationMode = this._animationMode;
        this._animationMode = animationMode;
        if (previousAnimationMode !== this._animationMode) {
            this._setElementClass(previousAnimationMode, false);
            this._setElementClass(this.animationMode, true);

            if (this.isInitialized) {
                // To start another detect lifecycle and force the "close" on the action buttons
                Promise.resolve(null).then(() => this.open = false);
            }
        }
    }

    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ContentChild(SpeedDialActionsComponent) _childActions: SpeedDialActionsComponent;

    constructor(private elementRef: ElementRef, private renderer: Renderer2,
      @Inject(DOCUMENT) private document: any) {
    }

    ngAfterContentInit(): void {
        this.isInitialized = true;
        this.setActionsVisibility();
        this._setElementClass(this.direction, true);
        this._setElementClass(this.animationMode, true);
    }

    ngOnDestroy() {
        this._unsetDocumentClickListener();
    }

    /**
     * Toggle the open state of this speed dial
     */
    public toggle(): void {
        this.open = !this.open;
    }

    @HostListener('click')
    _onClick(): void {
        if (!this.fixed && this.open) {
            this.open = false;
        }
    }

    setActionsVisibility(): void {
        if (!this._childActions) {
            return;
        }
        if (this.open) {
            this._childActions.show();
        } else {
            this._childActions.hide();
        }
        this._processOutsideClickState();
    }

    private _setElementClass(elemClass: string, isAdd: boolean): void {
      let finalClass;
      if(this.type=='mat-fab'){
        finalClass = `eco-${elemClass}`;
      }else{
        finalClass = `eco-mini-${elemClass}`;
      }
        if (isAdd) {
            this.renderer.addClass(this.elementRef.nativeElement, finalClass);
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, finalClass);
        }
    }

    private _processOutsideClickState() {
        if (!this.fixed && this.open) {
            this._setDocumentClickListener();
        } else {
            this._unsetDocumentClickListener();
        }
    }

    private _setDocumentClickListener() {
        if (!this._documentClickUnlistener) {
            this._documentClickUnlistener = this.renderer.listen(this.document, 'click', () => {
                this.open = false;
            });
        }
    }

    private _unsetDocumentClickListener() {
        if (this._documentClickUnlistener) {
            this._documentClickUnlistener();
            this._documentClickUnlistener = null;
        }
    }

}

