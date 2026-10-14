import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ɵGlobalEvents {
    private documentEventMap = new Map<string, Subject<Event>>();
    private documentEventListeners = new Map<string, EventListener>();
    private documentEventRefCounts = new Map<string, number>();

    constructor(
        @Inject(DOCUMENT) private readonly document: Document
    ) {}

    public fromDocument<T extends Event>(eventName: keyof DocumentEventMap): Observable<T> {
        return defer(() => {
            if (!this.documentEventMap.has(eventName)) {
                const emitter = new Subject<Event>();
                const listener: EventListener = (event) => emitter.next(event);

                this.document.addEventListener(eventName, listener);
                this.documentEventListeners.set(eventName, listener);
                this.documentEventRefCounts.set(eventName, 0);
                this.documentEventMap.set(eventName, emitter);
            }

            this.documentEventRefCounts.set(eventName, (this.documentEventRefCounts.get(eventName) || 0) + 1);
            const emitter = this.documentEventMap.get(eventName)!;

            return emitter.asObservable().pipe(
                finalize(() => {
                    const remaining = (this.documentEventRefCounts.get(eventName) || 1) - 1;
                    if (remaining <= 0) {
                        const savedListener = this.documentEventListeners.get(eventName);
                        if (savedListener) {
                            this.document.removeEventListener(eventName, savedListener);
                        }
                        this.documentEventMap.delete(eventName);
                        this.documentEventListeners.delete(eventName);
                        this.documentEventRefCounts.delete(eventName);
                    } else {
                        this.documentEventRefCounts.set(eventName, remaining);
                    }
                })
            ) as Observable<T>;
        });
    }
}
