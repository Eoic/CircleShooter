export type ConstructorParametersOf<T> = T extends new (...args: infer P) => unknown ? P : never;

export type ComponentType<T extends Component> = new (...args: ConstructorParametersOf<T>) => T;

export interface Component { };
