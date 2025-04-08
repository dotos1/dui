import { ComponentRef } from '@angular/core';
import { PlantComponentConfig } from './microfront-component.config';

export class MicroFrontComponentRef<TComp = any> {
    wrapperElement: HTMLElement;
    hostElement: HTMLElement;
    componentInstance: TComp;
    componentRef: ComponentRef<TComp>;
    dispose: () => void;
}

export type PlantComponentFactory = <TData, TComp>(componentName: string, config: PlantComponentConfig<TData>) => MicroFrontComponentRef<TComp>;
