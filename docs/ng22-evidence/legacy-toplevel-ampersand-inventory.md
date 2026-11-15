# 历史遗留顶层 `@global` 含 `&` 选择器全量清单（U1.3 专项留档）

## 1. 背景与 `7.4.52` 严格行为对齐说明

在 `dui@7.4.52` 中，`ThemeService` 使用 `jss` + `jss-plugin-global` + `jss-plugin-nested` 将主题对象包裹在顶层 `'@global': { ... }` 中序列化为 `<style>` 标签：

- 当 `&` 出现在**有父选择器**的嵌套子对象中（例如 `'.flow-node-default': { '&:hover': { ... } }`）时，`jss-plugin-nested` 将 `&` 替换为父选择器（产出 `.flow-node-default:hover`）；
- 当 `&` 直接出现在**顶层 `@global` 键名**（无父选择器，`parentSelector === ''`）中时，`jss-plugin-nested` **不做任何字符串替换，原样输出含 `&` 的选择器文本**。

在现代浏览器（CSS Nesting 规范）中，顶层规则中的 `&` 等价于 `:scope`（即 `:root`）：
1. 既**不会**退化为全局裸伪元素/伪类（如 `*::after`、`*:hover`），杜绝全站伪元素污染；
2. 对于形如 `.foo &:hover`（等价于 `.foo :root:hover`，即“`:root` 作为 `.foo` 后代”，DOM 中不可能匹配）的历史笔误规则，在 `7.4.52` 中原本即处于**休眠（未激活）**状态。

遵循“**先严格保持与 `7.4.52` 外观 100% 一致、绝不在框架升级 PR 中静默改变历史视觉表现**”的原则（审计 `C2` / `g1-dui.md` `N2` / 路线图 `U1.3`）：
- `src/theme/theme.service.ts` 的 `combineNestedSelector` 在 `!parentSelector` 时原样保留顶层选择器（与 `7.4.52` JSS 输出逐字一致），嵌套子块内的 `&` 正常展开；
- `src/theme/theme/` 下全部历史主题文件与 `github/master` 保持 **0 差异**；
- 下表完整登记 `dotos1/dui`、`dotos1/duix`、`dotos1/sdos` 三个仓库共 **52 条**历史顶层含 `&` 选择器，供平台负责人后续在独立视觉评审单中逐项决定是否激活。

---

## 2. `dotos1/dui` 顶层含 `&` 规则清单（8 个文件，21 条）

