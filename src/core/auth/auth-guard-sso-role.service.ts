

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from './jwt-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSsoRoleService  {
    constructor(private jwtHelperService: JwtHelperService, private router: Router, private dialog: MatDialog) {
    }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        let hasRole;
        let hasRealmRole = false;
        let hasClientRole = true;
        if (route.data) {
            if (route.data['roles']) {
                const rolesToCheck = route.data['roles'];
                hasRealmRole = this.jwtHelperService.hasRealmRoles(rolesToCheck);
            }
            if (route.data['clientRoles']) {
                const clientRoleName = route.params[route.data['clientRoles']];
                const rolesToCheck = route.data['roles'];
                hasClientRole = this.jwtHelperService.hasRealmRolesForClientRole(clientRoleName, rolesToCheck);
            }
        }
        hasRole = hasRealmRole && hasClientRole;
        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }
        if (!hasRole) {
            this.dialog.closeAll();
        }
        return hasRole;
    }
}
