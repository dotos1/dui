/**
 * @fileoverview Module `src/core/mobx/mobx-angular.ts` providing Angular Signal compatibility shims replacing legacy MobX decorators and helpers.
 * @zh 模块文件 `src/core/mobx/mobx-angular.ts`，提供替代历史 MobX 装饰器与辅助函数的原生 Angular Signal 轻量兼容层（零 mobx 依赖）。
 */

import { computed as ngComputed, Signal, signal, WritableSignal } from '@angular/core';

// 实例级私有 Signal 存储表，为遗留 `@observable` 属性装饰器提供零 MobX 的 Signal 响应式读写支持
const instanceSignalStore = new WeakMap<object, Map<string | symbol, WritableSignal<unknown>>>();

function getOrCreatePropertySignal(target: object, key: string | symbol, initialValue: unknown): WritableSignal<unknown> {
  let propMap = instanceSignalStore.get(target);
  if (!propMap) {
    propMap = new Map<string | symbol, WritableSignal<unknown>>();
    instanceSignalStore.set(target, propMap);
  }
  let sig = propMap.get(key);
  if (!sig) {
    sig = signal<unknown>(initialValue);
    propMap.set(key, sig);
  }
  return sig;
}

/**
 * Type alias `DuiCompatActionDecorator` representing legacy action decorator or wrapper signature.
 * @zh 类型别名 `DuiCompatActionDecorator`，表示兼容旧版动作装饰器或函数包装器的类型签名。
 */
export interface DuiCompatActionDecorator {
  (target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void;
  <T extends (...args: unknown[]) => unknown>(fn: T): T;
  <T extends (...args: unknown[]) => unknown>(name: string, fn: T): T;
  bound: (target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => PropertyDescriptor | void;
}

/**
 * Type alias `DuiCompatComputedDecorator` representing legacy computed decorator or Angular Signal computed bridge.
 * @zh 类型别名 `DuiCompatComputedDecorator`，表示桥接至 Angular `computed` 的派生计算函数或兼容属性装饰器签名。
 */
export interface DuiCompatComputedDecorator {
  <T>(computation: () => T): Signal<T>;
  (target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void;
}

/**
 * Type alias `DuiCompatObservableDecorator` representing legacy observable property decorator or Signal factory.
 * @zh 类型别名 `DuiCompatObservableDecorator`，表示基于 Angular `WritableSignal` 的兼容属性装饰器或状态包装器签名。
 */
export interface DuiCompatObservableDecorator {
  (target: object, propertyKey: string | symbol): void;
  box: <T>(initialValue: T) => WritableSignal<T>;
}

/**
 * Executes `actionInternal` to handle action decorator or callback execution without MobX.
 * @zh 执行 `actionInternal`，以零 MobX 方式处理动作方法装饰器或函数包装调用。
 * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
 * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
 */
export function actionInternal(...args: unknown[]): unknown {
  if (args.length === 1 && typeof args[0] === 'function') {
    return args[0];
  }
  if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'function') {
    return args[1];
  }
  if (args.length >= 2 && typeof args[0] === 'object' && args[0] !== null) {
    return args[2];
  }
  return (target: object, _propertyKey: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | undefined => {
    void target;
    return descriptor;
  };
}

function boundAction(target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | void {
  if (!descriptor || typeof descriptor.value !== 'function') {
    return descriptor;
  }
  const originalFn = descriptor.value as (...fnArgs: unknown[]) => unknown;
  return {
    configurable: true,
    enumerable: false,
    get(this: object): (...fnArgs: unknown[]) => unknown {
      const bound = originalFn.bind(this);
      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: true,
        writable: true,
      });
      return bound;
    },
  };
}

/**
 * Constant/variable `action` defining zero-MobX action compatibility helper in `src/core/mobx`.
 * @zh 常量/变量 `action`，定义 `src/core/mobx` 中零 MobX 依赖的动作兼容包装器。
 */
export const action: DuiCompatActionDecorator = Object.assign(actionInternal, {
  bound: boundAction,
}) as DuiCompatActionDecorator;

/**
 * Executes `computedInternal` to bridge computed expressions to Angular `computed()` or preserve getters.
 * @zh 执行 `computedInternal`，将派生函数桥接至 Angular `computed()` 或保留兼容 getter 描述符。
 * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
 * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
 */
function computedInternal(...args: unknown[]): unknown {
  if (args.length >= 1 && typeof args[0] === 'function') {
    return ngComputed(args[0] as () => unknown);
  }
  if (args.length >= 2 && typeof args[0] === 'object' && args[0] !== null) {
    return args[2];
  }
  return (_target: object, _propertyKey: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | undefined => descriptor;
}

/**
 * Constant/variable `computed` defining Angular Signal-bridged computed helper in `src/core/mobx`.
 * @zh 常量/变量 `computed`，定义 `src/core/mobx` 中桥接至 Angular `computed` 的计算属性兼容工具。
 */
export const computed: DuiCompatComputedDecorator = computedInternal as DuiCompatComputedDecorator;

/**
 * Executes `observableInternal` to install a per-instance Angular `WritableSignal` on decorated properties.
 * @zh 执行 `observableInternal`，在被装饰属性上安装基于 Angular `WritableSignal` 的响应式访问器。
 * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
 * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
 */
function observableInternal(...args: unknown[]): unknown {
  if (args.length >= 2 && typeof args[0] === 'object' && args[0] !== null && (typeof args[1] === 'string' || typeof args[1] === 'symbol')) {
    const target = args[0];
    const propertyKey = args[1];
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get(this: object): unknown {
        return getOrCreatePropertySignal(this, propertyKey, undefined)();
      },
      set(this: object, nextValue: unknown): void {
        getOrCreatePropertySignal(this, propertyKey, nextValue).set(nextValue);
      },
    });
    return undefined;
  }
  return signal<unknown>(args[0]);
}

/**
 * Constant/variable `observable` defining Angular Signal-backed observable compatibility helper in `src/core/mobx`.
 * @zh 常量/变量 `observable`，定义 `src/core/mobx` 中基于 Angular `Signal` 的可观察属性兼容层。
 */
export const observable: DuiCompatObservableDecorator = Object.assign(observableInternal, {
  box: <T>(initialValue: T): WritableSignal<T> => signal<T>(initialValue),
}) as DuiCompatObservableDecorator;
