import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ComponentBase } from '@dotos/dui/core';
import * as _ from 'lodash';

@Component({
  selector: 'fabbutton',
  styleUrls: ['./fab.button.scss'],
  templateUrl: './fab.button.html',
  host: {
    '[style.display]': 'display',
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class FabButtonComponent extends ComponentBase implements OnChanges,DoCheck{

  @ViewChild(MatTooltip)  matTooltip: MatTooltip;

  @Input() config: any = {};

  @Input() public type = 'mat-fab';

  @Input() public text: any;

  @Input()  public disableRipple: boolean = false;

  @Input() public color: string = '';

  @Input()  public icon: any;

  @Output() click = new EventEmitter<any>();

  public handler: any;

  public override style: any = { color: 'rgba(255,255,255,0.84)' };

  private rendered: boolean = false;

  public items: Array<any> = [];


  constructor(
    public override detectRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,) {
    super(detectRef);
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  override ngDoCheck() {
    if (this.rendered) {
      this.checkExpressionChange();
    }
  }

  override init(config: any) {
    super.init(config);
    this.rendered = true;
    if (this.hidden) {
      this.display = 'none';
    }
    if (config && config.children) {
      this.items = config.children;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (_.isString(this.items[i]) && this.items[i] === '-') {
        this.items[i] = { type: 'divider' };
      }
      if (!this.items[i].xtype) {
        this.items[i].xtype = 'menuitem';
      }
    }
    this.detectRef.detectChanges();
    this.checkExpressionChange();
  }

  public hasIcon() {
    return this.icon != undefined;
  }


  setHandler(handler: Function): void {
    this.handler = handler;
  }

  setIcon(icon: string): void {
    this.icon = icon;
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
      if (this.matTooltip.message!='') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide();
      }
    }
    if (!this.disabled) {
      setTimeout(() => {
        this.trigger('click', { button: this, event: e });
        if (this.handler) {
          this.handler.call(this, this, e);
        }
        this.click.emit(e);
      }, 50);
    }
  }
}
