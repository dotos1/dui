

export interface Oauth2 {
    refreshToken?: string;
    accessToken?: string;
}


export interface OauthConfigModel {
  host: string;
  clientId: string;
  scope: string;
  implicitFlow: boolean;
  redirectUri: string;
  silentLogin?: boolean;
  secret?: string;
  redirectUriLogout?: string;
  publicUrls: string[];
}

export interface Oauth2Config {
  clientId: string;
  secret?: string;
  host: string;
  scope: string;
  implicitFlow: boolean;
  redirectUri: string;
  refreshTokenTimeout?: number;
  silentLogin?: boolean;
  redirectUriLogout?: string;
  redirectSilentIframeUri?: string;
  publicUrls?: string[];
}
