import { ChangeDetectorRef, ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivationStart,  ChildrenOutletContexts, NavigationStart, Router, RouterOutlet } from '@angular/router';


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
      this.router.events.subscribe(
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
  createRouterOutlet(
    parentContexts: ChildrenOutletContexts,
    location: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    name: string,
    changeDetector: ChangeDetectorRef): RouterOutlet {
    const outlet = new RouterOutlet(parentContexts, location, resolver, name, changeDetector);
    this.routerOutletMap.set(name, outlet);
    return outlet;
  }
  clearRouterOutlet(name): void {
    const outlet = this.routerOutletMap.get(name);
    if (outlet) {
      outlet.deactivate();
      outlet.ngOnDestroy();
    }
  }
  getActiveRouterOutletByName(name: string): RouterOutlet | undefined {
    return this.routerOutletMap.get(name);
  }
  addDynamicModalRoutes(name): string {
    return name;
  }
}
