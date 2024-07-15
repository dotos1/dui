import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizableModule } from '@dotos/dui/common/resize-element';
import { TerminalComponent } from './terminal.component';
import { GlobalStyleComponent } from './global-style/global-style.component';


@NgModule({
  declarations: [TerminalComponent,GlobalStyleComponent],
  imports: [
    ResizableModule, CommonModule
  ],
  exports: [TerminalComponent]
})
export class TerminalModule { }
