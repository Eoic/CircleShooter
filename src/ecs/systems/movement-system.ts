import { Query } from '../query';
import { System } from './system';
import { Vector } from '../../math/vector';
import { Movement } from '../components/movement';
import { Transform } from '../components/transform';
import { Component, ComponentType } from '../components/component';
import { PlayerGraphics } from '../components/player-graphics';
import { InputManager } from '../../input-manager';

export class MovementSystem extends System {
    public readonly trackedComponents: Set<ComponentType<Component>> = new Set([
        Transform,
        Movement,
        PlayerGraphics
    ]);

    public override update(deltaTime: number): void {
        const entities = new Query(this.manager, this.trackedComponents).run();

        entities.forEach((entity) => {
            const transform = this.manager.getComponent(entity, Transform);
            const movement = this.manager.getComponent(entity, Movement);
            const playerGraphics = this.manager.getComponent(entity, PlayerGraphics);

            if (transform && movement && playerGraphics) {
                const horizontal = (
                    (InputManager.instance.isKeyHeld('a') ? -1 : 0) +
                    (InputManager.instance.isKeyHeld('d') ? 1 : 0)
                );

                const vertical = (
                    (InputManager.instance.isKeyHeld('w') ? -1 : 0) +
                    (InputManager.instance.isKeyHeld('s') ? 1 : 0)
                );

                const direction = new Vector(horizontal, vertical).normalized();

                transform.position.x += movement.speed * direction.x * deltaTime;
                transform.position.y += movement.speed * direction.y * deltaTime;

                playerGraphics.graphics.position.set(
                    transform.position.x,
                    transform.position.y
                )
            }
        });
    }
}