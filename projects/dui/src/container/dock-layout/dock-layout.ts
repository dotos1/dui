import { TranslateService } from '@dotos/dui/i18n';
import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { ApiError, BindError } from './errors/external-error';
import { AssertError, UnexpectedUndefinedError } from './errors/internal-error';
import { JsonValue, LogicalZIndex } from './utils/types';
import { deepExtendValue, ensureElementPositionAbsolute, numberToPixels, setElementDisplayVisibility, setElementHeight, setElementWidth } from './utils/utils';
import { VirtualLayout } from './virtual-layout';

/** @public */
export class DockLayout extends VirtualLayout {
    /** @internal */
    private _componentTypesMap = new Map<string, DockLayout.ComponentInstantiator>();
    /** @internal */
    private _getComponentConstructorFtn: DockLayout.GetComponentConstructorCallback;

    /** @internal */
    private _registeredComponentMap = new Map<ComponentContainer, ComponentContainer.Component>();
    /** @internal */
    private _virtuableComponentMap = new Map<ComponentContainer, DockLayout.VirtuableComponent>();
    /** @internal */
    private _dockLayoutBoundingClientRect: DOMRect;

    /** @internal */
    private _containerVirtualRectingRequiredEventListener =
        (container: ComponentContainer, width: number, height: number) => 
        this.handleContainerVirtualRectingRequiredEvent(this.translator,container, width, height);
    /** @internal */
    private _containerVirtualVisibilityChangeRequiredEventListener =
        (container: ComponentContainer, visible: boolean) =>
         this.handleContainerVirtualVisibilityChangeRequiredEvent(this.translator,container, visible);
    /** @internal */
    private _containerVirtualZIndexChangeRequiredEventListener =
        (container: ComponentContainer, logicalZIndex: LogicalZIndex, defaultZIndex: string) =>
            this.handleContainerVirtualZIndexChangeRequiredEvent(this.translator,container, logicalZIndex, defaultZIndex);

 
    constructor(
        translator:TranslateService,
        container?: HTMLElement,
        bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    );
  
    constructor(translator,config: LayoutConfig, container?: HTMLElement);
    /** @internal */
    constructor(translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement | VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    ) {
        super(translator,configOrOptionalContainer, containerOrBindComponentEventHandler, unbindComponentEventHandler, true);
        if (!this.deprecatedConstructor) {
            this.init();
        }
    }


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


    registerComponentFunction(callback: DockLayout.GetComponentConstructorCallback): void {
        this.registerGetComponentConstructorCallback(callback);
    }


    registerGetComponentConstructorCallback(callback: DockLayout.GetComponentConstructorCallback): void {
        if (typeof callback !== 'function') {
            throw new Error('Please register a callback function');
        }

        if (this._getComponentConstructorFtn !== undefined) {
            console.warn('Multiple component functions are being registered.  Only the final registered function will be used.')
        }

        this._getComponentConstructorFtn = callback;
    }

    getRegisteredComponentTypeNames(): string[] {
        const typeNamesIterableIterator = this._componentTypesMap.keys();
        return Array.from(typeNamesIterableIterator);
    }

  
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

    /** @internal */
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

    /** @internal */
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

    override fireBeforeVirtualRectingEvent(count: number): void {
        this._dockLayoutBoundingClientRect = this.container.getBoundingClientRect();
        super.fireBeforeVirtualRectingEvent(count);
    }


    /** @internal */
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

    /** @internal */
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

    /** @internal */
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
    export interface VirtuableComponent {
        rootHtmlElement: HTMLElement;
    }

    export type ComponentConstructor = new(container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component;
    export type ComponentFactoryFunction = (container: ComponentContainer, state: JsonValue | undefined, virtual: boolean) => ComponentContainer.Component | undefined;
    export type GetComponentConstructorCallback = (this: void, config: ResolvedComponentItemConfig) => ComponentConstructor;

    export interface ComponentInstantiator {
        constructor: ComponentConstructor | undefined;
        factoryFunction: ComponentFactoryFunction | undefined;
        virtual: boolean;
    }
}
