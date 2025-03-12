import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy, OnInit, Output,
  Renderer2,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BehaviorSubject, forkJoin, fromEvent, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import elementResizeDetectorMaker from 'element-resize-detector';
import { IframeEvent, IframeEventName } from '../interfaces/iframe-event';
import { Dui } from '@dotos/dui/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'dui-iframe',
  template: `
        <div class="dui-iframe" *ngIf="$loading | async">
            <ng-content></ng-content>
        </div>
        <iframe #iframe [src]="source | safe" frameborder="0" class="dui-iframe" [ngStyle]="$styling | async" [scrolling]="scrolling"></iframe>
    `,
  styles: [`
        :host {
            position: relative;
            display: block;
            overflow: hidden;
            width:100%;
            height:100%;
        }
        .dui-iframe {
            overflow: hidden;
            width: 100%;
            height:100%;
        }
        .dui-iframe-loading {
            height: 100%;
            width: 100%;
            position: absolute;
            z-index: 1;
        }
        .dui-iframe-loading::after {
            background: #fff;
            content: '';
            display: block;
            height: 100%;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: -1;
            left: 0;
        }
    `]
})
export class IframeComponent implements OnInit, OnChanges,AfterViewInit, OnDestroy {
  @ViewChild('iframe') iframe: ElementRef;

  @Input() config: any = {};

  @Input() scrolling='no';

  get resizeDebounceMillis(): number {
    return this._resizeDebounceMillis;
  }

  @Input() set resizeDebounceMillis(value: number) {
    if (this._resizeDebounceMillis !== value) {
      this.updateStyles();
    }
    this._resizeDebounceMillis = value;

  }
  get autoResize(): boolean {
    return this._autoResize;
  }

  @Input() set autoResize(value: boolean) {
    this._autoResize = value;
  }
  get styleUrls(): Array<string> {
    return this._styleUrls;
  }

  @Input() set styleUrls(value: Array<string>) {
    this._styleUrls = value;
  }
  get styles(): string {
    return this._styles;
  }

  @Input() set styles(value: string) {
    this._styles = value;
  }
  get source(): any {
    return this._source;
  }

