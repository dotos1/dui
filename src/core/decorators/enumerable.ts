/**
 * @fileoverview Module `src/core/decorators/enumerable.ts` providing enumerable definitions and implementation.
 * @zh 模块文件 `src/core/decorators/enumerable.ts`，提供enumerable相关的定义与实现。
 */


/**
 * Executes `enumerable` to handle enumerable.
 * @zh 执行 `enumerable`，用于enumerable。
 * @param value - value parameter (`boolean`) / 值参数（`boolean`）
 */
export function enumerable(value: boolean) {
  return (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    descriptor.enumerable = value;
  };
}
