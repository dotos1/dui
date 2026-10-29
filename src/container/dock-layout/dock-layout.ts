/**
 * @fileoverview Module `src/container/dock-layout/dock-layout.ts` providing dock layout definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout.ts`，提供停靠面板布局相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { ApiError, BindError } from './errors/external-error';
import { AssertError, UnexpectedUndefinedError } from './errors/internal-error';
import { JsonValue, LogicalZIndex } from './utils/types';
import { deepExtendValue, ensureElementPositionAbsolute, numberToPixels, setElementDisplayVisibility, setElementHeight, setElementWidth } from './utils/utils';
import { VirtualLayout } from './virtual-layout';

/**
 * Class `DockLayout` encapsulating dock layout data structures and logic in `src/container/dock-layout`.
 * @public
 * @zh 类 `DockLayout`，封装 `src/container/dock-layout` 中的停靠面板布局数据结构与处理逻辑。
 */
export class DockLayout extends VirtualLayout {
    /**
     * Property `_componentTypesMap` (`Map<string, DockLayout.ComponentInstantiator>`) storing component types map.
     * @internal
     * @zh 属性 `_componentTypesMap`（类型：`Map<string, DockLayout.ComponentInstantiator>`），用于存储或配置组件类型列表映射表。
     */
    private _componentTypesMap = new Map<string, DockLayout.ComponentInstantiator>();
    /**
     * Property `_getComponentConstructorFtn` (`DockLayout.GetComponentConstructorCallback`) storing get component constructor ftn.
     * @internal
     * @zh 属性 `_getComponentConstructorFtn`（类型：`DockLayout.GetComponentConstructorCallback`），用于存储或配置获取组件ConstructorFtn。
     */
    private _getComponentConstructorFtn: DockLayout.GetComponentConstructorCallback;

    /**
     * Property `_registeredComponentMap` (`Map<ComponentContainer, unknown>`) storing registered component map.
     * @internal
     * @zh 属性 `_registeredComponentMap`（类型：`Map<ComponentContainer, unknown>`），用于存储或配置已注册组件映射表。
     */
    private _registeredComponentMap = new Map<ComponentContainer, ComponentContainer.Component>();
    /**
     * Property `_virtuableComponentMap` (`Map<ComponentContainer, DockLayout.VirtuableComponent>`) storing virtuable component map.
     * @internal
     * @zh 属性 `_virtuableComponentMap`（类型：`Map<ComponentContainer, DockLayout.VirtuableComponent>`），用于存储或配置virtuable组件映射表。
     */
    private _virtuableComponentMap = new Map<ComponentContainer, DockLayout.VirtuableComponent>();
    /**
     * Property `_dockLayoutBoundingClientRect` (`DOMRect`) storing dock layout bounding client rect.
     * @internal
     * @zh 属性 `_dockLayoutBoundingClientRect`（类型：`DOMRect`），用于存储或配置停靠面板布局包围边界Client矩形。
     */
    private _dockLayoutBoundingClientRect: DOMRect;

