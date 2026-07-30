import {  Injectable } from '@angular/core';
import { ActivatedRoute, ActivationStart,  NavigationStart, Router, RouterOutlet } from '@angular/router';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RouteService {
  routerOutletMap: Map<string, RouterOutlet> = new Map();
  activatedRoute:ActivatedRoute;

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

  setActivatedRoute(activatedRoute:ActivatedRoute){
    this.activatedRoute=activatedRoute;

  }

  navigate(url: string[],name:string,params?:any): void {
    const outlets:any = {};
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
      this.router.events.pipe(take(1)).subscribe(
        (event) => {
          if (event instanceof NavigationStart) {
            event.url=firstUrl;

            return;
          }
      });

      this.router.navigate([{ outlets }], {
        skipLocationChange: false,
        replaceUrl: true,
      //  relativeTo:this.activatedRoute
      });
    }
  }
  createRouterOutlet(  name: string): RouterOutlet {
    const outlet = new RouterOutlet();
    this.routerOutletMap.set(name, outlet);
    return outlet;
  }
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
  getActiveRouterOutletByName(name: string): RouterOutlet | undefined {
    return this.routerOutletMap.get(name);
  }
  addDynamicModalRoutes(name): string {
    return name;
  }
}
