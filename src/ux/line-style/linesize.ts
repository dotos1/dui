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
  

  @Input()
  override set field(f: F | any) {
    this._field = f;
    if (f.defaultValue) {
      this.inputValue = f.defaultValue;
    }
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
  public sizeOptions = PRE_DEFINED_THEMES;

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

  setValue(value) {
    let w = parseFloat(value);
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