| 序号 | 仓库内相对路径与行号 | 原始顶层选择器（`7.4.52` 与本 PR 原样保留） | 疑似原始作者意图 | 当前状态 |
| ---: | --- | --- | --- | --- |
| 1 | `src/theme/theme/card-view.theme.ts:64` | `.dui-textitem-scroll &:hover::-webkit-scrollbar-thumb` | `.dui-textitem-scroll:hover::-webkit-scrollbar-thumb` | 保持 `7.4.52` 休眠态 |
| 2 | `src/theme/theme/dui-datefield-theme.ts:174` | `.mat-datetimepicker-calendar-body-cell-content .mat-datetimepicker-calendar-body-disabled > &:not(.mat-datetimepicker-calendar-body-selected)` | `.mat-datetimepicker-calendar-body-disabled > .mat-datetimepicker-calendar-body-cell-content:not(.mat-datetimepicker-calendar-body-selected)` | 保持 `7.4.52` 休眠态 |
| 3 | `src/theme/theme/dui-link-preview.theme.ts:20` | `.link-preview-container .og-link-preview &:hover` | `.link-preview-container .og-link-preview:hover` | 保持 `7.4.52` 休眠态 |
| 4 | `src/theme/theme/dui-notification-count-theme.ts:76` | `.dui-notification-content &` | 嵌套父选择器缺失（需结合通知组件 DOM 复核） | 保持 `7.4.52` 休眠态 |
| 5 | `src/theme/theme/dui-scrollbar-theme.ts:20` | `.ng-scrollbar-button-icon &:hover` | `.ng-scrollbar-button-icon:hover` | 保持 `7.4.52` 休眠态 |
| 6 | `src/theme/theme/dui-scrollbar-theme.ts:23` | `.ng-scrollbar-button-icon &:hover svg` | `.ng-scrollbar-button-icon:hover svg` | 保持 `7.4.52` 休眠态 |
| 7 | `src/theme/theme/dui-scrollbar-theme.ts:26` | `.ng-scrollbar-button-icon &:active` | `.ng-scrollbar-button-icon:active` | 保持 `7.4.52` 休眠态 |
| 8 | `src/theme/theme/dui-scrollbar-theme.ts:29` | `.ng-scrollbar-button-icon &:active svg` | `.ng-scrollbar-button-icon:active svg` | 保持 `7.4.52` 休眠态 |
| 9 | `src/theme/theme/dui-scrollbar-theme.ts:32` | `.ng-scrollbar-hover &:hover, &:active ` | `.ng-scrollbar-hover:hover, .ng-scrollbar-hover:active` | 保持 `7.4.52` 休眠态 |
| 10 | `src/theme/theme/query-builder.theme.ts:30` | `query-builder .q-switch-label, .q-button &:hover` | `query-builder .q-switch-label:hover, query-builder .q-button:hover`（首段无 `&` 已在 `7.4.52` 生效，次段休眠） | 与 `7.4.52` 完全一致 |
| 11 | `src/theme/theme/query-builder.theme.ts:36` | `query-builder .q-switch-radio &:checked + .q-switch-label` | `query-builder .q-switch-radio:checked + .q-switch-label` | 保持 `7.4.52` 休眠态 |
| 12 | `src/theme/theme/query-builder.theme.ts:55` | `query-builder .q-connector  &::before, &::after` | `query-builder .q-connector::before, query-builder .q-connector::after` | 保持 `7.4.52` 休眠态 |
| 13 | `src/theme/theme/toggle-select-theme.ts:48` | `.mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled` | `.mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.disabled` | 保持 `7.4.52` 休眠态 |
| 14 | `src/theme/theme/toggle-select-theme.ts:51` | `.mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard` | `.mat-button-toggle-group...disabled .mat-button-toggle...` | 保持 `7.4.52` 休眠态 |
| 15 | `src/theme/theme/toggle-select-theme.ts:54` | `.mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button` | `.mat-button-toggle-group...disabled .mat-button-toggle-checked .mat-button-toggle-button` | 保持 `7.4.52` 休眠态 |
| 16 | `src/theme/theme/toggle-select-theme.ts:60` | `.mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.disabled.fill.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button` | `.mat-button-toggle-group...disabled.fill .mat-button-toggle-checked .mat-button-toggle-button` | 保持 `7.4.52` 休眠态 |
| 17 | `src/theme/theme/toggle-select-theme.ts:65` | `.toggle-header-select.mat-mdc-select-arrow &:after` | `.toggle-header-select .mat-mdc-select-arrow::after` | 保持 `7.4.52` 休眠态 |
| 18 | `src/ux/windows/window.theme.ts:23` | `.dui-scroll-view &::-webkit-scrollbar-corner` | `.dui-scroll-view::-webkit-scrollbar-corner` | 保持 `7.4.52` 休眠态 |
| 19 | `src/ux/windows/window.theme.ts:33` | `.dui-scroll-view -webkit-scrollbar-thumb &:hover` | `.dui-scroll-view::-webkit-scrollbar-thumb:hover` | 保持 `7.4.52` 休眠态 |
| 20 | `src/ux/windows/window.theme.ts:36` | `.dui-scroll-view &::-webkit-scrollbar-button` | `.dui-scroll-view::-webkit-scrollbar-button` | 保持 `7.4.52` 休眠态 |
| 21 | `src/ux/windows/window.theme.ts:39` | `.dui-scroll-view &::-webkit-scrollbar-button &:hover` | `.dui-scroll-view::-webkit-scrollbar-button:hover` | 保持 `7.4.52` 休眠态 |

