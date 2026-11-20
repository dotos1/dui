# 更新记录

## 8.0.2

### 修复（dui#34，8.0.1 之后合入、此前未发版）

- 停靠布局面板 `init` 与令牌导出。
- `link-preview` 刷新。
- `FormModule` 自己引入 `LoadingModule`：此前宿主不另引 `LoadingModule` 时，`<dui-form>` 报 `NG0201: No provider for LoadingService`。
- Monaco 加载器与 duix 共用一个，加载路径可配。

### 文档

- `llms.txt`（随包给 AI 编码助手读的参考）重写表单一节并全文对照类型核对：
  - 「快速开始」写明宿主必须引入的模块（`FormModule.forRoot()`、`FormWrapperModule`、各字段模块、`LoadingModule`），示例改为可直接使用的独立组件写法；原示例只引 `FormModule`，`text-field` 等字段实际并未注册。
  - 新增字段类型（`xtype`）清单与各自所属的模块，`wrappers` 可选项，常用字段属性。
  - 新增「表单校验与按钮联动」：`required` / `min` / `max` / `minLength` / `maxLength` / `pattern` 与错误键（`minlength`、`maxlength` 全小写）、各 `*Text` 提示属性与 `validation.messages`、自定义校验器；按钮随表单状态联动的两种写法（宿主按 `form.valid` 等控制，或 `dui-button` 的 `disableExpression` / `hideExpression`）；`submit()` 的行为与注意点。
  - 40 处指令输入名原写成属性名，实际绑定名是别名（如 `[duiLoadingType]`、`[popoverPositionX]`），已改正；`i18n`、`theming` 两个入口没有 TypeScript 导出，已如实说明。
- README 同步上述入口说明。组件代码没有改动。
