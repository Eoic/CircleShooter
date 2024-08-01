import { System } from './system';
import { Entity } from '../entities/entity';
import { PlayerGraphics } from '../components/player-graphics';
import { Component, ComponentType } from '../components/component';
import { CameraFollowSystemAspect } from './aspects/camera-follow-aspect';

export class CameraFollowSystem extends System {
    public readonly trackedComponents: Set<ComponentType<Component>> = new Set([PlayerGraphics]);

    public override onComponentAdd(entity: Entity): void {
        const playerGraphics = this.manager.getComponent(entity, PlayerGraphics as ComponentType<PlayerGraphics>);

        if (!playerGraphics)
            return;

        const viewport = (this.aspect as CameraFollowSystemAspect).viewport;
        viewport.follow(playerGraphics.graphics, { speed: 15, acceleration: 0.75, radius: 100 });
    }

    public override onComponentRemove(entity: Entity): void {
        const playerGraphics = this.manager.getComponent(entity, PlayerGraphics as ComponentType<PlayerGraphics>);

        if (!playerGraphics)
            return;

        const viewport = (this.aspect as CameraFollowSystemAspect).viewport;
        viewport.plugins.remove('follow');
    }
}