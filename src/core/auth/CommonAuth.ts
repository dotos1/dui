
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from  '@dotos/dui/core/config';

import { AuthLoader } from './auth.loader';
import { Authentication } from './model/authentication';
import { LocalStorageService } from '@dotos/dui/core/storage';

export class CommonAuth  {

    ticket: string;

    authentications: Authentication = {
        'basicAuth': { ticket: '' }
    };

    constructor(
      private config: ConfigService,
      private http: HttpClient,
      private  readonly loader: AuthLoader,
      public storage: LocalStorageService
      ) {
        this.setConfig();
    }
    setConfig() {
        this.ticket = undefined;
        if (this.config.getSettings('ticket')) {
            this.setTicket(this.config.getSettings('ticket'));
        } else if (this.storage.get('ticket')) {
            this.setTicket(this.storage.get('ticket'));
        }
    }

    changeHost() {
        this.ticket = undefined;
    }

    changeCsrfConfig(disableCsrf: boolean) {
        this.config.setSetting('disableCsrf',disableCsrf);
    }

    saveUsername(username: string) {
       this.storage.add('USERNAME', username);
    }
    validateTicket(): Promise<any> {
      this.setTicket(this.config.getSettings('ticket'));
      let promise: any = new Promise((resolve, reject) => {
          this._validateTicket().then((data: any) => {
                  this.setTicket(data.entry.id);
                  resolve(data.entry.id);
              },
               (error) => {
                  reject(error);
              });
      });
      return promise;
  }
  _validateTicket(): Promise<any> {
      let headers:HttpHeaders=new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      });
        return this.http.get(
            '/tickets/-me-',{
              headers: headers
         } ).toPromise();
    }

    login(username: string, password: string, ticket: string): Promise<any> {
        this.authentications.basicAuth.username = username;
        this.authentications.basicAuth.password = password;

        const body = new HttpParams()
        .set(`username`,  this.authentications.basicAuth.username)
        .set(`password`, this.authentications.basicAuth.password)
        .set(`remember_me`, "true")
        .set(`lt`, ticket);

        let headers:HttpHeaders=new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          responseType: 'json'
        });
        this.loader.storage.removeItem(this.loader.storageKey);
        let promise: any = new Promise((resolve, reject) => {
           this.http.post(
                  this.loader.backend.loginUrl, body,{
                  headers:headers
                }
            ).toPromise().then(
                () => {
                    this.saveUsername(username);
                    let ticket = this.basicAuth(
                      this.authentications.basicAuth.username,  this.authentications.basicAuth.password);
                    this.setTicket(ticket);
                    resolve(ticket);
                },
                (error) => {
                    this.saveUsername('');
                    reject(error);
                });
        });
        return promise;
    }

    basicAuth(username: string, password: string): string {
      const str: any = username + ':' + password;
      let base64;
      //@ts-ignore
      if (typeof Buffer === 'function') {
           //@ts-ignore
          base64 = Buffer.from(str.toString(), 'binary').toString('base64');
      } else {
          base64 = btoa(str);
      }
      return 'Basic ' + base64;
  }
  logout(): Promise<any> {
        this.saveUsername('');
        let headers:HttpHeaders=new HttpHeaders({
          'Content-Type': 'application/json',
          responseType: 'json'
        });
        let promise: any = new Promise((resolve, reject) => {
          this.http.get(
                this.loader.backend.logoutApi,
                {
                  withCredentials: true,
                  headers:headers
                }
            ).toPromise().then(
                (response) => {
                    this.invalidateSession();
                    this.loader.storage.removeItem(this.loader.storageKey);
                    resolve(response);
                },
                (error) => {
                    reject(error);
                });
        });
        return promise;
    }

    setTicket(ticket: string) {
        this.authentications.basicAuth.ticket = ticket;
        this.authentications.basicAuth.password = null;
        this.config.setSetting('ticket',ticket);
        this.storage.set('ticket', ticket);
        this.ticket = ticket;
    }

    invalidateSession() {
        this.storage.remove('ticket');
        this.authentications.basicAuth.ticket = null;
        this.authentications.basicAuth.password = null;
        this.authentications.basicAuth.username = null;
        this.config.setSetting('ticket',null);
        this.ticket = null;
    }

    getTicket(): string {
        return this.ticket;
    }

    isLoggedIn(): boolean {
        return !!this.ticket;
    }

    getAuthentication(): any {
        return  this.authentications;
    }
}
