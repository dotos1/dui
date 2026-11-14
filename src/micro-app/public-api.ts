/**
 * @fileoverview Module `src/micro-app/public-api.ts` exposing `@dotos/dui/micro-app` public contracts and components.
 * @zh 模块文件 `src/micro-app/public-api.ts`，导出 `@dotos/dui/micro-app` 的公开类型、事件总线与微应用容器组件。
 */

export {
  DuiMicroAppColorScheme,
  DuiMicroAppContext,
  DuiMicroAppDensity,
  DuiMicroAppEsmDescriptor,
  DuiMicroAppEventPayload,
  DuiMicroAppLifecycleModule,
  DuiMicroAppNativeFederationDescriptor,
  DuiMicroAppProtocol,
  DuiMicroAppRemoteDescriptor,
  DuiMicroAppWebpackMfDescriptor,
} from './micro-app.types';
export {
  DUI_MICRO_APP_CUSTOM_EVENT,
  DuiMicroAppEventBus,
} from './micro-app-event-bus.service';
export {
  DUI_MICRO_APP_HOST_VERSION,
  DuiMicroAppComponent,
} from './micro-app.component';
export { DuiMicroAppModule } from './micro-app.module';
