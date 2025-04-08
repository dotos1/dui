import { NgModule, ModuleWithProviders } from '@angular/core';
import { MicroFrontApplication, PLANET_APPLICATIONS } from './microfront.class';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EmptyComponent } from './empty/empty.component';
import { MicroFrontComponentOutlet } from './component/microfront-component-outlet';
import { RedirectToRouteComponent } from './router/route-redirect';

@NgModule({
    declarations: [],
    exports: [EmptyComponent, MicroFrontComponentOutlet],
    imports: [MicroFrontComponentOutlet, EmptyComponent, RedirectToRouteComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class NgxMicroFrontModule {
    static forRoot(apps: MicroFrontApplication[]): ModuleWithProviders<NgxMicroFrontModule> {
        return {
            ngModule: NgxMicroFrontModule,
            providers: [
                {
                    provide: PLANET_APPLICATIONS,
                    useValue: apps
                }
            ]
        };
    }
}
