
export interface BasicAuth {
    username?: string;
    password?: string;
    ticket?: string;
}
export interface AuthInternOptions {
  enabled?: boolean;
}
export interface Backend {
  endpoint: string;
  logoutApi:string;
  registerUrl:string;
  loginUrl:string,
  params: Array<{
    key: string;
    value: string;
  }>;
}
export interface AuthSettings {
  backend: Backend;
  storage: any;
  storageKey: string;
  loginRoute: Array<any>;
  defaultUrl: string;
}
