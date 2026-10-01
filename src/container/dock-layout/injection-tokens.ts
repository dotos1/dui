import { InjectionToken } from "@angular/core";
import { ComponentContainer } from "./container/component-container";


export const DockLayoutContainerTokenName = "DockLayoutContainer";
export const DockLayoutContainerInjectionToken = new InjectionToken<
  ComponentContainer
>(DockLayoutContainerTokenName);
