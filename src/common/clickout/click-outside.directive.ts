import {
  Directive,  ElementRef,  EventEmitter,  Inject,  Injectable,  Input,  OnChanges,  OnDestroy,  OnInit,  Output,  PLATFORM_ID,  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Emits `clickOutside` whenever a click (or other configured event) happens outside the
 * host element, useful for closing dropdowns/popups.
 * @zh 当点击（或其他配置的事件）发生在宿主元素之外时发出 `clickOutside`，常用于关闭下拉菜单/弹出层。
 */
@Injectable()
@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {

  /** @zh 仅在宿主元素被点击之后才开始监听"外部点击"（而不是从一开始就监听）。 */
  @Input() attachOutsideOnClick: boolean = false;
  /** @zh 延迟初始化外部点击监听器（等待一个微任务）。 */
  @Input() delayClickOutsideInit: boolean = false;
  /**
   * CSS selector for elements that should be excluded (clicking them doesn't count as "outside").
   * @zh 需要排除的元素的 CSS 选择器（点击这些元素不算作"外部点击"）。
   */
  @Input() exclude: string = '';
  /** @zh 在每次点击前都重新计算排除元素列表（否则只计算一次）。 */
  @Input() excludeBeforeClick: boolean = false;
  /** @zh 逗号分隔的自定义监听事件列表，默认只监听 `click`。 */
  @Input() clickOutsideEvents: string = '';

  /**
   * Emitted when a click (or configured event) occurs outside the host element.
   * @zh 当点击（或配置的事件）发生在宿主元素之外时发出。
   */
  @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  private _nodesExcluded: Array<HTMLElement> = [];
  private _events: Array<string> = ['click'];
  private _delayTimeoutId: any;

  constructor(private _el: ElementRef,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
  }


  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { return; }

    this._init();
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) { return; }

    this._removeClickOutsideListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!isPlatformBrowser(this.platformId)) { return; }

    if (changes['attachOutsideOnClick'] || changes['exclude']) {
      this._removeClickOutsideListener();
      this._init();
    }
  }

  private _removeClickOutsideListener() {
    if (this._delayTimeoutId) {
      clearTimeout(this._delayTimeoutId);
      this._delayTimeoutId = null;
    }

    if (this.attachOutsideOnClick) {
      this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
    }

    this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
  }

  private _init() {
    if (this.clickOutsideEvents !== '') {
      this._events = this.clickOutsideEvents.split(',').map(e => e.trim());
    }

    this._excludeCheck();

    if (this.attachOutsideOnClick) {
      this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
    } else {
      this._initOnClickBody();
    }
  }

  private _initOnClickBody() {
    if (this.delayClickOutsideInit) {
      if (this._delayTimeoutId) {
        clearTimeout(this._delayTimeoutId);
      }
      this._delayTimeoutId = setTimeout(this._initClickListeners.bind(this));
    } else {
      this._initClickListeners();
    }
  }

  private _initClickListeners() {
    this._events.forEach(e => document.body.addEventListener(e, this._onClickBody));
  }

  private _excludeCheck() {
    if (this.exclude) {
      try {
        const nodes = Array.from(document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
        if (nodes) {
          this._nodesExcluded = nodes;
        }
      } catch (err) {
        console.error('[ng-click-outside] Check your exclude selector syntax.', err);
      }
    }
  }

  private _onClickBody(ev: Event) {
    if (this.excludeBeforeClick) {
      this._excludeCheck();
    }

    if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
      this.clickOutside.emit(ev);

      if (this.attachOutsideOnClick) {
        this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
      }
    }
  }

  private _shouldExclude(target:any): boolean {
    for (const excludedNode of this._nodesExcluded) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }

    return false;
  }
}
