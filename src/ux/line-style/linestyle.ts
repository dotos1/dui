import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldConfig } from '@dotos/dui/core/form';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { MatField } from '@dotos/dui/form';
import { DotosConfigService, ThemeService, matColor } from '@dotos/dui/theme';
import { TranslateService } from '@dotos/dui/translator';
import {isString}  from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    style: 'flex:1;',
    
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

  private formControlUnbind?: () => void;

  @Input()
  override set field(f: F | any) {
    this._field = f;
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
    this.unbindFormControl();
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
    if(isString(value)){
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
