import { Entity } from './entities/entity';
import { System } from './systems/system';
import { Aspect } from './systems/aspects/aspect';
import { Component, ComponentType } from './components/component';

export class ECSManager {
    private _entities: Set<Entity>;
    private _aspects: Map<number, Aspect>;
    private _components: Map<ComponentType<Component>, Map<number, Component>>;
    private _systems: Array<System>;

    get entities() {
        return this._entities;
    }

    get components() {
        return this._components;
    }

    get systems() {
        return this._systems;
    }

    get aspects() {
        return this._aspects;
    }

    constructor() {
        this._entities = new Set();
        this._components = new Map();
        this._systems = [];
        this._aspects = new Map();
    }

    createEntity(): Entity {
        const entity = new Entity();
        this._entities.add(entity);

        return entity;
    }

    getComponent<T extends Component>(entity: Entity, componentType: ComponentType<T>): T | null {
        const componentsMap = this._components.get(componentType);
        return componentsMap?.get(entity.id) as T ?? null;
    }

    hasAllComponents<T extends Component>(entity: Entity, componentTypes: Set<ComponentType<T>>): boolean {
        for (const componentType of componentTypes.values())
            if (!this.components.get(componentType)?.has(entity.id))
                return false;

        return true;
    }

    addComponent<T extends Component>(entity: Entity, component: T): ECSManager {
        const componentType = component.constructor as ComponentType<Component>;

        if (!this._components.has(componentType))
            this._components.set(componentType, new Map());

        this._components.get(componentType)!.set(entity.id, component);

        for (const system of this._systems)
            if (system.trackedComponents.has(componentType))
                system.onComponentAdd(entity, component);

        return this;
    }

    removeComponent<T extends Component>(entity: Entity, component: T): ECSManager {
        const componentType = component.constructor as ComponentType<Component>;

        if (!this._components.has(componentType))
            this._components.set(componentType, new Map());

        for (const system of this._systems)
            if (system.trackedComponents.has(componentType))
                system.onComponentRemove(entity, component);

        this._components.get(componentType)!.delete(entity.id);

        return this;
    }

    addSystem(system: System): ECSManager {
        this._systems.push(system);

        return this;
    }

    update(deltaTime: number): void {
        for (const system of this._systems)
            system.update(deltaTime);
    }
}