    /**
     * Property `_containerVirtualRectingRequiredEventListener` (`(container: ComponentContainer, width: number, height: number) => void`) storing container virtual recting required event listener.
     * @internal
     * @zh 属性 `_containerVirtualRectingRequiredEventListener`（类型：`(container: ComponentContainer, width: number, height: number) => void`），用于存储或配置容器虚拟滚动矩形必填事件监听器。
     */
    private _containerVirtualRectingRequiredEventListener =
        (container: ComponentContainer, width: number, height: number) => 
        this.handleContainerVirtualRectingRequiredEvent(this.translator,container, width, height);
    /**
     * Property `_containerVirtualVisibilityChangeRequiredEventListener` (`(container: ComponentContainer, visible: boolean) => void`) storing container virtual visibility change required event listener.
     * @internal
     * @zh 属性 `_containerVirtualVisibilityChangeRequiredEventListener`（类型：`(container: ComponentContainer, visible: boolean) => void`），用于存储或配置容器虚拟滚动Visibility变更必填事件监听器。
     */
    private _containerVirtualVisibilityChangeRequiredEventListener =
        (container: ComponentContainer, visible: boolean) =>
         this.handleContainerVirtualVisibilityChangeRequiredEvent(this.translator,container, visible);
    /**
     * Property `_containerVirtualZIndexChangeRequiredEventListener` (`(container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) => void`) storing container virtual z index change required event listener.
     * @internal
     * @zh 属性 `_containerVirtualZIndexChangeRequiredEventListener`（类型：`(container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) => void`），用于存储或配置容器虚拟滚动Z坐标索引变更必填事件监听器。
     */
    private _containerVirtualZIndexChangeRequiredEventListener =
        (container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) =>
            this.handleContainerVirtualZIndexChangeRequiredEvent(this.translator,container, logicalZIndex, defaultZIndex);

 
    /**
     * Creates an instance of `DockLayout` and initializes its dependencies and internal state.
     * @zh 创建 `DockLayout` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
     * @param container - Injected or initial container (`HTMLElement`) / 注入或传入的容器（`HTMLElement`）
     * @param bindComponentEventHandler - Injected or initial bind component event handler (`VirtualLayout.BindComponentEventHandler`) / 注入或传入的绑定组件事件处理器（`VirtualLayout.BindComponentEventHandler`）
     * @param unbindComponentEventHandler - Injected or initial unbind component event handler (`VirtualLayout.UnbindComponentEventHandler`) / 注入或传入的解绑组件事件处理器（`VirtualLayout.UnbindComponentEventHandler`）
     */
    constructor(
        translator:TranslateService,
        container?: HTMLElement,
        bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    );
  
    /**
     * Creates an instance of `DockLayout` and initializes its dependencies and internal state.
     * @zh 创建 `DockLayout` 实例，并初始化其依赖项与内部状态。
     * @param translator - Injected or initial translator (`any`) / 注入或传入的翻译器（`any`）
     * @param config - Injected or initial config (`LayoutConfig`) / 注入或传入的配置（`LayoutConfig`）
     * @param container - Injected or initial container (`HTMLElement`) / 注入或传入的容器（`HTMLElement`）
     */
    constructor(translator,config: LayoutConfig, container?: HTMLElement);
    /**
     * Creates an instance of `DockLayout` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `DockLayout` 实例，并初始化其依赖项与内部状态。
     */
    constructor(translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement | VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    ) {
        super(translator,configOrOptionalContainer, containerOrBindComponentEventHandler, unbindComponentEventHandler, true);
        if (!this.deprecatedConstructor) {
            this.init();
        }
    }


    /**
     * Executes `registerComponent` to handle register component.
     * @zh 执行 `registerComponent`，用于注册组件。
     * @param translator - translator parameter (`TranslateService`) / 翻译器参数（`TranslateService`）
     * @param name - name parameter (`string`) / 名称参数（`string`）
     * @param componentConstructorOrFactoryF... - component constructor or factory f parameter (`DockLayout.ComponentConstructor | DockLayout.ComponentFactor...`) / 组件ConstructorOr工厂F参数（`DockLayout.ComponentConstructor | DockLayout.ComponentFactor...`）
     * @param virtual - virtual parameter (`boolean`) / 虚拟滚动参数（`boolean`）
     */
    registerComponent(
        translator:TranslateService,
        name: string,
        componentConstructorOrFactoryFtn: DockLayout.ComponentConstructor | DockLayout.ComponentFactoryFunction,
        virtual = false
    ): void {
        if (typeof componentConstructorOrFactoryFtn !== 'function') {
            throw new ApiError('registerComponent() componentConstructorOrFactoryFtn parameter is not a function')
        } else {
            if (componentConstructorOrFactoryFtn.hasOwnProperty('prototype')) {
                const componentConstructor = componentConstructorOrFactoryFtn as DockLayout.ComponentConstructor;
                this.registerComponentConstructor(translator,name, componentConstructor, virtual);
            } else {
                const componentFactoryFtn = componentConstructorOrFactoryFtn as DockLayout.ComponentFactoryFunction;
                this.registerComponentFactoryFunction(translator,name, componentFactoryFtn, virtual);
            }
        }
    }

