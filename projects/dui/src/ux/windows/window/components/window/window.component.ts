import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';
import { ɵCommonCssClassEnum } from '../../../core/enums/common-css-class.enum';


@Component({
    selector: 'dui-window',
    templateUrl: './window.component.html',
    host: {
        'class': 'dui-window'
    },
    styleUrls: ['./window.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent extends ɵOsBaseComponent {
    /** Marks window as active (means user works with it right now) */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Active}`)
    public isActive: boolean = false;

    /** Stylelist for scroll view component of the window */
    @Input()
    public scrollViewStyle: object;

    /** Classlist for scroll view component of the window */
    @Input()
    public scrollViewStyleClass: string | string[] | object;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
