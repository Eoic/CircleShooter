import { Graphics } from 'pixi.js';
import { Component } from './component';

export class PlayerGraphics implements Component {
    radius: number;
    graphics: Graphics;

    constructor(outerColor: number, innerColor: number, radius: number) {
        this.radius = radius;
        this.graphics = new Graphics();
        this.graphics.lineStyle(radius * 0.45, outerColor, 0.75, 1);
        this.graphics.beginFill(innerColor, 1);
        this.graphics.drawCircle(0, 0, radius);
        this.graphics.endFill();
    }
}
