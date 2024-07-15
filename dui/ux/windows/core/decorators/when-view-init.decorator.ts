import { ɵOsBaseViewComponent } from '../classes';

export function ɵWhenViewInit<T>(defaultValue: any = null): any {
    return function(
        baseView: ɵOsBaseViewComponent,
        methodName: string,
        { get, enumerable, value }: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> {
        if (get) {
            return patchMethod(enumerable, defaultValue, get);
        }
        if (typeof value !== 'function') {
            throw new Error('WhenViewInit can only be used with functions or getters');
        }
        return patchMethod(enumerable, defaultValue, value);
    };
}

function patchMethod<T>(enumerable: boolean, defaultValue: any, originalMethod: Function): any {
    return {
        enumerable,
        get(): T {
            if ((this as ɵOsBaseViewComponent).isViewInit) {
                return originalMethod.call(this);
            }

            return defaultValue;
        }
    };
}
