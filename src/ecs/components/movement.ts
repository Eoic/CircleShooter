import { Vector } from '../../math/vector';
import { Component } from './component';

export class Movement implements Component {
    speed: number;
    direction: Vector;

    constructor(speed: number = 0) {
        this.speed = speed;
        this.direction = new Vector();
    }
}