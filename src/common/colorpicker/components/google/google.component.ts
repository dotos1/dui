
import {
  AfterViewChecked,
  ChangeDetectionStrategy,  ChangeDetectorRef,  Component,  Input, ViewEncapsulation,
} from '@angular/core';
import {  ColorWrap,  isValidHex,  zDepth,} from '@dotos/dui/common/colorpicker/common';
import { TriggerPopup } from '@dotos/dui/common/trigger';
import { SketchDialogComponent } from '../sketch/sketch-dialog.component';
import { DialogService } from '@dotos/dui/common/dialogs';
import { GoogleColorService } from './google-color.services';

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
})
export class GoogColorPickerComponent extends ColorWrap implements TriggerPopup,AfterViewChecked {
  customcolors = [
    '#cf1717'
  ]
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
  @Input() zDepth: zDepth = 1;
  @Input() radius = 1;
  @Input() background = '#fff';
  dataversion=0;
  constructor(
    protected changeDetectionRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private customService: GoogleColorService
  ) {
    super();
    this.customcolors=customService.customcolors;
    this.dataversion=customService.version;
  }

  ngAfterViewChecked() {
    if(this.dataversion<this.customService.version){
      this.dataversion=this.customService.version;
      this.changeDetectionRef.detectChanges();
    }
  }
  handleBlockChange({ hex, $event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    }else{
      this.handleChange(hex, $event);
    }
  }
  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }
  addCustom($event){
    this.dialogService.open(SketchDialogComponent, {
      width: '270px',
      height: '430px',

    }).afterClosed().subscribe((result:any) => {
      if(result){
        this.customService.addCustom(result);
        this.handleBlockChange({hex:result,$event});
        this.changeDetectionRef.detectChanges();
      }
    });
  }
}
