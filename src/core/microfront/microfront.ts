import { Injectable, Inject, Optional, Injector } from '@angular/core';
import { NavigationEnd, RouterEvent, Router } from '@angular/router';
import { MicroFrontOptions, MicroFrontApplication, PLANET_APPLICATIONS } from './microfront.class';
import { MicroFrontApplicationService } from './application/microfront-application.service';
import { MicroFrontApplicationLoader, AppsLoadingStartEvent, AppStatusChangeEvent } from './application/microfront-application-loader';
import { Observable, Subscription } from 'rxjs';
import { filter, startWith, distinctUntilChanged, map } from 'rxjs/operators';
import {
    setPortalApplicationData,
    setApplicationLoader,
    setApplicationService,
    getApplicationLoader,
    getApplicationService
} from './global-microfront';
import { setDebugFactory } from './debug';

@Injectable({
    providedIn: 'root'
})
export class MicroFront {
    private get planetApplicationLoader(): MicroFrontApplicationLoader {
        return getApplicationLoader();
    }

    private get planetApplicationService() {
        return getApplicationService();
    }

    /**
     * @deprecated please use loading signal
     */
    public get loadingDone() {
        return this.planetApplicationLoader.loadingDone;
    }

    public get loading() {
        return this.planetApplicationLoader.loading;
    }

    public get appStatusChange(): Observable<AppStatusChangeEvent> {
        return this.planetApplicationLoader.appStatusChange;
    }

    public get appsLoadingStart(): Observable<AppsLoadingStartEvent> {
        return this.planetApplicationLoader.appsLoadingStart;
    }

    private subscription?: Subscription;

    constructor(
        private injector: Injector,
        private router: Router,
        @Inject(PLANET_APPLICATIONS) @Optional() planetApplications: MicroFrontApplication[]
    ) {
        if (!this.planetApplicationLoader) {
            setApplicationLoader(this.injector.get(MicroFrontApplicationLoader));
        }
        if (!this.planetApplicationService) {
            setApplicationService(this.injector.get(MicroFrontApplicationService));
        }

        if (planetApplications) {
            this.registerApps(planetApplications);
        }
    }

    setOptions(options: Partial<MicroFrontOptions>) {
        this.planetApplicationLoader.setOptions(options);
        if (options.debugFactory) {
            setDebugFactory(options.debugFactory);
        }
    }

    setPortalAppData<T>(data: T) {
        setPortalApplicationData(data);
    }

    registerApp<TExtra>(app: MicroFrontApplication<TExtra>) {
        this.planetApplicationService.register(app);
    }

    registerApps<TExtra>(apps: MicroFrontApplication<TExtra>[]) {
        this.planetApplicationService.register(apps);
    }

    unregisterApp(name: string) {
        this.planetApplicationService.unregister(name);
    }

    getApps() {
        return this.planetApplicationService.getApps();
    }

    start() {
        this.subscription = (this.router.events as Observable<RouterEvent>)
            .pipe(
                filter(event => {
                    return event instanceof NavigationEnd;
                }),
                map(event => {
                    return (event as NavigationEnd).urlAfterRedirects || event.url;
                }),
                startWith(location.pathname),
                distinctUntilChanged()
            )
            .subscribe((url: string) => {
                this.planetApplicationLoader.reroute({
                    url: url
                });
            });
    }

    stop() {
        this.subscription?.unsubscribe();
    }
}
