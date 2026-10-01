## 概述

`util` 是框架无关的工具函数与管道集合：变更侦测辅助（`Watcher`/`Change`）、字符串工具（`StringUtils`）、`uuid` 生成、十进制数值模型（`DecimalNumberModel`）；子模块 `pipes` 聚合了约 19 个常用 Angular 管道（字节格式化 `BytesPipe`、文本截断 `TruncatePipe`、关键字高亮 `HighlightPipe`、相对时间 `TimeAgoPipe`、本地化日期 `LocalizedDatePipe` 等），`jpeg` 则是一个纯 JS 的 JPEG 编解码器，不依赖 Angular。

## 何时使用

需要格式化展示数据（文件大小、日期、截断长文本）时看看 `util/pipes` 里是否已有现成管道，避免重复造轮子。
