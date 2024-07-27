import { ECSManager } from './ecs-manager';
import { Entity } from './entities/entity';
import { Component, ComponentType } from './components/component';

export class Query {
    private manager: ECSManager;
    private componentTypes: Array<ComponentType<Component>>;

    constructor(manager: ECSManager, componentTypes: Array<ComponentType<Component>>) {
        this.manager = manager;
        this.componentTypes = componentTypes;
    }

    run(): Array<Entity> {
        const entities: Array<Entity> = [];

        for (const entity of this.manager.entities) {
            if (this.manager.hasAllComponents(entity, this.componentTypes))
                entities.push(entity);
        }

        return entities;
    }
}
