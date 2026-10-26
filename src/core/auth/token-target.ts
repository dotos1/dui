/**
 * @fileoverview Module `src/core/auth/token-target.ts` providing token target definitions and implementation.
 * @zh 模块文件 `src/core/auth/token-target.ts`，提供令牌目标相关的定义与实现。
 */

import { Injector } from '@angular/core';
import { ConfigService } from '@dotos/dui/core/config';

/*
 * 「这个请求能不能带上 access_token」的判断,AuthBearerInterceptor 与 AuthInterceptor 共用。
 *
 * b8c5e5c 复核:那次提交在两个拦截器里各写了一份,问题有三:
 *   1. 只认 `http(s)://` 开头的为绝对地址,协议相对的 `//evil.com/x` 被当成相对路径,
 *      token 照发;
 *   2. 无条件信任 localhost / 127.0.0.1 —— 页面在 s06 上时,发往访问者本机任意端口
 *      的请求也会带 token;
 *   3. 「取最后两段域名」:页面在 s06.dotos.com,任何 *.dotos.com(包括
 *      evil.dotos.com,或 dotos.com.cn 这类两段后缀)都算可信。
 * 现在一律用 `new URL(url, location.href)` 解析后比较。
 */

/**
 * 解析为 http(s) 时,是否可以把 token 发过去。
 * @zh 解析为 http(s) 时,是否可以把 token 发过去。
 */
export function isTrustedTokenTarget(url: string, baseHref?: string, extraHosts: string[] = []): boolean {
  if (baseHref === undefined && typeof location !== 'undefined') {
    baseHref = location.href;
  }
  if (!url) {
    return true;
  }
  if (!baseHref) {
    // 没有页面地址(SSR / 测试环境):只信任不带协议、不带主机的相对路径。
    return !/^([a-z][a-z0-9+.-]*:|\/\/|\\\\)/i.test(url.trim());
  }
  let target: URL;
  let here: URL;
  try {
    here = new URL(baseHref);
    target = new URL(url, here);
  } catch {
    return false;
  }
  if (target.origin === here.origin) {
    return true;
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return false;
  }
  const host = target.hostname.toLowerCase();
  // 同一台主机只是端口不同:开发时页面在 :4200,平台在 :8000;smartfield 在 :8070。
  if (host === here.hostname.toLowerCase()) {
    return true;
  }
  return extraHosts.some((h) => h && h.toLowerCase() === host);
}

/**
 * 取主机名:接受完整 URL('https://auth.dotos.com')或裸主机('auth.dotos.com')。
 * @zh 取主机名:接受完整 URL('https://auth.dotos.com')或裸主机('auth.dotos.com')。
 */
function hostnameOf(v): string | null {
  if (!v || typeof v !== 'string') {
    return null;
  }
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : 'http://' + v).hostname;
  } catch {
    return null;
  }
}

/**
 * 配置里声明的、签发 / 认这个 token 的主机,同样可以收 token:
 *   - `oauth2.host`:dotos-auth,token 就是它签的;
 *   - `system.IMurl`:同一台 dotos-auth(auth.dotos.com)上的 /admin/**、/register/**、
 *     /admin/appstore/**。主应用的用户管理、应用商店、改密码、发布系统都是用
 *     `protocol://IMurl:IMHttpPort/...` 绝对地址直接调,dotos-auth 对 /admin/** 要求
 *     Bearer JWT(AdminAuthorizationTest)—— 不信任它,这些页面全部 401。
 *
 * ConfigService 经 Injector 惰性获取:拦截器在 HttpClient 的构造链上,构造时直接注入
 * ConfigService(它的 loader 依赖 HttpClient)会形成循环依赖。

 * @zh 配置里声明的、签发 / 认这个 token 的主机,同样可以收 token:
 */
export function configuredTokenHosts(injector?: Injector | null): string[] {
  if (!injector) {
    return [];
  }
  let config: ConfigService | null = null;
  try {
    config = injector.get(ConfigService, null);
  } catch {
    return [];
  }
  if (!config) {
    return [];
  }
  const hosts: string[] = [];
  try {
    const oauth2 = config.getSettings('oauth2');
    const system = config.getSettings('system');
    [oauth2?.host, config.getSettings('hostOauth2'), system?.IMurl].forEach((v) => {
      const h = hostnameOf(v);
      if (h) {
        hosts.push(h);
      }
    });
  } catch {
    // 配置还没加载完:只按同源 / 同主机判断。
  }
  return hosts;
}
