/**
 * @fileoverview Module `src/standalone/public-api.ts` exposing standalone Zoneless Signal UI components and provider.
 * @zh 模块文件 `src/standalone/public-api.ts`，公开导出 `@dotos/dui/standalone` 全部纯 Signal 独立组件与 `provideDuiZoneless` 辅助函数。
 */

export { provideDuiZoneless } from './zoneless.provider';
export {
  DuiButtonComponent,
  DuiButtonSize,
  DuiButtonVariant,
} from './button.component';
export {
  DuiCardComponent,
  DuiCardPadding,
} from './card.component';
export {
  DuiTabItem,
  DuiTabsComponent,
} from './tabs.component';
export {
  DuiDockDirection,
  DuiSplitDockComponent,
} from './split-dock.component';
export {
  DuiFlatTreeNode,
  DuiTreeNodeItem,
  DuiTreeViewComponent,
} from './tree-view.component';
export {
  DuiSchemaFormComponent,
} from './schema-form.component';
export {
  DUI_MICRO_APP_CUSTOM_EVENT,
  DUI_MICRO_APP_HOST_VERSION,
  DuiMicroAppColorScheme,
  DuiMicroAppComponent,
  DuiMicroAppContext,
  DuiMicroAppDensity,
  DuiMicroAppEsmDescriptor,
  DuiMicroAppEventBus,
  DuiMicroAppEventPayload,
  DuiMicroAppLifecycleModule,
  DuiMicroAppModule,
  DuiMicroAppNativeFederationDescriptor,
  DuiMicroAppProtocol,
  DuiMicroAppRemoteDescriptor,
  DuiMicroAppWebpackMfDescriptor,
} from '@dotos/dui/micro-app';
