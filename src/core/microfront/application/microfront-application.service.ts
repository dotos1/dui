import { MicroFrontApplication } from '../microfront.class';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import { coerceArray } from '../helpers';
import { Observable } from 'rxjs';
import { AssetsLoader } from '../assets-loader';
import { getApplicationService } from '../global-microfront';

@Injectable({
    providedIn: 'root'
})
export class MicroFrontApplicationService {
    private apps: MicroFrontApplication[] = [];

    private appsMap: { [key: string]: MicroFrontApplication } = {};

    constructor(
        private http: HttpClient,
        private assetsLoader: AssetsLoader
    ) {
        if (getApplicationService()) {
            throw new Error('MicroFrontApplicationService has been injected in the portal, repeated injection is not allowed');
        }
    }

    register<TExtra>(appOrApps: MicroFrontApplication<TExtra> | MicroFrontApplication<TExtra>[]) {
        const apps = coerceArray(appOrApps);
        apps.forEach(app => {
            if (this.appsMap[app.name]) {
                throw new Error(`${app.name} has be registered.`);
            }
            this.apps.push(app);
            this.appsMap[app.name] = app;
        });
    }

    registerByUrl(url: string): Observable<void> {
        const result = this.http.get(`${url}`).pipe(
            map(apps => {
                if (apps && Array.isArray(apps)) {
                    this.register(apps);
                } else {
                    this.register(apps as MicroFrontApplication);
                }
            }),
            shareReplay()
        );
        result.subscribe();
        return result;
    }

    unregister(name: string) {
        if (this.appsMap[name]) {
            delete this.appsMap[name];
            this.apps = this.apps.filter(app => {
                return app.name !== name;
            });
        }
    }

    getAppsByMatchedUrl<TExtra = unknown>(url: string): MicroFrontApplication<TExtra>[] {
        return this.getApps().filter(app => {
            if (app.routerPathPrefix instanceof RegExp) {
                return app.routerPathPrefix.test(url);
            } else {
                return (
                    url === app.routerPathPrefix ||
                    (url.startsWith(app.routerPathPrefix) && ['/', '?'].includes(url[app.routerPathPrefix.length]))
                );
            }
        });
    }

    getAppByName(name: string) {
        return this.appsMap[name];
    }

    getAppsToPreload(excludeAppNames?: string[]) {
        return this.getApps().filter(app => {
            if (excludeAppNames) {
                return app.preload && !excludeAppNames.includes(app.name);
            } else {
                return app.preload;
            }
        });
    }

    getApps() {
        return this.apps;
    }
}
