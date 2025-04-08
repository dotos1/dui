import { DOCUMENT } from '@angular/common';
import {
    ApplicationRef,
    ComponentRef,
    ElementRef,
    EmbeddedViewRef,
    EnvironmentInjector,
    Inject,
    Injectable,
    Injector,
    NgModuleRef,
    NgZone,
    TemplateRef,
    Type,
    createComponent,
    reflectComponentType
} from '@angular/core';

import { Observable, of, timer } from 'rxjs';
import { delayWhen, map, shareReplay } from 'rxjs/operators';
import { NgMicroFrontApplicationRef } from '../application/microfront-application-ref';
import { MicroFrontApplicationRef } from '../application/microfront-application-ref-interface';
import {
    getApplicationLoader,
    getApplicationService,
    getBootstrappedMicroFrontApplicationRef,
    getMicroFrontApplicationRef,
    globalMicroFront
} from '../global-microfront';
import { coerceArray } from '../helpers';
import { MicroFrontComponentRef } from './microfront-component-types';
import { PlantComponentConfig } from './microfront-component.config';
import { MicroFrontPortalApplication } from '../application/portal-application';

const componentWrapperClass = 'microfront-component-wrapper';

function isComponentType<T>(component: MicroFrontComponent<T>): component is Type<T> {
    return typeof component === 'function' && component.constructor === Function;
}

export type MicroFrontComponent<T = unknown> =
    | {
          name: string;
          component: Type<T>;
      }
    | Type<T>;

@Injectable({
    providedIn: 'root'
})
export class MicroFrontComponentLoader {
    private get applicationLoader() {
        return getApplicationLoader();
    }

    private get applicationService() {
        return getApplicationService();
    }

    constructor(
        private applicationRef: ApplicationRef,
        private ngModuleRef: NgModuleRef<any>,
        private ngZone: NgZone,
        @Inject(DOCUMENT) private document: any
    ) {}

    private getPlantAppRef(name: string): Observable<MicroFrontApplicationRef> {
        const plantAppRef = getBootstrappedMicroFrontApplicationRef(name);
        if (plantAppRef) {
            return of(plantAppRef);
        } else {
            const app = this.applicationService.getAppByName(name);
            return this.applicationLoader.preload(app, true).pipe(
                map(() => {
                    return getMicroFrontApplicationRef(name);
                })
            );
        }
    }

    private createInjector<TData>(parentInjector: Injector, componentRef: MicroFrontComponentRef<TData>): Injector {
        return Injector.create({
            providers: [
                {
                    provide: MicroFrontComponentRef,
                    useValue: componentRef
                }
            ],
            parent: parentInjector
        });
    }

    private getContainerElement(config: PlantComponentConfig): HTMLElement {
        if (!config.container) {
            throw new Error(`config 'container' cannot be null`);
        } else {
            if ((config.container as ElementRef).nativeElement) {
                return (config.container as ElementRef).nativeElement;
            } else {
                return config.container as HTMLElement;
            }
        }
    }

    private insertComponentRootNodeToContainer(container: HTMLElement, componentRootNode: HTMLElement, hostClass: string) {
        const subApp = this.applicationService.getAppByName(this.ngModuleRef.instance.appName);
        componentRootNode.classList.add(componentWrapperClass);
        componentRootNode.setAttribute('microfront-inline', '');
        if (hostClass) {
            componentRootNode.classList.add(hostClass);
        }
        if (subApp && subApp.stylePrefix) {
            componentRootNode.classList.add(subApp.stylePrefix);
        }
        // container 是注释则在前方插入，否则在元素内部插入
        if (container.nodeType === 8) {
            container.parentElement.insertBefore(componentRootNode, container);
        } else {
            container.appendChild(componentRootNode);
        }
    }

