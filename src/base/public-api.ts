/**
 * @fileoverview Module `src/base/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/base/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

/*
 * `@dotos1/dui/base`
 *
 * <p>这个入口原先是 `@legacy/legacy-base` 的内核 fork(改了 import 路径、
 * 把 `legacy_instances` 改名成 `dui_instances`)。全部换成自研实现,
 * 见 duix 的 `lib/PEEL-CLEANUP-PLAN.md` §P6,对照门在 `tools/base/gate.mjs`。
 *
 * <p>`duibase.ts` 与 `object-utils.ts` **本来就是自研的**(Angular
 * ComponentFactory 注册表 / 深拷贝比较工具),不在替换范围,原样保留。
 *
 * <p>删掉且不重建的:`hijri-parser.ts`(181 行,伊斯兰历换算 —— 唯一的
 * 使用者是同样被删的 LEGACY intl 半边)、`event-handler.ts`(131 行,
 * 全库零 import)。
 */

export * from './base';
export * from './duibase';
export * from './dui-config';
export * from './dom';
export * from './observer';
export * from './util';
export * from './object-utils';
export * from './sanitize-dom';
export * from './phone';
