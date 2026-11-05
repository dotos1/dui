/**
 * @fileoverview Module `src/form/components/form.component.ts` providing form component definitions and implementation.
 * @zh 模块文件 `src/form/components/form.component.ts`，提供表单组件相关的定义与实现。
 */

import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {isString,isDate,isObjectLike,each,isBoolean,forEach,remove}  from 'lodash-es';
import moment from 'moment';
import { filter, switchMap, take } from 'rxjs/operators';

import { isPhoneTerminal } from '@dotos/dui/base';
import { Dui } from '@dotos/dui/core';
import { FieldConfig, FieldConfigCache, FormBuilder, FormConfig, FormOptions, assignModelValue, clearControl, clone, getKeyPath, isUndefined } from '@dotos/dui/core/form';
import { FormAction, Load, Submit } from '../action/index';


/** 手机长表单每批渲染的字段数 */
const PHONE_RENDER_BATCH = 30;

/**
 * Angular component `FormComponent` (selector: 'dui-form') providing form component presentation and interaction in `src/form/components`.
 * @zh Angular 组件 `FormComponent`（selector: 'dui-form'），提供表单组件的视图渲染与交互逻辑（位于 `src/form/components`）。
 */
@Component({
  selector: 'dui-form',
  templateUrl: './form.component.html',
  providers: [FormBuilder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./form.component.scss'],
  host: {hostID: 'dui-form' + Math.random().toString(36).substring(2, 15)},
})
export class FormComponent implements DoCheck, OnChanges, OnDestroy {

  /**
   * Input property `config` (`{ items?: any; }`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`{ items?: any; }`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: { items? } = {};

  /**
   * Input setter `form` updating form.
   * @zh 输入属性 `form` 的设置器，用于更新表单。
   * @param form - New form value (`FormGroup<any> | FormArray<any>`) / 新的表单值（`FormGroup<any> | FormArray<any>`）
   */
  @Input()
  set form(form: FormGroup | FormArray) {
    this.field.form = form;
  }
  /**
   * Gets the current form (`form: any`).
   * @zh 获取当前表单（`form: any`）。
   */
  get form() {
    return this.field.form as FormGroup | FormArray;
  }

  /**
   * Input setter `model` updating model.
   * @zh 输入属性 `model` 的设置器，用于更新模型。
   * @param model - New model value (`any`) / 新的模型值（`any`）
   */
  @Input()
  set model(model) {
    this.setField({ model });
  }
  /**
   * Gets the current model (`model: any`).
   * @zh 获取当前模型（`model: any`）。
   */
  get model() {
    return this.field.model;
  }

  /**
   * Input setter `items` updating items.
   * @zh 输入属性 `items` 的设置器，用于更新条目列表。
   * @param fieldGroup - New items value (`FieldConfig[]`) / 新的条目列表值（`FieldConfig[]`）
   */
  @Input()
  set items(fieldGroup: FieldConfig[]) {
    this.setField({ fieldGroup });
  }
  /**
   * Gets the current items (`items: any`).
   * @zh 获取当前条目列表（`items: any`）。
   */
  get items() {
    return this.field.fieldGroup;
  }

  /**
   * Input setter `options` updating options.
   * @zh 输入属性 `options` 的设置器，用于更新配置选项。
   * @param option - New options value (`FormOptions`) / 新的配置选项值（`FormOptions`）
   */
  @Input()
  set options(option: FormOptions) {
    this.setField({ option });
  }
  /**
   * Gets the current options (`options: any`).
   * @zh 获取当前配置选项（`options: any`）。
   */
  get options() {
    return this.field.option;
  }

  /**
   * Output event emitter `modelChange` (`EventEmitter<any>`) firing when model change occurs.
   * @zh 输出事件 `modelChange`（类型：`EventEmitter<any>`），当触发模型变更时向外发出事件。
   */
  @Output() modelChange = new EventEmitter();

  /**
   * Output event emitter `formInit` (`EventEmitter<any>`) firing when form init occurs.
   * @zh 输出事件 `formInit`（类型：`EventEmitter<any>`），当触发表单初始化时向外发出事件。
   */
  @Output() formInit = new EventEmitter();

  /**
   * Property `field` (`FieldConfigCache`) storing field (default: `{}`).
   * @zh 属性 `field`（类型：`FieldConfigCache`），用于存储或配置字段（默认值：`{}`）。
   */
  private field: FieldConfigCache = {};
  /**
   * Property `_modelChangeValue` (`Record<string, unknown>`) storing model change value (default: `{}`).
   * @zh 属性 `_modelChangeValue`（类型：`Record<string, unknown>`），用于存储或配置模型变更值（默认值：`{}`）。
   */
  private _modelChangeValue: Record<string, unknown> = {};
  /**
   * Property `valueChangesUnsubscribe` (`() => void`) storing value changes unsubscribe (default: `() => {}`).
   * @zh 属性 `valueChangesUnsubscribe`（类型：`() => void`），用于存储或配置值变更集合取消订阅（默认值：`() => {}`）。
   */
  private valueChangesUnsubscribe = () => {};

  /**
   * Input property `isRoot` (`boolean`) configuring is root (default: `true`).
   * @zh 输入属性 `isRoot`（类型：`boolean`），用于配置是否为根节点（默认值：`true`）。
   */
  @Input() isRoot = true;

  /**
   * Property `method` (`string`) storing method (default: `'POST'`).
   * @zh 属性 `method`（类型：`string`），用于存储或配置方法（默认值：`'POST'`）。
   */
  public method: string = 'POST';

  /**
   * Property `fileUpload` (`boolean`) storing file upload (default: `false`).
   * @zh 属性 `fileUpload`（类型：`boolean`），用于存储或配置文件上传（默认值：`false`）。
   */
  public fileUpload: boolean = false;

  /**
   * Property `enctype` (`string`) storing enctype (default: `'application/x-www-form-urlencoded'`).
   * @zh 属性 `enctype`（类型：`string`），用于存储或配置enctype（默认值：`'application/x-www-form-urlencoded'`）。
   */
  private enctype: string = 'application/x-www-form-urlencoded';

  /**
   * Creates an instance of `FormComponent` and initializes its dependencies and internal state.
   * @zh 创建 `FormComponent` 实例，并初始化其依赖项与内部状态。
   * @param builder - Injected or initial builder (`FormBuilder`) / 注入或传入的构建器（`FormBuilder`）
   * @param formConfig - Injected or initial form config (`FormConfig`) / 注入或传入的表单配置（`FormConfig`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param loadService - Injected or initial load service (`Load`) / 注入或传入的加载服务（`Load`）
   * @param submitService - Injected or initial submit service (`Submit`) / 注入或传入的提交服务（`Submit`）
   */
  constructor(
    private builder: FormBuilder,
    private formConfig: FormConfig,
    private ngZone: NgZone,
    public detectRef: ChangeDetectorRef,
    private loadService: Load,
    private submitService: Submit
  ) {

  }


  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
    if (this.formConfig.extras){
      if (this.formConfig.extras.checkExpressionOn === 'changeDetectionCheck') {
        this.checkExpressionChange();
      }
    }
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this._phoneBatchTimer !== null) {
      clearTimeout(this._phoneBatchTimer);
    }
    this.valueChangesUnsubscribe();
  }

  /**
   * Executes `checkExpressionChange` to handle check expression change.
   * @zh 执行 `checkExpressionChange`，用于检查表达式变更。
   */
  private checkExpressionChange() {

    if(this.field.option.checkExpressions){
      this.field.option.checkExpressions(this.field);
    }
  }

  /**
   * Executes `valueChanges` to handle value changes.
   * @zh 执行 `valueChanges`，用于值变更集合。
   */
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

  /**
   * Executes `setField` to handle set field.
   * @zh 执行 `setField`，用于集合字段。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private setField(field: FieldConfigCache) {
    this.field = {
      ...this.field,
      ...(this.formConfig.extras.immutable ? clone(field) : field),
    };
  }

  /**
   * Executes `buildForm` to handle build form.
   * @zh 执行 `buildForm`，用于构建表单。
   */
  buildForm() {
    this.valueChangesUnsubscribe();
    this.builder.build(this.field);
    this.valueChangesUnsubscribe = this.valueChanges();
    this.formInit.emit();
    this.detectRef.detectChanges();
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  public init(config): void {
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

  /**
   * Executes `getStyle` to handle get style.
   * @zh 执行 `getStyle`，用于获取样式。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   */
  /**
   * Fields to render. Desktop renders all. On a phone long forms render in batches so the first paint stays fast;
   * controls and validators exist for every field regardless (built by FormBuilder).
   * @zh 要渲染的字段。桌面全部渲染；手机长表单分批渲染（字段控件和校验器在构建时已全部建好，不受影响）。
   */
  public get renderItems(): FieldConfig[] {
    const all = this.items;
    if (!all || !isPhoneTerminal() || all.length <= this._phoneRenderLimit) {
      return all;
    }
    this._schedulePhoneBatch();
    return all.slice(0, this._phoneRenderLimit);
  }

  /** 手机分批渲染：当前渲染上限 */
  private _phoneRenderLimit = PHONE_RENDER_BATCH;
  private _phoneBatchTimer: ReturnType<typeof setTimeout> | null = null;

  private _schedulePhoneBatch(): void {
    if (this._phoneBatchTimer !== null) {
      return;
    }
    this.ngZone.runOutsideAngular(() => {
      this._phoneBatchTimer = setTimeout(() => {
        this._phoneBatchTimer = null;
        this._phoneRenderLimit += PHONE_RENDER_BATCH;
        this.ngZone.run(() => this.detectRef.markForCheck());
      }, 50);
    });
  }

  /**
   * Render all fields now (e.g. to reveal the first validation error on a phone).
   * @zh 立即渲染全部字段（如手机校验失败要定位到第一个错误）。
   */
  public renderAll(): void {
    this._phoneRenderLimit = Number.MAX_SAFE_INTEGER;
    this.detectRef.markForCheck();
  }

  /**
   * Flex basis of a field: the backend value on desktop, always 100 (single column) on a phone.
   * @zh 字段的 flex：桌面用后端下发值；手机类下固定 100（单列），后端值不变。
   */
  public flexOf(item: FieldConfig): number | string {
    return isPhoneTerminal() ? 100 : (item.flex ? item.flex : 100);
  }

  public getStyle(field) {
    return {
      'display': field.hidden ? "none" : ""
    };
  }
  /**
   * Executes `changeModel` to handle change model.
   * @zh 执行 `changeModel`，用于变更模型。
   * @param options - { name, value, field } parameter (`{ name: string, value: any, field: FieldConfig }|any`) / {name,value,字段}参数（`{ name: string, value: any, field: FieldConfig }|any`）
   */
  changeModel({ name, value, field }) {
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
  /**
   * Executes `rebuildForm` to handle rebuild form.
   * @zh 执行 `rebuildForm`，用于rebuild表单。
   */
  rebuildForm() {
    this.model = this.model || {};
    this.form = new FormGroup({});
    this.valueChangesUnsubscribe();
    this.builder.build(this.field);
    this.valueChangesUnsubscribe = this.valueChanges();
  }

  /**
   * Executes `submit` to handle submit.
   * @zh 执行 `submit`，用于提交。
   * @param option - option parameter (`any`) / 选项参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  submit(option) {
    option = option || {};
    if (!this.fileUpload) {
      let headers = new HttpHeaders();
      headers = headers.append("Content-Type", this.enctype);
      option['headers'] = headers;
    }
    return this.doAction('submit', option);
  }

  /**
   * Executes `load` to handle load.
   * @zh 执行 `load`，用于加载。
   * @param option - option parameter (`any`) / 选项参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  load(option)  {
    const loadAction = 'load';
    return this.doAction(loadAction, option);
  }

  /**
   * Executes `doAction` to handle do action.
   * @zh 执行 `doAction`，用于执行动作。
   * @param action - action parameter (`any`) / 动作参数（`any`）
   * @param option - option parameter (`any`) / 选项参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  doAction(action, option)  {
    if (isString(action)) {
      if (action === 'load') {
        action = this.loadService.init(this, option);
      } else if (action === 'submit') {
        action = this.submitService.init(this, option);
      }
    }
    return action.run(action);
  }

  /**
   * Executes `updateField` to handle update field.
   * @zh 执行 `updateField`，用于更新字段。
   * @param fields - fields parameter (`any`) / 字段列表参数（`any`）
   */
  updateField(fields) {
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
  /**
   * Executes `getValues` to handle get values.
   * @zh 执行 `getValues`，用于获取值列表。
   * @returns Result of type `HttpParams | FormData` / 类型为 `HttpParams | FormData` 的返回值
   */
  getValues() {
    let body = this.fileUpload ? new FormData() : new HttpParams();
    const appendValue = (name: string, val) => {
      if (this.fileUpload) {
        (body as FormData).append(name, val);
      } else {
        body = (body as HttpParams).append(name, val);
      }
    };
    let fieldFun = (field) => {
      if (field.name) {
        if (this.model[field.name] != undefined) {
          if (isDate(this.model[field.name])) {
            this.model[field.name] = moment(this.model[field.name]).format('YYYY-MM-DD HH:mm:ss');
          } else if (this.model[field.name] instanceof moment) {
            this.model[field.name] = this.model[field.name].format('YYYY-MM-DD HH:mm:ss');
          }
          if (isObjectLike(this.model[field.name])) {
            if (this.model[field.name].text != null && this.model[field.name].value !== undefined) {
              appendValue(field.name, this.model[field.name].value);
            } else {
              appendValue(field.name, this.model[field.name]);
            }
          } else {
            appendValue(field.name, this.model[field.name]);
          }
        } else {
          appendValue(field.name, '');
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
    each(this.config.items, (field) => {
      if (field.fieldGroup) {
        groupFun(field);
      } else {
        fieldFun(field);
      }
    });
    return body;
  }

  /**
   * Executes `setValues` to handle set values.
   * @zh 执行 `setValues`，用于集合值列表。
   * @param values - values parameter (`any`) / 值列表参数（`any`）
   */
  setValues(values): void {
    if (this.config == undefined || this.config.items == undefined) {
      return;
    }
    each(this.config.items, (field) => {
      delete field.inputValue;
      field.formControl.reset();
      if(field.defaultValue!=undefined){
        field.formControl.patchValue(field.defaultValue);
      }
    });
    let fieldFun = (field: FieldConfig, model) => {
      field.formControl.reset();
      if ( isObjectLike(model)) {
        if(model.text != null && model.value !== undefined){
          if (field.xtype == 'select-field') {
            // 手机：静态选项不要被当前值覆盖（否则编辑时只剩一个选项，改不了）。桌面保持原行为，见 progress。
            if (field.remote == true || !isPhoneTerminal()) {
              field.options = [model];
            }
            if(field.remote == true){
              field['loaded'] = false;
            }
            field.formControl.patchValue(model.value);
            field.inputValue = model.text;
          }else if(field.xtype == 'trigger-field'){
            field.inputValue = model.text;
            field.formControl.patchValue(model.value);
          }else{
            field.formControl.patchValue(model);
            field.inputValue = model.text;
          }
        }else if(model.value !== undefined){
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
          (<{ _buildForm? }><unknown>field.option)._buildForm(true);
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
    each(values, (model, key) => {
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
  /**
   * Executes `getFieldValue` to handle get field value.
   * @zh 执行 `getFieldValue`，用于获取字段值。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `FormDataEntryValue` / 类型为 `FormDataEntryValue` 的返回值
   */
  getFieldValue(key: string) {
    return this.getValues().get(key);
  }

  /**
   * Executes `setFieldValue` to handle set field value.
   * @zh 执行 `setFieldValue`，用于集合字段值。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param model - model parameter (`any`) / 模型参数（`any`）
   */
  setFieldValue(key: string, model): void {

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
            if(model && model.text != null){
              f.inputValue = model.text;
            }
          }
        }
      })
    } else {
      if (field.name == key) {
        if (isObjectLike(model) && model.text != null && model.value !== undefined) {
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

  /**
   * Executes `resetAllFields` to handle reset all fields.
   * @zh 执行 `resetAllFields`，用于重置全部字段列表。
   */
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
    each(this.config.items, (field) => {
      resetField(field);
    });
  }

  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh() {
    this.detectRef.detectChanges();
  }

  /**
   * Executes `clearInvalid` to handle clear invalid.
   * @zh 执行 `clearInvalid`，用于清空无效。
   */
  clearInvalid(): void {
    this.form.markAsPristine();
  }

  /**
   * Gets the current valid (`valid: boolean`).
   * @zh 获取当前有效（`valid: boolean`）。
   */
  get valid(): boolean {
    if (this.form) {
      return this.form.valid;
    }
    return false;
  }

  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  get value() {
    return this.model;
  }

  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param v - New value value (`any`) / 新的值值（`any`）
   */
  set value(v) {
    let val: Record<string, unknown> = {};
    if(this.config.items){
      each(this.config.items, (field) => {
        delete field.inputValue
      });
      each(v, (model, key) => {
        if (isObjectLike(model) && model.text != null && model.value !== undefined) {
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
        } else if (isString(model)) {
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
        } else if (typeof model === 'number') {
          val[key] = model;
          this.config.items.forEach((field) => {
            if (field.name == key) {
              field.inputValue = model;
            }
          });
        } else if (Array.isArray(model)) {
          let value = [];
          forEach(model, (item) => {
            value.push(isObjectLike(item) && 'value' in item ? item.value : item);
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
        }else if (isBoolean(model)) {
          val[key] = model;
        }
      });
    }
    this.model = val;
  }

  /**
   * Executes `reset` to handle reset.
   * @zh 执行 `reset`，用于重置。
   */
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
  /**
   * Executes `afterAction` to handle after action.
   * @zh 执行 `afterAction`，用于之后动作。
   * @param action - action parameter (`FormAction`) / 动作参数（`FormAction`）
   * @param result - result parameter (`any`) / 结果参数（`any`）
   * @param success - success parameter (`any`) / 成功参数（`any`）
   */
  afterAction(action: FormAction, result, success) {
    const o = action.options;
    if (success) {
      Dui.callback(o.success, o.scope, [result, action]);
    } else {
      Dui.callback(o.failure, o.scope, [result, action]);
    }
  }

  /**
   * Executes `getComponent` to handle get component.
   * @zh 执行 `getComponent`，用于获取组件。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `TypeOption` / 类型为 `TypeOption` 的返回值
   */
  getComponent(name: string) {
    return this.formConfig.getType(name);
  }

  /**
   * Executes `findField` to handle find field.
   * @zh 执行 `findField`，用于查找字段。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   * @param items - items parameter (`any`) / 条目列表参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  findField(id: string, items?) {
    if (isUndefined(items)) items = this.items;
    if (!items) return null;
    for (let i = 0; i < items.length; i++) {
      const field = items[i];
      if (field.name === id) {
        return field;
      }
    }
    for (let j = 0; j < items.length; j++) {
      let item = items[j];

      if (item.fieldGroup && item.fieldGroup.length != 0) {
        const found = this.findField(id, item.fieldGroup);
        if (found) return found;
      }
      if (item.fieldArray && item.fieldArray.fieldGroup) {
        const found = this.findField(id, item.fieldArray.fieldGroup);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  add(field, index?: number) {
    if (index == undefined) {
      this.items.splice(this.items.length, 0, field);
    } else {
      this.items.splice(index, 0, field);
    }
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param field - field parameter (`string`) / 字段参数（`string`）
   */
  remove(field: string) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name == field) {
        remove(this.items, this.items[i]);
      }
    }
  }
}