    /**
     * Executes `registerComponentConstructor` to handle register component constructor.
     * @zh 执行 `registerComponentConstructor`，用于注册组件Constructor。
     * @param translator - translator parameter (`TranslateService`) / 翻译器参数（`TranslateService`）
     * @param typeName - type name parameter (`string`) / 类型名称参数（`string`）
     * @param componentConstructor - component constructor parameter (`DockLayout.ComponentConstructor`) / 组件Constructor参数（`DockLayout.ComponentConstructor`）
     * @param virtual - virtual parameter (`boolean`) / 虚拟滚动参数（`boolean`）
     */
    registerComponentConstructor( translator:TranslateService,typeName: string, componentConstructor: DockLayout.ComponentConstructor, virtual = false): void {
        if (typeof componentConstructor !== 'function') {
            throw new Error(
                translator.instant('docklayout.PleaseRegisterAConstructorFunction')
            );
        }

        const existingComponentType = this._componentTypesMap.get(typeName);

        if (existingComponentType !== undefined) {
            throw new BindError(
                translator.instant('docklayout.ComponentIsAlreadyRegistered')+`: ${typeName}`
            );
        }

        this._componentTypesMap.set(typeName, {
                constructor: componentConstructor,
                factoryFunction: undefined,
                virtual,
            }
        );
    }

    /**
     * Executes `registerComponentFactoryFunction` to handle register component factory function.
     * @zh 执行 `registerComponentFactoryFunction`，用于注册组件工厂函数。
     * @param translator - translator parameter (`TranslateService`) / 翻译器参数（`TranslateService`）
     * @param typeName - type name parameter (`string`) / 类型名称参数（`string`）
     * @param componentFactoryFunction - component factory function parameter (`DockLayout.ComponentFactoryFunction`) / 组件工厂函数参数（`DockLayout.ComponentFactoryFunction`）
     * @param virtual - virtual parameter (`boolean`) / 虚拟滚动参数（`boolean`）
     */
    registerComponentFactoryFunction(translator:TranslateService,typeName: string, componentFactoryFunction: DockLayout.ComponentFactoryFunction, virtual = false): void {
        if (typeof componentFactoryFunction !== 'function') {
            throw new BindError('Please register a constructor function');
        }

        const existingComponentType = this._componentTypesMap.get(typeName);

        if (existingComponentType !== undefined) {
            throw new BindError( 
                translator.instant('docklayout.ComponentIsAlreadyRegistered')+`: ${typeName}`);
        }

        this._componentTypesMap.set(typeName, {
                constructor: undefined,
                factoryFunction: componentFactoryFunction,
                virtual,
            }
        );
    }


    /**
     * Executes `registerComponentFunction` to handle register component function.
     * @zh 执行 `registerComponentFunction`，用于注册组件函数。
     * @param callback - callback parameter (`DockLayout.GetComponentConstructorCallback`) / 回调函数参数（`DockLayout.GetComponentConstructorCallback`）
     */
    registerComponentFunction(callback: DockLayout.GetComponentConstructorCallback): void {
        this.registerGetComponentConstructorCallback(callback);
    }


    /**
     * Executes `registerGetComponentConstructorCallback` to handle register get component constructor callback.
     * @zh 执行 `registerGetComponentConstructorCallback`，用于注册获取组件Constructor回调函数。
     * @param callback - callback parameter (`DockLayout.GetComponentConstructorCallback`) / 回调函数参数（`DockLayout.GetComponentConstructorCallback`）
     */
    registerGetComponentConstructorCallback(callback: DockLayout.GetComponentConstructorCallback): void {
        if (typeof callback !== 'function') {
            throw new Error('Please register a callback function');
        }

        if (this._getComponentConstructorFtn !== undefined) {
            console.warn('Multiple component functions are being registered.  Only the final registered function will be used.')
        }

        this._getComponentConstructorFtn = callback;
    }