    private attachComponent<TData>(
        component: Type<unknown>,
        environmentInjector: EnvironmentInjector,
        config: PlantComponentConfig
    ): MicroFrontComponentRef<TData> {
        const plantComponentRef = new MicroFrontComponentRef();
        const appRef = this.applicationRef;
        const injector = this.createInjector<TData>(environmentInjector, plantComponentRef);
        const container = this.getContainerElement(config);

        const componentRef = createComponent(component, {
            environmentInjector: environmentInjector,
            elementInjector: injector,
            projectableNodes: config.projectableNodes as Node[][]
        });
        appRef.attachView(componentRef.hostView);
        const componentRootNode = this.getComponentRootNode(componentRef);
        this.insertComponentRootNodeToContainer(container, componentRootNode, config.hostClass || config.wrapperClass);
        if (config.initialState) {
            Object.assign(componentRef.instance, config.initialState);
        }
        plantComponentRef.componentInstance = componentRef.instance;
        plantComponentRef.componentRef = componentRef;
        plantComponentRef.hostElement = componentRootNode;
        plantComponentRef.dispose = () => {
            if (appRef.viewCount > 0) {
                appRef.detachView(componentRef.hostView);
            }
            componentRef?.destroy();
            componentRootNode.remove();
        };
        return plantComponentRef;
    }

    /** Gets the root HTMLElement for an instantiated component. */
    private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    private registerComponentFactory(componentOrComponents: MicroFrontComponent | MicroFrontComponent[]) {
        const app = this.ngModuleRef.instance.appName;
        let appRef$: Observable<NgMicroFrontApplicationRef | MicroFrontPortalApplication>;

        if (app) {
            appRef$ = this.getPlantAppRef(app) as Observable<NgMicroFrontApplicationRef>;
        } else {
            appRef$ = of(globalMicroFront.portalApplication);
        }

        appRef$.subscribe(appRef => {
            appRef.registerComponentFactory((componentName: string, config: PlantComponentConfig<any>) => {
                const components = coerceArray(componentOrComponents);
                const planetComponent = components.find(item => {
                    return isComponentType(item)
                        ? reflectComponentType(item).selector.includes(componentName)
                        : item.name === componentName;
                });
                if (planetComponent) {
                    return this.ngZone.run(() => {
                        const componentRef = this.attachComponent<any>(
                            isComponentType(planetComponent) ? planetComponent : planetComponent.component,
                            appRef instanceof NgMicroFrontApplicationRef ? appRef.appModuleRef.injector : this.ngModuleRef.injector,
                            config
                        );
                        return componentRef;
                    });
                } else {
                    throw Error(`unregistered component ${componentName} in app ${app}`);
                }
            });
        });
    }

    register(components: MicroFrontComponent | MicroFrontComponent[], immediate?: boolean) {
        if (immediate) {
            this.registerComponentFactory(components);
        } else {
            setTimeout(() => {
                this.registerComponentFactory(components);
            });
        }
    }

    load<TComp = unknown, TData = unknown>(
        app: string,
        componentName: string,
        config: PlantComponentConfig<TData>
    ): Observable<MicroFrontComponentRef<TComp>> {
        let appRef$: Observable<NgMicroFrontApplicationRef | MicroFrontPortalApplication>;
        if (app === globalMicroFront.portalApplication.name) {
            appRef$ = of(globalMicroFront.portalApplication);
        } else {
            appRef$ = this.getPlantAppRef(app).pipe(
                delayWhen((appRef: NgMicroFrontApplicationRef) => {
                    if (appRef.getComponentFactory()) {
                        return of('');
                    } else {
                        // Because register use 'setTimeout',so timer 20
                        return timer(20);
                    }
                })
            );
        }
        const result = appRef$.pipe(
            map(appRef => {
                const componentFactory = appRef.getComponentFactory();
                if (componentFactory) {
                    const projectableEmbeddedViewRefs: EmbeddedViewRef<any>[] = [];
                    const projectableNodes: Node[][] = (config.projectableNodes || []).map(node => {
                        if (node instanceof TemplateRef) {
                            const viewRef = node.createEmbeddedView({});
                            projectableEmbeddedViewRefs.push(viewRef);
                            this.applicationRef.attachView(viewRef);
                            return viewRef.rootNodes;
                        } else {
                            return node;
                        }
                    });
                    const compRef = componentFactory<TData, TComp>(componentName, { ...config, projectableNodes: projectableNodes });
                    const dispose = compRef.dispose.bind(compRef);
                    compRef.dispose = () => {
                        projectableEmbeddedViewRefs.forEach(viewRef => {
                            this.applicationRef.detachView(viewRef);
                            viewRef.destroy();
                        });
                        dispose();
                    };
                    return compRef;
                } else {
                    throw new Error(`${app}'s component(${componentName}) is not registered`);
                }
            }),
            shareReplay()
        );
        result.subscribe();
        return result;
    }
}
