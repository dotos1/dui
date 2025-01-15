import {
  Component, Input, ViewChild, ChangeDetectionStrategy,
  SimpleChanges, ChangeDetectorRef, ComponentFactoryResolver, Injector, OnInit, OnChanges
} from '@angular/core';
import { DuiCardComponent } from '@dotos/dui/container';
import { FormComponent } from '@dotos/dui/form';
import { TranslateService } from '@dotos/dui/translator';

@Component({
  selector: 'form-card',
  styleUrls: ['./form.card.scss'],
  templateUrl: './form.card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})

export class FormCard extends DuiCardComponent implements OnInit,OnChanges {

  @Input() override config: any = {};


  @ViewChild(FormComponent, { static: true })
  formComponent: FormComponent;


  public hideHead: boolean = false;

  public override layout = 'form';

  constructor(
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    protected _changeDetectorRef: ChangeDetectorRef,
    public override translateService: TranslateService) {
    super(resolver, injector, _changeDetectorRef, translateService);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
  override init(config: any) {
    super.init(config);
    this.initItems();
  }

  /**
   * Provides access to the {@link Ext.form.BasicForm Form} which this Panel contains.
   * returnwhich this Panel contains.
   */
  getForm(): FormComponent {
    return this.formComponent;
  }

  // private
  override beforeDestroy() {
    //  this.formComponent.destroy(true);
    super.beforeDestroy();
  }

  // Determine if a Component is usable as a form Field.
  isField(c) {
    return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
  }

}
