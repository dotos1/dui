import { MicroFrontApplicationRef } from './application/microfront-application-ref-interface';
import { MicroFrontPortalApplication } from './application/portal-application';
import { MicroFrontApplicationLoader } from './application/microfront-application-loader';
import { MicroFrontApplicationService } from './application/microfront-application.service';
import { isFunction } from './helpers';
import { NgBootstrapAppModule, NgBootstrapOptions, NgMicroFrontApplicationRef } from './application/microfront-application-ref';

declare const window: any;

export interface GlobalMicroFront {
    apps: { [key: string]: MicroFrontApplicationRef };
    portalApplication?: MicroFrontPortalApplication;
    applicationLoader: MicroFrontApplicationLoader;
    applicationService: MicroFrontApplicationService;
}

export const globalMicroFront: GlobalMicroFront = (window.microfront = window.microfront || {
    apps: {}
});

export function defineApplication<TOptions extends NgBootstrapAppModule | NgBootstrapOptions>(name: string, options: TOptions) {
    if (globalMicroFront.apps[name]) {
        throw new Error(`${name} application has exist.`);
    }
    if (isFunction(options)) {
        options = {
            template: '',
            bootstrap: options as NgBootstrapAppModule
        } as TOptions;
    }
    const appRef = new NgMicroFrontApplicationRef(name, options as NgBootstrapOptions);
    globalMicroFront.apps[name] = appRef;
}

export function getMicroFrontApplicationRef(appName: string): MicroFrontApplicationRef | null {
    if (globalMicroFront && globalMicroFront.apps && globalMicroFront.apps[appName]) {
        return globalMicroFront.apps[appName];
    } else {
        return null;
    }
}

export function getBootstrappedMicroFrontApplicationRef(appName: string): MicroFrontApplicationRef | null {
    const plantAppRef = getMicroFrontApplicationRef(appName);
    if (plantAppRef) {
        // 兼容之前的版本，之前是通过 appModuleRef 来判断是否启用的
        if (plantAppRef.bootstrapped || plantAppRef['appModuleRef']) {
            return plantAppRef;
        }
    }
    return null;
}

export function setPortalApplicationData<T>(data: T) {
    if (globalMicroFront.portalApplication) {
        globalMicroFront.portalApplication.data = data;
    }
}

export function getPortalApplicationData<TData>(): TData {
    return globalMicroFront.portalApplication?.data as TData;
}

export function setApplicationLoader(loader: MicroFrontApplicationLoader) {
    globalMicroFront.applicationLoader = loader;
}

export function getApplicationLoader() {
    return globalMicroFront.applicationLoader;
}

export function setApplicationService(service: MicroFrontApplicationService) {
    globalMicroFront.applicationService = service;
}

export function getApplicationService() {
    return globalMicroFront.applicationService;
}

export function clearGlobalMicroFront() {
    window.microfront.apps = {};
    window.microfront.portalApplication = null;
    window.microfront.applicationLoader = null;
    window.microfront.applicationService = null;
}
