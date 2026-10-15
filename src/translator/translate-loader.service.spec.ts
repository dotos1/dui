import { throwError } from 'rxjs';
import { TranslateLoaderService } from './translate-loader.service';

/** b8c5e5c 复核:失败不反复重试;回退只认 `-`,不为 zh_CN 去请求不存在的 zh.json。 */
describe('TranslateLoaderService(b8c5e5c 复核)', () => {
  function setup(status: number) {
    const urls: string[] = [];
    const http: any = {
      get: (url: string) => { urls.push(url.split('?')[0]); return throwError(() => ({ status })); },
    };
    const svc = new TranslateLoaderService(http);
    svc.setDefaultLang('zh_CN');
    svc.registerProvider('core', 'assets/i18n');
    return { svc, urls };
  }
  const load = (svc: TranslateLoaderService, lang: string) =>
    new Promise<void>((resolve) => svc.getTranslation(lang).subscribe({ complete: () => resolve(), error: () => resolve() }));

  it('404 之后再次 getTranslation 不再请求', async () => {
    const { svc, urls } = setup(404);
    await load(svc, 'en_US');
    const first = urls.length;
    await load(svc, 'en_US');
    await load(svc, 'en_US');
    expect(urls.length).toBe(first);
  });

  it('下划线语言码失败时不回退去请求短码文件', async () => {
    const { svc, urls } = setup(404);
    await load(svc, 'en_US');
    expect(urls.every((u) => u.endsWith('/en_US.json'))).toBeTrue();
  });

  it('连字符语言码仍回退到短码', async () => {
    const { svc, urls } = setup(404);
    await load(svc, 'fr-FR');
    expect(urls.some((u) => u.endsWith('/fr.json'))).toBeTrue();
  });

  it('5xx 只放行一次重试', async () => {
    const { svc, urls } = setup(503);
    await load(svc, 'en_US');
    const a = urls.length;
    await load(svc, 'en_US');
    const b = urls.length;
    await load(svc, 'en_US');
    expect(b).toBeGreaterThan(a);
    expect(urls.length).toBe(b);
  });
});
