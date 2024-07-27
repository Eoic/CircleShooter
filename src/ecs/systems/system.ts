import { ECSManager } from '../ecs-manager';

export class System {
    public readonly manager: ECSManager;

    constructor(manager: ECSManager) {
        this.manager = manager;
    }

    public update(deltaTime: number): void { };
}