    /**
     * Executes `getRegisteredComponentTypeNames` to handle get registered component type names.
     * @zh 执行 `getRegisteredComponentTypeNames`，用于获取已注册组件类型名称列表。
     * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
     */
    getRegisteredComponentTypeNames(): string[] {
        const typeNamesIterableIterator = this._componentTypesMap.keys();
        return Array.from(typeNamesIterableIterator);
    }

  
    /**
     * Executes `getComponentInstantiator` to handle get component instantiator.
     * @zh 执行 `getComponentInstantiator`，用于获取组件Instantiator。
     * @param config - config parameter (`ResolvedComponentItemConfig`) / 配置参数（`ResolvedComponentItemConfig`）
     * @returns Result of type `DockLayout.ComponentInstantiator` / 类型为 `DockLayout.ComponentInstantiator` 的返回值
     */
    getComponentInstantiator(config: ResolvedComponentItemConfig): DockLayout.ComponentInstantiator | undefined {
        let instantiator: DockLayout.ComponentInstantiator | undefined;

        const typeName = ResolvedComponentItemConfig.resolveComponentTypeName(config)
        if (typeName !== undefined) {
            instantiator = this._componentTypesMap.get(typeName);
        }
        if (instantiator === undefined) {
            if (this._getComponentConstructorFtn !== undefined) {
                instantiator = {
                    constructor: this._getComponentConstructorFtn(config),
                    factoryFunction: undefined,
                    virtual: false,
                }
            }
        }

        return instantiator;
    }

