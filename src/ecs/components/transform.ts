import { Vector } from '../../math/vector';
import { Component } from './component';

export class Transform implements Component {
    position: Vector;
    rotation: number;
    scale: number;

    constructor(position: Vector = new Vector(), rotation = 0, scale = 1) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}