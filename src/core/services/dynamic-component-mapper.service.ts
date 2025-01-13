
import { Type } from '@angular/core';

export function getType(type: any): any {
    return () => type;
}

export interface DynamicComponentModel { type: string; }
export type DynamicComponentResolveFunction = (model: DynamicComponentModel) => Type<{}>;

// @dynamic
export class DynamicComponentResolver {
    static fromType(type: Type<{}>): DynamicComponentResolveFunction {
        return getType(type);
    }
}


// @dynamic
export abstract class DynamicComponentMapper {

    protected defaultValue: Type<{}> = undefined;
    protected types: { [key: string]: DynamicComponentResolveFunction } = {};

    /**
     * Gets the currently active DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want
     * @param defaultValue Default type returned for types that are not yet mapped
     * @returns Resolver function
     */
    getComponentTypeResolver(type: string, defaultValue: Type<{}> = this.defaultValue): DynamicComponentResolveFunction {
        if (type) {
            return this.types[type] || DynamicComponentResolver.fromType(defaultValue);
        }
        return DynamicComponentResolver.fromType(defaultValue);
    }

    /**
     * Sets or optionally replaces a DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want to set
     * @param resolver The new resolver function
     * @param override The new resolver will only replace an existing one if this parameter is true
     */
    setComponentTypeResolver(type: string, resolver: DynamicComponentResolveFunction, override: boolean = true) {
        if (!type) {
            throw new Error(`type is null or not defined`);
        }

        if (!resolver) {
            throw new Error(`resolver is null or not defined`);
        }

        const existing = this.types[type];
        if (existing && !override) {
            throw new Error(`already mapped, use override option if you intend replacing existing mapping.`);
        }

        this.types[type] = resolver;
    }

    /**
     * Finds the component type that is needed to render a form field.
     * @param model Form field model for the field to render
     * @param defaultValue Default type returned for field types that are not yet mapped.
     * @returns Component type
     */
    resolveComponentType(model: DynamicComponentModel, defaultValue: Type<{}> = this.defaultValue): Type<{}> {
        if (model) {
            const resolver = this.getComponentTypeResolver(model.type, defaultValue);
            return resolver(model);
        }
        return defaultValue;
    }
}
