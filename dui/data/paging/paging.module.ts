import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DuiPagingBarComponent } from './paging-bar.component';
import { FlexLayoutModule } from 'ngx-flexible-layout';

export { DuiPagingBarComponent, IPageChangeEvent } from './paging-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatFormFieldModule
  ],
  declarations: [
    DuiPagingBarComponent,
  ],
  exports: [
    DuiPagingBarComponent,
  ],
})
export class DuiPagingModule {

}
