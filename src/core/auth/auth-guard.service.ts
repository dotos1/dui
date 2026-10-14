
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@dotos/dui/core/config';

import { AuthGuardBase } from './auth-guard-base';
import { JwtHelperService } from './jwt-helper.service';
import { AuthService } from './auth.service';
import { LocalStorageService } from '@dotos/dui/core/storage';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends AuthGuardBase implements OnDestroy {
    ticketChangeBind: any;
    constructor(private jwtHelperService: JwtHelperService,
                authenticationService: AuthService,
                router: Router,
                appConfigService: ConfigService,
                dialog: MatDialog,
                storageService: LocalStorageService) {
        super(authenticationService, router, appConfigService, dialog, storageService);
        this.ticketChangeBind = this.ticketChange.bind(this);
        window.addEventListener('storage', this.ticketChangeBind);
    }
    ngOnDestroy(): void {
        window.removeEventListener('storage', this.ticketChangeBind);
    }
    ticketChange(event: StorageEvent) {
        if (event.key && event.key.endsWith('ticket') && event.newValue !== event.oldValue) {
            this.ticketChangeRedirect(event);
        }
        // Per the StorageEvent spec, `localStorage.clear()` (a common logout pattern)
        // fires with event.key === null; without this guard that crashed here on
        // every same-origin tab whenever any tab cleared storage.
        if (event.key && event.key.endsWith(JwtHelperService.USER_ACCESS_TOKEN) &&
            this.jwtHelperService.getValueFromToken(event.newValue, JwtHelperService.USER_PREFERRED_USERNAME) !==
            this.jwtHelperService.getValueFromToken(event.oldValue, JwtHelperService.USER_PREFERRED_USERNAME)) {
            this.ticketChangeRedirect(event);
        }
    }
    private ticketChangeRedirect(event: StorageEvent) {
        if (!event.newValue) {
            this.navigate(this.router.url);
        } else {
            window.location.reload();
        }
    }
    async checkLogin(_: ActivatedRouteSnapshot, redirectUrl: string): Promise<boolean | UrlTree> {
        if (this.authenticationService.isLoggedIn() || this.withCredentials) {
            return true;
        }
        return this.redirectToUrl(redirectUrl);
    }
}
