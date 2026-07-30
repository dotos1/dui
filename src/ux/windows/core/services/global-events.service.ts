import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ɵGlobalEvents {
    private documentEventMap = new Map<string, Observable<Event>>();
    private documentEventListeners = new Map<string, EventListener>();
    private documentEventRefCounts = new Map<string, number>();

    constructor(
        @Inject(DOCUMENT) private readonly document: Document
    ) {}

    // Previously the listener passed to addEventListener was an anonymous arrow function
    // with no saved reference, so it could never be removed -- once registered for a given
    // eventName it stayed on `document` for the lifetime of the app. Root singleton + a
    // finite set of event names meant this never grew unbounded, but it also meant the
    // service gave future consumers no real way to stop listening. This now tracks a
    // per-eventName subscriber refcount and tears the DOM listener down (via `finalize()`)
    // once the last subscriber unsubscribes, re-registering fresh on the next `fromDocument()` call.
    public fromDocument<T extends Event>(eventName: keyof DocumentEventMap): Observable<T> {
        if (!this.documentEventMap.has(eventName)) {
            const emitter = new Subject<Event>();
            const listener: EventListener = (event) => emitter.next(event);

            this.document.addEventListener(eventName, listener);
            this.documentEventListeners.set(eventName, listener);
            this.documentEventRefCounts.set(eventName, 0);

            this.documentEventMap.set(eventName, emitter.asObservable().pipe(
                finalize(() => {
                    const remaining = (this.documentEventRefCounts.get(eventName) || 1) - 1;
                    if (remaining <= 0) {
                        this.document.removeEventListener(eventName, this.documentEventListeners.get(eventName));
                        this.documentEventMap.delete(eventName);
                        this.documentEventListeners.delete(eventName);
                        this.documentEventRefCounts.delete(eventName);
                    } else {
                        this.documentEventRefCounts.set(eventName, remaining);
                    }
                })
            ));
        }

        this.documentEventRefCounts.set(eventName, (this.documentEventRefCounts.get(eventName) || 0) + 1);
        return this.documentEventMap.get(eventName) as Observable<T>;
    }
}
