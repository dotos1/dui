/**
 * Executes `ɵIsNil` to handle ɵis nil.
 * @internal
 * @zh 执行 `ɵIsNil`，用于ɵIsNil。
 */
export function ɵIsNil(value): boolean {
    return (value === undefined || value === null);
}

/**
 * Executes `ɵIsNumber` to handle ɵis number.
 * @internal
 * @zh 执行 `ɵIsNumber`，用于ɵIs数字。
 */
export function ɵIsNumber(value): boolean {
    return (typeof value === 'number');
}

/**
 * Executes `ɵParseInt` to handle ɵparse int.
 * @internal
 * @zh 执行 `ɵParseInt`，用于ɵParseInt。
 */
export function ɵParseInt(value: string): number {
    return Number.parseInt(value, 10);
}

/**
 * Executes `ɵDeepClone` to handle ɵdeep clone.
 * @internal
 * @zh 执行 `ɵDeepClone`，用于ɵDeep克隆。
 */
export function ɵDeepClone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

/**
 * Executes `ɵIsObjectsWithSameData` to handle ɵis objects with same data.
 * @internal
 * @zh 执行 `ɵIsObjectsWithSameData`，用于ɵIs对象带有相同数据。
 */
export function ɵIsObjectsWithSameData(objectA: Object, objectB: Object): boolean {
    const keysOfObjectA = Object.keys(objectA);
    const keysOfObjectB = Object.keys(objectB);

    if (keysOfObjectA.length === keysOfObjectB.length) {
        return keysOfObjectA
            .every((key) => objectA[key] === objectB[key]);
    }

    return false;
}
