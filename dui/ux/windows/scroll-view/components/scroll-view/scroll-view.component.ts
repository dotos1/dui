import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';

@Component({
    selector: 'dui-scroll-view',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-scroll-view'
    },
    styleUrls: ['./scroll-view.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollViewComponent extends ɵOsBaseComponent {
    /** Is vertical scroll enabled? */
    @Input()
    public isVerticalScrollEnabled: boolean = true;

    /** Is horizontal scroll enabled? */
    @Input()
    public isHorizontalScrollEnabled: boolean = false;

    /** Does the vertical scroll hide when it is not needed? */
    @Input()
    public isVerticalScrollHiding: boolean = false;

    /** Does the horizontal scroll hide when it is not needed? */
    @Input()
    public isHorizontalScrollHiding: boolean = false;

    @HostBinding('style.overflow-x')
    public get _hostOverflowX(): string {
        if (!this.isHorizontalScrollHiding) {
            return (this.isHorizontalScrollEnabled) ? 'auto' : 'hidden';
        }
        return (this.isHorizontalScrollEnabled) ? 'scroll' : 'hidden';
    }

    @HostBinding('style.overflow-y')
    public get _hostOverflowY(): string {
        if (!this.isVerticalScrollHiding) {
            return (this.isVerticalScrollEnabled) ? 'auto' : 'hidden';
        }
        return (this.isVerticalScrollEnabled) ? 'scroll' : 'hidden';
    }

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public scrollTo(left: number, top: number): void {
        this.hostRef.nativeElement.scrollTo({ left, top });
    }
}
