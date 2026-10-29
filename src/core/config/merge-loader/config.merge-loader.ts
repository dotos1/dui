/**
 * @fileoverview Module `src/core/config/merge-loader/config.merge-loader.ts` providing config merge loader definitions and implementation.
 * @zh 模块文件 `src/core/config/merge-loader/config.merge-loader.ts`，提供配置合并加载器相关的定义与实现。
 */


import { EMPTY, from as fromObservable, merge, Observable, onErrorResumeNext, throwError } from 'rxjs';
import { filter, isEmpty, mergeMap, reduce, share } from 'rxjs/operators';
// lodash-es：已发布的 ESM 包里不能有 'lodash/fp' 这种目录导入（Node 22 ESM 解析不了）
import { mergeWith as _mergeWith } from 'lodash-es';
import { ConfigLoader, ConfigStaticLoader } from '../config.loader';

/**
 * Constant/variable `errorIfEmpty` defining error if empty in `src/core/config/merge-loader`.
 * @zh 常量/变量 `errorIfEmpty`，定义 `src/core/config/merge-loader` 中的错误If空。
 */
const errorIfEmpty = (source) => {
  return source
    .pipe(
      isEmpty(),
      mergeMap((empty: boolean) => empty
        ? throwError(new Error('No setting found at the specified loader!'))
        : EMPTY)
    );
};

/**
 * Constant/variable `mergeWith` defining merge with in `src/core/config/merge-loader`.
 * @zh 常量/变量 `mergeWith`，定义 `src/core/config/merge-loader` 中的合并带有。
 */
// 与原来 lodash/fp 的 mergeWith 等价：不改动入参，深合并到新对象；数组整体替换不逐项合并
const mergeWith = (object: object) => (source: object): object => {
  return _mergeWith({}, object, source, (objValue: unknown, srcValue: unknown) => {
    if (Array.isArray(objValue))
      return srcValue;
    return undefined;
  });
};

/**
 * Constant/variable `mergeSeries` defining merge series in `src/core/config/merge-loader`.
 * @zh 常量/变量 `mergeSeries`，定义 `src/core/config/merge-loader` 中的合并数据系列。
 */
const mergeSeries = (merged, current) => {
  return current.then(mergeWith(merged));
};

/**
 * Class `ConfigMergeLoader` encapsulating config merge loader data structures and logic in `src/core/config/merge-loader`.
 * @zh 类 `ConfigMergeLoader`，封装 `src/core/config/merge-loader` 中的配置合并加载器数据结构与处理逻辑。
 */
export class ConfigMergeLoader implements ConfigLoader {
  /**
   * Property `nextLoader` (`Function`) storing next loader.
   * @zh 属性 `nextLoader`（类型：`Function`），用于存储或配置下一个加载器。
   */
  private nextLoader: Function;

  /**
   * Creates an instance of `ConfigMergeLoader` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigMergeLoader` 实例，并初始化其依赖项与内部状态。
   * @param loaders - Injected or initial loaders (`Array<ConfigLoader>`) / 注入或传入的加载器（`Array<ConfigLoader>`）
   */
  constructor(private readonly loaders: Array<ConfigLoader> = []) {
  }

  /**
   * Executes `loadSettings` to handle load settings.
   * @zh 执行 `loadSettings`，用于加载设置项。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  loadSettings() {
    if (this.nextLoader)
      return this.mergeParallel()
        .then((res) => mergeSeries(res, this.nextLoader(res)
          .loadSettings()));

    return this.mergeParallel();
  }

  /**
   * Executes `next` to handle next.
   * @zh 执行 `next`，用于下一个。
   * @param loader - loader parameter (`Function`) / 加载器参数（`Function`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  next(loader: Function) {
    this.nextLoader = loader;

    return this;
  }

  /**
   * Executes `mergeParallel` to handle merge parallel.
   * @zh 执行 `mergeParallel`，用于合并Parallel。
   * @returns Result of type `Promise<any>` / 类型为 `Promise<any>` 的返回值
   */
  private mergeParallel() {
    const loaders: Array<ConfigLoader> = [new ConfigStaticLoader(), ...this.loaders];

    const mergedSettings = onErrorResumeNext(loaders
      .map((loader: ConfigLoader) => fromObservable(loader.loadSettings()))
    )
      .pipe(
        filter((res) => Boolean(res)),
        share()
      );

    return new Promise((resolve, reject) => {
      merge(mergedSettings, errorIfEmpty(mergedSettings))
        .pipe(
          reduce((merged: object, current: unknown) => mergeWith(merged)(current as object), {})
        )
        .subscribe((res) => resolve(res), () => reject('Loaders unreachable!'));
    });
  }
}
