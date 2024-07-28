import { Query } from '../query';
import { System } from './system';
import { Input } from '../components/input';
import { ECSManager } from '../ecs-manager';
import { Component } from '../components/component';

export class InputSystem extends System {
    public readonly trackedComponents: Set<Component> = new Set([Input])

    constructor(manager: ECSManager) {
        super(manager);
        this._addEvents();
    }

    private _addEvents() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('keyup', this._handleKeyUp);
    }

    private _handleKeyDown = (event: KeyboardEvent) => {
        const entities = new Query(this.manager, new Set([Input])).run();

        entities.forEach((entity) => {
            const input = this.manager.getComponent(entity, Input);

            if (input) {
                if (event.key === 'w')
                    input.top = -1;
                else if (event.key === 's')
                    input.bottom = 1;
                else if (event.key === 'a')
                    input.left = -1;
                else if (event.key === 'd')
                    input.right = 1;
            }
        });
    }

    private _handleKeyUp = (event: KeyboardEvent) => {
        const entities = new Query(this.manager, new Set([Input])).run();

        entities.forEach((entity) => {
            const input = this.manager.getComponent(entity, Input);

            if (input) {
                if (event.key === 'w')
                    input.top = 0;
                else if (event.key === 's')
                    input.bottom = 0;
                else if (event.key === 'a')
                    input.left = 0;
                else if (event.key === 'd')
                    input.right = 0;
            }
        });
    }
}