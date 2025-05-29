
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { ComponentBase } from '@dotos/dui/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AnimationMode, Direction } from './speed-dial';
@Component({
  selector: 'speeddial',
  templateUrl: './speeddial.component.html',
  host: {
    '[style.display]': 'display',
    hostID: 'dui-speeddial' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.Default,

})
export class ExtSpeedDialComponent extends ComponentBase implements OnInit,OnChanges,DoCheck {

  public state: BehaviorSubject<any>;

  @ViewChild('container', { read: ViewContainerRef, static: true }) public _container: ViewContainerRef;

  @Input() config: any = {};
  @Input() icon: string;
  @Input() title: string;

  @Input() direction:Direction ='up';

  @Output() events: Subject<any> = new Subject();
  @Input() color: string;
  @Input() override disabled: boolean = false;
  @Input() spin = false;
  @Input() type = 'mat-fab';
  @Input() animationMode:AnimationMode = 'fling';
  @Input() items = [];
  @Input() disableRipple: boolean = false;
  @Input() toolTip: string;

  public override style: any = { color: 'rgba(255,255,255,0.84)' };

  public open = false;

  private _fixed = false;

  get fixed(): boolean {
    return this._fixed;
  }

  set fixed(fixed: boolean) {
    this._fixed = fixed;
    if (this._fixed) {
      this.open = true;
    }
  }

  public isFab: boolean = false;

  public iconType: string = '';

  public svgIcon: string = '';

  private rendered: boolean = false;

  constructor(
    public elementref: ElementRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }

  override ngOnInit() {
    this.items.forEach(item => {
      if (!item.handler) {
        item.handler = () => { };
      }
      this.initFieldExpression(item);
    });
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  override ngDoCheck() {
    if (this.rendered) {
      this.checkExpressionChange();
      this.detectRef.markForCheck();
    }
  }

  override init(config: any) {
    super.init(config);
    if (this.hidden) {
      this.display = 'none';
    }
    this.rendered = true;
    this.detectRef.detectChanges();
    this.checkExpressionChange();
  }
}
