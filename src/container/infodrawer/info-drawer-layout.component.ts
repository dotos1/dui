/**
 * @fileoverview Module `src/container/infodrawer/info-drawer-layout.component.ts` providing info drawer layout component definitions and implementation.
 * @zh 模块文件 `src/container/infodrawer/info-drawer-layout.component.ts`，提供信息抽屉面板布局组件相关的定义与实现。
 */


import { Component, Directive, ViewEncapsulation } from '@angular/core';

/**
 * Angular component `InfoDrawerLayoutComponent` (selector: 'dui-info-drawer-layout') providing info drawer layout component presentation and interaction in `src/container/infodrawer`.
 * @zh Angular 组件 `InfoDrawerLayoutComponent`（selector: 'dui-info-drawer-layout'），提供信息抽屉面板布局组件的视图渲染与交互逻辑（位于 `src/container/infodrawer`）。
 */
@Component({
  selector: 'dui-info-drawer-layout',
  templateUrl: './info-drawer-layout.component.html',
  styleUrls: ['./info-drawer-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'dui-info-drawer-layout',
    hostID: 'dui-info-drawer-layout' + Math.random().toString(36).substring(2, 15)
   },
  standalone: false

})
export class InfoDrawerLayoutComponent { }

/**
 * Angular directive `InfoDrawerTitleDirective` (selector: '[dui-info-drawer-title], [info-drawer-title]') attaching info drawer title directive behavior to host DOM elements.
 * @zh Angular 指令 `InfoDrawerTitleDirective`（selector: '[dui-info-drawer-title], [info-drawer-title]'），为宿主 DOM 元素附加信息抽屉面板标题指令行为。
 */
@Directive({ selector: '[dui-info-drawer-title], [info-drawer-title]', standalone: false }) export class InfoDrawerTitleDirective { }
/**
 * Angular directive `InfoDrawerButtonsDirective` (selector: '[dui-info-drawer-buttons], [info-drawer-buttons]') attaching info drawer buttons directive behavior to host DOM elements.
 * @zh Angular 指令 `InfoDrawerButtonsDirective`（selector: '[dui-info-drawer-buttons], [info-drawer-buttons]'），为宿主 DOM 元素附加信息抽屉面板按钮指令行为。
 */
@Directive({ selector: '[dui-info-drawer-buttons], [info-drawer-buttons]', standalone: false }) export class InfoDrawerButtonsDirective { }
/**
 * Angular directive `InfoDrawerContentDirective` (selector: '[dui-info-drawer-content], [info-drawer-content]') attaching info drawer content directive behavior to host DOM elements.
 * @zh Angular 指令 `InfoDrawerContentDirective`（selector: '[dui-info-drawer-content], [info-drawer-content]'），为宿主 DOM 元素附加信息抽屉面板内容指令行为。
 */
@Directive({ selector: '[dui-info-drawer-content], [info-drawer-content]', standalone: false }) export class InfoDrawerContentDirective { }
