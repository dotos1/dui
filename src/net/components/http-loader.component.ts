
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged, partition, switchMap, tap } from 'rxjs/operators';
import { PendingRequestsInterceptor } from '../services/pending-requests-interceptor.service';
import { SpinnerVisibilityService } from '../services/spinner-visibility.service';

@Component({
  selector: 'http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.scss'],
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class HttpLoaderComponent implements OnDestroy, OnInit {

  private _isVisible$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription;
  private visibleUntil = Date.now();

  @Input() public backdrop = true;
  @Input() public backgroundColor: string;
  @Input() public debounceDelay = 0;
  @Input() public entryComponent: any = null;
  @Input() public extraDuration = 0;
  @Input() public filteredHeaders: string[] = [];
  @Input() public filteredMethods: string[] = [];
  @Input() public filteredUrlPatterns: string[] = [];
  @Input() public minDuration = 0;
  @Input() public opacity = '.7';


  constructor(private pendingRequestsInterceptor: PendingRequestsInterceptor, private spinnerVisibility: SpinnerVisibilityService) {
    const [showSpinner$, hideSpinner$] = partition((h: boolean) => h)(this.pendingRequestsInterceptor.pendingRequestsStatus$);

    this.subscriptions = merge(
      this.pendingRequestsInterceptor.pendingRequestsStatus$.pipe(
        switchMap(() => showSpinner$.pipe(debounce(() => timer(this.debounceDelay))))
      ),
      showSpinner$.pipe(
        switchMap(() => hideSpinner$.pipe(debounce(() => this.getVisibilityTimer$())))
      ),
      this.spinnerVisibility.visibility$,
    )
      .pipe(
        distinctUntilChanged(),
        tap(h => this.updateExpirationDelay(h))
      )
      .subscribe(h => this._isVisible$.next(h));
  }

  public ngOnInit(): void {

    this.initFilters();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get isVisible$(): Observable<boolean> {
    return this._isVisible$.asObservable();
  }


  private initFilters(): void {
    this.initFilteredUrlPatterns();
    this.initFilteredMethods();
    this.initFilteredHeaders();
  }

  private initFilteredUrlPatterns(): void {
    if (!(this.filteredUrlPatterns instanceof Array)) {
      throw new TypeError('`filteredUrlPatterns` must be an array.');
    }

    if (this.filteredUrlPatterns.length) {
      this.filteredUrlPatterns.forEach(e =>
        this.pendingRequestsInterceptor.filteredUrlPatterns.push(new RegExp(e))
      );
    }
  }

  private initFilteredMethods(): void {
    if (!(this.filteredMethods instanceof Array)) {
      throw new TypeError('`filteredMethods` must be an array.');
    }
    this.pendingRequestsInterceptor.filteredMethods = this.filteredMethods;
  }

  private initFilteredHeaders(): void {
    if (!(this.filteredHeaders instanceof Array)) {
      throw new TypeError('`filteredHeaders` must be an array.');
    }
    this.pendingRequestsInterceptor.filteredHeaders = this.filteredHeaders;
  }

  private updateExpirationDelay(showSpinner: boolean): void {
    if (showSpinner) {
      this.visibleUntil = Date.now() + this.minDuration;
    }
  }

  private getVisibilityTimer$(): Observable<number> {
    return timer(Math.max(this.extraDuration, this.visibleUntil - Date.now()));
  }
}
