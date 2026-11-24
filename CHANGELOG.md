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
