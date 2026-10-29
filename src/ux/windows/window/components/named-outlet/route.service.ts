/**
 * @fileoverview Module `src/ux/windows/window/components/named-outlet/route.service.ts` providing route service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/named-outlet/route.service.ts`，提供route服务相关的定义与实现。
 */

import {  Injectable } from '@angular/core';
import { ActivatedRoute, ActivationStart,  NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs/operators';


/**
 * Injectable Angular service `RouteService` managing route service state and operations in `src/ux/windows/window/components/named-outlet`.
 * @zh 可注入的 Angular 服务 `RouteService`，管理 `src/ux/windows/window/components/named-outlet` 中的Route服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class RouteService {
  /**
   * Property `routerOutletMap` (`Map<string, RouterOutlet>`) storing router outlet map (default: `new Map()`).
   * @zh 属性 `routerOutletMap`（类型：`Map<string, RouterOutlet>`），用于存储或配置routerOutlet映射表（默认值：`new Map()`）。
   */
  routerOutletMap: Map<string, RouterOutlet> = new Map();
  /**
   * Property `activatedRoute` (`ActivatedRoute`) storing activated route.
   * @zh 属性 `activatedRoute`（类型：`ActivatedRoute`），用于存储或配置已激活Route。
   */
  activatedRoute:ActivatedRoute;

  /**
   * Creates an instance of `RouteService` and initializes its dependencies and internal state.
   * @zh 创建 `RouteService` 实例，并初始化其依赖项与内部状态。
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   */
  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet.startsWith('win-')) {
        let o=this.routerOutletMap.get(e.snapshot.outlet);
        if(o){
          o.deactivate();
        }
      }
    });
  }

  /**
   * Executes `setActivatedRoute` to handle set activated route.
   * @zh 执行 `setActivatedRoute`，用于集合已激活Route。
   * @param activatedRoute - activated route parameter (`ActivatedRoute`) / 已激活Route参数（`ActivatedRoute`）
   */
  setActivatedRoute(activatedRoute:ActivatedRoute){
    this.activatedRoute=activatedRoute;

  }

  /**
   * Executes `navigate` to handle navigate.
   * @zh 执行 `navigate`，用于导航。
   * @param url - url parameter (`string[]`) / 链接地址参数（`string[]`）
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  navigate(url: string[],name:string,params?): void {
    const outlets: Record<string, unknown> = {};
    outlets[name] = url;

    this.router.events
    if(params){
      this.router.navigate([{ outlets }], {
        skipLocationChange: false,
        replaceUrl: true,
        queryParams:params,
        relativeTo:this.activatedRoute
      });
    }else{
      let urlTree=this.router.createUrlTree([{ outlets }]);
      let urls=urlTree.toString().split("//");
  
      let firstUrl=urls[0];
      // 原来这里不带 take(1)：每次不传 params 的 navigate() 调用都会新增一个
      // 永久订阅，且该订阅会对之后任意一次导航（不只是本次）都强制改写
      // event.url 为这里捕获的 firstUrl，调用次数越多，后续导航被污染的概率
      // 越大。只关心紧随其后的这一次 navigate() 触发的 NavigationStart。
      this.router.events.pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        take(1)
      ).subscribe(
        (event) => {
          event.url = firstUrl;
        }
      );

      this.router.navigate([{ outlets }], {
        skipLocationChange: false,
        replaceUrl: true,
      //  relativeTo:this.activatedRoute
      });
    }
  }
  /**
   * Executes `createRouterOutlet` to handle create router outlet.
   * @zh 执行 `createRouterOutlet`，用于创建RouterOutlet。
   * @param nameOrContexts - name or contexts parameter (`any`) / 名称Or上下文参数（`any`）
   * @param _location - location parameter (`any`) / location参数（`any`）
   * @param _resolver - resolver parameter (`any`) / 解析器参数（`any`）
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param _changeDetector - change detector parameter (`any`) / 变更检测器参数（`any`）
   * @returns Result of type `RouterOutlet` / 类型为 `RouterOutlet` 的返回值
   */
  createRouterOutlet(nameOrContexts, _location?, _resolver?, name?: string, _changeDetector?): RouterOutlet {
    const outletName = typeof nameOrContexts === 'string' ? nameOrContexts : name;
    const outlet = new RouterOutlet();
    if (outletName) {
      this.routerOutletMap.set(outletName, outlet);
    }
    return outlet;
  }
  /**
   * Executes `clearRouterOutlet` to handle clear router outlet.
   * @zh 执行 `clearRouterOutlet`，用于清空RouterOutlet。
   * @param name - name parameter (`any`) / 名称参数（`any`）
   */
  clearRouterOutlet(name): void {
    const outlet = this.routerOutletMap.get(name);
    if (outlet) {
      outlet.deactivate();
      outlet.ngOnDestroy();
      // 原来从不 delete，routerOutletMap（root 单例）会随窗口/命名 outlet
      // 的开关次数无界累积已销毁的 RouterOutlet 引用
      this.routerOutletMap.delete(name);
    }
  }
  /**
   * Executes `getActiveRouterOutletByName` to handle get active router outlet by name.
   * @zh 执行 `getActiveRouterOutletByName`，用于获取激活RouterOutlet按名称。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `RouterOutlet` / 类型为 `RouterOutlet` 的返回值
   */
  getActiveRouterOutletByName(name: string): RouterOutlet | undefined {
    return this.routerOutletMap.get(name);
  }
  /**
   * Executes `addDynamicModalRoutes` to handle add dynamic modal routes.
   * @zh 执行 `addDynamicModalRoutes`，用于添加动态模态框Routes。
   * @param name - name parameter (`any`) / 名称参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  addDynamicModalRoutes(name): string {
    return name;
  }
}
