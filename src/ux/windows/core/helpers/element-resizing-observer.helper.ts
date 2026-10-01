import { Observable } from 'rxjs';

export function ɵElementResizingObserver(element: HTMLElement): Observable<HTMLElement> {
    return new Observable((subscriber) => {
        const resizeObserver = new ResizeObserver(() => subscriber.next(element));
        resizeObserver.observe(element);
        return function unsubscribe() {
            resizeObserver.unobserve(element);
        };
    });
}
