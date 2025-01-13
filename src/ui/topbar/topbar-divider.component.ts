
import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'dui-topbar-divider',
    template: '<div></div>',
    host: { 'class': 'dui-topbar-divider' },
    styles: [`
        .dui-topbar-divider > div {
            height: 24px;
            width: 1px;
            background: rgba(0, 0, 0, 0.26);
            margin-left: 5px;
            margin-right: 5px;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarDividerComponent { }
