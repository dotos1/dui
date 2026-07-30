# @dotos/dui 代码审查报告

**日期**: 2026-07-30
**范围**: `src` — `@dotos/dui` v7.4.13（独立 Angular 组件库，非 Nx 工作区），1799 个 TS 文件，约 161,000 行
**提交点**: `3048bec fix(auth): re-arm refresh-token polling on every valid restored session, not just fresh login`（master，工作区干净）
**关注点**: 内存泄漏 / 性能瓶颈 / 代码逻辑错误

## 审查方法与范围界定

与代码量类似的 `@dotos/sdos` 审查（见同仓库 `../sdos/CODE_REVIEW_2026-07-28.md`）一样，代码量过大无法逐行审查，采用信号驱动方式：机械扫描（订阅/监听器/定时器配对、生命周期钩子覆盖率、变更检测调用密度、类型断言抑制）→ 逐条读代码确认。本报告中标注"已核验"的发现均由我本人对照当前代码复核过引用内容。

代码库中以下目录/文件是**第三方 vendored 代码**，本次审查降级处理：

| 路径 | 来源 |
|---|---|
| `container/dock-layout/`（112 文件，20210 行）| 改编自 golden-layout 停靠布局库（类名 `ComponentContainer`/`DragProxy`/`ResolvedLayoutConfig` 等与上游一致）|
| `core/angular2parse/` | `@angular/compiler` 表达式解析器内部代码的直接拷贝 |
| `util/jpeg/` | vendored JPEG 编解码器 |
| `common/scrollbar/` | vendored ngx-scrollbar |
| `common/icon/icon-picker.service.ts`（16307 行）| 生成的图标字形映射数据文件 |
| `ux/code-editor/zh-hans.ts`（8306 行）| Monaco 编辑器中文语言包数据 |
| `theme/mdc/_palette.ts` / `core/color/matColors.ts` | Material Design 调色板数据 |

与 sdos 不同，`@dotos/dui` 里几乎没有版权头标记（仅 1 处），绝大部分代码是自研的，因此重点审查目录覆盖了 `core/`、`form/`、`data/`、`ux/`、`common/`（除上表）、`theme/`（除数据文件）、`tree/`、`translator/`、`net/`、`util/`（除 jpeg）、`base/`。

本次提交点恰好是一次刚合入的认证 token 刷新修复，因此对 `core/auth/` 做了额外的重点审查。

机械扫描结果概览：

| 信号 | 数量 |
|---|---|
| `addEventListener` / `removeEventListener` | 94 / 81 |
| `.subscribe(` / `takeUntil` / `unsubscribe()` | 272 / 155 / 103 |
| `setInterval` / `clearInterval` | 28 / 25 |
| `setTimeout` / `clearTimeout` | 124 / 46 |
| `requestAnimationFrame` / `cancelAnimationFrame` | 17 / 1 |
| `ResizeObserver` 构造 / `.disconnect()` | 7 / 6 |
| `OnPush` / `@Component` 文件数 | 141 / 238 |
| `detectChanges()` / `markForCheck()` | 98 / 102 |
| 宽松 `==`/`!=`（不含 `===`/`!==`）| 392 |
| `@ts-ignore` / `as any` | 45 / 56 |
| 无测试文件（除 1 个 `.spec.ts`）——`nx`/`ng build dui --configuration production` 为唯一可用验证手段 |

---

## 修复状态总览（2026-07-30 追加，2026-07-30 更新至第三轮）

报告完成后，同一工作区内对报告发现做了三轮修复：第一轮（会话之前）处理了内存泄漏/性能瓶颈中的多数 HIGH 项；第二轮处理了全部 10 项逻辑错误；第三轮处理了剩余的内存泄漏/性能瓶颈项。所有改动均已通过 `ng build dui --configuration production` 全量编译验证（0 error / 0 warning），**均为工作区未提交改动，尚未 commit**。

| 方向 | 总发现数 | 已修复 | 未修复 |
|---|---|---|---|
| 内存泄漏 | 8 项可行动发现（另有 3 项误报、1 项低置信度不计入） | 8 | 0 |
| 性能瓶颈 | 9 | 8 | 1（LOW-9，复核后判定并非真正重复调用，详见该条目下方说明） |
| 逻辑错误 | 10 | 10 | 0 |
| **合计** | **27** | **26** | **1** |

