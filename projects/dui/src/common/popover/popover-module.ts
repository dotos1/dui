import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DuiPopover } from './popover';
import { DuiPopoverTrigger } from './popover-trigger';
import { DuiPopoverTarget } from './popover-target';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    A11yModule
  ],
  exports: [DuiPopover, DuiPopoverTrigger, DuiPopoverTarget],
  declarations: [DuiPopover, DuiPopoverTrigger, DuiPopoverTarget],
})
export class DuiPopoverModule {}
