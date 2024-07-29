import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { ECSManager } from './ecs/ecs-manager';
import { Movement, PlayerGraphics, Transform } from './ecs/components';
import { WORLD_BACKGROUND_COLOR, WORLD_HEIGHT, WORLD_WIDTH } from './constants';
import { MovementSystem, RendererSystem } from './ecs/systems';
import { RendererSystemAspect } from './ecs/systems/aspects';
import { Vector } from './math/vector';
import { Geometry, Shader } from 'pixi.js';

// Vertex Shader for Grid
const gridVertexShader = `
    precision mediump float;
    attribute vec2 aVertexPosition;
    uniform mat3 projectionMatrix;
    uniform mat3 translationMatrix;

    void main(void) {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
`;

// Fragment Shader for Grid
const gridFragmentShader = `
    precision mediump float;

    vec4 color = vec4(1);
    vec2 pitch  = vec2(50, 50);

    void main() {
        if (int(mod(gl_FragCoord.x, pitch[0])) == 0 ||
            int(mod(gl_FragCoord.y, pitch[1])) == 0) {
            gl_FragColor = color;
        } else {
            gl_FragColor = vec4(0);
        }
    }
`;

// Vertex Shader
const vertexShader = `
    precision mediump float;
    attribute vec2 aVertexPosition;
    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    void main(void) {
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
`;

// Fragment Shader
const fragmentShader = `
    precision mediump float;

    void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red color
    }
`;

export class Scene {
    private readonly _viewport: Viewport;
    private readonly _app: PIXI.Application<HTMLCanvasElement>;
    private readonly _ecsManager: ECSManager;

    private _gridShader: Shader;
    private _gridMesh: PIXI.Mesh<Shader>;

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

        // const geometry = new PIXI.Geometry();
        // const geometry = new PIXI.Geometry()
        //     .addAttribute('aVertexPosition', [
        //         0, -100,   // Top vertex
        //         100, 100,  // Bottom right vertex
        //         -100, 100  // Bottom left vertex
        //     ], 2)
        //     .addIndex([0, 1, 2]);

        // const shader = Shader.from(vertexShader, fragmentShader, {
        //     uColor: [1.0, 1.0, 1.0, 1.0],
        //     uThickness: 0.01,
        //     uGridSize: [50.0, 50.0],
        //     uResolution: [app.view.width, app.view.height],
        //     uOffset: [0, 0],
        //     uZoom: 1.0
        // });

        // const triangle = new PIXI.Mesh(geometry, shader);
        // triangle.position.set(300, 400);

        // viewport.addChild(triangle);


        this._gridShader = Shader.from(gridVertexShader, gridFragmentShader, {
            uColor: [0.2, 1.0, 1.0, 1.0],
            uThickness: 0.1,
            uGridSize: [200.0, 200.0],
            // uResolution: [app.view.width, app.view.height],
            uOffset: [0, 0],
            uZoom: 1.0
        });

        const gridGeometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition', [
                -1, -1,
                1, -1,
                1, 1,
                -1, 1,
            ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);

        const gridMesh = new PIXI.Mesh(gridGeometry, this._gridShader);
        gridMesh.position.set(app.view.width / 2, app.view.height / 2);
        gridMesh.scale.set(app.view.width / 2, app.view.height / 2);

        this._gridMesh = gridMesh;
        viewport.addChild(gridMesh);





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


            const scale = this._viewport.scale.x; // Assuming uniform scaling
            this._gridShader.uniforms.uZoom = scale;
            this._gridShader.uniforms.uOffset = [-this._viewport.left / scale, -this._viewport.top / scale];
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

        this._gridShader.uniforms.uResolution = [this._app.view.width, this._app.view.height];
        this._gridMesh.scale.set(this._app.view.width / 2, this._app.view.height / 2);
    };
}