    /**
     * Executes `bindComponent` to handle bind component.
     * @internal
     * @zh 执行 `bindComponent`，用于绑定组件。
     */
    override bindComponent(translator:TranslateService,container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent {
        let instantiator: DockLayout.ComponentInstantiator | undefined;

        const typeName = ResolvedComponentItemConfig.resolveComponentTypeName(itemConfig);
        if (typeName !== undefined) {
            instantiator = this._componentTypesMap.get(typeName);
        }
        if (instantiator === undefined) {
            if (this._getComponentConstructorFtn !== undefined) {
                instantiator = {
                    constructor: this._getComponentConstructorFtn(itemConfig),
                    factoryFunction: undefined,
                    virtual: false,
                }
            }
        }

        let result: ComponentContainer.BindableComponent;
        if (instantiator !== undefined) {
            const virtual = instantiator.virtual;
         
            let componentState: JsonValue | undefined;
            if (itemConfig.componentState === undefined) {
                componentState = undefined;
            } else {
                // make copy
                componentState = deepExtendValue({}, itemConfig.componentState) as JsonValue;
            }

            let component: ComponentContainer.Component | undefined;
            const componentConstructor = instantiator.constructor;
            if (componentConstructor !== undefined) {
                component = new componentConstructor(container, componentState, virtual);
            } else {
                const factoryFunction = instantiator.factoryFunction;
                if (factoryFunction !== undefined) {
                    component = factoryFunction(container, componentState, virtual);
                } else {
                    throw new AssertError('LMBCFFU10008');
                }
            }

            if (virtual) {
                if (component === undefined) {
                    throw new UnexpectedUndefinedError('GLBCVCU988774');
                } else {
                    const virtuableComponent = component as DockLayout.VirtuableComponent;
                    const componentRootElement = virtuableComponent.rootHtmlElement;
                    if (componentRootElement === undefined) {
                        throw new BindError(
                            translator.instant('docklayout.VirtualComponentDoesNotHaveRootHtmlElement')
                            +`: ${typeName}`);
                    } else {
                        ensureElementPositionAbsolute(componentRootElement);
                        this.container.appendChild(componentRootElement);
                        this._virtuableComponentMap.set(container, virtuableComponent);
                        container.virtualRectingRequiredEvent = this._containerVirtualRectingRequiredEventListener;
                        container.virtualVisibilityChangeRequiredEvent = this._containerVirtualVisibilityChangeRequiredEventListener;
                        container.virtualZIndexChangeRequiredEvent = this._containerVirtualZIndexChangeRequiredEventListener;
                    }
                }
            }

            this._registeredComponentMap.set(container, component);

            result = {
                virtual: instantiator.virtual,
                component,
            };

        } else {
            result = super.bindComponent(this.translator,container, itemConfig);
        }

        return result;
    }

    /**
     * Executes `unbindComponent` to handle unbind component.
     * @internal
     * @zh 执行 `unbindComponent`，用于解绑组件。
     */
    override unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void {
        const registeredComponent = this._registeredComponentMap.get(container);
        if (registeredComponent === undefined) {
            super.unbindComponent(container, virtual, component); // was not created from registration so use virtual unbind events
        } else {
            const virtuableComponent = this._virtuableComponentMap.get(container);
            if (virtuableComponent !== undefined) {
                const componentRootElement = virtuableComponent.rootHtmlElement;
                if (componentRootElement === undefined) {
                    throw new AssertError('GLUC77743', container.title);
                } else {
                    this.container.removeChild(componentRootElement);
                    this._virtuableComponentMap.delete(container);
                }
            }
        }
    }

    /**
     * Executes `fireBeforeVirtualRectingEvent` to handle fire before virtual recting event.
     * @zh 执行 `fireBeforeVirtualRectingEvent`，用于触发之前虚拟滚动矩形事件。
     * @param count - count parameter (`number`) / 计数参数（`number`）
     */
    override fireBeforeVirtualRectingEvent(count: number): void {
        this._dockLayoutBoundingClientRect = this.container.getBoundingClientRect();
        super.fireBeforeVirtualRectingEvent(count);
    }


    /**
     * Executes `handleContainerVirtualRectingRequiredEvent` to handle handle container virtual recting required event.
     * @internal
     * @zh 执行 `handleContainerVirtualRectingRequiredEvent`，用于连接手柄容器虚拟滚动矩形必填事件。
     */
    private handleContainerVirtualRectingRequiredEvent(translator:TranslateService,container: ComponentContainer, width: number, height: number): void {
        const virtuableComponent = this._virtuableComponentMap.get(container);
        if (virtuableComponent === undefined) {
            throw new UnexpectedUndefinedError('GLHCSCE55933');
        } else {
            const rootElement = virtuableComponent.rootHtmlElement;
            if (rootElement === undefined) {
                throw new BindError(
                     translator.instant('docklayout.ComponentIsNotVirtuable') + ' ' + container.title);
            } else {
                const containerBoundingClientRect = container.element.getBoundingClientRect();
                const left = containerBoundingClientRect.left - this._dockLayoutBoundingClientRect.left;
                rootElement.style.left = numberToPixels(left);
                const top = containerBoundingClientRect.top - this._dockLayoutBoundingClientRect.top;
                rootElement.style.top = numberToPixels(top);
                setElementWidth(rootElement, width);
                setElementHeight(rootElement, height);
            }
        }
    }

    /**
     * Executes `handleContainerVirtualVisibilityChangeRequiredEvent` to handle handle container virtual visibility change required event.
     * @internal
     * @zh 执行 `handleContainerVirtualVisibilityChangeRequiredEvent`，用于连接手柄容器虚拟滚动Visibility变更必填事件。
     */
    private handleContainerVirtualVisibilityChangeRequiredEvent(translator:TranslateService,container: ComponentContainer, visible: boolean): void {
        const virtuableComponent = this._virtuableComponentMap.get(container);
        if (virtuableComponent === undefined) {
            throw new UnexpectedUndefinedError('GLHCVVCRE55934');
        } else {
            const rootElement = virtuableComponent.rootHtmlElement;
            if (rootElement === undefined) {
                throw new BindError(
                    translator.instant('docklayout.ComponentIsNotVirtuable')  + ' ' + container.title);
            } else {
                setElementDisplayVisibility(rootElement, visible);
            }
        }
    }

    /**
     * Executes `handleContainerVirtualZIndexChangeRequiredEvent` to handle handle container virtual z index change required event.
     * @internal
     * @zh 执行 `handleContainerVirtualZIndexChangeRequiredEvent`，用于连接手柄容器虚拟滚动Z坐标索引变更必填事件。
     */
    private handleContainerVirtualZIndexChangeRequiredEvent(translator:TranslateService,container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) {
        const virtuableComponent = this._virtuableComponentMap.get(container);
        if (virtuableComponent === undefined) {
            throw new UnexpectedUndefinedError('GLHCVZICRE55935');
        } else {
            const rootElement = virtuableComponent.rootHtmlElement;
            if (rootElement === undefined) {
                throw new BindError(
                    translator.instant('docklayout.ComponentIsNotVirtuable')+ ' ' + container.title);
            } else {
                rootElement.style.zIndex = defaultZIndex;
            }
        }
    }
}

/** @public */
export namespace DockLayout {
    /**
     * Interface `VirtuableComponent` defining the contract and properties for virtuable component.
     * @zh 接口 `VirtuableComponent`，定义Virtuable组件的数据结构契约与属性规范。
     */
    export interface VirtuableComponent {
        /**
         * Property `rootHtmlElement` (`HTMLElement`) storing root html element.
         * @zh 属性 `rootHtmlElement`（类型：`HTMLElement`），用于存储或配置根节点HTML内容元素。
         */
        rootHtmlElement: HTMLElement;
    }

