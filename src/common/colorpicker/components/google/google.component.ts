/**
 * @fileoverview Module `src/common/colorpicker/components/google/google.component.ts` providing google component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/google/google.component.ts`，提供google组件相关的定义与实现。
 */


import {
  AfterViewChecked,
  ChangeDetectionStrategy,  ChangeDetectorRef,  Component,  Input, ViewEncapsulation,
} from '@angular/core';
import {  ColorWrap,  isValidHex,  zDepth,} from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { SketchDialogComponent } from '../sketch/sketch-dialog.component';
import { DialogService } from '@dotos/dui/common/dialogs';
import { GoogleColorService } from './google-color.services';

/**
 * Angular component `GoogColorPickerComponent` (selector: 'goog-color-picker') providing goog color picker component presentation and interaction in `src/common/colorpicker/components/google`.
 * @zh Angular 组件 `GoogColorPickerComponent`（selector: 'goog-color-picker'），提供Goog颜色选择器组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/google`）。
 */
@Component({
  selector: 'goog-color-picker',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(keydown)': '_handleKeydown($event)',
    hostID: 'goog-color-picker-' + Math.random().toString(36).substring(2, 15)
  },
   changeDetection: ChangeDetectionStrategy.OnPush,
   preserveWhitespaces: true,
  standalone: false,
})
/**
 * Google-Docs-style color picker: a fixed palette grid plus a user-managed row of custom colors.
 * @zh Google 文档风格的颜色选择器：固定调色板网格，加一行用户自行管理的自定义颜色。
 */
