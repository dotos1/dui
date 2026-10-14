import { Platform } from '@angular/cdk/platform';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, HostListener, Injector, Input, OnChanges, Renderer2, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Container } from '@dotos/dui/container';
import { ComponentBase, Dui } from '@dotos/dui/core';
import { isArray, isObjectLike, isString } from 'lodash-es';

@Component({
  selector: 'dui-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

export class DuiToolbarComponent extends Container implements OnChanges, AfterContentInit {

  @Input() config: any = {};

  @Input() height: number = 40;

  get heightStyle() {
    if (this.vertical) {
      return {}
    } else {
      return {
        height: this.height + 'px'
      }
    }

  }

  private activeMenuBtn: any;

  public color = 'primary';

  public override style: any;

  public vertical: boolean = false;

  @ViewChild('toolbar', { read: ViewContainerRef, static: true }) public override viewContainer: ViewContainerRef;

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  constructor(public _element: ElementRef,
    protected renderer: Renderer2,
    public _platform: Platform,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,) {
    super(resolver, injector, detectRef);
  }

  refresh() {
    this.detectRef.markForCheck();
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  override init(config: any) {
    if (Array.isArray(config)) {
      config = { items: config };
    } else {
      config = Dui.apply({}, config);
      if (config.buttons) {
        config.items = config.buttons;
      }
    }
    super.init(config);
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    let items = this.items;
    if (items) {
      delete this.items;
      this.add(items);
    }
  }

  getClassNames() {
    return this.vertical ? 'toolbar-vertical' : 'toolbar-horizontal';
  }

  override ngAfterContentInit() {
    super.ngAfterContentChecked();
  }

  override lookupComponent(c) {
    if (isString(c)) {
      if (c == '-') {
        c = this.createComponent({
          xtype: 'divider',
          vertical: true
        });
      } else {
        if (c == ' ') {
          c = this.createComponent({
            xtype: 'tbspacer',
            width: 2
          });
        } else {
          if (c == '->') {
            c = this.createComponent({
              xtype: 'tbfill'
            });
          } else {
            c = this.createComponent({
              xtype: 'tbtext',
              text: c
            });
          }
        }
      }
      this.applyDefaults(c);
    } else {
      if (c.isField || c.render) {
        c = this.createComponent(c);
      } else {
        if (c.tag) {
          c = new MenuItem(this.detectRef);
          c.init({ autoEl: c });
        } else {
          if (c.tagName) {
            c = new MenuItem(this.detectRef);
            c.init({ el: c });
          } else {
            if (isObjectLike(c)) {
              c = c.xtype ? this.createComponent(c) : this.constructButton(c);
            }
          }
        }
      }
    }
    return c;
  }

  addSeparator(): MenuItem {
    let comp = this.createComponent({
      xtype: 'separator',
      vertical: true
    });
    return this.add(comp);
  }

  addSpacer(): Spacer {
    let comp = this.createComponent({
      xtype: 'spacer',
      width: 2
    });
    return this.add(comp);
  }

  addFill() {
    let comp = this.createComponent({
      xtype: 'tbfill'
    });
    this.add(comp);
  }

  addText(text: string): MenuItem {
    let comp = this.createComponent({
      xtype: 'tbtext',
      text: text
    });
    return this.add(comp);
  }

  addButton(config: any): any {
    if (isArray(config)) {
      let buttons = [];
      for (let i = 0, len = config.length; i < len; i++) {
        buttons.push(this.addButton(config[i]));
      }
      return buttons;
    }
    return this.add(this.constructButton(config));
  }


  addItem(item: MenuItem): MenuItem {
    return this.add(item);
  }

  addField(field: any): MenuItem {
    return this.add(field);
  }

  insertButton(index: number, item: any): any {
    if (isArray(item)) {
      let buttons = [];
      for (let i = 0, len = item.length; i < len; i++) {
        buttons.push(this.insertButton(index + i, item[i]));
      }
      return buttons;
    }
    return super.insert(index, item);
  }

  // private
  constructButton(item) {
    let b = item.events ? item : this.createComponent(item);
    return b;
  }

  // private
  override onAdd(c) {
    super.onAdd(c);
    if (this.disabled) {
      c.disable();
    }
  }

  // private
  override onRemove(c) {
    super.onRemove();
    if (c == this.activeMenuBtn) {
      delete this.activeMenuBtn;
    }
  }

  // private
  onDisable() {
    this.items.each(
      function (item) {
        if (item.disable) {
          item.disable();
        }
      });
  }

  // private
  onEnable() {
    this.items.each(
      function (item) {
        if (item.enable) {
          item.enable();
        }
      });
  }

  // private
  onButtonTriggerOver(btn) {
    if (this.activeMenuBtn && this.activeMenuBtn != btn) {
      this.activeMenuBtn.hideMenu();
      btn.showMenu();
      this.activeMenuBtn = btn;
    }
  }

  // private
  onButtonMenuShow(btn) {
    this.activeMenuBtn = btn;
  }

  // private
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onButtonMenuHide(btn) {
    delete this.activeMenuBtn;
  }
}


export class MenuItem extends ComponentBase {
  public hideParent = true;
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    //    this.el = _element.nativeElement;
  }
  override init(config) {
    super.init(config)
  };

  public focus() { return this };
}


@Component({
  selector: 'divider',
  template: "<mat-divider [vertical]='vertical' [ngStyle]='style'></mat-divider>",
  styleUrls: ['./separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Separator extends MenuItem {
  el: any;
  vertical: boolean = true;
  public override style: any = {};
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  override init(config: any) {
    super.init(config);
  }
}

@Component({
  selector: 'tbspacer',
  template: `
        <div  [style.width]="config.width + 'px'" ></div>
     `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spacer extends MenuItem {
  el: any;
  config: any;
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  override init(config: any) {
    this.config = config;
    super.init(config);
  }
}

@Component({
  selector: 'tbfill',
  template: '<span></span>',
  styles: [`
       :host {
          flex: 1 1 auto;
          padding-left:20px;
          padding-right:20px;
        }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Fill extends Spacer {
  constructor(public override detectRef: ChangeDetectorRef) {
    super(detectRef);
  }
  override init(config: any) {
    super.init(config);
  }
  public isFill = true;
}

@Component({
  selector: 'tbtext',
  template: "<span>{{text}}</span>",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextItem extends MenuItem {
  text: any;
  el: any;
  constructor(private _element: ElementRef, public override detectRef: ChangeDetectorRef) {
    super(detectRef);
    this.el = _element.nativeElement;
  }
  override init(config: any) {
    super.init(isString(config) ? { text: config } : config);
  }
  setText(t: string) {
    this.text = t;
  }
}
