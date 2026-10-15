import { Component, OnInit, ViewChild,  Input, ElementRef,  ViewEncapsulation, AfterViewInit, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, Renderer2, ComponentFactoryResolver, Injector } from '@angular/core';
import {  MatSelectChange } from '@angular/material/select';
import { MatField } from '@dotos/dui/form';

import { FieldConfig } from '@dotos/dui/core/form';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@dotos/dui/translator';
import { DotosConfigService } from '@dotos/dui/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService, matColor } from '@dotos/dui/theme';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { Router } from '@angular/router';

const PRE_DEFINED_THEMES = [
  { 'value': '0.5' },
  { 'value': '1' },
  { 'value': '1.5'},
  { 'value': '2'},
  { 'value': '2.5' },
  { 'value': '3' },
  { 'value': '3.5'},
  { 'value': '4' },
  { 'value': '5' },
];

@Component({
  selector: 'line-size-field',
  templateUrl: './linesize.html',
  styleUrls: ['./linestyle.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'flex:1;',
    
  },
})
export class LineSizeSelector<F extends FieldConfig = FieldConfig> extends MatField
 implements OnInit,OnDestroy,AfterViewInit{

  public inputValue:string = '1';

  @ViewChildren('linesize') lineCavases: QueryList<ElementRef>;

  @ViewChild('lineSizeTrigger')
  private lineSizeTriggerEl: ElementRef;
  

  private formControlUnbind?: () => void;

  @Input()
  override set field(f: F | any) {
    this._field = f;
    if (f?.defaultValue) {
      this.inputValue = f.defaultValue;
    }
    this.unbindFormControl();
    if (this._field?.formControl instanceof FormControl) {
      // 用 registerOnChange 而不是 valueChanges(b8c5e5c 复核):外部用
      // setValue(v, { emitEvent: false }) 回填时 valueChanges 不发,线型预览就
      // 停在旧值;registerOnChange 的回调只看 emitModelToViewChange,照样重绘。
      // 换 field 或销毁时用 _unregisterOnChange 解绑(Angular 内部方法,
      // @angular/forms 的 cleanUpControl 也是这么解的),否则回调挂在长寿的
      // FormControl 上,组件销毁后还会被调用。
      const control = this._field.formControl as FormControl;
      const onChange = (value) => {
        if (value != null) {
          this.setValue(value);
        }
      };
      control.registerOnChange(onChange);
      this.formControlUnbind = () => (control as any)._unregisterOnChange?.(onChange);
    }
  }

  private unbindFormControl() {
    this.formControlUnbind?.();
    this.formControlUnbind = undefined;
  }
  override get field() {
    return this._field || {};
 }
  private onDestroy$ = new Subject<void>();
  private lineColor = 'rgba(0, 0, 0, 1.0)';
  public sizeOptions = [...PRE_DEFINED_THEMES];

  constructor(
    protected dotosConfigService: DotosConfigService,
    protected override translate: TranslateService,
    public  _element: ElementRef,
    public  renderer: Renderer2,
    public router: Router,
    public themeService: ThemeService,
    public localStore: LocalStorageService,
    public _changeDetectorRef: ChangeDetectorRef,
    public  resolver: ComponentFactoryResolver,
    public  injector: Injector,
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
    this.unbindFormControl();
    super.ngOnDestroy();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

 

  openedChange() {
    for (let i = 0; i < this.sizeOptions.length; i++) {
      this.drawLine(i, this.sizeOptions[i].value);
    }
  }

  drawLine(index, value) {
    let canvas = this.lineCavases.get(index).nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = this.lineColor;
    ctx.beginPath();
    ctx.moveTo(2, canvas.height/2-value/2);
    ctx.lineTo(canvas.width-2, canvas.height/2-value/2);
    ctx.lineWidth = value;
    ctx.stroke();
  }

  change($event: MatSelectChange) {
    this.setValue($event.value)
    if (this.field.change) {
      this.field.change(this, $event);
    }
  }

  /**
   * 当前值不在预设里（如道模板里的格线线宽 0.8 / 0.4）时补一个选项。
   *
   * <p>mat-select 找不到与值匹配的选项就什么都不显示 —— 控件是空白的，看上去像没有缺省值，
   * 其实值在，只是没有对应的选项可显示。
   */
  private ensureOption(w: number) {
    if (isNaN(w) || this.sizeOptions.some((o) => parseFloat(o.value) === w)) {
      return;
    }
    this.sizeOptions = [...this.sizeOptions, { value: String(w) }]
      .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
    this._changeDetectorRef.detectChanges();
  }

  setValue(value) {
    let w = parseFloat(value);
    this.ensureOption(w);
    let canvas = this.lineSizeTriggerEl.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = this.lineColor;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2-w/2);
    ctx.lineTo(canvas.width-5, canvas.height/2-w/2);
    ctx.lineWidth = w;
    ctx.stroke();
    this._changeDetectorRef.detectChanges();
    this.inputValue = value;
    this.field.inputValue = value;
    this.field.formControl.value = w;
  }

  compareWith(o1: any, o2: any) {
    return o1+"" === o2+"";
  }
}
