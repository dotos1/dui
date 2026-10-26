/**
 * @fileoverview Module `src/core/decorators/coercion.ts` providing coercion definitions and implementation.
 * @zh 模块文件 `src/core/decorators/coercion.ts`，提供coercion相关的定义与实现。
 */


import {
  coerceArray as coerceArrayAngular,
  coerceBooleanProperty,
  coerceCssPixelValue as coerceCssPixelValueAngular,
  coerceNumberProperty,
  coerceStringArray as coerceStringArrayAngular
} from '@angular/cdk/coercion';

/**
 * Constant/variable `coerceBoolean` defining coerce boolean in `src/core/decorators`.
 * @zh 常量/变量 `coerceBoolean`，定义 `src/core/decorators` 中的coerce布尔值。
 */
export const coerceBoolean = () => (target, key: string, propertyDescriptor?: PropertyDescriptor): void => {
  if (!!propertyDescriptor && !!propertyDescriptor.set) {
    const original = propertyDescriptor.set;

    propertyDescriptor.set = function(next) {
      original.apply(this, [coerceBooleanProperty(next)]);
    };
  } else {
    const getter = function() {
      return this['__' + key];
    };

    const setter = function(next) {
      this['__' + key] = coerceBooleanProperty(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};

/**
 * Constant/variable `coerceNumber` defining coerce number in `src/core/decorators`.
 * @zh 常量/变量 `coerceNumber`，定义 `src/core/decorators` 中的coerce数字。
 */
export const coerceNumber = () => (target, key: string, propertyDescriptor?: PropertyDescriptor): void => {
  if (!!propertyDescriptor && !!propertyDescriptor.set) {
    const original = propertyDescriptor.set;

    propertyDescriptor.set = function(next) {
      original.apply(this, [coerceNumberProperty(next)]);
    };
  } else {
    const getter = function() {
      return this['__' + key];
    };

    const setter = function(next) {
      this['__' + key] = coerceNumberProperty(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};

/**
 * Constant/variable `coerceCssPixelValue` defining coerce css pixel value in `src/core/decorators`.
 * @zh 常量/变量 `coerceCssPixelValue`，定义 `src/core/decorators` 中的coerceCSS样式像素值。
 */
export const coerceCssPixelValue = () => (target, key: string, propertyDescriptor?: PropertyDescriptor): void => {
  if (!!propertyDescriptor && !!propertyDescriptor.set) {
    const original = propertyDescriptor.set;

    propertyDescriptor.set = function(next) {
      original.apply(this, [coerceCssPixelValueAngular(next)]);
    };
  } else {
    const getter = function() {
      return this['__' + key];
    };

    const setter = function(next) {
      this['__' + key] = coerceCssPixelValueAngular(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};

/**
 * Constant/variable `coerceArray` defining coerce array in `src/core/decorators`.
 * @zh 常量/变量 `coerceArray`，定义 `src/core/decorators` 中的coerce数组。
 */
export const coerceArray = () => (target, key: string, propertyDescriptor?: PropertyDescriptor): void => {
  if (!!propertyDescriptor && !!propertyDescriptor.set) {
    const original = propertyDescriptor.set;

    propertyDescriptor.set = function(next) {
      original.apply(this, [coerceArrayAngular(next)]);
    };
  } else {
    const getter = function() {
      return this['__' + key];
    };

    const setter = function(next) {
      this['__' + key] = coerceArrayAngular(next);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};

/**
 * Constant/variable `coerceStringArray` defining coerce string array in `src/core/decorators`.
 * @zh 常量/变量 `coerceStringArray`，定义 `src/core/decorators` 中的coerce字符串数组。
 */
export const coerceStringArray = (separator?: string | RegExp) =>
  (target, key: string, propertyDescriptor?: PropertyDescriptor): void => {
  if (!!propertyDescriptor && !!propertyDescriptor.set) {
    const original = propertyDescriptor.set;

    propertyDescriptor.set = function(next) {
      original.apply(this, [coerceStringArrayAngular(next, separator)]);
    };
  } else {
    const getter = function() {
      return this['__' + key];
    };

    const setter = function(next) {
      this['__' + key] = coerceStringArrayAngular(next, separator);
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};
