import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatField } from '@dotos/dui/form';
import { FieldConfig } from '@dotos/dui/core/form';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@dotos/dui/i18n';
import { ThemeService, matColor } from '@dotos/dui/theme';
import { DotosConfigService } from '@dotos/dui/theme';
import { LocalStorageService } from '@dotos/dui/core/storage';
import * as _ from 'lodash';

export const PRE_DEFINED_THEMES = [
  { value: '0,0,0' },
  { value: '1,1,1' },
  { value: '5,5,5' },
  { value: '20,5,10' },
  { value: '15,3,3' },
  { value: '20,3,3,3,3' },
  { value: '12,3,3' },
];
@Component({
  selector: 'line-style-field',
  templateUrl: './linestyle.html',
  styleUrls: ['./linestyle.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'flex:1;'
  },
})
export class LineStyleSelector<F extends FieldConfig = FieldConfig>
  extends MatField
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChildren('linestyle') lineCavases: QueryList<ElementRef>;

  @ViewChild('lineStyleTrigger')
  private lineStyleTriggerEl: ElementRef;
  

  public styleOptions = PRE_DEFINED_THEMES;

  public inputValue = [];

  @Input()
  override set field(f: F | any) {
    this._field = f;
    if (this._field.formControl instanceof FormControl) {
      this._field.formControl.registerOnChange((value) => {
        if (value != null) {
          this.setValue(value);
        }
      });
    }
  }
  override get field() {
    return this._field || {};
  }
  private onDestroy$ = new Subject<void>();
  private lineColor = 'rgba(0, 0, 0, 1.0)';

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override translate: TranslateService,
    protected themeService: ThemeService,
    public localStore: LocalStorageService,
    protected dotosConfigService: DotosConfigService
  ) {
    super(translate);
  }
  override ngOnInit() {
    super.ngOnInit();
    this.dotosConfigService.config
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        let theme = this.themeService.getTheme();
        this.lineColor = matColor(theme.foreground, 'text');
      });
    const config: any = this.localStore.get('dotosConfig');
    this.dotosConfigService.config = config;
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setValue(this.inputValue);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  openedChange() {
    for (let i = 0; i < PRE_DEFINED_THEMES.length; i++) {
      this.drawDashedLine(i, PRE_DEFINED_THEMES[i].value);
    }
  }

  drawDashedLine(index, value) {
    let dashs = value.split(',');
    let canvas = this.lineCavases.get(index).nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = this.lineColor;
    ctx.beginPath();
    ctx.setLineDash(dashs);
    ctx.moveTo(2, canvas.height/2-1);
    ctx.lineTo(canvas.width-2, canvas.height/2-1);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  change($event: any) {
    let dashs = $event.value;
    this.setValue(dashs);
    if (this.field.change) {
      this.field.change(this, $event);
    }
  }
  setValue(value) {
    let dashs = [];
    if(_.isString(value)){
      dashs= value.split(',');
    }
    let canvas = this.lineStyleTriggerEl.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = this.lineColor;

    ctx.beginPath();
    ctx.setLineDash(dashs);
    ctx.moveTo(0, canvas.height/2-1);
    ctx.lineTo(canvas.width-5, canvas.height/2-1);
    ctx.lineWidth = 2;
    ctx.stroke();

    this._changeDetectorRef.detectChanges();
    this.inputValue = value;
    this.field.inputValue = value;
    this.field.formControl.value = value;
  }
  compareWith(o1: any, o2: any) {
    return o1 === o2;
  }
}
