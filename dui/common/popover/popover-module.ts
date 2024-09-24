import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverTarget } from './popover-target';
import { A11yModule } from '@angular/cdk/a11y';


@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    A11yModule
  ],
  exports: [Popover, PopoverTrigger, PopoverTarget],
  declarations: [Popover, PopoverTrigger, PopoverTarget],

})
export class PopoverModule {}
