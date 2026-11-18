## 概述

`base`（`@dotos1/dui/base`）是整个 `@dotos1/dui` 组件库最底层的运行时基础设施，不包含任何具体的业务 UI 控件，而是提供上层所有模块都会间接依赖的核心基类、事件总线、DOM 测量与观察者模式实现。

## 核心模块与职责

| 导出项 | 类型 | 职责说明 |
| --- | --- | --- |
| `Base` / `DuiBase` | Class | 组件与数据模型的公共抽象基类，提供属性合并、生命周期钩子与事件派发能力 |
| `AngularEventEmitter` | Class | 兼容 Angular `EventEmitter` 与同步/异步事件监听的轻量事件发射器 |
| `DomElements` | Class | 跨浏览器 DOM 尺寸测量、位置计算与类名操作工具集合 |
| `Observer` / `Observable` | Class | 轻量观察者模式封装，服务于非 RxJS 场景下的内部状态订阅 |

## 架构与设计模式

- **零上层依赖**：`@dotos1/dui/base` 不依赖任何其它 `@dotos1/dui/*` 二级入口，处于依赖拓扑的最底层，确保不会产生循环依赖（Circular Dependency）。
- **配置驱动模型基石**：`DuiBase` 为 `container`、`form`、`ui` 等模块中的 JSON `config` 驱动型组件提供了统一的初始化与属性挂载约定。

## 典型用法与最佳实践

绝大多数业务场景下，应用代码无需直接从 `@dotos1/dui/base` 导入符号；仅当你需要自定义扩展 DUI 底层基类或事件机制时按需引入：

```typescript
import { DuiBase, AngularEventEmitter } from '@dotos1/dui/base';

export class CustomWidgetModel extends DuiBase {
  readonly stateChange = new AngularEventEmitter<string>();

  emitStatus(status: string): void {
    this.stateChange.emit(status);
  }
}
```
