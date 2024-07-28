import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { ECSManager } from './ecs/ecs-manager';
import { Movement, PlayerGraphics, Transform } from './ecs/components';
import { WORLD_BACKGROUND_COLOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { MovementSystem, RendererSystem } from './ecs/systems';
import { RendererSystemAspect } from './ecs/systems/aspects';
import { Vector } from './math/vector';

export class Scene {
    private readonly _viewport: Viewport;
    private readonly _app: PIXI.Application<HTMLCanvasElement>;
    private readonly _ecsManager: ECSManager;

    constructor() {
        this._app = this.setupApp(document.body);
        this._viewport = this.setupViewport(this._app);
        this._ecsManager = this.setupECS();
        this.setupEvents();
    }

    private setupApp(container: HTMLElement): PIXI.Application<HTMLCanvasElement> {
        const app = new PIXI.Application<HTMLCanvasElement>({
            resizeTo: window,
            antialias: true,
            autoDensity: true,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: WORLD_BACKGROUND_COLOR,
            resolution: 2,
        });

        container.appendChild(app.view);

        return app;
    }

    private setupViewport(app: PIXI.Application): Viewport {
        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            events: app.renderer.events,
            disableOnContextMenu: true,
        });

        app.stage.addChild(viewport);

        viewport.drag({ mouseButtons: 'middle-right' }).pinch().wheel().clampZoom({
            minScale: 0.15,
            maxScale: 12.5,
        });

        viewport.fit();
        viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);

        return viewport;
    }

    private setupECS() {
        const manager = new ECSManager();
        const player = manager.createEntity();

        const initialPosition = new Vector(
            this._viewport.worldWidth / 2,
            this._viewport.worldHeight / 2
        )

        manager
            .addSystem(new MovementSystem(manager))
            .addSystem(new RendererSystem(manager, new RendererSystemAspect(this._viewport)));

        manager
            .addComponent(player, new Transform(initialPosition))
            .addComponent(player, new Movement(15))
            .addComponent(player, new PlayerGraphics(0x4f68c6, 0x2a3d82, 100));

        this._app.ticker.add((deltaTime) => manager.update(deltaTime));

        return manager;
    }

    /**
     * Setup event handlers.
     */
    private setupEvents() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    /**
     * Update the app and the viewport when window is resized.
     */
    private handleWindowResize = () => {
        this._app?.resize();
        this._viewport?.resize(window.innerWidth, window.innerHeight);
    };
}
