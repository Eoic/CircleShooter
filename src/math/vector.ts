export class Vector {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y
    }

    public add(other: Vector): Vector {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    public subtract(other: Vector): Vector {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    }

    public scale(value: number): Vector {
        this.x *= value;
        this.y *= value;

        return this;
    }

    public magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public normalized(): Vector {
        const magnitude = this.magnitude();

        if (magnitude === 0)
            return this.clone();

        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    public clone() {
        return new Vector(this.x, this.y);
    }
}