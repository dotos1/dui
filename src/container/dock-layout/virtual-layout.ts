import { TranslateService } from '@dotos/dui/translator';
import { LayoutConfig } from './config/config';
import { ResolvedComponentItemConfig, ResolvedLayoutConfig, ResolvedPopoutLayoutConfig } from './config/resolved-config';
import { ComponentContainer } from './container/component-container';
import { BindError } from './errors/external-error';
import { UnexpectedUndefinedError } from './errors/internal-error';
import { LayoutManager } from './layout-manager';
import { DomConstants } from './utils/dom-constants';


/** @public */
export class VirtualLayout extends LayoutManager {

    getComponentEvent: VirtualLayout.GetComponentEventHandler | undefined;

    releaseComponentEvent: VirtualLayout.ReleaseComponentEventHandler | undefined;

    bindComponentEvent: VirtualLayout.BindComponentEventHandler | undefined;
    unbindComponentEvent: VirtualLayout.UnbindComponentEventHandler | undefined;


    private _bindComponentEventHanlderPassedInConstructor = false;

    private _creationTimeoutPassed = false; 

    constructor(
        translator:TranslateService,
        container?: HTMLElement,
        bindComponentEventHandler?: VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
    );
    constructor(translator,config: LayoutConfig, container?: HTMLElement);
    constructor( translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler: HTMLElement | VirtualLayout.BindComponentEventHandler | undefined,
        unbindComponentEventHandler: VirtualLayout.UnbindComponentEventHandler | undefined,
        skipInit: true,
    );
    /** @internal */
    constructor( translator:TranslateService,configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement | VirtualLayout.BindComponentEventHandler,
        unbindComponentEventHandler?: VirtualLayout.UnbindComponentEventHandler,
        skipInit?: true,
    ) {
        super(translator,VirtualLayout.createLayoutManagerConstructorParameters(configOrOptionalContainer, containerOrBindComponentEventHandler));

        if (containerOrBindComponentEventHandler !== undefined) {
            if (typeof containerOrBindComponentEventHandler === 'function') {
                this.bindComponentEvent = containerOrBindComponentEventHandler;
                this._bindComponentEventHanlderPassedInConstructor = true;

                if (unbindComponentEventHandler !== undefined) {
                    this.unbindComponentEvent = unbindComponentEventHandler;
                }
            }
        }

        if (!this._bindComponentEventHanlderPassedInConstructor) {
            // backward compatibility

            if (this.isSubWindow) {
                if (this._constructorOrSubWindowLayoutConfig === undefined) {
                    throw new UnexpectedUndefinedError('VLC98823');
                } else {
                    const resolvedLayoutConfig = LayoutConfig.resolve(
                        translator,this._constructorOrSubWindowLayoutConfig
                    );
                    // remove root from layoutConfig
                    this.layoutConfig = {
                        ...resolvedLayoutConfig,
                        root: undefined,
                    }
                }
            }
        }

        if (skipInit !== true) {
            if (!this.deprecatedConstructor) {
                this.init();
            }
        }
    }

    override destroy(): void {
        this.bindComponentEvent = undefined;
        this.unbindComponentEvent = undefined;

        super.destroy();
    }


    override init(): void {

        /**
         * If the document isn't ready yet, wait for it.
         */
        if (!this._bindComponentEventHanlderPassedInConstructor && (document.readyState === 'loading' || document.body === null)) {
            document.addEventListener('DOMContentLoaded', () => this.init(), { passive: true });
            return;
        }

        if (!this._bindComponentEventHanlderPassedInConstructor && this.isSubWindow === true && !this._creationTimeoutPassed) {
            setTimeout(() => this.init(), 7);
            this._creationTimeoutPassed = true;
            return;
        }

        if (this.isSubWindow === true) {
            if (!this._bindComponentEventHanlderPassedInConstructor) {
                this.clearHtmlAndAdjustStylesForSubWindow();
            }

            // Expose this instance on the window object to allow the opening window to interact with it
            //@ts-ignore
            window.__glInstance = this;
        }

        super.init();
    }