    /**
     * Type alias `ComponentConstructor` representing component constructor (`new(container: ComponentContainer, state: JsonValue | undefined, virtu...`).
     * @zh 类型别名 `ComponentConstructor`，表示组件Constructor（`new(container: ComponentContainer, state: JsonValue | undefined, virtu...`）。
     */
    export type ComponentConstructor = new(container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component;
    /**
     * Type alias `ComponentFactoryFunction` representing component factory function (`(container: ComponentContainer, state: JsonValue | undefined, virtual:...`).
     * @zh 类型别名 `ComponentFactoryFunction`，表示组件工厂函数（`(container: ComponentContainer, state: JsonValue | undefined, virtual:...`）。
     */
    export type ComponentFactoryFunction = (container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component | undefined;
    /**
     * Type alias `GetComponentConstructorCallback` representing get component constructor callback (`(this: void, config: ResolvedComponentItemConfig) => ComponentConstruc...`).
     * @zh 类型别名 `GetComponentConstructorCallback`，表示获取组件Constructor回调函数（`(this: void, config: ResolvedComponentItemConfig) => ComponentConstruc...`）。
     */
    export type GetComponentConstructorCallback = (this: void, config: ResolvedComponentItemConfig) => ComponentConstructor;

    /**
     * Interface `ComponentInstantiator` defining the contract and properties for component instantiator.
     * @zh 接口 `ComponentInstantiator`，定义组件Instantiator的数据结构契约与属性规范。
     */
    export interface ComponentInstantiator {
        /**
         * Property `constructor` (`ComponentConstructor`) storing constructor.
         * @zh 属性 `constructor`（类型：`ComponentConstructor`），用于存储或配置constructor。
         */
        constructor: ComponentConstructor | undefined;
        /**
         * Property `factoryFunction` (`ComponentFactoryFunction`) storing factory function.
         * @zh 属性 `factoryFunction`（类型：`ComponentFactoryFunction`），用于存储或配置工厂函数。
         */
        factoryFunction: ComponentFactoryFunction | undefined;
        /**
         * Property `virtual` (`boolean`) storing virtual.
         * @zh 属性 `virtual`（类型：`boolean`），用于存储或配置虚拟滚动。
         */
        virtual: boolean;
    }
}
