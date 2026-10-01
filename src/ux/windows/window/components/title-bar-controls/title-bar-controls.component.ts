import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';


@Component({
    selector: 'dui-title-bar-controls',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar-controls'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarControlsComponent extends ɵOsBaseComponent {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
