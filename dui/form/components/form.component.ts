import {
  Component,
  ChangeDetectionStrategy,
  DoCheck,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, FormArray } from '@angular/forms';
import { switchMap, filter, take } from 'rxjs/operators';
import * as _moment from 'moment';
import * as _ from 'lodash';

import { Dui } from '@dotos/dui/core';
import { FieldConfig, FormOptions, FieldConfigCache } from '@dotos/dui/core/form';
import { FormBuilder } from '@dotos/dui/core/form';
import { FormConfig } from '@dotos/dui/core/form';
import { assignModelValue, clone, getKeyPath, isUndefined } from '@dotos/dui/core/form';
import { clearControl } from '@dotos/dui/core/form';
import { Load, Submit, FormAction } from '../action/index';

const moment = _moment;
@Component({
  selector: 'dui-form',
  templateUrl: './form.component.html',
  providers: [FormBuilder],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements DoCheck, OnChanges, OnDestroy {

  @Input() config: any = {};

  @Input()
  set form(form: FormGroup | FormArray) {
    this.field.form = form;
  }
  get form() {
    return this.field.form as FormGroup | FormArray;
  }

  @Input()
  set model(model: any) {
    this.setField({ model });
  }
  get model() {
    return this.field.model;
  }

  @Input()
  set items(fieldGroup: FieldConfig[]) {
    this.setField({ fieldGroup });
  }
  get items() {
    return this.field.fieldGroup;
  }

  @Input()
  set options(option: FormOptions) {
    this.setField({ option });
  }
  get options() {
    return this.field.option;
  }

  @Output() modelChange = new EventEmitter<any>();

  @Output() formInit = new EventEmitter<any>();

  private field: FieldConfigCache = {};
  private _modelChangeValue: any = {};
  private valueChangesUnsubscribe = () => {};

  @Input() isRoot = true;

  public method: string = 'POST';

  public fileUpload: boolean = false;

  private enctype: string = 'application/x-www-form-urlencoded';

  constructor(
    private builder: FormBuilder,
    private formConfig: FormConfig,
    private ngZone: NgZone,
    public detectRef: ChangeDetectorRef,
    private loadService: Load,
    private submitService: Submit
  ) {

  }


  ngDoCheck() {
    if (this.formConfig.extras){
      if (this.formConfig.extras.checkExpressionOn === 'changeDetectionCheck') {
        this.checkExpressionChange();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      Dui.apply(this, changes['config'].currentValue);
      this.method = this.method || 'POST';
      if (this.fileUpload) {
        this.enctype = 'multipart/form-data';
      }
      this.buildForm();
    }
    if (changes['items'] && this.form) {
      clearControl(this.form);
    }
    if (changes['items'] || changes['form'] || (changes['model'] && this._modelChangeValue !== changes['model'].currentValue)) {
      this.buildForm();
    }
  }

  ngOnDestroy() {
    this.valueChangesUnsubscribe();
  }

  private checkExpressionChange() {

    if(this.field.option.checkExpressions){
      this.field.option.checkExpressions(this.field);
    }
  }

  private valueChanges() {
    this.valueChangesUnsubscribe();
    const sub = this.field.option.fieldChanges
      .pipe(
        filter(({ type }) => type === 'valueChanges'),
        switchMap(() => this.ngZone.onStable.asObservable().pipe(take(1))),
      )
      .subscribe(() =>
        this.ngZone.runGuarded(() => {
          this.checkExpressionChange();
          this.modelChange.emit((this._modelChangeValue = clone(this.model)));
        }),
      );
    return () => sub.unsubscribe();
  }

  private setField(field: FieldConfigCache) {
    this.field = {
      ...this.field,
      ...(this.formConfig.extras.immutable ? clone(field) : field),
    };
  }

  buildForm() {
    this.valueChangesUnsubscribe();
    this.builder.build(this.field);
    this.valueChangesUnsubscribe = this.valueChanges();
    this.formInit.emit();
    this.detectRef.detectChanges();
  }

  public init(config: any): void {
    this.config = config || {};
    if (this.config.items) {
      Dui.apply(this, config);
      this.method = this.method || 'POST';
      if (this.fileUpload) {
        this.enctype = 'multipart/form-data';
      }
      this.buildForm();
      this.detectRef.detectChanges();
    }
  }

  public getStyle(field) {
    return {
      'display': field.hidden ? "none" : ""
    };
  }
  changeModel({ name, value, field }: { name: string, value: any, field: FieldConfig }|any) {
    if (
      value == null
      && field['autoClear']
      && !field.formControl.parent
    ) {
      const paths = name.split('.');
      const k = paths.pop();
      const m = paths.reduce((model, path) => model[path] || {}, this.model);
      delete m[k];
    } else {
      assignModelValue(this.model, name.split('.'), value);
    }
    this.modelChange.emit(this.model);
    this.detectRef.detectChanges();
  }

  //======================
  rebuildForm() {
    this.model = this.model || {};
    this.form = new FormGroup({});
    this.valueChangesUnsubscribe();
    this.builder.build(this.field);
    this.valueChangesUnsubscribe = this.valueChanges();
  }

  submit(option: any):Promise<any> {
    option = option || {};
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", this.enctype);
    option['headers'] = headers;
    return this.doAction('submit', option);
  }

  load(option: any):Promise<any>  {
    const loadAction = 'load';
    return this.doAction(loadAction, option);
  }

  doAction(action, option: any):Promise<any>  {
    if (_.isString(action)) {
      if (action === 'load') {
        action = this.loadService.init(this, option);
      } else if (action === 'submit') {
        action = this.submitService.init(this, option);
      }
    }
    return action.run(action);
  }

  updateField(fields: any) {
    this.items.forEach((field) => {
      if (field.fieldGroup) {
        field.fieldGroup.forEach((f) => {
          Object.keys(fields).forEach(k => {
            if (f.name == k) {
              Object.assign(f, fields[k]);
            }
          });
        })
      } else {
        Object.keys(fields).forEach(k => {
          if (field.name == k) {
            Object.assign(field, fields[k]);
          }
        });
      }
    });
    this.detectRef.detectChanges();
  }
  getValues(): any {
    let body: HttpParams = new HttpParams();
    let fieldFun = (field) => {
      if (field.name) {
        if (this.model[field.name] != undefined) {
          if (_.isDate(this.model[field.name])) {
            this.model[field.name] = moment(this.model[field.name]).format('YYYY-MM-DD HH:mm:ss');
          } else if (this.model[field.name] instanceof moment) {
            this.model[field.name] = this.model[field.name].format('YYYY-MM-DD HH:mm:ss');
          }
          if (_.isObjectLike(this.model[field.name])) {
            if(this.model[field.name].text){
              body = body.append(field.name, this.model[field.name].value);
            }else{
              body = body.append(field.name, this.model[field.name]);
            }
          } else {
            body = body.append(field.name, this.model[field.name]);
          }
        } else {
          body = body.append(field.name, '');
        }
      }
    };
    let groupFun = (field) => {
      field.fieldGroup.forEach((f1) => {
        if (f1.fieldGroup)
          groupFun(f1);
        else
          fieldFun(f1);
      });
    };
    _.each(this.config.items, (field) => {
      if (field.fieldGroup) {
        groupFun(field);
      } else {
        fieldFun(field);
      }
    });
    return body;
  }

  setValues(values: Array<any> | any): void {
    if (this.config == undefined || this.config.items == undefined) {
      return;
    }
    _.each(this.config.items, (field) => {
      delete field.inputValue;
      field.formControl.reset();
      if(field.defaultValue!=undefined){
        field.formControl.patchValue(field.defaultValue);
      }
    });
    let fieldFun = (field: FieldConfig, model) => {
      field.formControl.reset();
      if ( _.isObjectLike(model)) {
        if(model.text && model.value){
          if (field.xtype == 'select-field' && field.remote == true) {
            let opts = [];
            opts.push(model);
            field.options = opts;
            field['loaded'] = false;
          } else if (field.xtype == 'select-field') {
            let opts = [];
            opts.push(model);
            field.options = opts;
            field.formControl.patchValue(model.value);
            field.inputValue = model.text;
          }else if(field.xtype == 'trigger-field'){
            field.inputValue = model.text;
            field.formControl.patchValue(model.value);
          }else{
            field.formControl.patchValue(model);
            field.inputValue = model.text;
          }
        }else if(model.value){
          if (model!=undefined) {
            field.inputValue = model;
          }
          field.formControl.patchValue(model);
        }else{
          field.formControl.patchValue(model);
        }
      } else {
        if (model!=undefined) {
          field.inputValue = model;
        }
        field.formControl.patchValue(model);
      }
    };
    let groupFun = (field, model) => {
      if (Array.isArray(model)) {
        assignModelValue(field.parent.model, getKeyPath(field), []);
        for (let i = 0; i < model.length; i++) {
          field.model.splice(i, 0, model[i] ? clone(model[i]) : undefined);
          (<any>field.option)._buildForm(true);
          field.formControl.markAsDirty();
          field.formControl.updateValueAndValidity({ emitEvent: true })
        }
      } else {
        field.fieldGroup.forEach((f) => {
          let innermodel = model ? model[f.name] : undefined;//控件数据在内层
          if (f.fieldGroup){
            groupFun(f, innermodel);
          }
          else
            fieldFun(f, innermodel);
        });
      }
    };
    _.each(values, (model, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.config.items.forEach((field, index, array) => {
        if (field.fieldGroup) {
          if (field.name) {
            if (field.name == key) {
              groupFun(field, model);
            }
          } else {
            field.fieldGroup.forEach((f) => {
              if (f.name == key) {
                fieldFun(f, model);
              }
            })
          }
        } else {
          if (field.name == key) {
            fieldFun(field, model);
          }
        }
      });
    });
    this.detectRef.detectChanges();
  }
  getFieldValue(key: string): any {
    return this.getValues().get(key);
  }

  setFieldValue(key: string, model: any): void {

    if(this.config&&this.config.items){
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  this.config.items.forEach((field, index, array) => {
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => {
        if (f.name == key) {
          if (f.xtype == 'select-field') {
            if(f.remote == true){
              let opts = [];
              opts.push(model);
              f.options = opts;
              f.loaded = false;
            }
              f.formControl.patchValue(model.value);
              f.model[key]=model.value;
          } else {
            f.formControl.patchValue(model);
            // if(!f.model){
            //   f.model={};
            // }
            // f.model[key]=model;
            if(model.text){
              f.inputValue = model.text;
            }
          }
        }
      })
    } else {
      if (field.name == key) {
        if (_.isObjectLike(model) && model.text && model.value) {
          field.inputValue = model.text;
          field.formControl.patchValue(model.value);
          field.model[key]=model.value;
        } else {
          field.formControl.patchValue(model);
          field.model[key]=model;
        }
      }
    }
  });
    }
  }

  resetAllFields(){
    if (this.config == undefined || this.config.items == undefined) {
      return;
    }
    let resetField = (field) => {
      delete field.inputValue
      field.formControl.reset();
      if(field.defaultValue!=undefined){
        field.formControl.patchValue(field.defaultValue);
      }
      if (field.fieldGroup) {
        field.fieldGroup.forEach((f) => {
          resetField(f);
        });
      }
    };
    _.each(this.config.items, (field) => {
      resetField(field);
    });
  }

  refresh() {
    this.detectRef.detectChanges();
  }

  clearInvalid(): void {
    this.form.markAsPristine();
  }

  get valid(): boolean {
    if (this.form) {
      return this.form.valid;
    }
    return false;
  }

  get value(): any {
    return this.model;
  }

  set value(v) {
    let val = {};
    if(this.config.items){
      _.each(this.config.items, (field) => {
        delete field.inputValue
      });
      _.each(v, (model, key) => {
        if (_.isObjectLike(model) && model.text && model.value) {
          this.config.items.forEach((field) => {
            if (field.name == key) {
              if (field.xtype == 'select-field' ) {
                if(field.remote == true){
                  let opts = [];
                  opts.push(model);
                  field.options = opts;
                  field.loaded = false;
                }
                val[key] = model.value;
                // val[key] = model;
                 field.inputValue = model.text;
              } else {
                val[key] = model;
                field.inputValue = model.text;
              }
            }
          });
        } else if (_.isString(model)) {
          val[key] = model;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.config.items.forEach((field, index, array) => {
            if (field.name == key) {
              if (field.xtype == 'date-field') {
                val[key] = moment(model, 'YYYY-MM-DD HH:mm:ss.SSS');
              }
              field.inputValue = model;
            }
          });
        } else if (Array.isArray(model)) {
          let value = [];
          _.forEach(model, (item) => {
            value.push(item.value);
          });
          val[key] = value;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          this.config.items.forEach((field, index, array) => {
            if (field.name == key) {
              if (field.xtype == 'select-field' && field.remote == true) {
                field.options = model;
              }
            }
          });
        }else if (_.isBoolean(model)) {
          val[key] = model;
        }
      });
    }
    this.model = val;
  }

  reset(): void {
    this.field.model = {};
    this.form.reset();
    // if(this.config&&this.config.items){
    //   this.config.items.forEach((field) => {
    //     if(field.defaultValue!=undefined){
    //       this.setFieldValue(field.name,field.defaultValue);
    //     }
    //   });
    // }
    this.resetAllFields();
    this.form.clearValidators();
    this.form.markAsUntouched({ onlySelf: false });
    this.form.markAsPristine({ onlySelf: false });
  }

  // private
  afterAction(action: FormAction, result: any, success) {
    const o = action.options;
    if (success) {
      Dui.callback(o.success, o.scope, [result, action]);
    } else {
      Dui.callback(o.failure, o.scope, [result, action]);
    }
  }

  getComponent(name: string):any {
    return this.formConfig.getType(name);
  }

  findField(id: string, items?): any {
    if (isUndefined(items)) items = this.items
    let field ;
    for (let i = 0; i < items.length; i++) {
       field = items[i];
      if (field.name === id) {
        return field;
      }
    }
    for (let j = 0; j < items.length; j++) {
      let item = items[j];

      if (item.fieldGroup&&item.fieldGroup.length!=0) {
        field= this.findField(id, item.fieldGroup);
      }
      if (item.fieldArray&&item.fieldArray.fieldGroup) {
        field= this.findField(id, item.fieldArray.fieldGroup);
      }
    }
    return field;
  }

  add(field: any, index?: number) {
    if (index == undefined) {
      this.items.splice(this.items.length, 0, field);
    } else {
      this.items.splice(index, 0, field);
    }
  }

  remove(field: string) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name == field) {
        _.remove(this.items, this.items[i]);
      }
    }
  }
}

