
import { Injectable } from '@angular/core';
import { StorageService } from '@dotos/dui/core/services';

@Injectable({
    providedIn: 'root'
})
export class JwtHelperService {

    static USER_NAME = 'name';
    static FAMILY_NAME = 'family_name';
    static GIVEN_NAME = 'given_name';
    static USER_EMAIL = 'email';
    static USER_ACCESS_TOKEN = 'access_token';
    static REALM_ACCESS = 'realm_access';
    static RESOURCE_ACCESS = 'resource_access';
    static USER_PREFERRED_USERNAME = 'preferred_username';

    constructor(private storageService: StorageService) {
    }


    decodeToken(token): Object {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    }

    private urlBase64Decode(token): string {
        let output = token.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string!');
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    }


    getValueFromLocalAccessToken<T>(key: string): T {
        return this.getValueFromToken(this.getAccessToken(), key);
    }


    getAccessToken(): string {
        return this.storageService.getItem(JwtHelperService.USER_ACCESS_TOKEN);
    }


    getValueFromToken<T>(accessToken: string, key: string): T {
        let value;
        if (accessToken) {
            const tokenPayload = this.decodeToken(accessToken);
            value = tokenPayload[key];
        }
        return <T> value;
    }

    getRealmRoles(): string[] {
        const access = this.getValueFromLocalAccessToken<any>(JwtHelperService.REALM_ACCESS);
        return access ? access['roles'] : [];
    }


    getClientRoles(clientName: string): string[] {
        const clientRole = this.getValueFromLocalAccessToken<any>(JwtHelperService.RESOURCE_ACCESS)[clientName];
        return clientRole ? clientRole['roles'] : [];
    }

    hasRealmRole(role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }

    hasRealmRoles(rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasRealmRole(currentRole);
        });
    }

    hasRealmRolesForClientRole(clientName: string, rolesToCheck: string []): boolean {
        return rolesToCheck.some((currentRole) => {
            return this.hasClientRole(clientName, currentRole);
        });
    }

    hasClientRole(clientName: string, role: string): boolean {
        let hasRole = false;
        if (this.getAccessToken()) {
            const clientRoles = this.getClientRoles(clientName);
            hasRole = clientRoles.some((currentRole) => {
                return currentRole === role;
            });
        }
        return hasRole;
    }
}
