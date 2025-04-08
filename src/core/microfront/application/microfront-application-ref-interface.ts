import { Observable } from 'rxjs';
import { MicroFrontPortalApplication } from './portal-application';

export interface MicroFrontApplicationRef {
    template?: string;
    get bootstrapped(): boolean;
    get selector(): string;
    bootstrap(app: MicroFrontPortalApplication): Observable<this>;
    navigateByUrl(url: string): void;
    getCurrentRouterStateUrl(): string;
    destroy(): void;
}
