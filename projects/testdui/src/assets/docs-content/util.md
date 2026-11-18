## 概述

`util`（`@dotos1/dui/util*`）是纯逻辑工具函数、数值/变更模型与通用 Angular 管道（Pipes）集合，包含根入口 `@dotos1/dui/util`、高频格式化管道库 `@dotos1/dui/util/pipes` 以及纯 JavaScript JPEG 图像编解码器 `@dotos1/dui/util/jpeg`。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos1/dui/util` | `StringUtils`, `Watcher`, `DecimalNumberModel`, `uuid` | 字符串命名转换、属性变更侦测器、高精度十进制格式化模型与 UUID 生成器 |
| `@dotos1/dui/util/pipes` | `DuiPipesModule`, `BytesPipe`, `TruncatePipe`, `TimeAgoPipe`, `HighlightPipe`, `LocalizedDatePipe`, `SafePipe` | 约 20 个纯管道（Pure Pipes），涵盖字节大小换算、文本截断、相对时间、搜索高亮与安全 HTML/URL 转换 |
| `@dotos1/dui/util/jpeg` | `encode`, `decode` | 纯前端 ArrayBuffer/Uint8Array JPEG 图像编码与解码工具 |

## 架构与设计模式

- **Pure Pipe 无副作用设计**：`@dotos1/dui/util/pipes` 中的管道均遵循纯函数语义，仅当输入引用或原始值变化时才重新计算，在 `OnPush` 组件中具备极佳性能。

## 典型用法与最佳实践

```typescript
import { DuiPipesModule } from '@dotos1/dui/util/pipes';

@NgModule({
  imports: [DuiPipesModule],
})
export class OrderDetailModule {}
```

```html
<!-- 字节格式化、长文本截断与相对时间展示 -->
<span>附件大小：{{ 1572864 | bytes }}</span>
<p>{{ longDescription | truncate: 80 : '...' }}</p>
<small>更新于：{{ updatedAt | timeAgo }}</small>
```
