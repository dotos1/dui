import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DragAndDropModule } from '../drag-and-drop';
import { ResizerModule } from '../resizer';
import { ScrollViewModule } from '../scroll-view';
import { UtilsModule } from '../utils';
import {
    TitleBarButtonComponent,
    TitleBarComponent,
    TitleBarContentComponent,
    TitleBarControlsComponent,
    TitleBarIconComponent,
    WindowComponent, ɵDynamicWindowComponent
} from './components';
import { ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER } from './data';

@NgModule({
    declarations: [
        ɵDynamicWindowComponent,
        TitleBarButtonComponent,
        TitleBarComponent,
        TitleBarContentComponent,
        TitleBarControlsComponent,
        TitleBarIconComponent,
        WindowComponent
    ],
    imports: [
        CommonModule,
        UtilsModule,
        MatIconModule,
        ScrollViewModule,
        ResizerModule,
        RouterModule,
        DragAndDropModule
    ],
    exports: [
        TitleBarButtonComponent,
        TitleBarComponent,
        TitleBarContentComponent,
        TitleBarControlsComponent,
        TitleBarIconComponent,
        WindowComponent
    ],
    providers: [
        ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER
    ]
})
export class WindowModule {}