---

## 3. `dotos1/duix` 顶层含 `&` 规则清单（3 个文件，18 条）

| 序号 | 仓库内相对路径与行号 | 原始顶层选择器（`7.4.52` 与本 PR 原样保留） | 疑似原始作者意图 | 当前状态 |
| ---: | --- | --- | --- | --- |
| 1 | `lib/fileviewer/components/viewer.theme.ts:34` | `.cropper-center &::before,&::after` | `.cropper-center::before, .cropper-center::after` | 保持 `7.4.52` 休眠态 |
| 2 | `lib/fileviewer/components/viewer.theme.ts:46` | `.cropper-point &.point-se::before` | `.cropper-point.point-se::before` | 保持 `7.4.52` 休眠态 |
| 3 | `lib/fileviewer/components/viewer.theme.ts:91` | `.dui-pdf-viewer__toolbar-page-selector &>input` | `.dui-pdf-viewer__toolbar-page-selector > input` | 保持 `7.4.52` 休眠态 |
| 4 | `lib/fileviewer/components/viewer.theme.ts:119` | `.dui-image-viewer .dui-image-container&:focus` | `.dui-image-viewer .dui-image-container:focus` | 保持 `7.4.52` 休眠态 |
| 5 | `lib/xyflow/base/node-wrapper/node-wrapper.theme.ts:34` | `.flow-node &.selectable &.selected,&:focus,&:focus-visible` | `.flow-node.selectable.selected, .flow-node.selectable:focus, .flow-node.selectable:focus-visible` | 保持 `7.4.52` 休眠态 |
| 6 | `lib/xyflow/base/node-wrapper/node-wrapper.theme.ts:77` | `.flow-node-default,.flow-node-input,.flow-node-output,.flow-node-group &.selectable &.selected,&:focus,&:focus-visible` | 首三段无 `&` 在 `7.4.52` 已生效，含 `&` 段休眠 | 与 `7.4.52` 完全一致 |
| 7 | `lib/xyflow/base/node-wrapper/node-wrapper.theme.ts:81` | `.flow-node-default .selectable &.selected, .flow-node-default :focus,.flow-node-default :focus-visible` | 后两段无 `&` 已在 `7.4.52` 生效，首段休眠 | 与 `7.4.52` 完全一致 |
| 8 | `lib/xyflow/base/node-wrapper/node-wrapper.theme.ts:85` | `.flow-node-input .selectable &.selected,.flow-node-input:focus,.flow-node-input:focus-visible` | 后两段无 `&` 已在 `7.4.52` 生效，首段休眠 | 与 `7.4.52` 完全一致 |
| 9 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:66` | `.flow_connectionline .flow_connection  &.valid` | `.flow_connectionline .flow_connection.valid` | 保持 `7.4.52` 休眠态 |
| 10 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:69` | `.flow_connectionline .flow_connection  &.invalid` | `.flow_connectionline .flow_connection.invalid` | 保持 `7.4.52` 休眠态 |
| 11 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:164` | `.flow_nodesselection .flow_nodesselection-rect &:focus` | `.flow_nodesselection .flow_nodesselection-rect:focus` | 保持 `7.4.52` 休眠态 |
| 12 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:176` | `.flow_minimap-node &.selected` | `.flow_minimap-node.selected` | 保持 `7.4.52` 休眠态 |
| 13 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:190` | `.flow_resize-control &.handle` | `.flow_resize-control.handle` | 保持 `7.4.52` 休眠态 |
| 14 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:194` | `.flow_resize-control &.handle .resize-handle-icon` | `.flow_resize-control.handle .resize-handle-icon` | 保持 `7.4.52` 休眠态 |
| 15 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:197` | `.flow_resize-control &.line` | `.flow_resize-control.line` | 保持 `7.4.52` 休眠态 |
| 16 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:254` | `.checklist-item &:hover` | `.checklist-item:hover` | 保持 `7.4.52` 休眠态 |
| 17 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:279` | `.check-list-item &:hover` | `.check-list-item:hover` | 保持 `7.4.52` 休眠态 |
| 18 | `lib/xyflow/container/duix-flow/duix-flow.theme.ts:287` | `.source-handle-wrapper &:hover,&.menu-open` | `.source-handle-wrapper:hover, .source-handle-wrapper.menu-open` | 保持 `7.4.52` 休眠态 |

---

## 4. `dotos1/sdos` 顶层含 `&` 规则清单（1 个文件，13 条）

| 序号 | 仓库内相对路径与行号 | 原始顶层选择器（`7.4.52` 与本 PR 原样保留） | 疑似原始作者意图 | 当前状态 |
| ---: | --- | --- | --- | --- |
| 1 | `libs/sdos/src/theme/sdos-theme.ts:25` | `.sdos-menu-container &:hover` | `.sdos-menu-container:hover` | 保持 `7.4.52` 休眠态 |
| 2 | `libs/sdos/src/theme/sdos-theme.ts:33` | `.sdos-cleardraw-button-container &:hover` | `.sdos-cleardraw-button-container:hover` | 保持 `7.4.52` 休眠态 |
| 3 | `libs/sdos/src/theme/sdos-theme.ts:48` | `.sdos-dragzoom-button-container &:hover` | `.sdos-dragzoom-button-container:hover` | 保持 `7.4.52` 休眠态 |
| 4 | `libs/sdos/src/theme/sdos-theme.ts:59` | `.sdos-geolocate-button-container &:hover` | `.sdos-geolocate-button-container:hover` | 保持 `7.4.52` 休眠态 |
| 5 | `libs/sdos/src/theme/sdos-theme.ts:70` | `.sdos-rotation-button-container &:hover` | `.sdos-rotation-button-container:hover` | 保持 `7.4.52` 休眠态 |
| 6 | `libs/sdos/src/theme/sdos-theme.ts:80` | `.sdos-zoom-button-container button &:hover` | `.sdos-zoom-button-container button:hover` | 保持 `7.4.52` 休眠态 |
| 7 | `libs/sdos/src/theme/sdos-theme.ts:98` | `.sdos-ai-button-container &:hover` | `.sdos-ai-button-container:hover` | 保持 `7.4.52` 休眠态 |
| 8 | `libs/sdos/src/theme/sdos-theme.ts:185` | `.filter-bar-buttons &>button:nth-child(2)::before` | `.filter-bar-buttons > button:nth-child(2)::before` | 保持 `7.4.52` 休眠态 |
| 9 | `libs/sdos/src/theme/sdos-theme.ts:225` | `.sdos-layer-button-group, .actions-buttons-multi &::-webkit-scrollbar-track` | 首段无 `&` 已在 `7.4.52` 生效，次段休眠 | 与 `7.4.52` 完全一致 |
| 10 | `libs/sdos/src/theme/sdos-theme.ts:234` | `.sdos-layer-button-group, .actions-buttons-multi  -webkit-scrollbar-thumb &:hover` | 首段无 `&` 已在 `7.4.52` 生效，次段休眠 | 与 `7.4.52` 完全一致 |
| 11 | `libs/sdos/src/theme/sdos-theme.ts:266` | `.search-bar-buttons  & > button:nth-child(2)::before` | `.search-bar-buttons > button:nth-child(2)::before` | 保持 `7.4.52` 休眠态 |
| 12 | `libs/sdos/src/theme/sdos-theme.ts:314` | `.baseLegend  &:hover` | `.baseLegend:hover` | 保持 `7.4.52` 休眠态 |
| 13 | `libs/sdos/src/theme/sdos-theme.ts:323` | `.distanceLegend &:hover` | `.distanceLegend:hover` | 保持 `7.4.52` 休眠态 |
