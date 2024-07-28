import { System } from './system';
import { Entity } from '../entities/entity';
import { PlayerGraphics } from '../components/player-graphics';
import { RendererSystemAspect } from './aspects/renderer-aspect';
import { Component, ComponentType } from '../components/component';

export class RendererSystem extends System {
    public readonly trackedComponents: Set<ComponentType<Component>> = new Set([PlayerGraphics]);

    public override onComponentAdd(entity: Entity): void {
        const playerGraphics = this.manager.getComponent(entity, PlayerGraphics as ComponentType<PlayerGraphics>);

        if (!playerGraphics)
            return;

        const viewport = (this.aspect as RendererSystemAspect).viewport;
        viewport.addChild(playerGraphics.graphics);
    }

    public override onComponentRemove(entity: Entity): void {
        const playerGraphics = this.manager.getComponent(entity, PlayerGraphics as ComponentType<PlayerGraphics>);

        if (!playerGraphics)
            return;

        const viewport = (this.aspect as RendererSystemAspect).viewport;
        viewport.removeChild(playerGraphics.graphics);
    }
}