import { Query } from '../query';
import { System } from './system';
import { Transform } from '../components/transform';
import { Movement } from '../components/movement';
import { Input } from '../components/input';
import { Vector } from '../../math/vector';

export class MovementSystem extends System {
    update(deltaTime: number): void {
        const entities = new Query(this.manager, [Transform]).run();

        entities.forEach((entity) => {
            const transform = this.manager.getComponent(entity, Transform);
            const movement = this.manager.getComponent(entity, Movement);
            const input = this.manager.getComponent(entity, Input);

            if (transform && movement && input) {
                const direction = new Vector(input.left + input.right, input.top + input.bottom).normalized();
                transform.position.x += movement.speed * direction.x * deltaTime;
                transform.position.y += movement.speed * direction.y * deltaTime;
            }
        });
    }
}