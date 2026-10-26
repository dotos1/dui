/**
 * @docs-private
 * @zh 执行 `createMissingDateImplError`，用于创建Missing日期实现错误。
 */
export function createMissingDateImplError(provider: string) {
  return Error(
    `MatDatetimepicker: No provider found for ${provider}. You must import one of the following ` +
    `modules at your application root: MatNativeDatetimeModule, MatMomentDatetimeModule, or provide a ` +
    `custom implementation.`);
}
