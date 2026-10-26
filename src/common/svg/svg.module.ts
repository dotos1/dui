/**
 * @fileoverview Module `src/common/svg/svg.module.ts` providing svg module definitions and implementation.
 * @zh 模块文件 `src/common/svg/svg.module.ts`，提供SVG矢量图模块相关的定义与实现。
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgContainerComponent } from './components/svg-container.component';
import { SvgRectDirective } from './directives/svg-rect.directive';
import { SvgCircleDirective } from './directives/svg-circle.directive';
import { SvgEllipseDirective } from './directives/svg-ellipse.directive';
import { SvgLineDirective } from './directives/svg-line.directive';
import { SvgPolylineDirective } from './directives/svg-polyline.directive';
import { SvgPolygonDirective } from './directives/svg-polygon.directive';
import { SvgImageDirective } from './directives/svg-image.directive';
import { SvgPathDirective } from './directives/svg-path.directive';
import { SvgTextDirective } from './directives/svg-text.directive';

/**
 * Angular module `SvgModule` declaring and exporting svg module components, directives, pipes, and providers.
 * @zh Angular 模块 `SvgModule`，声明并导出SVG矢量图模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective,
    SvgImageDirective,
    SvgPathDirective,
    SvgTextDirective
  ],
  declarations: [
    SvgContainerComponent,
    SvgRectDirective,
    SvgCircleDirective,
    SvgEllipseDirective,
    SvgLineDirective,
    SvgPolylineDirective,
    SvgPolygonDirective,
    SvgImageDirective,
    SvgPathDirective,
    SvgTextDirective
  ],
  providers: [],
})
export class SvgModule { }