export class GoogColorPickerComponent extends ColorWrap implements TriggerPopup,AfterViewChecked {
  /**
   * Property `customcolors` (`string[]`) storing customcolors (default: `[ '#cf1717' ]`).
   * @zh 用户添加的自定义颜色列表。
   * @zh 用户添加的自定义颜色列表。
   */
  customcolors = [
    '#cf1717'
  ]
  /**
   * Input property `colors` (`string[][]`) configuring colors.
   * @zh 固定调色板颜色列表，每项为 `[十六进制值, 中文名称]`。
   * @zh 固定调色板颜色列表，每项为 `[十六进制值, 中文名称]`。
   */
  @Input() colors = [
      ['#000000',"黑色"],
      ['#434343',"深灰色 4"],
      ['#666666',"深灰色 3"],
      ['#999999',"深灰色 2"],
      ['#b7b7b7',"深灰色 1"],
      ['#cccccc',"灰色"],
      ['#d9d9d9',"浅灰色 1"],
      ['#efefef',"浅灰色 2"],
      ['#f3f3f3',"浅灰色 3"],
      ['#FFFFFF',"白色"],

      ['#980000',"浆果红"],
      ['#FF0000',"红色"],
      ['#FF9900',"橙色"],
      ['#FFFF00',"黄色"],
      ['#00FF00',"绿色"],
      ['#00FFFF',"青色"],
      ['#4A86E8',"矢车菊蓝"],
      ['#0000FF',"蓝色"],
      ['#9900FF',"紫色"],
      ['#FF00FF',"洋红色"],

      ['#E6B8AF',"浅浆果红色 3"],
      ['#F4CCCC',"浅红色 3"],
      ['#FCE5CD',"浅橙色 3"],
      ['#FFF2CC',"浅黄色 3"],
      ['#D9EAD3',"浅绿色 3"],
      ['#D0E0E3',"浅青色 3"],
      ['#C9DAF8',"浅矢车菊蓝色 3"],
      ['#CFE2F3',"浅蓝色 3"],
      ['#D9D2F9',"浅紫色 3"],
      ['#EAD1DC',"浅洋红色 3"],

      ['#DD7E68',"浅浆果红色 2"],
      ['#EA9999',"浅红色 2"],
      ['#F9CB9C',"浅橙色 2"],
      ['#FFE599',"浅黄色 2"],
      ['#B6D7A8',"浅绿色 2"],
      ['#A2C4C9',"浅青色 2"],
      ['#A4C2F4',"浅矢车菊蓝色 2"],
      ['#9FC5E8',"浅蓝色 2"],
      ['#B4A7D6',"浅紫色 2"],
      ['#D5A6BD',"浅洋红色 2"],

      ['#CC4125',"浅浆果红色 1"],
      ['#E06666',"浅红色 1"],
      ['#F6B26B',"浅橙色 1"],
      ['#FFD966',"浅黄色 1"],
      ['#93C47D',"浅绿色 1"],
      ['#76A5AF',"浅青色 1"],
      ['#6D9EEB',"浅矢车菊蓝色 1"],
      ['#6FA8DC',"浅蓝色 1"],
      ['#8E7CC3',"浅紫色 1"],
      ['#C27BA0',"浅洋红色 1"],

      ['#A61C00',"深浆果红色 1"],
      ['#CC0000',"深红色 1"],
      ['#E69138',"深橙色 1"],
      ['#F1C232',"深黄色 1"],
      ['#6AA84F',"深绿色 1"],
      ['#45818E',"深青色 1"],
      ['#3C78D8',"深矢车菊蓝色 1"],
      ['#3D85C6',"深蓝色 1"],
      ['#674EA7',"深紫色 1"],
      ['#A64D79',"深洋红色 1"],

      ['#85200C',"深浆果红色 2"],
      ['#990000',"深红色 2"],
      ['#B45F06',"深橙色 2"],
      ['#BF9000',"深黄色 2"],
      ['#38761D',"深绿色 2"],
      ['#134F5C',"深青色 2"],
      ['#1155CC',"深矢车菊蓝色 2"],
      ['#0B5394',"深蓝色 2"],
      ['#351C75',"深紫色 2"],
      ['#741B47',"深洋红色 2"],

      ['#5B0F00',"深浆果红色 3"],
      ['#660000',"深红色 3"],
      ['#783F04',"深橙色 3"],
      ['#7F6000',"深黄色 3"],
      ['#274E13',"深绿色 3"],
      ['#0C343D',"深青色 3"],
      ['#1C4587',"深矢车菊蓝色 3"],
      ['#073763',"深蓝色 3"],
      ['#20124D',"深紫色 3"],
      ['#4C1130',"深洋红色 3"]
  ];
  /**
   * Input property `zDepth` (`zDepth`) configuring z depth (default: `1`).
   * @zh 外层卡片的阴影层级。
   * @zh 外层卡片的阴影层级。
   */
  @Input() zDepth: zDepth = 1;
  /**
   * Input property `radius` (`number`) configuring radius (default: `1`).
   * @zh 外层卡片的圆角半径。
   * @zh 外层卡片的圆角半径。
   */
  @Input() radius = 1;
  /**
   * Input property `background` (`string`) configuring background (default: `'#fff'`).
   * @zh 外层卡片的背景颜色。
   * @zh 外层卡片的背景颜色。
   */
  @Input() background = '#fff';
  /**
   * Property `dataversion` (`number`) storing dataversion (default: `0`).
   * @zh 已同步的自定义颜色版本号，用于检测 `customService` 是否有新的自定义颜色。
   * @zh 已同步的自定义颜色版本号，用于检测 `customService` 是否有新的自定义颜色。
   */
  dataversion=0;
  /**
   * Creates an instance of `GoogColorPickerComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GoogColorPickerComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectionRef - Injected or initial change detection ref (`ChangeDetectorRef`) / 注入或传入的变更变更检测引用（`ChangeDetectorRef`）
   * @param dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   * @param customService - Injected or initial custom service (`GoogleColorService`) / 注入或传入的自定义服务（`GoogleColorService`）
   */
  constructor(
    protected changeDetectionRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private customService: GoogleColorService
  ) {
    super();
    this.customcolors=customService.customcolors;
    this.dataversion=customService.version;
  }

  /**
   * @hidden Re-renders when `customService`'s custom color list has been updated externally.
   * @zh 内部使用，当 `customService` 的自定义颜色列表被外部更新时重新渲染。
   */
  ngAfterViewChecked() {
    if(this.dataversion<this.customService.version){
      this.dataversion=this.customService.version;
      this.changeDetectionRef.detectChanges();
    }
  }
  /**
   * @hidden Applies a swatch click as the new color.
   * @zh 内部使用，将色块点击的颜色应用为新颜色。
   */
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    }else{
      this.handleChange(hex, $event);
    }
  }
  /**
   * @hidden Forwards a child component's change to `handleChange`.
   * @zh 内部使用，将子组件的变化转发给 `handleChange`。
   */
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }
  /**
   * Opens a dialog to pick and add a new custom color to `customService`.
   * @zh 打开一个对话框以选择并向 `customService` 添加一个新的自定义颜色。
   */
  addCustom($event){
    this.dialogService.open(SketchDialogComponent, {
      width: '270px',
      height: '430px',

    }).afterClosed().subscribe((result) => {
      if(result){
        this.customService.addCustom(result);
        this.handleBlockChange({hex:result,$event});
        this.changeDetectionRef.detectChanges();
      }
    });
  }
}
