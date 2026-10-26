/**
 * @fileoverview Module `src/container/dock-layout/injection-tokens.ts` providing injection tokens definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/injection-tokens.ts`，提供injection设计令牌相关的定义与实现。
 */

import { InjectionToken } from "@angular/core";
import { ComponentContainer } from "./container/component-container";


/**
 * Constant/variable `DockLayoutContainerTokenName` defining dock layout container token name in `src/container/dock-layout`.
 * @zh 常量/变量 `DockLayoutContainerTokenName`，定义 `src/container/dock-layout` 中的停靠面板布局容器令牌名称。
 */
export const DockLayoutContainerTokenName = "DockLayoutContainer";
/**
 * Angular dependency-injection token `DockLayoutContainerInjectionToken` for providing dock layout container injection token.
 * @zh Angular 依赖注入令牌 `DockLayoutContainerInjectionToken`，用于提供与注入停靠面板布局容器Injection令牌。
 */
export const DockLayoutContainerInjectionToken = new InjectionToken<
  ComponentContainer
>(DockLayoutContainerTokenName);
