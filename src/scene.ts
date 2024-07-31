import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { ECSManager } from './ecs/ecs-manager';
import { Movement, PlayerGraphics, Transform } from './ecs/components';
import { WORLD_BACKGROUND_COLOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { MovementSystem, RendererSystem } from './ecs/systems';
import { RendererSystemAspect } from './ecs/systems/aspects';
import { Vector } from './math/vector';
import gridVertexShader from '../shaders/grid.vert';
import gridFragmentShader from '../shaders/grid.frag';

export class Scene {
    private readonly _viewport: Viewport;
    private readonly _app: PIXI.Application<HTMLCanvasElement>;
    private readonly _ecsManager: ECSManager;
    private readonly _grid: PIXI.Mesh<PIXI.Shader>;

    constructor() {
        this._app = this.setupApp(document.body);
        this._viewport = this.setupViewport(this._app);
        this._grid = this.setupGrid();
        this._ecsManager = this.setupECS();

        this.setupEvents();
    }

    setupGrid(): PIXI.Mesh<PIXI.Shader> {
        const shader = PIXI.Shader.from(gridVertexShader, gridFragmentShader, {
            uResolution: [
                this._app.view.width,
                this._app.view.height
            ],
        });

        const width = this._viewport.worldWidth;
        const height = this._viewport.worldHeight;
        const screenWidth = this._app.view.clientWidth;
        const screenHeight = this._app.view.clientHeight;

        const gridGeometry = new PIXI.Geometry()
            .addAttribute(
                'aPosition',
                [
                    -screenWidth, -screenHeight,
                    screenWidth, -screenHeight,
                    screenWidth, screenHeight,
                    -screenWidth, screenHeight,
                ]
            ).addIndex([0, 1, 2, 0, 2, 3]);

        const gridMesh = new PIXI.Mesh(gridGeometry, shader);
        gridMesh.position.set(width / 2, height / 2);
        gridMesh.eventMode = 'none';

        return this._viewport.addChild(gridMesh);
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

        this._app.ticker.add((deltaTime) => {
            manager.update(deltaTime);
        });

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
        console.log(this._viewport.screenWidth, this._viewport.screenHeight);
        console.log(this._viewport.worldWidth, this._viewport.worldHeight);
        this._grid.shader.uniforms.uResolution = [this._app.view.width, this._app.view.height];
    };
}
