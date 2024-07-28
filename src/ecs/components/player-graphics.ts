import { Graphics } from 'pixi.js';
import { Component } from './component';

export class PlayerGraphics implements Component {
    color: number;
    radius: number;
    graphics: Graphics;

    constructor(color: number, radius: number) {
        this.color = color;
        this.radius = radius;
        this.graphics = new Graphics();
        this.graphics.lineStyle(2, 0xfeeb77, 1);
        this.graphics.beginFill(0x650a5a, 1);
        this.graphics.drawCircle(250, 250, 50);
        this.graphics.endFill();
    }
}