    clearHtmlAndAdjustStylesForSubWindow(): void {
        const headElement = document.head;

        const appendNodeLists = new Array<NodeListOf<Element>>(4);
        appendNodeLists[0] = document.querySelectorAll('body link');
        appendNodeLists[1] = document.querySelectorAll('body style');
        appendNodeLists[2] = document.querySelectorAll('template');
        appendNodeLists[3] = document.querySelectorAll('.gl_keep');

        for (let listIdx = 0; listIdx < appendNodeLists.length; listIdx++) {
            const appendNodeList = appendNodeLists[listIdx];
            for (let nodeIdx = 0; nodeIdx < appendNodeList.length; nodeIdx++) {
                const node = appendNodeList[nodeIdx];
                headElement.appendChild(node);
            }
        }

        const bodyElement = document.body;
        bodyElement.innerHTML = '';
        bodyElement.style.visibility = 'visible';
        this.checkAddDefaultPopinButton();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x = document.body.offsetHeight;
    }
    checkAddDefaultPopinButton(): boolean {
        if (this.layoutConfig.settings.popInOnClose) {
            return false;
        } else {
            const popInButtonElement = document.createElement('div');
            popInButtonElement.classList.add(DomConstants.ClassName.Popin);
            popInButtonElement.setAttribute('title', this.layoutConfig.header.dock);
            const iconElement = document.createElement('div');
            iconElement.classList.add(DomConstants.ClassName.Icon);
            const bgElement = document.createElement('div');
            bgElement.classList.add(DomConstants.ClassName.Bg);
            popInButtonElement.appendChild(iconElement);
            popInButtonElement.appendChild(bgElement);
            popInButtonElement.addEventListener('click', () => this.emit('popIn'));
            document.body.appendChild(popInButtonElement);
            return true;
        }
    }

    /** @internal */
    override bindComponent( translator:TranslateService,container: ComponentContainer, itemConfig: ResolvedComponentItemConfig): ComponentContainer.BindableComponent {
        if (this.bindComponentEvent !== undefined) {
            const bindableComponent = this.bindComponentEvent(container, itemConfig);
            return bindableComponent;
        } else {
            if (this.getComponentEvent !== undefined) {
                return {
                    virtual: false,
                    component: this.getComponentEvent(container, itemConfig),
                }
            } else {
                const text = translator.instant('docklayout.ComponentTypeNotRegisteredAndBindComponentEventHandlerNotAssigned');
                const message = `${text}: ${JSON.stringify(itemConfig)}`
                throw new BindError(message);
            }
        }
    }

    /** @internal */
    override unbindComponent(container: ComponentContainer, virtual: boolean, component: ComponentContainer.Component | undefined): void {
        if (this.unbindComponentEvent !== undefined) {
            this.unbindComponentEvent(container);
        } else {
            if (!virtual && this.releaseComponentEvent !== undefined) {
                if (component !== undefined) {
                    this.releaseComponentEvent(container, component);          
                } 
                // else {
                //     throw new UnexpectedUndefinedError('VCUCRCU333998');
                // }
            }
        }
    }
}

/** @public */
export namespace VirtualLayout {
 
    export type GetComponentEventHandler =
        (this: void, container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => ComponentContainer.Component;

    export type ReleaseComponentEventHandler =
        (this: void, container: ComponentContainer, component: ComponentContainer.Component) => void;

    export type BindComponentEventHandler =
        (this: void, container: ComponentContainer, itemConfig: ResolvedComponentItemConfig) => ComponentContainer.BindableComponent;
    export type UnbindComponentEventHandler =
        (this: void, container: ComponentContainer) => void;

    export type BeforeVirtualRectingEvent = (this: void) => void;

    /** @internal
     * Veriable to hold the state whether we already checked if we are running in a sub window.
     * Fixes popout and creation of nested dock-layouts.
     */
    let subWindowChecked = false;

    /** @internal */
    export function createLayoutManagerConstructorParameters(configOrOptionalContainer: LayoutConfig | HTMLElement | undefined,
        containerOrBindComponentEventHandler?: HTMLElement |  VirtualLayout.BindComponentEventHandler):
        LayoutManager.ConstructorParameters
    {
        const windowConfigKey = subWindowChecked ? null : new URL(document.location.href).searchParams.get('gl-window');
        subWindowChecked = true;
        const isSubWindow = windowConfigKey !== null;

        let containerElement: HTMLElement | undefined;
        let config: LayoutConfig | undefined;
        if (windowConfigKey !== null) {
            const windowConfigStr = localStorage.getItem(windowConfigKey);
            if (windowConfigStr === null) {
                throw new Error('Null gl-window Config');
            }
            localStorage.removeItem(windowConfigKey);
            const minifiedWindowConfig = JSON.parse(windowConfigStr) as ResolvedPopoutLayoutConfig;
            const resolvedConfig = ResolvedLayoutConfig.unminifyConfig(minifiedWindowConfig);
            config = LayoutConfig.fromResolved(resolvedConfig)

            if (configOrOptionalContainer instanceof HTMLElement) {
                containerElement = configOrOptionalContainer;
            }
        } else {
            if (configOrOptionalContainer === undefined) {
                config = undefined;
            } else {
                if (configOrOptionalContainer instanceof HTMLElement) {
                    config = undefined;
                    containerElement = configOrOptionalContainer;
                } else {
                    // backwards compatibility
                    config = configOrOptionalContainer;
                }
            }

            if (containerElement === undefined) {
                if (containerOrBindComponentEventHandler instanceof HTMLElement) {
                    containerElement = containerOrBindComponentEventHandler;
                }
            }
        }

        return {
            constructorOrSubWindowLayoutConfig: config,
            isSubWindow,
            containerElement,
        };
    }
}
