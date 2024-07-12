import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';


@Component({
    selector: 'dui-title-bar-content',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar-content'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarContentComponent extends ɵOsBaseComponent {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
