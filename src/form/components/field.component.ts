import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  SimpleChanges,
  ComponentFactoryResolver,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterContentInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormConfig } from '@dotos/dui/core/form';
import { FieldConfig,FieldConfigCache } from '@dotos/dui/core/form';
import { defineHiddenProp, observe, observeDeep, getFieldValue, assignFieldValue } from '@dotos/dui/core/form';
import { FieldWrapper } from '@dotos/dui/core/form';
import { FieldType } from '@dotos/dui/core/form';
import { isObservable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'dui-field',
  template: `
     <ng-template #container></ng-template>
  `,
  host: {
    '[style.display]': 'field.hidden ? "none":field.xtype=="hidden-field"?"none":""',
    '[style.flex]': 'field.xtype=="hidden-field"?"0":"1"',
    '[class]': 'field.className? field.className : className',
    hostID: 'dui-field' + Math.random().toString(36).substring(2, 15),
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements OnInit, OnChanges,  AfterContentInit, AfterViewInit, OnDestroy {

  @Input() field: FieldConfig;

  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

  private hostObservers: ReturnType<typeof observe>[] = [];

  private componentRefs: any[] = [];

  private hooksObservers: Function[] = [];

  valueChangesUnsubscribe = () => {};

  constructor(
    private formConfig: FormConfig,
    private renderer: Renderer2,
    public changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef
  ) {
  }

  init() {
    this.resetRefs(this.field);
    this.render();
  }

  ngAfterContentInit() {
    this.triggerHook('afterContentInit');
  }

  ngAfterViewInit() {
    this.triggerHook('afterViewInit');
  }

  ngOnInit() {
    this.triggerHook('onInit');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.triggerHook('onChanges', changes);
  }
  refresh(){
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.resetRefs(this.field);
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hooksObservers.forEach((unsubscribe) => unsubscribe());
    this.valueChangesUnsubscribe();
    this.triggerHook('onDestroy');
  }

  private renderField(containerRef: ViewContainerRef, f: FieldConfigCache, wrappers: string[] = []) {
    if (this.containerRef === containerRef) {
      this.resetRefs(this.field);
      this.containerRef.clear();
      wrappers = this.field ? this.field.wrappers : [];
    }
    if (wrappers && wrappers.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const { component } = this.formConfig.getWrapper(wrapper);
      const ref = containerRef.createComponent<FieldWrapper>(component);
      this.attachComponentRef(ref, f);
      observe<ViewContainerRef>(ref.instance, ['fieldComponent'], ({ currentValue, previousValue, firstChange }) => {
        if (currentValue) {
          const viewRef = previousValue ? previousValue.detach() : null;
          if (viewRef && !viewRef.destroyed) {
            currentValue.insert(viewRef);
          } else {
            this.renderField(currentValue, f, wps);
          }
          !firstChange && ref.changeDetectorRef.detectChanges();
        }
      });
    } else if (f && f.xtype) {
      const { component } = this.formConfig.getType(f.xtype);
      const ref = containerRef.createComponent<FieldWrapper>(component);

      this.attachComponentRef(ref, f);
    }
  }

  private triggerHook(name: string, changes?: SimpleChanges) {
    if (name === 'onInit' || (name === 'onChanges' && changes['field'] && !changes['field'].firstChange)) {
      this.valueChangesUnsubscribe = this.fieldChanges(this.field);
    }
    if (this.field && this.field.hooks && this.field.hooks[name]) {
      if (!changes || changes['field']) {
        const r = this.field.hooks[name](this.field);
        if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
          const sub = r.subscribe();
          this.hooksObservers.push(() => sub.unsubscribe());
        }
      }
    }
    if (name === 'onChanges' && changes['field']) {
      this.resetRefs(changes['field'].previousValue);
      this.render();
    }
  }

  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FieldConfigCache) {
    this.componentRefs.push(ref);
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
    ref.instance.init(field);
    this.componentRefs.push(ref);
  }

  private render() {
    if (!this.field) {
      return;
    }
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hostObservers = [
      observe<any>(this.field, ['hide'], ({ firstChange, currentValue }) => {
        if (!this.formConfig.extras.lazyRender) {
          firstChange && this.renderField(this.containerRef, this.field);
          if (!firstChange || (firstChange && currentValue)) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
          }
        } else {
          if (currentValue) {
            this.containerRef.clear();
          } else {
            this.renderField(this.containerRef, this.field);
          }
        }

        this.field.option.detectChanges(this.field);
      }),
      observe<any>(this.field, ['className'], ({ firstChange, currentValue }) => {
        if (!firstChange || (firstChange && currentValue)) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'class', currentValue);
        }
      }),
    ];
  }
  private resetRefs(field: FieldConfigCache) {
    if (field) {
      if (field._componentRefs) {
        field._componentRefs = field._componentRefs.filter((ref) => this.componentRefs.indexOf(ref) === -1);
      } else {
        defineHiddenProp(this.field, '_componentRefs', []);
      }
    }
    this.componentRefs = [];
  }

  private fieldChanges(field: FieldConfigCache) {
    this.valueChangesUnsubscribe();
    if (!field) {
      return () => {};
    }
    const subscribes = [
      observeDeep({
        source: field,
        target: field,
        paths: [],
        setFn: () => field.option.detectChanges(field),
      }),
      observeDeep({
        source: field,
        target: field.option.formState,
        paths: ['options', 'formState'],
        setFn: () => field.option.detectChanges(field),
      }),
    ];
    for (const path of [['template'], ['fieldGroupClassName'], ['validation', 'show']]) {
      const fieldObserver = observe(
        field,
        path,
        ({ firstChange }) => !firstChange && field.option.detectChanges(field),
      );
      subscribes.push(() => fieldObserver.unsubscribe());
    }
    if (field.name && !field.fieldGroup) {
      const control = field.formControl;
      let valueChanges = control.valueChanges.pipe(distinctUntilChanged());
      if (control.value !== getFieldValue(field)) {
        valueChanges = valueChanges.pipe(startWith(control.value));
      }
      const { updateOn, debounce } = field.modelOptions;
      if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
        valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
      }

      const sub = valueChanges.subscribe((value) => {

        if (control instanceof FormControl && control['_fields'] && control['_fields'].length > 1) {
          control.patchValue(value, { emitEvent: false, onlySelf: true });
        }
        if (field.parsers && field.parsers.length > 0) {
          field.parsers.forEach((parserFn) => (value = parserFn(value)));
        }
        assignFieldValue(field, value);
        field.option.fieldChanges.next({ value, field, type: 'valueChanges' });
      });
      subscribes.push(() => sub.unsubscribe());
    }
    return () => subscribes.forEach((subscribe) => subscribe());
  }
}
