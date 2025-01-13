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
    selector: 'dui-title-bar',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarComponent extends ɵOsBaseComponent {
    /** Marks title bar as active (means user works with it right now) */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Active}`)
    public isActive: boolean = true;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
