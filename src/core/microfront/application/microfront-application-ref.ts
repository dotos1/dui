import { ApplicationRef, NgModuleRef, NgZone, EnvironmentInjector } from '@angular/core';
import { Router, NavigationEnd,  NavigationBehaviorOptions } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { MicroFrontPortalApplication } from './portal-application';
import { PlantComponentFactory } from '../component/microfront-component-types';
import { getTagNameByTemplate } from '../helpers';
import { getSandboxInstance, Sandbox } from '../sandbox';
import { MicroFrontApplicationRef } from './microfront-application-ref-interface';

export type NgBootstrapAppModule = (
    portalApp: MicroFrontPortalApplication
) => Promise<NgModuleRef<any> | void | ApplicationRef | undefined | null>;

export interface NgBootstrapOptions {
    template: string;
    bootstrap: NgBootstrapAppModule;
}

/**
 * @deprecated please use NgBootstrapAppModule
 */
export type BootstrapAppModule = NgBootstrapAppModule;
/**
 * @deprecated please use NgBootstrapOptions
 */
export interface BootstrapOptions extends NgBootstrapOptions {}

export class NgMicroFrontApplicationRef implements MicroFrontApplicationRef {
    private injector?: EnvironmentInjector;
    private appRef?: ApplicationRef;
    public appModuleRef?: NgModuleRef<any>;
    public template?: string;
    private innerSelector?: string;
    private name: string;
    private portalApp!: MicroFrontPortalApplication;
    private appModuleBootstrap?: NgBootstrapAppModule;
    private componentFactory?: PlantComponentFactory;

    public get selector() {
        return this.innerSelector;
    }

    public get ngZone(): NgZone | undefined {
        return (this.injector || this.appModuleRef?.injector)?.get(NgZone);
    }

    public get sandbox(): Sandbox {
        return getSandboxInstance();
    }

    public get bootstrapped(): boolean {
        return !!(this.appModuleRef || this.appRef);
    }

    constructor(name: string, options?: BootstrapOptions) {
        this.name = name;
        if (options) {
            this.template = options.template;
            this.innerSelector = this.template ? getTagNameByTemplate(this.template) : '';
            this.appModuleBootstrap = options.bootstrap;
        }
        // This is a hack, since NgZone doesn't allow you to configure the property that identifies your zone.
        // See https://github.com/PlaceMe-SAS/single-spa-angular-cli/issues/33,
        // NgZone.isInAngularZone = () => {
        //     // @ts-ignore
        //     return window.Zone.current._properties[`ngx-microfront-${name}`] === true;
        // };
    }

    // 子应用路由变化后同步修改 portal 的 Route
    private syncPortalRouteWhenNavigationEnd() {
        const router = (this.injector || this.appModuleRef?.injector)?.get(Router);
        if (router) {
            router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const currentNavigation = router.getCurrentNavigation();
                    this.ngZone?.onStable
                        .asObservable()
                        .pipe(take(1))
                        .subscribe(() => {
                            this.portalApp.ngZone.run(() => {
                                if (currentNavigation?.extras?.browserUrl) {
                                    this.portalApp.router!.navigateByUrl(event.url, {
                                        browserUrl: currentNavigation.extras.browserUrl
                                    });
                                } else {
                                    this.portalApp.router!.navigateByUrl(event.url);
                                }
                            });
                        });
                }
            });
        }
    }

    bootstrap(app: MicroFrontPortalApplication): Observable<this> {
        if (!this.appModuleBootstrap) {
            throw new Error(`app(${this.name}) is not defined`);
        }
        this.portalApp = app;
        return from(
            this.appModuleBootstrap(app).then(appModuleRef => {
                if (appModuleRef['instance']) {
                    this.appModuleRef = appModuleRef as NgModuleRef<any>;
                    this.appModuleRef.instance.appName = this.name;
                    this.injector = this.appModuleRef.injector;
                } else {
                    this.appRef = appModuleRef as unknown as ApplicationRef;
                    this.injector = this.appRef.injector;
                    const moduleRef = this.appRef.injector.get(NgModuleRef);
                    (moduleRef as any).instance = { appName: this.name };
                }
                this.syncPortalRouteWhenNavigationEnd();
                return this;
            })
        );
    }

    getRouter() {
        return (this.injector || this.appModuleRef?.injector)?.get(Router);
    }

    getCurrentRouterStateUrl() {
        return this.getRouter()?.routerState.snapshot.url;
    }

    navigateByUrl(url: string, extras?: NavigationBehaviorOptions): void {
        const router = this.getRouter();
        this.ngZone?.run(() => {
            router?.navigateByUrl(url, extras);
        });
    }

    getComponentFactory() {
        return this.componentFactory;
    }

    registerComponentFactory(componentFactory: PlantComponentFactory) {
        this.componentFactory = componentFactory;
    }

    destroy(): void {
        if (this.appModuleRef || this.appRef) {
            const router = (this.injector || this.appModuleRef?.injector)?.get(Router);
            if (router) {
                router.dispose();
            }
            if (this.sandbox) {
                this.sandbox.destroy();
            }
            this.appModuleRef?.destroy();
            this.appModuleRef = undefined;
            this.appRef?.destroy();
            this.appRef = undefined;
            this.injector = undefined;
        }
    }
}
