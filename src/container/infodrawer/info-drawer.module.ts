
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, } from '@angular/material/tabs';
import { MatRippleModule, } from '@angular/material/core';
import { InfoDrawerLayoutComponent, InfoDrawerTitleDirective, InfoDrawerButtonsDirective, InfoDrawerContentDirective } from './info-drawer-layout.component';
import { InfoDrawerComponent, InfoDrawerTabComponent } from './info-drawer.component';
import { TranslateModule } from '@dotos/dui/translator';
import { MatButtonModule } from '@angular/material/button';

export function declarations() {
  return [
    InfoDrawerLayoutComponent,
    InfoDrawerTabComponent,
    InfoDrawerComponent,
    InfoDrawerTitleDirective,
    InfoDrawerButtonsDirective,
    InfoDrawerContentDirective
  ];
}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTabsModule,
    TranslateModule//.forChild()
  ],
  declarations: declarations(),
  exports: declarations()
})
export class InfoDrawerModule { }