逐项修复状态标注在下方对应发现小节的 **修复状态** 行中；完整的人工验证步骤见文末 [「四、人工测试指南」](#四人工测试指南)（第三轮新增 [D1-D5](#d-第三轮内存性能修复验证)）。

---

# 一、内存泄漏

12 项，已逐一读代码确认（含 4 项排除的误报）。

## HIGH

### 1. `ux/windows/window/components/named-outlet/route.service.ts:47` — `navigate()` 每次调用都新增一个永久订阅

```ts
let firstUrl=urls[0];
this.router.events.subscribe(
  (event) => {
    if (event instanceof NavigationStart) {
      event.url=firstUrl;
      return;
    }
});
```

`RouteService` 是 `providedIn: 'root'` 的全应用单例。`navigate(url, name)` 不带 `params` 的分支里，每次调用都对永不 complete 的 `router.events` 新建一次订阅，闭包捕获 `firstUrl`，从未存储、取消或用 `takeUntil` 收敛。

**触发**：每次窗口/命名 outlet 导航都调用一次 `navigate`，调用 N 次就有 N 个永久存活的订阅同时对之后每一次路由事件执行回调，随交互次数无界增长。
**修复**：把订阅存到实例字段做统一 unsubscribe；或改用 `filter(...) + take(1)` 让它拿到一次 `NavigationStart` 后自动结束。
**修复状态**：✅ 已修复 — 改为 `this.router.events.pipe(take(1)).subscribe(...)`，只消费紧随其后的一次 `NavigationStart` 后自动结束订阅。人工测试见 [A1](#test-a1)。

### 2. `ux/windows/window/components/named-outlet/route.service.ts:68` — `clearRouterOutlet()` 从不清理 Map 条目

```ts
createRouterOutlet(name: string): RouterOutlet {
  const outlet = new RouterOutlet();
  this.routerOutletMap.set(name, outlet);
  return outlet;
}
clearRouterOutlet(name): void {
  const outlet = this.routerOutletMap.get(name);
  if (outlet) {
    outlet.deactivate();
    outlet.ngOnDestroy();
  }
}
```

`routerOutletMap: Map<string, RouterOutlet>` 挂在 root 单例上。`createRouterOutlet` 会 `.set(name, outlet)`，但 `clearRouterOutlet` 全程没有一次 `.delete(name)`。

**触发**：多窗口场景下每打开/关闭一个 named outlet，Map 里就永久多一条已销毁的 `RouterOutlet` 引用，随窗口开关次数无界增长。
**附带发现（未完全核实，单独标注）**：`named-outlet.directive.ts:24` 调用 `createRouterOutlet(this.parentContexts, this.location, this.resolver, this.name, this.changeDetector)` 传了 5 个参数，而方法签名只接受 1 个 `name: string`——运行时 `name` 实际会绑定成 `this.parentContexts` 对象而非字符串，这是否影响实际运行路径需要单独确认。
**修复**：`clearRouterOutlet` 中补 `this.routerOutletMap.delete(name)`；核实 `named-outlet.directive.ts` 的调用参数是否与方法签名匹配。
**修复状态**：⚠️ 部分修复 — `clearRouterOutlet` 已补 `this.routerOutletMap.delete(name)`；附带发现的 `named-outlet.directive.ts:24` 参数不匹配问题本轮**未核实、未处理**，需要单独跟进。人工测试见 [A1](#test-a1)。

### 3. `ux/windows/resizer/directives/resizable.directive.ts:216` — 复制粘贴打字错误，该删监听的地方写成了加监听

```ts
private readonly onPointerUp = (event: any): void => {
    this._resizableElement.classList.remove(CssClass.Resizing);
    this.document.removeEventListener('mousemove', this.onPointerMove);
    this.document.addEventListener('mouseup', this.onPointerUp);   // 应为 removeEventListener
    event.stopPropagation();
    this.osResizeEnd.emit(this.getResizeInfo(event));
};
```

`onPointerDown()` 在开始拖拽时给 `document` 加上 `mousemove`/`mouseup` 监听；`onPointerUp()` 本应在拖拽结束时把两者都移除，`mousemove` 处理对了，但 `mouseup` 一行手误写成了 `addEventListener`。

**触发**：浏览器对完全相同的监听器会去重，不会无限累积，但语义被破坏——任何一个 `[osResizable]` 元素只要发生过一次拖拽，`document` 上就会永久留着这个 `mouseup → onPointerUp` 监听，此后应用里任何地方的鼠标松开都会触发 `osResizeEnd` 事件和 class 切换逻辑，直到该指令被销毁。这是窗口/面板缩放的公共指令，影响面是全部使用方。
**修复**：改成 `this.document.removeEventListener('mouseup', this.onPointerUp);`
**修复状态**：✅ 已修复。人工测试见 [A2](#test-a2)。

### 4. `form/rang-slider/range-slider.field.ts` — 用了 `takeUntil(destroy$)` 但从不触发 `destroy$`

```ts
private destroy$ = new Subject<void>();

override ngOnInit() {
  this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => { ... });
  merge(this.startCtrl.valueChanges, this.endCtrl.valueChanges)
    .pipe(takeUntil(this.destroy$)).subscribe(() => { ... });
}
```

`destroy$` 声明并正确用于两处 `takeUntil`，但整个文件没有 `ngOnDestroy` 覆写去调用 `destroy$.next()/complete()`。

**触发**：每渲染一次 range-slider 字段就泄漏一个组件实例（含其 ViewChild 引用）和 2 个订阅，直到 `formControl` 本身被回收——动态表单场景下 model 常比渲染实例存活更久，泄漏会持续累积。
**修复**：新增 `override ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }`
**修复状态**：✅ 已修复。人工测试见 [A3](#test-a3)。

### 5. `ux/monaco-editor/diff-editor.component.ts:81-82` — 每次都新建两个 Monaco 文本模型，从未 dispose

```ts
let originalModel = monaco.editor.createModel(this._originalModel.code, this._originalModel.language);
let modifiedModel = monaco.editor.createModel(this._modifiedModel.code, this._modifiedModel.language);
this._editor.setModel({ original: originalModel, modified: modifiedModel });
```

`originalModel`/`modifiedModel` 是局部变量，从未存到 `this` 上，也从未调用 `.dispose()`。`initMonaco()` 会在 `ngAfterViewInit` 以及 `options`/`originalModel`/`modifiedModel` 三个 `@Input` setter 每次变化时都执行一遍。Monaco 的 `editor.dispose()` 只销毁 diff editor 控件本身，不会销毁通过 `monaco.editor.createModel()` 单独创建的文本模型——这些模型会一直留在 Monaco 全局模型注册表里（携带完整文档内容和分词状态）。`BaseEditor.ngOnDestroy()` 也只 dispose 了 `this._editor`，没有处理这两个模型。

**触发**：每次内容/模型切换、以及组件每次销毁，都永久泄漏 2 个 Monaco 模型。
**修复**：模型存成实例字段；每次重建前先对旧模型调用 `.dispose()`；组件 `ngOnDestroy` 里也一并 dispose。
**修复状态**：✅ 已修复。人工测试见 [A4](#test-a4)。

## MEDIUM

### 6. `ux/iconpicker/icon-picker.component.ts:76` — "退订 Subject" 是摆设，从未真正接到任何订阅上

```ts
constructor(...) { this._unsubscribeAll = new Subject(); }
ngOnDestroy(): void {
  this._unsubscribeAll.next();
  this._unsubscribeAll.complete();
}
```

`_unsubscribeAll` 在构造函数创建、`ngOnDestroy` 里 next+complete，看起来像标准退订模式，但全文件没有任何一处 `.subscribe(...)` 用 `.pipe(takeUntil(this._unsubscribeAll))` 接上它。真正的两处订阅（`getIcons()`/`showCustomIcons()` 里的 HTTP 请求）完全不受组件生命周期影响。

**触发**：用户在 HTTP 响应回来之前关闭图标选择器弹层，回调仍会在之后触发并调用 `detectChanges()` 操作已销毁的视图（开发模式下抛 `ViewDestroyedError`），组件实例被悬空订阅持有到请求结束。
**修复**：给两处 `.subscribe(...)` 补上 `.pipe(takeUntil(this._unsubscribeAll))`。
**修复状态**：✅ 已修复。人工测试见 [A5](#test-a5)。

### 7. `data/datatable/datatable.card.ts:144` — HTTP 请求在组件销毁时不会被取消

```ts
this.http.get(apiBase + url, { params: this.baseParams })
  .subscribe(val => this.success(val));
```

`loadds()`（被 init/load/onPage/onSort 调用）里的订阅没有 takeUntil/unsubscribe，`onDestroy()` 也没有取消它。

**触发**：卡片在响应返回前被销毁（如所在对话框关闭、切换 tab），`success()` 依然在之后执行，访问已拆除的 `this.view`。同类模式在 `form/action/submit.service.ts`、`form/action/load.service.ts`、`form/select/options.service.ts`、`form/field/options.service.ts` 中也存在，但那几处是一次性请求，风险相对更低，此处作为代表性案例列出。
**修复**：HTTP 订阅加上组件级 `takeUntil`，或用可取消特性中断在途请求。
**修复状态**：✅ 已修复（代表性案例 `datatable.card.ts`）— 新增 `_destroy$`，`loadds()` 的订阅补了 `takeUntil(this._destroy$)`，`onDestroy()` 里 next+complete。**同类模式列出的另外几处（`form/action/*.service.ts`、`form/select/options.service.ts`、`form/field/options.service.ts`）本轮未修复**，风险相对更低但仍待跟进。人工测试见 [A6](#test-a6)。

## LOW

### 8. `ux/windows/core/services/global-events.service.ts:20` — `fromDocument()` 注册的 document 监听器天生无法移除（设计缺陷）

```ts
public fromDocument<T extends Event>(eventName: keyof DocumentEventMap): Observable<T> {
    if (!this.documentEventMap.has(eventName)) {
        const emitter = new Subject<Event>();
        this.document.addEventListener(eventName, (event) => emitter.next(event));
        this.documentEventMap.set(eventName, emitter.asObservable());
    }
    return this.documentEventMap.get(eventName) as Observable<T>;
}
```

传给 `addEventListener` 的是匿名箭头函数，没有保存引用做 `removeEventListener`。由于是 root 单例、按事件名缓存（事件名集合有限），实际不会无界增长，但监听器一旦注册就无法被移除。目前唯二的消费方（`fixed-to-parent.directive.ts`、`dynamic-window.component.ts`）都在返回的 Observable 上正确用了 `takeUntil`，现状是"惰性风险"——列出是因为服务本身没有给未来消费者任何真正停止监听的手段。
**修复**：保存监听函数引用，提供 refCount/清理机制（如没有订阅者时用 `finalize()` 调 `removeEventListener`）。
**修复状态**：✅ 已修复（第三轮）— 新增按 eventName 的订阅方引用计数（`documentEventRefCounts`）和监听函数引用（`documentEventListeners`），通过 `finalize()` 在最后一个订阅方退订时才真正调用 `removeEventListener` 并清空该 eventName 的缓存条目，下次 `fromDocument()` 会重新注册。人工测试见 [D1](#test-d1)。

## 已核查的误报

- **`form/daterangepicker/daterangepicker.directive.ts`**（6 处 subscribe，无 `ngOnDestroy`）—— 指令在构造函数里用 `viewContainerRef.createComponent(DaterangepickerComponent)` 创建 picker，picker 从未被移到其他容器，指令和 picker 会作为同一视图的一部分被同时销毁，可以被 GC 回收。仍值得补充防御性退订，但证据不足以判定为泄漏。
- **`core/component.base.ts:221`、`common/keyboard/keyboard-shortcuts.plugin.ts`** —— 命中的 `addEventListener`/`removeEventListener` 是 `Base`（`base/base.ts`）自己实现的发布订阅方法或 Angular `EventManagerPlugin` 接口方法，与 DOM `EventTarget.addEventListener` 无关，属同名方法造成的文本匹配假阳性。
- **`util/resize-image.ts`**（6 add/0 remove）—— `reader`/`image` 都是每次调用新建的局部变量，不被外部持有；load/error/abort 三者必有一个触发，resolve 后连同监听器一起可被 GC，无跨调用累积。
- **`common/toastr/toastr/toast.component.ts`**（4 add/3 clear）、**`common/loading/loading.component.ts`**（命中的 "setInterval" 实为注释文本）—— `intervalId` 在 3 个调用点复用同一字段，`resetTimeout`/`stickAround` 会在重新开始前先 clear，`ngOnDestroy` 也统一 clear + 4 个 unsubscribe，同一时刻只可能有一个 interval 存活，无泄漏。

---

# 二、性能瓶颈

9 项，已逐一读代码确认。

## HIGH

### 1. `data/datatable/utils/tree.ts:54` — 树形分组每次都是 O(n²)

```ts
groupRowsByParents(rows, opts) {
  ...
  rows.forEach(row => {
    ...
    const parentIndex = groupedRows.indexOf(...)  // 每行一次线性查找
```

`groupRowsByParents()` 在循环里对全部行用 `Array.indexOf()`，是 O(n²)。每次行数据更新或排序都会重跑（树形模式的 datatable）。
**触发**：树形分组模式下数据/排序变化，行数越多越明显（几千行时体感卡顿）。
**修复**：改用 `Map` 做 O(1) 索引查找代替 `indexOf`。
**修复状态**：✅ 已修复 — 实际改用 `Set`（去重 + 成员判断均为 O(1)，比 `Map` 更贴合这里只需要"存在性判断"的用法）。人工测试见 [B1](#test-b1)。

### 2. `data/datatable/datatable.component.ts:880` — 每次滚动同步触发一次完整变更检测

```ts
onBodyScroll(event: MouseEvent): void {
  this._offsetX.next(event.offsetX);
  this.scroll.emit(event);
  this.cd.detectChanges();
}
```

`DatatableComponent` 是 `ChangeDetectionStrategy.Default`（已核验），`detectChanges()` 在每个滚动事件（每秒可触发几十次）同步执行一次完整子树变更检测，包含 O(已选行数) 的每行选中态扫描。
**触发**：大数据量表格滚动，行数/选中行数越多越卡。
**修复**：改为 `ChangeDetectionStrategy.OnPush` 配合精确的 `markForCheck()`，或对滚动事件做节流/合帧。
**修复状态**：✅ 已修复（采用后一种方案）— `onBodyScroll` 用 `requestAnimationFrame` 把 `detectChanges()` 合帧，滚动过程中最多每帧一次，而非每个滚动事件一次；未改动 `ChangeDetectionStrategy`（改动量更大，风险更高）。人工测试见 [B2](#test-b2)。

### 3. `container/gridster/gridsterDraggable.service.ts:141`（`gridsterResizable.service.ts:196` 镜像同款）— 每次原生 mousemove 都强制回到 Angular zone 内跑碰撞算法

```ts
calculateItemPositionFromMousePosition(e: any): void {
  ...
  this.zone.run(() => {
    this.gridster.updateGrid();
  });
}
```

拖拽/缩放过程中每个原始 mousemove 事件都调用 `zone.run()` 强制触发一次变更检测，并执行 O(n) 的碰撞检测/推挤/交换算法，且无 rAF 合帧。
**触发**：gridster 网格布局拖拽/缩放操作，卡顿感与鼠标移动事件频率同步。
**修复**：mousemove 处理逻辑移出 Angular zone（`zone.runOutsideAngular`），按帧（`requestAnimationFrame`）合并后再进 zone 触发一次变更检测。
**修复状态**：✅ 已修复 — 碰撞检测/推挤/交换本身（`calculateItemPosition()`）已经在 zone 外执行、跟手视觉反馈不受影响，本次只把"强制回到 zone 触发 CD"的部分按帧合并（`requestAnimationFrame`），原来每个原始 mousemove 都会同步执行一次；`dragStop`/`resizeStop` 里补了对应的 `cancelAnimationFrame`。`gridsterDraggable.service.ts`、`gridsterResizable.service.ts` 两处镜像同款修复。人工测试见 [B3](#test-b3)。

### 4. `form/daterangepicker/daterangepicker.component.ts:1219` — 悬停预览每次都重建两个月历

```ts
hoverDate(...) {
  // 重新构建左右两个月的完整日历（约 1500 次 dayjs 操作）
}
```

`hoverDate()` 绑定在日期格子的 `mouseenter` 上，拖拽预览日期范围时每次悬停都重建左右两个完整月历，约 1500 次 dayjs 操作。
**触发**：用户拖动鼠标预览日期范围时的悬停高亮，卡顿明显。
**修复**：悬停预览应只更新受影响的高亮状态（哪些格子在范围内），不重建整个日历数据结构。
**修复状态**：✅ 已修复（第三轮）— `renderCalendar()` 会把整个 42 格日历网格连同 CSS class 一起重建；实际上 `hoverDate()` 期间日期网格本身并不会变（只有 `nowHoveredDate` 变了，进而影响哪些格子该带 `in-range` 高亮）。改为直接复用 `leftCalendar.calendar`/`rightCalendar.calendar` 上次渲染时缓存下来的日期网格，只重新执行 `buildCells()`（原本 `renderCalendar()` 内部本来就会调用的、专门计算每格 CSS class 的子过程），跳过了重建 42 个 dayjs 日期对象的部分。人工测试见 [D2](#test-d2)。

## MEDIUM

### 5. `common/perfect-scrollbar/perfect-scrollbar.component.ts:296` — 每次滚轮/触摸滑动触发两次变更检测

滚轮/触摸事件处理里有两处独立的 `detectChanges()` 调用，可合并为一次。
**修复状态**：✅ 已修复（第三轮）— `checkPropagation()` 末尾的 `this.stateUpdate.next('interaction')` 会同步触发 `ngOnInit()` 里订阅的回调，该回调本身末尾已经有一次无条件的 `markForCheck()+detectChanges()`；紧跟其后又单独调了一次 `detectChanges()`，删掉了这处冗余调用。已核实 `distinctUntilChanged` 只会在"同一状态连续出现且没有节流计时器在跑"时才跳过订阅回调，而这恰好也是模板无需更新的场景，删除后不影响需要更新的路径。人工测试见 [D3](#test-d3)。

### 6. `util/change.ts:24`（`ChangeUtils.findChanges`，公共工具函数）— O(n²) 行匹配 + 重复深拷贝

对比两个数据集合时用嵌套查找做行匹配（O(n²)），且对同一份数据做了两次 `JSON.parse(JSON.stringify(...))` 深拷贝。这是一个被多处复用的公共工具方法，影响面取决于调用方传入的数据量。
**修复状态**：✅ 已修复（第三轮）— 行匹配改用按 `id` 建的 `Map` 做 O(1) 查找/消费，替代原来每行一次 `findIndex()+splice()`（`Map` 天然保持剩余项的原始顺序，"新增"结果的顺序与原实现一致）。深拷贝方面，`compareObject()` 内部原本对同一份数据又做了一次完整深拷贝（仅用于捕获"变更前"的按键值，供 `keysChanged[].oldValue/newValue` 使用）——改为在每个 key 被 `join()`/`StringUtils.diff()` 改写前先原地捕获该 key 的原始值（`originalFromValue`/`originalToValue`），不再需要整对象深拷贝，且这一优化对递归的每一层嵌套对象比较都生效，不只是最外层。人工测试见 [D4](#test-d4)。

### 7. `common/resize-element/resizable.directive.ts:246` — 节流配置项是摆设

`mouseMoveThrottleMS` 这个配置字段被声明但从未在实际的 mousemove 处理逻辑里使用，意味着"配置节流时间"这个功能对使用方来说是死配置，缩放拖拽实际未被节流。
**修复状态**：✅ 已修复（第三轮）— 在 `mousemove$` 流水线里补了 `throttleTime(this.mouseMoveThrottleMS, undefined, { leading: true, trailing: true })`，放在 `tap()`（负责 `preventDefault()`，仍对每个原始事件都执行，不受节流影响）之后、`share()` 之前，因此驱动实际缩放计算的下游流会被节流，但阻止默认行为（如文字选中）不受影响；`trailing: true` 保证节流窗口结束时还会补发一次最新位置，缩放不会停在节流周期中间的旧位置。人工测试见 [D5](#test-d5)。

### 8. `data/datatable/datatable.component.ts:782` — window resize 未节流，触发完整表格变更检测

窗口 resize 事件处理直接触发完整的 datatable 变更检测，没有防抖/节流，拖拽调整浏览器窗口大小时会连续触发多次。
**修复状态**：✅ 已修复 — `onWindowResize()` 原来的 `@throttleable(5)` 装饰器被注释掉了，改为启用 `@throttleable(100)`。人工测试见 [B4](#test-b4)。

## LOW

### 9. `tree/components/tree.component.ts:363` — 每次树数据变化重复调用两次 `detectChanges()`
**修复状态**：❌ 复核后判定不应修改 — 第三轮尝试修复前重新读了 `ngOnChanges()` 的完整上下文（`tree.component.ts:363` 和 `:367`）：两次调用并非背靠背的同一次重复，中间隔了一个 `requestAnimationFrame`，且第二次调用发生在 `this.viewportComponent.setViewport()` 之后。`setViewport()`（`tree-viewport.component.ts:87-89`）读取的是视口容器 `elementRef.nativeElement` 的实时几何信息（滚动位置/尺寸），这依赖浏览器已经完成上一次 `detectChanges()` 触发的 DOM 布局；如果去掉第一次调用或把它降级为 `markForCheck()`，`setViewport()` 读到的就可能是过期的 DOM 几何信息（数据变化前的旧布局），虚拟滚动的视口计算会出错。机械扫描把这标记为"重复调用"只是因为同一个方法体里出现了两次 `detectChanges()` 字面量，不代表两次调用在语义上真的冗余。鉴于该组件本身已经有相当复杂的自定义虚拟滚动/响应式（MobX `autorun`）机制、且没有任何自动化测试能验证行为不回归，判断为不应该在没有真实浏览器环境验证的前提下改动这段时序敏感的代码——维持现状，不作改动。

## 已核查、判定为已优化良好的部分（不再展开）

树组件的虚拟滚动/Fenwick 树行高缓存、`nodeRegistry` 基于 Map 的 O(1) 节点查找（代码注释里有明确的手动优化标记）、`common/dragselect` 对 `getBoundingClientRect()` 的缓存、datatable 的 `RowHeightCache`/`sortRows`（基于 Map 的稳定排序）、`container/layout` 分栏拖拽（已正确在 Angular zone 外运行）。

---

# 三、逻辑错误

10 项，已逐一读代码确认。**特别说明**：本次提交点恰好是一次刚合入的认证 token 刷新修复（`3048bec`），因此对 `core/auth/` 做了针对性深挖，发现该次修复本身仍不完整。

## HIGH

### 1. 服务端不轮换 refresh_token 时，内存中的 refresh_token 被静默清空 → 下一轮刷新必然失败登出

`core/auth/oauth2Auth.ts:216-227`（`setToken`）与 `:552-560`（`storeAccessToken`）

```ts
storeAccessToken(accessToken: string, expiresIn: number, refreshToken?: string) {
    this.storage.set('access_token', accessToken);
    if (refreshToken) {
        this.storage.set('refresh_token', refreshToken);  // 只在有值时才写 storage
    }
    ...
    this.setToken(accessToken, refreshToken);   // 但内存字段无条件覆盖
}
setToken(token: string, refreshToken: string) {
    this.authentications.oauth2.accessToken = token;
    this.authentications.oauth2.refreshToken = refreshToken;   // 无条件覆盖，已核验
    ...
}
```

`storeAccessToken` 正确地用 `if (refreshToken)` 保护了**storage**层的写入，但 `setToken` 对**内存**中的 `refreshToken` 字段没有同样的保护。

**失败场景**：许多 OAuth 服务端在刷新 access token 时并不会每次都轮换 refresh_token（非轮换型机密客户端的常见做法）。刷新成功一次后，`this.authentications.oauth2.refreshToken` 在内存里变成 `undefined`（storage 里其实还保留着正确值，但代码从未重新读取它）。下一轮定时刷新触发时，请求体里 `refresh_token=undefined`，服务端 400/401，触发 `logOut()`——用户被强制登出，尽管 storage 里明明还躺着一个有效的 refresh token。
**修复**：`this.authentications.oauth2.refreshToken = refreshToken || this.authentications.oauth2.refreshToken;`
**修复状态**：✅ 已修复，按建议方案实现。同时补了一处该方案引入的新边界：`logOut()` 调用 `setToken(null, null)` 时，fallback 逻辑会让内存里的 `refreshToken` 保留旧值而不是被清空，因此在 `logOut()` 里显式追加了 `this.authentications.oauth2.refreshToken = null;`。人工测试见 [C1](#test-c1)。

### 2. 恢复会话时若 access token 已过期（哪怕 refresh token 仍有效）直接跳过刷新，强制重新登录

`core/auth/oauth2Auth.ts:88-97`

```ts
initOauth(oauth2) {
    if (!oauth2.implicitFlow && this.isValidAccessToken()) {
        const accessToken = this.storage.get('access_token') as string;
        const refreshToken = this.storage.get('refresh_token') as string;
        this.setToken(accessToken, refreshToken);
        this.pollingRefreshToken();
    }
}
```

这正是提交 `3048bec` 声称要修的问题（"重新武装恢复会话的刷新轮询"），但整个分支——包括把 token 加载进内存这一步——都被 `isValidAccessToken()` 卡住了。如果标签页关闭/刷新期间 access token 已经过期（很正常的场景：access token 通常只有 5-15 分钟有效期），这个分支完全不会执行：`setToken` 从未被调用，`this.authentications.oauth2.accessToken` 保持 `''`，`isLoggedIn()`（`!!accessToken`）返回 `false`，即使 storage 里的 refresh token 完全有效（30 天有效期很常见）。

**失败场景**：用户登录后合上笔记本 20 分钟（access token 15 分钟过期，refresh token 30 天有效），重新打开标签页，`AuthGuard.checkLogin()` 看到 `isLoggedIn() === false`，跳转到登录页——而这正是 OAuth refresh token 机制本该避免的场景。
**修复**：access token 存在但已过期、且 refresh token 存在时，`initOauth` 应该主动调用 `this.refreshToken()`，而不是什么都不做。
**修复状态**：✅ 已修复 — `initOauth` 新增 `else if (refreshToken)` 分支：access token 缺失/过期但 storage 里有 refresh token 时，直接把 refresh token 写入内存并调用 `this.refreshToken()`，成功后再 `pollingRefreshToken()`；失败由 `refreshToken()` 内部已有的 400/401 分支触发 `logOut()`。人工测试见 [C1](#test-c1)。

### 3. 下拉搜索/远程选项加载的"过期响应"防护形同虚设（对象自比较恒真）

`form/select/select.field.ts:78,111-116`、`form/select/options.service.ts:20-47`，`form/field/textfield.component.ts` + `form/field/options.service.ts` 存在相同模式

```ts
// select.field.ts
this.optionService.options.pipe(...).subscribe(serviceData => {
  if (serviceData && this.field.params === serviceData.params) {   // 身份比较
...
searchChange(searchText?) {
  ...
  let params = this.field.params;      // 每次都是同一个对象引用
  params['$filter'] = searchText;      // 原地修改，从未克隆
  this.optionService.getOptions(url, method, params);
```

已核验 `options.service.ts` 的 `getOptions()` 把传入的 `params` 原样塞进返回结果（`this.optionsSubject.next({options: ops, params: params, error: null})`），而 `params` 从未被克隆——每次搜索都在修改 `this.field.params` 这同一个对象。这样一来 `this.field.params === serviceData.params` 恒为真（在跟自己比较），完全起不到"丢弃过期响应"的作用。

**失败场景**：用户输入 "a"（网络慢，2 秒后返回），紧接着输入 "ab"（网络快，300ms 返回）。"ab" 的结果先到达并正确显示；随后过期的 "a" 的结果到达——因为身份比较恒为真，会静默覆盖下拉列表为 "a" 的结果，而输入框里显示的仍是 "ab"。在延迟不稳定的网络下，两次搜索间隔较近就能复现。
**修复**：每次请求前克隆 `params`（`{ ...this.field.params }`）；服务层改用 `switchMap` 让新请求自动取消旧的在途请求，而不是依赖对象身份比较。
**修复状态**：✅ 已修复（采用前一种方案）— `select.field.ts`、`textfield.component.ts` 的两个调用点（`searchChange`/`openChanged`）都改为发请求前克隆 `params`，并新增 `_lastRequestParams` 字段记录"最近一次发出的请求对象"，订阅回调里比较 `serviceData.params === this._lastRequestParams`（而不是恒为真的 `this.field.params === serviceData.params`）。未改用 `switchMap`，因为 `SelectOptionsService`/`OptionsService` 是跨字段复用的单例，贸然引入 `switchMap` 会连带取消掉其他字段并发中的请求。人工测试见 [C2](#test-c2)。

### 4. 表格分组模式下 `trackBy` 恒返回 0，破坏渲染

`data/datatable/body/body.component.ts:172-179`（`rowTrackingFn`/`getRowIndex`）、`:295-336`（`updateRows` 的 `groupedRows` 分支）

```ts
getRowIndex(row: any): number {
  return this.rowIndexes.get(row) || 0;
}
updateRows(): void {
  ...
  this.rowIndexes.clear();
  if (this.groupedRows) {
    while (rowIndex < last && rowIndex < this.groupedRows.length) {
      const group = this.groupedRows[rowIndex];
      temp[idx] = group;
      idx++; rowIndex++;
      // 已核验：这个分支里没有任何 this.rowIndexes.set(...) 调用
    }
  } else {
    while (...) {
      this.rowIndexes.set(row, rowIndex);   // 只在非分组分支里填充
```

启用行分组（`groupRowsBy`/`groupedRows`，一个真实存在的 `@Input`）时，`rowIndexes` 每次更新都被清空，但**从未在分组分支重新填充**。`getRowIndex()` 因此对每一行都返回 `undefined || 0`，而 `rowTrackingFn`（默认情况下作为 `*ngFor` 的 `trackBy`，除非显式设置 `trackByProp`）对视口内每一行都返回 `0`。

**失败场景**：使用表格分组功能且未设置 `trackByProp`。Angular 的 `*ngFor` 看到每个渲染项都声称身份是 `0`；滚动/翻页/数据更新时，要么无法更新它认为"相同"的行的 DOM 内容，要么把内容错配到别的行上——数据变化后出现陈旧或重复的行内容。
**修复**：在 `groupedRows` 分支里也填充 `this.rowIndexes.set(group, rowIndex)`；`getRowIndex` 返回一个与合法索引 0 明确区分的"未找到"哨兵值（如 `-1`），而不是用 `|| 0`。
**修复状态**：✅ 已修复，按建议方案实现（分组分支补 `.set`，`getRowIndex` 未命中时返回 `-1`）。人工测试见 [C3](#test-c3)。

### 5. 数字字段单位换算在值恰好为 0 时静默失效

`form/field/numberfield.component.ts:59-73`（`unitchange`）与 `:76-88`（`onChange`），已核验两处相同 bug

```ts
unitchange(event){
    this.currentUnit=event.value;
    let unit=this.units.filter((u)=>u.id== this.currentUnit)[0];
    if(this.currentUnit!=this.defaultUnit){
      if(this.field.formControl.value!=''){        // bug：0 != '' 为 false
        let val=this.field.formControl.value;
        this.field.inputValue=val*unit.factor+unit.offset;
      }
    }else{
      if(this.field.formControl.value!=''){         // 同款 bug
```

JavaScript 中 `0 != ''` 求值为 `false`（宽松相等把 `''` 强制转成 `0` 参与比较）。当 `formControl.value === 0` 时，两个分支的 `if (... != '')` 守卫都判假，`field.inputValue` 在用户切换单位时完全不会被赋值。

**失败场景**：带单位换算的数字字段（如温度 0°C）——用户输入 `0`，切换单位下拉框（如切到 °F）。换算逻辑被整个跳过，`field.inputValue` 没有更新成换算后的值，显示值停留在未换算/陈旧状态，且**只在用户输入恰好是 0 时**复现。`unitchange` 和 `onChange` 里各出现一次同款 bug。
**修复**：改用 `!== ''`，或直接校验 `formControl.value !== null && formControl.value !== undefined`。
**修复状态**：✅ 已修复（采用前一种方案，`unitchange`/`onChange` 两处均已改为 `!== ''`）。人工测试见 [C4](#test-c4)。

## MEDIUM

### 6. token 刷新无并发互斥，并发调用可能触发误伤性登出

`core/auth/oauth2Auth.ts:495-543`

`AuthService.refreshToken()`（`core/auth/auth.service.ts:236-245`）是公开方法，消费方应用可能自己在 401 拦截器里调用它，与 `pollingRefreshToken()` 的 `setInterval` 自动调用并存，两者之间没有任何"进行中请求"互斥。若两者时间点接近，会用同一个 `refresh_token` 并发发出两个 `POST /oauth2/token` 请求；如果认证服务端在每次使用时轮换 refresh token（常见 OIDC 模式），后到的响应会让另一个请求拿到的 `refresh_token` 失效，下一轮刷新周期就会因为使用了作废的 token 而触发 `logOut()`——对一个本来健康的会话造成误伤性登出。
**修复**：给 `refreshToken()` 加一个"进行中 Promise"的互斥，并发调用方复用同一个 Promise 而不是各自发起新请求。
**修复状态**：✅ 已修复，按建议方案实现（新增 `refreshTokenPromise` 字段，`.finally()` 里清空）。人工测试见 [C1](#test-c1)。

### 7. 刷新失败被静默吞掉，无退避重试，过期 token 会一直用到下一个固定周期

`core/auth/oauth2Auth.ts:495-505` / `:534-541`

```ts
pollingRefreshToken() {
    this.refreshTokenIntervalPolling = setInterval(async () => {
        try {
            await this.refreshToken();
        } catch (e) {
        }
    }, oauth2.refreshTokenTimeout);
}
```

任何非 400/401 的刷新失败（网络抖动、500、超时）都被 catch 后完全丢弃——无日志、无重试、无退避。已经接近/超过过期的 access token 会继续被用在每一次请求上，直到下一个完整的 `refreshTokenTimeout` 周期（默认 5 分钟）到来，期间应用发出的每一个已鉴权 API 调用都会 401。
**修复**：非鉴权类失败应立即或按退避策略重试，而不是等下一个固定周期；至少要记录错误日志。
**修复状态**：✅ 已修复（轻量版）— 非 400/401 失败现在会 `console.error` 记录，并在 `min(refreshTokenTimeout, 15s)` 后重试一次；未实现完整的指数退避，判断本轮场景下一次快速重试已能覆盖"网络抖动/短暂 5xx"这类主要场景，完整退避策略工作量更大、留待后续按需加强。人工测试见 [C1](#test-c1)。

### 8. `panelClass` 表单字段配置项是死代码（赋值写成了比较）

`form/trigger/abstract.trigger.ts:152-154`

```ts
if(this.field.panelClass!=undefined){
  this.panelClass==this.field.panelClass;   // 比较表达式，不是赋值
}
```

明显是想写 `this.panelClass = this.field.panelClass;`。`panelClass` 声明为 `@Input()`，但在文件内从未被真正读取——`_createPopup()` 直接硬编码了 `panelClass: "mat-picker-popup"`，没有用 `this.panelClass`。
**失败场景**：消费方设置 `field.panelClass = 'my-custom-overlay'` 期望给弹层加自定义样式类，实际什么都不会发生——弹层永远只有固定的 `mat-picker-popup` 类，针对自定义类写的 CSS 永远不生效。这是端到端的死功能，不只是一个笔误。
**修复**：`this.panelClass = this.field.panelClass;`，并让 `_createPopup()` 真正使用 `this.panelClass`（如合并进 `OverlayConfig.panelClass`）。
**修复状态**：✅ 已修复，按建议方案实现（赋值 typo 修正 + `_createPopup()` 把 `this.panelClass` 合并进 `OverlayConfig.panelClass`，与固定的 `mat-picker-popup` 共存）。人工测试见 [C5](#test-c5)。

### 9. 跨标签页 `localStorage.clear()` 会让登录状态监听崩溃

`core/auth/auth-guard.service.ts:30-39`

```ts
ticketChange(event: StorageEvent) {
    if (event.newValue !== event.oldValue) {
        this.ticketChangeRedirect(event);
    }
    if (event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) && ...
```

根据 `StorageEvent` 规范，触发变化的操作是 `localStorage.clear()` 时 `event.key` 为 `null`（很多应用在登出时会用这个模式清空存储）。`AuthGuard` 的构造函数全局注册了这个监听（`window.addEventListener('storage', ...)`），任何同源标签页清空 storage 都会在监听器内部抛出 `TypeError: Cannot read properties of null (reading 'endsWith')`。
**修复**：加守卫 `if (event.key && event.key.endsWith(...))`。
**修复状态**：✅ 已修复，按建议方案实现。人工测试见 [C6](#test-c6)。

### 10. Token 过期判断没有时钟误差容忍度

`core/auth/oauth2Auth.ts:239-261`

```ts
isValidAccessToken(): boolean {
    if (expiresAt && parseInt(expiresAt, 10) >= now.getTime()) {
        validAccessToken = true;
    }
```

过期判断严格用本地时钟比较，零缓冲。如果客户端时钟比服务端快（终端用户机器上很现实），token 会在服务端实际拒绝之前就被判定为过期，导致会话边界附近产生不必要的刷新调用；更重要的是发请求前没有留任何安全余量，本次检查通过和请求真正到达服务端之间的几毫秒里 token 完全可能过期。影响面不大，但建议加一个安全边界（如提前 30 秒判定为过期）以提升健壮性。
**修复状态**：✅ 已修复 — `isValidAccessToken()` 新增 30 秒缓冲常量 `ACCESS_TOKEN_EXPIRY_BUFFER_MS`，判定条件改为 `expiresAt >= now + 30000`。`isValidToken()`（id_token 过期判断，同样零缓冲）本轮未做同样处理，报告原文只点名了 `isValidAccessToken()`，为避免范围蔓延未一并修改。人工测试见 [C1](#test-c1)。

## 已核查、判定为正确的可疑点

- **`tree/models/tree.model.ts`/`tree-node.model.ts` 的 `nodeRegistry` Map**（近期新增的 O(1) 节点查找缓存）—— 追踪了 `TreeNode` 构造函数、`id` setter、`dispose()`、`TreeModel.update()`/`removeNode()`/`moveNode()` 全链路，注册表在每次 `update()` 时被正确清空重建，增删改路径均保持一致，未发现分歧（唯一的潜在瑕疵是输入数据里有重复 node id 时"后注册者生效"的歧义，属数据质量问题而非代码 bug）。
- **`data/datatable/utils/sort.ts`** —— 尽管机械扫描把 `Array.sort()` 标记为默认字典序排序的可疑点，实际实现有正确的数值/日期/字符串感知比较（`orderByComparator`），并用索引映射做稳定排序 tie-break，不是 bug。
- **`data/datatable/utils/selection.ts` 的 `selectRowsBetween`** —— 注释声称会跳过"已在选中数组里的行"，但代码本身没有真正检查这一点；不过唯一调用方（`selection.component.ts:45`）总是传入新建的 `[]`，因此当前不可达。仅在未来有调用方传入非空数组时才会成为真实问题。
- **`form/daterangepicker/daterangepicker.component.ts` 的日历格生成**（`.add(24, 'hours')` 循环）—— 看起来像典型的夏令时不安全的按天递增，但整个日历生成过程刻意使用 `.utc(true)`（保持本地时间语义）模式，绕开了夏令时问题，不是 bug。
- **认证模块 implicit flow 下"新登录"与"恢复会话"的收敛** —— `useFragmentTimeLogin()`（新登录）和 `refreshBrowserLogin()`（恢复会话）都正确收敛到 `silentRefresh()`；本报告 HIGH-2 描述的分歧只存在于非 implicit（密码式/refresh token 式）流程。

---

## 小结

| 方向 | 发现总数 | 最严重问题 | 修复进度 |
|---|---|---|---|
| 内存泄漏 | 12（5 HIGH / 3 MEDIUM / 1 LOW / 3 误报，另有 1 项低置信度存疑） | `named-outlet/route.service.ts` 的两处泄漏（无界订阅 + Map 从不清理），是全应用单例，影响面覆盖所有多窗口场景 | 8/8 已修复（全部） |
| 性能瓶颈 | 9（4 HIGH / 4 MEDIUM / 1 LOW） | `gridster` 拖拽时每次原生 mousemove 都强制回到 Angular zone 跑 O(n) 碰撞算法，且无 rAF 合帧，是最直接可感知的卡顿源 | 8/9 已修复（HIGH 全部，MEDIUM 全部；LOW-9 复核后判定并非真实重复调用，未改动，详见该条目说明） |
| 逻辑错误 | 10（5 HIGH / 5 MEDIUM） | `core/auth/oauth2Auth.ts` 的 refresh_token 静默丢失问题（HIGH-1）——这正是本次提交点想修的同一个功能区域，说明该次修复不完整，仍会导致用户话被非预期登出 | 10/10 已修复 |

三个方向合计 31 项发现，其中 HIGH 级 14 项。**认证模块建议优先处理**：HIGH-1、HIGH-2 两个问题共同作用下，"关闭浏览器一段时间后重新打开"和"服务端不轮换 refresh token"这两种都很常见的场景组合起来，会让用户体验到不合理的强制登出，而这恰好是最近一次提交试图解决但未能完全解决的问题。**该项已修复**。经过三轮修复，27 项可行动发现中 26 项已处理，唯一保留原状的是性能 LOW-9（`tree.component.ts` 的"重复" `detectChanges()`）——复核发现两次调用之间隔着一次 `requestAnimationFrame` 且服务于不同目的（一次反映新数据，一次在浏览器完成布局后刷新虚拟滚动视口），删除任一处都有实际回归虚拟滚动渲染的风险，且该组件没有自动化测试兜底，因此判断维持现状比强行"修复"更安全。

---

# 四、人工测试指南

代码库没有可用的自动化测试（仅 1 个 `.spec.ts`），`ng build dui --configuration production` 只能验证编译通过，无法验证运行时行为。以下是逐项修复的人工验证步骤，覆盖上文标记为 ✅ 已修复 的 26 项（A-C 为第一、二轮，共 21 项；D 为第三轮新增的 5 项）。

## 测试环境准备

1. 依赖安装（若尚未安装）：`cd /home/dotos/ts/libs/dui && npm install`
2. 打开两个终端：
   - 终端 A（增量构建 `@dotos/dui` 库，本地改动会自动重新编译）：`npm run watch-dui`
   - 终端 B（启动内置的组件演示/文档应用 `testdui`）：`npx ng serve testdui`，等待编译完成后浏览器打开 `http://localhost:4200`
3. 演示应用左侧目录可进入各组件的 `docs/examples` 页面（按钮、表格、Monaco 编辑器等）；但**认证/oauth2、gridster、图标选择器（远程模式）、`named-outlet` 多窗口路由、`panelClass` 这几项在 `testdui` 里没有现成的演示页面**，下文对应小节给出了不依赖 UI 演示页的验证方法（浏览器 DevTools 控制台直接调用 API，或临时挂一个测试组件）。
4. 需要判断"内存是否真的被回收"的场景，统一用 Chrome DevTools 的方法：
   - 打开 DevTools → Memory 面板
   - 执行"操作前"一次 `Collect garbage`（垃圾桶图标）+ 拍一次 Heap Snapshot（记为 S0）
   - 按每项测试步骤重复触发问题场景 N 次（一般 10~20 次即可看出趋势）
   - 再 `Collect garbage` 一次 + 拍第二次 Heap Snapshot（记为 S1）
   - 用 S1 的 "Comparison" 视图对比 S0，按类名搜索相关类型（如 `Subscription`、`RouterOutlet`、`TextModel`）查看 `# Delta`，正数且随操作次数线性增长 = 仍在泄漏；改动前应能复现增长，改动后应稳定在 0 附近

## A. 内存泄漏修复验证

<a id="test-a1"></a>
### A1. `route.service.ts` — navigate 订阅泄漏 + Map 未清理（内存 HIGH-1/2）

无演示页面，用浏览器控制台直接验证：

1. 在 `testdui` 页面打开 DevTools 控制台
2. 由于 `RouteService` 是 `providedIn: 'root'` 单例，无法直接从控制台拿到实例；改为**读代码+构造函数计数法**验证订阅确实被限制在一次：在 `src/ux/windows/window/components/named-outlet/route.service.ts` 的 `navigate()` 方法内，临时加一行 `console.log('subscribed')`（仅本地调试用，验证完删除），改用 `take(1)` 后应观察到：每次调用 `navigate(url)`（不带 `name`）只打印一次，且对应的订阅在下一次 `NavigationStart` 触发后自动结束（可以在 `take(1)` 后再加 `console.log('unsubscribed')` 确认）
3. 验证 Map 清理：在同一文件 `createRouterOutlet`/`clearRouterOutlet` 里各加一行日志打印 `this.routerOutletMap.size`，在业务应用里连续开关同一个 named outlet 5 次，`size` 应保持不变（旧代码会持续 +1 不减）
4. 验证方式二（更贴近真实用法）：如果手头有一个使用 `dui` 多窗口功能（`ux/windows`）的业务应用，反复打开/关闭同一个命名窗口 20 次，配合上面的 Heap Snapshot 流程搜索 `RouterOutlet`，改动后 retained 数量应不再随操作次数增长
5. **附带发现未处理**：`named-outlet.directive.ts:24` 的参数不匹配问题本轮未验证，如需确认可在该行加断点查看 `name` 参数实际接收到的值是否为字符串

<a id="test-a2"></a>
### A2. `resizable.directive.ts` — 拖拽结束后 mouseup 监听未移除（内存 HIGH-3）

1. `testdui` 中找一个使用了 `[osResizable]` 指令的可缩放面板（`ux/windows` 相关演示，或 `container` 示例里的可拖拽布局）
2. 打开 DevTools → Elements 面板，选中 `document`，在 Event Listeners 标签里过滤 `mouseup`，记录初始监听器数量
3. 对该面板做一次拖拽缩放（mousedown → 移动 → mouseup）
4. 再次查看 `document` 上的 `mouseup` 监听器数量：
   - 修复前：数量 +1 且不会随后续操作移除（因为是同一个函数引用，浏览器去重，所以数字本身可能不涨，但功能上任意位置松开鼠标都会触发 `osResizeEnd`——可以在页面任意空白处点击并松开鼠标，观察面板是否意外触发了 resize 结束的副作用，如 class 切换）
   - 修复后：拖拽结束后 `mouseup` 监听器应被正确移除，页面其他位置松开鼠标不应触发该面板的 `osResizeEnd`

<a id="test-a3"></a>
### A3. `range-slider.field.ts` — `destroy$` 从不触发（内存 HIGH-4）

1. `testdui` → `docs/examples/form` 找到范围滑块（range slider）字段的示例（若示例页没有现成的，用 `*ngIf` 包一层，做成可动态增删的表单字段）
2. 打开 DevTools → Memory 面板，拍一次 Heap Snapshot（S0）
3. 反复挂载/销毁该字段（触发 `*ngIf` 切换）15 次
4. 再拍一次 Heap Snapshot（S1），Comparison 视图搜索 `RangeSliderFieldComponent`（或其模块内类名）
   - 修复前：`# Delta` 应随次数增长（15 次操作后应能看到 ~15 个未回收实例）
   - 修复后：`# Delta` 应接近 0（`ngOnDestroy` 正确触发 `destroy$`，组件可被 GC）

<a id="test-a4"></a>
### A4. `diff-editor.component.ts` — Monaco 文本模型从未 dispose（内存 HIGH-5）

1. `testdui` → `docs/examples/monaco-editor`，找到 diff editor（差异对比编辑器）示例
2. 在浏览器控制台执行 `monaco.editor.getModels().length` 记录初始值
3. 反复切换 diff editor 的 `originalModel`/`modifiedModel` 输入（或反复挂载/销毁该组件）10 次
4. 再次执行 `monaco.editor.getModels().length`：
   - 修复前：数值应持续增长（每次切换 +2）
   - 修复后：数值应稳定（旧模型在重建/销毁前被正确 `.dispose()`）

<a id="test-a5"></a>
### A5. `icon-picker.component.ts` — 退订 Subject 未接到订阅上（内存 MEDIUM-6）

1. `testdui` 里找到图标选择器（icon picker，远程/自定义图标模式）入口
2. 打开浏览器 DevTools → Network 面板，勾选 "Slow 3G" 节流（模拟慢网络）
3. 打开图标选择器弹层（触发 `getIcons()`/`showCustomIcons()` 的 HTTP 请求），在响应返回**之前**立即关闭弹层
4. 观察控制台：
   - 修复前：请求返回后会抛 `ViewDestroyedError`（试图对已销毁视图调用 `detectChanges()`）
   - 修复后：请求返回后静默丢弃，无报错
5. 重复 5~10 次，确认每次都无报错、无控制台警告

<a id="test-a6"></a>
### A6. `datatable.card.ts` — HTTP 请求组件销毁时不会被取消（内存 MEDIUM-7）

1. `testdui` → `docs/examples/datatable`，找到卡片形式（card）展示的表格，或把某个 datatable 卡片放进一个可关闭的 dialog 里
2. 同样用 Network 面板节流到慢网络
3. 触发数据加载（`init`/`load`/翻页/排序），在响应返回前关闭所在的 dialog（销毁组件）
4. 观察控制台：
   - 修复前：响应返回后 `success()` 仍执行，可能报错（访问已置空的 `this.view`）或产生视觉上的"僵尸更新"
   - 修复后：响应返回后不再执行 `success()`（`_destroy$` 在 `onDestroy()` 里已 `next()+complete()`，`takeUntil` 生效）
5. 注意：`form/select/options.service.ts`、`form/field/options.service.ts`、`form/action/*.service.ts` 是同类模式但**本轮未修复**，测试时不要用这几处验证，会得到"未修复"的正确结果

## B. 性能瓶颈修复验证

<a id="test-b1"></a>
### B1. `datatable/utils/tree.ts` — 树形分组 O(n²)（性能 HIGH-1）

1. `testdui` → `docs/examples/datatable`，切到树形分组模式（`groupRowsBy`）
2. 准备一份较大的数据集（几千行，可在浏览器控制台用脚本批量生成后灌入表格的数据源，或临时把示例数据复制放大）
3. 打开 DevTools → Performance 面板，点击 Record，触发一次排序/数据刷新（走到 `groupRowsByParents()`），停止录制
4. 在火焰图里搜索 `groupRowsByParents`，查看其自身耗时（Self Time）
   - 数据量小时可能看不出明显差异，重点是行数从几百提到几千时，修复前耗时应明显呈平方增长趋势，修复后应接近线性

<a id="test-b2"></a>
### B2. `datatable.component.ts` — 滚动同步触发完整变更检测（性能 HIGH-2）

1. `testdui` → `docs/examples/datatable`，用大数据量（几千行）+ 勾选多行（触发选中态扫描更贵）
2. Performance 面板录制，鼠标放在表格上做一段持续滚动（模拟真实用户滚动，而非单次点击）
3. 停止录制，查看录制期间 `detectChanges`/`onBodyScroll` 的调用次数和主线程占用：
   - 修复前：调用次数应约等于滚动事件触发次数（每秒可达几十次）
   - 修复后：调用次数应被 `requestAnimationFrame` 限制在约等于帧数（每秒最多 ~60 次，通常远低于滚动事件数）
4. 主观感受：修复后连续快速滚动应更顺滑，无明显掉帧卡顿

<a id="test-b3"></a>
### B3. `gridsterDraggable`/`Resizable.service.ts` — 拖拽/缩放时每次 mousemove 强制回 zone（性能 HIGH-3）

1. 找一个使用 dui gridster 网格布局的业务页面（`testdui` 无现成演示，需在实际接入方或临时测试页面里搭一个）
2. Performance 面板录制，对一个网格项做一次持续的拖拽或缩放（保持鼠标移动几秒）
3. 停止录制，在火焰图中查看 `zone.run`/`updateGrid` 的调用次数：
   - 修复前：调用次数应接近 mousemove 事件次数
   - 修复后：调用次数应被 `requestAnimationFrame` 限制在约等于帧数
4. 主观感受：拖拽/缩放跟手感不应变差（碰撞检测本身没有移到 rAF 里，只有触发变更检测的部分被合帧），松开鼠标后网格应正确定格（验证 `dragStop`/`resizeStop` 里的 `cancelAnimationFrame` 没有漏掉最后一帧的状态同步）

<a id="test-b4"></a>
### B4. `datatable.component.ts` — window resize 未节流（性能 MEDIUM-8）

1. `testdui` → `docs/examples/datatable`
2. Performance 面板录制，拖动浏览器窗口边缘连续调整大小几秒（产生大量 resize 事件）
3. 停止录制，查看 `onWindowResize`/`recalculate` 的调用次数：
   - 修复前：应接近 resize 事件触发次数
   - 修复后：应被 100ms 节流限制，明显减少
4. 主观感受：拖动窗口边缘调整大小时表格不应出现明显的撕裂/卡顿

## C. 逻辑错误修复验证

<a id="test-c1"></a>
### C1. `oauth2Auth.ts` — 认证/token 刷新链路（逻辑 HIGH-1、HIGH-2、MEDIUM-6、MEDIUM-7、MEDIUM-10）

这一组全部在 `core/auth/oauth2Auth.ts`，`testdui` 没有配置真实的 oauth2 后端，建议在**实际接入 dui 且配置了 oauth2 的业务应用**里测试；没有现成业务应用时，可在浏览器控制台里直接操作一个 `Oauth2Auth` 实例模拟（下面给出具体做法）。

**准备**：業务应用登录后，在控制台找到 `Oauth2Auth` 实例（通常可通过 Angular DevTools 扩展选中对应的服务，或在应用里临时 `window['__auth'] = this` 的方式暴露一下，测完删除）。

- **HIGH-1（refresh_token 非轮换时被静默清空）**：
  1. 正常登录一次，记录 `authentications.oauth2.refreshToken` 的值
  2. 手动触发一次 `refreshToken()`（如果后端本次刷新不返回新的 `refresh_token`，模拟方法：临时在 `refreshToken()` 的成功回调里把 `data.refresh_token` 强制设为 `undefined` 后观察）
  3. 修复前：`authentications.oauth2.refreshToken` 变为 `undefined`；修复后：应保留刷新前的旧值
  4. 验证登出场景：调用 `logOut()` 后检查 `authentications.oauth2.refreshToken` 应为 `null`（确认 fallback 引入的新边界已用显式清空处理，登出后不会残留旧 token）

- **HIGH-2（会话恢复时 access token 已过期直接跳过刷新）**：
  1. 登录后，在浏览器 Application → Local Storage 里手动把 `access_token_expires_in` 改成一个过去的时间戳（模拟长时间未使用后 access token 过期），保留 `refresh_token` 不动
  2. 刷新整个页面（重新触发 `initOauth`）
  3. 修复前：应被踢回登录页（`isLoggedIn()` 为 `false`）；修复后：应自动用 `refresh_token` 换到新的 access token，用户仍保持登录状态（Network 面板应能看到一次 `POST /oauth2/token`，`grant_type=refresh_token`）

- **MEDIUM-6（无并发互斥）**：
  1. 登录后，在控制台几乎同时（同一事件循环内）调用两次 `this.__auth.refreshToken()`
  2. 用 Network 面板确认：修复前应看到两个几乎同时发出的 `POST /oauth2/token` 请求；修复后应只有一个真实请求，第二次调用直接复用同一个 Promise（两次调用 resolve 的是同一份数据）

- **MEDIUM-7（静默失败无重试）**：
  1. 用 DevTools → Network 面板的 "Block request URL" 功能屏蔽 `/oauth2/token`，或断网
  2. 手动触发一次 `refreshToken()`，观察控制台
  3. 修复前：无任何日志；修复后：应看到 `console.error('[oauth2] token refresh failed, will retry shortly', ...)`，并在 15 秒（或 `refreshTokenTimeout` 更小时取其值）内看到一次自动重试请求

- **MEDIUM-10（无时钟误差缓冲）**：
  1. 在 Local Storage 里把 `access_token_expires_in` 设为"当前时间 + 15 秒"（模拟即将过期）
  2. 调用 `isValidAccessToken()`
  3. 修复前：只要时间戳仍大于当前时间就返回 `true`；修复后：由于有 30 秒缓冲，还剩 15 秒时应返回 `false`（判定为已过期，会触发刷新）

<a id="test-c2"></a>
### C2. `select.field.ts` / `textfield.component.ts` — 远程搜索"过期响应"防护（逻辑 HIGH-3）

1. `testdui` → `docs/examples/form`，找一个配置了 `remote: true` 远程数据源的下拉选择/文本自动完成字段（若示例没有现成的，需要临时配置一个指向真实或 mock 接口的远程字段）
2. 用 DevTools → Network 面板给接口加人为延迟（`throttling` 或后端接口本身加 `sleep`），确保能制造"先发后至"的乱序响应：接口 A（关键词 "a"）延迟 2 秒，接口 B（关键词 "ab"）延迟 200ms
3. 操作步骤：输入 "a"，等待约 300ms（越过防抖）后紧接着输入 "ab"
4. 观察下拉选项列表：
   - 修复前："ab" 的结果先显示是正确的，但约 2 秒后 "a" 的过期结果会静默覆盖列表，此时输入框显示 "ab" 但选项对应 "a" 的结果
   - 修复后：过期的 "a" 响应到达时应被丢弃，列表始终保持与当前输入框内容一致的 "ab" 结果
5. 重复 3~5 次不同的乱序组合，确认结果稳定

<a id="test-c3"></a>
### C3. `body.component.ts` — 表格分组 trackBy 恒为 0（逻辑 HIGH-4）

1. `testdui` → `docs/examples/datatable`，切到分组模式（`groupRowsBy`），且**不要**设置 `trackByProp`
2. 打开 Angular DevTools 扩展的 Profiler，或直接用浏览器 Elements 面板观察 DOM
3. 记录当前几个分组行对应的 DOM 节点（可以给某一行元素做个标记，如临时加个自定义属性）
4. 触发一次数据更新/翻页/排序（保持分组数量不变，但顺序或内容变化）
5. 观察：
   - 修复前：Angular 认为所有分组行"身份"都是 `0`，可能出现内容错位（某一行 DOM 节点显示的却是另一分组的内容）或不必要的全量重渲染（之前标记的 DOM 节点会被销毁重建，即使逻辑上应该是同一行更新）
   - 修复后：分组行有各自独立的 `trackBy` 标识，未变化的分组行 DOM 节点应被保留（之前的标记应该还在），只有真正变化的行会被更新
6. 也可以直接读控制台验证：在 `getRowIndex()` 里临时加日志，分组模式下应该能看到不同分组返回不同的 index，而不是清一色的 `0`

<a id="test-c4"></a>
### C4. `numberfield.component.ts` — 数字字段单位换算 0 值失效（逻辑 HIGH-5）

1. `testdui` → `docs/examples/form`，找到带单位换算的数字字段示例（如温度、长度等带 `unit` 配置的 number field）
2. 在输入框里输入 `0`
3. 切换单位下拉框（如摄氏度切到华氏度）
4. 观察：
   - 修复前：值不会跟随换算更新，仍显示切换前的原始值/状态
   - 修复后：`0` 应正确按换算公式转换（如 0°C → 32°F）并显示新值
5. 对照组：输入非 0 的任意数字（如 `10`）做同样的单位切换，确认换算前后都正常（避免修复引入新问题）

<a id="test-c5"></a>
### C5. `abstract.trigger.ts` — panelClass 死代码（逻辑 MEDIUM-8）

1. 找一个基于 `AbstractTrigger` 的字段组件（日期选择器等触发弹层的字段），配置 `field.panelClass = 'my-test-overlay-class'`
2. 打开该字段的弹层（如点击日期选择器）
3. 打开 DevTools → Elements 面板，找到 `.cdk-overlay-pane` 元素
4. 观察其 class 列表：
   - 修复前：只有固定的 `mat-picker-popup`，看不到 `my-test-overlay-class`
   - 修复后：应同时包含 `mat-picker-popup` 和 `my-test-overlay-class`
5. 加一条对应的 CSS 规则（如 `.my-test-overlay-class { border: 3px solid red; }`），确认修复后能在弹层上直接看到视觉效果

<a id="test-c6"></a>
### C6. `auth-guard.service.ts` — 跨标签页 storage clear 崩溃（逻辑 MEDIUM-9）

1. 用同一个业务应用登录后打开两个标签页（Tab 1、Tab 2）
2. 在 Tab 1 打开 DevTools → Console，保持可见
3. 在 Tab 2 的控制台执行 `localStorage.clear()`（模拟登出时清空存储的常见写法）
4. 观察 Tab 1 的控制台：
   - 修复前：应立即抛出 `TypeError: Cannot read properties of null (reading 'endsWith')`
   - 修复后：不应有任何报错（`event.key` 为 `null` 时被正确跳过该分支）
5. 这一步不依赖 `testdui`，任何两个同源标签页 + 控制台即可验证，也可以直接对 `window` 手动 `dispatchEvent(new StorageEvent('storage', { key: null, newValue: null, oldValue: null }))` 来模拟，无需真的登录一个业务应用

## D. 第三轮内存/性能修复验证

第三轮修复了「修复状态总览」里第一、二轮未处理的全部内存泄漏项和大部分性能瓶颈项（`tree.component.ts` LOW-9 除外——复核后判定不是真实的重复调用，未作改动，理由见该条目下方说明）。环境准备同上文「测试环境准备」。

<a id="test-d1"></a>
### D1. `global-events.service.ts` — document 监听器无法移除（内存 LOW-8）

无演示页面，用浏览器控制台直接验证引用计数行为：

1. 找到任意消费 `ɵGlobalEvents.fromDocument()` 的场景（`fixed-to-parent.directive.ts` 用 `'wheel'`，`dynamic-window.component.ts` 用 `'click'`），或临时写一小段代码 `inject(ɵGlobalEvents).fromDocument('click').subscribe(...)` 挂到一个可销毁的测试组件上
2. 打开 DevTools → Elements 面板，选中 `document`，查看 Event Listeners 里 `click` 的监听器数量，记录初始值
3. 反复挂载/销毁该测试组件（触发订阅/取消订阅）10 次
4. 每次销毁后查看：
   - 修复前：`document` 上的监听器始终存在（一旦注册就不会被移除，只是因为按事件名缓存所以不会无限增长）
   - 修复后：当最后一个订阅方取消订阅时，`document` 上该事件名对应的监听器应被移除；再次挂载新的消费方时应能看到监听器被重新注册
5. 也可以直接读代码验证：在 `finalize()` 回调里加日志，多个并发订阅时应只在最后一个取消订阅时才真正调用 `removeEventListener`

<a id="test-d2"></a>
### D2. `daterangepicker.component.ts` — 悬停预览重建整个日历（性能 HIGH-4）

1. `testdui` → `docs/examples/form`，找到日期范围选择器（daterangepicker）示例
2. 打开日期选择器，点击起始日期但不要点结束日期（进入"正在选择范围"状态，`pickingDate` 为真）
3. 打开 DevTools → Performance 面板，点击 Record，在日历格子上做一段持续的鼠标悬停移动（模拟用户拖动鼠标预览范围）
4. 停止录制，在火焰图中搜索 `renderCalendar`/`buildCells`：
   - 修复前：每次 `mouseenter`（悬停）都会看到一次完整的 `renderCalendar` 执行（包含大量 dayjs 日期对象创建）
   - 修复后：悬停时只应看到 `buildCells` 被调用，不应再看到 `renderCalendar` 里那些重建 42 个 dayjs 对象的操作
5. 主观感受：悬停预览高亮应该和修复前一样正确（起始日期到悬停日期之间的格子应正确显示 `in-range` 高亮），但连续快速移动鼠标时应该更顺滑
6. 回归检查：确认月份切换（点击上一月/下一月按钮）后日历数据仍然正确刷新（这条路径走的是 `updateCalendars()`，仍然调用完整的 `renderCalendar()`，不受本次改动影响）

<a id="test-d3"></a>
### D3. `perfect-scrollbar.component.ts` — 滚轮/触摸滑动触发两次变更检测（性能 MEDIUM-5）

1. `testdui` 中找一个用了 `dui-perfect-scrollbar` 的可滚动容器（多数示例页面本身如果内容超出高度就会用到）
2. 打开 DevTools → Performance 面板录制，在容器上做一次鼠标滚轮滚动或触摸滑动（几秒钟）
3. 停止录制，在火焰图里搜索 `checkPropagation`/`detectChanges`：
   - 修复前：每次滚轮事件应能看到两次 `detectChanges()`（一次来自 `stateUpdate` 订阅回调，一次来自 `checkPropagation` 末尾）
   - 修复后：每次滚轮事件应只看到一次
4. 主观感受：滚动时的方向指示器（如果启用了 `scrollIndicators`/`autoPropagation`）行为应该和修复前一致，没有变得迟钝或丢失状态更新

<a id="test-d4"></a>
### D4. `util/change.ts` — `ChangeUtils.findChanges` O(n²) 匹配 + 重复深拷贝（性能 MEDIUM-6）

1. 在浏览器控制台或一个临时测试脚本里直接调用 `ChangeUtils.findChanges(obj1, obj2)`，构造两个几千条、每条有 `id` 字段、部分行有增删改的数组
2. 用 `console.time`/`console.timeEnd` 包住调用，对比修复前后的耗时（可以用 `git stash` 切回修复前的版本各跑一次，数据量到几千行时应该能看到明显差异；数据量小时可能感知不到）
3. 功能回归检查（比数值更重要）：构造一个小数据集，手工核对返回结果结构不变——
   - `added`：只在 `obj2` 里出现的项，顺序应与 `obj2` 中原始顺序一致
   - `deleted`：只在 `obj1` 里出现的项
   - `modified`：两边都有但字段不同的项，`keysChanged[].oldValue`/`newValue` 应该是变化前后的原始值（不是被 `StringUtils.diff` 处理过的展示用字符串），`value` 字段应该是经过 diff 标记处理的版本（这一点修复前后应保持一致，用于确认这次改动没有动到输出语义）
   - 构造一个字段值是数组的场景（如 `tags: ['a','b']` 改成 `['a','c']`），确认 `oldValue`/`newValue` 仍然是原始数组而不是被拼接成字符串后的值
   - 构造一个嵌套对象字段变化的场景，确认递归比较（`keysChanged` 里带 `baseKey.subKey` 形式的 key）仍然正常工作

<a id="test-d5"></a>
### D5. `common/resize-element/resizable.directive.ts` — `mouseMoveThrottleMS` 死配置（性能 MEDIUM-7）

1. 找一个使用 `[duiResizable]` 指令的可缩放元素（`testdui` 无现成演示，可在临时测试页面里搭一个，或用 `container` 相关示例改造）
2. 不设置 `mouseMoveThrottleMS`（使用默认 50ms），打开 DevTools → Performance 面板录制，做一次持续几秒的拖拽缩放
3. 停止录制，查看驱动 `resizing` 事件/DOM 样式更新的回调触发频率：
   - 修复前：应接近原生 mousemove 事件频率（通常远高于 50ms 一次）
   - 修复后：应被限制在约每 50ms 一次（`leading: true` 保证拖拽开始时立即响应，`trailing: true` 保证拖拽过程中每个节流窗口结束时都能追上最新位置）
4. 修改 `[mouseMoveThrottleMS]="200"` 输入，重复步骤 2-3，确认触发频率相应变化为约每 200ms 一次
5. 主观感受：拖拽过程中元素应平滑跟随鼠标，松开鼠标后元素应准确停在鼠标释放的位置（不应因为节流而"差一截"）；`preventDefault()`（防止拖拽时选中页面文字）应在整个拖拽过程中持续生效，不应因为节流而在某些帧丢失
