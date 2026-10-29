/**
 * @fileoverview 应用配置（settings.json）的类型。
 * @zh ConfigService 加载的应用配置。平台用到的字段写出类型；部署方自定义的字段走索引签名（unknown，使用方自行收窄）。
 */

/** 平台 / 即时通讯等系统级配置（settings.json 的 system 节） */
export interface DuiSystemSettings {
  applicationName?: string;
  applicationUrl?: string;
  /** 平台标识 */
  system_id?: string;
  /** IM 域名 */
  domain?: string;
  ticket?: string;
  /** IM 服务主机 */
  IMurl?: string;
  /** IM 端口（各处配置里有字符串也有数字） */
  IMport?: string | number;
  IMHttpPort?: string | number;
  IMWsUrl?: string;
  IMWsPort?: string | number;
  logo?: string;
  icon?: string;
  logLevel?: string | number;
  cryptType?: string;
  DOTOS_GEO_TILE_URL?: string;
  /** 后端下发时有布尔也有字符串 */
  openRegister?: boolean | string;
  jsDebug?: boolean | string;
  [key: string]: unknown;
}

/** OAuth2 认证配置（settings.json 的 oauth2 节） */
export interface DuiOAuth2Settings {
  host?: string;
  clientId?: string;
  secret?: string;
  scope?: string;
  redirectUri?: string;
  redirectUriLogout?: string;
  redirectSilentIframeUri?: string;
  implicitFlow?: boolean;
  /** 刷新令牌提前量（毫秒） */
  refreshTokenTimeout?: number;
  silentLogin?: boolean;
  publicUrls?: string[];
  [key: string]: unknown;
}

/** 页面标题 / meta 配置 */
export interface DuiSeoSettings {
  defaultPageTitle?: string;
  defaultMetaDescription?: string;
  pageTitleSeparator?: string;
  pageTitlePositioning?: number | string;
  [key: string]: unknown;
}

/** 语种配置 */
export interface DuiI18nSettings {
  defaultLanguage?: string;
  availableLanguages?: Array<{ code: string; name: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

/** 功能开关配置 */
export interface DuiFeatureSettings {
  stage?: string;
  overrides?: Record<string, boolean>;
  [key: string]: unknown;
}

/** settings.json 顶层 */
export interface DuiSettings {
  authType?: string;
  ticket?: string;
  hostOauth2?: string;
  system?: DuiSystemSettings;
  oauth2?: DuiOAuth2Settings;
  seo?: DuiSeoSettings;
  i18n?: DuiI18nSettings;
  security?: { lockScreenMinutes?: number | string; [key: string]: unknown };
  features?: DuiFeatureSettings;
  /** 主平台地址；'self' 表示本机 */
  master?: string;
  twoFactorAuth?: { providers?: Array<{ providerType?: string; [key: string]: unknown }>; [key: string]: unknown };
  [key: string]: unknown;
}
