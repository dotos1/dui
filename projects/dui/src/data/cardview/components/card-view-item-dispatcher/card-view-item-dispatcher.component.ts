
import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CardViewItem } from '../../interfaces';
import { CardItemTypeService } from '../../services';
import { CardViewContentProxyDirective } from '../../directives';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';

@Component({
  selector: 'dui-card-view-item-dispatcher',
  template: '<ng-template dui-card-view-content-proxy></ng-template>'
})
export class CardViewItemDispatcherComponent implements OnChanges {
  @Input()
  property: CardViewItem;

  @Input()
  editable: boolean;

  @Input()
  displayEmpty: boolean = true;

  @Input()
  displayNoneOption: boolean = true;

  @Input()
  displayClearAction: boolean = true;

  @Input()
  copyToClipboardAction: boolean = true;

  @Input()
  useChipsForMultiValueProperty: boolean = true;

  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;

  @ViewChild(CardViewContentProxyDirective, { static: true })
  private content: CardViewContentProxyDirective;

  private loaded: boolean = false;
  private componentReference: any = null;

  public ngOnInit;
  public ngDoCheck;

  constructor(private cardItemTypeService: CardItemTypeService,
    private resolver: ComponentFactoryResolver) {
    const dynamicLifeCycleMethods = [
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngOnDestroy'
    ];

    dynamicLifeCycleMethods.forEach((method) => {
      this[method] = this.proxy.bind(this, method);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.loaded) {
      this.loadComponent();
      this.loaded = true;
    }

    Object.keys(changes)
      .map((changeName) => [changeName, changes[changeName]])
      //@ts-ignore
      .forEach(([inputParamName, simpleChange]: [string, SimpleChange]) => {
        this.componentReference.instance[inputParamName] = simpleChange.currentValue;
      });

    this.proxy('ngOnChanges', changes);
  }

  private loadComponent() {
    const factoryClass = this.cardItemTypeService.resolveComponentType(this.property);

    const factory = this.resolver.resolveComponentFactory(factoryClass);
    this.componentReference = this.content.viewContainerRef.createComponent(factory);

    this.componentReference.instance.editable = this.editable;
    this.componentReference.instance.property = this.property;
    this.componentReference.instance.displayEmpty = this.displayEmpty;
    this.componentReference.instance.displayNoneOption = this.displayNoneOption;
    this.componentReference.instance.displayClearAction = this.displayClearAction;
    this.componentReference.instance.copyToClipboardAction = this.copyToClipboardAction;
    this.componentReference.instance.useChipsForMultiValueProperty = this.useChipsForMultiValueProperty;
    this.componentReference.instance.multiValueSeparator = this.multiValueSeparator;
  }

  private proxy(methodName, ...args) {
    if (this.componentReference.instance[methodName]) {
      this.componentReference.instance[methodName].apply(this.componentReference.instance, args);
    }
  }
}
