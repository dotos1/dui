
export type ɵKeysOfType<T, PropType> = {
    [P in keyof T]: T[P] extends PropType ? P : never
}[keyof T];
