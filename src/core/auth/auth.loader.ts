/**
 * @fileoverview Module `src/core/auth/auth.loader.ts` providing auth loader definitions and implementation.
 * @zh 模块文件 `src/core/auth/auth.loader.ts`，提供认证加载器相关的定义与实现。
 */

// module
import { AuthSettings } from './model';
import { Backend } from './model';

/**
 * Class `AuthLoader` encapsulating auth loader data structures and logic in `src/core/auth`.
 * @zh 类 `AuthLoader`，封装 `src/core/auth` 中的认证加载器数据结构与处理逻辑。
 */
export abstract class AuthLoader {
  /**
   * Gets the current backend (`backend: any`).
   * @zh 获取当前backend（`backend: any`）。
   */
  abstract get backend();

  /**
   * Gets the current storage (`storage: any`).
   * @zh 获取当前存储（`storage: any`）。
   */
  abstract get storage();

  /**
   * Gets the current storage key (`storageKey: string`).
   * @zh 获取当前存储键（`storageKey: string`）。
   */
  abstract get storageKey(): string;

  /**
   * Gets the current login route (`loginRoute: Array<any>`).
   * @zh 获取当前loginRoute（`loginRoute: Array<any>`）。
   */
  abstract get loginRoute();

  /**
   * Gets the current default url (`defaultUrl: string`).
   * @zh 获取当前默认链接地址（`defaultUrl: string`）。
   */
  abstract get defaultUrl(): string;
}

/**
 * Class `AuthStaticLoader` encapsulating auth static loader data structures and logic in `src/core/auth`.
 * @zh 类 `AuthStaticLoader`，封装 `src/core/auth` 中的认证静态加载器数据结构与处理逻辑。
 */
export class AuthStaticLoader implements AuthLoader {
  /**
   * Gets the current backend (`backend: Backend`).
   * @zh 获取当前backend（`backend: Backend`）。
   */
  get backend(): Backend {
    return this.providedSettings.backend;
  }

  /**
   * Gets the current storage (`storage: any`).
   * @zh 获取当前存储（`storage: any`）。
   */
  get storage() {
    return this.providedSettings.storage;
  }

  /**
   * Gets the current storage key (`storageKey: string`).
   * @zh 获取当前存储键（`storageKey: string`）。
   */
  get storageKey(): string {
    return this.providedSettings.storageKey;
  }

  /**
   * Gets the current login route (`loginRoute: Array<any>`).
   * @zh 获取当前loginRoute（`loginRoute: Array<any>`）。
   */
  get loginRoute() {
    return this.providedSettings.loginRoute;
  }

  /**
   * Gets the current default url (`defaultUrl: string`).
   * @zh 获取当前默认链接地址（`defaultUrl: string`）。
   */
  get defaultUrl(): string {
    return this.providedSettings.defaultUrl;
  }

  /**
   * Creates an instance of `AuthStaticLoader` and initializes its dependencies and internal state.
   * @zh 创建 `AuthStaticLoader` 实例，并初始化其依赖项与内部状态。
   * @param providedSettings - Injected or initial provided settings (`AuthSettings`) / 注入或传入的已提供设置项（`AuthSettings`）
   */
  constructor(private readonly providedSettings: AuthSettings = {
    backend: {
      endpoint: '/api/checklogin',
      logoutApi: '/api/logout',
      registerUrl:'/api/register',
      loginUrl: '/api/login',
      params: []
    },
    storage: localStorage,
    storageKey: 'currentUser',
    loginRoute: ['login'],
    defaultUrl: ''
  }) {
  }
}
