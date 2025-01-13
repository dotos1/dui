import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  StaticProvider,
} from '@angular/core';
import { DockLayoutContainerInjectionToken } from './injection-tokens';
import { ComponentContainer } from './container/component-container';
import { Dui } from '@dotos/dui/core';

@Injectable({
  providedIn: 'root',
})
export class DockLayoutComponentService {
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  createComponent(config: any, container: ComponentContainer) {
    if (config.rendered) {
      return config.reference;
    } else if(config.xtype){
      const factory: any = Dui.getComponentFactory(config.xtype);
      if (factory === undefined) {
        throw new Error(`Unknown component type of ${config}`);
      } else {
        const component = factory.componentType;
        const provider: StaticProvider = {
          provide: DockLayoutContainerInjectionToken,
          useValue: container,
        };
        const injector = Injector.create({
          providers: [provider],
        });
        const componentFactoryRef =
          this._componentFactoryResolver.resolveComponentFactory<any>(
            component
          );
        return componentFactoryRef.create(injector);
      }
    }
  }
}
