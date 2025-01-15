import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    DoCheck,
    Injector,
    Input,
    OnChanges, OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatButtonToggleAppearance } from '@angular/material/button-toggle';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentBase, Dui } from '@dotos/dui/core';
import {isFunction,isObjectLike}  from 'lodash-es';

@Component({
  selector: 'toggle-button',
  styleUrls: ['./toggle-button.component.scss'],
  templateUrl: './toggle-button.component.html',
  host: {
    style: 'display:flex;padding:1px;height:100%;cursor:pointer',
    
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class ToggleButtonComponent extends ComponentBase implements OnInit,DoCheck,OnChanges {
  @Input() config: any = {};

  @Input() data: any;

  @ViewChild('childMenu', { static: true }) public childMenu: any;


  public items: Array<any> = [];

  public disableRipple: boolean = false;

  public appearance: MatButtonToggleAppearance = 'standard';

  public multiple: boolean = false;

  public name: string = '';

  public value: any ;

  public override disabled: boolean = false;

  public vertical: boolean = false;

  public declare style: any;

  public icon: any;

  public checked:boolean=false;

  public iconPosition = 'before';

  public toolTip='';

  public text='';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public change = (e) => { };

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public injector: Injector, ) {
    super(_changeDetectorRef);
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  override ngOnInit() {
    this.initFieldExpression(this.config);
    this.items.forEach(item => {
      if (item.icon) {
        if (item.icon.startsWith("SVG")) {
          item.iconType = "SVG";
          let vals = item.icon.split(":");
          item.svgIcon = vals[1];
          this.matIconRegistry.addSvgIcon(
            vals[1],
            this.domSanitizer.bypassSecurityTrustResourceUrl(vals[2])
          );
        } else if (item.icon.startsWith("FONT")) {
          item.iconType = "FONT";
          let vals = item.icon.split(":");
          item.icon = vals[1];
        }
      }
      this.initFieldExpression(item);
    });
  }
  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
    this._changeDetectorRef.markForCheck();
  }

  override init(config: any) {
    super.init(config);
    if (config && config.children) {
      this.items = config.children;
    }
    if (config && config.iconPosition) {
      this.iconPosition = config.iconPosition;
    }
    if (config && config.text) {
      this.text = config.text;
    }
    this._changeDetectorRef.detectChanges();
  }

  public hasIcon(item) {
    return item.icon != undefined;
  }

  public onClick(btn,e){
    if (e) {
      e.preventDefault();
    }
    if (!btn.disabled) {
      setTimeout(() => {
        if (btn.handler) {
          btn.handler.call(this, btn, e);
        }
      }, 50);
    }
  }
  setValue(v){
    this.value=v;
    this._changeDetectorRef.detectChanges();
  }
  override onDestroy() {
    super.onDestroy();
  }
  public override initFieldExpression(config: any) {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties as any) {
        if (typeof config.expressionProperties[key] === 'string' || isFunction(config.expressionProperties[key])) {
          config.expressionProperties[key] = {
            expression: isFunction(config.expressionProperties[key]) ? config.expressionProperties[key] : Dui.evalStringExpression(config.expressionProperties[key], ['comp', 'owner']),
            expressionValueSetter: Dui.evalExpressionValueSetter(key, ['expressionValue', 'comp', 'owner']),
          };
        }
      }
    }
    if (config.hideExpression) {
      if (typeof config.hideExpression === 'string') {
        config.hideExpression = Dui.evalStringExpression(config.hideExpression, ['comp', 'owner']);
      }
    }
    if (config.disableExpression) {
      if (typeof config.disableExpression === 'string') {
        config.disableExpression = Dui.evalStringExpression(config.disableExpression, ['comp', 'owner']);
      }
    }
  }

  public override checkExpressionChange() {
    this.checkCompExpressionChange(this, this.ownerCt);
    this.checkCompVisibilityChange(this, this.ownerCt);
    if(this.items.length!=0){
      this.items.forEach(item => {
        this.checkMenuExpressionChange(item, this.ownerCt);
        this.checkMenuVisibilityChange(item, this.ownerCt);
        this.checkMenuDisableChange(item, this.ownerCt);
      });
    }
  }

  public checkMenuExpressionChange(comp: any, owner: ComponentBase) {
    if (!comp || !comp.expressionProperties) {
      return;
    }
    const expressionProperties = comp.expressionProperties;
    for (const key in expressionProperties) {
      const expressionValue = Dui.evalExpression(
        expressionProperties[key].expression,
        { comp },
        [comp, owner],
      );
      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!isObjectLike(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        Dui.evalExpression(
          expressionProperties[key].expressionValueSetter,
          { comp },
          [expressionValue, comp, owner],
        );
      }
    }
  }
  public checkMenuVisibilityChange(comp: any, owner: ComponentBase) {
    if (!comp || !comp.hideExpression) {
      return;
    }
    const hideExpressionResult: boolean = !!Dui.evalExpression(
      comp.hideExpression,
      { comp },
      [comp, owner],
    );
    if (hideExpressionResult !== comp.hidden) {
      comp.hidden = hideExpressionResult;
    }
  }
  public checkMenuDisableChange(comp: any, owner: ComponentBase) {
    if (!comp || !comp.disableExpression) {
      return;
    }
    const disableExpressionResult: boolean = !!Dui.evalExpression(
      comp.disableExpression,
      { comp },
      [comp, owner],
    );
    if (disableExpressionResult !== comp.disable) {
      comp.disable = disableExpressionResult;
    }
  }
}
