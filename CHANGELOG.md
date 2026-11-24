# 更新记录

## 未发布

### 新增：平台统一错误处理（错误处理整改 S3，dui 部分；未发包、未改版本号）

- `parseHttpError(err): PlatformError`（`@dotos1/dui/net`）：兼容统一错误体（`code` / `message_key` / `message_args` / `details` / `hint` / `request_id`）、兼容期 aios 数字 `code` + `error_code`、老式 `{success:false,message}`、aios Result、2xx + `success:false`（`parseSuccessFalse`）、断网 / 跨域不可达（status 0）、超时、普通 Error。文案优先 `message_key` 翻译，其次 `message`，最后按状态码取 i18n；绝不显示 `HttpErrorResponse.message`（Angular 拼的英文 + URL）。请求号取 body 或响应头 `X-Request-ID`。
- `ErrorInterceptor` 重写：用 `parseHttpError` + `ErrorNotifyService` 统一提示；403 统一「无权访问」；请求上下文 `SKIP_GLOBAL_ERROR` 由页面自理。401 默认不弹（可能正在刷新令牌），宿主在刷新失败后调 `ErrorNotifyService.sessionExpired()`，或用 `ERROR_INTERCEPTOR_OPTIONS` 设 `notifyOn401: true`。2xx + `success:false` 的全局提示由 `ERROR_INTERCEPTOR_OPTIONS.notifyOnSuccessFalse` 控制，默认 false（与改前一致，不弹）；迁移顺序：宿主页面先加 `SKIP_GLOBAL_ERROR` 或清理自弹，再打开开关，否则双弹。构造函数参数由 `ToastrService` 改为 `Injector`。
- `ErrorNotifyService`：统一出口；5xx 用对话框（`ErrorDialogComponent`，显示请求号、「复制请求号」，设置 `reportHandler` 后出现「报告问题」），其余 toast；3 秒内相同指纹去重。
- `RequestRingBuffer` + `RequestRingBufferInterceptor`：保留最近 20 条请求（方法、脱敏 URL、状态、耗时、request_id，不存请求体）；`snapshot()` 读取。已加入 `httpInterceptorProviders` / `simpleInterceptorProviders` 最外层。`ProfilerInterceptor` 保留（仍只打控制台），但 URL 改用 `sanitizeUrl` 脱敏。
- `PlatformErrorHandler`（Angular `ErrorHandler` 基类）：走 `ErrorNotifyService`；可覆盖 `report(payload)`（payload 含脱敏 `router.url`、最近请求）供后续上报。
- `sanitizeUrl`：去掉查询串中 token / ticket / captcha / code / password / secret 的值。
- i18n：新增 `ERROR.*` 20 个键（12 个语种）。

### 新增：错误对话框、整改指南与多语言（错误处理整改 S3 第二轮，dui 部分；未发包、未改版本号）

- `PlatformError` 扩展：`hint` / `hintKey`、`solution`（数组 `["1. …"]` 与换行字符串两种形状都归一为去序号的步骤数组）/ `solutionKey`、`helpUrl`（只保留 http(s) 与站内路径）、`details[]`（`field`、`fieldKey`、`code`、`message`、`expected`、`actual`、`hint`、`hintKey`）。`parseHttpError` 容错解析，字段缺失不报错。注意：旧版把 `solution` 字符串当 `hint` 用，现在 `hint` 只取 `hint`，`solution` 单独成字段。
- 新增 `renderPlatformError(error, translate)`：有翻译键（`message_key` / `hint_key` / `solution_key` / `field_key`，带 `message_args`）时按当前界面语言渲染，否则用后端已渲染文本；另导出 `normalizeSolution`。
- 提示形态：带 `solution` / `details` 的错误（所有 4xx 定制错误）与所有 5xx 一律弹 `ErrorDialogComponent`：标题 → 下一步 → 编号解决步骤（`<ol>`）→ 字段问题清单（字段、期望、实际、怎么改）→ 帮助文档（新标签打开）→ 请求号（可复制）→「报告问题」。5xx 缺 `solution` 时显示通用三步。toast 只留给没有任何指南的轻量提示。对话框打开期间到来的其它错误合并进同一个对话框分条显示，不叠多个；3 秒内同指纹不重复弹。`ErrorDialogData` 改为 `{ errors: Signal<PlatformError[]>, onReport? }`（上一轮未发包，无外部使用）。可键盘关闭（Esc）、`role="alertdialog"`、焦点进入对话框并在关闭后还原；暗色取自 `ThemeService.getTheme().type`；样式只用逻辑属性（ar_SA RTL）。
- `ErrorInterceptor` 给相对地址与同源请求加请求头 `X-Dotos-Lang: <当前界面语言，如 zh_CN>`（`LANG_HEADER`），后端据此渲染错误文案；跨域第三方地址不带。
- i18n：`ERROR.*` 新增 14 个键（复制、下一步、解决步骤、字段问题、字段、期望、实际、怎么改、帮助文档、新标签提示、多错误标题、通用三步），12 个语种均为真实翻译；界面语言切换时已打开的对话框文案随之切换。

### 修复

- 去掉硬编码英文兜底：`AuthService` 的 `'Server error'`（两处）改走 i18n；表单选项服务（select / field）的 `'Error'` 改走 i18n。`AuthService` 登录失败兜底不再显示 Angular 的 `err.message`。

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
