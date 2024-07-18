
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TranslateModule } from '@dotos/dui/translator';

import { ToolbarDividerComponent } from './topbar-divider.component';
import { TopbarTitleComponent } from './topbar-title.component';
import { TopbarComponent } from './topbar.component';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatToolbarModule,
    ],
    declarations: [
        TopbarComponent,
        TopbarTitleComponent,
        ToolbarDividerComponent
    ],
    exports: [
        TopbarComponent,
        TopbarTitleComponent,
        ToolbarDividerComponent
    ]
})
export class TopbarModule {}
