
import { Component, Directive, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dui-info-drawer-layout',
  templateUrl: './info-drawer-layout.component.html',
  styleUrls: ['./info-drawer-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'dui-info-drawer-layout','hostID': crypto.randomUUID().toString() }

})
export class InfoDrawerLayoutComponent { }

@Directive({ selector: '[dui-info-drawer-title], [info-drawer-title]' }) export class InfoDrawerTitleDirective { }
@Directive({ selector: '[dui-info-drawer-buttons], [info-drawer-buttons]' }) export class InfoDrawerButtonsDirective { }
@Directive({ selector: '[dui-info-drawer-content], [info-drawer-content]' }) export class InfoDrawerContentDirective { }
