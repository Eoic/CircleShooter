import { Aspect } from './aspects/aspect';
import { Entity } from '../entities/entity';
import { ECSManager } from '../ecs-manager';
import { Component, ComponentType } from '../components/component';

export abstract class System {
    public readonly manager: ECSManager;
    public abstract readonly trackedComponents: Set<ComponentType<Component>>;
    public readonly aspect: Aspect | null;

    constructor(manager: ECSManager, aspect: Aspect | null = null) {
        this.manager = manager;
        this.aspect = aspect;
    }

    public update(deltaTime: number): void { };

    public onComponentAdd(entity: Entity, component: Component): void { };

    public onComponentRemove(entity: Entity, component: Component): void { };
}