  @Input() set source(value: string) {
    this._source = this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  @Output() iframeEvent: EventEmitter<IframeEvent> = new EventEmitter();

  $iframeClick: ReplaySubject<MouseEvent> = new ReplaySubject<MouseEvent>(1);
  $iframeKeyUp: ReplaySubject<KeyboardEvent> = new ReplaySubject<KeyboardEvent>(1);
  $iframeUnload: ReplaySubject<BeforeUnloadEvent> = new ReplaySubject<BeforeUnloadEvent>(1);
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  $styling: Observable<any>;
  iframeDocument: Document;
  iframeBody: HTMLElement;
  activeSource: string;
  elementResizeDetector: elementResizeDetectorMaker.Erd;
  private eventListeners: Array<any> = [];
  private $unsubscribe = new Subject();
  @ViewChild('iframe') elementRef: ElementRef;
  private _source: any;
  private _styles: string;
  private $bodyHeight: Subject<number> = new Subject<number>();
  private _styleUrls: Array<string>;
  private _autoResize = true;
  private _resizeDebounceMillis = 50;
  
  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
     private cdr: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
  init(config: any) {
    Dui.apply(this, config);
  }

  private updateStyles() {
    this.$styling = this.$bodyHeight.pipe(
      distinctUntilChanged(),
      debounceTime(this.resizeDebounceMillis),
      tap(() => this.emitEvent('iframe-resized')),
      map((height) => ({ 'height.px': height })));
  }

  private addStyleSheets(styleUrls) {
    if (styleUrls.length > 0) {

      // create placeholder for subjects
      const loadSubjects: Array<Subject<string>> = [];

      // loop through all style sheets...
      styleUrls.map((styleUrl: string) => {

        // create link element
        const linkElement: HTMLElement = this.iframeDocument.createElement('link');
        linkElement['rel'] = 'stylesheet';
        linkElement['type'] = 'text/css';
        linkElement['href'] = styleUrl;

        // create load subject that will emit once the stylesheet has loaded
        const loadSubject: Subject<string> = new Subject<string>();
        loadSubjects.push(loadSubject);

        // listen to load event on link
        const stylesheetLoadListener = this.renderer.listen(linkElement, 'load', () => {
          this.iframeBody.style.overflow = 'inherit';
          this.emitEvent('iframe-stylesheet-loaded', styleUrl);
          loadSubject.next(styleUrl);
          loadSubject.complete();
          return true;
        });

        // push listener to array so that we can remove them later
        this.eventListeners.push(stylesheetLoadListener);

        // add link to iframe head
        this.iframeDocument.head.appendChild(linkElement);

        // emit load event
        this.emitEvent('iframe-stylesheet-load', styleUrl);
      });

      forkJoin(loadSubjects)
        .pipe(
          takeUntil(this.$unsubscribe)
        )
        .subscribe(() => {
          if (styleUrls.length > 1) {
            this.emitEvent('iframe-all-stylesheets-loaded', styleUrls);
          }
          this.$loading.next(false);
        });
    }
  }

  private addCss(styles: string) {
    const styleElement = this.iframeDocument.createElement('style');
    styleElement.appendChild(this.iframeDocument.createTextNode(styles));
    this.iframeDocument.getElementsByTagName('head')[0].appendChild(styleElement);
    this.emitEvent('iframe-styles-added');
  }

  private addElementResizeDetector(body: HTMLElement, style: any) {
    this.elementResizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });
    this.elementResizeDetector.listenTo(body, () => {
      const offsetHeight = body.offsetHeight;
      const marginTop = parseInt(style.getPropertyValue('margin-top'), 10);
      const marginBottom = parseInt(style.getPropertyValue('margin-bottom'), 10);
      const height = offsetHeight + marginTop + marginBottom;
      this.$bodyHeight.next(height);
    });
  }

  private removeElementResizeDetector() {
    if (this.iframeBody && this.elementResizeDetector) {
      this.elementResizeDetector.uninstall(this.iframeBody);
    }
  }

  private emitEvent(eventName: IframeEventName, resource?: string) {
    const iframeEvent: IframeEvent = { event: eventName, src: this.activeSource };
    if (resource) {
      iframeEvent.resource = resource;
    }
    this.iframeEvent.emit(iframeEvent);
  }

  reload() {
    if (this.iframeDocument && this.iframeDocument.location) {
      this.iframeDocument.location.reload();
    }
  }

  ngOnInit() {
    this.activeSource = this.source;
    this.$loading.pipe(
      filter(value => value === false || value === null),
      takeUntil(this.$unsubscribe)
    ).subscribe((res) => {
      this.emitEvent(res === null ? 'iframe-loaded-with-errors' : 'iframe-loaded');
    });
    this.updateStyles();
  }

  ngAfterViewInit() {
    const iframe = this.elementRef.nativeElement;
    this.$iframeClick
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.emitEvent('iframe-click');
      });
    this.$iframeKeyUp
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.emitEvent('iframe-keyup');
      });
    this.$iframeUnload
      .pipe(
        takeUntil(this.$unsubscribe)
      ).subscribe(() => {
        this.$loading.next(true);
        this.emitEvent('iframe-unloaded');
        this.iframeBody.style.overflow = 'hidden';
        this.cdr.detectChanges();
      });

    fromEvent(iframe, 'load')
      .pipe(
        takeUntil(this.$unsubscribe)
      )
      .subscribe(() => {
        try {
          this.activeSource = iframe.contentWindow.location.href;
          this.iframeDocument = iframe.contentDocument;
          this.iframeBody = this.iframeDocument.body;

          // add inline css
          if (this.styles) {
            this.addCss(this.styles);
          }

          // add external stylesheets
          if (this.styleUrls && this.styleUrls.length > 0) {
            this.addStyleSheets(this.styleUrls);
          } else {
            this.$loading.next(false);
          }

          // add element resize detector
          if (this.autoResize) {
            this.addElementResizeDetector(this.iframeBody, iframe.contentWindow.getComputedStyle(this.iframeBody));
          }

          // add click listener
          const clickListener = this.renderer.listen(
            iframe.contentWindow,
            'click',
            ($event: MouseEvent) => this.$iframeClick.next($event)
          );
          this.eventListeners.push(clickListener);

          // add key up listener
          const keyUpListener = this.renderer.listen(
            iframe.contentWindow,
            'keyup',
            ($event: KeyboardEvent) => this.$iframeKeyUp.next($event)
          );
          this.eventListeners.push(keyUpListener);

          // add unload listener
          const unloadListener = this.renderer.listen(
            iframe.contentWindow,
            'beforeunload',
            ($event: BeforeUnloadEvent) => this.$iframeUnload.next($event)
          );
          this.eventListeners.push(unloadListener);
        } catch (error) {
          console.log('Event listeners and/or styles and resize listener could not be added due to a cross-origin frame error.');
          console.warn(error);
          this.$loading.next(null);

        }
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.complete();
    this.eventListeners.map((listener) => listener());
    if (this.autoResize) {
      this.removeElementResizeDetector();
    }
  }
}
