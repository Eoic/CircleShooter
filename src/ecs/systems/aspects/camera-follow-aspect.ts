import { Aspect } from './aspect';
import { Viewport } from 'pixi-viewport';

export class CameraFollowSystemAspect extends Aspect {
    readonly viewport: Viewport;

    constructor(viewport: Viewport) {
        super();
        this.viewport = viewport;
    }
}
