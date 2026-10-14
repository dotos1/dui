import { Injectable, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Media, MediaOrientation } from './media.enum';

@Injectable({
  providedIn: 'root'
})
export class MediaService implements OnDestroy {
  public media$ = new BehaviorSubject<Media>(undefined);
  public orientation$ = new BehaviorSubject<MediaOrientation>(undefined);
  private subscriptions = new Subscription();

  constructor(breakpointObserver: BreakpointObserver) {
    this.subscriptions.add(
      breakpointObserver
        .observe([Breakpoints.HandsetLandscape])
        .subscribe(res => {
          if (res.matches) {
            this.media$.next(Media.Mobile);
            this.orientation$.next(MediaOrientation.Landscape);
          }
        })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.HandsetPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Mobile);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.TabletLandscape]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Tablet);
          this.orientation$.next(MediaOrientation.Landscape);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.TabletPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Tablet);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.WebLandscape]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Desktop);
          this.orientation$.next(MediaOrientation.Landscape);
        }
      })
    );

    this.subscriptions.add(
      breakpointObserver.observe([Breakpoints.WebPortrait]).subscribe(res => {
        if (res.matches) {
          this.media$.next(Media.Desktop);
          this.orientation$.next(MediaOrientation.Portrait);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getMedia(): Media {
    return this.media$.value;
  }

  getOrientation(): MediaOrientation {
    return this.orientation$.value;
  }
}
