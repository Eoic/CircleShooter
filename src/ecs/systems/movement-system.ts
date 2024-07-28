import { Query } from '../query';
import { System } from './system';
import { Transform } from '../components/transform';
import { Movement } from '../components/movement';
import { Input } from '../components/input';
import { Vector } from '../../math/vector';
import { Component } from '../components/component';
import { PlayerGraphics } from '../components/player-graphics';

export class MovementSystem extends System {
    public readonly trackedComponents: Set<Component> = new Set([Transform, Movement, Input, PlayerGraphics]);

    public override update(deltaTime: number): void {
        const entities = new Query(this.manager, new Set([Transform, Movement, Input, PlayerGraphics])).run();

        entities.forEach((entity) => {
            const transform = this.manager.getComponent(entity, Transform);
            const movement = this.manager.getComponent(entity, Movement);
            const input = this.manager.getComponent(entity, Input);
            const playerGraphics = this.manager.getComponent(entity, PlayerGraphics);

            if (transform && movement && input && playerGraphics) {
                const direction = new Vector(input.left + input.right, input.top + input.bottom).normalized();
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