import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, ViewChild } from '@angular/core';
import { FieldArrayType, FormBuilder, FORM_CONFIG } from '@dotos/dui/core/form';
import { ButtonComponent } from '@dotos/dui/ui/button';

@Component({
  selector: 'repeat-section',
  templateUrl: './repeat-section.type.html',
  styleUrls: ['./repeat-section.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'repeat-section' + Math.random().toString(36).substring(2, 15),
  },
})
export class RepeatTypeComponent extends FieldArrayType {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public change(val) { };

  @ViewChild(ButtonComponent) addButton: ButtonComponent;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(protected _changeDetectorRef: ChangeDetectorRef,@Inject(FORM_CONFIG) @Optional() builder?: FormBuilder) {
    super();
  }

  public override init(conf?): void {
    if (conf.change) {
      this.change = conf.change;
    }
  }

  override add(model) {
    super.add(undefined, model);
    this.change({ type: 'add', data: model });
    this._changeDetectorRef.markForCheck();
  }
  setName(i,name){
    this.model[i].name =name;
    this._changeDetectorRef.markForCheck();
  }
  getTitle(i) {
    return this.model[i].name ? this.model[i].name : this.model[i].title;
  }
  override remove(i: number) {
    this.change({ type: 'delete', index: i });
    super.remove(i);
    this._changeDetectorRef.markForCheck();
  }
}
