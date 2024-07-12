
import { Component } from '@angular/core';

@Component({
    selector: 'dui-topbar-title',
    template: '<ng-content></ng-content>',
    host: { 'class': 'dui-topbar-title' }
})
export class TopbarTitleComponent { }
