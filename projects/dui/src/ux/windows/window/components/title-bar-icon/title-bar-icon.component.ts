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
    selector: 'dui-title-bar-icon',
    template: `
    <div class="window-titleicon" [ngClass]="iconClass">
      <!-- <ng-container *ngIf="iconType!=='class'"> -->
        <mat-icon *ngIf="iconType!=='SVG'" class="dui-title-icon">{{icon}}</mat-icon>
        <mat-icon *ngIf="iconType==='SVG'" class="dui-title-icon" svgIcon="{{icon}}" ></mat-icon>
      <!-- </ng-container> -->
    </div>` ,
    host: {
        'class': 'dui-title-bar-icon'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarIconComponent extends ɵOsBaseComponent {
    /** The URL to the icon */
    @Input()
    public iconType='Font';

    @Input()
    public icon='';

    @Input()
    public iconClass='';

    @HostBinding('style.backgroundImage')
    public _iconCssBackground: string;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
