enum KeyState {
    Down = 1,
    Held = 2,
    Up = 3,
}

export class InputManager {
    private static _instance: InputManager;

    private _inputMap: Map<string, KeyState>;

    public static get instance() {
        if (!InputManager._instance)
            this._instance = new InputManager();

        return this._instance;
    }

    private constructor() {
        this._inputMap = new Map();
        this._addEvents();
    }

    private _addEvents() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('keyup', this._handleKeyUp);
        window.addEventListener('blur', this._handleBlur);
    }

    private _handleKeyDown = (event: KeyboardEvent) => {
        if (!this._inputMap.get(event.key) && this._inputMap.get(event.key) === KeyState.Up)
            this._inputMap.set(event.key, KeyState.Down);
        else this._inputMap.set(event.key, KeyState.Held);
    }

    private _handleKeyUp = (event: KeyboardEvent) => {
        this._inputMap.set(event.key, KeyState.Up);
    }

    private _handleBlur = (_event: FocusEvent) => {
        this._inputMap.clear();
    }

    public isKeyDown(key: string): boolean {
        return this._inputMap.get(key) === KeyState.Down;
    }

    public isKeyHeld(key: string): boolean {
        return this._inputMap.get(key) === KeyState.Held;
    }

    public isKeyUp(key: string): boolean {
        return this._inputMap.get(key) === KeyState.Up;
    }
}