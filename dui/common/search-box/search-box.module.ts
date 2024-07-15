import { ComponentFactoryResolver, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SearchInputComponent } from './search-input/search-input.component';
import { SearchBoxComponent } from './search-box.component';
import { Dui } from '@dotos/dui/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [SearchInputComponent, SearchBoxComponent],
  exports: [SearchInputComponent, SearchBoxComponent],
})
export class SearchBoxModule {
  entryComponents = [
    SearchBoxComponent
  ];
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
}
