/**
 * @fileoverview Module `src/core/form/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/core/form/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

export { FieldConfig, FormOptions, FieldConfigCache, FormOptionsCache, ConfigOption, TypeOption, FormExtension,FormLifeCycleEvent,ValueChangeEvent } from './models';
export { FORM_CONFIG, FormConfig } from './services/form.config';
export { FormBuilder } from './services/form.builder';

export * from './extensions';
export * from './template';

export { AbstractFormModule } from './form.module';
export { defineHiddenProp, reverseDeepMerge,getFieldInitialValue } from './utils';
export { getKeyPath2,assignModelValue2,getValueForKey2 } from './utils';
export { FORM_VALIDATORS, assignModelValue, isNil,clone,IObserver, observe, getKeyPath, isUndefined,observeDeep,getFieldValue,assignFieldValue } from './utils';
export { ExtErrorStateMatcher } from './error-state-matcher';
export { FormExt } from './form.ext';
