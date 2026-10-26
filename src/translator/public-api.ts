/**
 * @fileoverview Module `src/translator/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/translator/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */



/*
 * 这个入口原先还导出一整套 EJ2 衍生的 intl 实现(`date-formatter` /
 * `date-parser` / `number-formatter` / `number-parser` / `parser-base` /
 * `intl-base` / `base` / `internationalization` / `l10n`,共 2,942 行)。
 * 全部随 EJ2 清场删除,换成 `./intl` 里约 250 行的原生 `Intl` 实现 ——
 * 见 duix 的 `lib/PEEL-CLEANUP-PLAN.md` §P5,对照门在 `tools/intl/gate.mjs`
 * (157 条逐字一致,1 条已知差异)。
 *
 * 同目录的 `translate.*`(ngx-translate 衍生,MIT)不在此列,原样保留。
 */
  export * from './intl';
  export * from "./missing-translation-handler";

  export * from './util';
  export * from "./translate.loader";
  export * from "./translate.service";
  export * from "./missing-translation-handler";
  export * from "./translate.parser";
  export * from "./translate.compiler";
  export * from "./translate.directive";
  export * from "./translate.pipe";
  export * from "./translate.store";
  export * from './translate.module';
  export * from './translate-loader.service';
  export * from './translation.service';
  export * from './translate.guard';
  export * from './http-loader';

  export * from './t';
  export * from './lazy';
